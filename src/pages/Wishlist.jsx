import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, Trash2Icon, ArrowRightIcon } from 'lucide-react';
import { addToCart } from '../lib/features/cart/cartSlice';
import { StarIcon } from 'lucide-react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.wl-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 70vh;
    padding: 0 24px;
    animation: wl-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes wl-fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
}
.wl-inner { max-width: 1280px; margin: 0 auto; padding: 32px 0 80px; }

/* ── Header ── */
.wl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    animation: wl-fadeUp 0.5s 0.05s cubic-bezier(0.4,0,0.2,1) both;
}
.wl-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 4px;
}
.wl-title span { color: #0f172a; font-weight: 800; }
.wl-sub { font-size: 0.78rem; color: #94a3b8; margin: 0; font-weight: 400; }
.wl-count {
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    color: #ef4444;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
}

/* ── Grid ── */
.wl-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    animation: wl-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
@media (min-width: 768px)  { .wl-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; } }
@media (min-width: 1024px) { .wl-grid { grid-template-columns: repeat(5, 1fr); gap: 20px; } }
@media (min-width: 1280px) { .wl-grid { grid-template-columns: repeat(6, 1fr); gap: 22px; } }
@media (max-width: 480px)  { .wl-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

/* stagger */
.wl-grid > *:nth-child(1)  { animation: wl-fadeUp 0.4s 0.08s cubic-bezier(0.4,0,0.2,1) both; }
.wl-grid > *:nth-child(2)  { animation: wl-fadeUp 0.4s 0.12s cubic-bezier(0.4,0,0.2,1) both; }
.wl-grid > *:nth-child(3)  { animation: wl-fadeUp 0.4s 0.16s cubic-bezier(0.4,0,0.2,1) both; }
.wl-grid > *:nth-child(4)  { animation: wl-fadeUp 0.4s 0.20s cubic-bezier(0.4,0,0.2,1) both; }
.wl-grid > *:nth-child(n+5){ animation: wl-fadeUp 0.4s 0.24s cubic-bezier(0.4,0,0.2,1) both; }

/* ── Wishlist card ── */
.wl-card {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid #e2e8f0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s, border-color 0.25s;
    height: 100%;
}
.wl-card:hover {
    transform: translateY(-3px);
    border-color: #fecaca;
    box-shadow: 0 12px 32px rgba(239,68,68,0.08);
}

/* ── Image ── */
.wl-img-wrap {
    background: #f8f8f8;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 16px;
    box-sizing: border-box;
    position: relative;
}
.wl-img {
    width: 75%; height: 75%;
    object-fit: contain;
    mix-blend-mode: multiply;
    display: block;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
}
.wl-card:hover .wl-img { transform: scale(1.06); }

/* remove btn */
.wl-remove-btn {
    position: absolute; top: 8px; right: 8px;
    width: 28px; height: 28px; border-radius: 50%;
    background: #fff;
    border: 1.5px solid #fecaca;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; z-index: 2;
    color: #ef4444;
}
.wl-remove-btn:hover {
    background: #fef2f2;
    border-color: #ef4444;
    transform: scale(1.1);
}
.wl-remove-btn:active { transform: scale(0.93); }

/* ── Info ── */
.wl-info {
    padding: 10px 12px 12px;
    display: flex; flex-direction: column; gap: 5px; flex: 1;
    border-top: 1px solid #f0f0f0;
    text-decoration: none;
    color: inherit;
}
.wl-name {
    font-size: 0.775rem; font-weight: 500;
    color: #1a1a1a; line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; min-height: 34px;
}
.wl-stars { display: flex; gap: 2px; align-items: center; }

/* ── Bottom ── */
.wl-bottom {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-top: auto; padding-top: 4px;
}
.wl-price {
    font-size: 0.875rem; font-weight: 700;
    color: #0f172a; letter-spacing: -0.01em;
}
.wl-cart-btn {
    width: 30px; height: 30px; border-radius: 8px;
    background: #16a34a; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0; color: #fff;
}
.wl-cart-btn:hover  { background: #15803d; transform: scale(1.07); }
.wl-cart-btn:active { transform: scale(0.96); }
.wl-cart-btn.added  { background: #0f172a; }

/* ── Empty ── */
.wl-empty {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: wl-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
.wl-empty-card {
    text-align: center;
    padding: 56px 48px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 28px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.05);
    max-width: 360px;
    width: 100%;
}
.wl-empty-icon {
    width: 76px; height: 76px;
    border-radius: 50%;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: #ef4444;
}
.wl-empty-title {
    font-size: 1.1rem; font-weight: 800;
    color: #0f172a; margin: 0 0 8px;
    letter-spacing: -0.3px;
}
.wl-empty-sub {
    font-size: 0.825rem; color: #94a3b8;
    margin: 0 0 28px; line-height: 1.65; font-weight: 400;
}
.wl-empty-btn {
    display: inline-flex;
    align-items: center; gap: 8px;
    padding: 12px 28px;
    background: #16a34a; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 100px; cursor: pointer;
    transition: all 0.22s;
    box-shadow: 0 4px 16px rgba(22,163,74,0.32);
    text-decoration: none;
}
.wl-empty-btn:hover {
    background: #15803d;
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(22,163,74,0.4);
}

@media (max-width: 480px) {
    .wl-root { padding: 0 12px; }
    .wl-title { font-size: 1.25rem; }
    .wl-empty-card { padding: 40px 24px; }
}
`;

// ── Wishlist Redux slice লাগবে — নিচে দেওয়া আছে
// src/lib/features/wishlist/wishlistSlice.js থেকে import করো
import {
    addToWishlist,
    removeFromWishlist,
    selectWishlistItems,
} from '../lib/features/wishlist/wishlistSlice';

export default function Wishlist() {
    const dispatch   = useDispatch();
    const navigate   = useNavigate();
    const currency   = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

    const wishlist   = useSelector(selectWishlistItems);
    const products   = useSelector(state => state.product.items);

    // wishlist IDs দিয়ে full product data বের করো
    const wishlistProducts = wishlist
        .map(id => products.find(p => p.id === id))
        .filter(Boolean);

    const [addedMap, setAddedMap] = useState({});

    const handleCart = (e, product) => {
        e.preventDefault();
        dispatch(addToCart({ ...product, qty: 1 }));
        setAddedMap(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => setAddedMap(prev => ({ ...prev, [product.id]: false })), 1500);
    };

    const handleRemove = (e, id) => {
        e.preventDefault();
        dispatch(removeFromWishlist(id));
    };

    // Empty state
    if (wishlistProducts.length === 0) return (
        <>
            <style>{CSS}</style>
            <div className="wl-empty">
                <div className="wl-empty-card">
                    <div className="wl-empty-icon">
                        <HeartIcon size={32} strokeWidth={1.8} />
                    </div>
                    <p className="wl-empty-title">Your wishlist is empty</p>
                    <p className="wl-empty-sub">
                        Save products you love by tapping the heart icon — find them all here.
                    </p>
                    <Link to="/shop" className="wl-empty-btn">
                        Browse Products <ArrowRightIcon size={15} />
                    </Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="wl-root">
                <div className="wl-inner">

                    {/* Header */}
                    <div className="wl-header">
                        <div>
                            <h1 className="wl-title">My <span>Wishlist</span></h1>
                            <p className="wl-sub">Products you've saved</p>
                        </div>
                        <span className="wl-count">
                            <HeartIcon size={11} fill="#ef4444" stroke="none" />
                            {wishlistProducts.length} saved
                        </span>
                    </div>

                    {/* Grid */}
                    <div className="wl-grid">
                        {wishlistProducts.map(product => {
                            const rating = Math.round(product.avgRating || 0);
                            return (
                                <div key={product.id} className="wl-card">

                                    {/* Image */}
                                    <div className="wl-img-wrap">
                                        <button
                                            className="wl-remove-btn"
                                            onClick={e => handleRemove(e, product.id)}
                                            aria-label="Remove from wishlist"
                                        >
                                            <Trash2Icon size={12} />
                                        </button>
                                        <img
                                            className="wl-img"
                                            src={product.image || product.images?.[0] || ''}
                                            alt={product.name}
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Info */}
                                    <Link to={`/product/${product.id}`} className="wl-info">
                                        <p className="wl-name">{product.name}</p>

                                        {product.avgRating > 0 && (
                                            <div className="wl-stars">
                                                {Array(5).fill('').map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        size={10}
                                                        fill={rating >= i + 1 ? '#16a34a' : '#d1d5db'}
                                                        stroke="none"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <div className="wl-bottom">
                                            <span className="wl-price">{currency}{product.price}</span>
                                            <button
                                                className={`wl-cart-btn${addedMap[product.id] ? ' added' : ''}`}
                                                onClick={e => handleCart(e, product)}
                                                aria-label="Add to cart"
                                            >
                                                <ShoppingCartIcon size={12} />
                                            </button>
                                        </div>
                                    </Link>

                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </>
    );
}