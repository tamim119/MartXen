// bannerService.js
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Get banner settings
export const getBannerSettings = async () => {
    try {
        const ref = doc(db, "settings", "banner");
        const snap = await getDoc(ref);
        
        // Default data if doesn't exist
        if (!snap.exists()) {
            const defaultData = {
                enabled: false, // Default false করেছি
                text: "Get 20% OFF on Your First Order!",
                buttonText: "Claim Offer",
                couponCode: "",
                useCouponFromList: true,
                gradientFrom: "#8B5CF6",
                gradientVia: "#9938CA",
                gradientTo: "#E0724A",
            };
            await setDoc(ref, defaultData);
            console.log("Created default banner settings");
            return defaultData;
        }
        
        return snap.data();
    } catch (error) {
        console.error("Error in getBannerSettings:", error);
        throw error;
    }
};

// Update banner settings
export const updateBannerSettings = async (data) => {
    try {
        const ref = doc(db, "settings", "banner");
        console.log("Saving banner settings:", data); // Debug log
        await setDoc(ref, data, { merge: true });
        console.log("Successfully saved banner settings");
    } catch (error) {
        console.error("Error in updateBannerSettings:", error);
        throw error;
    }
};