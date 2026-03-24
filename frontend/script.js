// 🔥 FIREBASE IMPORT (TOP pe rehna chahiye)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// 🔴 REPLACE THIS (Firebase config yaha paste kar)
const firebaseConfig = {
 apiKey: "AIzaSyCEdsiiuvoV8H7M3r9fAIQYc-iB5F2p7ZU",
    authDomain: "voice-ai-65f10.firebaseapp.com",
    projectId: "voice-ai-65f10",
    storageBucket: "voice-ai-65f10.firebasestorage.app",
    messagingSenderId: "514888375853",
    appId: "1:514888375853:web:0e020c8227429150f0e2a4",

};


// 🔥 Firebase initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// 💾 Save chat function
async function saveMessage(user, ai) {
  try {
    await addDoc(collection(db, "chats"), {
      user: user,
      ai: ai,
      timestamp: new Date()
    });
    console.log("Saved to Firebase");
  } catch (e) {
    console.error("Error saving:", e);
  }
}


// 🎤 Speech Recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";


// 🎤 Start listening
function startListening() {
  console.log("Mic started 🎤"); // 👈 ADD THIS
  recognition.start();
}
window.startListening = startListening;

// 🎤 When user speaks
recognition.onresult = async function(event) {
  const text = event.results[0][0].transcript;

  addMessage("You", text);

  try {
    const res = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    addMessage("AI", data.reply);

    speak(data.reply);

    // 🔥 SAVE TO FIREBASE
    saveMessage(text, data.reply);

  } catch (err) {
    console.error("Error:", err);
    addMessage("AI", "Error connecting to server");
  }
};


// 🔊 Text to Speech
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(speech);
}


// 💬 Show messages on UI
function addMessage(sender, text) {
  const chat = document.getElementById("chat");
  chat.innerHTML += `<p><b>${sender}:</b> ${text}</p>`;
}