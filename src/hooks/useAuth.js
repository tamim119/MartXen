import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { checkSubscriptionExpiry } from "../utils/plusMemberChecker";

// Google Login
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

// Facebook Login
export const loginWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  await signInWithRedirect(auth, provider);
};

// Email Register
export const registerWithEmail = async (email, password, name) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  
  // Update profile with name
  await updateProfile(result.user, { displayName: name });
  
  // Save to Firestore with name
  await saveUserToFirestore(result.user, name);
  return result.user;
};

// Email Login
export const loginWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Phone OTP — reCAPTCHA setup
export const setupRecaptcha = (elementId) => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = null;
  }
  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    elementId,
    {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {
        window.recaptchaVerifier = null;
      },
    }
  );
};

// Phone OTP — send
export const sendPhoneOTP = async (phoneNumber) => {
  const formatted = phoneNumber.startsWith("+")
    ? phoneNumber
    : "+88" + phoneNumber;
  const confirmResult = await signInWithPhoneNumber(
    auth,
    formatted,
    window.recaptchaVerifier
  );
  
  // ✅ Store the name in confirmResult for later use
  confirmResult.confirm = async (code, userName) => {
    const result = await confirmResult.__proto__.confirm.call(confirmResult, code);
    
    // ✅ Save user with name after successful phone verification
    if (result.user && userName) {
      // Update Firebase Auth profile
      await updateProfile(result.user, { displayName: userName });
      
      // Save to Firestore with name
      await saveUserToFirestore(result.user, userName);
    }
    
    return result;
  };
  
  return confirmResult;
};

// Firestore এ user save
const saveUserToFirestore = async (user, providedName = null) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  
  if (!snap.exists()) {
    // নতুন user তৈরি করা হচ্ছে
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      name: providedName || user.displayName || "",
      photo: user.photoURL || "",
      phoneNumber: user.phoneNumber || "",
      role: "customer",
      createdAt: new Date(),
    });
  } else {
    // যদি user আগে থেকেই থাকে কিন্তু name নেই, তাহলে update করা হবে
    const existingData = snap.data();
    if (providedName && (!existingData.name || existingData.name.trim() === "")) {
      await updateDoc(userRef, {
        name: providedName,
        displayName: providedName,
      });
    }
  }
};

// ✅ Auth state hook - FIXED VERSION
export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result first
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await saveUserToFirestore(result.user);
        }
      })
      .catch((err) => {
        console.error("Redirect error:", err.message);
      });

    // Listen to auth state changes
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // ✅ Firestore থেকে user data fetch করা হচ্ছে
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            
            // ✅ Check subscription expiry for Plus users
            if (userData.role === "plus") {
              await checkSubscriptionExpiry(firebaseUser.uid);
              // Re-fetch user data after expiry check
              const updatedSnap = await getDoc(userDocRef);
              const updatedData = updatedSnap.exists() ? updatedSnap.data() : userData;
              
              // ✅ Complete user object তৈরি করা হচ্ছে
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: updatedData.name || firebaseUser.displayName || "",
                photoURL: updatedData.photo || firebaseUser.photoURL || "",
                role: updatedData.role || "customer",
                emailVerified: firebaseUser.emailVerified,
                phoneNumber: firebaseUser.phoneNumber || updatedData.phoneNumber || "",
                ...updatedData,
              });
            } else {
              // ✅ Complete user object তৈরি করা হচ্ছে
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: userData.name || firebaseUser.displayName || "",
                photoURL: userData.photo || firebaseUser.photoURL || "",
                role: userData.role || "customer",
                emailVerified: firebaseUser.emailVerified,
                phoneNumber: firebaseUser.phoneNumber || userData.phoneNumber || "",
                ...userData,
              });
            }
          } else {
            // If user doesn't exist in Firestore, create it
            await saveUserToFirestore(firebaseUser);
            
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "",
              role: "customer",
              emailVerified: firebaseUser.emailVerified,
              phoneNumber: firebaseUser.phoneNumber,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to Firebase Auth data only
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
            role: "customer",
            emailVerified: firebaseUser.emailVerified,
            phoneNumber: firebaseUser.phoneNumber,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { user, loading };
};

// Logout
export const logout = () => signOut(auth);