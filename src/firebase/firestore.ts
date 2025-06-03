// Firestore helpers for users, products, and orders

import { db } from "./firebaseConfig";
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, query, where, serverTimestamp, orderBy, onSnapshot
} from "firebase/firestore";

// --- User CRUD ---
// Create a user document in Firestore
export const createUserDoc = (uid: string, data: any) => setDoc(doc(db, "users", uid), data);
// Get a user document by UID
export const getUserDoc = (uid: string) => getDoc(doc(db, "users", uid));
// Update a user document by UID
export const updateUserDoc = (uid: string, data: any) => updateDoc(doc(db, "users", uid), data);
// Delete a user document by UID
export const deleteUserDoc = (uid: string) => deleteDoc(doc(db, "users", uid));

// Alias for Profile.tsx compatibility (edit profile)
export const updateUserProfile = updateUserDoc;

// --- Product CRUD ---
// Add a new product
export const addProduct = (data: any) => addDoc(collection(db, "products"), data);
// Get all products
export const getProducts = () => getDocs(collection(db, "products"));
// Update a product by ID
export const updateProduct = (id: string, data: any) => updateDoc(doc(db, "products", id), data);
// Delete a product by ID
export const deleteProduct = (id: string) => deleteDoc(doc(db, "products", id));

// --- Order CRUD ---
// Add a new order (with server timestamp)
export const addOrder = (data: any) =>
  addDoc(collection(db, "orders"), { ...data, createdAt: serverTimestamp() });
// Get all orders for a user
export const getOrdersByUser = (uid: string) =>
  getDocs(query(collection(db, "orders"), where("userId", "==", uid)));
// Get a single order by ID
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