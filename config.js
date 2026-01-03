/* FILENAME: config.js
   FUNCTION: Sambungan ke Database TUNG_SAHUR & System Check
*/

const firebaseConfig = {
    apiKey: "AIzaSyCFD82tYIoR45NeGzXSq4omaWUsXUvBRd4",
    authDomain: "geng-tungsahur.firebaseapp.com",
    // 👇 LINK DATABASE (Jangan ubah, ini link Asia Server kau)
    databaseURL: "https://geng-tungsahur-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "geng-tungsahur",
    storageBucket: "geng-tungsahur.firebasestorage.app",
    messagingSenderId: "486702666294",
    appId: "1:486702666294:web:a477db2b1ab96a90243e97"
};

// 1. INITIALIZE FIREBASE (Safety Check)
// Kita check dulu app dah ada ke belum supaya tak crash kalau reload
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase Initialized");
} else {
    firebase.app(); // Guna instance sedia ada
}

// 2. DEFINE DATABASE
const db = firebase.database();

// 3. CONNECTION MONITOR (Feature 'Padu')
// Script ni akan check live user ada internet ke tak
const connectedRef = db.ref(".info/connected");
connectedRef.on("value", (snap) => {
    if (snap.val() === true) {
        console.log("🟢 SYSTEM ONLINE: Connected to Server.");
    } else {
        console.log("🔴 SYSTEM OFFLINE: Connection Lost.");
    }
});

// 4. GLOBAL FUNCTIONS (Boleh guna kat mana-mana page)

// Function Check Login (Letak kat atas setiap page nanti)
function checkAuth() {
    if(!localStorage.getItem('username')) {
        window.location.href = 'login.html';
    }
}

// Function Logout dengan Animation (Akan dipanggil nanti)
function confirmLogout() {
    // Kita akan inject modal HTML guna Javascript je nanti
    // Supaya tak payah copy paste modal kat setiap page
    const modalHTML = `
        <div id="logoutModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(5px);">
            <div style="background:#000; border:2px solid #ff0055; padding:30px; text-align:center; width:80%; max-width:300px; border-radius:10px; box-shadow:0 0 20px rgba(255,0,85,0.4);">
                <h2 style="color:#ff0055; margin-top:0;">WARNING</h2>
                <p style="color:#fff;">Nak blah dah ke geng?</p>
                <div style="margin-top:20px; display:flex; gap:10px;">
                    <button onclick="executeLogout()" style="flex:1; padding:10px; background:#ff0055; color:white; border:none; border-radius:5px; font-weight:bold; cursor:pointer;">BLAH</button>
                    <button onclick="document.getElementById('logoutModal').remove()" style="flex:1; padding:10px; background:#333; color:white; border:none; border-radius:5px; cursor:pointer;">STAY</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function executeLogout() {
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}