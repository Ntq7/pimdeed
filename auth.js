// ========================================================
// 🔐 auth.js - ระบบล็อกอิน, สมัครสมาชิก, ธีมสี และโปรไฟล์
// ========================================================
window.IMGBB_API_KEY = "69dc1d1d5c746220fd5d13c2f66613b0"; 

window.currentUser = localStorage.getItem('currentUser') || localStorage.getItem('isLoggedIn') || "";
window.SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyn-42qkA8MP5LD5kD8_9Wl6SHjbhlByRRI0Tt0R40FKPRSZgNnRxwFaOjAUJ0RwmvI/exec"; 
window.myDeviceId = localStorage.getItem('myDeviceId') || ('DEV-' + Math.random().toString(36).substr(2, 9));
localStorage.setItem('myDeviceId', window.myDeviceId);

window.getBoundUsers = function() {
    let users = localStorage.getItem('deviceBoundUsers');
    if (users) return JSON.parse(users);
    let oldUser = localStorage.getItem('deviceBoundUser');
    if (oldUser) {
        localStorage.setItem('deviceBoundUsers', JSON.stringify([oldUser]));
        localStorage.removeItem('deviceBoundUser');
        return [oldUser];
    }
    return [];
}

window.addBoundUser = function(user) {
    if (user.toLowerCase() === "") return;
    let users = window.getBoundUsers();
    if (!users.includes(user)) {
        users.push(user);
        localStorage.setItem('deviceBoundUsers', JSON.stringify(users));
    }
}

// ==========================================
// 🔑 ระบบล็อกอิน / สมัครสมาชิก
// ==========================================

window.switchAuth = function(type) {
    if(type === 'login') {
        document.getElementById('loginForm').style.display = 'block'; document.getElementById('registerForm').style.display = 'none';
        document.getElementById('tabLogin').style.background = 'var(--primary)'; document.getElementById('tabRegister').style.background = '#222';
    } else {
        document.getElementById('loginForm').style.display = 'none'; document.getElementById('registerForm').style.display = 'block';
        document.getElementById('tabLogin').style.background = '#222'; document.getElementById('tabRegister').style.background = '#ef4444';
    }
}

window.handleLogin = async function() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    if(!user || !pass) return alert("กรอกข้อมูลให้ครบดอแม่เย็ด!");

    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    const btn = document.querySelector('#loginForm .btn-main'); 
    const originalText = btn.innerText;
    btn.innerText = "กำลังโหลดดดดดด.....";
    btn.disabled = true;

    try {
        if (window.db) {
            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const docRef = doc(window.db, "users", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (!db[user]) db[user] = { history: [], exp: 0, multiplier: 10 };
                db[user].pass = pass; 
                db[user].best = userData.wpm || 0;
                db[user].exp = userData.exp || 0;
                if (userData.profilePic) db[user].profilePic = userData.profilePic;
                
                window.proceedLogin(user, pass, db);
                btn.innerText = originalText; btn.disabled = false;
                return; 
            }
        }

        let res = await fetch(window.SCRIPT_URL + "?_t=" + Date.now());
        let data = await res.json();
        let userRecords = data.filter(item => item.username === user);
        
        if(userRecords.length > 0) {
            let latestPass = "";
            let bestWPM = 0;
            let latestExp = 0; 
            let latestMultiplier = 10; 
            let latestProfilePic = "";

            for(let r of userRecords) {
                if(r.password !== undefined && r.password !== null && r.password !== "ไม่มีรหัส" && r.password !== "") { latestPass = String(r.password).trim(); }
                if(Number(r.wpm) > bestWPM) { bestWPM = Number(r.wpm); }
                latestExp = Number(r.exp) || 0; 
                latestMultiplier = Number(r.multiplier) || 10; 
                if (r.profilePic) latestProfilePic = r.profilePic;
            }
            
            if (latestPass !== "") {
                if(latestPass === pass) {
                    if (!db[user]) db[user] = { history: [], exp: 0, multiplier: 10 };
                    db[user].pass = pass; 
                    db[user].best = bestWPM; 
                    db[user].exp = latestExp; 
                    db[user].multiplier = latestMultiplier; 
                    if (latestProfilePic) db[user].profilePic = latestProfilePic;
                    window.proceedLogin(user, pass, db);
                } else { alert("รหัสผ่านผิดไอ้สัส มึงจำไม่ได้หรอ?!"); }
            } else {
                if (!db[user]) db[user] = { history: [], exp: 0, multiplier: 5 };
                db[user].pass = pass; db[user].best = bestWPM; db[user].exp = latestExp; db[user].multiplier = latestMultiplier; 
                if (latestProfilePic) db[user].profilePic = latestProfilePic;
                fetch(window.SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'changePassword', username: user, password: pass }) }).catch(() => {});
                alert("✅ กู้คืนบัญชีเก่าสำเร็จ! ระบบบันทึกรหัสใหม่ให้มึงแล้ว"); 
                window.proceedLogin(user, pass, db);
            }
        } else { alert("ไม่พบชื่อนี้ในระบบเลย ไปสมัครก่อนไอ้กาก!"); }
    } catch(e) { alert("โหลดข้อมูลไม่สำเร็จ เน็ตมึงมีปัญหาป่าว?"); }
    
    btn.innerText = originalText; btn.disabled = false;
}

