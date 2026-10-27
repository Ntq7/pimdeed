// ========================================================
// 📈 stats.js - ระบบยศ, EXP และข้อความด่า
// ========================================================

window.rankData = [
    { exp: 0, name: "ทหารฝึก" }, { exp: 1000, name: "พลทหาร" }, { exp: 2056, name: "สิบตรี" }, { exp: 3667, name: "สิบโท" }, { exp: 4339, name: "สิบเอก" },
    { exp: 6078, name: "จ่าสิบตรี ชั้น 1" }, { exp: 7591, name: "จ่าสิบตรี ชั้น 2" }, { exp: 8586, name: "จ่าสิบตรี ชั้น 3" }, { exp: 9570, name: "จ่าสิบตรี ชั้น 4" }, { exp: 10853, name: "จ่าสิบตรี ชั้น 5" },
    { exp: 11843, name: "จ่าสิบโท ชั้น 1" }, { exp: 13053, name: "จ่าสิบโท ชั้น 2" }, { exp: 14094, name: "จ่าสิบโท ชั้น 3" }, { exp: 15379, name: "จ่าสิบโท ชั้น 4" }, { exp: 17122, name: "จ่าสิบโท ชั้น 5" },
    { exp: 19040, name: "จ่าสิบเอก ชั้น 1" }, { exp: 21150, name: "จ่าสิบเอก ชั้น 2" }, { exp: 23470, name: "จ่าสิบเอก ชั้น 3" }, { exp: 26023, name: "จ่าสิบเอก ชั้น 4" }, { exp: 28830, name: "จ่าสิบเอก ชั้น 5" },
    { exp: 31919, name: "ร้อยตรี ชั้น 1" }, { exp: 35316, name: "ร้อยตรี ชั้น 2" }, { exp: 39393, name: "ร้อยตรี ชั้น 3" }, { exp: 44285, name: "ร้อยตรี ชั้น 4" }, { exp: 50156, name: "ร้อยตรี ชั้น 5" },
    { exp: 57201, name: "ร้อยโท ชั้น 1" }, { exp: 65655, name: "ร้อยโท ชั้น 2" }, { exp: 75799, name: "ร้อยโท ชั้น 3" }, { exp: 87973, name: "ร้อยโท ชั้น 4" }, { exp: 102581, name: "ร้อยโท ชั้น 5" },
    { exp: 120111, name: "ร้อยเอก ชั้น 1" }, { exp: 141146, name: "ร้อยเอก ชั้น 2" }, { exp: 166389, name: "ร้อยเอก ชั้น 3" }, { exp: 196681, name: "ร้อยเอก ชั้น 4" }, { exp: 223030, name: "ร้อยเอก ชั้น 5" },
    { exp: 256650, name: "พันตรี ชั้น 1" }, { exp: 298994, name: "พันตรี ชั้น 2" }, { exp: 321806, name: "พันตรี ชั้น 3" }, { exp: 357181, name: "พันตรี ชั้น 4" }, { exp: 387631, name: "พันตรี ชั้น 5" },
    { exp: 426170, name: "พันโท ชั้น 1" }, { exp: 466418, name: "พันโท ชั้น 2" }, { exp: 513715, name: "พันโท ชั้น 3" }, { exp: 555272, name: "พันโท ชั้น 4" }, { exp: 595640, name: "พันโท ชั้น 5" },
    { exp: 635421, name: "พันเอก ชั้น 1" }, { exp: 689519, name: "พันเอก ชั้น 2" }, { exp: 728437, name: "พันเอก ชั้น 3" }, { exp: 758138, name: "พันเอก ชั้น 4" }, { exp: 790179, name: "พันเอก ชั้น 5" },
    { exp: 847229, name: "พลจัตวา ชั้น 1" }, { exp: 900000, name: "พลจัตวา ชั้น 2" }, { exp: 960005, name: "พลจัตวา ชั้น 3" }, { exp: 1020000, name: "พลจัตวา ชั้น 4" }, { exp: 1076545, name: "พลจัตวา ชั้น 5" },
    { exp: 1150000, name: "พลตรี ชั้น 1" }, { exp: 1210000, name: "พลตรี ชั้น 2" }, { exp: 1280000, name: "พลตรี ชั้น 3" }, { exp: 1360000, name: "พลตรี ชั้น 4" }, { exp: 1420000, name: "พลตรี ชั้น 5" },
    { exp: 1485000, name: "พลโท ชั้น 1" }, { exp: 1565233, name: "พลโท ชั้น 2" }, { exp: 1647293, name: "พลโท ชั้น 3" }, { exp: 1720060, name: "พลโท ชั้น 4" }, { exp: 1800050, name: "พลโท ชั้น 5" },
    { exp: 1890612, name: "พลเอก ชั้น 1" }, { exp: 1985748, name: "พลเอก ชั้น 2" }, { exp: 2063398, name: "พลเอก ชั้น 3" }, { exp: 2099815, name: "พลเอก ชั้น 4" }, { exp: 2185665, name: "พลเอก ชั้น 5" },
    { exp: 2299999, name: "จอมพล ชั้น 1" }, { exp: 2399999, name: "จอมพล ชั้น 2" }, { exp: 2499999, name: "จอมพล ชั้น 3" }, { exp: 2599999, name: "จอมพล ชั้น 4" }, { exp: 2799999, name: "จอมพล ชั้น 5" }
];

