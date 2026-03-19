import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { getStoreOrders, updateOrderStatus as updateStatus } from "../../lib/services/orderService";
import { PackageIcon, TagIcon, ChevronDownIcon, UserIcon, CreditCardIcon, ShoppingBagIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.so-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

.so-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
.so-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 3px; }
.so-subtitle { font-size: 0.82rem; color: #94a3b8; margin: 0; font-weight: 400; }
.so-title span { color: #0f172a; font-weight: 800; }
.so-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

/* ── Alert ── */
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

/* ── Status Badge ── */
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

.so-pay-badge { display: inline-flex; align-items: center; gap: 4px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 2px 8px; font-size: 0.68rem; font-weight: 600; color: #475569; }
.so-coupon-badge { display: inline-flex; align-items: center; gap: 4px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 2px 8px; font-size: 0.68rem; font-weight: 700; color: #15803d; }

/* ══════════════════════════════════
   DESKTOP CARD LIST
══════════════════════════════════ */
.so-desktop-list { display: flex; flex-direction: column; gap: 10px; }

.so-order-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; transition: border-color 0.2s; }
.so-order-card:hover { border-color: #e2e8f0; }
.so-order-card.open  { border-color: #bbf7d0; }

/* Header row — always visible */
.so-card-head {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 18px; cursor: pointer; user-select: none;
}

.so-card-num {
    font-size: 0.75rem; font-weight: 800; color: #16a34a;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 8px; width: 28px; height: 28px; min-width: 28px;
    display: flex; align-items: center; justify-content: center;
}
.so-card-main { flex: 1; min-width: 0; }
.so-card-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 3px; }
.so-card-meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.so-card-phone { font-size: 0.7rem; color: #94a3b8; }
.so-card-sep   { color: #e2e8f0; font-size: 0.7rem; }
.so-card-date  { font-size: 0.7rem; color: #94a3b8; }

.so-card-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.so-card-total-val { font-size: 0.95rem; font-weight: 800; color: #0f172a; white-space: nowrap; }
.so-card-items { font-size: 0.72rem; font-weight: 600; color: #64748b; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 8px; padding: 3px 9px; white-space: nowrap; }

.so-card-select {
    padding: 6px 10px; border: 1.5px solid #f1f5f9; border-radius: 10px;
    font-size: 0.75rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; color: #0f172a; outline: none; cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.so-card-select:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }

.so-card-chevron { width: 28px; height: 28px; min-width: 28px; border-radius: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s; }
.so-order-card.open .so-card-chevron { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: rotate(180deg); }

/* Expanded body — 3 column grid */
.so-card-body {
    border-top: 1.5px solid #f1f5f9;
    padding: 18px;
    display: grid;
    grid-template-columns: 1fr 1fr 1.5fr;
    gap: 14px;
    background: #fafbfc;
}

.so-info-block { display: flex; flex-direction: column; }
.so-info-label {
    font-size: 0.6rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.12em;
    display: flex; align-items: center; gap: 5px;
    margin-bottom: 8px;
}
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

/* Products */
.so-prod-list { display: flex; flex-direction: column; gap: 7px; }
.so-prod-item { display: flex; align-items: center; gap: 10px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 10px; padding: 9px 12px; }
.so-prod-img { width: 38px; height: 38px; border-radius: 8px; object-fit: contain; background: #f8fafc; border: 1.5px solid #f1f5f9; mix-blend-mode: multiply; flex-shrink: 0; }
.so-prod-name { font-size: 0.78rem; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
.so-prod-meta { font-size: 0.68rem; color: #94a3b8; }
.so-prod-price { margin-left: auto; font-size: 0.8rem; font-weight: 800; color: #0f172a; flex-shrink: 0; white-space: nowrap; padding-left: 10px; }

/* ══════════════════════════════════
   MOBILE ACCORDION (unchanged)
══════════════════════════════════ */
.so-mobile-list { display: none; flex-direction: column; gap: 10px; }
.so-acc-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; transition: border-color 0.2s; }
.so-acc-card.open { border-color: #e2e8f0; }
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
.so-acc-item { display: flex; align-items: center; gap: 10px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 10px 12px; margin-bottom: 6px; }
.so-acc-item:last-child { margin-bottom: 0; }
.so-acc-item-img { width: 44px; height: 44px; border-radius: 10px; object-fit: contain; background: #fff; border: 1.5px solid #f1f5f9; mix-blend-mode: multiply; flex-shrink: 0; }
.so-acc-item-name { font-size: 0.8rem; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
.so-acc-item-meta { font-size: 0.7rem; color: #94a3b8; }
.so-acc-item-price { margin-left: auto; font-size: 0.82rem; font-weight: 800; color: #0f172a; flex-shrink: 0; }
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
}
`;

const STATUS_OPTS = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];

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

export default function StoreOrders() {
    const { user, loading: userLoading } = useCurrentUser();
    const [orders, setOrders]         = useState([]);
    const [loading, setLoading]       = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [openId, setOpenId]         = useState(null);
    const [alert, setAlert]           = useState(null);
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '৳';

    const showAlert  = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    useEffect(() => {
        if (userLoading) return;
        const fetchData = async () => {
            if (!user) { setLoading(false); showAlert("warning", "Please login to view orders."); return; }
            try {
                const store = await getStoreByUser(user.uid);
                if (!store) { setLoading(false); showAlert("warning", "No store found. Please create a store first."); return; }
                const data = await getStoreOrders(store.id);
                setOrders(data || []);
            } catch (err) {
                console.error(err);
                showAlert("error", "Failed to load orders. Please try again.");
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
            const msgs = { ORDER_PLACED: "Order marked as placed.", PROCESSING: "Order is now being processed.", SHIPPED: "Order marked as shipped.", DELIVERED: "Order marked as delivered." };
            showAlert("success", msgs[status] || "Status updated.");
        } catch (err) {
            showAlert("error", "Failed to update status.");
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: old } : o));
        }
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
                            const isOpen = expandedId === order.id;
                            const sc = order.status || "ORDER_PLACED";
                            return (
                                <div key={order.id} className={"so-order-card" + (isOpen ? " open" : "")}>

                                    {/* Header */}
                                    <div className="so-card-head" onClick={() => setExpandedId(isOpen ? null : order.id)}>
                                        <div className="so-card-num">{i + 1}</div>

                                        <div className="so-card-main">
                                            <div className="so-card-name">{getCustomerName(order)}</div>
                                            <div className="so-card-meta">
                                                <span className="so-card-phone">{getPhone(order)}</span>
                                                <span className="so-card-sep">·</span>
                                                <span className="so-card-date">{formatDate(order.createdAt)}</span>
                                                <span className={"so-badge " + sc}><span className="so-badge-dot" />{sc.replace(/_/g, ' ')}</span>
                                                {order.isCouponUsed && <span className="so-coupon-badge"><TagIcon size={9} />{order.coupon?.code}</span>}
                                            </div>
                                        </div>

                                        <div className="so-card-right">
                                            <span className="so-card-items">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                                            <span className="so-pay-badge">{order.paymentMethod || 'COD'}</span>
                                            <span className="so-card-total-val">{currency}{(order.total ?? order.totalAmount ?? 0).toLocaleString()}</span>
                                            <select className="so-card-select" value={order.status || 'ORDER_PLACED'} onChange={e => handleStatusChange(e, order.id)} onClick={e => e.stopPropagation()}>
                                                {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                            </select>
                                            <div className="so-card-chevron"><ChevronDownIcon size={14} /></div>
                                        </div>
                                    </div>

                                    {/* Expanded body */}
                                    {isOpen && (
                                        <div className="so-card-body">

                                            {/* Customer */}
                                            <div className="so-info-block">
                                                <div className="so-info-label"><UserIcon size={11} /> Customer Info</div>
                                                <div className="so-info-card">
                                                    <div className="so-info-row"><span className="so-info-key">Name</span><span className="so-info-val">{getCustomerName(order)}</span></div>
                                                    <div className="so-info-row"><span className="so-info-key">Phone</span><span className="so-info-val">{getPhone(order)}</span></div>
                                                    <div className="so-info-row"><span className="so-info-key">Address</span><span className="so-info-val">{getAddress(order)}</span></div>
                                                    {(order.address?.email || order.userEmail) && (
                                                        <div className="so-info-row"><span className="so-info-key">Email</span><span className="so-info-val">{order.address?.email || order.userEmail}</span></div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment */}
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
                                                    <div className="so-info-total">
                                                        <span className="so-info-total-label">Total</span>
                                                        <span className="so-info-total-val">{currency}{(order.total ?? order.totalAmount ?? 0).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Products */}
                                            <div className="so-info-block">
                                                <div className="so-info-label"><ShoppingBagIcon size={11} /> Products</div>
                                                <div className="so-prod-list">
                                                    {order.items?.map((item, j) => (
                                                        <div key={`${order.id}-${j}`} className="so-prod-item">
                                                            <img src={item.image || item.images?.[0] || '/placeholder.png'} alt={item.name || 'Product'} className="so-prod-img" />
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <p className="so-prod-name">{item.name || 'Product'}</p>
                                                                <p className="so-prod-meta">Qty: {item.quantity || 0} &nbsp;·&nbsp; {currency}{item.price || 0} each</p>
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
                            const isOpen = openId === order.id;
                            const sc = order.status || "ORDER_PLACED";
                            return (
                                <div key={order.id} className={"so-acc-card" + (isOpen ? " open" : "")}>
                                    <div className="so-acc-head" onClick={() => setOpenId(isOpen ? null : order.id)}>
                                        <div className="so-acc-head-left">
                                            <span className={"so-badge " + sc}><span className="so-badge-dot" />{sc.replace(/_/g, ' ')}</span>
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
                                                        <img src={item.image || item.images?.[0] || '/placeholder.png'} alt={item.name || 'Product'} className="so-acc-item-img" />
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <p className="so-acc-item-name">{item.name || 'Product'}</p>
                                                            <p className="so-acc-item-meta">Qty: {item.quantity || 0} · {currency}{item.price || 0}</p>
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
                                                <select className="so-acc-status-sel" value={order.status || 'ORDER_PLACED'} onChange={e => handleStatusChange(e, order.id)} onClick={e => e.stopPropagation()}>
                                                    {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                                </select>
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