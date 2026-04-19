// 🔥 FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 🔴 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCEdsiiuvoV8H7M3r9fAIQYc-iB5F2p7ZU",
  authDomain: "voice-ai-65f10.firebaseapp.com",
  projectId: "voice-ai-65f10",
  storageBucket: "voice-ai-65f10.firebasestorage.app",
  messagingSenderId: "514888375853",
  appId: "1:514888375853:web:0e020c8227429150f0e2a4",
};

// 🔥 Firebase init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 💾 Save chat
async function saveMessage(user, ai) {
  try {
    await addDoc(collection(db, "chats"), {
      user,
      ai,
      timestamp: new Date()
    });
  } catch (e) {
    console.error("Error saving:", e);
  }
}

// 🎤 Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

// 🎤 Start mic
function startListening() {
  console.log("Mic started 🎤");
  recognition.start();
}
window.startListening = startListening;

// 🎤 When user speaks
recognition.onresult = async function(event) {
  const text = event.results[0][0].transcript;

  addMessage("You", text);

  try {
    // Naya
const res = await fetch("https://voice-ai1-2.onrender.com/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    addMessage("AI", data.reply);

    // 🔊 AUDIO FROM BACKEND (FINAL FIX)
    if (data.audio) {
      const audio = new Audio("data:audio/mp3;base64," + data.audio);
      audio.play();
    }

    saveMessage(text, data.reply);

  } catch (err) {
    console.error("Error:", err);
    addMessage("AI", "Error connecting to server");
  }
};

// 💬 UI
function addMessage(sender, text) {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
}
