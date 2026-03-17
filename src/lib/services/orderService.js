import { db } from "../firebase";
import {
    collection, doc, addDoc, getDocs,
    updateDoc, query, where, orderBy, serverTimestamp
} from "firebase/firestore";

export const createOrder = async ({
    userId, storeId, addressId, addressData,
    items, total, paymentMethod,
    coupon = {}, isCouponUsed = false
}) => {
    const ref = await addDoc(collection(db, "orders"), {
        userId,
        storeId: storeId || '',
        addressId: addressId || '',
        addressData: addressData || {},
        total: total || 0,
        paymentMethod,
        isPaid: false,
        status: "ORDER_PLACED",
        isCouponUsed,
        coupon: coupon || {},
        items: items.map(i => ({
            productId: i.id || i.productId || '',
            name: i.name || '',
            price: i.price || 0,
            quantity: i.qty || i.quantity || 1,
            image: i.images?.[0] || i.image || '',  // ← fix
            storeId: i.storeId || storeId || '',
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
};

export const getUserOrders = async (userId) => {
    const snap = await getDocs(
        query(collection(db, "orders"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc"))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getStoreOrders = async (storeId) => {
    const snap = await getDocs(
        query(collection(db, "orders"),
            where("storeId", "==", storeId),
            orderBy("createdAt", "desc"))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getAllOrders = async () => {
    const snap = await getDocs(
        query(collection(db, "orders"), orderBy("createdAt", "desc"))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateOrderStatus = async (orderId, status) => {
    await updateDoc(doc(db, "orders", orderId), {
        status, updatedAt: serverTimestamp(),
    });
};

export const markOrderPaid = async (orderId) => {
    await updateDoc(doc(db, "orders", orderId), {
        isPaid: true, updatedAt: serverTimestamp(),
    });
};