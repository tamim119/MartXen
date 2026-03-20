import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useCurrentUser } from "./hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { fetchCart, syncCartToFirestore } from "./lib/features/cart/cartSlice";
import { fetchAddresses } from "./lib/features/address/addressSlice";

import FloatingToastProvider from "./components/FloatingToastProvider";

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

import AdminDashboard       from "./pages/admin/Dashboard";
import AdminStores          from "./pages/admin/Stores";
import AdminApprove         from "./pages/admin/Approve";
import AdminCoupons         from "./pages/admin/Coupons";
import AdminPricing         from "./pages/admin/Pricing";
import AdminPaymentSettings from "./pages/admin/PaymentSettings";
import AdminBannerSettings  from "./pages/admin/BannerSettings";
import AdminPlusApprove     from "./pages/admin/plusApprove";
import Users                from "./pages/admin/Users";
import PlusUsers            from "./pages/admin/PlusUsers";

import StoreDashboard  from "./pages/store/Dashboard";
import AddProduct      from "./pages/store/AddProduct";
import ManageProducts  from "./pages/store/ManageProducts";
import StoreOrders     from "./pages/store/Orders";
import PaymentSettings from "./pages/store/PaymentSettings";

import Loading from "./components/Loading";
import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";
import Banner  from "./components/Banner";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useCurrentUser();
    if (loading) return <Loading />;
    return user ? children : <Navigate to="/login" replace />;
};

const PublicLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
        <Banner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
    </div>
);

// ✅ Fixed CartSync — initial load করে, তারপর debounce দিয়ে sync করে
// কিন্তু initial load এর আগে sync করে না (cart override হবে না)
const CartSync = ({ userId }) => {
    const dispatch    = useDispatch();
    const cartItems   = useSelector(state => state.cart.items);
    const cartStatus  = useSelector(state => state.cart.status);

    const hasLoaded   = useRef(false);
    const syncTimer   = useRef(null);
    const isFirstSync = useRef(true);

    // ── Step 1: Firestore থেকে cart load করো
    useEffect(() => {
        if (userId && cartStatus === "idle" && !hasLoaded.current) {
            dispatch(fetchCart(userId)).then(() => {
                hasLoaded.current = true;
                // load এর পর isFirstSync false করো একটু delay দিয়ে
                setTimeout(() => { isFirstSync.current = false; }, 500);
            });
        }
    }, [userId, cartStatus]);

    // ── Step 2: cart change হলে debounce দিয়ে sync করো
    // কিন্তু initial load এর সময় sync করবে না
    useEffect(() => {
        if (!userId || !hasLoaded.current || isFirstSync.current) return;

        clearTimeout(syncTimer.current);
        syncTimer.current = setTimeout(() => {
            dispatch(syncCartToFirestore({ userId, items: cartItems }));
        }, 800);

        return () => clearTimeout(syncTimer.current);
    }, [cartItems, userId]);

    return null;
};

