import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const getPricing = async () => {
    const snap = await getDoc(doc(db, "config", "pricing"));
    if (snap.exists()) return snap.data();
    return { plusPrice: "9.99", currencySymbol: "৳" };
};

export const updatePricing = async (data) => {
    await setDoc(doc(db, "config", "pricing"), data, { merge: true });
};