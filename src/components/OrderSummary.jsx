import { TruckIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useFloatingToast } from './FloatingToastProvider'; // ✅ Import
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';
import { createOrder } from '../lib/services/orderService';
import { clearCart } from '../lib/features/cart/cartSlice';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.os-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%;
    max-width: 340px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 22px;
    padding: 24px 22px;
    display: flex;
    flex-direction: column;
    gap: 0;
    animation: os-fadeUp 0.5s 0.15s cubic-bezier(0.4,0,0.2,1) both;
    flex-shrink: 0;
}
@keyframes os-fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
}
@media (max-width: 1024px) { .os-root { max-width: 100%; } }

/* ── Title ── */
.os-title {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0 0 18px;
    padding-bottom: 14px;
    border-bottom: 1.5px solid #f1f5f9;
}

/* ── Rows ── */
.os-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    font-size: 0.875rem;
}
.os-row-label { color: #64748b; font-weight: 400; }
.os-row-val   { color: #0f172a; font-weight: 600; }

/* ── Shipping note ── */
.os-ship-note {
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 400;
    line-height: 1.55;
    padding: 0 0 10px;
    border-bottom: 1.5px solid #f1f5f9;
    margin-bottom: 2px;
}
.os-ship-note strong { color: #64748b; font-weight: 600; }

/* ── Total ── */
.os-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0 18px;
}
.os-total-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}
.os-total-val {
    font-size: 1.4rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.04em;
}

/* ── Button ── */
.os-place-btn {
    width: 100%;
    padding: 15px;
    background: #0f172a;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition: all 0.22s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}
.os-place-btn:hover:not(:disabled) {
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(15,23,42,0.2);
}
.os-place-btn:active { transform: scale(0.98); }
.os-place-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Loading spinner */
.os-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: os-spin 0.6s linear infinite;
}
@keyframes os-spin {
    to { transform: rotate(360deg); }
}
`;

const OrderSummary = ({ totalPrice, items }) => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
    const navigate  = useNavigate();
    const dispatch  = useDispatch();
    const { user }  = useCurrentUser();
    const products  = useSelector(state => state.product.items);
    const { addToast } = useFloatingToast(); // ✅ Hook

    const [isPlacing, setIsPlacing] = React.useState(false); // ✅ Loading state

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // ✅ Validation with meaningful errors
        if (!user) {
            addToast({
                message: "Please login to place an order",
                title: "Authentication required",
                type: "error",
            });
            return;
        }

        if (!items?.length) {
            addToast({
                message: "Your cart is empty",
                title: "Add items to cart first",
                type: "error",
            });
            return;
        }

        setIsPlacing(true);
        
        try {
            // ✅ Loading toast
            addToast({
                message: "Processing your order...",
                type: "info",
                duration: 0, // Will manually dismiss
            });

            const firstProduct  = products.find(p => p.id === items[0]?.id);
            const storeId       = firstProduct?.storeId || '';
            
            const enrichedItems = items.map(item => {
                const product = products.find(p => p.id === item.id);
                return { ...item, storeId: product?.storeId || '' };
            });

            await createOrder({
                userId:        user.uid,
                storeId,
                items:         enrichedItems,
                total:         totalPrice,
                paymentMethod: 'COD',
                coupon:        {},
                isCouponUsed:  false,
            });

            dispatch(clearCart());
            
            // ✅ Success toast
            addToast({
                message: "Order placed successfully!",
                title: "Redirecting to orders page...",
                type: "success",
                duration: 3000,
            });

            setTimeout(() => navigate('/orders'), 1000);

        } catch (err) {
            console.error(err);
            
            // ✅ Error toast with meaningful message
            addToast({
                message: "Failed to place order",
                title: "Please try again or contact support",
                type: "error",
                duration: 4000,
            });
        } finally {
            setIsPlacing(false);
        }
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="os-root">

                <p className="os-title">Order Summary</p>

                {/* Subtotal */}
                <div className="os-row">
                    <span className="os-row-label">Subtotal</span>
                    <span className="os-row-val">{currency}{totalPrice.toLocaleString()}</span>
                </div>

                {/* Shipping note */}
                <p className="os-ship-note">
                    <strong>Shipping fee</strong> will be calculated after order placement based on your delivery address.
                </p>

                {/* Total */}
                <div className="os-total-row">
                    <span className="os-total-label">Total</span>
                    <span className="os-total-val">{currency}{totalPrice.toLocaleString()}</span>
                </div>

                {/* Button */}
                <button
                    className="os-place-btn"
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isPlacing || !items?.length}
                >
                    {isPlacing ? (
                        <>
                            <span className="os-spinner" />
                            Processing...
                        </>
                    ) : (
                        'Proceed to Checkout'
                    )}
                </button>

            </div>
        </>
    );
};

export default OrderSummary;