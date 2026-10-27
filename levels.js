// ========================================================
// 🆙 levels.js - เลเวล (แยกจากยศ) + 🪙 เหรียญ + บัตร x2 + 🎒 กระเป๋า / 🛒 ร้านค้า
// - EXP เลเวลได้จากทุกตา ช่วงแรกขึ้นไว แล้วช้าลงเรื่อยๆ ตันที่ Lv.100
// - ขึ้นเลเวล → ได้ "บัตร EXP ยศ x2" อัตโนมัติ เลเวลละ 1 ใบ
// - เล่นจบตา → ได้เหรียญ / เลื่อนยศ → ได้เหรียญตามขั้นยศ / เลื่อนยศครั้งแรก → ของขวัญผู้เริ่มต้น (บัตรครบ 3 แบบ)
// - เหรียญเอาไปซื้อบัตรในร้านค้า บัตรทุกแบบใช้ได้นาน 1 ชั่วโมง ใช้ซ้อนได้ (เวลาต่อกัน)
// ข้อมูลในเอกสาร users: lvXp, coins, cards { rankX2, levelX2, coinX2 }, boosts { rankUntil, levelUntil, coinUntil }, starterGiven
// ========================================================

window.Levels = (function() {
    const MAX = 100;
    const HOUR = 60 * 60 * 1000;
    const CARDS = {
        // ราคา (เหรียญ): ตาละ ~5 เหรียญ → บัตรยศ ≈ 40 ตา, บัตรเลเวล ≈ 24 ตา, บัตรเหรียญ ≈ 30 ตา
        rankX2:  { icon: '🎖️', name: 'บัตร EXP ยศ x2',    short: 'EXP ยศ x2',    durMs: HOUR, durText: '1 ชั่วโมง', boostKey: 'rankUntil',  tone: 'gold',  price: 200 },
        levelX2: { icon: '📘', name: 'บัตร EXP เลเวล x2', short: 'EXP เลเวล x2', durMs: HOUR, durText: '1 ชั่วโมง', boostKey: 'levelUntil', tone: 'blue',  price: 120 },
        coinX2:  { icon: '🪙', name: 'บัตรเหรียญ x2',     short: 'เหรียญ x2',    durMs: HOUR, durText: '1 ชั่วโมง', boostKey: 'coinUntil',  tone: 'green', price: 150 }
    };
    const TYPES = Object.keys(CARDS);

    // EXP ที่ต้องใช้จากเลเวล L → L+1 (ยากขึ้น 2 เท่าจากเดิม: ตาละ ~330 → Lv.1 ≈ 2.5 ตา, Lv.10 ≈ 6 ตา, Lv.50 ≈ 33 ตา, Lv.99 ≈ 100 ตา)
    const need = L => Math.round(2 * (350 + 45 * L + 1.2 * L * L));
    const CUM = [0, 0];
    for (let L = 1; L < MAX; L++) CUM[L + 1] = CUM[L] + need(L);

    function info(total) {
        total = Math.max(0, Number(total) || 0);
        let level = 1;
        while (level < MAX && total >= CUM[level + 1]) level++;
        if (level >= MAX) return { level: MAX, into: 0, need: 0, pct: 100, isMax: true };
        const into = total - CUM[level], n = need(level);
        return { level, into, need: n, pct: Math.min(100, into / n * 100), isMax: false };
    }
    const startOf = level => CUM[Math.max(1, Math.min(MAX, Math.floor(level) || 1))];

    // EXP เลเวลต่อตา: คำถูก × 5 + เล่นจบได้ 20 + โบนัสความแม่น (≥90% +20, ≥95% +40)
    function xpForRound(correct, acc) {
        if (!(correct > 0)) return 0;
        return correct * 5 + 20 + (acc >= 95 ? 40 : acc >= 90 ? 20 : 0);
    }

    // 🪙 เหรียญต่อตา = คำที่พิมพ์ถูก × %ความแม่น ÷ 10 (ปัดลง) → พิมพ์เยอะแต่มั่วได้น้อย
    // เช่น ถูก 62 คำ แม่น 88% = 62 × 0.88 ÷ 10 = 5 เหรียญ / ถูก 62 คำ แม่น 60% = 3 เหรียญ
    function coinsForRound(correct, acc) {
        if (!(correct > 0) || !(acc > 0)) return 0;
        return Math.floor(correct * (acc / 100) / 10);
    }

    // 🪙 เหรียญตอนเลื่อนยศ (ตามลำดับยศใน stats.js) ยศสูงได้เยอะขึ้น
    function coinsForRank(idx) {
        if (idx <= 4) return 2;      // พลทหาร – สิบเอก
        if (idx <= 19) return 5;     // จ่าสิบตรี – จ่าสิบเอก
        if (idx <= 34) return 10;    // ร้อยตรี – ร้อยเอก
        if (idx <= 49) return 20;    // พันตรี – พันเอก
        if (idx <= 54) return 30;    // พลจัตวา
        if (idx <= 59) return 40;    // พลตรี
        if (idx <= 64) return 50;    // พลโท
        if (idx <= 69) return 60;    // พลเอก
        return 80;                   // จอมพล
    }
    const rankIndex = name => (window.rankData || []).findIndex(r => r.name === name);

    // รางวัลเลื่อนยศตานี้ (ข้ามหลายยศได้เหรียญทุกยศ) + ของขวัญผู้เริ่มต้นตอนพ้น "ทหารฝึก" ครั้งแรก
    function rankRewards(beforeName, afterName, starterGiven) {
        const a = rankIndex(beforeName), b = rankIndex(afterName);
        let coins = 0;
        for (let i = a + 1; i <= b; i++) coins += coinsForRank(i);
        return { coins, ranksGained: Math.max(0, b - a), starter: a === 0 && b >= 1 && !starterGiven };
    }

    // ---------- สถานะผู้เล่น (มาจาก onSnapshot ใน index.html) ----------
    let state = { lvXp: 0, coins: 0, cards: { rankX2: 0, levelX2: 0, coinX2: 0 }, boosts: {}, starterGiven: false };
    let converting = false;
    const $ = id => document.getElementById(id);
    const fmt = n => Number(n || 0).toLocaleString();

    function setState(data) {
        state = {
            lvXp: Number(data.lvXp) || 0,
            coins: Math.max(0, Number(data.coins) || 0),
            cards: Object.fromEntries(TYPES.map(t => [t, Math.max(0, Number(data.cards?.[t]) || 0)])),
            boosts: Object.fromEntries(TYPES.map(t => [CARDS[t].boostKey, Number(data.boosts?.[CARDS[t].boostKey]) || 0])),
            starterGiven: !!data.starterGiven
        };
        // ระบบเก่า "เลือกรางวัลเลเวลอัป" เลิกแล้ว → แปลงรางวัลที่ค้างเป็นบัตร EXP ยศ ให้เลย
        const pending = Number(data.pendingRewards) || 0;
        if (pending > 0 && !converting && window.currentUser) {
            converting = true;
            state.cards.rankX2 += pending;
            write(fs => ({ pendingRewards: 0, cards: { rankX2: fs.increment(pending) } })).catch(() => {}).finally(() => { converting = false; });
        }
        renderProfile();
        renderBag();
    }
    const getState = () => state;

    // บัตรมีผลกับตานี้ไหม (เปิดอยู่ช่วงไหนของตาก็นับ)
    function cardMult(type, roundStart) {
        return (state.boosts[CARDS[type].boostKey] || 0) > roundStart ? 2 : 1;
    }

    function fmtLeft(ms) {
        const s = Math.max(0, Math.ceil(ms / 1000));
        const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
        return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
    }

    // ---------- เขียนลง Firebase ----------
    async function write(fields) {
        if (!window.currentUser) throw new Error('ยังไม่ได้ล็อกอิน');
        const db = await window.getFirebaseDB();
        const fs = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        await fs.setDoc(fs.doc(db, "users", window.currentUser), fields(fs), { merge: true });
    }

    // 🛒 ซื้อบัตรด้วยเหรียญ
    async function buy(type) {
        const c = CARDS[type];
        if (!c) return;
        if (state.coins < c.price) return toast(`🪙 เหรียญไม่พอ ต้องใช้ ${c.price} เหรียญ`);
        state.coins -= c.price; state.cards[type]++;
        renderProfile(); renderBag();
        try {
            await write(fs => ({ coins: fs.increment(-c.price), cards: { [type]: fs.increment(1) } }));
            toast(`${c.icon} ซื้อ ${c.name} แล้ว! (-${c.price} 🪙)`);
        } catch (err) {
            state.coins += c.price; state.cards[type]--;
            renderProfile(); renderBag();
            toast('❌ ซื้อไม่สำเร็จ ลองใหม่อีกที');
        }
    }

    // ใช้บัตร: ถ้ามีบัตรแบบเดียวกันเปิดอยู่ เวลาต่อจากของเดิม
    async function use(type) {
        const c = CARDS[type];
        if (!c || state.cards[type] <= 0) return;
        const now = Date.now();
        const until = Math.max(now, state.boosts[c.boostKey] || 0) + c.durMs;
        const prevUntil = state.boosts[c.boostKey];
        state.cards[type]--; state.boosts[c.boostKey] = until;
        renderProfile(); renderBag();
        try {
            await write(fs => ({ cards: { [type]: fs.increment(-1) }, boosts: { [c.boostKey]: until } }));
            toast(`${c.icon} เปิด ${c.short} แล้ว! ใช้ได้ถึง ${new Date(until).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`);
        } catch (err) {
            state.cards[type]++; state.boosts[c.boostKey] = prevUntil;
            renderProfile(); renderBag();
            toast('❌ ใช้บัตรไม่สำเร็จ ลองใหม่อีกที');
        }
    }

    // ---------- การ์ดโปรไฟล์: เลเวล + เหรียญ + บัตรที่เปิดอยู่ ----------
    function renderProfile() {
        const i = info(state.lvXp);
        if ($('lvBadge')) $('lvBadge').textContent = 'Lv.' + i.level;
        if ($('lvFill')) $('lvFill').style.width = i.pct + '%';
        if ($('coinBalance')) $('coinBalance').textContent = '🪙 ' + fmt(state.coins);
        renderBoostChips();
        // ตัวเลขบนปุ่ม 🎒 = จำนวนบัตรทั้งหมดที่มี
        const n = TYPES.reduce((a, t) => a + state.cards[t], 0);
        ['bagDot', 'bagBadge', 'rsBagBadge'].forEach(id => {
            const el = $(id);
            if (!el) return;
            el.hidden = !n;
            el.textContent = n;
        });
    }

    function renderBoostChips() {
        const box = $('boostChips');
        if (!box) return;
        const now = Date.now();
        const html = TYPES.map(t => [t, CARDS[t]]).filter(([, c]) => (state.boosts[c.boostKey] || 0) > now)
            .map(([, c]) => `<span class="boost-chip ${c.tone}" title="${c.name}">${c.icon} ${c.short} <b>${fmtLeft(state.boosts[c.boostKey] - now)}</b></span>`).join('');
        if (box.innerHTML !== html) box.innerHTML = html;
        box.hidden = !html;
    }

    // ---------- 🎒 กระเป๋า / 🛒 ร้านค้า ----------
    let bagTab = 'bag';
    function ensureBag() {
        if ($('bagModal')) return;
        document.body.insertAdjacentHTML('beforeend', `<div class="modal-overlay" id="bagModal" style="z-index: 10006;">
            <div class="modal-card bag-card">
                <span class="close-modal-x" onclick="closeModal('bagModal')">×</span>
                <div class="bag-head">
                    <div class="bag-tabs"><button type="button" data-tab="bag">🎒 กระเป๋า</button><button type="button" data-tab="shop">🛒 ร้านค้า</button></div>
                    <span class="bag-coins" id="bagCoins">🪙 0</span>
                </div>
                <div id="bagBody"></div>
            </div></div>`);
        $('bagModal').addEventListener('click', e => {
            if (e.target.id === 'bagModal') return window.closeModal('bagModal');
            const tab = e.target.closest('[data-tab]');
            if (tab) { bagTab = tab.dataset.tab; renderBag(); }
        });
    }

    function renderBag() {
        const body = $('bagBody');
        if (!body || $('bagModal').style.display !== 'flex') return;
        const now = Date.now(), i = info(state.lvXp);
        $('bagCoins').textContent = '🪙 ' + fmt(state.coins);
        document.querySelectorAll('#bagModal [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === bagTab));

        if (bagTab === 'shop') {
            body.innerHTML = `<div class="bag-list">${TYPES.map(t => {
                const c = CARDS[t], can = state.coins >= c.price;
                return `<div class="bag-row ${c.tone}">
                    <div class="bag-row-icon">${c.icon}</div>
                    <div class="bag-row-body"><b>${c.name}</b><small>นาน ${c.durText} • มีอยู่ ${state.cards[t]} ใบ</small></div>
                    <button type="button" class="bag-buy" data-buy="${t}" ${can ? '' : 'disabled'}>🪙 ${c.price}</button>
                </div>`;
            }).join('')}</div>`;
            return;
        }

        const owned = TYPES.filter(t => state.cards[t] > 0 || (state.boosts[CARDS[t].boostKey] || 0) > now);
        body.innerHTML = `
            <div class="bag-lv"><span class="lv-badge">Lv.${i.level}</span><div class="lv-bar mini"><div class="lv-fill" style="width:${i.pct}%"></div></div>${i.isMax ? '<small>ตันแล้ว 🏆</small>' : ''}</div>
            ${owned.length ? `<div class="bag-list">${owned.map(t => {
                const c = CARDS[t], until = state.boosts[c.boostKey] || 0, active = until > now, n = state.cards[t];
                return `<div class="bag-row ${c.tone} ${active ? 'active' : ''}">
                    <div class="bag-row-icon">${c.icon}</div>
                    <div class="bag-row-body"><b>${c.name}</b><small>${active ? `🔥 ใช้อยู่ เหลือ <span data-left="${until}">${fmtLeft(until - now)}</span>` : `นาน ${c.durText}`}</small></div>
                    <span class="bag-row-qty">x${n}</span>
                    <button type="button" class="bag-use" data-use="${t}" ${n > 0 ? '' : 'disabled'}>${active && n > 0 ? 'ต่อเวลา' : 'ใช้'}</button>
                </div>`;
            }).join('')}</div>`
            : `<div class="bag-empty">ยังไม่มีบัตรเลย<br><small>ขึ้นเลเวลได้บัตร EXP ยศ x2 ฟรี หรือไปซื้อที่ 🛒 ร้านค้า</small></div>`}
            <p class="bag-note">บัตรใช้ซ้อนได้ เวลาต่อกัน • บัตร EXP ยศ x2 คูณทับตัวคูณและอีเวนต์</p>`;
    }

    function openBag(tab) {
        ensureBag();
        if (tab) bagTab = tab;
        $('bagModal').style.display = 'flex';
        renderBag();
    }

    document.addEventListener('click', e => {
        const u = e.target.closest('[data-use]');
        if (u) { u.disabled = true; use(u.dataset.use); }
        const b = e.target.closest('[data-buy]');
        if (b) { b.disabled = true; buy(b.dataset.buy); }
    });

    // ---------- แจ้งเตือนเล็กๆ + พลุ ----------
    function toast(msg) {
        let box = $('lvToasts');
        if (!box) { document.body.insertAdjacentHTML('beforeend', '<div id="lvToasts" class="lv-toasts"></div>'); box = $('lvToasts'); }
        const el = document.createElement('div');
        el.className = 'lv-toast';
        el.textContent = msg;
        box.append(el);
        setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3200);
    }

    function confetti(n = 70) {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const layer = document.createElement('div');
        layer.className = 'confetti-layer';
        const colors = ['#fbbf24', '#38bdf8', '#22c55e', '#f472b6', '#a78bfa', '#fb923c'];
        for (let k = 0; k < n; k++) {
            const p = document.createElement('i');
            p.style.left = Math.random() * 100 + 'vw';
            p.style.background = colors[k % colors.length];
            p.style.animationDelay = Math.random() * 0.4 + 's';
            p.style.animationDuration = 1.8 + Math.random() * 1.4 + 's';
            p.style.setProperty('--dx', (Math.random() * 2 - 1) * 120 + 'px');
            p.style.setProperty('--rot', Math.random() * 720 + 'deg');
            layer.append(p);
        }
        document.body.append(layer);
        setTimeout(() => layer.remove(), 3600);
    }

    // นับถอยหลังบัตรที่เปิดอยู่
    setInterval(() => {
        renderBoostChips();
        const now = Date.now();
        document.querySelectorAll('[data-left]').forEach(el => { el.textContent = fmtLeft(Number(el.dataset.left) - now); });
    }, 1000);

    return { MAX, CARDS, need, info, startOf, xpForRound, coinsForRound, coinsForRank, rankRewards, setState, getState, cardMult, buy, use, openBag, renderProfile, confetti, toast };
})();
