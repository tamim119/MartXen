import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
  collection, getDocs, getDoc, doc,
  addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit
} from "firebase/firestore";
import { uploadProductImage } from "../../supabase";

// ✅ Firestore Timestamp যেকোনো জায়গায় থাকলে serialize করো
const serializeValue = (val) => {
  if (val === null || val === undefined) return val;
  // Firestore Timestamp
  if (val?.toDate && typeof val.toDate === "function") {
    return val.toDate().toISOString();
  }
  // Array — recursively serialize
  if (Array.isArray(val)) {
    return val.map(serializeValue);
  }
  // Object — recursively serialize
  if (typeof val === "object") {
    const result = {};
    for (const key of Object.keys(val)) {
      result[key] = serializeValue(val[key]);
    }
    return result;
  }
  return val;
};

// ✅ Product serialize — rating এর ভেতরের Timestamp ও fix হবে
const serializeProduct = (id, data) => {
  const serialized = serializeValue(data);
  return { id, ...serialized };
};

// ✅ Active store IDs বের করার helper
const getActiveStoreIds = async () => {
  const snap = await getDocs(collection(db, "stores"));
  const activeIds = new Set();
  snap.docs.forEach(d => {
    const data = d.data();
    if (data.isActive !== false) {
      activeIds.add(d.id);
    }
  });
  return activeIds;
};

// সব products fetch করুন (paused store এর products বাদ পড়বে)
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

    const [snap, activeStoreIds] = await Promise.all([
      getDocs(q),
      getActiveStoreIds(),
    ]);

    return snap.docs
      .map(d => serializeProduct(d.id, d.data()))
      .filter(product => {
        if (!product.storeId) return true;
        return activeStoreIds.has(product.storeId);
      });
  }
);

// Single product fetch
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (productId) => {
    const [snap, activeStoreIds] = await Promise.all([
      getDoc(doc(db, "products", productId)),
      getActiveStoreIds(),
    ]);

    if (!snap.exists()) return null;

    const product = serializeProduct(snap.id, snap.data());

    if (product.storeId && !activeStoreIds.has(product.storeId)) {
      return null;
    }

    return product;
  }
);

// Admin: Product add করুন
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
    resetStatus: (state) => {
      state.status = "idle";
    },
    updateProductReviewLocally: (state, action) => {
      const { productId, review } = action.payload;
      const idx = state.items.findIndex(p => p.id === productId);
      if (idx !== -1) {
        // ✅ review এর Timestamp ও serialize করো
        const safeReview = serializeValue(review);
        const existing = state.items[idx].rating || [];
        state.items[idx] = {
          ...state.items[idx],
          rating: [safeReview, ...existing],
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending,   (s) => { s.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.items = a.payload; s.status = "succeeded"; })
      .addCase(fetchProducts.rejected,  (s, a) => { s.error = a.error.message; s.status = "failed"; })
      .addCase(fetchProductById.fulfilled, (s, a) => { s.selected = a.payload; })
      .addCase(addProduct.fulfilled,    (s, a) => { s.items.unshift(a.payload); })
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

export const selectAllProducts     = (s) => s.product.items;
export const selectSelectedProduct = (s) => s.product.selected;
export const selectProductStatus   = (s) => s.product.status;
export const selectFilteredProducts = (s) => {
  const { items, filters } = s.product;
  return items.filter(p => {
    const matchCat    = !filters.category || p.category === filters.category;
    const matchSearch = !filters.search   || p.name?.toLowerCase().includes(filters.search.toLowerCase());
    return matchCat && matchSearch;
  });
};