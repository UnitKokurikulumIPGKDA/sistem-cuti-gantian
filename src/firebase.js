// src/firebase.js

// Import fungsi yang kita perlukan dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase anda yang telah anda sediakan
const firebaseConfig = {
  apiKey: "AIzaSyAzz5OC3jT-ilING6D2KtX400MXudx4wrE",
  authDomain: "sistem-cuti-gantian.firebaseapp.com",
  projectId: "sistem-cuti-gantian",
  storageBucket: "sistem-cuti-gantian.firebasestorage.app",
  messagingSenderId: "474676599815",
  appId: "1:474676599815:web:a8628a56c9b4b08e0cdea2",
  measurementId: "G-H3N3VPX2FJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize dan eksport perkhidmatan Firebase supaya boleh digunakan di fail lain
export const auth = getAuth(app);      // Untuk menguruskan pengesahan pengguna (login, signup)
export const db = getFirestore(app);   // Untuk berhubung dengan pangkalan data Firestore