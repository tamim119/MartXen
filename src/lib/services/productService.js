import { db } from "../firebase";
import { uploadProductImage } from "../supabase";
import {
    collection, doc, addDoc, getDoc, getDocs,
    updateDoc, deleteDoc, query, where,
    orderBy, limit, serverTimestamp
} from "firebase/firestore";

// ─────────────────────────────────────────────────────────────────
// INTERNAL HELPER — Paused store filter
// ─────────────────────────────────────────────────────────────────

const getActiveStoreIds = async () => {
    try {
        const snap = await getDocs(collection(db, "stores"));
        const activeIds = new Set();
        snap.forEach(d => {
            // isActive: false হলে paused, বাকি সব active
            if (d.data().isActive !== false) activeIds.add(d.id);
        });
        return activeIds;
    } catch (err) {
        console.error("getActiveStoreIds error:", err);
        return null; // fail হলে filter skip — safe fallback
    }
};

const filterByActiveStore = (products, activeStoreIds) => {
    if (!activeStoreIds) return products;
    return products.filter(p => !p.storeId || activeStoreIds.has(p.storeId));
};

// ─────────────────────────────────────────────────────────────────
// PUBLIC FUNCTIONS
// ─────────────────────────────────────────────────────────────────

// ✅ Pause filter আছে — website এ paused store এর products দেখাবে না
export const getAllProducts = async () => {
    const [snap, activeStoreIds] = await Promise.all([
        getDocs(query(collection(db, "products"), orderBy("createdAt", "desc"))),
        getActiveStoreIds(),
    ]);
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return filterByActiveStore(products, activeStoreIds);
};

// ✅ Pause filter আছে
export const getProductsByCategory = async (category) => {
    const [snap, activeStoreIds] = await Promise.all([
        getDocs(query(
            collection(db, "products"),
            where("category", "==", category),
            where("inStock", "==", true)
        )),
        getActiveStoreIds(),
    ]);
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return filterByActiveStore(products, activeStoreIds);
};

// ✅ Pause filter আছে — direct URL এ paused store এর product null return করবে
export const getProductById = async (id) => {
    const snap = await getDoc(doc(db, "products", id));
    if (!snap.exists()) return null;

    const product = { id: snap.id, ...snap.data() };

    if (product.storeId) {
        const storeSnap = await getDoc(doc(db, "stores", product.storeId));
        if (storeSnap.exists() && storeSnap.data().isActive === false) {
            return null; // paused store — product দেখাবে না
        }
    }

    return product;
};

// ✅ Pause filter নেই — seller নিজের dashboard এ নিজের products সবসময় দেখবে
export const getProductsByStore = async (storeId) => {
    const snap = await getDocs(
        query(collection(db, "products"), where("storeId", "==", storeId))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ─────────────────────────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────────────────────────

export const addProduct = async (data, imageFiles = []) => {
    let imageUrls = data.images || [];

    if (imageFiles.length > 0) {
        const tempId = Date.now().toString();
        const uploaded = await Promise.all(
            imageFiles.map((f, i) => uploadProductImage(f, `${tempId}-${i}`))
        );
        imageUrls = [...imageUrls, ...uploaded];
    }

    const ref = await addDoc(collection(db, "products"), {
        ...data,
        images: imageUrls,
        inStock: true,
        avgRating: 0,
        ratingCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
};

export const updateProduct = async (id, data, newImages = []) => {
    let imageUrls = data.images || [];
    if (newImages.length > 0) {
        const newUrls = await Promise.all(
            newImages.map((f, i) => uploadProductImage(f, `${id}-${i}`))
        );
        imageUrls = [...imageUrls, ...newUrls];
    }
    await updateDoc(doc(db, "products", id), {
        ...data, images: imageUrls, updatedAt: serverTimestamp(),
    });
};

export const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
};