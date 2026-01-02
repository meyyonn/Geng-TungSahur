// config.js
// --- CONFIGURATION FIREBASE KAU ---
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
// Code ni check kalau firebase belum start, dia startkan.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

console.log("🔥 SYSTEM CONNECTED: GENG TUNG SAHUR");