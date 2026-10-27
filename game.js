// ========================================================
// 🎮 game.js - ระบบการเล่น, จับเวลา, คะแนน โกง
// ========================================================

const fullWordList = [
      "พี่", "เพื่อน", "ดาว", "บิน", "โสม", "แสง", "โต", "ใหญ่", "น้อย", "แผนก","ห้อง","ใจ","ลอย","กลุ่ม","กาก","ร้าน","ซ่อม","ผอม", "อ้วน", "อ้อน", "แดง", "เพลง", "หอม", 
      "ต่อ", "เติม", "ห้าม", "เช็ค", "เชือด", "แอดมิน", "สมาชิก", "พร้อม",  "ไม่ถูก", "ไม่ผิด", "ถูก", "ผิด", "ขอโทษ", "ท้อ", "ว่าง", 
      "พ่อ", "เครียด", "ป่วย", "หวย", "หมา", "เวียน", "งับ", 
      "มอง", "ดาว", "แฉ", "ไพลิน", "ปอย", "มด", "พยายาม", "เบื่อ", "ลูกค้า", 
      "ใจ", "หัว", "กำ", "หมัด", "ชก", "เหี้ย", "เสือก", "วันนี้", "จน", "นรก", "มาร", "ดอก", "กบ", "แมว", "ก้อย", "กล้าม", "บล็อค", 
      "โกง", "หมี", "หมวย", "สาว", "หนุ่ม", "พูด", "ลาบ", "แตก", "หน่อ", "หล่อ", "ทราบ", "ทราย", "บาง", "ไก่", "ปลา", "ต้ม", "ห้อง", 
      "งง", "ปลอม", "แท้", "จริง", "สิว", "ลิง", "สิบ", "เก้า", "หก", "บอง","โอน","จ่าย","สาย","โดน","ปรับ","หลับ","เงิน","ทอน", "จอง", 
      "ห้า", "สี่", "สาม", "สอง", "สิง", "ควาย", "จ้า", "ข้า", "พอต", "ยา", "กัน", "เนื้อ", "ลำ", "ทอง", "ส้ม", "เหลือง", "เขียว", "เกย์", "พิมพ์", "ท้อง", "เกม", "จำ", 
      "จำนำ", "พระ", 
      "ฉัน", "เธอ", "เวร", "เพื่อ", "สัส", "ควย", "สี", "อ้อ", "หมอ", "หม้อ", "พอ", "ท่อ", "ชวน", "ทวี", "ตัดสิน", "ชอบ", "โคม", "แจ้ง", 
      "เฉพาะ", "งาน", "ตรง", "ตุลาคม", "ขึ้น", "ขวาง", "ย้อย", "ช้า", "คูณ", "ดง", "กระดูก", "เท้า", "ซิ", "เทียบ", "ชีพ", "ชิง", "จับ", 
      "ชั่ว", "ใกล้", "ด้วย", "ตรวจ", "ทำไม", "กล้า", "ชัวร์", "คลาย", "ธรรม", "กลาง", "ตัด", "นั่ง", "จำนวน", "จริต", "ทั้ง", "หิน", "แอด", 
      "ใต้", "เดือด", "แดด", "ตาม", "จึง", "ต้น", "ช้าง", "ทัน", "เชื้อ", "เดี๋ยว", "คับ", "กล่าว", "เที่ยง", "โต๊ะ", "คลุม", "ตรา", "เหล็ก", "จ้อง", 
      "ค่า", "ทหาร", "แจ้ง", "ขัง", "ขาด", "เจริญ", "ข้าง", "กว้าง", "ดับ", "ชาติ", "ไกล", "แกะ", "ดวง", "ขอบ", "แถว", "งาม", "ขา", "ลำ", 
      "ใคร", "ตน", "ค่ำ", "ชา", "เตียง", "แจง", "ดำ", "ทิ้ง", "ขยาย", "จัก", "ด้าน", "ถวาย", "คอ", "การ", "ธง", "ช่อง", "เกิน", "พร้อม", 
      "ดื่ม", "ติด", "ต้อง", "ช่าง", "ทอง", "จบ", "คณะ", "ทิศ", "เขา", "จด", "ตู้", "เคย", "คะ", "ถนน", "ควร", "กิน", "กี่", "ไฟ", "รายงาน", 
      "ขัด", "กว่า", "ช่วย", "ซ้ำ", "นอน", "ดิน", "จง", "กาย", "กรุง", "ครอง","เหยด", "เห่า", "ไหล", "ล้าน", "เหมียว", "บอก", "หยอก", "เนย", "อ้วก", "แลก", "ซึ่ง", "โชค", "เด็ก", "เช่น", "ขี่", "คอย", 
      "ขน", "คดี", "ไข", "โดย", "ขัน", "จาก", "แทน", "กา", "ที", "ทาย", "จิต", "เครื่อง", "ข้าม", "เกาะ", "จม", "บาป","บุญ", "ท่อม", "มั่ว",  
      "เดือน", "ซ้าย", "เงิน", "คน", "ตำ", "กู้", "ท้าย", "ชน", "ก่อ", "ดี", "เตือน", "เงียบ", "เขต", "โทษ", "ความ", "ข้าว", "ชัก", "จัง", "ขณะ", 
      "จันทร์", "ขวด", "เที่ยว", "จีน", "จะ", "ใช่", "ทอด", "ตั้ง", "ครู", "ตัว", "ตก", "ถอย", "เช้า", "นม", "ก็", "ทรง", "ทา", "เบียร์", "แม่น", 
      "ธาตุ", "ชนะ", "ก้อน", "โง่", "แก้", "คำ", "ตาย", "นัก", "ค้า", "ชี้", "คืน", "แตก", "ได้", "ต่ำ", "งอก", "จ่าย", "ค้น", "พื้น", "หลัง", 
      "ค่อย", "ขาย", "ขีด", "กลม", "ชัด", "เดิน", "ไทย", "คือ", "ชีวิต", "ข่าว", "ญาติ", "ทุกข์", "ชนิด", "ทะเล", "เชื่อ", "เท", "ใช้", "เกิด", 
      "ขนาด", "กรรม", "ถ้า", "เดิม", "ชื่อ", "แต่ง", "ทุ่ง", "ทุก", "ชั้น", "ง่าย", "ขับ", "ตลอด", "นอก", "ตลาด", "จังหวัด", "ถาม", "ตา", 
      "เถียง", "แก้ว", "เจ็ด", "เจ้า", "กรม", "ถั่ว", "กลับ", "เท็จ", "กะ", "เคียง", "ไถ", "ใคร่", "จัด", "เล็บ", "โทรม","หวี", "กล้วย", "เหล้า",  
      "กาชาด", "ตอน", "กาง", "ทูต", "กำไร", "ดุจ", "แจ่ม", "เก้าอี้", "ฉบับ", "เข้า", "จดหมาย", "ซ่อน", "ทั้งปวง", "ทัพ", "โกรธ", "ตื่น", 
      "เท่า", "เกี่ยว", "ต้อน", "เก่า", "เดี่ยว", "โจทย์", "ของ", "ครอบครัว", "ชั่วโมง", "กลัว", "เต็ม", "ลุง", "ป้า", "น้า", "อา", "ปู่", "ย่า", "ตา", "ยาย",       
      "กิน", "ทรัพย์", "ร่วง", "จักร", "กฎหมาย", "ขอ", "เคลื่อน", "ดำเนิน", "นคร", "ครั้ง", "แข็ง", "ซื้อ", "เกรง", "แตงโม", "หน้า", "หลบ", 
      "คู", "ทับ", "ชำนาญ", "ทาน", "ไข่", "คุณ", "ทีเดียว", "ข้าศึก", "ฉะนั้น", "แต่", "ชม", "กำหนด", "ค่ะ", "ตะเกียง", "เม็ด", "หลับ", 
      "เกียจ", "ทั่ว", "ทาง", "กสิกรรม", "ธุระ", "กร", "ฉะนี้", "เขียน", "เถิด", "เกี่ยว", "คิด", "นก", "กรรมการ", "ขด", "ดำริ", "ขนาด", "เต็ม", 
      "ขาว", "ธรรมดา", "งู", "หนู",  "เก็บ", "แขก", "จ้าง", "ตึก", "น้อง", "เข้าหู", "เกือบ", "ทน", "กุมาร", "ทดลอง", "ทาบ", "ข้าง", "ครับ", 
      "เจาะ", "แก", "ข้าพเจ้า", "ทูน", "ครึ่ง", "ทำ", "กอบ", "นอกจาก", "เท่าไร", "ชาว", "กระด้าง", "ไข้", "ชนวน", "เว็บ", "ระดับ", "หน่อย", 
      "จำพวก", "ใด", "จูบ", "ไต่", "ต้าน", "เรา", "เทียม", "ขอรับ", "ไฉน", "ตระกูล", "ดัง", "ชาย", "ก่อน", "ทำลาย", "เสี้ยน", "บริษัท", 
      "เทวดา", "ดู", "ตรัส", "คลอง", "ตะวัน", "ท่าน", "ถ้อย", "กระทำ", "แก่", "ข้าราชการ", "ทวีป", "เกล้า", "ตอบ", "เจ็บ", "ร้อง", "ต่อย", 
      "เสร็จ", "เพชร", "แก้ว", "หมา", "ลิง", "หมก", "ลาบ", "ถวาย", "รำ", "ชก", "ต่อย", "แฟน", "พลาน", "ถ้วย", "หอย", "บี้", "ขยี้", "บด"
     ];

