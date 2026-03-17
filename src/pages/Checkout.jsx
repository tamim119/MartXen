import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";
import { useFloatingToast } from "../components/FloatingToastProvider";
import { db } from "../lib/firebase";
import {
    collection, addDoc, onSnapshot,
    doc, serverTimestamp, getDoc
} from "firebase/firestore";
import { clearCart } from "../lib/features/cart/cartSlice";
import { validateCoupon } from "../lib/services/couponService";
import Loading from "../components/Loading";
import { DIVISIONS, getShippingFee } from "./AddressBook";

const PAYMENT_METHODS = [
    {
        id: "bkash", label: "bKash",
        color: "#E2136E", lightBg: "#FDF0F6", border: "#F5B8D8",
        logo: "https://download.logo.wine/logo/BKash/BKash-Icon-Logo.wine.png",
        fallback: "bK", placeholder: "e.g. ABC1234567",
    },
    {
        id: "nagad", label: "Nagad",
        color: "#F4821F", lightBg: "#FEF5EC", border: "#FDDBB4",
        logo: "https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png",
        fallback: "Na", placeholder: "e.g. 1234567890",
    },
    {
        id: "rocket", label: "Rocket",
        color: "#8B1FA9", lightBg: "#F8F0FC", border: "#DBAEF0",
        logo: "https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small_2x/rocket-color-logo-mobile-banking-icon-free-png.png",
        fallback: "Ro", placeholder: "e.g. DBBL1234567",
    },
    {
        id: "cod", label: "Cash on Delivery",
        color: "#475569", lightBg: "#f8fafc", border: "#e2e8f0",
        logo: null, fallback: "COD", placeholder: "",
    },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.co-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; min-height: 70vh; }

