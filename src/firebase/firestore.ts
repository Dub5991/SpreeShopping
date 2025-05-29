// src/firebase/firestore.ts
import { db } from "./firebaseConfig";
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc,
  collection, addDoc, getDocs, query, where, serverTimestamp
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