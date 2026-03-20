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

// Sync cart to Firestore — empty cart ও save করো
export const syncCartToFirestore = createAsyncThunk(
  "cart/syncCart",
  async ({ userId, items }, { rejectWithValue }) => {
    try {
      // ✅ items.length === 0 হলেও save করো — order place এর পর cart clear হবে
      await setDoc(doc(db, "carts", userId), { items }, { merge: false });
      return items;
    } catch (error) {
      console.error("Error syncing cart:", error);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Variant-aware match — size/color/skinType সহ exact match
const isSameVariant = (a, b) =>
  a.id === b.id &&
  (a.size      || "") === (b.size      || "") &&
  (a.color     || "") === (b.color     || "") &&
  (a.skinType  || "") === (b.skinType  || "") &&
  (a.ageRange  || "") === (b.ageRange  || "") &&
  (a.language  || "") === (b.language  || "");

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
      const existing = state.items.find(i => isSameVariant(i, action.payload));
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
      state.total = calcTotal(state.items);
    },
    removeFromCart: (state, action) => {
      if (typeof action.payload === "object" && action.payload !== null) {
        state.items = state.items.filter(i => !isSameVariant(i, action.payload));
      } else {
        state.items = state.items.filter(i => i.id !== action.payload);
      }
      state.total = calcTotal(state.items);
    },
    updateQty: (state, action) => {
      // payload: { id, qty, size?, color?, skinType?, ageRange?, language? }
      const item = state.items.find(i => isSameVariant(i, action.payload));
      if (item) {
        item.qty = action.payload.qty;
        if (item.qty <= 0) {
          state.items = state.items.filter(i => !isSameVariant(i, action.payload));
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
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.total = calcTotal(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending,   (state) => { state.status = "loading"; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = calcTotal(state.items);
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchCart.rejected,  (state, action) => { state.status = "failed"; state.error = action.payload || "Failed to fetch cart"; })
      .addCase(syncCartToFirestore.pending,   (state) => { state.error = null; })
      .addCase(syncCartToFirestore.fulfilled, (state) => { state.error = null; })
      .addCase(syncCartToFirestore.rejected,  (state, action) => { state.error = action.payload || "Failed to sync cart"; console.error("Cart sync failed:", action.payload); });
  },
});

const calcTotal = (items) =>
  items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);

export const { addToCart, removeFromCart, updateQty, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems  = (state) => state.cart.items;
export const selectCartTotal  = (state) => state.cart.total;
export const selectCartCount  = (state) => state.cart.items.reduce((n, i) => n + (i.qty || 0), 0);
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError  = (state) => state.cart.error;