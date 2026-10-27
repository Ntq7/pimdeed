// ========================================================
// 🎮 liveops.js - อีเวนต์ทั้งเซิร์ฟ (EXP บูสต์ / ประกาศ) ที่แอดมินตั้งจากหน้าหลังบ้าน
// ฟัง server/live แบบสด แล้วโชว์ 3 แบบ:
//   1) แถบประกาศบนหน้าเกม: ค้างไว้จนหมดเวลาที่แอดมินตั้ง (ผู้เล่นกด ✕ ซ่อนเองได้)
//   2) 🔔 กระดิ่ง: เปิดดูประกาศ/อีเวนต์ทั้งหมดที่ยังไม่หมดเวลา มีตัวเลขบอกอันที่ยังไม่อ่าน
//   3) แจ้งเตือนมุมจอ: บอกว่ามีของใหม่ แล้วหายเอง
// กติกา: ไม่บัง ไม่ขโมยโฟกัสช่องพิมพ์ และระหว่างพิมพ์ แถบจะไม่เพิ่ม/ลดบรรทัด (หน้าไม่ขยับ)
//        แจ้งเตือนมุมจอเก็บไว้โชว์หลังจบตา
// ========================================================

window.LiveOps = (function() {
    let events = [];
    let stripSig = '';
    const queue = [];
    const timers = new Map();   // id → timeouts ของ "ใกล้เริ่ม" / "เริ่มแล้ว" / "จบแล้ว"
    const MIN = 60 * 1000;
    const LEVEL_ICON = { info: '📢', good: '🎉', warn: '⚠️' };
    const LEVEL_ORDER = { warn: 0, good: 1, info: 2 };

    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const typing = () => typeof window.isRoundActive === 'function' && window.isRoundActive();
    const $ = id => document.getElementById(id);

    // จำในเครื่อง: แจ้งเตือนที่เห็นแล้ว (ต่อแท็บ) / ประกาศที่กดซ่อน / อันที่อ่านแล้ว
    function load(store, key) { try { return JSON.parse(store.getItem(key) || '{}'); } catch (e) { return {}; } }
    function save(store, key, val) { try { store.setItem(key, JSON.stringify(val)); } catch (e) {} }
    const seen = () => load(sessionStorage, 'liveopsSeen');
    const markSeen = k => { const s = seen(); s[k] = 1; save(sessionStorage, 'liveopsSeen', s); };
    const dismissed = () => load(localStorage, 'liveopsDismissed');
    const readIds = () => load(localStorage, 'liveopsRead');

    function fmtDur(ms) {
        const s = Math.max(0, Math.ceil(ms / 1000));
        const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
        return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
    }
    const fmtLen = ms => { const m = Math.round(ms / MIN); return m >= 60 ? (m % 60 ? `${Math.floor(m / 60)} ชม. ${m % 60} นาที` : `${m / 60} ชั่วโมง`) : `${m} นาที`; };
    const fmtTime = ts => new Date(ts).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // ---------- คิดบูสต์ ----------
    function factorAt(ts) {
        return events.filter(e => e.type === 'boost' && e.startAt <= ts && ts < e.endAt)
            .reduce((max, e) => Math.max(max, Number(e.factor) || 1), 1);
    }
    // ตาที่คาบเกี่ยวช่วงอีเวนต์ได้บูสต์ตัวที่สูงสุด
    function boostFor(startTs, endTs) {
        return events.filter(e => e.type === 'boost' && e.startAt < endTs && startTs < e.endAt)
            .reduce((max, e) => Math.max(max, Number(e.factor) || 1), 1);
    }

    // ---------- ของที่ยังไม่หมดเวลา ----------
    function activeAnnouncements(now = Date.now()) {
        return events.filter(e => e.type === 'announce' && e.startAt <= now && now < e.endAt)
            .sort((a, b) => (LEVEL_ORDER[a.level] ?? 3) - (LEVEL_ORDER[b.level] ?? 3) || b.startAt - a.startAt);
    }
    function activeBoosts(now = Date.now()) {
        return events.filter(e => e.type === 'boost' && e.endAt > now).sort((a, b) => a.startAt - b.startAt);
    }

    // ---------- สร้างหน้าตา ----------
    function ensureUi() {
        if (!$('liveopsToasts')) document.body.insertAdjacentHTML('beforeend', `<div id="liveopsToasts" class="liveops-toasts" aria-live="polite"></div>`);

        if (!$('liveopsStrip')) {
            const strip = document.createElement('div');
            strip.id = 'liveopsStrip';
            strip.className = 'lo-strip';
            const main = $('gameMain');
            if (main) main.prepend(strip); else document.body.prepend(strip);
            strip.addEventListener('click', e => {
                if (e.target.closest('[data-open-panel]')) { e.stopPropagation(); return togglePanel(true); }
                const btn = e.target.closest('[data-dismiss]');
                if (!btn) return;
                const d = dismissed(); d[btn.dataset.dismiss] = 1; save(localStorage, 'liveopsDismissed', d);
                renderStrip(true);
            });
            strip.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); }); // ไม่ดึงโฟกัสออกจากช่องพิมพ์
        }

        const actions = document.querySelector('.top-actions');
        if (actions && !$('loBell')) {
            const bell = document.createElement('button');
            bell.id = 'loBell';
            bell.className = 'btn-top lo-bell';
            bell.type = 'button';
            bell.setAttribute('aria-label', 'การแจ้งเตือน');
            bell.innerHTML = '🔔<span class="lo-badge" id="loBadge" hidden></span>';
            bell.addEventListener('click', e => { e.stopPropagation(); togglePanel(); });
            actions.insertBefore(bell, actions.querySelector('.menu-container'));
        }

        if (!$('loPanel')) {
            document.body.insertAdjacentHTML('beforeend', `<div id="loPanel" class="lo-panel" hidden role="dialog" aria-label="การแจ้งเตือน">
                <div class="lo-panel-head"><b>🔔 การแจ้งเตือน</b><button type="button" class="lo-panel-close" aria-label="ปิด">✕</button></div>
                <div class="lo-panel-list" id="loPanelList"></div></div>`);
            $('loPanel').querySelector('.lo-panel-close').addEventListener('click', () => togglePanel(false));
            document.addEventListener('click', e => {
                if (!$('loPanel').hidden && !e.target.closest('#loPanel, #loBell')) togglePanel(false);
            });
            document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePanel(false); });
        }
    }

    // ---------- 1) แถบประกาศ + แถบบูสต์ ----------
    function renderStrip(force) {
        ensureUi();
        const strip = $('liveopsStrip');
        const now = Date.now();
        const hidden = dismissed();
        const items = [];

        const boosts = activeBoosts(now);
        const live = boosts.filter(e => e.startAt <= now).sort((a, b) => b.factor - a.factor)[0];
        const next = boosts.find(e => e.startAt > now);
        const boost = live || next;
        if (boost) {
            const isLive = boost === live;
            items.push({
                key: boost.id + (isLive ? ':L' : ':S'),
                html: `<div class="lo-boost ${isLive ? 'is-live' : ''}">
                    ${isLive ? '<span class="lb-pulse"></span>🔥' : '⚡'}
                    <span><b>EXP x${esc(boost.factor)}</b> ทั้งเซิร์ฟ</span>
                    <span class="lo-dot">•</span>
                    <span>${isLive ? 'เหลือ' : 'เริ่มในอีก'} <b class="lo-count" data-until="${isLive ? boost.endAt : boost.startAt}">${fmtDur((isLive ? boost.endAt : boost.startAt) - now)}</b></span>
                    ${boost.message ? `<span class="lo-boost-msg">${esc(boost.message)}</span>` : ''}
                </div>`
            });
        }

        // มือถือโชว์แค่อันสำคัญสุด 1 อัน (ไม่ดันโซนพิมพ์ตกจอ) ที่เหลือรวมเป็นบรรทัดเดียวให้กดดูที่ 🔔
        const shownMax = window.innerWidth <= 600 ? 1 : 3;
        const visible = activeAnnouncements(now).filter(e => !hidden[e.id]);
        visible.slice(0, shownMax).forEach(e => {
            const level = LEVEL_ICON[e.level] ? e.level : 'info';
            items.push({
                key: e.id,
                html: `<div class="lo-card lo-${level}" role="status">
                    <div class="lo-card-icon">${LEVEL_ICON[level]}</div>
                    <div class="lo-card-body">
                        <div class="lo-card-label">${level === 'warn' ? 'ประกาศสำคัญ' : level === 'good' ? 'ข่าวดีจากแอดมิน' : 'ประกาศจากแอดมิน'} • ถึง ${fmtTime(e.endAt)} น.</div>
                        <div class="lo-card-msg">${esc(e.message)}</div>
                    </div>
                    <button type="button" class="lo-card-close" data-dismiss="${esc(e.id)}" aria-label="ซ่อนประกาศนี้" title="ซ่อน (ดูย้อนหลังได้ที่ 🔔)">✕</button>
                </div>`
            });
        });

        if (visible.length > shownMax) {
            const more = visible.length - shownMax;
            items.push({ key: 'more' + more, html: `<button type="button" class="lo-more" data-open-panel>📢 อีก ${more} ประกาศ • แตะเพื่อดูทั้งหมด</button>` });
        }

        const sig = items.map(i => i.key).join('|');
        // ระหว่างพิมพ์ห้ามเพิ่ม/ลดบรรทัด (หน้าจะขยับ) → รอจบตาค่อยวาดใหม่ แต่เลขนับถอยหลังยังเดินปกติ
        if (sig !== stripSig && (force || !typing())) {
            strip.innerHTML = items.map(i => i.html).join('');
            strip.hidden = !items.length;
            stripSig = sig;
        }
        strip.querySelectorAll('[data-until]').forEach(el => {
            const t = fmtDur(Number(el.dataset.until) - now);
            if (el.textContent !== t) el.textContent = t;
        });
    }

    // ---------- 2) กระดิ่ง + รายการแจ้งเตือน ----------
    function panelItems(now = Date.now()) {
        const list = activeBoosts(now).map(e => ({
            id: e.id, icon: e.startAt <= now ? '🔥' : '⚡',
            title: `EXP x${e.factor} ทั้งเซิร์ฟ`,
            meta: e.startAt <= now ? `กำลังทำงาน • เหลือ <b data-until="${e.endAt}">${fmtDur(e.endAt - now)}</b>` : `เริ่มในอีก <b data-until="${e.startAt}">${fmtDur(e.startAt - now)}</b> • นาน ${fmtLen(e.endAt - e.startAt)}`,
            text: e.message, tone: 'boost', at: e.startAt
        }));
        activeAnnouncements(now).forEach(e => list.push({
            id: e.id, icon: LEVEL_ICON[e.level] || '📢',
            title: e.level === 'warn' ? 'ประกาศสำคัญ' : e.level === 'good' ? 'ข่าวดีจากแอดมิน' : 'ประกาศจากแอดมิน',
            meta: `ประกาศ ${fmtTime(e.startAt)} น. • ถึง ${fmtTime(e.endAt)} น.`,
            text: e.message, tone: e.level || 'info', at: e.startAt
        }));
        return list.sort((a, b) => b.at - a.at);
    }

    function renderBell() {
        const badge = $('loBadge');
        if (!badge) return;
        const read = readIds();
        const unread = panelItems().filter(i => !read[i.id]).length;
        badge.hidden = !unread;
        badge.textContent = unread > 9 ? '9+' : unread;
        $('loBell').classList.toggle('has-unread', unread > 0);
    }

    function renderPanel() {
        const list = $('loPanelList');
        if (!list || $('loPanel').hidden) return;
        const items = panelItems();
        list.innerHTML = items.length ? items.map(i => `<div class="lo-item lo-item-${i.tone}">
                <div class="lo-item-icon">${i.icon}</div>
                <div class="lo-item-body"><b>${esc(i.title)}</b>${i.text ? `<p>${esc(i.text)}</p>` : ''}<small>${i.meta}</small></div>
            </div>`).join('')
            : '<div class="lo-empty">ยังไม่มีประกาศหรืออีเวนต์ตอนนี้</div>';
    }

    function togglePanel(open) {
        const panel = $('loPanel');
        if (!panel) return;
        panel.hidden = open === undefined ? !panel.hidden : !open;
        if (!panel.hidden) {
            // เปิดดูแล้ว = อ่านแล้วทั้งหมด
            const read = readIds();
            panelItems().forEach(i => { read[i.id] = 1; });
            save(localStorage, 'liveopsRead', read);
            renderPanel();
            renderBell();
        }
    }

    // ---------- 3) แจ้งเตือนมุมจอ ----------
    function notify(key, icon, title, text, tone) {
        if (key && seen()[key]) return;
        if (key) markSeen(key);
        const item = { icon, title, text, tone };
        if (typing()) queue.push(item); else show(item);
    }

    function show({ icon, title, text, tone }) {
        ensureUi();
        const box = $('liveopsToasts');
        const el = document.createElement('div');
        el.className = 'liveops-toast ' + (tone || '');
        el.innerHTML = `<div class="lt-icon">${icon}</div><div class="lt-body"><b>${esc(title)}</b>${text ? `<span>${esc(text)}</span>` : ''}</div><button class="lt-close" aria-label="ปิด" tabindex="-1">✕</button>`;
        el.querySelector('.lt-close').addEventListener('mousedown', e => e.preventDefault());
        el.querySelector('.lt-close').addEventListener('click', () => dismissToast(el));
        box.prepend(el);
        while (box.children.length > 3) box.lastElementChild.remove();
        setTimeout(() => dismissToast(el), 6000);
    }
    function dismissToast(el) {
        if (!el.isConnected) return;
        el.classList.add('out');
        setTimeout(() => el.remove(), 250);
    }

    function onRoundEnd() {
        // วาดแถบที่รอไว้ แล้วค่อยโชว์แจ้งเตือนที่ค้างไว้ระหว่างพิมพ์ (เว้นนิดให้หน้าสรุปผลขึ้นก่อน)
        renderStrip(true);
        setTimeout(() => { while (queue.length) show(queue.shift()); }, 600);
    }

    // ---------- ตั้งเวลาแจ้งเตือนตามอีเวนต์ ----------
    function schedule(e) {
        (timers.get(e.id) || []).forEach(clearTimeout);
        const now = Date.now(), list = [];
        const at = (ts, fn) => { if (ts > now && ts - now < 2 ** 31 - 1) list.push(setTimeout(fn, ts - now)); };

        if (e.type === 'boost') {
            const len = fmtLen(e.endAt - e.startAt);
            const label = `EXP x${e.factor} ทั้งเซิร์ฟ`;
            if (e.startAt > now) {
                notify(`${e.id}:new`, '⚡', `${label} มาแล้ว!`, `เริ่ม ${fmtTime(e.startAt)} น. • นาน ${len}${e.message ? ' • ' + e.message : ''}`, 'boost');
                at(e.startAt - MIN, () => notify(`${e.id}:1m`, '⏰', `อีก 1 นาที ${label} เริ่ม!`, 'เตรียมตัวพิมพ์ให้พร้อม', 'boost'));
            }
            at(e.startAt, () => { notify(`${e.id}:start`, '🔥', `${label} เริ่มแล้ว!`, `นาน ${len} • พิมพ์ตอนนี้ได้ EXP x${e.factor}`, 'boost'); renderAll(); });
            if (e.startAt <= now && now < e.endAt) notify(`${e.id}:start`, '🔥', `${label} กำลังทำงาน!`, `เหลืออีก ${fmtLen(e.endAt - now)}${e.message ? ' • ' + e.message : ''}`, 'boost');
            at(e.endAt, () => { notify(`${e.id}:end`, '🏁', `อีเวนต์ ${label} จบแล้ว`, 'ขอบคุณที่มาร่วมพิมพ์', ''); renderAll(); });
            // แอดมินกดหยุดกลางคัน (เวลาจบถูกเลื่อนมาเป็นตอนนี้) → แจ้งว่าจบ เฉพาะคนที่เคยเห็นว่าเริ่มแล้ว
            if (e.endAt <= now && seen()[`${e.id}:start`]) notify(`${e.id}:end`, '🏁', `อีเวนต์ ${label} จบแล้ว`, 'ขอบคุณที่มาร่วมพิมพ์', '');
        } else if (e.type === 'announce') {
            const tone = e.level === 'warn' ? 'warn' : e.level === 'good' ? 'good' : '';
            if (e.startAt <= now && now < e.endAt) notify(`${e.id}:show`, LEVEL_ICON[e.level] || '📢', 'มีประกาศใหม่จากแอดมิน', e.message, tone);
            at(e.startAt, () => { notify(`${e.id}:show`, LEVEL_ICON[e.level] || '📢', 'มีประกาศใหม่จากแอดมิน', e.message, tone); renderAll(); });
            at(e.endAt, renderAll); // หมดเวลาแล้วแถบประกาศหายเอง
        }
        timers.set(e.id, list);
    }

    function renderAll() { renderStrip(false); renderBell(); renderPanel(); }

    // ทุกวินาที: เดินเลขนับถอยหลัง (แถบ + รายการในกระดิ่ง) โดยไม่วาดรายการใหม่ทั้งก้อน
    function tick() {
        renderStrip(false);
        renderBell();
        const now = Date.now();
        document.querySelectorAll('#loPanelList [data-until]').forEach(el => {
            const t = fmtDur(Number(el.dataset.until) - now);
            if (el.textContent !== t) el.textContent = t;
        });
    }

    function setEvents(list) {
        const now = Date.now();
        events = list.filter(e => e && e.endAt > now - MIN);
        const ids = new Set(events.map(e => e.id));
        for (const [id, t] of timers) if (!ids.has(id)) { t.forEach(clearTimeout); timers.delete(id); }
        // ล้างความจำของประกาศที่หมดไปแล้ว ไม่ให้ค้างในเครื่อง
        ['liveopsDismissed', 'liveopsRead'].forEach(key => {
            const m = load(localStorage, key), kept = {};
            Object.keys(m).forEach(id => { if (ids.has(id)) kept[id] = 1; });
            save(localStorage, key, kept);
        });
        events.forEach(schedule);
        renderAll();
    }

    // ---------- เชื่อม Firebase ----------
    async function start() {
        ensureUi();
        setInterval(tick, 1000);
        if (window.LIVEOPS_OFFLINE) return;
        try {
            const dbInstance = await window.getFirebaseDB();
            const { doc, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            onSnapshot(doc(dbInstance, "server", "live"),
                snap => setEvents(snap.exists() && Array.isArray(snap.data().events) ? snap.data().events : []),
                err => console.warn("ฟังอีเวนต์เซิร์ฟไม่ได้:", err.code || err));
        } catch (err) { console.warn("เริ่มระบบอีเวนต์ไม่ได้:", err); }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    return { boostFor, factorAt, onRoundEnd, setEvents };
})();
