import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection, getDocs, getDoc, doc,
  addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit
} from "firebase/firestore";
import { uploadProductImage } from "../../supabase";

// Timestamp convert helper
const serializeProduct = (id, data) => ({
  id,
  ...data,
  createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
  updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
});

// সব products fetch করুন
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (filters = {}) => {
    let q = collection(db, "products");
    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }
    if (filters.limit) {
      q = query(q, orderBy("createdAt", "desc"), limit(filters.limit));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => serializeProduct(d.id, d.data()));
  }
);

// Single product fetch
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (productId) => {
    const snap = await getDoc(doc(db, "products", productId));
    return snap.exists() ? serializeProduct(snap.id, snap.data()) : null;
  }
);

// Admin: Product add করুন (Supabase image + Firestore data)
export const addProduct = createAsyncThunk(
  "product/add",
  async ({ productData, imageFile }) => {
    let imageUrl = "";
    if (imageFile) {
      const tempId = Date.now().toString();
      imageUrl = await uploadProductImage(imageFile, tempId);
    }
    const ref = await addDoc(collection(db, "products"), {
      ...productData,
      image: imageUrl,
      createdAt: new Date(),
    });
    return {
      id: ref.id,
      ...productData,
      image: imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
  }
);

// Admin: Product update করুন
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, productData, imageFile }) => {
    let imageUrl = productData.image;
    if (imageFile) {
      imageUrl = await uploadProductImage(imageFile, id);
    }
    await updateDoc(doc(db, "products", id), {
      ...productData,
      image: imageUrl,
    });
    return {
      id,
      ...productData,
      image: imageUrl,
      createdAt: productData.createdAt || null,
      updatedAt: new Date().toISOString(),
    };
  }
);

// Admin: Product delete করুন
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (productId) => {
    await deleteDoc(doc(db, "products", productId));
    return productId;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    selected: null,
    status: "idle",
    error: null,
    filters: { category: "", search: "" },
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    // ✅ FIX 1: এই action টা status "idle" তে reset করে
    // যাতে fetchProducts আবার fresh data নিয়ে আসতে পারে
    resetStatus: (state) => {
      state.status = "idle";
    },
    // ✅ FIX 1b: Review submit হলে local state এ সাথে সাথে update করো
    // এতে re-fetch এর আগেও UI তে review দেখাবে
    updateProductReviewLocally: (state, action) => {
      const { productId, review } = action.payload;
      const idx = state.items.findIndex(p => p.id === productId);
      if (idx !== -1) {
        const existing = state.items[idx].rating || [];
        state.items[idx] = {
          ...state.items[idx],
          rating: [review, ...existing],
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.items = a.payload; s.status = "succeeded";
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.error = a.error.message; s.status = "failed";
      })
      .addCase(fetchProductById.fulfilled, (s, a) => {
        s.selected = a.payload;
      })
      .addCase(addProduct.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
      })
      .addCase(updateProduct.fulfilled, (s, a) => {
        const idx = s.items.findIndex(p => p.id === a.payload.id);
        if (idx !== -1) s.items[idx] = a.payload;
      })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.items = s.items.filter(p => p.id !== a.payload);
      });
  },
});

export const { setFilter, setSelected, resetStatus, updateProductReviewLocally } = productSlice.actions;
export default productSlice.reducer;

// Selectors
export const selectAllProducts = (s) => s.product.items;
export const selectSelectedProduct = (s) => s.product.selected;
export const selectProductStatus = (s) => s.product.status;
export const selectFilteredProducts = (s) => {
  const { items, filters } = s.product;
  return items.filter(p => {
    const matchCat = !filters.category || p.category === filters.category;
    const matchSearch = !filters.search ||
      p.name?.toLowerCase().includes(filters.search.toLowerCase());
    return matchCat && matchSearch;
  });
};