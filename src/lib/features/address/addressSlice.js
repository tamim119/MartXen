import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase";
import {
    collection, getDocs, addDoc,
    updateDoc, deleteDoc, doc, serverTimestamp
} from "firebase/firestore";

const addressRef = (userId) =>
    collection(db, "users", userId, "addresses");

const safeDate = (val) => {
    try { return val?.toDate?.()?.toISOString() || (val ? new Date(val).toISOString() : null); }
    catch { return null; }
};

export const fetchAddresses = createAsyncThunk(
    "address/fetch",
    async (userId) => {
        const snap = await getDocs(addressRef(userId));
        return snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            createdAt: safeDate(d.data().createdAt),
            updatedAt: safeDate(d.data().updatedAt),
        }));
    }
);

export const addAddress = createAsyncThunk(
    "address/add",
    async ({ userId, address }, { rejectWithValue }) => {
        try {
            const payload = {
                ...address,
                createdAt: serverTimestamp(),
                updatedAt: null,
            };
            const ref = await addDoc(addressRef(userId), payload);
            return {
                id: ref.id,
                ...address,
                createdAt: new Date().toISOString(),
                updatedAt: null,
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateAddress = createAsyncThunk(
    "address/update",
    async ({ userId, id, address }, { rejectWithValue }) => {
        try {
            await updateDoc(doc(db, "users", userId, "addresses", id), {
                ...address,
                updatedAt: serverTimestamp(),
            });
            return {
                id,
                ...address,
                updatedAt: new Date().toISOString(),
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteAddress = createAsyncThunk(
    "address/delete",
    async ({ userId, id }, { rejectWithValue }) => {
        try {
            await deleteDoc(doc(db, "users", userId, "addresses", id));
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState: {
        list:     [],
        selected: null,
        status:   "idle",
        error:    null,
    },
    reducers: {
        selectAddress: (state, action) => {
            state.selected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending,   (s) => { s.status = "loading"; s.error = null; })
            .addCase(fetchAddresses.fulfilled,  (s, a) => { s.list = a.payload; s.status = "succeeded"; })
            .addCase(fetchAddresses.rejected,   (s, a) => { s.status = "failed"; s.error = a.payload; })

            .addCase(addAddress.fulfilled,  (s, a) => { s.list.push(a.payload); })
            .addCase(addAddress.rejected,   (s, a) => { s.error = a.payload; })

            .addCase(updateAddress.fulfilled, (s, a) => {
                const i = s.list.findIndex(x => x.id === a.payload.id);
                if (i !== -1) s.list[i] = { ...s.list[i], ...a.payload };
            })
            .addCase(updateAddress.rejected, (s, a) => { s.error = a.payload; })

            .addCase(deleteAddress.fulfilled, (s, a) => {
                s.list = s.list.filter(x => x.id !== a.payload);
            })
            .addCase(deleteAddress.rejected, (s, a) => { s.error = a.payload; });
    },
});

export const { selectAddress } = addressSlice.actions;
export default addressSlice.reducer;

export const selectAddressList   = (s) => s.address.list;
export const selectChosenAddress = (s) => s.address.selected;