let words = [], currentIdx = 0, timeLeft = 60, isStarted = false, timer = null;
let correctCount = 0, wrongCount = 0, totalTypeAttempts = 0, totalChars = 0, correctChars = 0;
let rankAtStart = ""; 
let keyTimings = [];
let lastKeyTime = 0;
let gameOver = false;
let roundStartedAt = 0;

// ระบบแจ้งเตือนเซิร์ฟ (liveops.js) ใช้เช็กว่ากำลังพิมพ์อยู่ไหม จะได้ไม่เด้งขัดกลางตา
window.isRoundActive = () => isStarted && !gameOver;
let activeWordEl = null;

// 📜 ประวัติการพิมพ์: เก็บทั้งในเครื่อง และบน Firebase (ฟิลด์ history ในเอกสาร users) ดูได้ทุกเครื่อง
const HISTORY_LIMIT = 50;
const historyKey = r => r.date + '|' + r.wpm;

function historyTime(r) {
    if (r.ts) return r.ts;
    // ประวัติรุ่นเก่าไม่มี ts → แกะจากวันที่แบบไทย เช่น "27/10/2569 14:30:12"
    let m = String(r.date || '').match(/(\d+)\/(\d+)\/(\d+)\D+(\d+):(\d+):?(\d*)/);
    if (!m) return 0;
    let y = Number(m[3]); if (y > 2400) y -= 543;
    return new Date(y, m[2] - 1, m[1], m[4], m[5], m[6] || 0).getTime();
}