window.handleRegister = async function() {
    let boundUsers = window.getBoundUsers();
    const user = document.getElementById('regUser').value.trim();
    if (boundUsers.length >= 2 && !boundUsers.includes(user)) {
        return alert(`อย่าสมัครเยอะไอ้สัส (${boundUsers.join(', ')})!\nไปเล่นไอดีเดิมมึงไป`);
    }

    const pass = document.getElementById('regPass').value.trim();
    if(!user || !pass) return alert("กรอกข้อมูลให้ครบ!");
    if(user.length > 30) return alert("ชื่อยาวไป!");
    if(pass.length < 4) { return window.setupDarkModal("🚨 รหัสสั้นไป!", "ต้อง 4 ตัวขึ้นไป", "รับทราบ", () => { window.closeModal('darkActionModal'); }, "ซ่อน"); }
    if(user === pass) { return window.setupDarkModal("🚨 เตือนสติ!", "ชื่อกับรหัสห้ามเหมือนกัน!", "รับทราบ", () => { window.closeModal('darkActionModal'); }, "ซ่อน"); }
    
    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    if(db[user]) return alert("ชื่อนี้มีคนใช้แล้ว!");
    
    const payload = {
        action: 'saveScore', username: user, wpm: 0, accuracy: 0, correctWords: 0, wrongWords: 0, totalAttempts: 0, exp: 0, multiplier: 10, rank: "ทหารฝึก", password: pass, token: btoa((0 * 13 + 0 * 7) + "-ANTI-GAK") 
    };

    try {
        if (window.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const userRef = doc(window.db, "users", user);
            // 🔥 เปลี่ยน last_played เป็น last_online
            await setDoc(userRef, { username: user, password: pass, wpm: 0, exp: 0, rank: "ทหารฝึก", profilePic: "", multiplier: 10, last_online: Date.now() }, { merge: true });
        }

        let response = await fetch(window.SCRIPT_URL, { 
            method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) 
        });
        let result = await response.json();
        if (result.status === "success") {
            db[user] = { pass: pass, best: 0, exp: 0, multiplier: 10, history: [] }; 
            window.proceedLogin(user, pass, db);
        } else {
            alert("❌ ระบบขัดข้อง: " + (result.message || "ไม่สามารถสมัครได้ในขณะนี้"));
        }
    } catch (error) {
        alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง!");
    }
}

window.proceedLogin = function(user, pass, db) {
    if(!db[user].history) db[user].history = [];
    if(db[user].exp === undefined) db[user].exp = 0; 
    window.addBoundUser(user);

    localStorage.setItem('typingDB_Final', JSON.stringify(db));
    localStorage.setItem('isLoggedIn', user); 
    window.currentUser = user;
    window.lastLoginTime = Date.now();

    // 🔥 Auto-Sync 
    if (window.db) {
        import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js").then(({ doc, setDoc }) => {
            const userRef = doc(window.db, "users", user);
            const syncData = { 
                username: user, 
                password: pass,
                wpm: db[user].best || 0,
                exp: db[user].exp || 0,
                multiplier: db[user].multiplier || 10,
                last_online: Date.now() // 🔥 เปลี่ยนตรงนี้เป็น last_online
            };
            if (db[user].profilePic) {
                syncData.profilePic = db[user].profilePic;
            }
            setDoc(userRef, syncData, { merge: true }).catch(() => {});
        });
    }

    fetch(window.SCRIPT_URL + "?user=" + encodeURIComponent(user) + "&deviceId=" + encodeURIComponent(window.myDeviceId) + "&action=login&_t=" + Date.now())
    .then(() => {
        window.showGame(user, db[user].best); 
        if(typeof window.loadTickerData === 'function') window.loadTickerData();
    });
}

