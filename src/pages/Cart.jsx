import Counter from "../components/Counter";
import { removeFromCart } from "../lib/features/cart/cartSlice";
import { useFloatingToast } from "../components/FloatingToastProvider";
import { Trash2Icon, ShoppingCartIcon, ArrowRightIcon, ShoppingBagIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.cart-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    padding: 0 24px;
    color: #0f172a;
    animation: cart-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes cart-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
.cart-inner { max-width: 1280px; margin: 0 auto; }

/* ── Header ── */
.cart-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 32px 0 24px; gap: 12px; flex-wrap: wrap;
}
.cart-title {
    font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0;
}
.cart-title span { color: #0f172a; font-weight: 800; }
.cart-count {
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    color: #16a34a; font-size: 0.72rem; font-weight: 700;
    padding: 4px 12px; border-radius: 100px;
}

/* ── Layout ── */
.cart-body {
    display: flex; align-items: flex-start; gap: 28px; padding-bottom: 80px;
}
@media (max-width: 1024px) { .cart-body { flex-direction: column; } }

/* ── Table ── */
.cart-table-wrap {
    flex: 1; min-width: 0;
    animation: cart-fadeUp 0.55s 0.08s cubic-bezier(0.4,0,0.2,1) both;
}
.cart-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 0.875rem; }
.cart-table thead tr th {
    padding: 0 16px 14px;
    font-size: 0.72rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.6px;
    border-bottom: 1.5px solid #f1f5f9;
}
.cart-table thead tr th:first-child { text-align: left; padding-left: 0; }
.cart-table thead tr th:not(:first-child) { text-align: center; }

.cart-row { animation: cart-fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both; transition: background 0.18s; }
.cart-row:nth-child(1) { animation-delay: 0.08s; }
.cart-row:nth-child(2) { animation-delay: 0.13s; }
.cart-row:nth-child(3) { animation-delay: 0.18s; }
.cart-row:nth-child(n+4) { animation-delay: 0.22s; }

