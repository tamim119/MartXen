import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { checkSubscriptionExpiry } from "../utils/plusMemberChecker";

// Google Login — signInWithRedirect use করে, page Google এ চলে যাবে
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

// Email Register
export const registerWithEmail = async (email, password, name) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(result.user);
  await updateProfile(result.user, { displayName: name });
  await saveUserToFirestore(result.user, name);
  return result.user;
};

// Email Login
export const loginWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Forgot Password
export const resetPassword = async (email) => {
  const methods = await fetchSignInMethodsForEmail(auth, email);
  if (!methods || methods.length === 0) {
    const err = new Error("No account found with this email.");
    err.code = "auth/user-not-found";
    throw err;
  }
  await sendPasswordResetEmail(auth, email);
};

// Firestore এ user save
const saveUserToFirestore = async (user, providedName = null) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || "",
      name: providedName || user.displayName || "",
      photo: user.photoURL || "",
      role: "customer",
      createdAt: new Date(),
    });
  } else {
    const existingData = snap.data();
    if (providedName && (!existingData.name || existingData.name.trim() === "")) {
      await updateDoc(userRef, {
        name: providedName,
        displayName: providedName,
      });
    }
  }
};

// Auth state hook
export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ── Google Redirect থেকে ফিরে আসলে ──
    // result পেলে Firestore এ save করো, তারপর Home এ redirect
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await saveUserToFirestore(result.user);
          // Google redirect success → Home এ পাঠাও
          window.location.replace("/");
        }
      })
      .catch((err) => {
        console.error("Redirect error:", err.message);
      });

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            if (userData.role === "plus") {
              await checkSubscriptionExpiry(firebaseUser.uid);
              const updatedSnap = await getDoc(userDocRef);
              const updatedData = updatedSnap.exists() ? updatedSnap.data() : userData;

              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: updatedData.name || firebaseUser.displayName || "",
                photoURL: updatedData.photo || firebaseUser.photoURL || "",
                role: updatedData.role || "customer",
                emailVerified: firebaseUser.emailVerified,
                ...updatedData,
              });
            } else {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: userData.name || firebaseUser.displayName || "",
                photoURL: userData.photo || firebaseUser.photoURL || "",
                role: userData.role || "customer",
                emailVerified: firebaseUser.emailVerified,
                ...userData,
              });
            }
          } else {
            await saveUserToFirestore(firebaseUser);
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || "",
              photoURL: firebaseUser.photoURL || "",
              role: "customer",
              emailVerified: firebaseUser.emailVerified,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
            role: "customer",
            emailVerified: firebaseUser.emailVerified,
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