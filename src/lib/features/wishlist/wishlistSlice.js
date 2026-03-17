import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: JSON.parse(localStorage.getItem('wishlist') || '[]'),
    },
    reducers: {
        addToWishlist: (state, action) => {
            const id = action.payload;
            if (!state.items.includes(id)) {
                state.items.push(id);
                localStorage.setItem('wishlist', JSON.stringify(state.items));
            }
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter(id => id !== action.payload);
            localStorage.setItem('wishlist', JSON.stringify(state.items));
        },
        toggleWishlist: (state, action) => {
            const id = action.payload;
            if (state.items.includes(id)) {
                state.items = state.items.filter(i => i !== id);
            } else {
                state.items.push(id);
            }
            localStorage.setItem('wishlist', JSON.stringify(state.items));
        },
    },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions;
export const selectWishlistItems = state => state.wishlist.items;
export const selectIsWishlisted  = id => state => state.wishlist.items.includes(id);
export default wishlistSlice.reducer;