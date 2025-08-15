import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQQxM5wnQp3YrQcBhPIaoFiXou-W6mXPY",
  authDomain: "tuwebai-db.firebaseapp.com",
  projectId: "tuwebai-db",
  storageBucket: "tuwebai-db.firebasestorage.app",
  messagingSenderId: "651201653645",
  appId: "1:651201653645:web:763272f73030afa2166bc4",
  measurementId: "G-7330JWGM4C"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); 