// ✅ সুন্দর 404 page
const NotFound = () => {
    const navigate = useNavigate();

    const CSS = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .nf-root {
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 40px 24px;
            text-align: center;
            animation: nf-up 0.5s cubic-bezier(0.4,0,0.2,1) both;
        }
        @keyframes nf-up {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .nf-badge {
            display: inline-flex; align-items: center; gap: 6px;
            background: #f0fdf4; border: 1.5px solid #bbf7d0;
            color: #16a34a; border-radius: 100px;
            padding: 5px 14px; font-size: 0.72rem; font-weight: 700;
            margin-bottom: 24px; letter-spacing: 0.3px;
        }
        .nf-code {
            font-size: clamp(6rem, 18vw, 10rem);
            font-weight: 800;
            color: #f1f5f9;
            letter-spacing: -6px;
            line-height: 1;
            margin-bottom: 8px;
            position: relative;
        }
        .nf-code span { color: #16a34a; }
        .nf-title {
            font-size: 1.4rem; font-weight: 800;
            color: #0f172a; margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        .nf-sub {
            font-size: 0.875rem; color: #94a3b8;
            max-width: 360px; line-height: 1.7;
            margin-bottom: 32px; font-weight: 400;
        }
        .nf-btns { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .nf-btn-primary {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 28px; background: #0f172a; color: #fff;
            font-size: 0.875rem; font-weight: 700;
            font-family: 'Plus Jakarta Sans', sans-serif;
            border: none; border-radius: 100px; cursor: pointer;
            text-decoration: none; transition: all 0.22s;
            box-shadow: 0 4px 14px rgba(15,23,42,0.18);
        }
        .nf-btn-primary:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15,23,42,0.25); }
        .nf-btn-secondary {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 28px; background: #fff; color: #475569;
            font-size: 0.875rem; font-weight: 700;
            font-family: 'Plus Jakarta Sans', sans-serif;
            border: 1.5px solid #e2e8f0; border-radius: 100px; cursor: pointer;
            text-decoration: none; transition: all 0.22s;
        }
        .nf-btn-secondary:hover { border-color: #bbf7d0; color: #16a34a; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(22,163,74,0.1); }
    `;

    return (
        <>
            <style>{CSS}</style>
            <div className="nf-root">
                <div className="nf-badge">⚠ Page Not Found</div>
                <div className="nf-code">4<span>0</span>4</div>
                <h1 className="nf-title">Oops! This page doesn't exist</h1>
                <p className="nf-sub">
                    The page you're looking for may have been moved, deleted, or never existed. Let's get you back on track.
                </p>
                <div className="nf-btns">
                    <button className="nf-btn-primary" onClick={() => navigate("/")}>
                        ← Back to Home
                    </button>
                    <button className="nf-btn-secondary" onClick={() => navigate("/shop")}>
                        Browse Shop
                    </button>
                </div>
            </div>
        </>
    );
};

export default function App() {
    const { user, loading } = useCurrentUser();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) dispatch(fetchAddresses(user.uid));
    }, [user]);

    if (loading) return <Loading />;

    return (
        <FloatingToastProvider>
            <>
                {user && <CartSync userId={user.uid} />}

                <Routes>

                    {/* ── Public Routes ── */}
                    <Route path="/"               element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/shop"           element={<PublicLayout><Shop /></PublicLayout>} />
                    <Route path="/about"          element={<PublicLayout><About /></PublicLayout>} />
                    <Route path="/contact"        element={<PublicLayout><Contact /></PublicLayout>} />
                    <Route path="/shop/:username" element={<PublicLayout><StoreShop /></PublicLayout>} />
                    <Route path="/product/:id"    element={<PublicLayout><ProductPage /></PublicLayout>} />
                    <Route path="/pricing"        element={<PublicLayout><Pricing /></PublicLayout>} />
                    <Route path="/wishlist"       element={<PublicLayout><Wishlist /></PublicLayout>} />

                    {/* ── Protected Routes ── */}
                    <Route path="/address-book" element={<PublicLayout><ProtectedRoute><AddressBook /></ProtectedRoute></PublicLayout>} />
                    <Route path="/checkout"     element={<PublicLayout><ProtectedRoute><Checkout /></ProtectedRoute></PublicLayout>} />
                    <Route path="/payment"      element={<PublicLayout><ProtectedRoute><PricingPayment /></ProtectedRoute></PublicLayout>} />
                    <Route path="/create-store" element={<PublicLayout><ProtectedRoute><CreateStore /></ProtectedRoute></PublicLayout>} />
                    <Route path="/cart"         element={<PublicLayout><ProtectedRoute><Cart /></ProtectedRoute></PublicLayout>} />
                    <Route path="/orders"       element={<PublicLayout><ProtectedRoute><Orders /></ProtectedRoute></PublicLayout>} />

                    {/* ── Auth Routes ── */}
                    <Route path="/login"       element={<Login />} />
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* ── Admin Routes ── */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index                    element={<AdminDashboard />} />
                        <Route path="stores"            element={<AdminStores />} />
                        <Route path="approve"           element={<AdminApprove />} />
                        <Route path="coupons"           element={<AdminCoupons />} />
                        <Route path="pricing"           element={<AdminPricing />} />
                        <Route path="payment-settings"  element={<AdminPaymentSettings />} />
                        <Route path="banner-settings"   element={<AdminBannerSettings />} />
                        <Route path="plusApprove"       element={<AdminPlusApprove />} />
                        <Route path="users"             element={<Users />} />
                        <Route path="plus-users"        element={<PlusUsers />} />
                    </Route>

                    {/* ── Store Routes ── */}
                    <Route path="/store" element={<StoreLayout />}>
                        <Route index                    element={<StoreDashboard />} />
                        <Route path="add-product"       element={<AddProduct />} />
                        <Route path="manage-product"    element={<ManageProducts />} />
                        <Route path="orders"            element={<StoreOrders />} />
                        <Route path="payment-settings"  element={<PaymentSettings />} />
                    </Route>

                    {/* ── 404 ── */}
                    <Route path="*" element={
                        <PublicLayout>
                            <NotFound />
                        </PublicLayout>
                    } />

                </Routes>
            </>
        </FloatingToastProvider>
    );
}