.cart-row td { padding: 16px; border-bottom: 1.5px solid #f8fafc; vertical-align: middle; }
.cart-row td:first-child { padding-left: 0; }
.cart-row td:not(:first-child) { text-align: center; }

.cart-product-cell { display: flex; align-items: center; gap: 14px; }
.cart-img-wrap {
    width: 72px; height: 72px; border-radius: 16px;
    background: #f8fafc; border: 1.5px solid #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; overflow: hidden; transition: border-color 0.18s;
}
.cart-row:hover .cart-img-wrap { border-color: #bbf7d0; }
.cart-img-wrap img { width: 48px; height: 48px; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.22s; }
.cart-row:hover .cart-img-wrap img { transform: scale(1.07); }

.cart-product-name { font-size: 0.875rem; font-weight: 600; color: #0f172a; margin: 0 0 3px; line-height: 1.35; }
.cart-product-cat  { font-size: 0.72rem; color: #94a3b8; font-weight: 500; margin: 0 0 5px; text-transform: uppercase; letter-spacing: 0.4px; }
.cart-product-price { font-size: 0.875rem; font-weight: 700; color: #16a34a; margin: 0; }
.cart-total-val { font-size: 0.9rem; font-weight: 700; color: #0f172a; }

.cart-del-btn {
    width: 36px; height: 36px; border-radius: 50%;
    background: #fff; border: 1.5px solid #fee2e2; color: #ef4444;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
}
.cart-del-btn:hover { background: #fef2f2; border-color: #fca5a5; transform: scale(1.1); box-shadow: 0 4px 12px rgba(239,68,68,0.15); }
.cart-del-btn:active { transform: scale(0.95); }
@media (max-width: 768px) { .cart-del-col { display: none; } }

/* ── Summary card ── */
.cart-summary {
    width: 100%; max-width: 340px;
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 22px; padding: 24px 22px;
    flex-shrink: 0;
    animation: cart-fadeUp 0.5s 0.15s cubic-bezier(0.4,0,0.2,1) both;
}
@media (max-width: 1024px) { .cart-summary { max-width: 100%; } }

.cart-sum-title {
    font-size: 0.68rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.12em;
    margin: 0 0 16px; padding-bottom: 14px; border-bottom: 1.5px solid #f1f5f9;
}
.cart-sum-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0; font-size: 0.82rem; border-bottom: 1.5px solid #f8fafc;
}
.cart-sum-row:last-of-type { border-bottom: none; }
.cart-sum-label { color: #64748b; font-weight: 400; }
.cart-sum-val   { color: #0f172a; font-weight: 600; }

.cart-ship-note {
    font-size: 0.75rem; color: #94a3b8; font-weight: 400;
    line-height: 1.55; padding: 0 0 10px; border-bottom: 1.5px solid #f1f5f9;
    margin-bottom: 2px;
}
.cart-ship-note strong { color: #64748b; font-weight: 600; }

.cart-total-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 0 18px;
}
.cart-total-label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
.cart-total-amount { font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; }

.cart-checkout-btn {
    width: 100%; padding: 15px; background: #0f172a; color: #fff;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 12px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.22s;
}
.cart-checkout-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
.cart-checkout-btn:active { transform: scale(0.98); }

/* ── Empty ── */
.cart-empty {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 80vh; display: flex; align-items: center; justify-content: center;
    padding: 24px; animation: cart-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
.cart-empty-card {
    text-align: center; padding: 56px 48px;
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.05);
    max-width: 360px; width: 100%;
}
.cart-empty-icon {
    width: 76px; height: 76px; border-radius: 50%;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; color: #cbd5e1;
}
.cart-empty-title { font-size: 1.2rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.3px; }
.cart-empty-sub { font-size: 0.825rem; color: #94a3b8; margin: 0 0 28px; line-height: 1.65; font-weight: 400; }
.cart-empty-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; background: #16a34a; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 100px; cursor: pointer;
    transition: all 0.22s; box-shadow: 0 4px 16px rgba(22,163,74,0.32);
    text-decoration: none;
}
.cart-empty-btn:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(22,163,74,0.4); }

@media (max-width: 480px) {
    .cart-root { padding: 0 14px; }
    .cart-empty-card { padding: 40px 24px; }
    .cart-table thead { display: none; }
    .cart-row td { padding: 12px 8px; }
}
`;

export default function Cart() {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";
    const { items: cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useFloatingToast();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        let total = 0;
        const arr = [];
        
        for (const item of cartItems) {
            const product = products.find(p => p.id === item.id);
            if (product) {
                arr.push({ ...product, quantity: item.qty });
                total += product.price * item.qty;
            } else {
                // Product not found in store
                console.warn(`Product ${item.id} not found in products list`);
            }
        }
        
        setCartArray(arr);
        setTotalPrice(total);
    };

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    const handleRemoveItem = (itemId, itemName) => {
        try {
            dispatch(removeFromCart(itemId));
            showToast(`"${itemName}" removed from cart`, "success");
        } catch (err) {
            console.error("Error removing item from cart:", err);
            showToast("Failed to remove item. Please try again", "error");
        }
    };

    const handleCheckout = () => {
        if (cartArray.length === 0) {
            showToast("Your cart is empty", "warning");
            return;
        }

        if (totalPrice <= 0) {
            showToast("Invalid cart total", "error");
            return;
        }

        navigate('/checkout');
    };

    // ── Empty state ──
    if (cartArray.length === 0) return (
        <>
            <style>{CSS}</style>
            <div className="cart-empty">
                <div className="cart-empty-card">
                    <div className="cart-empty-icon">
                        <ShoppingCartIcon size={32} />
                    </div>
                    <p className="cart-empty-title">Your cart is empty</p>
                    <p className="cart-empty-sub">
                        Looks like you haven't added anything yet. Explore our products and find something you'll love.
                    </p>
                    <button className="cart-empty-btn" onClick={() => navigate('/shop')}>
                        Browse Products <ArrowRightIcon size={15} />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="cart-root">
                <div className="cart-inner">

                    {/* Header */}
                    <div className="cart-header">
                        <h1 className="cart-title">My <span>Cart</span></h1>
                        <span className="cart-count">
                            {cartArray.length} item{cartArray.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="cart-body">

                        {/* ── Table ── */}
                        <div className="cart-table-wrap">
                            <table className="cart-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th className="cart-del-col">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartArray.map((item, index) => (
                                        <tr key={index} className="cart-row">
                                            <td>
                                                <div className="cart-product-cell">
                                                    <div className="cart-img-wrap">
                                                        <img 
                                                            src={item.images?.[0] || item.image || ''} 
                                                            alt={item.name}
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="cart-product-name">{item.name}</p>
                                                        <p className="cart-product-cat">{item.category}</p>
                                                        <p className="cart-product-price">{currency}{item.price}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><Counter productId={item.id} /></td>
                                            <td>
                                                <span className="cart-total-val">
                                                    {currency}{(item.price * item.quantity).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="cart-del-col">
                                                <button
                                                    className="cart-del-btn"
                                                    onClick={() => handleRemoveItem(item.id, item.name)}
                                                    aria-label="Remove item"
                                                    title={`Remove ${item.name}`}
                                                >
                                                    <Trash2Icon size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Summary card ── */}
                        <div className="cart-summary">
                            <p className="cart-sum-title">Order Summary</p>

                            <div className="cart-sum-row">
                                <span className="cart-sum-label">Subtotal</span>
                                <span className="cart-sum-val">{currency}{totalPrice.toLocaleString()}</span>
                            </div>

                            <p className="cart-ship-note">
                                <strong>Shipping fee</strong> will be calculated at checkout based on your delivery address.
                            </p>

                            <div className="cart-total-row">
                                <span className="cart-total-label">Total</span>
                                <span className="cart-total-amount">{currency}{totalPrice.toLocaleString()}</span>
                            </div>

                            <button
                                className="cart-checkout-btn"
                                onClick={handleCheckout}
                            >
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