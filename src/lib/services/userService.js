import { db } from "../firebase";
import {
    doc, setDoc, getDoc, updateDoc,
    collection, addDoc, getDocs, deleteDoc
} from "firebase/firestore";

// ─── User ───────────────────────────────────────────
export const createUser = async (user) => {
    try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        
        if (snap.exists()) {
            console.log("User already exists in Firestore");
            return snap.data();
        }
        
        const userData = {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            photo: user.photoURL || "",
            cart: { items: [], total: 0 },
            role: "customer",
            createdAt: new Date(),
        };
        
        await setDoc(ref, userData);
        console.log("User created in Firestore:", userData);
        return userData;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const getUser = async (uid) => {
    try {
        const snap = await getDoc(doc(db, "users", uid));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
        console.error("Error getting user:", error);
        return null;
    }
};

export const updateUser = async (uid, data) => {
    try {
        await updateDoc(doc(db, "users", uid), {
            ...data,
            updatedAt: new Date(),
        });
        console.log("User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

// ─── Addresses ──────────────────────────────────────
export const addAddress = async (uid, address) => {
    try {
        const ref = await addDoc(
            collection(db, "users", uid, "addresses"),
            { 
                ...address, 
                userId: uid, 
                createdAt: new Date() 
            }
        );
        console.log("Address added:", ref.id);
        return ref.id;
    } catch (error) {
        console.error("Error adding address:", error);
        throw error;
    }
};

export const getAddresses = async (uid) => {
    try {
        const snap = await getDocs(collection(db, "users", uid, "addresses"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error("Error getting addresses:", error);
        return [];
    }
};

export const deleteAddress = async (uid, addressId) => {
    try {
        await deleteDoc(doc(db, "users", uid, "addresses", addressId));
        console.log("Address deleted:", addressId);
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
};

export const updateAddress = async (uid, addressId, data) => {
    try {
        await updateDoc(
            doc(db, "users", uid, "addresses", addressId),
            {
                ...data,
                updatedAt: new Date(),
            }
        );
        console.log("Address updated:", addressId);
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
};

export const setDefaultAddress = async (uid, addressId) => {
    try {
        // Get all addresses
        const addresses = await getAddresses(uid);
        
        // Update all addresses to remove default
        const updatePromises = addresses.map(addr => 
            updateDoc(
                doc(db, "users", uid, "addresses", addr.id),
                { isDefault: addr.id === addressId }
            )
        );
        
        await Promise.all(updatePromises);
        console.log("Default address set:", addressId);
    } catch (error) {
        console.error("Error setting default address:", error);
        throw error;
    }
};