window.showGame = function(user, best) {
    document.getElementById('displayUser').innerText = user;
    document.getElementById('bestWPM').innerText = best;
    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    if (!db[user]) db[user] = { best: 0, exp: 0, history: [] };
    if (db[user].exp === undefined) db[user].exp = 0;

    window.profileCache = window.profileCache || {};
    let defaultSVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzk0YTNiOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE3IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTIwIDEwMCBDMjAgNjUgMzAgNTUgNTAgNTUgQzcwIDU1IDgwIDY1IDgwIDEwMCBaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+";
    let profilePicUrl = db[user].profilePic || window.profileCache[user] || defaultSVG;
    document.getElementById('userProfilePic').src = profilePicUrl;

    if(typeof window.updateExpUI === 'function') window.updateExpUI(db[user].exp);
    let authBox = document.getElementById('authContainer');
    if (authBox) authBox.style.display = 'none';
    document.getElementById('gameMain').style.display = 'block';
    if(typeof window.init === 'function') window.init();
}

// ==========================================
// ⚙️ ระบบจัดการบัญชี
// ชื่อที่แสดง (displayName) เปลี่ยนได้อิสระ ส่วนไอดีที่ใช้ล็อกอินไม่เปลี่ยน (แอดมินเปลี่ยนให้ได้)
// ==========================================

function darkError(msg) {
    document.getElementById('darkDesc').innerHTML = `<span style='color:#f87171'>${msg}</span>`;
}

window.showEditName = function() {
    window.setupDarkModal("✏️ เปลี่ยนชื่อที่แสดง", "ชื่อนี้คนอื่นจะเห็นในบอร์ดและตารางอันดับ (ไอดีเข้าสู่ระบบยังเหมือนเดิม)", "บันทึกชื่อ", async () => {
        const newName = document.getElementById('darkInput1').value.trim().replace(/\s+/g, ' ');
        if (!newName) return darkError("ใส่ชื่อก่อน");
        if (newName.length > 30) return darkError("ชื่อยาวไป เอาไม่เกิน 30 ตัวอักษร");

        const btn = document.getElementById('darkConfirmBtn');
        btn.innerHTML = "กำลังบันทึก...";
        btn.disabled = true;
        try {
            const dbInstance = await window.getFirebaseDB();
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            await setDoc(doc(dbInstance, "users", window.currentUser), { displayName: newName }, { merge: true });
            document.getElementById('displayUser').innerText = newName;
            try { localStorage.setItem('cachedName', newName); } catch (e) {}
            window.closeModal('darkActionModal');
        } catch (error) {
            console.error("Error changing name:", error);
            darkError("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง");
        }
        btn.innerHTML = "บันทึกชื่อ"; btn.disabled = false;
    });

    const input = document.getElementById('darkInput1');
    input.type = 'text';
    input.placeholder = 'ชื่อที่จะให้คนอื่นเห็น';
    input.style.display = 'block';
    input.value = document.getElementById('displayUser').innerText;
    setTimeout(() => input.focus(), 100);
}

