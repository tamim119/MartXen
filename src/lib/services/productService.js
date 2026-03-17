import { db } from "../firebase";
import { uploadProductImage } from "../supabase";
import {
    collection, doc, addDoc, getDoc, getDocs,
    updateDoc, deleteDoc, query, where,
    orderBy, limit, serverTimestamp
} from "firebase/firestore";

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

export const getAllProducts = async () => {
    const snap = await getDocs(
        query(collection(db, "products"), orderBy("createdAt", "desc"))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getProductById = async (id) => {
    const snap = await getDoc(doc(db, "products", id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const getProductsByStore = async (storeId) => {
    const snap = await getDocs(
        query(collection(db, "products"), where("storeId", "==", storeId))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getProductsByCategory = async (category) => {
    const snap = await getDocs(
        query(collection(db, "products"),
            where("category", "==", category),
            where("inStock", "==", true))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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