window.mergeHistory = function(a, b) {
    let seen = new Set(), out = [];
    [...(a || []), ...(b || [])].forEach(r => {
        if (!r || seen.has(historyKey(r))) return;
        seen.add(historyKey(r)); out.push(r);
    });
    return out.sort((x, y) => historyTime(y) - historyTime(x)).slice(0, HISTORY_LIMIT);
}

// รวมประวัติในเครื่องกับบน Firebase ถ้าในเครื่องมีอันที่บนเซิร์ฟเวอร์ยังไม่มี (เช่น ประวัติก่อนอัปเดตนี้) ก็อัปขึ้นไปด้วย
window.syncHistory = async function(serverHistory) {
    if (!window.currentUser) return [];
    serverHistory = Array.isArray(serverHistory) ? serverHistory : [];
    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    if (!db[window.currentUser]) db[window.currentUser] = { best: 0, exp: 0, history: [] };
    let merged = window.mergeHistory(db[window.currentUser].history, serverHistory);
    db[window.currentUser].history = merged;
    localStorage.setItem('typingDB_Final', JSON.stringify(db));

    if (window.db && merged.map(historyKey).join() !== serverHistory.map(historyKey).join()) {
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        await setDoc(doc(window.db, "users", window.currentUser), { history: merged }, { merge: true });
    }
    return merged;
}

// ตัวคูณ EXP = EXP ต่อคำที่พิมพ์ถูก (ไม่ได้ตั้ง = 10, ตั้ง 0 ก็ต้องได้ 0 จริงๆ ไม่ใช่เด้งกลับเป็น 10)
window.parseMultiplier = function(v) {
    const n = Number(v);
    return v !== undefined && v !== null && v !== '' && Number.isFinite(n) && n >= 0 ? n : 10;
}

window.refreshRankBaseline = function() {
    if (isStarted || typeof window.getRankInfo !== 'function') return;
    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    if (window.currentUser && db[window.currentUser]) rankAtStart = window.getRankInfo(db[window.currentUser].exp || 0).current.name;
}

window.init = function() {
    try {
        words = [...fullWordList].sort(() => Math.random() - 0.5);
        
        let wordContainer = document.getElementById('wordContainer');
        if(!wordContainer) return;

        wordContainer.innerHTML = words.map((w, i) => {
            let trap = `<b style="width:0; height:0; overflow:hidden; display:inline-block; position:absolute; user-select:none;">_BOT</b>`;
            return `<span class="word" id="w-${i}" style="margin: 0 14px 12px 0; display: inline-block;">${w}${trap}</span>`;
        }).join(' '); 

        currentIdx = 0; timeLeft = 60; isStarted = false; correctCount = 0;
        wrongCount = 0; totalTypeAttempts = 0; totalChars = 0; correctChars = 0;
        keyTimings = [];
        lastKeyTime = 0;
        gameOver = false;
        roundStartedAt = 0;
        activeWordEl = null;

        let userInput = document.getElementById('userInput');
        if(userInput) {
            userInput.value = ''; 
            userInput.style.color = '';
            userInput.disabled = false;
        }
        
        let timerDisplay = document.getElementById('timer');
        if(timerDisplay) timerDisplay.innerText = 60; 

        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none'); 
        wordContainer.style.transform = `translateY(0)`; 
        window.updateFocus();

        window.refreshRankBaseline();
    } catch(err) {
        console.error("Game Init Error:", err);
    }
}

window.updateFocus = function() {
    if (activeWordEl) activeWordEl.classList.remove('current', 'is-correct', 'is-wrong');
    const active = document.getElementById(`w-${currentIdx}`);
    activeWordEl = active;
    if(active) {
        active.classList.add('current');
        let container = document.getElementById('wordContainer');
        if(container && active.offsetTop > 40) {
            container.style.transform = `translateY(-${active.offsetTop - 10}px)`; 
        }
    }
}

