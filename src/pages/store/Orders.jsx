import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useFloatingToast } from "../../components/FloatingToastProvider";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { getStoreOrders, updateOrderStatus as updateStatus } from "../../lib/services/orderService";
import { PackageIcon, TagIcon, ChevronDownIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.so-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: so-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes so-fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.so-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
.so-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0; }
.so-title span { color: #0f172a; font-weight: 800; }
.so-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

/* ── Desktop Table ── */
.so-table-wrap { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; overflow-x: auto; }
.so-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; min-width: 650px; }
.so-table thead tr th { padding: 12px 16px; font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; background: #f8fafc; border-bottom: 1.5px solid #f1f5f9; }
.so-table tbody tr.so-main-row { border-bottom: 1.5px solid #f8fafc; cursor: pointer; transition: background 0.15s; }
.so-table tbody tr.so-main-row:hover { background: #f8fafc; }
.so-table tbody tr.so-main-row.expanded { background: #f0fdf4; border-bottom: none; }
.so-table tbody tr.so-detail-row td { padding: 0; border-bottom: 1.5px solid #f1f5f9; }
.so-table td { padding: 13px 16px; color: #475569; font-weight: 500; vertical-align: middle; }

.so-num { font-weight: 800; color: #16a34a; font-size: 0.8rem; }
.so-total-val { font-weight: 700; color: #0f172a; }
.so-customer { font-weight: 600; color: #0f172a; }
.so-customer-phone { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin-top: 2px; }
.so-coupon-badge { display: inline-flex; align-items: center; gap: 4px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 2px 8px; font-size: 0.72rem; font-weight: 700; color: #15803d; }
.so-pay-badge { display: inline-flex; align-items: center; gap: 4px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 2px 8px; font-size: 0.72rem; font-weight: 600; color: #475569; }
.so-status-select { padding: 6px 10px; border: 1.5px solid #f1f5f9; border-radius: 10px; font-size: 0.78rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; outline: none; cursor: pointer; transition: border-color 0.2s; }
.so-status-select:focus { border-color: #16a34a; }

.so-expand-btn { width: 26px; height: 26px; border-radius: 7px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s; flex-shrink: 0; cursor: pointer; }
.so-main-row.expanded .so-expand-btn { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: rotate(180deg); }

/* ── Detail panel ── */
.so-detail-panel {
    padding: 20px 24px 24px;
    background: #fafbfc;
    border-top: 1.5px solid #f1f5f9;
    animation: so-detailIn 0.22s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes so-detailIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

.so-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.so-detail-sec-label { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.so-detail-sec-label::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

.so-detail-info { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 7px; }
.so-detail-row { display: flex; gap: 8px; align-items: flex-start; font-size: 0.8rem; }
.so-detail-key { color: #94a3b8; font-weight: 600; font-size: 0.72rem; min-width: 70px; flex-shrink: 0; }
.so-detail-val { color: #0f172a; font-weight: 500; word-break: break-word; }

.so-detail-items { display: flex; flex-direction: column; gap: 8px; }
.so-detail-item { display: flex; align-items: center; gap: 12px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 10px 14px; }
.so-detail-item-img { width: 44px; height: 44px; border-radius: 10px; object-fit: contain; background: #f8fafc; border: 1.5px solid #f1f5f9; mix-blend-mode: multiply; flex-shrink: 0; }
.so-detail-item-name { font-size: 0.82rem; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
.so-detail-item-meta { font-size: 0.72rem; color: #94a3b8; }
.so-detail-item-price { margin-left: auto; font-size: 0.84rem; font-weight: 800; color: #0f172a; flex-shrink: 0; }

.so-detail-bottom { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-top: 16px; border-top: 1.5px solid #f1f5f9; flex-wrap: wrap; }
.so-detail-price-row { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: #64748b; flex-wrap: wrap; }
.so-detail-price-row strong { color: #0f172a; font-weight: 800; font-size: 0.95rem; }
.so-detail-price-sep { color: #cbd5e1; }
.so-detail-pay-row { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 8px 14px; font-size: 0.78rem; font-weight: 500; color: #475569; }

/* status badge */
.so-status { display: inline-flex; align-items: center; gap: 5px; border-radius: 100px; padding: 4px 10px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
.so-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.so-status.ORDER_PLACED  { background: #fef9c3; color: #854d0e; border: 1.5px solid #fde68a; }
.so-status.ORDER_PLACED .so-status-dot { background: #f59e0b; }
.so-status.PROCESSING    { background: #fef9c3; color: #854d0e; border: 1.5px solid #fde68a; }
.so-status.PROCESSING .so-status-dot { background: #f59e0b; }
.so-status.SHIPPED       { background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; }
.so-status.SHIPPED .so-status-dot { background: #3b82f6; }
.so-status.DELIVERED     { background: #f0fdf4; color: #15803d; border: 1.5px solid #bbf7d0; }
.so-status.DELIVERED .so-status-dot { background: #16a34a; }

/* ── Mobile Accordion ── */
.so-mobile-list { display: none; flex-direction: column; gap: 10px; }
.so-acc-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.so-acc-card.open { border-color: #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
.so-acc-head { display: flex; align-items: center; gap: 10px; padding: 14px; cursor: pointer; user-select: none; }
.so-acc-head-left { flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.so-acc-head-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.so-acc-total { font-size: 0.95rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
.so-acc-chevron { width: 28px; height: 28px; border-radius: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.22s; flex-shrink: 0; }
.so-acc-card.open .so-acc-chevron { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: rotate(180deg); }
.so-acc-body { padding: 14px 14px 16px; border-top: 1.5px solid #f8fafc; display: flex; flex-direction: column; gap: 12px; animation: so-accOpen 0.22s cubic-bezier(0.4,0,0.2,1) both; }
@keyframes so-accOpen { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
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
.so-acc-status-sel:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }

.so-empty { text-align: center; padding: 56px 20px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; color: #94a3b8; font-size: 0.85rem; }

@media (max-width: 768px) {
    .so-table-wrap { display: none; }
    .so-mobile-list { display: flex; }
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
const getPhone = (order) => {
    const a = order.address || order.addressData || {};
    return a.phone || "—";
};

export default function StoreOrders() {
    const { user } = useCurrentUser();
    const { showToast } = useFloatingToast();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null); // desktop
    const [openId, setOpenId] = useState(null);   // mobile
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '৳';

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                showToast("Please login to view orders", "warning");
                return;
            }

            try {
                const store = await getStoreByUser(user.uid);
                
                if (!store) {
                    setLoading(false);
                    showToast("No store found. Please create a store first", "warning");
                    return;
                }

                const ordersData = await getStoreOrders(store.id);
                setOrders(ordersData || []);

            } catch (err) {
                console.error("Error loading orders:", err);
                showToast("Failed to load orders. Please try again", "error");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, showToast]);

    const handleStatusChange = async (e, orderId) => {
        e.stopPropagation();
        const status = e.target.value;
        const oldStatus = orders.find(o => o.id === orderId)?.status;

        try {
            await updateStatus(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            
            // Status-specific messages
            const statusMessages = {
                ORDER_PLACED: "Order marked as placed",
                PROCESSING: "Order is now being processed",
                SHIPPED: "Order marked as shipped",
                DELIVERED: "Order marked as delivered"
            };
            
            showToast(statusMessages[status] || "Order status updated", "success");

        } catch (err) {
            console.error("Update error:", err);
            showToast("Failed to update order status. Check Firestore permissions", "error");
            // Revert status on error
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: oldStatus } : o));
        }
    };

    const formatDate = (val) => {
        if (!val) return "—";
        try {
            const d = val?.toDate ? val.toDate() : new Date(val);
            return d.toLocaleDateString("en-BD", { day: "2-digit", month: "short", year: "numeric" });
        } catch {
            return "—";
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="so-root">

                <div className="so-header">
                    <h1 className="so-title">Store <span>Orders</span></h1>
                    {orders.length > 0 && <span className="so-count">{orders.length} orders</span>}
                </div>

                {orders.length === 0 ? (
                    <div className="so-empty">
                        <PackageIcon size={32} style={{ margin: '0 auto 10px', color: '#e2e8f0', display: 'block' }} />
                        <p>No orders yet.</p>
                    </div>
                ) : (
                    <>
                        {/* ── Desktop Table with expandable rows ── */}
                        <div className="so-table-wrap">
                            <table className="so-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Customer</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Payment</th>
                                        <th>Coupon</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => {
                                        const isExp = expandedId === order.id;
                                        return (
                                            <React.Fragment key={order.id}>
                                                <tr
                                                    className={"so-main-row" + (isExp ? " expanded" : "")}
                                                    onClick={() => setExpandedId(isExp ? null : order.id)}
                                                >
                                                    <td><span className="so-num">{i + 1}</span></td>
                                                    <td>
                                                        <div className="so-customer">{getCustomerName(order)}</div>
                                                        <div className="so-customer-phone">{getPhone(order)}</div>
                                                    </td>
                                                    <td style={{ color: '#64748b' }}>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</td>
                                                    <td><span className="so-total-val">{currency}{order.total ?? order.totalAmount ?? 0}</span></td>
                                                    <td><span className="so-pay-badge">{order.paymentMethod || 'COD'}</span></td>
                                                    <td>
                                                        {order.isCouponUsed
                                                            ? <span className="so-coupon-badge"><TagIcon size={9} />{order.coupon?.code}</span>
                                                            : <span style={{ color: '#e2e8f0' }}>—</span>
                                                        }
                                                    </td>
                                                    <td onClick={e => e.stopPropagation()}>
                                                        <select
                                                            className="so-status-select"
                                                            value={order.status || 'ORDER_PLACED'}
                                                            onChange={e => handleStatusChange(e, order.id)}
                                                        >
                                                            {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                                        </select>
                                                    </td>
                                                    <td style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatDate(order.createdAt)}</td>
                                                    <td>
                                                        <div className="so-expand-btn">
                                                            <ChevronDownIcon size={13} />
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded detail row */}
                                                {isExp && (
                                                    <tr className="so-detail-row">
                                                        <td colSpan={9}>
                                                            <div className="so-detail-panel">

                                                                <div className="so-detail-grid">
                                                                    {/* Customer info */}
                                                                    <div>
                                                                        <p className="so-detail-sec-label">Customer Info</p>
                                                                        <div className="so-detail-info">
                                                                            <div className="so-detail-row">
                                                                                <span className="so-detail-key">Name</span>
                                                                                <span className="so-detail-val">{getCustomerName(order)}</span>
                                                                            </div>
                                                                            <div className="so-detail-row">
                                                                                <span className="so-detail-key">Phone</span>
                                                                                <span className="so-detail-val">{getPhone(order)}</span>
                                                                            </div>
                                                                            <div className="so-detail-row">
                                                                                <span className="so-detail-key">Address</span>
                                                                                <span className="so-detail-val">{getAddress(order)}</span>
                                                                            </div>
                                                                            {(order.address?.email || order.userEmail) && (
                                                                                <div className="so-detail-row">
                                                                                    <span className="so-detail-key">Email</span>
                                                                                    <span className="so-detail-val">{order.address?.email || order.userEmail}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {/* Payment info */}
                                                                    <div>
                                                                        <p className="so-detail-sec-label">Payment Info</p>
                                                                        <div className="so-detail-info">
                                                                            <div className="so-detail-row">
                                                                                <span className="so-detail-key">Method</span>
                                                                                <span className="so-detail-val">{order.paymentMethod || 'COD'}</span>
                                                                            </div>
                                                                            {order.paymentDetails?.senderNumber && (
                                                                                <div className="so-detail-row">
                                                                                    <span className="so-detail-key">Sender</span>
                                                                                    <span className="so-detail-val">{order.paymentDetails.senderNumber}</span>
                                                                                </div>
                                                                            )}
                                                                            {order.paymentDetails?.txId && (
                                                                                <div className="so-detail-row">
                                                                                    <span className="so-detail-key">TxID</span>
                                                                                    <span className="so-detail-val" style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '1px 6px', borderRadius: 5 }}>{order.paymentDetails.txId}</span>
                                                                                </div>
                                                                            )}
                                                                            <div className="so-detail-row">
                                                                                <span className="so-detail-key">Subtotal</span>
                                                                                <span className="so-detail-val">{currency}{order.subtotal || 0}</span>
                                                                            </div>
                                                                            {order.shippingFee > 0 && (
                                                                                <div className="so-detail-row">
                                                                                    <span className="so-detail-key">Shipping</span>
                                                                                    <span className="so-detail-val">{currency}{order.shippingFee}</span>
                                                                                </div>
                                                                            )}
                                                                            {order.discountAmount > 0 && (
                                                                                <div className="so-detail-row">
                                                                                    <span className="so-detail-key">Discount</span>
                                                                                    <span className="so-detail-val" style={{ color: '#ef4444', fontWeight: 700 }}>-{currency}{order.discountAmount}</span>
                                                                                </div>
                                                                            )}
                                                                            <div className="so-detail-row">
                                                                                <span className="so-detail-key">Total</span>
                                                                                <span className="so-detail-val" style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{currency}{order.total ?? order.totalAmount ?? 0}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Products */}
                                                                <p className="so-detail-sec-label">Products</p>
                                                                <div className="so-detail-items">
                                                                    {order.items?.map((item, j) => (
                                                                        <div key={`${order.id}-item-${j}`} className="so-detail-item">
                                                                            <img src={item.image || item.images?.[0] || '/placeholder.png'} alt={item.name || 'Product'} className="so-detail-item-img" />
                                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                                <p className="so-detail-item-name">{item.name || 'Product'}</p>
                                                                                <p className="so-detail-item-meta">Qty: {item.quantity || 0} · {currency}{item.price || 0}</p>
                                                                            </div>
                                                                            <span className="so-detail-item-price">{currency}{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Mobile Accordion ── */}
                        <div className="so-mobile-list">
                            {orders.map((order) => {
                                const isOpen = openId === order.id;
                                const statusClass = order.status || "ORDER_PLACED";
                                return (
                                    <div key={order.id} className={"so-acc-card" + (isOpen ? " open" : "")}>
                                        <div className="so-acc-head" onClick={() => setOpenId(isOpen ? null : order.id)}>
                                            <div className="so-acc-head-left">
                                                <span className={"so-status " + statusClass}>
                                                    <span className="so-status-dot" />
                                                    {order.status?.replace(/_/g, ' ') || 'Order Placed'}
                                                </span>
                                                <span className="so-pay-badge">{order.paymentMethod || 'COD'}</span>
                                                <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 400 }}>{formatDate(order.createdAt)}</span>
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
                                                        {(order.address?.email || order.userEmail) && (
                                                            <div className="so-acc-info-row"><span className="so-acc-info-key">Email</span><span className="so-acc-info-val">{order.address?.email || order.userEmail}</span></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="so-acc-sec">Products</p>
                                                    {order.items?.map((item, j) => (
                                                        <div key={`${order.id}-mobile-item-${j}`} className="so-acc-item">
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
                                                        {order.paymentMethod === "COD"
                                                            ? "Cash on Delivery — collect payment on delivery"
                                                            : `${order.paymentMethod || 'Payment'}${order.paymentDetails?.txId ? ` · TxID: ${order.paymentDetails.txId}` : ''}`
                                                        }
                                                    </div>
                                                    <select
                                                        className="so-acc-status-sel"
                                                        value={order.status || 'ORDER_PLACED'}
                                                        onChange={e => handleStatusChange(e, order.id)}
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        {STATUS_OPTS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}