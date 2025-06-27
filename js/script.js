// ✅ js/script.js (مُحدث)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
  exportSingleFlightToDocx,
  exportAdminDataToDocx
} from "./docx-export.js";

const firebaseConfig = {
  apiKey: "AIzaSyAIz4dQIZS41PcfL3qXOhc-ybouBZWMjuc",
  authDomain: "najfe2025.firebaseapp.com",
  projectId: "najfe2025",
  storageBucket: "najfe2025.appspot.com",
  messagingSenderId: "113306479969",
  appId: "1:113306479969:web:27a72a1c3da7918a18e920"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const ADMIN_EMAIL = "ahmedaltalqani@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginMessage = document.getElementById("loginMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(
          auth,
          emailInput.value.trim(),
          passwordInput.value.trim()
        );
      } catch (err) {
        loginMessage.textContent = "خطأ في البريد أو كلمة المرور.";
        loginMessage.style.color = "red";
      }
    });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.email === ADMIN_EMAIL) {
        if (!window.location.href.includes("admin.html")) {
          window.location.href = "admin.html";
        }
      } else {
        if (!window.location.href.includes("flights.html")) {
          window.location.href = "flights.html";
        }
      }
    }
  });
});
