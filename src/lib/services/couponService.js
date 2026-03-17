import { db } from "../firebase";
import {
    doc, setDoc, getDoc, getDocs,
    collection, deleteDoc, serverTimestamp,
    query, where
} from "firebase/firestore";

// Admin: create coupon
export const createCoupon = async (data) => {
    try {
        await setDoc(doc(db, "coupons", data.code.toUpperCase()), {
            ...data,
            code: data.code.toUpperCase(),
            createdAt: serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating coupon:", error);
        throw error;
    }
};

// Checkout: validate coupon code
export const validateCoupon = async (code, userId) => {
    try {
        // Check if code exists
        if (!code || code.trim() === "") {
            throw new Error("Please enter a coupon code");
        }

        const couponCode = code.toUpperCase().trim();
        const snap = await getDoc(doc(db, "coupons", couponCode));
        
        if (!snap.exists()) {
            throw new Error("Invalid coupon code!");
        }

        const coupon = snap.data();
        const now = new Date();

        // Check expiry
        if (coupon.expiresAt) {
            const expiry = coupon.expiresAt?.toDate
                ? coupon.expiresAt.toDate()
                : new Date(coupon.expiresAt);

            if (expiry < now) {
                throw new Error("Coupon has expired!");
            }
        }

        // Check if user is new (no previous orders)
        if (coupon.forNewUser) {
            const userOrdersSnap = await getDocs(
                query(collection(db, "orders"), where("userId", "==", userId))
            );
            
            if (!userOrdersSnap.empty) {
                throw new Error("This coupon is for new users only!");
            }
        }

        // Check if user is a member (Plus member)
        if (coupon.forMember) {
            const userSnap = await getDoc(doc(db, "users", userId));
            const userData = userSnap.data();
            
            if (!userData?.isPlusMember) {
                throw new Error("This coupon is for Plus members only!");
            }
        }

        // Check usage limit
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            throw new Error("Coupon usage limit reached!");
        }

        return {
            code: coupon.code,
            discount: coupon.discount || 0,
            description: coupon.description || "",
            ...coupon
        };
    } catch (error) {
        console.error("Coupon validation error:", error);
        throw error;
    }
};

// Public coupons list
export const getPublicCoupons = async () => {
    try {
        const snap = await getDocs(collection(db, "coupons"));
        const now = new Date();
        return snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(c => {
                if (!c.isPublic) return false;
                
                if (c.expiresAt) {
                    const expiry = c.expiresAt?.toDate 
                        ? c.expiresAt.toDate() 
                        : new Date(c.expiresAt);
                    return expiry > now;
                }
                
                return true;
            });
    } catch (error) {
        console.error("Error getting public coupons:", error);
        return [];
    }
};

export const getAllCoupons = async () => {
    try {
        const snap = await getDocs(collection(db, "coupons"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error("Error getting all coupons:", error);
        return [];
    }
};

export const deleteCoupon = async (code) => {
    try {
        await deleteDoc(doc(db, "coupons", code.toUpperCase()));
        return { success: true };
    } catch (error) {
        console.error("Error deleting coupon:", error);
        throw error;
    }
};