window.getRankInfo = function(exp) {
    let currentRank = window.rankData[0];
    let nextRank = window.rankData[1];
    for (let i = 0; i < window.rankData.length; i++) {
        if (exp >= window.rankData[i].exp) {
            currentRank = window.rankData[i];
            nextRank = window.rankData[i + 1] ? window.rankData[i + 1] : window.rankData[i];
        } else { break; }
    }
    return { current: currentRank, next: nextRank };
}

// ========================================================
// 🎖️ รูปยศวาดด้วยโค้ด (SVG) ครบ 75 ยศ ไม่ต้องใช้ไฟล์รูป / ไม่พึ่งเว็บฝากรูป
// แต่ละหมวดมีทรง+สีของตัวเอง, ขั้นในหมวดดูจากบั้ง/ดาว, "ชั้น 1-5" ดูจากจุดเล็กด้านล่าง
//   ทหารฝึก/พลทหาร = โล่เทา/ทองแดง     สิบ = โล่ส้มทอง + บั้ง 1-3
//   จ่า = โล่เขียว + บั้ง + โค้ง       ร้อย = หกเหลี่ยมน้ำเงิน + ดาว 1-3
//   พัน = หกเหลี่ยมม่วง + ช่อชัยพฤกษ์ + ดาว   นายพล = เหรียญแดงขอบทอง + ดาบไขว้ + ดาว 1-4
//   จอมพล = เหรียญทองมีรัศมี + มงกุฎ + ดาวทองดวงใหญ่
// ========================================================
window.RankArt = (function() {
    const PAL = {
        recruit: { a: '#a3aec2', b: '#3b4658', ink: '#eef2f7', edge: '#161c26' },
        private: { a: '#d0935a', b: '#5b3415', ink: '#fff0db', edge: '#2e1607' },
        nco:     { a: '#fbbf24', b: '#9a3412', ink: '#fffbeb', edge: '#3b1205' },
        wo:      { a: '#34d399', b: '#064e3b', ink: '#ecfdf5', edge: '#022c22' },
        lt:      { a: '#60a5fa', b: '#1e3a8a', ink: '#f8fafc', edge: '#0a1633' },
        col:     { a: '#c084fc', b: '#3b0764', ink: '#fde047', edge: '#1a0533' },
        gen:     { a: '#ef4444', b: '#5f0b0b', ink: '#fde047', edge: '#240303', ring: '#fbbf24' },
        marshal: { a: '#fff3b0', b: '#b45309', ink: '#7f1d1d', edge: '#3b1d06', ring: '#fde047' }
    };
    const SHIELD = 'M32 3 L57 11 V29 C57 45 46 56 32 61 C18 56 7 45 7 29 V11 Z';
    const HEX = 'M32 2 L58 16 V48 L32 62 L6 48 V16 Z';

    const grad = p => `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.a}"/><stop offset="1" stop-color="${p.b}"/></linearGradient></defs>`;
    // ตัวป้าย + เส้นเงาขาวด้านใน ให้ดูนูน
    const plate = (d, p) => `<path d="${d}" fill="url(#g)" stroke="${p.edge}" stroke-width="3" stroke-linejoin="round"/>
        <path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" transform="translate(32 32) scale(.84) translate(-32 -32)"/>`;
    const disc = (r, p, cy = 32) => `<circle cx="32" cy="${cy}" r="${r}" fill="url(#g)" stroke="${p.edge}" stroke-width="3"/>
        <circle cx="32" cy="${cy}" r="${r - 4}" fill="none" stroke="${p.ring}" stroke-width="2.5"/>`;

    // ลายเส้นหนาขอบเข้ม (วาดเส้นเข้มก่อนแล้วทับด้วยสี จะได้เห็นชัดแม้รูปเล็ก)
    const bold = (d, p, color, w = 5) => `<path d="${d}" fill="none" stroke="${p.edge}" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const chevrons = (n, top, p, color) => Array.from({ length: n }, (_, i) => bold(`M17 ${top + i * 9 + 9} L32 ${top + i * 9} L47 ${top + i * 9 + 9}`, p, color)).join('');

    function starPath(cx, cy, r) {
        let d = '';
        for (let i = 0; i < 10; i++) {
            const rad = i % 2 ? r * 0.45 : r, a = -Math.PI / 2 + i * Math.PI / 5;
            d += (i ? 'L' : 'M') + (cx + rad * Math.cos(a)).toFixed(1) + ' ' + (cy + rad * Math.sin(a)).toFixed(1);
        }
        return d + 'Z';
    }
    const star = (cx, cy, r, p, color) => `<path d="${starPath(cx, cy, r)}" fill="${color}" stroke="${p.edge}" stroke-width="1.6" stroke-linejoin="round"/>`;
    const starRow = (n, cy, r, gap, p, color) => Array.from({ length: n }, (_, i) => star(32 + (i - (n - 1) / 2) * gap, cy, r, p, color)).join('');

    // จุดบอก "ชั้น" (เต็ม = ชั้นที่ได้แล้ว)
    const pips = (cls, cy, p) => !cls ? '' : Array.from({ length: 5 }, (_, i) =>
        `<circle cx="${32 + (i - 2) * 6.5}" cy="${cy}" r="2.3" fill="${i < cls ? p.ink : 'rgba(0,0,0,.4)'}" stroke="${p.edge}" stroke-width="1"/>`).join('');

    function laurel(p) {
        const leaves = [[14, 46, -55], [10, 37, -25], [10, 28, 5], [13, 19, 35]];
        const side = (mx) => leaves.map(([x, y, a]) => {
            const X = mx ? 64 - x : x, A = mx ? -a : a;
            return `<ellipse cx="${X}" cy="${y}" rx="2.6" ry="5" transform="rotate(${A} ${X} ${y})" fill="${p.ink}" stroke="${p.edge}" stroke-width="1"/>`;
        }).join('');
        return `<path d="M20 52 Q7 38 15 14 M44 52 Q57 38 49 14" fill="none" stroke="${p.ink}" stroke-width="2"/>${side(false)}${side(true)}`;
    }

    function swords(p) {
        const one = (x1, y1, x2, y2, gx1, gy1, gx2, gy2) =>
            bold(`M${x1} ${y1} L${x2} ${y2}`, p, '#f1f5f9', 3) + bold(`M${gx1} ${gy1} L${gx2} ${gy2}`, p, p.ink, 3);
        return one(20, 45, 44, 25, 17, 38, 25, 46) + one(44, 45, 20, 25, 47, 38, 39, 46);
    }

    // ---------- แยกชื่อยศ → หมวด / ขั้น / ชั้น ----------
    const N3 = { 'ตรี': 1, 'โท': 2, 'เอก': 3 };
    function parse(name) {
        const cls = Number((name.match(/ชั้น\s*(\d)/) || [])[1]) || 0;
        let m;
        if (name === 'ทหารฝึก') return { tier: 'recruit' };
        if (name === 'พลทหาร') return { tier: 'private' };
        if ((m = name.match(/^จ่าสิบ(ตรี|โท|เอก)/))) return { tier: 'wo', n: N3[m[1]], cls };
        if ((m = name.match(/^สิบ(ตรี|โท|เอก)/))) return { tier: 'nco', n: N3[m[1]] };
        if ((m = name.match(/^ร้อย(ตรี|โท|เอก)/))) return { tier: 'lt', n: N3[m[1]], cls };
        if ((m = name.match(/^พัน(ตรี|โท|เอก)/))) return { tier: 'col', n: N3[m[1]], cls };
        if ((m = name.match(/^พล(จัตวา|ตรี|โท|เอก)/))) return { tier: 'gen', n: { 'จัตวา': 1, 'ตรี': 2, 'โท': 3, 'เอก': 4 }[m[1]], cls };
        if (/^จอมพล/.test(name)) return { tier: 'marshal', cls };
        return null;
    }

    // ---------- วาดตามหมวด ----------
    function draw(name) {
        const r = parse(name);
        if (!r) return '';
        const p = PAL[r.tier];
        let body = grad(p);
        switch (r.tier) {
            case 'recruit':
                body += plate(SHIELD, p) + bold('M22 31 L42 31', p, p.ink, 5);
                break;
            case 'private':
                body += plate(SHIELD, p) + chevrons(1, 25, p, p.ink);
                break;
            case 'nco':
                body += plate(SHIELD, p) + chevrons(r.n, 32 - r.n * 4.5 - 3, p, p.ink);
                break;
            case 'wo':
                body += plate(SHIELD, p) + chevrons(r.n, 12 + (3 - r.n) * 3, p, p.ink)
                    + bold('M17 39 Q32 47 47 39', p, p.ink, 4) + pips(r.cls, 53, p);
                break;
            case 'lt':
                body += plate(HEX, p) + starRow(r.n, 29, r.n === 3 ? 7.5 : 9, r.n === 3 ? 15 : 18, p, p.ink) + pips(r.cls, 49, p);
                break;
            case 'col':
                body += plate(HEX, p) + laurel(p) + starRow(r.n, 28, r.n === 3 ? 5.8 : 7, r.n === 3 ? 11 : 13, p, p.ink) + pips(r.cls, 50, p);
                break;
            case 'gen':
                body += disc(29, p) + swords(p) + starRow(r.n, 20, r.n >= 3 ? 5 : 6, r.n >= 3 ? 10 : 12, p, p.ink) + pips(r.cls, 54, p);
                break;
            case 'marshal': {
                const rays = Array.from({ length: 12 }, (_, i) => {
                    const a = i * Math.PI / 6, x1 = 32 + 24 * Math.cos(a), y1 = 36 + 24 * Math.sin(a), x2 = 32 + 30 * Math.cos(a), y2 = 36 + 30 * Math.sin(a);
                    return `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`;
                }).join(' ');
                body += `<path d="${rays}" stroke="${p.ring}" stroke-width="3" stroke-linecap="round"/>`
                    + disc(24, p, 36)
                    + `<circle cx="32" cy="34" r="13" fill="${p.ink}" stroke="${p.edge}" stroke-width="2"/>`
                    + star(32, 34, 11, p, '#fde047')
                    + `<path d="M19 15 L22 4 L27 10 L32 2 L37 10 L42 4 L45 15 Z" fill="#fde047" stroke="${p.edge}" stroke-width="2" stroke-linejoin="round"/>
                       <circle cx="32" cy="10" r="1.8" fill="#dc2626"/>`
                    + pips(r.cls, 53, { ...p, ink: '#fff' });
                break;
            }
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${body}</svg>`;
    }

    const toUrl = name => { const svg = draw(name); return svg ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) : ''; };
    return { draw, toUrl, parse };
})();

