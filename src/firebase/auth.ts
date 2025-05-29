// src/firebase/auth.ts
// Authentication helpers: register, login, logout

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { auth } from "./firebaseConfig";
// Ensure that './firebaseConfig' exports 'auth' as: export const auth = getAuth(app);

// Register a new user with email and password
export const register = (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login user with email and password
export const login = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout the current user
export const logout = (): Promise<void> => {
  return signOut(auth);
};

// Send password reset email
export const sendPasswordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};