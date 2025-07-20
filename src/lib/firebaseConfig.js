import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

// Only import analytics on the client
let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyA0XLfjSZExe4yxpiGwlo49dzk-mO0b_c4",
  authDomain: "svelte-testing-ed7a2.firebaseapp.com",
  projectId: "svelte-testing-ed7a2",
  storageBucket: "svelte-testing-ed7a2.firebasestorage.app",
  messagingSenderId: "500967770654",
  appId: "1:500967770654:web:02559873e20c1359ae7c0f",
  measurementId: "G-F8M5S7JJTZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);