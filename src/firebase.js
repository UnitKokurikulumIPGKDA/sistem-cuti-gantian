// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Gantikan dengan konfigurasi Firebase anda
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "sistem-cuti-gantian.firebaseapp.com",
  projectId: "sistem-cuti-gantian",
  storageBucket: "sistem-cuti-gantian.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);