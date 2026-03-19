import { Routes, Route, Navigate } from "react-router-dom";
import { useCurrentUser } from "./hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCart, syncCartToFirestore } from "./lib/features/cart/cartSlice";
import { fetchAddresses } from "./lib/features/address/addressSlice";
 
// ✅ FloatingToastProvider import করুন
import FloatingToastProvider from "./components/FloatingToastProvider";
 
// ✅ PlusBanner import করুন
import PlusBanner from "./components/plusBanner";
 
import AdminLayout from "./components/admin/AdminLayout";
import StoreLayout from "./components/store/StoreLayout";
 
import Home           from "./pages/Home";
import Shop           from "./pages/Shop";
import ProductPage    from "./pages/ProductPage";
import Cart           from "./pages/Cart";
import Orders         from "./pages/Orders";
import Login          from "./pages/Login";
import AdminLogin     from "./pages/AdminLogin";
import StoreShop      from "./pages/StoreShop";
import Pricing        from "./pages/Pricing";
import CreateStore    from "./pages/CreateStore";
import PricingPayment from "./pages/PricingPayment";
import Wishlist       from "./pages/Wishlist";
import AddressBook    from "./pages/AddressBook";
import Checkout       from "./pages/Checkout";
import About          from "./pages/About";
import Contact        from "./pages/Contact";
 
import AdminDashboard from "./pages/admin/Dashboard";
import AdminStores    from "./pages/admin/Stores";
import AdminApprove   from "./pages/admin/Approve";
import AdminCoupons   from "./pages/admin/Coupons";
import AdminPricing   from "./pages/admin/Pricing";
 
import StoreDashboard   from "./pages/store/Dashboard";
import AddProduct       from "./pages/store/AddProduct";
import ManageProducts   from "./pages/store/ManageProducts";
import StoreOrders      from "./pages/store/Orders";
import PaymentSettings  from "./pages/store/PaymentSettings";
 
import Loading from "./components/Loading";
import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";
import Banner  from "./components/Banner";
import AdminPaymentSettings from "./pages/admin/PaymentSettings";
import AdminBannerSettings from "./pages/admin/BannerSettings";
import AdminPlusApprove from "./pages/admin/plusApprove";
 
// ============================================================
// ProtectedRoute Component
// ============================================================
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useCurrentUser();
    if (loading) return <Loading />;
    return user ? children : <Navigate to="/login" replace />;
};
 
// ============================================================
// PublicLayout Component (with PlusBanner, Banner, Navbar, Footer)
// ============================================================
const PublicLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
        <PlusBanner />
        <Banner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
    </div>
);
 
// ============================================================
// CartSync Component (Syncs cart with Firestore)
// ============================================================
const CartSync = ({ userId }) => {
    const dispatch   = useDispatch();
    const cartItems  = useSelector(state => state.cart.items);
    const cartStatus = useSelector(state => state.cart.status);
 
    useEffect(() => {
        if (userId && cartStatus === "idle") {
            dispatch(fetchCart(userId));
        }
    }, [userId, cartStatus]);
 
    useEffect(() => {
        if (userId && cartStatus === "succeeded") {
            dispatch(syncCartToFirestore({ userId, items: cartItems }));
        }
    }, [cartItems]);
 
    return null;
};
 
// ============================================================
// Main App Component
// ============================================================
export default function App() {
    const { user, loading } = useCurrentUser();
    const dispatch = useDispatch();
 
    // Fetch addresses when user logs in
    useEffect(() => {
        if (user) dispatch(fetchAddresses(user.uid));
    }, [user]);
 
    if (loading) return <Loading />;
 
    return (
        // ✅ FloatingToastProvider দিয়ে সম্পূর্ণ app wrap করুন
        <FloatingToastProvider>
            <>
                {/* Cart Sync */}
                {user && <CartSync userId={user.uid} />}
                
                {/* react-hot-toast Toaster (যদি এটা ব্যবহার করতে চান) */}
                {/* <Toaster position="top-center" reverseOrder={false} /> */}
 
                {/* Routes */}
                <Routes>
 
                    {/* ══════════════════════════════════════════════════ */}
                    {/* PUBLIC ROUTES (সবার জন্য accessible) */}
                    {/* ══════════════════════════════════════════════════ */}
                    
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
                    <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                    <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                    <Route path="/shop/:username" element={<PublicLayout><StoreShop /></PublicLayout>} />
                    <Route path="/product/:id" element={<PublicLayout><ProductPage /></PublicLayout>} />
                    <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
                    <Route path="/wishlist" element={<PublicLayout><Wishlist /></PublicLayout>} />
 
                    {/* ══════════════════════════════════════════════════ */}
                    {/* PROTECTED ROUTES (শুধু logged-in users এর জন্য) */}
                    {/* ══════════════════════════════════════════════════ */}
                    
                    <Route path="/address-book" element={
                        <PublicLayout>
                            <ProtectedRoute>
                                <AddressBook />
                            </ProtectedRoute>
                        </PublicLayout>
                    } />
                    
                    <Route path="/checkout" element={
                        <PublicLayout>
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        </PublicLayout>
                    } />
                    
                    <Route path="/payment" element={
                        <PublicLayout>
                            <ProtectedRoute>
                                <PricingPayment />
                            </ProtectedRoute>
                        </PublicLayout>
                    } />
                    
                    <Route path="/create-store" element={
                        <PublicLayout>
                            <ProtectedRoute>
                                <CreateStore />
                            </ProtectedRoute>
                        </PublicLayout>
                    } />
                    
                    <Route path="/cart" element={
                        <PublicLayout>
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        </PublicLayout>
                    } />
                    
                    <Route path="/orders" element={
                        <PublicLayout>
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        </PublicLayout>
                    } />
 
                    {/* ══════════════════════════════════════════════════ */}
                    {/* AUTH ROUTES (Login pages) */}
                    {/* ══════════════════════════════════════════════════ */}
                    
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
 
                    {/* ══════════════════════════════════════════════════ */}
                    {/* ADMIN ROUTES (Admin dashboard, stores, etc.) */}
                    {/* ══════════════════════════════════════════════════ */}
                    
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="stores" element={<AdminStores />} />
                        <Route path="approve" element={<AdminApprove />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                        <Route path="pricing" element={<AdminPricing />} />
                        <Route path="payment-settings" element={<AdminPaymentSettings />} />
                        <Route path="banner-settings" element={<AdminBannerSettings />} />
                        <Route path="plusApprove" element={<AdminPlusApprove />} />
                    </Route>
 
                    {/* ══════════════════════════════════════════════════ */}
                    {/* STORE ROUTES (Seller dashboard) */}
                    {/* ══════════════════════════════════════════════════ */}
                    
                    <Route path="/store" element={<StoreLayout />}>
                        <Route index element={<StoreDashboard />} />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="manage-product" element={<ManageProducts />} />
                        <Route path="orders" element={<StoreOrders />} />
                        <Route path="payment-settings" element={<PaymentSettings />} />
                    </Route>
 
                    {/* ══════════════════════════════════════════════════ */}
                    {/* 404 - PAGE NOT FOUND */}
                    {/* ══════════════════════════════════════════════════ */}
                    
                    <Route path="*" element={
                        <PublicLayout>
                            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                                <h1 className="text-6xl font-semibold text-slate-200">404</h1>
                                <p className="mt-3 text-lg">Page not found</p>
                            </div>
                        </PublicLayout>
                    } />
 
                </Routes>
            </>
        </FloatingToastProvider>
    );
}