window.showChangePassword = function() {
    window.setupDarkModal("🔑 เปลี่ยนรหัสผ่าน", "ใส่รหัสเดิม แล้วตั้งรหัสใหม่", "เปลี่ยนรหัส", async () => {
        const oldPass = document.getElementById('darkInput1').value;
        const newPass = document.getElementById('darkInput2').value;
        if (!oldPass || !newPass) return darkError("กรอกให้ครบทั้งสองช่อง");
        if (newPass.length < 6) return darkError("รหัสใหม่ต้องมีอย่างน้อย 6 ตัว");

        const btn = document.getElementById('darkConfirmBtn');
        btn.innerHTML = "กำลังเปลี่ยน...";
        btn.disabled = true;
        try {
            // เช็กรหัสเดิมกับ Firebase (ในเครื่องไม่ได้เก็บรหัสไว้)
            const dbInstance = await window.getFirebaseDB();
            const { doc, getDoc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const ref = doc(dbInstance, "users", window.currentUser);
            const snap = await getDoc(ref);
            const current = snap.exists() ? String(snap.data().password) : null;
            if (current !== oldPass && current !== oldPass.trim()) {
                btn.innerHTML = "เปลี่ยนรหัส"; btn.disabled = false;
                return darkError("รหัสเดิมไม่ถูกต้อง");
            }
            await setDoc(ref, { password: newPass }, { merge: true });
            fetch(window.SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'changePassword', username: window.currentUser, password: newPass }) }).catch(() => {});
            window.closeModal('darkActionModal');
        } catch (error) {
            console.error("Error changing password:", error);
            darkError("เปลี่ยนไม่สำเร็จ ลองใหม่อีกครั้ง");
        }
        btn.innerHTML = "เปลี่ยนรหัส"; btn.disabled = false;
    });
    document.getElementById('darkInput1').style.display = 'block'; document.getElementById('darkInput1').type = 'password'; document.getElementById('darkInput1').placeholder = "รหัสเดิม";
    document.getElementById('darkInput2').style.display = 'block'; document.getElementById('darkInput2').placeholder = "รหัสใหม่ (อย่างน้อย 6 ตัว)";
    setTimeout(() => document.getElementById('darkInput1').focus(), 100);
}

window.showDeleteAccount = function() {
    window.setupDarkModal("🗑️ ยืนยันจะลบทิ้ง?", "มึงแน่ใจนะว่าจะลบบัญชี? <br><span style='color:#ef4444'>ลบแล้วข้อมูลหายหมดเกลี้ยง!</span>", "ลบแม่งเลย!", async () => {
        let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}'); 
        delete db[window.currentUser]; 
        localStorage.setItem('typingDB_Final', JSON.stringify(db));

        if (window.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const userRef = doc(window.db, "users", window.currentUser);
            await deleteDoc(userRef).catch(e => console.log("Firebase Delete Error:", e));
        }

        window.closeModal('darkActionModal'); 
        window.handleLogout(); 
        fetch(window.SCRIPT_URL, { method: 'POST',headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'deleteUser', username: window.currentUser }) }).catch(()=>{});
    }, "เปลี่ยนใจแล้ว");
    document.getElementById('darkConfirmBtn').className = "dark-btn danger";
}

window.showLogoutConfirm = function() { 
    const modal = document.getElementById('logoutModal'); 
    if (modal) { modal.style.display = 'flex'; } 
}

window.confirmLogout = function() { 
    document.getElementById('logoutModal').style.display = 'none';
    if (typeof window.handleLogout === "function") { window.handleLogout(); } 
    else { localStorage.removeItem('isLoggedIn'); location.reload(); }
}

window.handleLogout = function(isKicked = false) { 
    if (window.currentUser && window.currentUser.toLowerCase() !== "" && !isKicked) {
        fetch(window.SCRIPT_URL, { 
            method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'logout', username: window.currentUser }) 
        }).catch(() => {});
    } 
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser'); // ไม่ลบตัวนี้ = โดนเตะแล้วยังค้างล็อกอินอยู่
    ['cacheOwner', 'cachedName', 'cachedWPM', 'cachedExp', 'cachedPic', 'mySavedProfilePic'].forEach(k => localStorage.removeItem(k));
    location.replace("login.html");
}

// ==========================================
// 🎨 ระบบธีมสี
// ==========================================

window.initTheme = function() {
    const savedTheme = localStorage.getItem('theme_preference') || 'default';
    document.body.className = savedTheme === 'default' ? '' : savedTheme;
    window.updateThemeButtons(savedTheme);
}

window.openThemeModal = function() {
    document.getElementById('themeModal').style.display = 'flex';
    const currentTheme = localStorage.getItem('theme_preference') || 'default';
    window.updateThemeButtons(currentTheme);
}

