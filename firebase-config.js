// ========================================================
// 🔧 firebase-config.js - ค่าเชื่อมต่อ Firebase (ทุกหน้าใช้ไฟล์นี้ไฟล์เดียว)
// ย้ายฐานข้อมูลครั้งหน้า = เอา firebaseConfig ของโปรเจกต์ใหม่มาวางทับตรงนี้ที่เดียว
// ========================================================

// ฐานข้อมูลที่เว็บใช้จริง (โปรเจกต์ใหม่ pimdeed)
window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyARwrl4ejollONyBCgRB_vM9Wv9Iv6fPMc",
    authDomain: "pimdeed-b3e32.firebaseapp.com",
    projectId: "pimdeed-b3e32",
    storageBucket: "pimdeed-b3e32.firebasestorage.app",
    messagingSenderId: "601232519148",
    appId: "1:601232519148:web:24f9bad9bff236377b5ac9"
};

// ไอดีแอดมินในเกม: เปิดหลายเครื่องพร้อมกันได้ไม่โดนเตะ
// (เข้าหน้าหลังบ้าน Admin.html ใช้อีเมลใน Firebase Authentication + รายชื่อ adminEmails ใน firestore.rules)
window.ADMIN_IDS = ["aqwe0112233", "好运"];
