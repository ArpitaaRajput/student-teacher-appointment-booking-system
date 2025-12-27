import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBO-S-eGSnayIwtNGuy2XrMF8ajolRj-mQ",
  authDomain: "teacher-student-booking-system.firebaseapp.com",
  projectId: "teacher-student-booking-system",
  storageBucket: "teacher-student-booking-system.appspot.com",
  messagingSenderId: "93701213872",
  appId: "1:93701213872:web:02a7ad8d18c9e55136b575",
  measurementId: "G-SHFR9CN4KS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
