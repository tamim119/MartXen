import ProductDescription from "../components/ProductDescription";
import ProductDetails from "../components/ProductDetails";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, resetStatus, updateProductReviewLocally } from "../lib/features/product/productSlice";
import { getStoreById } from "../lib/services/storeService";
import { StoreIcon, MapPinIcon, ArrowRightIcon } from "lucide-react";
import Loading from "../components/Loading";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 0 24px;
    margin: 0 auto;
    max-width: 1280px;
    animation: pp-fadeUp 0.65s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes pp-fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}
.pp-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #94a3b8;
    margin: 28px 0 20px;
    animation: pp-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
.pp-breadcrumb-link {
    color: #64748b;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
    background: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
}
.pp-breadcrumb-link:hover { color: #16a34a; }
.pp-breadcrumb-sep { color: #cbd5e1; font-size: 0.75rem; }
.pp-breadcrumb-current {
    color: #16a34a;
    font-weight: 600;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.pp-oos {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    border-radius: 14px;
    padding: 13px 18px;
    margin-bottom: 20px;
    font-size: 0.825rem;
    font-weight: 500;
    color: #dc2626;
    animation: pp-fadeUp 0.5s 0.15s cubic-bezier(0.4,0,0.2,1) both;
}
.pp-oos-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #ef4444;
    flex-shrink: 0;
    animation: pp-pulse 2s ease-in-out infinite;
}
@keyframes pp-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
    50%      { box-shadow: 0 0 0 5px rgba(239,68,68,0); }
}
.pp-details   { animation: pp-fadeUp 0.6s 0.2s cubic-bezier(0.4,0,0.2,1) both; }
.pp-description { animation: pp-fadeUp 0.6s 0.3s cubic-bezier(0.4,0,0.2,1) both; }
.pp-details img,
.pp-details [class*="product-img"],
.pp-details [class*="productImg"],
.pp-details [class*="ProductImg"],
.pp-details [class*="image"] img,
.pp-details picture img {
    mix-blend-mode: multiply;
    background: transparent !important;
}

/* ── Store Card ── */
.pp-store-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 18px 20px;
    margin: 28px 0 8px;
    animation: pp-fadeUp 0.6s 0.35s cubic-bezier(0.4,0,0.2,1) both;
    transition: border-color 0.18s, box-shadow 0.18s;
}
.pp-store-card:hover {
    border-color: #bbf7d0;
    box-shadow: 0 4px 20px rgba(22,163,74,0.08);
}
.pp-store-left { display: flex; align-items: center; gap: 14px; }
.pp-store-logo {
    width: 52px; height: 52px;
    border-radius: 14px;
    object-fit: cover;
    border: 1.5px solid #f1f5f9;
    flex-shrink: 0;
    background: #f8fafc;
}
.pp-store-logo-placeholder {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #16a34a;
    flex-shrink: 0;
}
.pp-store-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 3px;
}
.pp-store-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.2px;
    margin-bottom: 3px;
}
.pp-store-address {
    font-size: 0.72rem;
    color: #94a3b8;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 4px;
}
.pp-store-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 100px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #16a34a;
    text-decoration: none;
    transition: all 0.18s;
    white-space: nowrap;
    flex-shrink: 0;
}
.pp-store-btn:hover {
    background: #16a34a;
    color: #fff;
    border-color: #16a34a;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}

.pp-notfound {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pp-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
.pp-notfound-inner {
    text-align: center;
    padding: 48px 32px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}
.pp-notfound-icon {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    font-size: 1.75rem;
}
.pp-notfound-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
.pp-notfound-sub   { font-size: 0.825rem; color: #64748b; margin: 0 0 20px; }
.pp-notfound-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 22px;
    background: #16a34a;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    transition: all 0.22s;
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}
.pp-notfound-btn:hover {
    background: #15803d;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(22,163,74,0.38);
}
@media (max-width: 768px) {
    .pp-root { padding: 0 18px; }
    .pp-breadcrumb { margin: 20px 0 16px; }
    .pp-store-card { flex-direction: column; align-items: flex-start; }
    .pp-store-btn  { width: 100%; justify-content: center; }
}
@media (max-width: 480px) {
    .pp-root { padding: 0 12px; }
    .pp-breadcrumb { margin: 16px 0 14px; font-size: 0.75rem; }
    .pp-notfound-inner { padding: 36px 20px; }
}
`;

export default function ProductPage() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const products = useSelector(state => state.product.items);
    const status   = useSelector(state => state.product.status);

    const [product, setProduct]     = useState(null);
    const [storeInfo, setStoreInfo] = useState(null);

    useEffect(() => {
        if (products.length === 0 && status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length, status]);

    useEffect(() => {
        if (products.length > 0) {
            const found = products.find(p => p.id === productId);
            setProduct(found || null);
        }
        window.scrollTo(0, 0);
    }, [productId, products]);

    useEffect(() => {
        if (!product?.storeId) return;
        getStoreById(product.storeId)
            .then(store => setStoreInfo(store))
            .catch(() => {});
    }, [product]);

    // ✅ FIX 2: Review submit হলে —
    // ১. আগে Redux local state এ সাথে সাথে update করো (instant UI)
    // ২. তারপর resetStatus করে fresh data Firestore থেকে আনো
    const handleReviewAdded = (newReview) => {
        // Instant local update — user সাথে সাথে নিজের review দেখবে
        dispatch(updateProductReviewLocally({
            productId,
            review: newReview,
        }));
        // Background এ fresh data fetch করো
        dispatch(resetStatus());
        dispatch(fetchProducts());
    };

    if (status === 'loading') return <Loading />;

    if (!product && status === 'succeeded') return (
        <>
            <style>{CSS}</style>
            <div className='pp-notfound'>
                <div className='pp-notfound-inner'>
                    <div className='pp-notfound-icon'>🔍</div>
                    <p className='pp-notfound-title'>Product not found</p>
                    <p className='pp-notfound-sub'>This product may have been removed or doesn't exist.</p>
                    <button className='pp-notfound-btn' onClick={() => navigate('/shop')}>
                        ← Back to Shop
                    </button>
                </div>
            </div>
        </>
    );

    if (!product) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className='pp-root'>

                {/* Breadcrumb */}
                <div className='pp-breadcrumb'>
                    <button className='pp-breadcrumb-link' onClick={() => navigate('/')}>Home</button>
                    <span className='pp-breadcrumb-sep'>›</span>
                    <button className='pp-breadcrumb-link' onClick={() => navigate('/shop')}>Products</button>
                    <span className='pp-breadcrumb-sep'>›</span>
                    <span className='pp-breadcrumb-current'>{product.category}</span>
                </div>

                {/* Out of stock */}
                {!product.inStock && (
                    <div className='pp-oos'>
                        <span className='pp-oos-dot' />
                        This product is currently out of stock.
                    </div>
                )}

                {/* Details */}
                <div className='pp-details'>
                    <ProductDetails product={product} />
                </div>

                {/* Store Card */}
                {storeInfo && (
                    <div className='pp-store-card'>
                        <div className='pp-store-left'>
                            {storeInfo.logo
                                ? <img src={storeInfo.logo} alt={storeInfo.name} className='pp-store-logo' />
                                : <div className='pp-store-logo-placeholder'>
                                    <StoreIcon size={22} strokeWidth={1.5} />
                                  </div>
                            }
                            <div>
                                <p className='pp-store-label'>Sold by</p>
                                <p className='pp-store-name'>{storeInfo.name}</p>
                                {storeInfo.address && (
                                    <p className='pp-store-address'>
                                        <MapPinIcon size={11} />
                                        {storeInfo.address}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Link
                            to={`/shop/${storeInfo.username}`}
                            className='pp-store-btn'
                        >
                            Visit Store <ArrowRightIcon size={13} />
                        </Link>
                    </div>
                )}

                {/* Description with Review Form */}
                <div className='pp-description'>
                    <ProductDescription
                        product={product}
                        onReviewAdded={handleReviewAdded}
                    />
                </div>

            </div>
        </>
    );
}