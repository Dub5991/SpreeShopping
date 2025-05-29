// src/firebase/firebaseConfig.ts
// Firebase configuration and initialization

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDl29kB3wbPcngkrpsZ0KjxME-WJS-L81E",
  authDomain: "spree-cea52.firebaseapp.com",
  projectId: "spree-cea52",
  storageBucket: "spree-cea52.firebasestorage.app",
  messagingSenderId: "529514865546",
  appId: "1:529514865546:web:c100a29b77ed5308249e73"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);