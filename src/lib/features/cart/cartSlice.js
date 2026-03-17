import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Fetch cart from Firestore
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const ref = doc(db, "carts", userId);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data().items : [];
    } catch (error) {
      console.error("Error fetching cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Sync cart to Firestore
export const syncCartToFirestore = createAsyncThunk(
  "cart/syncCart",
  async ({ userId, items }, { rejectWithValue }) => {
    try {
      await setDoc(doc(db, "carts", userId), { items }, { merge: true });
      return items;
    } catch (error) {
      console.error("Error syncing cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
      state.total = calcTotal(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.total = calcTotal(state.items);
    },
    updateQty: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
        // Remove item if quantity is 0
        if (item.qty <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
      state.total = calcTotal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.status = "idle";
      state.error = null;
    },
    // Add this to set cart items directly (useful for initial load)
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.total = calcTotal(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => { 
        state.status = "loading"; 
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = calcTotal(state.items);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch cart";
      })
      // Sync cart
      .addCase(syncCartToFirestore.pending, (state) => {
        // Don't change status to loading during sync to avoid UI flicker
        state.error = null;
      })
      .addCase(syncCartToFirestore.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(syncCartToFirestore.rejected, (state, action) => {
        state.error = action.payload || "Failed to sync cart";
        console.error("Cart sync failed:", action.payload);
      });
  },
});

// Helper function to calculate total
const calcTotal = (items) =>
  items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);

export const { 
  addToCart, 
  removeFromCart, 
  updateQty, 
  clearCart,
  setCartItems 
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartCount = (state) =>
  state.cart.items.reduce((n, i) => n + (i.qty || 0), 0);
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;