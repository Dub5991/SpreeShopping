// src/firebase/firestore.ts - Firestore helpers for users, products, and orders

import { db } from "./firebaseConfig";
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, query, where, serverTimestamp, orderBy, onSnapshot
} from "firebase/firestore";

// --- User CRUD ---
export const createUserDoc = (uid: string, data: any) => setDoc(doc(db, "users", uid), data);
export const getUserDoc = (uid: string) => getDoc(doc(db, "users", uid));
export const updateUserDoc = (uid: string, data: any) => updateDoc(doc(db, "users", uid), data);
export const deleteUserDoc = (uid: string) => deleteDoc(doc(db, "users", uid));

// Alias for Profile.tsx compatibility (edit profile)
export const updateUserProfile = updateUserDoc;

// --- Product CRUD ---
export const addProduct = (data: any) => addDoc(collection(db, "products"), data);
export const getProducts = () => getDocs(collection(db, "products"));
export const updateProduct = (id: string, data: any) => updateDoc(doc(db, "products", id), data);
export const deleteProduct = (id: string) => deleteDoc(doc(db, "products", id));

// --- Order CRUD ---
export const addOrder = (data: any) =>
  addDoc(collection(db, "orders"), { ...data, createdAt: serverTimestamp() });
export const getOrdersByUser = (uid: string) =>
  getDocs(query(collection(db, "orders"), where("userId", "==", uid)));
export const getOrder = (id: string) => getDoc(doc(db, "orders", id));

// --- Real-time Order Listener for Current User ---
/**
 * Listen for real-time updates to the current user's orders, sorted by most recent.
 * @param uid User ID
 * @param callback Function to call with Firestore snapshot
 * @returns Unsubscribe function
 */
export function getOrdersByUserRealtime(
  uid: string,
  callback: (snapshot: any) => void
) {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, callback);
}