// --- 1. CONFIGURATION (DAH UPDATE DENGAN ID KAU) ---
const firebaseConfig = {
    apiKey: "AIzaSyCFD82tYIoR45NeGzXSq4omaWUsXUvBRd4",
    authDomain: "geng-tungsahur.firebaseapp.com",
    databaseURL: "https://geng-tungsahur-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "geng-tungsahur",
    storageBucket: "geng-tungsahur.firebasestorage.app",
    messagingSenderId: "486702666294",
    appId: "1:486702666294:web:a477db2b1ab96a90243e97"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

console.log("🔥 SYSTEM CONNECTED: GENG TUNGSAHUR");

// --- 2. NAVIGATION SYSTEM ---
function showSection(id) {
    // Sorok semua section
    document.querySelectorAll('section').forEach(sec => {
        sec.style.display = 'none';
    });
    // Tunjuk section yang dipilih
    document.getElementById(id).style.display = 'block';
    
    // Auto scroll chat ke bawah kalau buka chat
    if(id === 'wishes') {
        const chatDisplay = document.getElementById('chat-display');
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
}

// --- 3. PROFILE SYSTEM (LIVE) ---
const profileList = document.getElementById('profile-list');

// BACA DATA (Read)
db.ref('operatives').on('value', (snapshot) => {
    profileList.innerHTML = ""; // Bersihkan list dulu
    
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const name = childSnapshot.key;
            const data = childSnapshot.val();
            
            // Format masa (convert dari timestamp)
            let timeString = "-";
            if(data.timestamp) {
                const date = new Date(data.timestamp);
                timeString = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }

            const html = `
                <div class="profile-card">
                    <h3>${name}</h3>
                    <div class="profile-data">
                        <p>STATUS: <span style="color:#00ff9d">${data.status || 'AFK'}</span></p>
                        <p>SKILL: <span style="color:#ff0055">${data.skill || 'Unknown'}</span></p>
                        <p style="font-size:0.7em; margin-top:5px; color:#555">UPDATED: ${timeString}</p>
                    </div>
                </div>
            `;
            profileList.innerHTML += html;
        });
    } else {
        profileList.innerHTML = "<div class='loading'>DATABASE KOSONG. UPDATE LA DULU!</div>";
    }
});

// TULIS DATA (Update)
function updateProfile() {
    const name = document.getElementById('editName').value;
    const status = document.getElementById('editStatus').value;
    const skill = document.getElementById('editSkill').value;

    if(!status) return alert("Woi, isi status dulu!");

    db.ref('operatives/' + name).update({
        status: status,
        skill: skill,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    })
    .then(() => {
        alert("Status " + name + " berjaya di-update!");
        document.getElementById('editStatus').value = ""; // Kosongkan input
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Gagal update. Check internet/console.");
    });
}

// --- 4. CHAT SYSTEM (COMMS) ---
const chatDisplay = document.getElementById('chat-display');

// BACA CHAT (Ambil 20 last chat je)
db.ref('comms').limitToLast(20).on('value', (snapshot) => {
    chatDisplay.innerHTML = "";
    
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            chatDisplay.innerHTML += `
                <div class="msg">
                    <span>ANONYMOUS:</span> ${data.message}
                </div>
            `;
        });
        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll bawah
    }
});

// HANTAR CHAT
function sendMessage() {
    const msg = document.getElementById('msgInput').value;
    if(!msg) return;

    db.ref('comms').push({
        message: msg,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
    
    document.getElementById('msgInput').value = ""; // Clear input
}

// --- 5. GACHA SYSTEM (Local) ---
const names = ["Amirul", "Adli", "Haikal", "Haziq", "Nabil"];

function spinGacha() {
    const display = document.getElementById('gachaResult');
    let i = 0;
    
    display.style.color = "#ff0055"; // Merah masa pusing
    
    const interval = setInterval(() => {
        display.innerText = names[Math.floor(Math.random() * names.length)];
        i++;
        if(i > 20) {
            clearInterval(interval);
            display.style.color = "#00ff9d"; // Hijau bila berhenti
        }
    }, 50);
}