window.selectTheme = function(themeId) {
    let oldTheme = document.body.className; 
    if (!oldTheme && localStorage.getItem('theme_preference')) { oldTheme = localStorage.getItem('theme_preference'); }

    document.body.className = themeId === 'default' ? '' : themeId;
    localStorage.setItem('theme_preference', themeId);
    window.updateThemeButtons(themeId);
    setTimeout(() => {
        let el = document.getElementById('themeModal');
        if(el) el.style.display = 'none';
    }, 200);

    if (oldTheme && oldTheme !== 'default' && oldTheme !== themeId) {
        let oldBadge = document.getElementById("count-" + oldTheme);
        if (oldBadge && parseInt(oldBadge.innerText) > 0) {
            let newVal = parseInt(oldBadge.innerText) - 1;
            oldBadge.innerText = newVal;
            if(newVal <= 0) oldBadge.style.display = 'none';
        }
    }
    if (themeId && themeId !== 'default') {
        let newBadge = document.getElementById("count-" + themeId);
        if (newBadge) {
            newBadge.innerText = parseInt(newBadge.innerText || 0) + 1;
            newBadge.style.display = 'block';
        }
    }

    if (typeof window.currentUser !== 'undefined' && window.currentUser) {
        fetch(window.SCRIPT_URL, {
            method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "updateTheme", username: window.currentUser, theme: themeId })
        }).catch(err => console.log("ส่งข้อมูลไม่ผ่าน:", err));
    }
}

window.updateThemeButtons = function(activeId) {
    document.querySelectorAll('.theme-option-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + activeId);
    if(activeBtn) activeBtn.classList.add('active');
}

window.updateThemeCounts = function(dataArray) {
    let counts = null;
    dataArray.forEach(item => { if (item.__THEME_COUNTS__) counts = item.__THEME_COUNTS__; });
    if (!counts && dataArray.length > 0 && dataArray[0].theme_counts) counts = dataArray[0].theme_counts;

    if (counts) {
        document.querySelectorAll('.theme-count-badge').forEach(el => {
            el.innerText = "0"; el.style.display = "none";
        });
        for (let theme in counts) {
            let badge = document.getElementById("count-" + theme);
            if (badge && counts[theme] > 0) { 
                badge.innerText = counts[theme];
                badge.style.display = "block"; 
            }
        }
    }
}

// ==========================================
// 🚀 ระบบอัปโหลดรูปภาพ & เช็กล็อกอิน
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    window.initTheme();
    const savedUser = localStorage.getItem('isLoggedIn');
    // หน้าใหม่ (index.html) บูตเกมเองแล้ว ทำเฉพาะหน้าเก่าที่ยังมีกล่องล็อกอินในหน้าเดียว
    if (savedUser && document.getElementById('authContainer')) {
        window.currentUser = savedUser;
        let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
        
        if (typeof window.showGame === 'function') {
            window.showGame(savedUser, db[savedUser] ? db[savedUser].best : 0);
        } else {
            console.error("หาไฟล์ game.js ไม่เจอ! เช็ค index.html ด่วน");
        }
    }

    let picInput = document.getElementById('profilePicInput');
    if (!picInput) {
        const fileInputHTML = '<input type="file" id="profilePicInput" accept="image/*" style="display: none;">';
        document.body.insertAdjacentHTML('beforeend', fileInputHTML);
        picInput = document.getElementById('profilePicInput');
    }
    picInput.addEventListener('change', window.onAvatarPicked);
});

// ==========================================
// 🖼️ ระบบเปลี่ยนรูปโปรไฟล์ (ตัวย่อรูปอยู่ใน avatar-tools.js)
// 1) ย่อรูป/GIF ในเครื่อง ให้เล็กพอเก็บใน Firebase ตรงๆ → อัปไว ไม่ต้องรอที่ฝากรูปภายนอก
// 2) GIF ที่ย่อแล้วยังใหญ่เกิน → ส่งขึ้น ImgBB (โชว์ %) ถ้าล่มก็ใช้ภาพนิ่งแทน
// 3) บันทึกลง Firebase → บอร์ดเลื่อน/ตารางอันดับของทุกคนเห็นรูปใหม่เอง
// ==========================================

let pendingAvatar = null;

function setAvatarStatus(html, type) {
    const el = document.getElementById('avatarStatus');
    if (!el) return;
    el.className = 'avatar-status' + (type ? ' is-' + type : '');
    el.innerHTML = html;
}

function setAvatarBusy(busy) {
    ['avatarSaveBtn', 'avatarPickBtn'].forEach(id => { const b = document.getElementById(id); if (b) b.disabled = busy; });
}

function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}