// ส่งคำที่พิมพ์ (กด spacebar / Enter หรือมีช่องว่างหลุดมาจากคีย์บอร์ดมือถือ)
function submitWord(raw) {
    const val = String(raw || '').trim();
    if (!val || gameOver) return;
    const userInput = document.getElementById('userInput');

    totalTypeAttempts++;
    const target = words[currentIdx];
    if(target) totalChars += target.length;

    const activeWord = document.getElementById(`w-${currentIdx}`);
    if(activeWord) activeWord.classList.remove('is-correct', 'is-wrong');

    if(target && val === target) {
        if(activeWord) activeWord.classList.add('correct'); correctCount++; correctChars += target.length;
    } else {
        if(activeWord) activeWord.classList.add('wrong'); wrongCount++;
    }

    currentIdx++;
    if (userInput) { userInput.value = ''; userInput.style.color = ''; }
    window.updateFocus();
}

// ⌨️ 4. ตัวจับการพิมพ์
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    
    if (userInput) {
        userInput.addEventListener('input', (e) => {
            if (e.isTrusted === false) { e.preventDefault(); return; }

            let now = Date.now();
            if (lastKeyTime > 0) { keyTimings.push(now - lastKeyTime); }
            lastKeyTime = now;

            if(!isStarted && e.target.value.length > 0) {
                isStarted = true;
                roundStartedAt = Date.now();
                timer = setInterval(() => {
                    timeLeft--;
                    let tEl = document.getElementById('timer');
                    if(tEl) tEl.innerText = timeLeft;
                    if(timeLeft <= 0) window.endGame();
                }, 1000);
            }

            // คีย์บอร์ดมือถือ (เช่น Gboard) ไม่ส่งปุ่ม spacebar มาใน keydown → ช่องว่างหลุดเข้ามาในช่อง
            // เลยส่งคำตรงนี้แทน (คำก่อนช่องว่าง = คำที่พิมพ์ ที่เหลือหลังช่องว่างเก็บไว้เป็นคำถัดไป)
            if (/\s/.test(e.target.value) && !e.isComposing) {
                const parts = e.target.value.split(/\s+/);
                const rest = parts.pop();
                parts.filter(Boolean).forEach(submitWord);
                e.target.value = rest;
            }

            const val = e.target.value;
            const target = words[currentIdx]; 
            const activeWord = document.getElementById(`w-${currentIdx}`);
            
            if (activeWord && target) {
                if (val.length > 0) {
                    if (target.startsWith(val)) { 
                        e.target.style.color = '#10b981'; activeWord.classList.add('is-correct'); activeWord.classList.remove('is-wrong');
                    } else { 
                        e.target.style.color = '#ef4444'; activeWord.classList.add('is-wrong'); activeWord.classList.remove('is-correct'); 
                    }
                } else { 
                    e.target.style.color = ''; activeWord.classList.remove('is-correct', 'is-wrong'); 
                }
            }
        });

        userInput.addEventListener('keydown', (e) => {
            if (e.isTrusted === false) { e.preventDefault(); alert('หยุดใช้สคริปต์ปลอมคีย์บอร์ดเดี๋ยวนี้นะไอ้กาก!'); return; }

            if(e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                submitWord(userInput.value);
            }
        });

        // มือถือ: แตะช่องพิมพ์แล้วคีย์บอร์ดเด้งขึ้น → เลื่อนให้คำที่ต้องพิมพ์กับช่องพิมพ์อยู่ในจอ ไม่โดนคีย์บอร์ดบัง
        userInput.addEventListener('focus', () => {
            if (window.innerWidth > 768) return;
            setTimeout(() => {
                const card = document.querySelector('.typing-card');
                if (card) card.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }, 300);
        });

        // 🛡️ ป้องกันการก็อปปี้/วาง
        userInput.addEventListener('paste', e => { e.preventDefault(); alert('จะก็อปวางหรอไอ้สัส พิมพ์เองดิวะ!'); });
        userInput.addEventListener('copy', e => e.preventDefault());
        userInput.addEventListener('cut', e => e.preventDefault());
        userInput.addEventListener('drop', e => e.preventDefault());
        // กันทางลัดที่ไม่ใช่การพิมพ์เอง: วาง/ลาก/คำแนะนำแก้คำอัตโนมัติ/เติมคำทีละหลายตัว (autocomplete, แอปเติมข้อความ)
        userInput.addEventListener('beforeinput', e => {
            const t = e.inputType || '';
            if (t === 'insertFromPaste' || t === 'insertFromDrop' || t === 'insertFromYank' || t === 'insertReplacementText' ||
                (t === 'insertText' && !e.isComposing && (e.data || '').trim().length > 3)) e.preventDefault();
        });
    }

    // กันลากคลุม/ก็อปคำโจทย์ไปให้โปรแกรมอ่าน
    const wordBox = document.getElementById('wordContainer');
    if (wordBox) {
        wordBox.style.userSelect = 'none';
        wordBox.style.webkitUserSelect = 'none';
        ['copy', 'cut', 'selectstart', 'dragstart'].forEach(ev => wordBox.addEventListener(ev, e => e.preventDefault()));
    }
});

