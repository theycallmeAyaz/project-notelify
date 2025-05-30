import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDq3rL0kvOdAPvy4c8IkJDyxYGMkDYdfQM",
  authDomain: "chatconnect-01-b7ada.firebaseapp.com",
  projectId: "chatconnect-01-b7ada",
  storageBucket: "chatconnect-01-b7ada.firebasestorage.app",
  messagingSenderId: "652756911121",
  appId: "1:652756911121:web:618f2b408ffe4ac4aeddb0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;