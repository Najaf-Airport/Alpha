// js/script.js

import { auth, db } from "./firebase-init.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
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

const ADMIN_EMAIL = "ahmedaltalqani@gmail.com";

// عناصر DOM
let loginForm, emailInput, passwordInput, loginMessage;
let logoutBtn, userEmailSpan;
let welcomeMessage, flightFormsContainer, saveAllFlightsBtn, messageContainer, userPastFlightsTableBody, currentMonthNameSpan;
let filterMonthInput, filterUserSelect, applyFiltersBtn, exportAdminStatsBtn, exportAdminAllFlightsBtn;

document.addEventListener("DOMContentLoaded", () => {
  // مشتركة
  logoutBtn = document.getElementById("logoutBtn");
  userEmailSpan = document.getElementById("userEmail");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  // صفحة الدخول
  if (document.getElementById("loginView")) {
    loginForm = document.getElementById("loginForm");
    emailInput = document.getElementById("email");
    passwordInput = document.getElementById("password");
    loginMessage = document.getElementById("loginMessage");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);
  }

  // صفحة المستخدم
  if (document.getElementById("flightsView")) {
    welcomeMessage = document.getElementById("welcomeMessage");
    flightFormsContainer = document.getElementById("flightFormsContainer");
    saveAllFlightsBtn = document.getElementById("saveAllFlightsBtn");
    messageContainer = document.getElementById("messageContainer");
    userPastFlightsTableBody = document.querySelector("#userPastFlightsTable tbody");
    currentMonthNameSpan = document.getElementById("currentMonthName");
    if (saveAllFlightsBtn) saveAllFlightsBtn.addEventListener("click", saveAllFlights);
    generateFlightForms(4);
    const today = new Date();
    currentMonthNameSpan.textContent = today.toLocaleString("ar-IQ", { month: "long" });
  }

  // صفحة المسؤول
  if (document.getElementById("adminView")) {
    filterMonthInput = document.getElementById("filterMonth");
    filterUserSelect = document.getElementById("filterUser");
    applyFiltersBtn = document.getElementById("applyFiltersBtn");
    exportAdminStatsBtn = document.getElementById("exportAdminStatsToWordBtn");
    exportAdminAllFlightsBtn = document.getElementById("exportAdminAllFlightsToWordBtn");
    if (applyFiltersBtn) applyFiltersBtn.addEventListener("click", loadAdminData);
    if (exportAdminStatsBtn) exportAdminStatsBtn.addEventListener("click", () =>
      exportAdminDataToDocx('stats', {}, filterMonthInput.value, filterUserSelect.value)
    );
    if (exportAdminAllFlightsBtn) exportAdminAllFlightsBtn.addEventListener("click", () =>
      exportAdminDataToDocx('allFlights', {}, filterMonthInput.value, filterUserSelect.value)
    );
    const today = new Date();
    filterMonthInput.value = `${today.getFullYear()}-${(today.getMonth()+1).toString().padStart(2,'0')}`;
  }

  // مراقبة حالة المصادقة
  onAuthStateChanged(auth, user => {
    if (user) {
      userEmailSpan && (userEmailSpan.textContent = user.email);
      logoutBtn && (logoutBtn.style.display = "inline-block");
      if (user.email === ADMIN_EMAIL) {
        if (!window.location.pathname.includes("admin.html")) {
          window.location.href = "./admin.html";
        } else {
          loadAdminData();
        }
      } else {
        if (!window.location.pathname.includes("flights.html")) {
          window.location.href = "./flights.html";
        } else {
          welcomeMessage && (welcomeMessage.textContent = `مرحباً بك، ${user.email}`);
          loadUserFlights(user.uid);
        }
      }
    } else {
      if (!window.location.pathname.includes("index.html")) {
        window.location.href = "./index.html";
      }
      logoutBtn && (logoutBtn.style.display = "none");
    }
  });
});

// تسجيل الدخول
async function handleLogin(e) {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value.trim());
  } catch (err) {
    showMessage(loginMessage, "خطأ في البريد أو كلمة المرور.", true);
  }
}

// تسجيل الخروج
function handleLogout() {
  signOut(auth);
}

// بقية الدوال (generateFlightForms, saveAllFlights, loadUserFlights, loadAdminData, showMessage)...
// تأكد أنها مطابقة لما راجعناه سابقًا.