window.endGame = async function() {
    clearInterval(timer);
    if (gameOver) return; // กันจบเกมซ้ำ = กัน EXP เบิ้ล
    gameOver = true;
    let userInput = document.getElementById('userInput');
    if(userInput) userInput.disabled = true;

    if (correctCount > 180) { alert("ใช้โปรแกรมหรอออ กูริบคะแนน!"); correctCount = 0; wrongCount = 999; }
    if (keyTimings && keyTimings.length > 20) {
        let sum = keyTimings.reduce((a, b) => a + b, 0);
        let avg = sum / keyTimings.length;
        let variance = keyTimings.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / keyTimings.length;
        if (variance < 20) { alert("พิมพ์เนียนเกินไปแล้วไอ้บอท! โดนแบนคะแนน!"); correctCount = 0; wrongCount = 999; }
    }
    // ตัวอักษรที่ถูกต้องมาจากการกดจริง: คนพิมพ์จริงกด ~1 ครั้งต่อ 1 ตัว ถ้าตัวอักษรมากกว่าจำนวนครั้งที่กดเกิน 2 เท่า = ยัดข้อความเข้าช่อง
    if (correctChars > 40 && correctChars > (keyTimings.length + 1) * 2) { alert("ยัดคำเข้าช่องหรอไอ้สัส! ริบคะแนน!"); correctCount = 0; wrongCount = 999; }

    const finalAcc = totalChars > 0 ? Math.round((correctChars/totalChars)*100) : 0; 
    let dbLocal = JSON.parse(localStorage.getItem('typingDB_Final')) || {};
    if (!dbLocal[window.currentUser]) dbLocal[window.currentUser] = { best: 0, exp: 0, history: [] };
    
    let expMultiplier = window.parseMultiplier(dbLocal[window.currentUser].multiplier);
    const roundStart = roundStartedAt || Date.now();
    // อีเวนต์ EXP บูสต์ทั้งเซิร์ฟ: ตาไหนคาบเกี่ยวช่วงอีเวนต์ก็ได้บูสต์
    let boost = window.LiveOps ? window.LiveOps.boostFor(roundStart, Date.now()) : 1;
    // บัตร x2 ของผู้เล่น (เปิดอยู่ช่วงไหนของตาก็นับ)
    const rankCard = window.Levels ? window.Levels.cardMult('rankX2', roundStart) : 1;
    const levelCard = window.Levels ? window.Levels.cardMult('levelX2', roundStart) : 1;
    let gainedExp = Math.round(correctCount * expMultiplier * boost * rankCard);

    // 🆙 EXP เลเวล (แยกจากยศ)
    const lvState = window.Levels ? window.Levels.getState() : { lvXp: 0, coins: 0, cards: {}, starterGiven: true };
    const lvBase = window.Levels ? window.Levels.xpForRound(correctCount, finalAcc) : 0;
    const lvGain = lvBase * levelCard;
    const lvBefore = window.Levels ? window.Levels.info(lvState.lvXp) : null;
    const lvAfter = window.Levels ? window.Levels.info(lvState.lvXp + lvGain) : null;
    const levelsGained = lvBefore ? lvAfter.level - lvBefore.level : 0;
    const rankBefore = (typeof window.getRankInfo === 'function') ? window.getRankInfo(Number(dbLocal[window.currentUser].exp || 0)) : null;
    
    if (!dbLocal[window.currentUser].history) dbLocal[window.currentUser].history = []; 
    dbLocal[window.currentUser].history.unshift({ wpm: correctCount, acc: finalAcc, date: new Date().toLocaleString('th-TH'), ts: Date.now() });
    dbLocal[window.currentUser].history = dbLocal[window.currentUser].history.slice(0, HISTORY_LIMIT);
    
    let optimisticExp = Number(dbLocal[window.currentUser].exp || 0) + gainedExp;
    dbLocal[window.currentUser].exp = optimisticExp; 
    
    let newBest = correctCount > dbLocal[window.currentUser].best ? correctCount : dbLocal[window.currentUser].best;
    dbLocal[window.currentUser].best = newBest;
    
    let bestWpmEl = document.getElementById('bestWPM');
    let currentPersonalBest = bestWpmEl ? parseInt(bestWpmEl.innerText) || 0 : 0;
    if(correctCount > currentPersonalBest && bestWpmEl) { bestWpmEl.innerText = correctCount; }
    
    localStorage.setItem('typingDB_Final', JSON.stringify(dbLocal));

    if (typeof window.forceUpdateExpBar === 'function') {
        window.forceUpdateExpBar(optimisticExp);
    }

    let updateEl = (id, val) => { let el = document.getElementById(id); if(el) el.innerText = val; };
    const rankAfter = (typeof window.getRankInfo === 'function') ? window.getRankInfo(optimisticExp) : null;

    // 🪙 เหรียญตานี้ (บัตรเหรียญ x2 คูณเฉพาะเหรียญจากการเล่น) + รางวัลเลื่อนยศ
    const coinCard = window.Levels ? window.Levels.cardMult('coinX2', roundStart) : 1;
    const roundCoins = window.Levels ? window.Levels.coinsForRound(correctCount, finalAcc) * coinCard : 0;
    const rankReward = (window.Levels && rankBefore && rankAfter)
        ? window.Levels.rankRewards(rankBefore.current.name, rankAfter.current.name, lvState.starterGiven)
        : { coins: 0, ranksGained: 0, starter: false };
    const coinsGained = roundCoins + rankReward.coins;
    // บัตรที่ได้: ขึ้นเลเวลละ 1 ใบ (EXP ยศ x2) + ของขวัญผู้เริ่มต้น (ครบ 3 แบบ ครั้งเดียว)
    const newLevelCards = Math.max(0, levelsGained);
    const cardsGained = {
        rankX2: newLevelCards + (rankReward.starter ? 1 : 0),
        levelX2: rankReward.starter ? 1 : 0,
        coinX2: rankReward.starter ? 1 : 0
    };

    // โชว์ในเครื่องทันที (เซิร์ฟเวอร์ได้ค่าเดียวกันจาก increment ด้านล่าง)
    if (window.Levels) window.Levels.setState({
        ...lvState, lvXp: lvState.lvXp + lvGain, coins: lvState.coins + coinsGained,
        cards: Object.fromEntries(Object.keys(lvState.cards).map(t => [t, lvState.cards[t] + (cardsGained[t] || 0)])),
        starterGiven: lvState.starterGiven || rankReward.starter
    });
    showResult({
        wpm: correctCount, acc: finalAcc, correct: correctCount, wrong: wrongCount, attempts: totalTypeAttempts,
        gainedExp, expMultiplier, boost, rankCard, rankBefore, rankAfter, totalExp: optimisticExp,
        lvGain, lvBefore, lvAfter, levelsGained,
        roundCoins, coinCard, rankReward, coinsGained
    });
    if (window.LiveOps) window.LiveOps.onRoundEnd();
    updateEl('syncStatus', "⏳ กำลังบันทึก...");

    localStorage.removeItem('cachedRankingHtml');
    localStorage.removeItem('cachedRankBoardHtml');
    localStorage.removeItem('mySavedTickerHTML');

    if (window.currentUser && window.db) {
        try {
            const { doc, setDoc, increment, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const currentRankName = (typeof window.getRankInfo === 'function') ? window.getRankInfo(optimisticExp).current.name : "ทหารฝึก";
            // ยศ/เลเวลล่าสุดที่เซิร์ฟเวอร์รู้ (จาก onSnapshot) → ส่งเฉพาะตอนขึ้นจริง Rules ใช้ตรวจเหรียญเลื่อนยศ/บัตรเลเวลอัป
            const known = window.serverProgress || {};
            const rankIdxNow = (window.rankData || []).findIndex(r => r.name === currentRankName);
            const levelNow = lvAfter ? lvAfter.level : 0;

            const userRef = doc(window.db, "users", window.currentUser);
            const base = {
                username: window.currentUser,
                wpm: newBest,
                latest_wpm: correctCount,
                exp: increment(gainedExp), // บวกเพิ่มบนเซิร์ฟเวอร์ ไม่เขียนทับ (กัน EXP หายเวลาแคชในเครื่องเก่า/เล่นหลายเครื่อง)
                last_played: Date.now(),
                last_online: Date.now(), // 🔥 เพิ่มให้ระบบรู้ว่าพิมพ์เสร็จก็ยังออนไลน์อยู่
                last_round: serverTimestamp(), // Rules: ตาละครั้ง ห่างกันอย่างน้อย 50 วิ
                rank: currentRankName,
                history: dbLocal[window.currentUser].history,
                lvXp: increment(lvGain)
            };
            const rewards = {
                ...(rankIdxNow > (known.rankIdx ?? -1) ? { rankIdx: rankIdxNow } : {}),
                ...(levelNow > (known.level ?? 0) ? { level: levelNow } : {}),
                ...(coinsGained > 0 ? { coins: increment(coinsGained) } : {}),
                ...(Object.values(cardsGained).some(n => n > 0) ? {
                    cards: Object.fromEntries(Object.entries(cardsGained).filter(([, n]) => n > 0).map(([t, n]) => [t, increment(n)]))
                } : {}),
                ...(rankReward.starter ? { starterGiven: true } : {})
            };
            try {
                await setDoc(userRef, { ...base, ...rewards }, { merge: true });
            } catch (err) {
                // ข้อมูลในเครื่องไม่ตรงเซิร์ฟเวอร์ (เช่น เล่นหลายเครื่อง) จนรางวัลไม่ผ่าน Rules → เก็บ EXP ไว้ก่อน รางวัลค่อยได้ตาหน้า
                if (err.code !== 'permission-denied' || !Object.keys(rewards).length) throw err;
                await setDoc(userRef, base, { merge: true });
            }

            updateEl('syncStatus', "✅ ดำเนินการเรียบร้อย!");

            if (typeof window.loadTickerData === 'function') {
                console.log("🔄 กำลังอัปเดตโปรดรอสักครู่...");
                window.loadTickerData(); 
            }
        } catch(err) {
            console.error("Firebase Sync Error:", err);
            updateEl('syncStatus', "❌ บันทึกพลาด เน็ตอาจจะหลุด: " + err.message);
        }
    }
}

// 🗯️ คำด่าเกรียนๆ ตามฝีมือ (ชุดเดิมจาก stats.js) + แซวเรื่องความแม่น
function roastFor(wpm, acc) {
    if (!(wpm > 0)) return 'ไม่พิมพ์สักคำ มาเปิดเว็บนั่งดูเฉยๆ หรอไอ้สัส';
    let line = typeof window.getRankText === 'function' ? window.getRankText(wpm) : '';
    if (acc < 70) line += ' • แต่พิมพ์ผิดเยอะสัส ตาบอดหรอ';
    else if (acc >= 97) line += ' • แม่นจัดไอ้เหี้ย';
    return line;
}

// 🏁 เติมหน้าสรุปผล (โล่งๆ: ตัวเลขหลัก + EXP + ข่าวเลื่อนยศ/เลเวลแบบบรรทัดเดียว)
function showResult(r) {
    const $ = id => document.getElementById(id);
    const fmt = n => Number(n || 0).toLocaleString();
    $('rsRoast').textContent = roastFor(r.wpm, r.acc);
    $('resWpm').textContent = r.wpm;
    $('resAcc').textContent = r.acc + '%';
    $('resCorrect').textContent = r.correct;
    $('resWrong').textContent = r.wrong;
    $('resAttempts').textContent = r.attempts;

    $('resExp').textContent = '+' + fmt(r.gainedExp);
    $('resMult').textContent = `${r.correct} คำ × ${r.expMultiplier}` + (r.rankCard > 1 ? ' × 🎖️บัตร x2' : '') + (r.boost > 1 ? ` × 🔥อีเวนต์ x${r.boost}` : '');
    $('resCoins').textContent = '+' + fmt(r.roundCoins);
    $('resCoins').parentElement.title = r.coinCard > 1 ? 'บัตรเหรียญ x2 ทำงานอยู่' : '';
    $('resCoinsX2').hidden = !(r.coinCard > 1);

    // ข่าวดีรอบนี้: เลื่อนยศ / เลเวลอัป / ของขวัญผู้เริ่มต้น (บรรทัดละเรื่อง ไม่รก)
    const news = [];
    const ra = r.rankAfter;
    if (r.rankBefore && ra && ra.current.name !== r.rankBefore.current.name) {
        const icon = window.rankIconUrls && window.rankIconUrls[ra.current.name] ? `<img src="${window.rankIconUrls[ra.current.name]}" alt="">` : '🎖️';
        news.push(`<div class="rs-news-item gold">${icon}<span>เลื่อนยศเป็น <b>${ra.current.name}</b> แล้วโว้ย!</span><b class="rs-news-coin">+${fmt(r.rankReward.coins)} 🪙</b></div>`);
    }
    if (r.rankReward && r.rankReward.starter) {
        news.push(`<div class="rs-news-item green">🎁<span>ของขวัญผู้เริ่มต้น! ได้บัตร <b>EXP ยศ x2 • EXP เลเวล x2 • เหรียญ x2</b> อย่างละใบ</span></div>`);
    }
    if (r.levelsGained > 0) {
        news.push(`<div class="rs-news-item blue"><span class="lv-badge">Lv.${r.lvAfter.level}</span><span>เลเวลอัป! ได้ <b>บัตร EXP ยศ x2</b> ${r.levelsGained} ใบ</span></div>`);
    }
    if (news.length > 0 && (r.levelsGained > 0 || (r.rankReward && r.rankReward.starter))) {
        news.push(`<button type="button" class="rs-news-btn" onclick="Levels.openBag('bag')">🎒 เปิดกระเป๋าใช้บัตร</button>`);
    }
    $('rsNews').innerHTML = news.join('');
    $('rsNews').hidden = !news.length;

    // เลเวล: แถบเล็กๆ ไม่มีตัวเลข
    if (r.lvAfter) {
        $('rsLvBadge').textContent = 'Lv.' + r.lvAfter.level;
        $('rsLvFill').style.width = '0%';
        setTimeout(() => { $('rsLvFill').style.width = r.lvAfter.pct + '%'; }, 250);
    }

    document.getElementById('resultModal').style.display = 'flex';
    resultShownAt = Date.now();
    if (news.length && window.Levels) window.Levels.confetti();
}
let resultShownAt = 0;

// กด Enter ที่หน้าสรุปผล = เล่นอีกตา (หน่วง 1.2 วิ กัน Enter ที่ค้างจากตอนพิมพ์ข้ามหน้าสรุปไปเลย)
document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const modal = document.getElementById('resultModal');
    if (!modal || modal.style.display !== 'flex' || Date.now() - resultShownAt < 1200) return;
    if (document.getElementById('bagModal')?.style.display === 'flex') return;
    e.preventDefault();
    window.resetGame();
});

