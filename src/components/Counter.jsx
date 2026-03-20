import { removeFromCart, updateQty } from "../lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.counter-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff;
}
.counter-btn {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    background: #f8fafc;
    border: none; cursor: pointer;
    font-size: 1.1rem; font-weight: 600;
    color: #475569;
    transition: all 0.18s;
    flex-shrink: 0;
    user-select: none;
    font-family: inherit;
}
.counter-btn:hover { background: #f0fdf4; color: #16a34a; }
.counter-btn:active { transform: scale(0.92); }
.counter-qty {
    min-width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.875rem; font-weight: 700;
    color: #0f172a;
    border-left: 1.5px solid #f1f5f9;
    border-right: 1.5px solid #f1f5f9;
    background: #fff;
    font-family: inherit;
}
`;

// ✅ cartSlice এর isSameVariant এর মতোই exact match
const isSameVariant = (a, b) =>
    a.id === b.id &&
    (a.size      || "") === (b.size      || "") &&
    (a.color     || "") === (b.color     || "") &&
    (a.skinType  || "") === (b.skinType  || "") &&
    (a.ageRange  || "") === (b.ageRange  || "") &&
    (a.language  || "") === (b.language  || "");

const Counter = ({ productId, size = "", color = "", skinType = "", ageRange = "", language = "" }) => {
    const cartItems = useSelector(state => state.cart.items);
    const dispatch  = useDispatch();

    // ✅ variant সহ exact item খুঁজে বের করো
    const variantKey = { id: productId, size, color, skinType, ageRange, language };
    const item = cartItems.find(i => isSameVariant(i, variantKey));
    const qty  = item?.qty || 0;

    const handleDecrease = () => {
        if (qty <= 1) {
            // ✅ variant সহ remove করো
            dispatch(removeFromCart(variantKey));
        } else {
            dispatch(updateQty({ ...variantKey, qty: qty - 1 }));
        }
    };

    const handleIncrease = () => {
        dispatch(updateQty({ ...variantKey, qty: qty + 1 }));
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="counter-wrap">
                <button className="counter-btn" onClick={handleDecrease}>−</button>
                <span className="counter-qty">{qty}</span>
                <button className="counter-btn" onClick={handleIncrease}>+</button>
            </div>
        </>
    );
};

export default Counter;