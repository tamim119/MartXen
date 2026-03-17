import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const getPaymentSettings = async (storeId) => {
    const ref = doc(db, "stores", storeId, "settings", "payment");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
};

export const updatePaymentSettings = async (storeId, data) => {
    const ref = doc(db, "stores", storeId, "settings", "payment");
    await setDoc(ref, data, { merge: true });
};