// 🔄 รีเซ็ตเกมเพื่อเล่นตาใหม่ (เลื่อนยศโชว์ในหน้าสรุปผลแล้ว ไม่ต้องเด้งป๊อปอัปซ้ำ)
window.resetGame = function() {
    window.closeModal('resultModal');
    clearInterval(timer); window.init();
    let ui = document.getElementById('userInput');
    if(ui) setTimeout(() => ui.focus(), 100);
}

// 🏅 ป๊อปอัปเลื่อนยศ
window.showPromotion = function(newRank) {
    let rn = document.getElementById('newRankName'); if(rn) rn.innerText = newRank;
    let pi = document.getElementById('promoIcon'); if(pi) pi.innerHTML = window.getRankIcon ? window.getRankIcon(newRank) : "🎖️"; 
    let pm = document.getElementById('promotionModal'); if(pm) pm.style.display = 'flex';
}

window.closePromotion = function() {
    window.closeModal('promotionModal'); 
    rankAtStart = ""; // รีเซ็ตยศเริ่มต้นใหม่
    clearInterval(timer); 
    window.init();
    let ui = document.getElementById('userInput');
    if(ui) setTimeout(() => ui.focus(), 100);
}

// 📜 ประวัติการพิมพ์
window.showHistory = function() {
    let db = JSON.parse(localStorage.getItem('typingDB_Final')) || {};
    renderHistory(db[window.currentUser] ? db[window.currentUser].history : []);

    let hm = document.getElementById('historyModal');
    if(hm) hm.style.display = 'flex';

    // โชว์ของในเครื่องไปก่อน แล้วดึงจาก Firebase มาเติม (เผื่อเล่นจากเครื่องอื่นมา)
    if (window.db && window.currentUser) {
        import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js")
        .then(({ doc, getDoc }) => getDoc(doc(window.db, "users", window.currentUser)))
        .then(snap => window.syncHistory(snap.exists() ? snap.data().history : []))
        .then(renderHistory)
        .catch(err => console.error("ดึงประวัติไม่สำเร็จ:", err));
    }
}

