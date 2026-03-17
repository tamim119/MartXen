import { addToCart } from "../lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pd-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    gap: 48px;
}
@media (max-width: 1024px) {
    .pd-root { flex-direction: column; gap: 32px; }
}

/* ── Gallery ── */
.pd-gallery {
    display: flex;
    gap: 12px;
}
@media (max-width: 640px) {
    .pd-gallery { flex-direction: column-reverse; }
}

.pd-thumbs {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
@media (max-width: 640px) {
    .pd-thumbs { flex-direction: row; }
}

.pd-thumb {
    width: 68px; height: 68px;
    border-radius: 14px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s;
    overflow: hidden;
}
.pd-thumb:hover {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
    transform: scale(1.04);
}
.pd-thumb.active {
    border-color: #16a34a;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.15);
}
.pd-thumb img {
    width: 42px; height: 42px;
    object-fit: contain;
    mix-blend-mode: multiply;
    transition: transform 0.2s;
}
.pd-thumb:hover img { transform: scale(1.08); }

.pd-main-img-wrap {
    width: 420px; height: 420px;
    border-radius: 24px;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    border: 1.5px solid #e2e8f0;
}
@media (max-width: 1024px) {
    .pd-main-img-wrap { width: 100%; height: 340px; }
}
@media (max-width: 640px) {
    .pd-main-img-wrap { height: 280px; }
}
.pd-main-img-wrap img {
    width: 280px; height: 280px;
    object-fit: contain;
    mix-blend-mode: multiply;
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    animation: pd-imgIn 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes pd-imgIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
}
.pd-main-img-wrap:hover img { transform: scale(1.06); }

/* ── Info side ── */
.pd-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    animation: pd-fadeUp 0.55s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes pd-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}

.pd-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
    margin: 0 0 12px;
    letter-spacing: -0.5px;
}

/* ── Stars ── */
.pd-stars {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 20px;
}
.pd-review-count {
    font-size: 0.78rem;
    color: #94a3b8;
    margin-left: 6px;
    font-weight: 500;
}

/* ── Price ── */
.pd-price-row {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
}
.pd-price {
    font-size: 2rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -1px;
}
.pd-mrp {
    font-size: 1.1rem;
    color: #94a3b8;
    text-decoration: line-through;
    font-weight: 500;
}

/* ── Discount badge ── */
.pd-discount {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 100px;
    padding: 5px 12px;
    font-size: 0.775rem;
    font-weight: 600;
    color: #16a34a;
    margin-bottom: 24px;
    width: fit-content;
    animation: pd-badge 0.4s 0.35s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes pd-badge {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
}

/* ── Cart actions ── */
.pd-actions {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    margin-top: 8px;
    margin-bottom: 24px;
}
.pd-qty-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
}

.pd-cart-btn {
    padding: 13px 32px;
    border-radius: 100px;
    font-size: 0.875rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    cursor: pointer;
    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
    letter-spacing: 0.2px;
}
.pd-cart-btn.add {
    background: #16a34a;
    color: #fff;
    box-shadow: 0 4px 18px rgba(22,163,74,0.35);
}
.pd-cart-btn.add:hover {
    background: #15803d;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(22,163,74,0.42);
}
.pd-cart-btn.add:active { transform: scale(0.97); }
.pd-cart-btn.view {
    background: #0f172a;
    color: #fff;
    box-shadow: 0 4px 14px rgba(15,23,42,0.2);
}
.pd-cart-btn.view:hover {
    background: #1e293b;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15,23,42,0.28);
}
.pd-cart-btn.view:active { transform: scale(0.97); }

/* ── Divider ── */
.pd-divider {
    border: none;
    border-top: 1.5px solid #f1f5f9;
    margin: 0 0 20px;
}

/* ── Trust badges ── */
.pd-trust {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.pd-trust-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.825rem;
    color: #64748b;
    font-weight: 500;
    padding: 10px 14px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    transition: background 0.18s, border-color 0.18s;
}
.pd-trust-item:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #15803d;
}
.pd-trust-item svg { color: #16a34a; flex-shrink: 0; }
`;

const ProductDetails = ({ product }) => {
    const productId = product.id;
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

    const cartItems = useSelector(state => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [mainImage, setMainImage] = useState(product.images?.[0] || null);
    const [activeThumb, setActiveThumb] = useState(0);

    const isInCart = cartItems.find(i => i.id === productId);

    const addToCartHandler = () => {
        dispatch(addToCart({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || null,
        }));
    };

    const avgRating = Math.round(product.avgRating || 0);
    const ratingCount = product.ratingCount || 0;

    const discount = product.mrp && product.mrp > 0 && product.price < product.mrp
        ? ((product.mrp - product.price) / product.mrp * 100).toFixed(0)
        : null;

    const handleThumb = (img, idx) => {
        setMainImage(img);
        setActiveThumb(idx);
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="pd-root">

                {/* Gallery */}
                <div className="pd-gallery">
                    <div className="pd-thumbs">
                        {product.images?.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => handleThumb(image, index)}
                                className={`pd-thumb ${activeThumb === index ? 'active' : ''}`}
                            >
                                <img src={image} alt={product.name} />
                            </div>
                        ))}
                    </div>
                    <div className="pd-main-img-wrap">
                        {mainImage
                            ? <img key={mainImage} src={mainImage} alt={product.name} />
                            : <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No image available</p>
                        }
                    </div>
                </div>

                {/* Info */}
                <div className="pd-info">
                    <h1 className="pd-title">{product.name}</h1>

                    {/* Stars */}
                    <div className="pd-stars">
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon
                                key={index}
                                size={15}
                                style={{ color: 'transparent' }}
                                fill={avgRating >= index + 1 ? "#00C950" : "#E2E8F0"}
                            />
                        ))}
                        <span className="pd-review-count">{ratingCount} Reviews</span>
                    </div>

                    {/* Price */}
                    <div className="pd-price-row">
                        <span className="pd-price">{currency}{product.price}</span>
                        {product.mrp > product.price && (
                            <span className="pd-mrp">{currency}{product.mrp}</span>
                        )}
                    </div>

                    {/* Discount */}
                    {discount && (
                        <div className="pd-discount">
                            <TagIcon size={12} />
                            Save {discount}% right now
                        </div>
                    )}

                    {/* Cart */}
                    <div className="pd-actions">
                        {isInCart && (
                            <div>
                                <p className="pd-qty-label">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        )}
                        <button
                            onClick={() => !isInCart ? addToCartHandler() : navigate('/cart')}
                            className={`pd-cart-btn ${!isInCart ? 'add' : 'view'}`}
                        >
                            {!isInCart ? 'Add to Cart' : 'View Cart →'}
                        </button>
                    </div>

                    <hr className="pd-divider" />

                    {/* Trust */}
                    <div className="pd-trust">
                        <div className="pd-trust-item"><EarthIcon size={15} /> Free shipping worldwide</div>
                        <div className="pd-trust-item"><CreditCardIcon size={15} /> 100% Secured Payment</div>
                        <div className="pd-trust-item"><UserIcon size={15} /> Trusted by top brands</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;