window.pickAvatar = function() {
    document.getElementById('profilePicInput').click();
}

window.onAvatarPicked = async function(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;

    document.getElementById('avatarModal').style.display = 'flex';
    document.getElementById('avatarPreview').removeAttribute('src');
    document.getElementById('avatarSaveBtn').style.display = '';
    pendingAvatar = null;
    setAvatarBusy(true);
    setAvatarStatus('<span class="avatar-spinner"></span>', 'busy');

    try {
        pendingAvatar = await window.AvatarTools.prepare(file);
        document.getElementById('avatarPreview').src = pendingAvatar.preview;
        setAvatarStatus('');
        setAvatarBusy(false);
    } catch (err) {
        console.error("ย่อรูปไม่ได้:", err);
        setAvatarStatus('❌ ' + (err.message === 'decode' ? 'เปิดรูปนี้ไม่ได้' : err.message), 'error');
        document.getElementById('avatarPickBtn').disabled = false;
    }
}

window.saveAvatar = async function() {
    if (!pendingAvatar || !window.currentUser) return;
    setAvatarBusy(true);

    setAvatarStatus('<span class="avatar-spinner"></span> กำลังบันทึก...', 'busy');
    let picUrl = pendingAvatar.inline;
    if (!picUrl) {
        try {
            picUrl = await window.AvatarTools.uploadToImgBB(pendingAvatar.upload, window.IMGBB_API_KEY,
                pct => setAvatarStatus(`<span class="avatar-spinner"></span> กำลังบันทึก ${pct}%`, 'busy'));
        } catch (err) {
            console.warn("ImgBB ใช้ไม่ได้ ใช้ภาพนิ่งแทน:", err);
            picUrl = pendingAvatar.fallback;
        }
    }
    try {
        const dbInstance = await window.getFirebaseDB();
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        await withTimeout(setDoc(doc(dbInstance, "users", window.currentUser), { profilePic: picUrl }, { merge: true }), 15000);
    } catch (err) {
        console.error("บันทึกรูปลง Firebase ไม่สำเร็จ:", err);
        if (err.message !== 'timeout') {
            setAvatarStatus('❌ บันทึกไม่สำเร็จ ลองใหม่อีกที', 'error');
            setAvatarBusy(false);
            return;
        }
        // timeout = เน็ตช้า Firebase จะส่งให้เองเมื่อเชื่อมต่อได้ ไม่ต้องให้กดซ้ำ
    }

    // อัปเดตในเครื่อง
    document.getElementById('userProfilePic').src = picUrl;
    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    if (!db[window.currentUser]) db[window.currentUser] = {};
    db[window.currentUser].profilePic = picUrl;
    try {
        localStorage.setItem('typingDB_Final', JSON.stringify(db));
        localStorage.setItem('cacheOwner', window.currentUser);
        localStorage.setItem('cachedPic', picUrl);
    } catch (e) { console.warn("พื้นที่ในเครื่องเต็ม ข้ามการจำรูป:", e); }
    window.profileCache = window.profileCache || {};
    window.profileCache[window.currentUser] = picUrl;

    // ชีตเก่าเก็บแค่ลิงก์ (รูปที่เก็บใน Firebase ตรงๆ ไม่ต้องส่ง)
    if (window.SCRIPT_URL && picUrl.startsWith('http')) {
        fetch(window.SCRIPT_URL, {
            method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: 'updateProfilePic', username: window.currentUser, profilePic: picUrl })
        }).catch(err => console.error("Sheet Error:", err));
    }

    pendingAvatar = null;
    setAvatarBusy(false);
    setAvatarStatus('');
    document.getElementById('avatarModal').style.display = 'none';
}

window.loadAllProfilePics = function() {
    if(typeof window.SCRIPT_URL === 'undefined' || !window.SCRIPT_URL) return;
    fetch(window.SCRIPT_URL + "?action=getProfiles&_t=" + Date.now())
    .then(res => res.json())
    .then(data => {
        window.profileCache = window.profileCache || {};
        for (let user in data) { window.profileCache[user] = data[user]; }
    }).catch(err => console.log("เกิดข้อผิดพลาด:", err));
}

window.openImageViewer = function(src) {
    document.getElementById('largeProfilePic').src = src;
    document.getElementById('imageViewerModal').style.display = 'flex';
}
