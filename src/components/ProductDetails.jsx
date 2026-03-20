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
@media (max-width: 1024px) { .pd-root { flex-direction: column; gap: 32px; } }

/* ── Gallery ── */
.pd-gallery { display: flex; gap: 12px; }
@media (max-width: 640px) { .pd-gallery { flex-direction: column-reverse; } }
.pd-thumbs { display: flex; flex-direction: column; gap: 10px; }
@media (max-width: 640px) { .pd-thumbs { flex-direction: row; } }
.pd-thumb { width: 68px; height: 68px; border-radius: 14px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1.5px solid transparent; transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s; overflow: hidden; }
.pd-thumb:hover { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); transform: scale(1.04); }
.pd-thumb.active { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.15); }
.pd-thumb img { width: 42px; height: 42px; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.2s; }
.pd-thumb:hover img { transform: scale(1.08); }
.pd-main-img-wrap { width: 420px; height: 420px; border-radius: 24px; background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; border: 1.5px solid #e2e8f0; }
@media (max-width: 1024px) { .pd-main-img-wrap { width: 100%; height: 340px; } }
@media (max-width: 640px)  { .pd-main-img-wrap { height: 280px; } }
.pd-main-img-wrap img { width: 280px; height: 280px; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.4s cubic-bezier(0.4,0,0.2,1); animation: pd-imgIn 0.5s cubic-bezier(0.4,0,0.2,1) both; }
@keyframes pd-imgIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
.pd-main-img-wrap:hover img { transform: scale(1.06); }

/* ── Info side ── */
.pd-info { flex: 1; display: flex; flex-direction: column; animation: pd-fadeUp 0.55s 0.1s cubic-bezier(0.4,0,0.2,1) both; }
@keyframes pd-fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.pd-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; line-height: 1.25; margin: 0 0 12px; letter-spacing: -0.5px; }
.pd-stars { display: flex; align-items: center; gap: 4px; margin-bottom: 20px; }
.pd-review-count { font-size: 0.78rem; color: #94a3b8; margin-left: 6px; font-weight: 500; }
.pd-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; }
.pd-price { font-size: 2rem; font-weight: 800; color: #0f172a; letter-spacing: -1px; }
.pd-mrp  { font-size: 1.1rem; color: #94a3b8; text-decoration: line-through; font-weight: 500; }
.pd-discount { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 100px; padding: 5px 12px; font-size: 0.775rem; font-weight: 600; color: #16a34a; margin-bottom: 20px; width: fit-content; animation: pd-badge 0.4s 0.35s cubic-bezier(0.4,0,0.2,1) both; }
@keyframes pd-badge { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }

/* ── Category info badges ── */
.pd-cat-info {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-bottom: 18px;
}
.pd-cat-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 10px;
    background: #f8fafc; border: 1.5px solid #f1f5f9;
    font-size: 0.75rem; font-weight: 500; color: #475569;
}
.pd-cat-badge-key {
    font-size: 0.68rem; font-weight: 700;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.3px;
}
.pd-cat-badge-val { color: #0f172a; font-weight: 600; }

/* ── Size / Color selector ── */
.pd-variant-section { margin-bottom: 18px; }
.pd-variant-label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.pd-variant-selected { font-size: 0.72rem; font-weight: 600; color: #16a34a; text-transform: none; letter-spacing: 0; }
.pd-size-chips { display: flex; flex-wrap: wrap; gap: 7px; }
.pd-size-chip { min-width: 38px; height: 36px; padding: 0 12px; border-radius: 9px; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; font-size: 0.78rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; user-select: none; }
.pd-size-chip:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
.pd-size-chip.sel { border-color: #16a34a; background: #16a34a; color: #fff; box-shadow: 0 3px 10px rgba(22,163,74,0.28); }
.pd-color-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.pd-color-chip { padding: 5px 14px; border-radius: 100px; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; font-size: 0.75rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.15s; user-select: none; display: flex; align-items: center; gap: 6px; }
.pd-color-chip:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
.pd-color-chip.sel { border-color: #16a34a; background: #f0fdf4; color: #16a34a; font-weight: 700; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }

/* Generic chips (skinType, language, ageRange etc) */
.pd-generic-chips { display: flex; flex-wrap: wrap; gap: 7px; }
.pd-generic-chip { padding: 5px 12px; border-radius: 100px; border: 1.5px solid #e2e8f0; background: #f8fafc; color: #475569; font-size: 0.75rem; font-weight: 600; }

/* ── Cart actions ── */
.pd-actions { display: flex; align-items: flex-end; gap: 16px; margin-top: 8px; margin-bottom: 24px; }
.pd-qty-label { font-size: 0.78rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
.pd-cart-btn { padding: 13px 32px; border-radius: 100px; font-size: 0.875rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; cursor: pointer; transition: all 0.22s cubic-bezier(0.4,0,0.2,1); letter-spacing: 0.2px; }
.pd-cart-btn.add { background: #16a34a; color: #fff; box-shadow: 0 4px 18px rgba(22,163,74,0.35); }
.pd-cart-btn.add:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.42); }
.pd-cart-btn.add:active { transform: scale(0.97); }
.pd-cart-btn.view { background: #0f172a; color: #fff; box-shadow: 0 4px 14px rgba(15,23,42,0.2); }
.pd-cart-btn.view:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15,23,42,0.28); }
.pd-cart-btn.view:active { transform: scale(0.97); }

.pd-divider { border: none; border-top: 1.5px solid #f1f5f9; margin: 0 0 20px; }
.pd-trust { display: flex; flex-direction: column; gap: 12px; }
.pd-trust-item { display: flex; align-items: center; gap: 12px; font-size: 0.825rem; color: #64748b; font-weight: 500; padding: 10px 14px; border-radius: 12px; background: #f8fafc; border: 1px solid #f1f5f9; transition: background 0.18s, border-color 0.18s; }
.pd-trust-item:hover { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.pd-trust-item svg { color: #16a34a; flex-shrink: 0; }
`;

// ── Color dot ──
const COLOR_MAP = {
    black: "#0f172a", white: "#fff", red: "#ef4444", blue: "#3b82f6",
    green: "#16a34a", yellow: "#eab308", pink: "#ec4899", gray: "#94a3b8",
    grey: "#94a3b8", brown: "#a16207", navy: "#1e3a5f", purple: "#7c3aed",
    orange: "#f97316", silver: "#cbd5e1", beige: "#d4b483", mixed: null,
};
const ColorDot = ({ color }) => {
    const hex = COLOR_MAP[color?.toLowerCase()];
    if (!hex) return null;
    return <span style={{ width: 10, height: 10, borderRadius: "50%", background: hex, border: "1.5px solid rgba(0,0,0,0.1)", display: "inline-block", flexShrink: 0 }} />;
};

// ── Category field config — কোন field কীভাবে দেখাবে ──
const CAT_DISPLAY = {
    "Clothing":        { chips: ["size", "color"], badges: ["material"] },
    "Electronics":     { chips: [], badges: ["brand", "model", "warranty", "connectivity"] },
    "Gadgets":         { chips: [], badges: ["brand", "model", "warranty", "connectivity"] },
    "Home & Kitchen":  { chips: ["color"], badges: ["material", "dimensions"] },
    "Beauty & Health": { chips: ["skinType"], badges: ["volume", "ingredients"] },
    "Toys & Games":    { chips: ["ageRange"], badges: ["material", "batteryRequired"] },
    "Sports & Outdoors": { chips: ["size", "color"], badges: ["material"] },
    "Books & Media":   { chips: ["language"], badges: ["author", "publisher", "isbn"] },
    "Food & Drink":    { chips: [], badges: ["weight", "expiry", "allergens"] },
    "Hobbies & Crafts": { chips: ["color"], badges: ["material", "dimensions"] },
    "Others":          { chips: [], badges: [] },
};

// Field label mapping
const FIELD_LABELS = {
    brand: "Brand", model: "Model", warranty: "Warranty", connectivity: "Connectivity",
    material: "Material", dimensions: "Dimensions", volume: "Volume",
    ingredients: "Ingredients", batteryRequired: "Battery", weight: "Weight",
    expiry: "Expiry", allergens: "Allergens", author: "Author",
    publisher: "Publisher", isbn: "ISBN",
};

const CHIP_LABELS = {
    size: "Size", color: "Color", skinType: "Skin Type",
    ageRange: "Age Range", language: "Language",
};

const ProductDetails = ({ product }) => {
    const productId = product.id;
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

    const cartItems = useSelector(state => state.cart.items);
    const dispatch  = useDispatch();
    const navigate  = useNavigate();

    const [mainImage,   setMainImage]   = useState(product.images?.[0] || null);
    const [activeThumb, setActiveThumb] = useState(0);
    const [selSize,     setSelSize]     = useState(null);
    const [selColor,    setSelColor]    = useState(null);
    const [selGeneric,  setSelGeneric]  = useState({}); // for skinType, ageRange, language

    const isInCart = cartItems.find(i => i.id === productId);

    const addToCartHandler = () => {
        dispatch(addToCart({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || null,
            ...(selSize  && { size: selSize }),
            ...(selColor && { color: selColor }),
            ...selGeneric,
        }));
    };

    const avgRating   = Math.round(product.avgRating || 0);
    const ratingCount = product.ratingCount || 0;
    const discount    = product.mrp && product.mrp > 0 && product.price < product.mrp
        ? ((product.mrp - product.price) / product.mrp * 100).toFixed(0) : null;

    const handleThumb = (img, idx) => { setMainImage(img); setActiveThumb(idx); };

    // category display config
    const catDisplay = CAT_DISPLAY[product.category] || { chips: [], badges: [] };

    return (
        <>
            <style>{CSS}</style>
            <div className="pd-root">

                {/* Gallery */}
                <div className="pd-gallery">
                    <div className="pd-thumbs">
                        {product.images?.map((image, index) => (
                            <div key={index} onClick={() => handleThumb(image, index)} className={`pd-thumb ${activeThumb === index ? 'active' : ''}`}>
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
                            <StarIcon key={index} size={15} style={{ color: 'transparent' }} fill={avgRating >= index + 1 ? "#00C950" : "#E2E8F0"} />
                        ))}
                        <span className="pd-review-count">{ratingCount} Reviews</span>
                    </div>

                    {/* Price */}
                    <div className="pd-price-row">
                        <span className="pd-price">{currency}{product.price}</span>
                        {product.mrp > product.price && <span className="pd-mrp">{currency}{product.mrp}</span>}
                    </div>

                    {/* Discount */}
                    {discount && (
                        <div className="pd-discount">
                            <TagIcon size={12} />
                            Save {discount}% right now
                        </div>
                    )}

                    {/* ✅ Badge fields — brand, warranty, model, connectivity etc */}
                    {catDisplay.badges.length > 0 && (
                        <div className="pd-cat-info">
                            {catDisplay.badges.map(key => {
                                const val = product[key];
                                if (!val || (typeof val === 'string' && !val.trim())) return null;
                                return (
                                    <div key={key} className="pd-cat-badge">
                                        <span className="pd-cat-badge-key">{FIELD_LABELS[key] || key}</span>
                                        <span className="pd-cat-badge-val">{val}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ✅ Size selector */}
                    {catDisplay.chips.includes("size") && Array.isArray(product.size) && product.size.length > 0 && (
                        <div className="pd-variant-section">
                            <div className="pd-variant-label">
                                Size {selSize && <span className="pd-variant-selected">— {selSize}</span>}
                            </div>
                            <div className="pd-size-chips">
                                {product.size.map(s => (
                                    <div key={s} className={`pd-size-chip${selSize === s ? ' sel' : ''}`} onClick={() => setSelSize(selSize === s ? null : s)}>{s}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ✅ Color selector */}
                    {catDisplay.chips.includes("color") && Array.isArray(product.color) && product.color.length > 0 && (
                        <div className="pd-variant-section">
                            <div className="pd-variant-label">
                                Color {selColor && <span className="pd-variant-selected">— {selColor}</span>}
                            </div>
                            <div className="pd-color-chips">
                                {product.color.map(c => (
                                    <div key={c} className={`pd-color-chip${selColor === c ? ' sel' : ''}`} onClick={() => setSelColor(selColor === c ? null : c)}>
                                        <ColorDot color={c} />{c}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ✅ Other chip fields — skinType, ageRange, language */}
                    {catDisplay.chips.filter(k => k !== "size" && k !== "color").map(key => {
                        const arr = product[key];
                        if (!Array.isArray(arr) || arr.length === 0) return null;
                        return (
                            <div key={key} className="pd-variant-section">
                                <div className="pd-variant-label">
                                    {CHIP_LABELS[key] || key}
                                    {selGeneric[key] && <span className="pd-variant-selected">— {selGeneric[key]}</span>}
                                </div>
                                <div className="pd-generic-chips">
                                    {arr.map(opt => (
                                        <div
                                            key={opt}
                                            className={`pd-generic-chip${selGeneric[key] === opt ? ' sel' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setSelGeneric(p => ({ ...p, [key]: p[key] === opt ? undefined : opt }))}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Cart */}
                    <div className="pd-actions">
                        {isInCart && (
                            <div>
                                <p className="pd-qty-label">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        )}
                        <button onClick={() => !isInCart ? addToCartHandler() : navigate('/cart')} className={`pd-cart-btn ${!isInCart ? 'add' : 'view'}`}>
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