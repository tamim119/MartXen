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
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

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
export const registerWithEmail = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  await saveUserToFirestore(result.user);
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
  return confirmResult;
};

// Firestore এ user save
const saveUserToFirestore = async (user) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      name: user.displayName || "",
      photo: user.photoURL || "",
      role: "customer",
      createdAt: new Date(),
    });
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
            
            // ✅ Complete user object তৈরি করা হচ্ছে
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.name || firebaseUser.displayName || "",
              photoURL: userData.photo || firebaseUser.photoURL || "",
              role: userData.role || "customer",
              // Add other Firebase Auth properties
              emailVerified: firebaseUser.emailVerified,
              phoneNumber: firebaseUser.phoneNumber,
              // Add Firestore data
              ...userData,
            });
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