@keyframes co-fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
@keyframes co-slideIn { from { opacity:0; transform:translateY(-10px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes co-spin    { to { transform:rotate(360deg); } }

.co-hero { background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%); border-bottom: 1.5px solid #f1f5f9; padding: 56px 24px 44px; text-align: center; animation: co-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both; }
.co-eyebrow { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.co-eyebrow-line { width: 36px; height: 1.5px; background: #16a34a; border-radius: 2px; }
.co-eyebrow-text { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #16a34a; }
.co-hero-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #0f172a; letter-spacing: -0.03em; line-height: 1.15; margin: 0 0 12px; }
.co-hero-title span { color: #16a34a; }
.co-hero-sub { font-size: 0.9rem; color: #64748b; max-width: 380px; margin: 0 auto; line-height: 1.65; }

.co-body { max-width: 1100px; margin: 0 auto; padding: 48px 40px 80px; display: grid; grid-template-columns: 1fr 360px; gap: 48px; align-items: start; animation: co-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both; }

.co-sec-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #94a3b8; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.co-sec-label::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

.co-addr-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
.co-addr-card { border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 14px 16px; cursor: pointer; display: flex; align-items: flex-start; gap: 12px; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; }
.co-addr-card:hover { border-color: #e2e8f0; }
.co-addr-card.sel { border-color: #16a34a; background: #f0fdf4; box-shadow: 0 4px 16px rgba(22,163,74,0.1); }
.co-addr-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #e2e8f0; flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s; }
.co-addr-card.sel .co-addr-radio { border-color: #16a34a; }
.co-addr-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; opacity: 0; transform: scale(0.3); transition: opacity 0.18s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
.co-addr-card.sel .co-addr-radio-dot { opacity: 1; transform: scale(1); }
.co-addr-info { flex: 1; }
.co-addr-badges { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 5px; }
.co-addr-label { font-size: 0.72rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.08em; }
.co-addr-def { font-size: 0.62rem; font-weight: 700; background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; padding: 2px 8px; border-radius: 100px; }
.co-addr-ship { font-size: 0.62rem; font-weight: 700; background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0; padding: 2px 8px; border-radius: 100px; }
.co-addr-name { font-size: 0.82rem; font-weight: 600; color: #0f172a; margin: 0 0 2px; }
.co-addr-line { font-size: 0.78rem; color: #64748b; line-height: 1.6; margin: 0; }
.co-addr-phone { font-size: 0.75rem; color: #94a3b8; margin: 4px 0 0; }

.co-new-addr-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 16px; border: 1.5px dashed #e2e8f0; border-radius: 14px; background: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; font-weight: 600; color: #94a3b8; transition: all 0.2s; margin-bottom: 14px; }
.co-new-addr-btn:hover { border-color: #16a34a; color: #16a34a; }
.co-new-addr-btn.on { border-color: #16a34a; color: #16a34a; border-style: solid; background: #f0fdf4; }

.co-new-form { background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; animation: co-fadeUp 0.3s cubic-bezier(0.4,0,0.2,1) both; }
.co-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.co-field { position: relative; display: flex; align-items: center; }
.co-field-icon { position: absolute; left: 12px; color: #cbd5e1; pointer-events: none; flex-shrink: 0; transition: color 0.18s; }
.co-field:focus-within .co-field-icon { color: #16a34a; }
.co-inp { width: 100%; padding: 11px 14px 11px 36px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.855rem; font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #0f172a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-weight: 500; box-sizing: border-box; }
.co-inp::placeholder { color: #cbd5e1; font-weight: 400; }
.co-inp:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.co-inp.error { border-color: #ef4444; }
.co-sel-wrap { position: relative; }
.co-sel { width: 100%; padding: 11px 36px 11px 14px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.855rem; font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #0f172a; outline: none; appearance: none; cursor: pointer; font-weight: 500; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
.co-sel:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.co-sel.error { border-color: #ef4444; }
.co-sel-arr { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #94a3b8; }
.co-manage-btn { display: inline-flex; align-items: center; gap: 5px; font-size: 0.75rem; font-weight: 600; color: #94a3b8; background: none; border: none; cursor: pointer; padding: 0; transition: color 0.18s; margin-top: 2px; font-family: 'Plus Jakarta Sans', sans-serif; }
.co-manage-btn:hover { color: #16a34a; }

.co-pay-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
.co-pay-card { position: relative; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 18px 10px 14px; cursor: pointer; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; min-height: 100px; transition: border-color 0.22s, box-shadow 0.22s, transform 0.18s, background 0.22s; }
.co-pay-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); border-color: #e2e8f0; }
.co-pay-card.sel { border-color: var(--pc); background: var(--pb); box-shadow: 0 0 0 1.5px var(--pc), 0 8px 28px rgba(0,0,0,0.08); transform: translateY(-2px); }
.co-pay-radio { position: absolute; top: 9px; right: 9px; width: 16px; height: 16px; border-radius: 50%; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; background: #fff; transition: border-color 0.2s; }
.co-pay-card.sel .co-pay-radio { border-color: var(--pc); }
.co-pay-rdot { width: 7px; height: 7px; border-radius: 50%; background: var(--pc); opacity: 0; transform: scale(0.3); transition: opacity 0.2s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
.co-pay-card.sel .co-pay-rdot { opacity: 1; transform: scale(1); }
.co-pay-logo { width: 56px; height: 38px; display: flex; align-items: center; justify-content: center; }
.co-pay-label { font-size: 0.68rem; font-weight: 700; color: #64748b; text-align: center; line-height: 1.3; transition: color 0.2s; }
.co-pay-card.sel .co-pay-label { color: var(--pc); }
.co-cod-icon { width: 52px; height: 34px; background: linear-gradient(135deg, #475569, #1e293b); border-radius: 8px; display: flex; align-items: center; justify-content: center; }

.co-pay-box { border-radius: 16px; padding: 18px 18px 20px; margin-bottom: 18px; border: 1.5px solid; animation: co-slideIn 0.28s cubic-bezier(0.4,0,0.2,1) both; }
.co-pay-box-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.06); }
.co-pay-box-logo { width: 40px; height: 40px; border-radius: 12px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.co-pay-box-title { font-size: 0.78rem; font-weight: 800; }
.co-step { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 0.82rem; font-weight: 400; color: #475569; line-height: 1.6; }
.co-step-n { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 700; flex-shrink: 0; margin-top: 1px; color: #fff; }

.co-merchant {
    display: flex; align-items: center; gap: 8px;
    background: #fff; border: 1.5px solid;
    border-radius: 12px; padding: 11px 14px;
    margin: 6px 0 14px; font-size: 1rem; font-weight: 800;
    user-select: none;
}

.co-copy-btn {
    display: inline-flex; align-items: center; gap: 5px;
    margin-left: auto; padding: 5px 11px;
    border: 1.5px solid; border-radius: 8px;
    font-size: 0.68rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; transition: all 0.18s;
    background: transparent; flex-shrink: 0;
}
.co-copy-btn:hover { opacity: 0.8; }
.co-copy-btn.copied { background: #f0fdf4 !important; border-color: #bbf7d0 !important; color: #16a34a !important; }

.co-pay-inputs { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); }
.co-pay-input-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px; display: block; }
.co-pay-input { width: 100%; padding: 11px 14px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.855rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; color: #0f172a; background: #fff; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
.co-pay-input::placeholder { color: #cbd5e1; font-weight: 400; }
.co-pay-input:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.co-pay-input.ok { border-color: #16a34a; background: #f0fdf4; }

.co-no-number { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #fefce8; border: 1.5px solid #fde68a; border-radius: 12px; font-size: 0.78rem; font-weight: 600; color: #854d0e; margin: 6px 0 14px; }

.co-panel { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 22px; padding: 24px 22px; position: sticky; top: 90px; }
.co-sum-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 0.82rem; border-bottom: 1.5px solid #f8fafc; }
.co-sum-row:last-of-type { border-bottom: none; }
.co-sum-label { color: #64748b; font-weight: 400; }
.co-sum-val { color: #0f172a; font-weight: 600; }
.co-sum-val.green { color: #16a34a; font-weight: 700; }
.co-sum-val.red { color: #ef4444; font-weight: 700; }
.co-sum-val.pending { color: #94a3b8; font-size: 0.75rem; }
.co-ship-chip { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin: 10px 0; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; }
.co-ship-chip-tag { font-size: 0.62rem; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1px; }
.co-ship-chip-city { font-size: 0.75rem; color: #475569; font-weight: 500; }
.co-ship-chip-fee { font-size: 1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
.co-total-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0 16px; border-top: 1.5px solid #f1f5f9; margin-top: 4px; }
.co-total-label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
.co-total-val { font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; }

.co-coupon-form { display: flex; gap: 8px; margin-bottom: 14px; }
.co-coupon-inp { flex: 1; padding: 10px 13px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.82rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #0f172a; background: #f8fafc; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.co-coupon-inp::placeholder { text-transform: none; letter-spacing: 0; font-weight: 400; color: #cbd5e1; }
.co-coupon-inp:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.co-coupon-btn { padding: 10px 16px; background: #0f172a; color: #fff; font-size: 0.75rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 12px; cursor: pointer; transition: background 0.18s; }
.co-coupon-btn:hover { background: #1e293b; }
.co-coupon-applied { display: flex; align-items: center; gap: 8px; padding: 10px 13px; margin-bottom: 14px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 12px; font-size: 0.78rem; font-weight: 600; color: #15803d; }
.co-coupon-applied-info { flex: 1; min-width: 0; }
.co-coupon-code { font-weight: 800; color: #0f172a; letter-spacing: 0.05em; }
.co-coupon-desc { font-size: 0.7rem; color: #64748b; font-weight: 400; margin-top: 1px; }
.co-coupon-remove { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 2px; display: flex; align-items: center; transition: color 0.18s; }
.co-coupon-remove:hover { color: #ef4444; }

.co-pay-badge { display: flex; align-items: center; gap: 10px; padding: 10px 13px; border: 1.5px solid; border-radius: 14px; margin-bottom: 14px; }
.co-pay-badge-icon { width: 32px; height: 32px; border-radius: 9px; background: #fff; box-shadow: 0 1px 5px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.co-pay-badge-name { font-size: 0.78rem; font-weight: 700; }
.co-pay-badge-check { margin-left: auto; font-size: 0.68rem; font-weight: 700; color: #16a34a; display: flex; align-items: center; gap: 3px; }

.co-submit { width: 100%; padding: 14px; background: #0f172a; color: #fff; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.22s; }
.co-submit:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
.co-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.co-spin { animation: co-spin 0.8s linear infinite; }
.co-secure { text-align: center; font-size: 0.65rem; font-weight: 600; color: #cbd5e1; letter-spacing: 0.14em; text-transform: uppercase; margin-top: 10px; }

@media (max-width: 1024px) { .co-body { grid-template-columns: 1fr; gap: 32px; } .co-panel { position: static; } }
@media (max-width: 640px)  { .co-pay-grid { grid-template-columns: repeat(2, 1fr); } .co-body { padding: 36px 20px 60px; } }
@media (max-width: 480px)  { .co-hero { padding: 40px 16px 32px; } .co-body { padding: 28px 16px 48px; } .co-form-row { grid-template-columns: 1fr; } }
`;

const CodCardIcon = ({ size = 28 }) => (
    <svg width={size} height={size * 0.71} viewBox="0 0 28 20" fill="none">
        <rect x=".5" y=".5" width="27" height="19" rx="3" stroke="#94a3b8"/>
        <rect y="5" width="28" height="6" fill="#64748b"/>
        <rect x="2" y="14" width="6" height="2.5" rx="1" fill="#94a3b8"/>
        <rect x="10" y="14" width="4" height="2.5" rx="1" fill="#94a3b8"/>
    </svg>
);

export default function Checkout() {
    const { user, loading: authLoading } = useCurrentUser();
    const { showToast } = useFloatingToast(); // Direct destructuring
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '৳';

    const cartItems = useSelector(state => state.cart.items);
    const products = useSelector(state => state.product.items);

    const [addresses, setAddresses] = useState([]);
    const [addrLoading, setAddrLoading] = useState(true);
    const [selectedAddr, setSelectedAddr] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [newForm, setNewForm] = useState({
        label: "Home", firstName: "", lastName: "",
        phone: "", street: "", city: "", division: ""
    });
    const [formErrors, setFormErrors] = useState({});

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [senderNumber, setSenderNumber] = useState("");
    const [txId, setTxId] = useState("");
    const [logoErrors, setLogoErrors] = useState({});
    const [copiedNumber, setCopiedNumber] = useState(false);
    const [paySettings, setPaySettings] = useState(null);
    const [paySettingsLoading, setPaySettingsLoading] = useState(true);
    const [couponInput, setCouponInput] = useState("");
    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        
        const unsub = onSnapshot(
            collection(db, "users", user.uid, "addresses"),
            snap => {
                const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setAddresses(list);
                const def = list.find(a => a.isDefault) || list[0];
                if (def && !selectedAddr) setSelectedAddr(def);
                setAddrLoading(false);
                if (list.length === 0) setShowNewForm(true);
            },
            (err) => {
                console.error("Error loading addresses:", err);
                showToast("Failed to load addresses", "error");
                setAddrLoading(false);
            }
        );
        return () => unsub();
    }, [user, selectedAddr, showToast]);

    useEffect(() => {
        const loadPaySettings = async () => {
            try {
                const firstProduct = products.find(p => p.id === cartItems[0]?.id);
                const storeId = firstProduct?.storeId;
                
                if (!storeId) {
                    setPaySettingsLoading(false);
                    return;
                }

                const snap = await getDoc(doc(db, "stores", storeId, "settings", "payment"));
                
                if (snap.exists()) {
                    const data = snap.data();
                    setPaySettings(data);
                    
                    if (data.bkash?.enabled) setPaymentMethod("bkash");
                    else if (data.nagad?.enabled) setPaymentMethod("nagad");
                    else if (data.rocket?.enabled) setPaymentMethod("rocket");
                    else if (data.cod?.enabled !== false) setPaymentMethod("cod");
                } else {
                    setPaySettings(null);
                }
            } catch (err) {
                console.error("Error loading payment settings:", err);
                showToast("Failed to load payment settings", "error");
            } finally {
                setPaySettingsLoading(false);
            }
        };

        if (cartItems.length > 0 && products.length > 0) {
            loadPaySettings();
        } else {
            setPaySettingsLoading(false);
        }
    }, [cartItems, products, showToast]);

    if (authLoading || addrLoading || paySettingsLoading) return <Loading />;

    if (cartItems.length === 0) {
        showToast("Your cart is empty", "warning");
        navigate('/cart');
        return null;
    }

    const availableMethods = PAYMENT_METHODS.filter(m => {
        if (!paySettings) return true;
        if (m.id === "cod") return paySettings.cod?.enabled !== false;
        return paySettings[m.id]?.enabled === true;
    });

    const activeDivision = showNewForm ? newForm.division : selectedAddr?.division || "";
    const shippingFee = activeDivision.trim() ? getShippingFee(activeDivision) : null;
    const subtotal = cartItems.reduce((sum, item) => {
        const p = products.find(x => x.id === item.id);
        return sum + (p?.price || 0) * item.qty;
    }, 0);
    const discountAmt = coupon ? (coupon.discount / 100 * subtotal) : 0;
    const total = subtotal - discountAmt + (shippingFee || 0);

    const selectedPayment = PAYMENT_METHODS.find(m => m.id === paymentMethod) || PAYMENT_METHODS[3];
    const isMobilePay = paymentMethod !== "cod";
    const merchantNumber = paySettings?.[paymentMethod]?.number || "";
    const hasNumber = merchantNumber.trim().length > 0;

    const handleCopyNumber = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        
        if (!merchantNumber) {
            showToast("No merchant number available", "error");
            return;
        }

        try {
            navigator.clipboard.writeText(merchantNumber);
            setCopiedNumber(true);
            showToast(`${selectedPayment.label} number copied!`, "success");
            setTimeout(() => setCopiedNumber(false), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
            showToast("Failed to copy number", "error");
        }
    };

    const handleCoupon = async (e) => {
        e.preventDefault();
        
        if (!couponInput.trim()) {
            showToast("Please enter a coupon code", "warning");
            return;
        }

        if (!user) {
            showToast("Please login to use coupons", "error");
            navigate("/login");
            return;
        }

        try {
            const result = await validateCoupon(couponInput.trim().toUpperCase(), user.uid);
            setCoupon(result);
            showToast(`🎉 ${result.discount}% discount applied!`, "success");
            setCouponInput("");
        } catch (err) {
            console.error("Coupon validation error:", err);
            showToast(err.message || "Invalid or expired coupon", "error");
        }
    };

    const validatePhoneNumber = (phone) => {
        const bdPhoneRegex = /^01[3-9]\d{8}$/;
        return bdPhoneRegex.test(phone.replace(/\s/g, ''));
    };

    const validateForm = () => {
        const errors = {};

        if (showNewForm) {
            if (!newForm.firstName?.trim()) {
                errors.firstName = true;
                showToast("Please enter first name", "error");
            }
            if (!newForm.phone?.trim()) {
                errors.phone = true;
                showToast("Please enter phone number", "error");
            } else if (!validatePhoneNumber(newForm.phone)) {
                errors.phone = true;
                showToast("Please enter a valid phone number (e.g., 01712345678)", "error");
            }
            if (!newForm.street?.trim()) {
                errors.street = true;
                showToast("Please enter street address", "error");
            }
            if (!newForm.city?.trim()) {
                errors.city = true;
                showToast("Please enter city/area", "error");
            }
            if (!newForm.division?.trim()) {
                errors.division = true;
                showToast("Please select a division", "error");
            }
        } else if (!selectedAddr) {
            errors.address = true;
            showToast("Please select a delivery address", "error");
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showToast("Please login to place order", "error");
            navigate("/login");
            return;
        }

        if (cartItems.length === 0) {
            showToast("Your cart is empty", "warning");
            navigate("/cart");
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (isMobilePay) {
            if (!senderNumber.trim()) {
                showToast(`Please enter your ${selectedPayment.label} number`, "error");
                return;
            }
            
            if (!validatePhoneNumber(senderNumber)) {
                showToast("Please enter a valid mobile number", "error");
                return;
            }

            if (!txId.trim()) {
                showToast("Please enter the Transaction ID", "error");
                return;
            }

            if (txId.trim().length < 5) {
                showToast("Transaction ID seems too short. Please verify", "warning");
                return;
            }
        }

        const address = selectedAddr && !showNewForm
            ? {
                firstName: selectedAddr.firstName,
                lastName: selectedAddr.lastName,
                phone: selectedAddr.phone,
                street: selectedAddr.street,
                city: selectedAddr.city,
                division: selectedAddr.division,
                email: user.email
            }
            : {
                ...newForm,
                email: user.email
            };

        const orderItems = cartItems.map(item => {
            const p = products.find(x => x.id === item.id);
            return {
                productId: item.id,
                name: p?.name || "",
                price: p?.price || 0,
                image: p?.images?.[0] || p?.image || "",
                quantity: item.qty,
                storeId: p?.storeId || ""
            };
        }).filter(i => i.quantity > 0);

        if (!orderItems.length) {
            showToast("No valid items in cart", "error");
            return;
        }

        const storeId = products.find(p => p.id === cartItems[0]?.id)?.storeId || "";

        if (!storeId) {
            showToast("Store information missing. Please try again", "error");
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, "orders"), {
                userId: user.uid,
                userEmail: user.email,
                storeId,
                items: orderItems,
                address,
                addressData: address,
                subtotal,
                shippingFee: shippingFee || 0,
                discountAmount: discountAmt,
                total: parseFloat(total.toFixed(2)),
                status: "ORDER_PLACED",
                paymentMethod: paymentMethod.toUpperCase(),
                payment: false,
                coupon: coupon ? { code: coupon.code, discount: coupon.discount } : null,
                isCouponUsed: !!coupon,
                paymentDetails: isMobilePay ? {
                    method: paymentMethod,
                    senderNumber: senderNumber.trim(),
                    txId: txId.trim(),
                    merchantNumber
                } : null,
                createdAt: serverTimestamp(),
            });

            dispatch(clearCart());
            showToast("Order placed successfully!", "success");
            navigate("/orders");

        } catch (err) {
            console.error("Order placement error:", err);
            showToast("Failed to place order. Please try again", "error");
        } finally {
            setLoading(false);
        }
    };

    const nf = (key, val) => {
        setNewForm(p => ({ ...p, [key]: val }));
        if (formErrors[key]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="co-root">

                <div className="co-hero">
                    <div className="co-eyebrow">
                        <div className="co-eyebrow-line" />
                        <span className="co-eyebrow-text">Checkout</span>
                        <div className="co-eyebrow-line" />
                    </div>
                    <h1 className="co-hero-title">Place <span>Order</span></h1>
                    <p className="co-hero-sub">Complete your delivery details and payment</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="co-body">

                        <div>
                            <p className="co-sec-label">Delivery Address</p>

                            {addresses.length > 0 && (
                                <div className="co-addr-list">
                                    {addresses.map(addr => (
                                        <div
                                            key={addr.id}
                                            className={"co-addr-card" + (selectedAddr?.id === addr.id && !showNewForm ? " sel" : "")}
                                            onClick={() => {
                                                setSelectedAddr(addr);
                                                setShowNewForm(false);
                                                setFormErrors({});
                                            }}
                                        >
                                            <div className="co-addr-radio"><div className="co-addr-radio-dot" /></div>
                                            <div className="co-addr-info">
                                                <div className="co-addr-badges">
                                                    <span className="co-addr-label">{addr.label || "Address"}</span>
                                                    {addr.isDefault && <span className="co-addr-def">Default</span>}
                                                    <span className="co-addr-ship">৳{getShippingFee(addr.division)} delivery</span>
                                                </div>
                                                <p className="co-addr-name">{addr.firstName} {addr.lastName}</p>
                                                <p className="co-addr-line">{addr.street}, {addr.city}, {addr.division} Division</p>
                                                <p className="co-addr-phone">{addr.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                className={"co-new-addr-btn" + (showNewForm ? " on" : "")}
                                onClick={() => {
                                    const next = !showNewForm;
                                    setShowNewForm(next);
                                    setFormErrors({});
                                    if (!next) {
                                        const def = addresses.find(a => a.isDefault) || addresses[0];
                                        if (def) setSelectedAddr(def);
                                    } else setSelectedAddr(null);
                                }}
                            >
                                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                {addresses.length > 0 ? "Use a different address" : "Add delivery address"}
                            </button>

                            {showNewForm && (
                                <div className="co-new-form">
                                    <div className="co-form-row">
                                        <div className="co-field">
                                            <svg className="co-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                                            <input
                                                className={"co-inp" + (formErrors.firstName ? " error" : "")}
                                                placeholder="First Name *"
                                                value={newForm.firstName}
                                                onChange={e => nf("firstName", e.target.value)}
                                            />
                                        </div>
                                        <div className="co-field">
                                            <svg className="co-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                                            <input
                                                className="co-inp"
                                                placeholder="Last Name"
                                                value={newForm.lastName}
                                                onChange={e => nf("lastName", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="co-field">
                                        <svg className="co-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                                        <input
                                            className={"co-inp" + (formErrors.phone ? " error" : "")}
                                            type="tel"
                                            placeholder="Phone Number *"
                                            value={newForm.phone}
                                            onChange={e => nf("phone", e.target.value)}
                                        />
                                    </div>
                                    <div className="co-field">
                                        <svg className="co-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        <input
                                            className={"co-inp" + (formErrors.street ? " error" : "")}
                                            placeholder="Street Address *"
                                            value={newForm.street}
                                            onChange={e => nf("street", e.target.value)}
                                        />
                                    </div>
                                    <div className="co-field">
                                        <svg className="co-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                                        <input
                                            className={"co-inp" + (formErrors.city ? " error" : "")}
                                            placeholder="City / Area *"
                                            value={newForm.city}
                                            onChange={e => nf("city", e.target.value)}
                                        />
                                    </div>
                                    <div className="co-sel-wrap">
                                        <select
                                            className={"co-sel" + (formErrors.division ? " error" : "")}
                                            value={newForm.division}
                                            onChange={e => nf("division", e.target.value)}
                                        >
                                            <option value="">— Select Division * —</option>
                                            {DIVISIONS.map(d => <option key={d}>{d}</option>)}
                                        </select>
                                        <svg className="co-sel-arr" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                                    </div>
                                </div>
                            )}

                            <button type="button" className="co-manage-btn" onClick={() => navigate("/address-book")}>
                                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Manage Address Book
                            </button>

                            <p className="co-sec-label" style={{ marginTop: 32 }}>Payment Method</p>

                            {availableMethods.length === 0 ? (
                                <div className="co-no-number">
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    No payment methods available. Please contact the store.
                                </div>
                            ) : (
                                <div className="co-pay-grid">
                                    {availableMethods.map(m => (
                                        <div
                                            key={m.id}
                                            className={"co-pay-card" + (paymentMethod === m.id ? " sel" : "")}
                                            style={{ "--pc": m.color, "--pb": m.lightBg }}
                                            onClick={() => { setPaymentMethod(m.id); setSenderNumber(""); setTxId(""); setCopiedNumber(false); }}
                                        >
                                            <div className="co-pay-radio"><div className="co-pay-rdot" /></div>
                                            <div className="co-pay-logo">
                                                {m.id === "cod" ? (
                                                    <div className="co-cod-icon"><CodCardIcon size={28} /></div>
                                                ) : !logoErrors[m.id] ? (
                                                    <img src={m.logo} alt={m.label} style={{ maxHeight: 36, maxWidth: 64, objectFit: "contain" }} onError={() => setLogoErrors(p => ({ ...p, [m.id]: true }))} />
                                                ) : (
                                                    <span style={{ fontWeight: 800, fontSize: 12, color: m.color }}>{m.fallback}</span>
                                                )}
                                            </div>
                                            <span className="co-pay-label">{m.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isMobilePay && (
                                <div className="co-pay-box" style={{ background: selectedPayment.lightBg, borderColor: selectedPayment.border }}>
                                    <div className="co-pay-box-head">
                                        <div className="co-pay-box-logo">
                                            {!logoErrors[selectedPayment.id] ? (
                                                <img src={selectedPayment.logo} alt={selectedPayment.label} style={{ width: 30, height: 30, objectFit: "contain" }} onError={() => setLogoErrors(p => ({ ...p, [selectedPayment.id]: true }))} />
                                            ) : (
                                                <span style={{ fontWeight: 800, fontSize: 12, color: selectedPayment.color }}>{selectedPayment.fallback}</span>
                                            )}
                                        </div>
                                        <span className="co-pay-box-title" style={{ color: selectedPayment.color }}>
                                            How to pay via {selectedPayment.label}
                                        </span>
                                    </div>

                                    <div className="co-step">
                                        <div className="co-step-n" style={{ background: selectedPayment.color }}>1</div>
                                        <span>Open your <strong>{selectedPayment.label}</strong> app → tap <strong>Send Money</strong></span>
                                    </div>
                                    <div className="co-step">
                                        <div className="co-step-n" style={{ background: selectedPayment.color }}>2</div>
                                        <span>Send exactly <strong style={{ color: selectedPayment.color }}>{currency}{shippingFee !== null ? total.toFixed(0) : subtotal}</strong> to our number:</span>
                                    </div>

                                    {hasNumber ? (
                                        <div className="co-merchant" style={{ borderColor: selectedPayment.border, color: selectedPayment.color }}>
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                                            <span style={{ flex: 1 }}>{merchantNumber}</span>
                                            <button
                                                type="button"
                                                className={"co-copy-btn" + (copiedNumber ? " copied" : "")}
                                                style={{
                                                    borderColor: copiedNumber ? '#bbf7d0' : selectedPayment.border,
                                                    color: copiedNumber ? '#16a34a' : selectedPayment.color,
                                                }}
                                                onClick={handleCopyNumber}
                                            >
                                                {copiedNumber ? (
                                                    <>
                                                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="co-no-number">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                            Payment number not set. Contact the store.
                                        </div>
                                    )}

                                    <div className="co-step">
                                        <div className="co-step-n" style={{ background: selectedPayment.color }}>3</div>
                                        <span>Copy the <strong>Transaction ID</strong> from your app and fill below</span>
                                    </div>

                                    <div className="co-pay-inputs">
                                        <div>
                                            <label className="co-pay-input-label">Your {selectedPayment.label} Number *</label>
                                            <input
                                                className={"co-pay-input" + (senderNumber.length >= 11 ? " ok" : "")}
                                                type="tel" placeholder="01XXXXXXXXX" maxLength={14}
                                                value={senderNumber} onChange={e => setSenderNumber(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="co-pay-input-label">Transaction ID (TxID) *</label>
                                            <input
                                                className={"co-pay-input" + (txId.length >= 6 ? " ok" : "")}
                                                placeholder={selectedPayment.placeholder}
                                                value={txId} onChange={e => setTxId(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="co-panel">
                            <p className="co-sec-label">Order Summary</p>

                            {!coupon ? (
                                <div className="co-coupon-form">
                                    <input
                                        className="co-coupon-inp"
                                        type="text"
                                        placeholder="Coupon code"
                                        value={couponInput}
                                        onChange={e => setCouponInput(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="co-coupon-btn"
                                        onClick={handleCoupon}
                                    >
                                        Apply
                                    </button>
                                </div>
                            ) : (
                                <div className="co-coupon-applied">
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                                    <div className="co-coupon-applied-info">
                                        <span className="co-coupon-code">{coupon.code?.toUpperCase()}</span>
                                        {coupon.description && <p className="co-coupon-desc">{coupon.description}</p>}
                                    </div>
                                    <button type="button" className="co-coupon-remove" onClick={() => {
                                        setCoupon(null);
                                        showToast("Coupon removed", "info");
                                    }}>
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            )}

                            <div className="co-sum-row">
                                <span className="co-sum-label">Subtotal</span>
                                <span className="co-sum-val">{currency}{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="co-sum-row">
                                <span className="co-sum-label">Shipping</span>
                                <span className={"co-sum-val" + (shippingFee !== null ? " green" : " pending")}>
                                    {shippingFee !== null ? `${currency}${shippingFee}` : "Select address"}
                                </span>
                            </div>
                            {coupon && (
                                <div className="co-sum-row">
                                    <span className="co-sum-label">Discount ({coupon.discount}%)</span>
                                    <span className="co-sum-val red">-{currency}{discountAmt.toFixed(2)}</span>
                                </div>
                            )}

                            {shippingFee !== null && (
                                <div className="co-ship-chip">
                                    <div>
                                        <div className="co-ship-chip-tag">Delivery Fee</div>
                                        <div className="co-ship-chip-city">{shippingFee === 60 ? "Dhaka Division" : "Outside Dhaka"}</div>
                                    </div>
                                    <div className="co-ship-chip-fee">৳{shippingFee}</div>
                                </div>
                            )}

                            <div className="co-total-row">
                                <span className="co-total-label">Total</span>
                                <span className="co-total-val">{currency}{shippingFee !== null ? total.toFixed(0) : `${subtotal}+`}</span>
                            </div>

                            <div className="co-pay-badge" style={{ background: selectedPayment.lightBg, borderColor: selectedPayment.border }}>
                                <div className="co-pay-badge-icon">
                                    {selectedPayment.id === "cod" ? (
                                        <CodCardIcon size={18} />
                                    ) : !logoErrors[selectedPayment.id] ? (
                                        <img src={selectedPayment.logo} alt={selectedPayment.label} style={{ width: 26, height: 26, objectFit: "contain" }} onError={() => setLogoErrors(p => ({ ...p, [selectedPayment.id]: true }))} />
                                    ) : (
                                        <span style={{ fontWeight: 800, fontSize: 9, color: selectedPayment.color }}>{selectedPayment.fallback}</span>
                                    )}
                                </div>
                                <span className="co-pay-badge-name" style={{ color: selectedPayment.color }}>{selectedPayment.label}</span>
                                {isMobilePay && txId && (
                                    <span className="co-pay-badge-check">
                                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                                        TxID added
                                    </span>
                                )}
                            </div>

                            <button type="submit" className="co-submit" disabled={loading || availableMethods.length === 0}>
                                {loading ? (
                                    <>
                                        <svg className="co-spin" width="13" height="13" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2" />
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity=".8" />
                                        </svg>
                                        Placing Order...
                                    </>
                                ) : isMobilePay ? "Pay & Place Order" : "Place Order"}
                            </button>
                            <p className="co-secure">Secure · Encrypted · Trusted</p>
                        </div>

                    </div>
                </form>
            </div>
        </>
    );
}