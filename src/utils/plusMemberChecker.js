// utils/subscriptionChecker.js
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export const checkSubscriptionExpiry = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { expired: true, expiresAt: null, daysLeft: 0 };
    }
    
    const userData = userSnap.data();
    
    if (userData.role !== "plus") {
      return { expired: false, expiresAt: null, daysLeft: null };
    }
    
    if (!userData.plusExpiresAt) {
      const activatedAt = userData.plusActivatedAt 
        ? new Date(userData.plusActivatedAt) 
        : new Date();
      
      const billing = userData.plusBilling || "monthly";
      const expiresAt = new Date(activatedAt);
      
      if (billing === "yearly") {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setDate(expiresAt.getDate() + 30); // ✅ fixed
      }
      
      await updateDoc(userRef, {
        plusExpiresAt: expiresAt.toISOString(),
      });
      
      const now = new Date();
      const daysLeft = Math.floor((expiresAt - now) / (1000 * 60 * 60 * 24)); // ✅ fixed
      
      return {
        expired: expiresAt < now,
        expiresAt,
        daysLeft,
      };
    }
    
    const expiresAt = new Date(userData.plusExpiresAt);
    const now = new Date();
    const daysLeft = Math.floor((expiresAt - now) / (1000 * 60 * 60 * 24)); // ✅ fixed
    
    const hasExpired = expiresAt < now;
    
    if (hasExpired && userData.role === "plus") {
      await downgradeExpiredSubscription(userId);
    }
    
    return {
      expired: hasExpired,
      expiresAt,
      daysLeft: hasExpired ? 0 : daysLeft,
    };
  } catch (error) {
    console.error("Error checking subscription expiry:", error);
    return { expired: false, expiresAt: null, daysLeft: null };
  }
};

export const downgradeExpiredSubscription = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      role: "customer",
      plusExpired: true,
      plusExpiredAt: new Date().toISOString(),
    });
    
    console.log(`User ${userId} subscription expired and downgraded to customer`);
  } catch (error) {
    console.error("Error downgrading subscription:", error);
  }
};

export const renewSubscription = async (userId, plan, billing, amount) => {
  try {
    const userRef = doc(db, "users", userId);
    const now = new Date();
    const expiresAt = new Date(now);
    
    if (billing === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30); // ✅ fixed
    }
    
    await updateDoc(userRef, {
      role: "plus",
      plusPlan: plan,
      plusBilling: billing,
      plusAmount: amount,
      plusActivatedAt: now.toISOString(),
      plusExpiresAt: expiresAt.toISOString(),
      plusExpired: false,
      plusRenewedAt: now.toISOString(),
    });
    
    console.log(`User ${userId} subscription renewed successfully`);
  } catch (error) {
    console.error("Error renewing subscription:", error);
    throw error;
  }
};

export const formatExpiryMessage = (daysLeft) => {
  if (daysLeft <= 0) return "Expired";
  if (daysLeft === 1) return "Expires tomorrow";
  if (daysLeft <= 7) return `Expires in ${daysLeft} days`;
  if (daysLeft <= 30) return `Expires in ${daysLeft} days`;
  return `Active`;
};