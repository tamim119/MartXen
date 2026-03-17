import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  selectCartItems, 
  fetchCart, 
  syncCartToFirestore 
} from "../lib/features/cart/cartSlice";
import { useCurrentUser } from "./useAuth";

export const useCartSync = () => {
  const { user, loading: authLoading } = useCurrentUser();
  const items = useSelector(selectCartItems);
  const dispatch = useDispatch();
  
  // Track if cart has been loaded from Firestore
  const hasLoadedCart = useRef(false);
  const syncTimeoutRef = useRef(null);

  // Load cart from Firestore when user logs in
  useEffect(() => {
    if (user && !authLoading && !hasLoadedCart.current) {
      console.log("Loading cart for user:", user.uid);
      dispatch(fetchCart(user.uid))
        .then(() => {
          hasLoadedCart.current = true;
          console.log("Cart loaded successfully");
        })
        .catch((error) => {
          console.error("Failed to load cart:", error);
        });
    }

    // Reset flag when user logs out
    if (!user) {
      hasLoadedCart.current = false;
    }
  }, [user, authLoading, dispatch]);

  // Sync cart to Firestore when items change (with debounce)
  useEffect(() => {
    // Only sync if:
    // 1. User is logged in
    // 2. Cart has been initially loaded
    // 3. Not currently loading auth
    if (user && hasLoadedCart.current && !authLoading) {
      // Clear existing timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // Set new timeout for debounced sync
      syncTimeoutRef.current = setTimeout(() => {
        console.log("Syncing cart to Firestore...");
        dispatch(syncCartToFirestore({ userId: user.uid, items }))
          .then(() => {
            console.log("Cart synced successfully");
          })
          .catch((error) => {
            console.error("Failed to sync cart:", error);
          });
      }, 800); // 800ms debounce

      // Cleanup timeout on unmount or when dependencies change
      return () => {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
    }
  }, [items, user, authLoading, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);
};