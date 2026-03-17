import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Get admin payment settings (global/default settings)
export const getAdminPaymentSettings = async () => {
    try {
        const ref = doc(db, "settings", "adminPayment");
        const snap = await getDoc(ref);
        
        // যদি document না থাকে, default data দিয়ে create করে দাও
        if (!snap.exists()) {
            const defaultData = {
                bkash:  { enabled: false, number: "" },
                nagad:  { enabled: false, number: "" },
                rocket: { enabled: false, number: "" },
            };
            await setDoc(ref, defaultData);
            console.log("Created default payment settings in Firebase");
            return defaultData;
        }
        
        return snap.data();
    } catch (error) {
        console.error("Error in getAdminPaymentSettings:", error);
        throw error;
    }
};

// Update admin payment settings
export const updateAdminPaymentSettings = async (data) => {
    try {
        const ref = doc(db, "settings", "adminPayment");
        await setDoc(ref, data, { merge: true });
        console.log("Successfully saved to Firebase:", data);
    } catch (error) {
        console.error("Error in updateAdminPaymentSettings:", error);
        throw error;
    }
};

// Initialize payment settings (call this on app start if needed)
export const initializePaymentSettings = async () => {
    try {
        const ref = doc(db, "settings", "adminPayment");
        const snap = await getDoc(ref);
        
        if (!snap.exists()) {
            const defaultData = {
                bkash:  { enabled: false, number: "" },
                nagad:  { enabled: false, number: "" },
                rocket: { enabled: false, number: "" },
            };
            await setDoc(ref, defaultData);
            console.log("Initialized payment settings with default values");
            return defaultData;
        }
        
        return snap.data();
    } catch (error) {
        console.error("Error initializing payment settings:", error);
        throw error;
    }
};