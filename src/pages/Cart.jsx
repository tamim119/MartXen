import Counter from "../components/Counter";
import { removeFromCart } from "../lib/features/cart/cartSlice";
import { Trash2Icon, ShoppingCartIcon, ArrowRightIcon, ShoppingBagIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.cart-root { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; padding: 0 24px; color: #0f172a; background: #fff; width: 100%; }
.cart-inner { max-width: 1280px; margin: 0 auto; }

.cart-header { display: flex; align-items: center; justify-content: space-between; padding: 32px 0 24px; gap: 12px; flex-wrap: wrap; }
.cart-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0; }
.cart-title span { color: #0f172a; font-weight: 800; }
.cart-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 100px; }

.cart-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; font-size: 0.825rem; font-weight: 500; line-height: 1.5; margin-bottom: 18px; }
.cart-alert-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800; }
.cart-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.cart-alert.error   .cart-alert-icon { background: #fda4af; color: #9f1239; }
.cart-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.cart-alert.success .cart-alert-icon { background: #86efac; color: #14532d; }
.cart-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.cart-alert.warning .cart-alert-icon { background: #fcd34d; color: #92400e; }
.cart-alert-body { flex: 1; font-size: 0.8rem; }
.cart-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.cart-alert-close:hover { opacity: 1; }

.cart-body { display: flex; align-items: flex-start; gap: 28px; padding-bottom: 80px; width: 100%; }
@media (max-width: 1024px) { .cart-body { flex-direction: column; } }

/* ── Desktop Table ── */
.cart-table-wrap { flex: 1; min-width: 0; }
.cart-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.875rem; }
.cart-table thead tr th { padding: 0 16px 14px; font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1.5px solid #f1f5f9; }
.cart-table thead tr th:first-child { text-align: left; padding-left: 0; }
.cart-table thead tr th:not(:first-child) { text-align: center; }
.cart-row { transition: background 0.18s; }
.cart-row td { padding: 16px; border-bottom: 1.5px solid #f8fafc; vertical-align: middle; }
.cart-row td:first-child { padding-left: 0; }
.cart-row td:not(:first-child) { text-align: center; }

.cart-product-cell { display: flex; align-items: center; gap: 14px; }
.cart-img-wrap { width: 72px; height: 72px; border-radius: 16px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; transition: border-color 0.18s; }
.cart-row:hover .cart-img-wrap { border-color: #bbf7d0; }
.cart-img-wrap img { width: 48px; height: 48px; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.22s; }
.cart-row:hover .cart-img-wrap img { transform: scale(1.07); }

.cart-product-name  { font-size: 0.875rem; font-weight: 600; color: #0f172a; margin: 0 0 3px; line-height: 1.35; }
.cart-product-cat   { font-size: 0.72rem; color: #94a3b8; font-weight: 500; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 0.4px; }
.cart-product-price { font-size: 0.875rem; font-weight: 700; color: #16a34a; margin: 0; }
.cart-total-val     { font-size: 0.9rem; font-weight: 700; color: #0f172a; }

/* ✅ Variant tags — professional slate style */
.cart-variants { display: flex; flex-wrap: wrap; gap: 5px; margin: 5px 0 5px; }
.cart-variant-tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 6px;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    font-size: 0.65rem; font-weight: 600; color: #334155;
    letter-spacing: 0.01em;
}
.cart-variant-key { color: #94a3b8; font-weight: 700; text-transform: uppercase; font-size: 0.58rem; letter-spacing: 0.06em; }
.cart-variant-sep  { color: #cbd5e1; font-size: 0.6rem; }

.cart-del-btn { width: 36px; height: 36px; border-radius: 50%; background: #fff; border: 1.5px solid #fee2e2; color: #ef4444; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.cart-del-btn:hover { background: #fef2f2; border-color: #fca5a5; transform: scale(1.1); box-shadow: 0 4px 12px rgba(239,68,68,0.15); }
.cart-del-btn:active { transform: scale(0.95); }

/* ── Mobile Card List ── */
.cart-mobile-list { display: none; flex-direction: column; gap: 10px; flex: 1; min-width: 0; width: 100%; }
.cart-mobile-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 18px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    min-height: 160px;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.18s, box-shadow 0.18s;
}
.cart-mobile-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }

.cart-mobile-top { display: flex; align-items: flex-start; gap: 12px; flex: 1; min-height: 80px; padding-bottom: 12px; }
.cart-mobile-img { width: 64px; height: 64px; border-radius: 14px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.cart-mobile-img img { width: 44px; height: 44px; object-fit: contain; mix-blend-mode: multiply; }
.cart-mobile-info { flex: 1; min-width: 0; }
.cart-mobile-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; line-height: 1.3; }
.cart-mobile-cat  { font-size: 0.68rem; color: #94a3b8; font-weight: 500; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 0.4px; }
.cart-mobile-price { font-size: 0.85rem; font-weight: 700; color: #16a34a; margin: 5px 0 0; }

.cart-mobile-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 10px; border-top: 1.5px solid #f8fafc; margin-top: auto; }
.cart-mobile-total { font-size: 1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
.cart-mobile-actions { display: flex; align-items: center; gap: 10px; }

/* ── Summary Panel ── */
.cart-summary { width: 100%; max-width: 340px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 22px; padding: 24px 22px; flex-shrink: 0; }
@media (max-width: 1024px) { .cart-summary { max-width: 100%; } }
.cart-sum-title { font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 16px; padding-bottom: 14px; border-bottom: 1.5px solid #f1f5f9; }
.cart-sum-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; font-size: 0.82rem; border-bottom: 1.5px solid #f8fafc; }
.cart-sum-row:last-of-type { border-bottom: none; }
.cart-sum-label { color: #64748b; font-weight: 400; }
.cart-sum-val   { color: #0f172a; font-weight: 600; }
.cart-ship-note { font-size: 0.75rem; color: #94a3b8; font-weight: 400; line-height: 1.55; padding: 0 0 10px; border-bottom: 1.5px solid #f1f5f9; margin-bottom: 2px; }
.cart-ship-note strong { color: #64748b; font-weight: 600; }
.cart-total-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0 18px; }
.cart-total-label  { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
.cart-total-amount { font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; }
.cart-checkout-btn { width: 100%; padding: 15px; background: #0f172a; color: #fff; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.22s; }
.cart-checkout-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
.cart-checkout-btn:active { transform: scale(0.98); }

/* ── Empty State ── */
.cart-empty { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
.cart-empty-card { text-align: center; padding: 56px 48px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.05); max-width: 360px; width: 100%; }
.cart-empty-icon { width: 76px; height: 76px; border-radius: 50%; background: #f8fafc; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #cbd5e1; }
.cart-empty-title { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.3px; }
.cart-empty-sub   { font-size: 0.825rem; color: #94a3b8; margin: 0 0 28px; line-height: 1.65; font-weight: 400; }
.cart-empty-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #16a34a; color: #fff; font-size: 0.875rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 100px; cursor: pointer; transition: all 0.22s; box-shadow: 0 4px 16px rgba(22,163,74,0.32); }
.cart-empty-btn:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(22,163,74,0.4); }

/* ── Responsive ── */
@media (max-width: 640px) {
    .cart-root { padding: 0 14px; }
    .cart-header { padding: 24px 0 18px; }
    .cart-title { font-size: 1.25rem; }
    .cart-table-wrap { display: none; }
    .cart-mobile-list { display: flex; }
    .cart-empty-card { padding: 40px 24px; }
}
`;

const VARIANT_LABELS = {
    size: "Size", color: "Color", skinType: "Skin Type",
    ageRange: "Age Range", language: "Language",
    material: "Material", brand: "Brand",
};
const VARIANT_KEYS = Object.keys(VARIANT_LABELS);

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', warning: '!' };
    return (
        <div className={`cart-alert ${type}`}>
            <div className="cart-alert-icon">{icons[type]}</div>
            <div className="cart-alert-body">{message}</div>
            <button className="cart-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

// ✅ Variant tags — only show if value is a non-empty string
const VariantTags = ({ item }) => {
    const tags = VARIANT_KEYS.filter(k => {
        const v = item[k];
        return typeof v === "string" && v.trim().length > 0;
    });
    if (!tags.length) return null;
    return (
        <div className="cart-variants">
            {tags.map(k => (
                <span key={k} className="cart-variant-tag">
                    <span className="cart-variant-key">{VARIANT_LABELS[k]}</span>
                    <span className="cart-variant-sep">·</span>
                    {item[k]}
                </span>
            ))}
        </div>
    );
};

export default function Cart() {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "৳";
    const { items: cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cartArray,  setCartArray]  = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [alert,      setAlert]      = useState(null);
    const alertTimer = useRef(null);

    const showAlert  = (type, message) => { clearTimeout(alertTimer.current); setAlert({ type, message }); alertTimer.current = setTimeout(() => setAlert(null), 3000); };
    const clearAlert = () => { clearTimeout(alertTimer.current); setAlert(null); };
    useEffect(() => () => clearTimeout(alertTimer.current), []);

    useEffect(() => {
        if (cartItems.length === 0) { setCartArray([]); setTotalPrice(0); return; }
        if (products.length > 0) {
            let total = 0;
            const arr = [];
            for (const item of cartItems) {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    const v = (k) => item[k] && typeof item[k] === 'string' && item[k].trim() ? { [k]: item[k] } : {};
                    arr.push({
                        id: item.id,
                        name: product.name || '',
                        category: product.category || '',
                        price: product.price || 0,
                        images: product.images || [],
                        image: product.image || '',
                        qty: item.qty,
                        quantity: item.qty,
                        ...v('size'), ...v('color'), ...v('skinType'), ...v('ageRange'), ...v('language'),
                    });
                    total += product.price * item.qty;
                }
            }
            setCartArray(arr);
            setTotalPrice(total);
        }
    }, [cartItems, products]);

    const handleRemoveItem = (item) => {
        dispatch(removeFromCart({ id: item.id, size: item.size, color: item.color }));
        showAlert("success", `"${item.name}" removed from cart.`);
    };

    if (cartItems.length === 0) return (
        <>
            <style>{CSS}</style>
            <div className="cart-empty">
                <div className="cart-empty-card">
                    <div className="cart-empty-icon"><ShoppingCartIcon size={32} /></div>
                    <p className="cart-empty-title">Your cart is empty</p>
                    <p className="cart-empty-sub">Looks like you haven't added anything yet. Explore our products and find something you'll love.</p>
                    <button className="cart-empty-btn" onClick={() => navigate('/shop')}>Browse Products <ArrowRightIcon size={15} /></button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="cart-root">
                <div className="cart-inner">

                    <div className="cart-header">
                        <h1 className="cart-title">My <span>Cart</span></h1>
                        <span className="cart-count">{cartArray.length} item{cartArray.length !== 1 ? 's' : ''}</span>
                    </div>

                    {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                    <div className="cart-body">

                        {/* ── Desktop Table ── */}
                        <div className="cart-table-wrap">
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartArray.map((item, index) => (
                                        <tr key={index} className="cart-row">
                                            <td>
                                                <div className="cart-product-cell">
                                                    <div className="cart-img-wrap">
                                                        <img src={item.images?.[0] || item.image || ''} alt={item.name} onError={e => { e.target.src = '/placeholder.png'; }} />
                                                    </div>
                                                    <div>
                                                        <p className="cart-product-name">{item.name}</p>
                                                        <p className="cart-product-cat">{item.category}</p>
                                                        <VariantTags item={item} />
                                                        <p className="cart-product-price">{currency}{item.price}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><Counter productId={item.id} size={item.size || ""} color={item.color || ""} skinType={item.skinType || ""} ageRange={item.ageRange || ""} language={item.language || ""} /></td>
                                            <td><span className="cart-total-val">{currency}{(item.price * item.quantity).toLocaleString()}</span></td>
                                            <td>
                                                <button className="cart-del-btn" onClick={() => handleRemoveItem(item)} aria-label="Remove item">
                                                    <Trash2Icon size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Mobile Card List ── */}
                        <div className="cart-mobile-list">
                            {cartArray.map((item, index) => (
                                <div key={index} className="cart-mobile-card">
                                    {/* Top: image + info */}
                                    <div className="cart-mobile-top">
                                        <div className="cart-mobile-img">
                                            <img src={item.images?.[0] || item.image || ''} alt={item.name} onError={e => { e.target.src = '/placeholder.png'; }} />
                                        </div>
                                        <div className="cart-mobile-info">
                                            <p className="cart-mobile-name">{item.name}</p>
                                            <p className="cart-mobile-cat">{item.category}</p>
                                            <VariantTags item={item} />
                                            <p className="cart-mobile-price">{currency}{item.price}</p>
                                        </div>
                                    </div>

                                    {/* Bottom: counter + total + delete */}
                                    <div className="cart-mobile-bottom">
                                        <Counter productId={item.id} size={item.size || ""} color={item.color || ""} skinType={item.skinType || ""} ageRange={item.ageRange || ""} language={item.language || ""} />
                                        <span className="cart-mobile-total">{currency}{(item.price * item.quantity).toLocaleString()}</span>
                                        <button className="cart-del-btn" onClick={() => handleRemoveItem(item)} aria-label="Remove item">
                                            <Trash2Icon size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Summary Panel ── */}
                        <div className="cart-summary">
                            <p className="cart-sum-title">Order Summary</p>
                            <div className="cart-sum-row">
                                <span className="cart-sum-label">Subtotal</span>
                                <span className="cart-sum-val">{currency}{totalPrice.toLocaleString()}</span>
                            </div>
                            <p className="cart-ship-note"><strong>Shipping fee</strong> will be calculated at checkout based on your delivery address.</p>
                            <div className="cart-total-row">
                                <span className="cart-total-label">Total</span>
                                <span className="cart-total-amount">{currency}{totalPrice.toLocaleString()}</span>
                            </div>
                            <button className="cart-checkout-btn" onClick={() => navigate('/checkout')}>
                                <ShoppingBagIcon size={15} />
                                Proceed to Checkout
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}