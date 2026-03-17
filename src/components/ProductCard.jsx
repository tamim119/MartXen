import { StarIcon, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../lib/features/cart/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../lib/features/wishlist/wishlistSlice';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pc-wrap {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid #e2e8f0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.28s,
                border-color 0.28s;
    position: relative;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
    height: 100%;
}
.pc-wrap:hover {
    transform: translateY(-3px);
    border-color: #bbf7d0;
    box-shadow: 0 12px 32px rgba(22,163,74,0.1);
}
.pc-img-wrap {
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
.pc-img {
    width: 75%; height: 75%;
    object-fit: contain;
    mix-blend-mode: multiply;
    display: block;
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
}
.pc-wrap:hover .pc-img { transform: scale(1.06); }
.pc-badge {
    position: absolute; top: 8px; left: 8px;
    font-size: 9px; font-weight: 700;
    padding: 2px 7px; border-radius: 100px;
    letter-spacing: 0.03em; z-index: 2;
    text-transform: uppercase;
}
.pc-badge-sale { background: #dcfce7; color: #15803d; }
.pc-badge-new  { background: #eff6ff; color: #1d4ed8; }
.pc-badge-hot  { background: #fff7ed; color: #c2410c; }
.pc-wish {
    position: absolute; top: 8px; right: 8px;
    width: 26px; height: 26px; border-radius: 50%;
    background: #fff; border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; z-index: 2;
    color: #94a3b8;
}
.pc-wish:hover  { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }
.pc-wish.active { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }
.pc-info {
    padding: 10px 12px 12px;
    display: flex; flex-direction: column; gap: 5px; flex: 1;
    border-top: 1px solid #f0f0f0;
}
.pc-name {
    font-size: 0.775rem; font-weight: 500;
    color: #1a1a1a; line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; min-height: 34px;
}
.pc-stars  { display: flex; gap: 2px; align-items: center; }
.pc-rating { font-size: 0.65rem; color: #64748b; margin-left: 3px; }
.pc-bottom {
    display: flex; align-items: center;
    justify-content: space-between; margin-top: auto;
    padding-top: 4px;
}
.pc-prices { display: flex; flex-direction: column; }
.pc-price  { font-size: 0.85rem; font-weight: 700; color: #1a1a1a; letter-spacing: -0.01em; line-height: 1; }
.pc-old    { font-size: 0.68rem; color: #94a3b8; text-decoration: line-through; margin-top: 1px; }
.pc-cart {
    width: 30px; height: 30px; border-radius: 8px;
    background: #16a34a; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; flex-shrink: 0; color: #fff;
}
.pc-cart:hover  { background: #15803d; transform: scale(1.07); }
.pc-cart:active { transform: scale(0.96); }
.pc-cart.added  { background: #0f172a; }
`;

const ProductCard = ({ product }) => {
    const currency    = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const dispatch    = useDispatch();
    const isWishlisted = useSelector(selectIsWishlisted(product.id));
    const [added, setAdded] = useState(false);

    const rating      = Math.round(product.avgRating || 0);
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    const badge =
        product.badge === 'new'  ? { label: 'New',    cls: 'pc-badge-new'  } :
        product.badge === 'hot'  ? { label: 'Hot 🔥', cls: 'pc-badge-hot'  } :
        hasDiscount              ? { label: `${Math.round((1 - product.price / product.originalPrice) * 100)}% Off`, cls: 'pc-badge-sale' } :
        null;

    const handleCart = (e) => {
        e.preventDefault();
        dispatch(addToCart({ ...product, qty: 1 }));
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleWish = (e) => {
        e.preventDefault();
        dispatch(toggleWishlist(product.id));
    };

    return (
        <>
            <style>{CSS}</style>
            <Link to={`/product/${product.id}`} className="pc-wrap">
                <div className="pc-img-wrap">
                    {badge && <span className={`pc-badge ${badge.cls}`}>{badge.label}</span>}
                    <button
                        className={`pc-wish${isWishlisted ? ' active' : ''}`}
                        onClick={handleWish}
                        aria-label="Wishlist"
                    >
                        <Heart
                            size={11}
                            fill={isWishlisted ? '#ef4444' : 'none'}
                            stroke={isWishlisted ? '#ef4444' : 'currentColor'}
                        />
                    </button>
                    <img
                        className="pc-img"
                        src={product.image || product.images?.[0] || ''}
                        alt={product.name}
                        loading="lazy"
                    />
                </div>

                <div className="pc-info">
                    <p className="pc-name">{product.name}</p>
                    {product.avgRating > 0 && (
                        <div className="pc-stars">
                            {Array(5).fill('').map((_, i) => (
                                <StarIcon
                                    key={i}
                                    size={10}
                                    fill={rating >= i + 1 ? '#16a34a' : '#d1d5db'}
                                    stroke="none"
                                />
                            ))}
                            {product.reviewCount > 0 && (
                                <span className="pc-rating">({product.reviewCount})</span>
                            )}
                        </div>
                    )}
                    <div className="pc-bottom">
                        <div className="pc-prices">
                            <span className="pc-price">{currency}{product.price}</span>
                            {hasDiscount && (
                                <span className="pc-old">{currency}{product.originalPrice}</span>
                            )}
                        </div>
                        <button
                            className={`pc-cart${added ? ' added' : ''}`}
                            onClick={handleCart}
                            aria-label="Add to cart"
                        >
                            <ShoppingCart size={12} />
                        </button>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default ProductCard;