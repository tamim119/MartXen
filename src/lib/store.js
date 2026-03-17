import { configureStore } from "@reduxjs/toolkit";
import cartReducer     from "./features/cart/cartSlice";
import productReducer  from "./features/product/productSlice";
import addressReducer  from "./features/address/addressSlice";
import wishlistReducer from "./features/wishlist/wishlistSlice";

export const store = configureStore({
    reducer: {
        cart:     cartReducer,
        product:  productReducer,
        address:  addressReducer,
        wishlist: wishlistReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [
                    'payload/5/rating/0/createdAt',
                    'product/items/5/rating/0/createdAt',
                ],
                // Ignore these field paths in all actions
                ignoredActionPaths: [
                    'payload.rating.createdAt',
                    'payload.items.rating.createdAt',
                    'meta.arg',
                    'payload.timestamp',
                ],
                // Ignore these paths in the state
                ignoredPaths: [
                    'product.items.rating.createdAt',
                    'cart.items.rating.createdAt',
                ],
            },
        }),
});

export default store;