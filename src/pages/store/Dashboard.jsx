import Loading from "../../components/Loading";
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon, ArrowRightIcon, RefreshCwIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { getStoreOrders } from "../../lib/services/orderService";
import { getProductsByStore } from "../../lib/services/productService";
import { getStoreReviews } from "../../lib/services/reviewService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.sd-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

.sd-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 20px; display: flex; align-items: center; justify-content: space-between; }
.sd-title span { color: #0f172a; font-weight: 800; }

/* ── Alert ── */
.sd-alert { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.sd-alert-icon { width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.6rem; font-weight: 800; }
.sd-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.sd-alert.error   .sd-alert-icon { background: #fda4af; color: #9f1239; }
.sd-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.sd-alert.success .sd-alert-icon { background: #86efac; color: #14532d; }
.sd-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.sd-alert.warning .sd-alert-icon { background: #fcd34d; color: #92400e; }
.sd-alert-body { flex: 1; }
.sd-alert-msg  { font-size: 0.8rem; }
.sd-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.sd-alert-close:hover { opacity: 1; }

/* ── Refresh ── */
.sd-refresh-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 100px; font-size: 0.75rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: #64748b; cursor: pointer; transition: all 0.18s; }
.sd-refresh-btn:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.sd-refresh-btn.spinning svg { animation: sd-spin 0.7s linear infinite; }
@keyframes sd-spin { to { transform: rotate(360deg); } }

/* ── Stats grid ── */
.sd-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
@media (max-width: 1024px) { .sd-stats { grid-template-columns: repeat(2, 1fr); } }

.sd-stat-card {
    background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px;
    padding: 20px; display: flex; flex-direction: column; gap: 12px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    position: relative; overflow: hidden;
}
.sd-stat-card::before { content: ''; position: absolute; top: -20px; right: -20px; width: 72px; height: 72px; border-radius: 50%; background: rgba(22,163,74,0.05); pointer-events: none; }
.sd-stat-card:hover { border-color: #bbf7d0; box-shadow: 0 6px 24px rgba(22,163,74,0.08); transform: translateY(-2px); }
.sd-stat-top  { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.sd-stat-label { font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; margin: 0; }
.sd-stat-icon { width: 36px; height: 36px; border-radius: 11px; background: #f0fdf4; border: 1.5px solid #bbf7d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #16a34a; }
.sd-stat-val  { font-size: 1.65rem; font-weight: 800; color: #0f172a; letter-spacing: -0.6px; line-height: 1; margin: 0; }
@media (max-width: 400px) { .sd-stat-val { font-size: 1.3rem; } .sd-stat-icon { width: 32px; height: 32px; } }

/* ── Section label ── */
.sd-sec { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #94a3b8; margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.sd-sec::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

/* ── Reviews header ── */
.sd-reviews-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
.sd-reviews-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; }
.sd-count-badge { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

/* ── SmartAvatar ── */
.sd-avatar-img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #f1f5f9; flex-shrink: 0; }
.sd-avatar-placeholder { width: 36px; height: 36px; border-radius: 50%; background: #f0fdf4; border: 1.5px solid #bbf7d0; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700; color: #16a34a; text-transform: uppercase; flex-shrink: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
.sd-mob-avatar-img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1.5px solid #f1f5f9; flex-shrink: 0; }
.sd-mob-avatar-placeholder { width: 36px; height: 36px; border-radius: 50%; background: #f0fdf4; border: 1.5px solid #bbf7d0; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700; color: #16a34a; text-transform: uppercase; flex-shrink: 0; font-family: 'Plus Jakarta Sans', sans-serif; }

/* ── Desktop review list ── */
.sd-reviews { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 4px 20px; }
.sd-review-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 0; border-bottom: 1.5px solid #f8fafc; }
.sd-review-card:last-child { border-bottom: none; }
.sd-reviewer { display: flex; gap: 12px; flex: 1; min-width: 0; }
.sd-reviewer-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
.sd-reviewer-date { font-size: 0.7rem; color: #94a3b8; font-weight: 400; margin-bottom: 6px; }
.sd-review-text { font-size: 0.8rem; color: #475569; line-height: 1.65; font-weight: 400; }
.sd-review-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; min-width: 130px; }
.sd-product-cat  { font-size: 0.65rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; }
.sd-product-name { font-size: 0.78rem; font-weight: 700; color: #0f172a; text-align: right; }
.sd-stars { display: flex; gap: 2px; }
.sd-view-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 100px; font-size: 0.72rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: #475569; cursor: pointer; transition: all 0.18s; }
.sd-view-btn:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }

/* ── Mobile review cards ── */
.sd-mobile-reviews { display: none; flex-direction: column; gap: 10px; }
.sd-mob-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; padding: 16px; transition: border-color 0.2s; }
.sd-mob-card:hover { border-color: #e2e8f0; }
.sd-mob-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.sd-mob-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 1px; }
.sd-mob-date { font-size: 0.68rem; color: #94a3b8; font-weight: 400; }
.sd-mob-stars { display: flex; gap: 2px; margin-left: auto; flex-shrink: 0; }
.sd-mob-text { font-size: 0.8rem; color: #475569; line-height: 1.65; margin-bottom: 12px; }
.sd-mob-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 10px; border-top: 1.5px solid #f8fafc; flex-wrap: wrap; }
.sd-mob-product-cat  { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 1px; }
.sd-mob-product-name { font-size: 0.78rem; font-weight: 700; color: #0f172a; }

.sd-empty { text-align: center; padding: 48px 20px; color: #94a3b8; font-size: 0.85rem; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; }

@media (max-width: 640px) {
    .sd-title { font-size: 1.25rem; }
    .sd-reviews { display: none; }
    .sd-mobile-reviews { display: flex; }
}
`;

// ── SmartAvatar ──
const SmartAvatar = ({ name, image, imgClass, placeholderClass }) => {
    const [imgOk, setImgOk] = useState(!!image);
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    if (!image || !imgOk) return <div className={placeholderClass}>{initial}</div>;
    return <img src={image} alt={name} className={imgClass} onError={() => setImgOk(false)} />;
};

// ── Inline Alert ──
const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', warning: '!' };
    return (
        <div className={`sd-alert ${type}`}>
            <div className="sd-alert-icon">{icons[type]}</div>
            <div className="sd-alert-body">
                <span className="sd-alert-msg">{message}</span>
            </div>
            {onDismiss && (
                <button className="sd-alert-close" onClick={onDismiss} type="button">✕</button>
            )}
        </div>
    );
};

export default function StoreDashboard() {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "৳";
    const navigate = useNavigate();
    const { user, loading: userLoading } = useCurrentUser();

    const [loading, setLoading]     = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [alert, setAlert]         = useState(null);
    const [data, setData]           = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
    });

    const showAlert = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    const fetchData = useCallback(async (showRefreshSpinner = false) => {
        if (userLoading) return;

        if (!user) {
            setLoading(false);
            showAlert("warning", "Please login to view dashboard.");
            return;
        }

        if (showRefreshSpinner) setRefreshing(true);
        clearAlert();

        try {
            const store = await getStoreByUser(user.uid);

            if (!store) {
                setLoading(false);
                setRefreshing(false);
                showAlert("warning", "No store found. Please create a store first.");
                return;
            }

            const [orders, products, reviews] = await Promise.all([
                getStoreOrders(store.id),
                getProductsByStore(store.id),
                getStoreReviews(store.id),
            ]);

            const totalEarnings = orders.reduce((s, o) => s + (o.total || 0), 0);

            setData({
                totalProducts: products.length || 0,
                totalEarnings: totalEarnings || 0,
                totalOrders: orders.length || 0,
                ratings: reviews || [],
            });

            if (showRefreshSpinner) {
                showAlert("success", "Dashboard refreshed successfully.");
            }

        } catch (err) {
            console.error("Error fetching store data:", err);
            setData({ totalProducts: 0, totalEarnings: 0, totalOrders: 0, ratings: [] });
            showAlert("error", "Failed to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, userLoading]);

    useEffect(() => {
        if (!userLoading) fetchData(false);
    }, [fetchData, userLoading]);

    const statCards = [
        { title: "Products", value: data.totalProducts,                     icon: ShoppingBasketIcon },
        { title: "Earnings", value: currency + data.totalEarnings.toFixed(0), icon: CircleDollarSignIcon },
        { title: "Orders",   value: data.totalOrders,                       icon: TagsIcon },
        { title: "Reviews",  value: data.ratings.length,                    icon: StarIcon },
    ];

    const formatDate = (val) => {
        if (!val) return "—";
        try {
            const d = val?.toDate ? val.toDate() : new Date(val);
            return d.toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" });
        } catch { return "—"; }
    };

    const Stars = ({ rating }) => (
        <div className="sd-stars">
            {Array(5).fill("").map((_, j) => (
                <StarIcon key={j} size={12} style={{ color: 'transparent' }} fill={rating >= j + 1 ? "#16a34a" : "#e2e8f0"} />
            ))}
        </div>
    );

    const getReviewerName = (review) => {
        const name = review.user?.name || review.userName || "Customer";
        if (name.includes('@')) return name.split('@')[0];
        return name;
    };
    const getReviewerImage = (review) => review.user?.image || review.userImage || null;

    const handleViewProduct = (productId) => {
        if (!productId) {
            showAlert("error", "Product not found.");
            return;
        }
        navigate(`/product/${productId}`);
    };

    if (userLoading || loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="sd-root">

                {/* Title + Refresh */}
                <h1 className="sd-title">
                    <span>Seller <span style={{ color: '#64748b', fontWeight: 500 }}>Dashboard</span></span>
                    <button
                        className={`sd-refresh-btn ${refreshing ? 'spinning' : ''}`}
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                    >
                        <RefreshCwIcon size={13} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </h1>

                {/* Inline Alert */}
                {alert && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onDismiss={clearAlert}
                    />
                )}

                {/* Stats */}
                <div className="sd-stats">
                    {statCards.map((card, i) => (
                        <div key={i} className="sd-stat-card">
                            <div>
                                <p className="sd-stat-label">{card.title}</p>
                                <p className="sd-stat-val">{card.value}</p>
                            </div>
                            <div className="sd-stat-icon"><card.icon size={17} /></div>
                        </div>
                    ))}
                </div>

                {/* Reviews header */}
                <div className="sd-reviews-head">
                    <p className="sd-reviews-title">Customer Reviews</p>
                    {data.ratings.length > 0 && (
                        <span className="sd-count-badge">{data.ratings.length} total</span>
                    )}
                </div>

                {data.ratings.length === 0 ? (
                    <div className="sd-empty">No reviews yet.</div>
                ) : (
                    <>
                        {/* Desktop list */}
                        <div className="sd-reviews">
                            {data.ratings.map((review, i) => (
                                <div key={i} className="sd-review-card">
                                    <div className="sd-reviewer">
                                        <SmartAvatar
                                            name={getReviewerName(review)}
                                            image={getReviewerImage(review)}
                                            imgClass="sd-avatar-img"
                                            placeholderClass="sd-avatar-placeholder"
                                        />
                                        <div style={{ minWidth: 0 }}>
                                            <p className="sd-reviewer-name">{getReviewerName(review)}</p>
                                            <p className="sd-reviewer-date">{formatDate(review.createdAt)}</p>
                                            <p className="sd-review-text">{review.review || "No review text"}</p>
                                        </div>
                                    </div>
                                    <div className="sd-review-meta">
                                        <p className="sd-product-cat">{review.product?.category || "Product"}</p>
                                        <p className="sd-product-name">{review.product?.name || "Unknown"}</p>
                                        <Stars rating={review.rating || 0} />
                                        <button className="sd-view-btn" onClick={() => handleViewProduct(review.productId)}>
                                            View <ArrowRightIcon size={11} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile cards */}
                        <div className="sd-mobile-reviews">
                            {data.ratings.map((review, i) => (
                                <div key={i} className="sd-mob-card">
                                    <div className="sd-mob-top">
                                        <SmartAvatar
                                            name={getReviewerName(review)}
                                            image={getReviewerImage(review)}
                                            imgClass="sd-mob-avatar-img"
                                            placeholderClass="sd-mob-avatar-placeholder"
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p className="sd-mob-name">{getReviewerName(review)}</p>
                                            <p className="sd-mob-date">{formatDate(review.createdAt)}</p>
                                        </div>
                                        <div className="sd-mob-stars">
                                            <Stars rating={review.rating || 0} />
                                        </div>
                                    </div>
                                    <p className="sd-mob-text">{review.review || "No review text"}</p>
                                    <div className="sd-mob-bottom">
                                        <div className="sd-mob-product">
                                            <p className="sd-mob-product-cat">{review.product?.category || "Product"}</p>
                                            <p className="sd-mob-product-name">{review.product?.name || "Unknown"}</p>
                                        </div>
                                        <button className="sd-view-btn" onClick={() => handleViewProduct(review.productId)}>
                                            View <ArrowRightIcon size={11} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </>
    );
}