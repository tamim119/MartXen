import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { getStoreOrders, updateOrderStatus as updateStatus } from "../../lib/services/orderService";
import { PackageIcon, TagIcon, ChevronDownIcon, UserIcon, CreditCardIcon, ShoppingBagIcon, XIcon, AlertTriangleIcon, CircleDotIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.so-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }
.so-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
.so-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 3px; }
.so-subtitle { font-size: 0.82rem; color: #94a3b8; margin: 0; font-weight: 400; }
.so-title span { color: #0f172a; font-weight: 800; }
.so-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

.so-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; font-size: 0.825rem; font-weight: 500; line-height: 1.5; margin-bottom: 18px; }
.so-alert-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800; }
.so-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.so-alert.error   .so-alert-icon { background: #fda4af; color: #9f1239; }
.so-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.so-alert.success .so-alert-icon { background: #86efac; color: #14532d; }
.so-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.so-alert.warning .so-alert-icon { background: #fcd34d; color: #92400e; }
.so-alert-body { flex: 1; font-size: 0.8rem; }
.so-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.so-alert-close:hover { opacity: 1; }

.so-badge { display: inline-flex; align-items: center; gap: 5px; border-radius: 100px; padding: 4px 10px; font-size: 0.68rem; font-weight: 700; white-space: nowrap; }
.so-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.so-badge.ORDER_PLACED { background: #fef9c3; color: #854d0e; border: 1.5px solid #fde68a; }
.so-badge.ORDER_PLACED .so-badge-dot { background: #f59e0b; }
.so-badge.PROCESSING   { background: #fff7ed; color: #9a3412; border: 1.5px solid #fed7aa; }
.so-badge.PROCESSING   .so-badge-dot { background: #f97316; }
.so-badge.SHIPPED      { background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; }
.so-badge.SHIPPED      .so-badge-dot { background: #3b82f6; }
.so-badge.DELIVERED    { background: #f0fdf4; color: #15803d; border: 1.5px solid #bbf7d0; }
.so-badge.DELIVERED    .so-badge-dot { background: #16a34a; }
.so-badge.CANCELLED    { background: #fff1f2; color: #9f1239; border: 1.5px solid #fecdd3; }
.so-badge.CANCELLED    .so-badge-dot { background: #ef4444; }
.so-badge.CANCELLED_STOCK_OUT    { background: #fff1f2; color: #9f1239; border: 1.5px solid #fecdd3; }
.so-badge.CANCELLED_STOCK_OUT    .so-badge-dot { background: #ef4444; }
.so-badge.CANCELLED_TRX_MISMATCH { background: #fff1f2; color: #9f1239; border: 1.5px solid #fecdd3; }
.so-badge.CANCELLED_TRX_MISMATCH .so-badge-dot { background: #ef4444; }

.so-pay-badge { display: inline-flex; align-items: center; gap: 4px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 2px 8px; font-size: 0.68rem; font-weight: 600; color: #475569; }
.so-coupon-badge { display: inline-flex; align-items: center; gap: 4px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 2px 8px; font-size: 0.68rem; font-weight: 700; color: #15803d; }

.so-variant-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.so-variant-tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 5px; background: #f8fafc; border: 1.5px solid #e2e8f0; font-size: 0.6rem; font-weight: 600; color: #334155; }
.so-variant-key { color: #94a3b8; font-weight: 700; text-transform: uppercase; font-size: 0.55rem; letter-spacing: 0.05em; }
.so-variant-sep { color: #cbd5e1; }

/* ✅ Cancel action buttons */
.so-cancel-btns { display: flex; gap: 6px; flex-shrink: 0; flex-wrap: wrap; }
/* Cancel buttons use shadcn Button component */

/* ✅ Cancelled badge in card */
.so-cancelled-reason { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: #fff1f2; border-top: 1.5px solid #fecdd3; font-size: 0.7rem; color: #9f1239; font-weight: 600; }

/* ✅ Modal */
.so-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: so-fade 0.2s ease both; }
@keyframes so-fade { from { opacity: 0; } to { opacity: 1; } }
.so-modal { background: #fff; border-radius: 22px; padding: 28px 24px; max-width: 380px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.18); animation: so-modal-up 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes so-modal-up { from { opacity: 0; transform: scale(0.92) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.so-modal-icon { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.so-modal-icon.red    { background: #f8fafc; border: 2px solid #e2e8f0; color: #64748b; }
.so-modal-icon.orange { background: #fff7ed; border: 2px solid #fed7aa; color: #f97316; }
.so-modal-title { font-size: 1rem; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 8px; }
.so-modal-sub { font-size: 0.8rem; color: #64748b; text-align: center; line-height: 1.6; margin: 0 0 22px; }
.so-modal-btns { display: flex; gap: 10px; }
.so-modal-keep { flex: 1; padding: 11px; border: 1.5px solid #e2e8f0; border-radius: 12px; background: #fff; color: #475569; font-size: 0.82rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; }
.so-modal-keep:hover { background: #f8fafc; }
.so-modal-confirm-red { flex: 1; padding: 11px; border: none; border-radius: 12px; background: #ef4444; color: #fff; font-size: 0.82rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: background 0.18s; }
.so-modal-confirm-red:hover { background: #dc2626; }
.so-modal-confirm-red:disabled { opacity: 0.6; cursor: not-allowed; }
.so-modal-confirm-orange { flex: 1; padding: 11px; border: none; border-radius: 12px; background: #f97316; color: #fff; font-size: 0.82rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: background 0.18s; }
.so-modal-confirm-orange:hover { background: #ea6c10; }
.so-modal-confirm-orange:disabled { opacity: 0.6; cursor: not-allowed; }

.so-desktop-list { display: flex; flex-direction: column; gap: 10px; }
.so-order-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; transition: border-color 0.2s; }
.so-order-card:hover { border-color: #e2e8f0; }
.so-order-card.open  { border-color: #bbf7d0; }
.so-order-card.cancelled-card { border-color: #fecdd3 !important; }

.so-card-head { display: flex; align-items: center; gap: 14px; padding: 14px 18px; cursor: pointer; user-select: none; flex-wrap: wrap; }
.so-card-num { font-size: 0.75rem; font-weight: 800; color: #16a34a; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; width: 28px; height: 28px; min-width: 28px; display: flex; align-items: center; justify-content: center; }
.so-card-main { flex: 1; min-width: 0; }
.so-card-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 3px; }
.so-card-meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.so-card-phone { font-size: 0.7rem; color: #94a3b8; }
.so-card-sep   { color: #e2e8f0; font-size: 0.7rem; }
.so-card-date  { font-size: 0.7rem; color: #94a3b8; }
.so-card-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
.so-card-total-val { font-size: 0.95rem; font-weight: 800; color: #0f172a; white-space: nowrap; }
.so-card-items { font-size: 0.72rem; font-weight: 600; color: #64748b; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 8px; padding: 3px 9px; white-space: nowrap; }
.so-card-select { padding: 6px 10px; border: 1.5px solid #f1f5f9; border-radius: 10px; font-size: 0.75rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; outline: none; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; }
.so-card-select:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }
.so-card-chevron { width: 28px; height: 28px; min-width: 28px; border-radius: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s; }
.so-order-card.open .so-card-chevron { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: rotate(180deg); }

.so-card-body { border-top: 1.5px solid #f1f5f9; padding: 18px; display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 14px; background: #fafbfc; }
.so-info-block { display: flex; flex-direction: column; }
.so-info-label { font-size: 0.6rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
.so-info-label svg { color: #cbd5e1; }
.so-info-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 7px; flex: 1; }
.so-info-row { display: flex; gap: 10px; align-items: flex-start; }
.so-info-key { font-size: 0.68rem; font-weight: 600; color: #94a3b8; min-width: 60px; flex-shrink: 0; padding-top: 1px; }
.so-info-val { font-size: 0.78rem; font-weight: 500; color: #0f172a; word-break: break-word; line-height: 1.4; flex: 1; }
.so-info-val.mono { font-family: monospace; background: #f1f5f9; padding: 1px 6px; border-radius: 5px; font-size: 0.72rem; display: inline-block; }
.so-info-val.red { color: #ef4444; font-weight: 700; }
.so-info-hr { height: 1.5px; background: #f1f5f9; border: none; margin: 2px 0; }
.so-info-total { display: flex; align-items: center; justify-content: space-between; }
.so-info-total-label { font-size: 0.7rem; font-weight: 700; color: #64748b; }
.so-info-total-val { font-size: 0.95rem; font-weight: 800; color: #0f172a; }

.so-prod-list { display: flex; flex-direction: column; gap: 7px; }
.so-prod-item { display: flex; align-items: flex-start; gap: 10px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 10px; padding: 9px 12px; }
.so-prod-img { width: 38px; height: 38px; border-radius: 8px; object-fit: contain; background: #f8fafc; border: 1.5px solid #f1f5f9; mix-blend-mode: multiply; flex-shrink: 0; }
.so-prod-name { font-size: 0.78rem; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
.so-prod-meta { font-size: 0.68rem; color: #94a3b8; }
.so-prod-price { margin-left: auto; font-size: 0.8rem; font-weight: 800; color: #0f172a; flex-shrink: 0; white-space: nowrap; padding-left: 10px; padding-top: 2px; }

.so-mobile-list { display: none; flex-direction: column; gap: 10px; }
.so-acc-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; transition: border-color 0.2s; }
.so-acc-card.open { border-color: #e2e8f0; }
.so-acc-card.cancelled-card { border-color: #fecdd3 !important; }
.so-acc-head { display: flex; align-items: center; gap: 10px; padding: 14px; cursor: pointer; user-select: none; }
.so-acc-head-left { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.so-acc-head-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.so-acc-total { font-size: 0.95rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
.so-acc-chevron { width: 28px; height: 28px; border-radius: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.22s; flex-shrink: 0; }
.so-acc-card.open .so-acc-chevron { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: rotate(180deg); }
.so-acc-body { padding: 14px 14px 16px; border-top: 1.5px solid #f8fafc; display: flex; flex-direction: column; gap: 12px; }
.so-acc-sec { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
.so-acc-sec::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }
.so-acc-info { display: flex; flex-direction: column; gap: 5px; }
.so-acc-info-row { display: flex; gap: 8px; align-items: flex-start; font-size: 0.8rem; }
.so-acc-info-key { color: #94a3b8; font-weight: 600; font-size: 0.72rem; min-width: 60px; flex-shrink: 0; }
.so-acc-info-val { color: #0f172a; font-weight: 500; word-break: break-word; }
.so-acc-item { display: flex; align-items: flex-start; gap: 10px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 10px 12px; margin-bottom: 6px; }
.so-acc-item:last-child { margin-bottom: 0; }
.so-acc-item-img { width: 44px; height: 44px; border-radius: 10px; object-fit: contain; background: #fff; border: 1.5px solid #f1f5f9; mix-blend-mode: multiply; flex-shrink: 0; }
.so-acc-item-name { font-size: 0.8rem; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
.so-acc-item-meta { font-size: 0.7rem; color: #94a3b8; }
.so-acc-item-price { margin-left: auto; font-size: 0.82rem; font-weight: 800; color: #0f172a; flex-shrink: 0; padding-top: 2px; }
.so-acc-price-row { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #64748b; flex-wrap: wrap; }
.so-acc-price-row strong { color: #0f172a; font-weight: 800; font-size: 0.9rem; }
.so-acc-price-sep { color: #cbd5e1; }
.so-acc-bottom { display: flex; flex-direction: column; gap: 8px; padding-top: 10px; border-top: 1.5px solid #f8fafc; }
.so-acc-pay-row { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 10px 12px; font-size: 0.8rem; font-weight: 500; color: #475569; }
.so-acc-status-sel { width: 100%; padding: 10px 14px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.82rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; outline: none; cursor: pointer; appearance: none; transition: border-color 0.2s, box-shadow 0.2s; }
.so-acc-status-sel:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }

.so-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px 20px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; color: #94a3b8; text-align: center; gap: 8px; }
.so-empty-icon { width: 64px; height: 64px; border-radius: 20px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.so-empty p    { font-size: 0.875rem; font-weight: 600; color: #475569; margin: 0; }
.so-empty span { font-size: 0.775rem; color: #cbd5e1; }

@media (max-width: 900px) {
    .so-desktop-list { display: none; }
    .so-mobile-list  { display: flex; }
    .so-title { font-size: 1.25rem; }
    .so-card-body { grid-template-columns: 1fr; }
}
`;

const STATUS_OPTS = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
const CANCELLABLE_BY_STORE = ["ORDER_PLACED", "PROCESSING", "SHIPPED"];

const VARIANT_LABELS = { size: "Size", color: "Color", skinType: "Skin", ageRange: "Age", language: "Lang", material: "Material", brand: "Brand", warranty: "Warranty" };
const VARIANT_KEYS = Object.keys(VARIANT_LABELS);

const VariantTags = ({ item }) => {
    const tags = VARIANT_KEYS.filter(k => typeof item[k] === "string" && item[k].trim());
    if (!tags.length) return null;
    return (
        <div className="so-variant-tags">
            {tags.map(k => (
                <span key={k} className="so-variant-tag">
                    <span className="so-variant-key">{VARIANT_LABELS[k]}</span>
                    <span className="so-variant-sep">·</span>
                    {item[k]}
                </span>
            ))}
        </div>
    );
};

const getCancelReasonLabel = (status) => {
    if (status === "CANCELLED_STOCK_OUT")    return "Cancelled by store — Stock Out";
    if (status === "CANCELLED_TRX_MISMATCH") return "Cancelled — TrxID Mismatch";
    if (status === "CANCELLED")              return "Cancelled by customer";
    return null;
};

const isCancelledStatus = (status) => status?.startsWith("CANCELLED");

const getDisplayBadgeClass = (status) => {
    if (isCancelledStatus(status)) return "CANCELLED";
    return status || "ORDER_PLACED";
};

const getDisplayLabel = (status) => {
    if (status === "CANCELLED_STOCK_OUT")    return "Stock Out";
    if (status === "CANCELLED_TRX_MISMATCH") return "TrxID Mismatch";
    if (status === "CANCELLED")              return "Cancelled";
    return status?.replace(/_/g, ' ') || "ORDER PLACED";
};

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', warning: '!' };
    return (
        <div className={`so-alert ${type}`}>
            <div className="so-alert-icon">{icons[type]}</div>
            <div className="so-alert-body">{message}</div>
            <button className="so-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

const getCustomerName = (order) => {
    const a = order.address || order.addressData || {};
    if (a.name) return a.name;
    return [a.firstName, a.lastName].filter(Boolean).join(" ") || order.userEmail || "—";
};
const getAddress = (order) => {
    const a = order.address || order.addressData || {};
    return [a.street, a.city, a.division ? `${a.division} Division` : a.state].filter(Boolean).join(", ") || "—";
};
const getPhone = (order) => (order.address || order.addressData || {}).phone || "—";

export default function StoreOrders() {
    const { user, loading: userLoading } = useCurrentUser();
    const [orders,     setOrders]     = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [openId,     setOpenId]     = useState(null);
    const [alert,      setAlert]      = useState(null);
    const [modal,      setModal]      = useState(null); // { orderId, type: 'cancel' | 'stockout' }
    const [processing, setProcessing] = useState(false);
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '৳';

    const showAlert  = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    useEffect(() => {
        if (userLoading) return;
        const fetchData = async () => {
            if (!user) { setLoading(false); showAlert("warning", "Please login."); return; }
            try {
                const store = await getStoreByUser(user.uid);
                if (!store) { setLoading(false); showAlert("warning", "No store found."); return; }
                const data = await getStoreOrders(store.id);
                setOrders(data || []);
            } catch (err) {
                console.error(err);
                showAlert("error", "Failed to load orders.");
            } finally { setLoading(false); }
        };
        fetchData();
    }, [user, userLoading]);

    const handleStatusChange = async (e, orderId) => {
        e.stopPropagation();
        const status = e.target.value;
        const old = orders.find(o => o.id === orderId)?.status;
        clearAlert();
        try {
            await updateStatus(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            const msgs = { ORDER_PLACED: "Order marked as placed.", PROCESSING: "Processing.", SHIPPED: "Shipped!", DELIVERED: "Delivered!" };
            showAlert("success", msgs[status] || "Status updated.");
        } catch {
            showAlert("error", "Failed to update status.");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: old } : o));
        }
    };

    // ✅ Store cancel handler
    const handleCancelConfirm = async () => {
        if (!modal) return;
        setProcessing(true);
        const newStatus = modal.type === 'stockout' ? "CANCELLED_STOCK_OUT" : "CANCELLED_TRX_MISMATCH";
        try {
            await updateDoc(doc(db, "orders", modal.orderId), {
                status: newStatus,
                cancelledBy: "store",
                cancelledAt: new Date(),
            });
            setOrders(prev => prev.map(o => o.id === modal.orderId ? { ...o, status: newStatus } : o));
            const msg = modal.type === 'stockout'
                ? "Order cancelled — customer will see 'Stock Out'."
                : "Order cancelled — customer will see 'TrxID Mismatch'.";
            showAlert("success", msg);
        } catch {
            showAlert("error", "Failed to cancel order.");
        } finally { setProcessing(false); setModal(null); }
    };

    const formatDate = (val) => {
        if (!val) return "—";
        try { const d = val?.toDate ? val.toDate() : new Date(val); return d.toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" }); }
        catch { return "—"; }
    };

    if (userLoading || loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>

            {/* ✅ Cancel Modal */}
            {modal && (
                <div className="so-modal-overlay" onClick={() => !processing && setModal(null)}>
                    <div className="so-modal" onClick={e => e.stopPropagation()}>
                        <div className={`so-modal-icon ${modal.type === 'stockout' ? 'orange' : 'red'}`}>
                            {modal.type === 'stockout' ? <AlertTriangleIcon size={22} /> : <XIcon size={22} />}
                        </div>
                        <p className="so-modal-title">
                            {modal.type === 'stockout' ? 'Mark as Stock Out?' : 'Cancel — TrxID Mismatch?'}
                        </p>
                        <p className="so-modal-sub">
                            {modal.type === 'stockout'
                                ? "Customer's order page will show \"Cancelled — Stock Out\"."
                                : "Customer's order page will show \"Cancelled — TrxID Mismatch\"."}
                        </p>
                        <div className="so-modal-btns">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={processing}
                                onClick={() => setModal(null)}
                                className="flex-1 rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 font-bold text-xs h-9"
                            >
                                Go Back
                            </Button>
                            {modal.type === 'stockout' ? (
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    onClick={handleCancelConfirm}
                                    className="flex-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs h-9 border-0 shadow-none"
                                >
                                    {processing ? "Processing..." : "Confirm Stock Out"}
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    disabled={processing}
                                    onClick={handleCancelConfirm}
                                    className="flex-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 border-0 shadow-none"
                                >
                                    {processing ? "Processing..." : "Confirm Cancel"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="so-root">
                <div className="so-header">
                    <div>
                        <h1 className="so-title">Store <span>Orders</span></h1>
                        <p className="so-subtitle">Track and manage customer orders</p>
                    </div>
                    {orders.length > 0 && <span className="so-count">{orders.length} orders</span>}
                </div>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                {orders.length === 0 ? (
                    <div className="so-empty">
                        <div className="so-empty-icon"><PackageIcon size={26} style={{ color: '#cbd5e1' }} /></div>
                        <p>No orders yet</p>
                        <span>Orders will appear here when customers place them</span>
                    </div>
                ) : (<>

                    {/* ══ DESKTOP ══ */}
                    <div className="so-desktop-list">
                        {orders.map((order, i) => {
                            const isOpen    = expandedId === order.id;
                            const sc        = order.status || "ORDER_PLACED";
                            const cancelled = isCancelledStatus(sc);
                            const canCancel = CANCELLABLE_BY_STORE.includes(sc);
                            const cancelReason = getCancelReasonLabel(sc);

                            return (
                                <div key={order.id} className={`so-order-card${isOpen ? ' open' : ''}${cancelled ? ' cancelled-card' : ''}`}>
                                    <div className="so-card-head" onClick={() => setExpandedId(isOpen ? null : order.id)}>
                                        <div className="so-card-num">{i + 1}</div>
                                        <div className="so-card-main">
                                            <div className="so-card-name">{getCustomerName(order)}</div>
                                            <div className="so-card-meta">
                                                <span className="so-card-phone">{getPhone(order)}</span>
                                                <span className="so-card-sep">·</span>
                                                <span className="so-card-date">{formatDate(order.createdAt)}</span>
                                                <span className={`so-badge ${getDisplayBadgeClass(sc)}`}>
                                                    <span className="so-badge-dot" />{getDisplayLabel(sc)}
                                                </span>
                                                {order.isCouponUsed && <span className="so-coupon-badge"><TagIcon size={9} />{order.coupon?.code}</span>}
                                                {cancelReason && <span style={{ fontSize: '0.68rem', color: '#9f1239', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertCircleIcon size={11} />{cancelReason}</span>}
                                            </div>
                                        </div>
                                        <div className="so-card-right" onClick={e => e.stopPropagation()}>
                                            <span className="so-card-items">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                                            <span className="so-pay-badge">{order.paymentMethod || 'COD'}</span>
                                            <span className="so-card-total-val">{currency}{(order.total ?? order.totalAmount ?? 0).toLocaleString()}</span>
                                            {!cancelled && (
                                                <select className="so-card-select" value={sc} onChange={e => handleStatusChange(e, order.id)}>
                                                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                                </select>
                                            )}
                                            {/* ✅ Cancel buttons — PlusApprove style */}
                                            {canCancel && !cancelled && (
                                                <div className="so-cancel-btns">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setModal({ orderId: order.id, type: 'trxmismatch' })}
                                                        className="rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 font-bold text-xs gap-1.5 px-3 h-8"
                                                    >
                                                        <CircleDotIcon size={11} /> Cancel Order
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setModal({ orderId: order.id, type: 'stockout' })}
                                                        className="rounded-full border-orange-200 bg-white text-orange-500 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 font-bold text-xs gap-1.5 px-3 h-8"
                                                    >
                                                        Stock Out
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="so-card-chevron"><ChevronDownIcon size={14} /></div>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="so-card-body">
                                            <div className="so-info-block">
                                                <div className="so-info-label"><UserIcon size={11} /> Customer Info</div>
                                                <div className="so-info-card">
                                                    <div className="so-info-row"><span className="so-info-key">Name</span><span className="so-info-val">{getCustomerName(order)}</span></div>
                                                    <div className="so-info-row"><span className="so-info-key">Phone</span><span className="so-info-val">{getPhone(order)}</span></div>
                                                    <div className="so-info-row"><span className="so-info-key">Address</span><span className="so-info-val">{getAddress(order)}</span></div>
                                                    {(order.address?.email || order.userEmail) && <div className="so-info-row"><span className="so-info-key">Email</span><span className="so-info-val">{order.address?.email || order.userEmail}</span></div>}
                                                </div>
                                            </div>
                                            <div className="so-info-block">
                                                <div className="so-info-label"><CreditCardIcon size={11} /> Payment Info</div>
                                                <div className="so-info-card">
                                                    <div className="so-info-row"><span className="so-info-key">Method</span><span className="so-info-val">{order.paymentMethod || 'COD'}</span></div>
                                                    {order.paymentDetails?.senderNumber && <div className="so-info-row"><span className="so-info-key">Sender</span><span className="so-info-val">{order.paymentDetails.senderNumber}</span></div>}
                                                    {order.paymentDetails?.txId && <div className="so-info-row"><span className="so-info-key">TxID</span><span className="so-info-val mono">{order.paymentDetails.txId}</span></div>}
                                                    <hr className="so-info-hr" />
                                                    <div className="so-info-row"><span className="so-info-key">Subtotal</span><span className="so-info-val">{currency}{order.subtotal || 0}</span></div>
                                                    {order.shippingFee > 0 && <div className="so-info-row"><span className="so-info-key">Shipping</span><span className="so-info-val">+{currency}{order.shippingFee}</span></div>}
                                                    {order.discountAmount > 0 && <div className="so-info-row"><span className="so-info-key">Discount</span><span className="so-info-val red">−{currency}{order.discountAmount}</span></div>}
                                                    <hr className="so-info-hr" />
                                                    <div className="so-info-total"><span className="so-info-total-label">Total</span><span className="so-info-total-val">{currency}{(order.total ?? order.totalAmount ?? 0).toLocaleString()}</span></div>
                                                </div>
                                            </div>
                                            <div className="so-info-block">
                                                <div className="so-info-label"><ShoppingBagIcon size={11} /> Products</div>
                                                <div className="so-prod-list">
                                                    {order.items?.map((item, j) => (
                                                        <div key={`${order.id}-${j}`} className="so-prod-item">
                                                            <img src={item.image || item.images?.[0] || '/placeholder.png'} alt={item.name} className="so-prod-img" />
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <p className="so-prod-name">{item.name || 'Product'}</p>
                                                                <VariantTags item={item} />
                                                                <p className="so-prod-meta" style={{ marginTop: 3 }}>Qty: {item.quantity || 0} · {currency}{item.price || 0} each</p>
                                                            </div>
                                                            <span className="so-prod-price">{currency}{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ══ MOBILE ══ */}
                    <div className="so-mobile-list">
                        {orders.map((order) => {
                            const isOpen    = openId === order.id;
                            const sc        = order.status || "ORDER_PLACED";
                            const cancelled = isCancelledStatus(sc);
                            const canCancel = CANCELLABLE_BY_STORE.includes(sc);
                            const cancelReason = getCancelReasonLabel(sc);

                            return (
                                <div key={order.id} className={`so-acc-card${isOpen ? ' open' : ''}${cancelled ? ' cancelled-card' : ''}`}>
                                    <div className="so-acc-head" onClick={() => setOpenId(isOpen ? null : order.id)}>
                                        <div className="so-acc-head-left">
                                            <span className={`so-badge ${getDisplayBadgeClass(sc)}`}>
                                                <span className="so-badge-dot" />{getDisplayLabel(sc)}
                                            </span>
                                            <span className="so-pay-badge">{order.paymentMethod || 'COD'}</span>
                                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="so-acc-head-right">
                                            <div className="so-acc-chevron"><ChevronDownIcon size={14} /></div>
                                        </div>
                                    </div>
                                    <div style={{ paddingLeft: 14, paddingBottom: isOpen ? 0 : 14, marginTop: -4 }}>
                                        <span className="so-acc-total">{currency}{order.total ?? order.totalAmount ?? 0}</span>
                                    </div>

                                    {/* ✅ Cancel reason */}
                                    {cancelReason && (
                                        <div className="so-cancelled-reason">
                                            <AlertCircleIcon size={12} /> {cancelReason}
                                        </div>
                                    )}

                                    {isOpen && (
                                        <div className="so-acc-body">
                                            <div>
                                                <p className="so-acc-sec">Customer</p>
                                                <div className="so-acc-info">
                                                    <div className="so-acc-info-row"><span className="so-acc-info-key">Name</span><span className="so-acc-info-val">{getCustomerName(order)}</span></div>
                                                    <div className="so-acc-info-row"><span className="so-acc-info-key">Phone</span><span className="so-acc-info-val">{getPhone(order)}</span></div>
                                                    <div className="so-acc-info-row"><span className="so-acc-info-key">Address</span><span className="so-acc-info-val">{getAddress(order)}</span></div>
                                                    {(order.address?.email || order.userEmail) && <div className="so-acc-info-row"><span className="so-acc-info-key">Email</span><span className="so-acc-info-val">{order.address?.email || order.userEmail}</span></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="so-acc-sec">Products</p>
                                                {order.items?.map((item, j) => (
                                                    <div key={`${order.id}-m-${j}`} className="so-acc-item">
                                                        <img src={item.image || item.images?.[0] || '/placeholder.png'} alt={item.name} className="so-acc-item-img" />
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <p className="so-acc-item-name">{item.name || 'Product'}</p>
                                                            <VariantTags item={item} />
                                                            <p className="so-acc-item-meta" style={{ marginTop: 3 }}>Qty: {item.quantity || 0} · {currency}{item.price || 0}</p>
                                                        </div>
                                                        <span className="so-acc-item-price">{currency}{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="so-acc-price-row">
                                                <span>{currency}{order.subtotal || 0}</span>
                                                {order.shippingFee > 0 && <><span className="so-acc-price-sep">+</span><span>{currency}{order.shippingFee} shipping</span></>}
                                                {order.discountAmount > 0 && <><span className="so-acc-price-sep">−</span><span style={{ color: '#ef4444' }}>{currency}{order.discountAmount} off</span></>}
                                                <span className="so-acc-price-sep">=</span>
                                                <strong>{currency}{order.total ?? order.totalAmount ?? 0}</strong>
                                            </div>
                                            <div className="so-acc-bottom">
                                                <div className="so-acc-pay-row">
                                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#94a3b8' }}><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                                                    {order.paymentMethod === "COD" ? "Cash on Delivery" : `${order.paymentMethod || 'Payment'}${order.paymentDetails?.txId ? ` · TxID: ${order.paymentDetails.txId}` : ''}`}
                                                </div>
                                                {!cancelled && (
                                                    <select className="so-acc-status-sel" value={sc} onChange={e => handleStatusChange(e, order.id)} onClick={e => e.stopPropagation()}>
                                                        {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                                    </select>
                                                )}
                                                {/* ✅ Cancel buttons mobile — PlusApprove style */}
                                                {canCancel && !cancelled && (
                                                    <div className="so-cancel-btns" style={{ width: '100%' }}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setModal({ orderId: order.id, type: 'trxmismatch' })}
                                                            className="flex-1 rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-bold text-xs h-9"
                                                        >
                                                            <CircleDotIcon size={11} /> Cancel Order
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setModal({ orderId: order.id, type: 'stockout' })}
                                                            className="flex-1 rounded-full border-orange-200 bg-white text-orange-500 hover:bg-orange-50 hover:text-orange-600 font-bold text-xs h-9"
                                                        >
                                                            Stock Out
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </>)}
            </div>
        </>
    );
}