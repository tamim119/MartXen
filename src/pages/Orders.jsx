import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useAuth";
import { getUserOrders } from "../lib/services/orderService";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon, ArrowRightIcon, MapPinIcon, PhoneIcon, AlertCircleIcon, ChevronDownIcon } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ord-root { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 70vh; padding: 0 24px; }
.ord-inner { max-width: 1280px; margin: 0 auto; padding: 40px 0 80px; }
.ord-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 12px; }
.ord-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.ord-title span { color: #0f172a; font-weight: 800; }
.ord-sub { font-size: 0.78rem; color: #94a3b8; margin: 0; font-weight: 400; }
.ord-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 100px; flex-shrink: 0; }

.ord-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; font-size: 0.825rem; font-weight: 500; line-height: 1.5; margin-bottom: 18px; }
.ord-alert-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800; }
.ord-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.ord-alert.error   .ord-alert-icon { background: #fda4af; color: #9f1239; }
.ord-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.ord-alert.success .ord-alert-icon { background: #86efac; color: #14532d; }
.ord-alert-body { flex: 1; font-size: 0.8rem; }
.ord-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }

/* ── Desktop Table ── */
.ord-table-wrap { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; overflow: hidden; }
.ord-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
.ord-table thead tr th { padding: 13px 18px; font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; background: #f8fafc; border-bottom: 1.5px solid #f1f5f9; text-align: left; }
.ord-table thead tr th:not(:first-child) { text-align: center; }
.ord-table tbody tr { border-bottom: 1.5px solid #f8fafc; transition: background 0.15s; }
.ord-table tbody tr:last-child { border-bottom: none; }
.ord-table tbody tr:hover { background: #f8fafc; }
.ord-table tbody tr.cancelled-row { background: #fff8f8; }
.ord-td { padding: 14px 18px; vertical-align: middle; }
.ord-td-center { padding: 14px 18px; vertical-align: middle; text-align: center; }

.ord-prod-cell { display: flex; align-items: center; gap: 12px; }
.ord-prod-img-wrap { width: 48px; height: 48px; border-radius: 10px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.ord-prod-img-wrap img { width: 34px; height: 34px; object-fit: contain; mix-blend-mode: multiply; }
.ord-prod-name { font-size: 0.82rem; font-weight: 600; color: #0f172a; margin: 0 0 2px; line-height: 1.3; }
.ord-prod-meta { font-size: 0.7rem; color: #94a3b8; margin: 0; }
.ord-total-val { font-size: 0.9rem; font-weight: 800; color: #0f172a; }
.ord-addr-name { font-size: 0.8rem; font-weight: 600; color: #0f172a; margin: 0 0 2px; }
.ord-addr-line { font-size: 0.72rem; color: #94a3b8; margin: 0; }

/* ── Mobile Cards ── */
.ord-mobile-list { display: none; flex-direction: column; gap: 10px; }
.ord-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; transition: border-color 0.18s; }
.ord-card:hover { border-color: #e2e8f0; }
.ord-card.cancelled-card { border-color: #fecdd3 !important; }
.ord-card-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-bottom: 1.5px solid #f8fafc; }
.ord-card-item:last-of-type { border-bottom: none; }
.ord-card-img { width: 50px; height: 50px; border-radius: 12px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.ord-card-img img { width: 36px; height: 36px; object-fit: contain; mix-blend-mode: multiply; }
.ord-card-name { font-size: 0.84rem; font-weight: 600; color: #0f172a; margin: 0 0 3px; line-height: 1.3; }
.ord-card-meta { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin: 0; }

.ord-variants { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; margin-bottom: 3px; }
.ord-variant-tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 6px; background: #f8fafc; border: 1.5px solid #e2e8f0; font-size: 0.62rem; font-weight: 600; color: #334155; }
.ord-variant-key { color: #94a3b8; font-weight: 700; text-transform: uppercase; font-size: 0.56rem; letter-spacing: 0.06em; }
.ord-variant-sep { color: #cbd5e1; }

.ord-card-footer { padding: 12px 16px; border-top: 1.5px solid #f8fafc; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.ord-card-head-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; cursor: pointer; user-select: none; }
.ord-card-head-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex: 1; min-width: 0; }
.ord-card-chevron { width: 28px; height: 28px; min-width: 28px; border-radius: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.22s; flex-shrink: 0; }
.ord-card-chevron.open { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: rotate(180deg); }
.ord-card-body { border-top: 1.5px solid #f8fafc; }
.ord-card-total { font-size: 1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
.ord-card-footer-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ord-cancel-reason { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #fff1f2; border-top: 1.5px solid #fecdd3; font-size: 0.72rem; color: #9f1239; font-weight: 600; }

/* ── Status ── */
.ord-status { display: inline-flex; align-items: center; gap: 5px; border-radius: 100px; padding: 4px 10px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
.ord-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.ord-status.processing   { background: #fef9c3; color: #854d0e; border: 1.5px solid #fde68a; }
.ord-status.processing   .ord-status-dot { background: #f59e0b; }
.ord-status.delivered    { background: #f0fdf4; color: #15803d; border: 1.5px solid #bbf7d0; }
.ord-status.delivered    .ord-status-dot { background: #16a34a; }
.ord-status.shipped      { background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; }
.ord-status.shipped      .ord-status-dot { background: #3b82f6; }
.ord-status.order_placed { background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0; }
.ord-status.order_placed .ord-status-dot { background: #94a3b8; }
.ord-status.cancelled    { background: #fff1f2; color: #9f1239; border: 1.5px solid #fecdd3; }
.ord-status.cancelled    .ord-status-dot { background: #ef4444; }

/* ── Modal ── */
.ord-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: ord-fade 0.2s ease both; }
@keyframes ord-fade { from { opacity: 0; } to { opacity: 1; } }
.ord-modal { background: #fff; border-radius: 22px; padding: 28px 24px; max-width: 360px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.18); animation: ord-up 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes ord-up { from { opacity: 0; transform: scale(0.92) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.ord-modal-icon { width: 52px; height: 52px; border-radius: 50%; background: #f8fafc; border: 2px solid #e2e8f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #64748b; }
.ord-modal-title { font-size: 1rem; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 8px; }
.ord-modal-sub { font-size: 0.8rem; color: #64748b; text-align: center; line-height: 1.6; margin: 0 0 22px; }
.ord-modal-btns { display: flex; gap: 10px; }

.ord-card-addr { padding: 10px 16px 14px; border-top: 1.5px solid #f8fafc; display: flex; flex-direction: column; gap: 3px; }
.ord-card-addr-name { font-size: 0.78rem; font-weight: 700; color: #475569; }
.ord-card-addr-row  { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: #94a3b8; }

.ord-empty { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
.ord-empty-card { text-align: center; padding: 56px 48px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.05); max-width: 360px; width: 100%; }
.ord-empty-icon { width: 76px; height: 76px; border-radius: 50%; background: #f8fafc; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #cbd5e1; }
.ord-empty-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
.ord-empty-sub   { font-size: 0.825rem; color: #94a3b8; margin: 0 0 28px; line-height: 1.65; font-weight: 400; }
.ord-empty-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #16a34a; color: #fff; font-size: 0.875rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 100px; cursor: pointer; transition: all 0.22s; box-shadow: 0 4px 16px rgba(22,163,74,0.32); }
.ord-empty-btn:hover { background: #15803d; transform: translateY(-2px); }

@media (max-width: 640px) {
    .ord-root { padding: 0 14px; }
    .ord-inner { padding: 28px 0 60px; }
    .ord-title { font-size: 1.25rem; }
    .ord-table-wrap { display: none; }
    .ord-mobile-list { display: flex; }
    .ord-empty-card { padding: 40px 24px; }
}
`;

const VARIANT_LABELS = { size: "Size", color: "Color", skinType: "Skin Type", ageRange: "Age", language: "Lang", material: "Material", brand: "Brand", warranty: "Warranty" };
const VARIANT_KEYS   = Object.keys(VARIANT_LABELS);
const CANCELLABLE    = ["ORDER_PLACED", "PROCESSING"];

const STATUS_MAP = {
    PROCESSING: 'processing', DELIVERED: 'delivered', SHIPPED: 'shipped',
    ORDER_PLACED: 'order_placed', CANCELLED: 'cancelled',
    CANCELLED_STOCK_OUT: 'cancelled', CANCELLED_TRX_MISMATCH: 'cancelled',
};

const Alert = ({ type, message, onDismiss }) => (
    <div className={`ord-alert ${type}`}>
        <div className="ord-alert-icon">{type === 'success' ? '✓' : '✕'}</div>
        <div className="ord-alert-body">{message}</div>
        <button className="ord-alert-close" onClick={onDismiss} type="button">✕</button>
    </div>
);

const VariantTags = ({ item }) => {
    const tags = VARIANT_KEYS.filter(k => typeof item[k] === "string" && item[k].trim());
    if (!tags.length) return null;
    return (
        <div className="ord-variants">
            {tags.map(k => (
                <span key={k} className="ord-variant-tag">
                    <span className="ord-variant-key">{VARIANT_LABELS[k]}</span>
                    <span className="ord-variant-sep">·</span>
                    {item[k]}
                </span>
            ))}
        </div>
    );
};

const getCancelReasonLabel = (status) => {
    if (status === "CANCELLED_STOCK_OUT")    return "Cancelled by store — Stock Out";
    if (status === "CANCELLED_TRX_MISMATCH") return "Cancelled by store — TrxID Mismatch";
    if (status === "CANCELLED")              return "Order cancelled";
    return null;
};

export default function Orders() {
    const { user, loading: userLoading } = useCurrentUser();
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '৳';

    const [orders,      setOrders]      = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [alert,       setAlert]       = useState(null);
    const [cancelModal,  setCancelModal]  = useState(null);
    const [cancelling,   setCancelling]   = useState(false);
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        if (userLoading) return;
        if (!user) { setLoading(false); return; }
        getUserOrders(user.uid)
            .then(data => setOrders(data || []))
            .catch(() => setAlert({ type: "error", message: "Failed to load orders." }))
            .finally(() => setLoading(false));
    }, [user, userLoading]);

    const formatDate = (val) => {
        if (!val) return '';
        try { const d = val?.toDate ? val.toDate() : new Date(val); return d.toDateString(); } catch { return ''; }
    };

    const handleCancelConfirm = async () => {
        if (!cancelModal) return;
        setCancelling(true);
        try {
            await updateDoc(doc(db, "orders", cancelModal.orderId), {
                status: "CANCELLED", cancelledBy: "customer", cancelledAt: new Date(),
            });
            setOrders(prev => prev.map(o => o.id === cancelModal.orderId ? { ...o, status: "CANCELLED" } : o));
            setAlert({ type: "success", message: "Order cancelled successfully." });
        } catch {
            setAlert({ type: "error", message: "Failed to cancel. Please try again." });
        } finally { setCancelling(false); setCancelModal(null); }
    };

    if (userLoading || loading) return <Loading />;

    if (!orders?.length) return (
        <>
            <style>{CSS}</style>
            <div className="ord-empty">
                <div className="ord-empty-card">
                    <div className="ord-empty-icon"><ShoppingBagIcon size={32} /></div>
                    <p className="ord-empty-title">No orders yet</p>
                    <p className="ord-empty-sub">Looks like you haven't placed any orders. Start shopping and your orders will appear here.</p>
                    <button className="ord-empty-btn" onClick={() => navigate('/shop')}>Start Shopping <ArrowRightIcon size={15} /></button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{CSS}</style>

            {/* ✅ Confirm modal */}
            {cancelModal && (
                <div className="ord-modal-overlay" onClick={() => !cancelling && setCancelModal(null)}>
                    <div className="ord-modal" onClick={e => e.stopPropagation()}>
                        <div className="ord-modal-icon">
                            <AlertCircleIcon size={24} />
                        </div>
                        <p className="ord-modal-title">Cancel this order?</p>
                        <p className="ord-modal-sub">This cannot be undone. Are you sure you want to cancel?</p>
                        <div className="ord-modal-btns">
                            {/* ✅ PlusApprove style buttons */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={cancelling}
                                onClick={() => setCancelModal(null)}
                                className="flex-1 rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-bold text-xs h-9"
                            >
                                Keep Order
                            </Button>
                            <Button
                                size="sm"
                                disabled={cancelling}
                                onClick={handleCancelConfirm}
                                className="flex-1 rounded-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs h-9 border-0 shadow-none"
                            >
                                {cancelling ? "Cancelling..." : "Yes, Cancel"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="ord-root">
                <div className="ord-inner">
                    <div className="ord-header">
                        <div>
                            <h1 className="ord-title">My <span>Orders</span></h1>
                            <p className="ord-sub">Track and manage your purchases</p>
                        </div>
                        <span className="ord-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
                    </div>

                    {alert && <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />}

                    {/* ── Desktop Table ── */}
                    <div className="ord-table-wrap">
                        <table className="ord-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Total</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const isCancelled = order.status?.startsWith("CANCELLED");
                                    const statusKey   = STATUS_MAP[order.status] || 'order_placed';
                                    const statusLabel = isCancelled ? "cancelled" : (order.status?.replace(/_/g, ' ').toLowerCase() || '—');
                                    const addr        = order.addressData || order.address || {};
                                    const addrName    = addr.name || (addr.firstName ? `${addr.firstName} ${addr.lastName || ''}`.trim() : '');
                                    const canCancel   = CANCELLABLE.includes(order.status);
                                    const cancelReason = getCancelReasonLabel(order.status);

                                    return (
                                        <tr key={order.id} className={isCancelled ? 'cancelled-row' : ''}>
                                            <td className="ord-td">
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                    {order.items?.map((item, i) => (
                                                        <div key={i} className="ord-prod-cell">
                                                            <div className="ord-prod-img-wrap">
                                                                <img src={item.image || item.images?.[0] || '/placeholder.png'} alt={item.name} />
                                                            </div>
                                                            <div>
                                                                <p className="ord-prod-name">{item.name || 'Product'}</p>
                                                                <VariantTags item={item} />
                                                                <p className="ord-prod-meta">{currency}{item.price || 0} · Qty {item.quantity || 0} · {formatDate(order.createdAt)}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {cancelReason && (
                                                        <span style={{ fontSize: '0.7rem', color: '#9f1239', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <AlertCircleIcon size={11} /> {cancelReason}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="ord-td-center">
                                                <span className="ord-total-val">{currency}{order.total ?? order.totalAmount ?? 0}</span>
                                            </td>
                                            <td className="ord-td-center">
                                                {addrName && (
                                                    <div>
                                                        <p className="ord-addr-name">{addrName}</p>
                                                        <p className="ord-addr-line">{[addr.city, addr.division].filter(Boolean).join(', ')}</p>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="ord-td-center">
                                                <span className={"ord-status " + statusKey}>
                                                    <span className="ord-status-dot" />{statusLabel}
                                                </span>
                                            </td>
                                            <td className="ord-td-center">
                                                {/* ✅ Desktop cancel button — PlusApprove style */}
                                                {canCancel ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setCancelModal({ orderId: order.id })}
                                                        className="rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 font-bold text-xs gap-1.5 px-4 h-8"
                                                    >
                                                        Cancel Order
                                                    </Button>
                                                ) : (
                                                    <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 500 }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile Cards ── */}
                    <div className="ord-mobile-list">
                        {orders.map(order => {
                            const isCancelled  = order.status?.startsWith("CANCELLED");
                            const statusKey    = STATUS_MAP[order.status] || 'order_placed';
                            const statusLabel  = isCancelled ? "cancelled" : (order.status?.replace(/_/g, ' ').toLowerCase() || '—');
                            const addr         = order.addressData || order.address || {};
                            const addrName     = addr.name || (addr.firstName ? `${addr.firstName} ${addr.lastName || ''}`.trim() : '');
                            const canCancel    = CANCELLABLE.includes(order.status);
                            const cancelReason = getCancelReasonLabel(order.status);
                            const isOpen       = expandedCard === order.id;

                            return (
                                <div key={order.id} className={`ord-card${isCancelled ? ' cancelled-card' : ''}`}>

                                    {/* ✅ Header row — always visible, click to expand */}
                                    <div className="ord-card-head-row" onClick={() => setExpandedCard(isOpen ? null : order.id)}>
                                        <div className="ord-card-head-left">
                                            <span className="ord-card-total" style={{ fontSize: '0.95rem' }}>{currency}{order.total ?? order.totalAmount ?? 0}</span>
                                            <span className={"ord-status " + statusKey}>
                                                <span className="ord-status-dot" />{statusLabel}
                                            </span>
                                            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className={`ord-card-chevron${isOpen ? ' open' : ''}`}>
                                            <ChevronDownIcon size={14} />
                                        </div>
                                    </div>

                                    {/* ✅ Expandable body */}
                                    {isOpen && (
                                        <div className="ord-card-body">
                                            {order.items?.map((item, i) => (
                                                <div key={i} className="ord-card-item">
                                                    <div className="ord-card-img">
                                                        <img src={item.image || item.images?.[0] || '/placeholder.png'} alt={item.name || 'Product'} />
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p className="ord-card-name">{item.name || 'Product'}</p>
                                                        <VariantTags item={item} />
                                                        <p className="ord-card-meta">{currency}{item.price || 0} · Qty: {item.quantity || 0}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {cancelReason && (
                                                <div className="ord-cancel-reason">
                                                    <AlertCircleIcon size={12} /> {cancelReason}
                                                </div>
                                            )}

                                            {addrName && (
                                                <div className="ord-card-addr">
                                                    <span className="ord-card-addr-name">{addrName}</span>
                                                    {(addr.street || addr.city) && (
                                                        <span className="ord-card-addr-row"><MapPinIcon size={11} />{[addr.street, addr.city, addr.division].filter(Boolean).join(', ')}</span>
                                                    )}
                                                    {addr.phone && <span className="ord-card-addr-row"><PhoneIcon size={11} />{addr.phone}</span>}
                                                </div>
                                            )}

                                            {canCancel && (
                                                <div style={{ padding: '10px 16px 14px' }}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setCancelModal({ orderId: order.id })}
                                                        className="rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 font-bold text-xs gap-1.5 px-4 h-8 w-full"
                                                    >
                                                        Cancel Order
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </>
    );
}