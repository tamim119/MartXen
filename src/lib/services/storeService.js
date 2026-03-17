import { db } from "../firebase";
import { uploadProductImage } from "../supabase";
import {
    collection, doc, addDoc, getDoc, getDocs,
    updateDoc, query, where, serverTimestamp
} from "firebase/firestore";

export const createStore = async (userId, data, logoFile) => {
    // username unique check
    const existing = await getDocs(
        query(collection(db, "stores"), where("username", "==", data.username))
    );
    if (!existing.empty) throw new Error("Username already taken!");

    let logo = "";
    if (logoFile) logo = await uploadProductImage(logoFile, `store-${userId}`);

    const ref = await addDoc(collection(db, "stores"), {
        ...data,
        userId,
        logo,
        status: "approved",   // ✅ সরাসরি approved
        isActive: true,        // ✅ সরাসরি active
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
};

export const getStoreByUser = async (userId) => {
    const snap = await getDocs(
        query(collection(db, "stores"), where("userId", "==", userId))
    );
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
};

export const getStoreById = async (storeId) => {
    const snap = await getDoc(doc(db, "stores", storeId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getAllStores = async () => {
    const snap = await getDocs(collection(db, "stores"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateStore = async (storeId, data, logoFile) => {
    let logo = data.logo || "";
    if (logoFile) logo = await uploadProductImage(logoFile, `store-${storeId}`);
    await updateDoc(doc(db, "stores", storeId), {
        ...data, logo, updatedAt: serverTimestamp(),
    });
};

// Admin only
export const updateStoreStatus = async (storeId, status, isActive) => {
    await updateDoc(doc(db, "stores", storeId), {
        status, isActive, updatedAt: serverTimestamp(),
    });
};