// ลิงก์รูปยศทุกขั้น (ที่อื่นในเว็บใช้ตัวแปรนี้อยู่แล้ว เลยเปลี่ยนรูปได้ทั้งเว็บจากตรงนี้ที่เดียว)
window.rankIconUrls = Object.fromEntries(window.rankData.map(r => [r.name, window.RankArt.toUrl(r.name)]));

window.getRankIcon = function(rankName, size = 60) {
    const defaultIcon = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"; 
    const imageUrl = window.rankIconUrls[rankName] || defaultIcon;
    return `<img src="${imageUrl}" width="${size}" height="${size}" style="vertical-align: middle; border-radius: 4px; object-fit: contain;">`;
}

window.updateExpUI = function(exp) {
    if (typeof window.getRankInfo !== 'function') return;
    const info = window.getRankInfo(exp);
    let rText = document.getElementById('rankTextDisplay');
    if(rText) rText.innerText = info.current.name;
    
    let rIcon = document.getElementById('rankIconSmallDisplay');
    if(rIcon) rIcon.innerHTML = window.getRankIcon(info.current.name, 40);
    
    let nText = document.getElementById('nextRankTextDisplay');
    if(nText) nText.innerText = info.next.name;
    
    let nIcon = document.getElementById('nextRankIconDisplay');
    if(nIcon) nIcon.innerHTML = window.getRankIcon(info.next.name, 24);

    let progress = 2;
    if (info.current.exp !== info.next.exp) {
        let expInCurrentLevel = exp - info.current.exp;
        let expNeededForNext = info.next.exp - info.current.exp;
        progress = (expInCurrentLevel / expNeededForNext) * 100;
        let expNum = document.getElementById('expNumbersDisplay');
        if(expNum) expNum.innerText = `${exp.toLocaleString()} / ${info.next.exp.toLocaleString()} EXP`;
    } else {
        let expNum = document.getElementById('expNumbersDisplay');
        if(expNum) expNum.innerText = `MAX LEVEL (${exp.toLocaleString()} EXP)`;
        if(nText) nText.innerText = "ตันแล้ว"; 
    }
    let expFill = document.getElementById('expBarFill');
    if(expFill) expFill.style.width = `${progress}%`;
}