function renderHistory(myHistory) {
    let hb = document.getElementById('historyBody');
    if (myHistory && myHistory.length > 0 && hb) {
        let tempHtml = "";
        myHistory.forEach((record, index) => {
            let accText = record.acc ? `<br><span style="font-size: 12px; color: #10b981;">(แม่นยำ ${record.acc}%)</span>` : "";
            tempHtml += `<tr style="border-bottom: 1px solid #333; background: rgba(255,255,255,0.02); transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
                <td style="padding: 12px 10px; color: #94a3b8; text-align: center;">${index + 1}</td>
                <td style="padding: 12px 10px; color: var(--primary); font-weight: bold; text-align: center;">${record.wpm} WPM ${accText}</td>
                <td style="padding: 12px 10px; color: #cbd5e1; font-size: 13px; text-align: center;">${record.date}</td>
            </tr>`;
        });
        hb.innerHTML = tempHtml;
    } else if (hb) {
        hb.innerHTML = "<tr><td colspan='3' style='text-align:center; padding:30px; color:#94a3b8;'>ยังไม่มีประวัติเลยไอ้กาก ไปพิมพ์ก่อน!</td></tr>";
    }
}

document.addEventListener('contextmenu', event => event.preventDefault()); // 🔥 กันคลิกขวา

window.addEventListener('keydown', function(e) {
    // ใช้ e.code เพราะบน Mac กด Option แล้ว e.key กลายเป็นอักษรพิเศษ / แป้นไทยก็ได้อักษรไทย
    const k = (e.code && e.code.startsWith('Key') ? e.code.slice(3) : (e.key || '')).toUpperCase();
    const mod = e.ctrlKey || e.metaKey; // metaKey = ปุ่ม Cmd บน Mac
    if (e.key === 'F12' || e.keyCode === 123 ||
       (mod && e.shiftKey && ['I', 'J', 'C', 'K', 'M'].includes(k)) ||  // DevTools / Console (Chrome, Edge, Firefox)
       (e.metaKey && e.altKey && ['I', 'J', 'C', 'U'].includes(k)) ||   // DevTools บน Mac (Cmd+Opt+I/J/C/U)
       (mod && (k === 'U' || k === 'S' || k === 'P'))) {                // ดูซอร์ส / เซฟหน้า / พิมพ์หน้า
        e.preventDefault(); 
        e.stopPropagation(); 
        return false; 
    }
}, true);
