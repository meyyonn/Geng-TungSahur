// --- CONFIG FIREBASE (Kekal Sama) ---
const firebaseConfig = {
    apiKey: "AIzaSyCFD82tYIoR45NeGzXSq4omaWUsXUvBRd4",
    authDomain: "geng-tungsahur.firebaseapp.com",
    databaseURL: "https://geng-tungsahur-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "geng-tungsahur",
    storageBucket: "geng-tungsahur.firebasestorage.app",
    messagingSenderId: "486702666294",
    appId: "1:486702666294:web:a477db2b1ab96a90243e97"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

// --- NAVIGATION ---
function showSection(id, element) {
    document.querySelectorAll('.cyber-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    element.classList.add('active');
    
    if(id === 'chat') {
        const chat = document.getElementById('chat-display');
        chat.scrollTop = chat.scrollHeight;
    }
}

function toggleUpdateForm() {
    const form = document.getElementById('updateFormPanel');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// --- SYSTEM PROFILE (DENGAN GAMBAR) ---
const fullProfileList = document.getElementById('full-profile-list');
const miniProfileList = document.getElementById('mini-profile-list');

db.ref('operatives').on('value', (snapshot) => {
    fullProfileList.innerHTML = "";
    miniProfileList.innerHTML = "";
    
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const name = childSnapshot.key;
            const data = childSnapshot.val();
            let timeString = data.timestamp ? new Date(data.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-";

            // LOGIC GAMBAR: Kalau ada link gambar, guna link tu. Kalau takde, guna icon default.
            let imageHTML = `<i class="fa-solid fa-user-astronaut" style="font-size:2em; color:#005f3d;"></i>`;
            
            if (data.photoURL && data.photoURL.length > 5) {
                // Style untuk gambar background
                imageHTML = `<div style="width:100%; height:100%; background-image: url('${data.photoURL}'); background-size: cover; background-position: center;"></div>`;
            }

            // 1. KAD BESAR (Biodata)
            fullProfileList.innerHTML += `
                <div class="bio-card">
                    <div class="bio-image-slot">
                        ${imageHTML}
                    </div>
                    <div class="bio-info">
                        <h3>${name}</h3>
                        <div class="bio-detail">
                            <p>STATUS: <span style="color:#fff">${data.status || 'Offline'}</span></p>
                            <p>SKILL: <span style="color:#ff0055">${data.skill || '-'}</span></p>
                            <p style="font-size:0.7em; margin-top:5px;">Last Update: ${timeString}</p>
                        </div>
                    </div>
                </div>
            `;

            // 2. LIST KECIL (Home)
            miniProfileList.innerHTML += `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #222; padding:5px 0;">
                    <span>${name}</span>
                    <span style="color:${data.status ? '#00ff9d' : '#555'}">${data.status ? 'ONLINE' : 'OFFLINE'}</span>
                </div>
            `;
        });
    }
});

// UPDATE DATA (Sekarang boleh update gambar sekali)
function updateProfile() {
    const name = document.getElementById('editName').value;
    const status = document.getElementById('editStatus').value;
    const skill = document.getElementById('editSkill').value;
    const photoURL = document.getElementById('editImage').value; // Ambil link gambar

    if(!status) return alert("Isi status dulu geng!");

    // Data yang nak dihantar
    let updateData = {
        status: status,
        skill: skill,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // Kalau user ada masukkan link gambar, baru kita update gambar sekali
    if(photoURL && photoURL.length > 5) {
        updateData.photoURL = photoURL;
    }

    db.ref('operatives/' + name).update(updateData)
    .then(() => {
        alert("Data " + name + " berjaya update!");
        toggleUpdateForm();
        // Clear input form
        document.getElementById('editStatus').value = "";
        document.getElementById('editSkill').value = "";
        document.getElementById('editImage').value = "";
    });
}

// --- CHAT SYSTEM ---
const chatDisplay = document.getElementById('chat-display');
db.ref('comms').limitToLast(30).on('value', (snapshot) => {
    chatDisplay.innerHTML = "";
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            // Chat ni simple, takde nama user (Anonymous) sebab takde login system lagi
            // Tapi boleh manual letak nama dalam input kalau nak
            chatDisplay.innerHTML += `
                <div class="chat-msg">
                    <span class="sender">ANONYMOUS</span>
                    ${data.message}
                </div>
            `;
        });
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
});

function sendMessage() {
    const msgInput = document.getElementById('msgInput');
    if(!msgInput.value) return;
    db.ref('comms').push({ message: msgInput.value, timestamp: firebase.database.ServerValue.TIMESTAMP });
    msgInput.value = "";
}

// --- GAMES & ROULETTE ---
const names = ["Amirul", "Adli", "Haikal", "Haziq", "Nabil"];
const gamesList = ["MLBB", "PUBG", "CODM", "ROBLOX", "EFOOTBALL", "TIDUR"];

function decideGame() {
    runRandomizer(document.getElementById('gameResult'), gamesList, "#00ff9d");
}

function spinRoulette() {
    const el = document.getElementById('rouletteResult');
    el.classList.add('glitch-effect');
    runRandomizer(el, names, "#ff0055", true);
}

function runRandomizer(element, list, color, stopGlitch = false) {
    let i = 0;
    element.style.color = "#fff";
    const interval = setInterval(() => {
        element.innerText = list[Math.floor(Math.random() * list.length)];
        i++;
        if(i > 20) {
            clearInterval(interval);
            element.style.color = color;
            if(stopGlitch) element.classList.remove('glitch-effect');
        }
    }, 60);
}