window.getRankText = function(wpm) {
    if (wpm <= 30) return `พิมพ์เป็นไหมวะ กากว่ะ`;
    if (wpm <= 40) return `ไปฝึกเยอะๆ ยังอ่อนอยู่`;
    if (wpm <= 50) return `มึงกำลังหัดพิมพ์หรอ?`;
    if (wpm <= 60) return `เหยดๆ เริ่มเก่งละว่ะ`;
    if (wpm <= 65) return `โหดสัสรัสเซีย แม่เย็ด`;
    if (wpm <= 75) return `สุดจัด มึงก็พิมพ์ไวไป`;
    if (wpm <= 84) return `ไอ้เหี้ย มึงจะสุดไปละ`;
    if (wpm <= 95) return `มึงจะไวเกินไปละไอ้เวร`;
    if (wpm <= 105) return `โคตรพ่อโคตรแม่ไวจัด`;
    if (wpm <= 116) return `พิมพ์ก็ไว เสร็จก็ไวไอ้สัส`;
    if (wpm <= 129) return `เร็วสัส ใครจะสู้ได้วะแม่เย็ด`;
    if (wpm <= 139) return `เกือบจะตึงหนึ่งเดียวในบริษัทแล้ว`;        
    return `ตัวตึงหนึ่งเดียวในบริษัท`;
}
