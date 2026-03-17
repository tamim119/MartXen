import { useEffect, useState } from "react";
import OrderItem from "../components/OrderItem";
import { useCurrentUser } from "../hooks/useAuth";
import { useFloatingToast } from "../components/FloatingToastProvider";
import { getUserOrders } from "../lib/services/orderService";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon, ArrowRightIcon, MapPinIcon, PhoneIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ord-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 70vh;
    padding: 0 24px;
    animation: ord-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes ord-fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
}
.ord-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 40px 0 80px;
}

/* ── Header ── */
.ord-header {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 24px; gap: 12px;
    animation: ord-fadeUp 0.5s 0.06s cubic-bezier(0.4,0,0.2,1) both;
}
.ord-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.ord-title span { color: #0f172a; font-weight: 800; }
.ord-sub { font-size: 0.78rem; color: #94a3b8; margin: 0; font-weight: 400; }
.ord-count {
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    color: #16a34a; font-size: 0.72rem; font-weight: 700;
    padding: 4px 12px; border-radius: 100px;
    flex-shrink: 0; white-space: nowrap;
}

/* ── Desktop Table ── */
.ord-table-wrap {
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 20px; overflow: hidden; overflow-x: auto;
    animation: ord-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
.ord-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; min-width: 560px; }
.ord-table thead tr th {
    padding: 13px 18px; font-size: 0.68rem; font-weight: 700;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;
    background: #f8fafc; border-bottom: 1.5px solid #f1f5f9;
}
.ord-table thead tr th:first-child { text-align: left; }
.ord-table thead tr th:not(:first-child) { text-align: center; }
.ord-table tbody tr {
    border-bottom: 1.5px solid #f8fafc; transition: background 0.15s;
    animation: ord-fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
.ord-table tbody tr:last-child { border-bottom: none; }
.ord-table tbody tr:hover { background: #f8fafc; }
.ord-table tbody tr:nth-child(1) { animation-delay: 0.1s; }
.ord-table tbody tr:nth-child(2) { animation-delay: 0.14s; }
.ord-table tbody tr:nth-child(3) { animation-delay: 0.18s; }
.ord-table tbody tr:nth-child(n+4) { animation-delay: 0.22s; }

/* ── Mobile list ── */
.ord-mobile-list {
    display: none; flex-direction: column; gap: 10px;
    animation: ord-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}

/* ── Mobile card ── */
.ord-card {
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 18px; overflow: hidden;
    animation: ord-fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
    transition: border-color 0.18s, box-shadow 0.18s;
}
.ord-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.05); }

/* Card items */
.ord-card-item {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; border-bottom: 1.5px solid #f8fafc;
}
.ord-card-item:last-of-type { border-bottom: none; }
.ord-card-img {
    width: 50px; height: 50px; border-radius: 12px;
    background: #f8fafc; border: 1.5px solid #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; overflow: hidden;
}
.ord-card-img img { width: 36px; height: 36px; object-fit: contain; mix-blend-mode: multiply; }
.ord-card-name { font-size: 0.84rem; font-weight: 600; color: #0f172a; margin: 0 0 3px; line-height: 1.3; }
.ord-card-meta { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin: 0; }

/* Card footer */
.ord-card-footer {
    padding: 12px 16px;
    border-top: 1.5px solid #f8fafc;
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.ord-card-total { font-size: 1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }

/* Status badge */
.ord-status {
    display: inline-flex; align-items: center; gap: 5px;
    border-radius: 100px; padding: 4px 10px;
    font-size: 0.7rem; font-weight: 700; white-space: nowrap;
}
.ord-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.ord-status.processing   { background: #fef9c3; color: #854d0e; border: 1.5px solid #fde68a; }
.ord-status.processing .ord-status-dot   { background: #f59e0b; }
.ord-status.delivered    { background: #f0fdf4; color: #15803d; border: 1.5px solid #bbf7d0; }
.ord-status.delivered .ord-status-dot    { background: #16a34a; }
.ord-status.shipped      { background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; }
.ord-status.shipped .ord-status-dot      { background: #3b82f6; }
.ord-status.order_placed { background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0; }
.ord-status.order_placed .ord-status-dot { background: #94a3b8; }

/* Card address row */
.ord-card-addr {
    padding: 10px 16px 14px;
    border-top: 1.5px solid #f8fafc;
    display: flex; flex-direction: column; gap: 3px;
}
.ord-card-addr-name { font-size: 0.78rem; font-weight: 700; color: #475569; }
.ord-card-addr-row  { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: #94a3b8; }
.ord-card-addr-row svg { flex-shrink: 0; }

/* ── Empty state ── */
.ord-empty {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 80vh; display: flex;
    align-items: center; justify-content: center;
    padding: 24px;
    animation: ord-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
.ord-empty-card {
    text-align: center; padding: 56px 48px; background: #fff;
    border: 1.5px solid #f1f5f9; border-radius: 28px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.05);
    max-width: 360px; width: 100%;
}
.ord-empty-icon {
    width: 76px; height: 76px; border-radius: 50%;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; color: #cbd5e1;
}
.ord-empty-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.3px; }
.ord-empty-sub   { font-size: 0.825rem; color: #94a3b8; margin: 0 0 28px; line-height: 1.65; font-weight: 400; }
.ord-empty-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; background: #16a34a; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 100px; cursor: pointer;
    transition: all 0.22s; box-shadow: 0 4px 16px rgba(22,163,74,0.32);
}
.ord-empty-btn:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(22,163,74,0.4); }
.ord-empty-btn:active { transform: scale(0.97); }

/* ── Responsive ── */
@media (max-width: 640px) {
    .ord-root        { padding: 0 14px; }
    .ord-inner       { padding: 28px 0 60px; }
    .ord-title       { font-size: 1.25rem; }
    .ord-table-wrap  { display: none; }
    .ord-mobile-list { display: flex; }
    .ord-empty-card  { padding: 40px 24px; }
}
@media (max-width: 480px) { .ord-root { padding: 0 12px; } }
`;

const STATUS_MAP = {
    PROCESSING:   'processing',
    DELIVERED:    'delivered',
    SHIPPED:      'shipped',
    ORDER_PLACED: 'order_placed',
};

export default function Orders() {
    const { user } = useCurrentUser();
    const { showToast } = useFloatingToast();
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '৳';

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            
            try {
                const data = await getUserOrders(user.uid);
                setOrders(data || []);
                
                if (data && data.length > 0) {
                    console.log(`Loaded ${data.length} orders`);
                }
            } catch (err) { 
                console.error("Error fetching orders:", err);
                showToast("Failed to load orders. Please try again.", "error");
                setOrders([]);
            } finally { 
                setLoading(false); 
            }
        };
        
        fetchOrders();
    }, [user, showToast]);

    const formatDate = (val) => {
        if (!val) return '';
        try {
            const d = val?.toDate ? val.toDate() : new Date(val);
            return d.toDateString();
        } catch { 
            return ''; 
        }
    };

    if (loading) return <Loading />;

    if (!orders || orders.length === 0) return (
        <>
            <style>{CSS}</style>
            <div className="ord-empty">
                <div className="ord-empty-card">
                    <div className="ord-empty-icon"><ShoppingBagIcon size={32} /></div>
                    <p className="ord-empty-title">No orders yet</p>
                    <p className="ord-empty-sub">
                        Looks like you haven't placed any orders. Start shopping and your orders will appear here.
                    </p>
                    <button className="ord-empty-btn" onClick={() => navigate('/shop')}>
                        Start Shopping <ArrowRightIcon size={15} />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="ord-root">
                <div className="ord-inner">

                    {/* Header */}
                    <div className="ord-header">
                        <div>
                            <h1 className="ord-title">My <span>Orders</span></h1>
                            <p className="ord-sub">Track and manage your purchases</p>
                        </div>
                        <span className="ord-count">
                            {orders.length} order{orders.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Desktop Table */}
                    <div className="ord-table-wrap">
                        <table className="ord-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Total Price</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <OrderItem order={order} key={order.id} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="ord-mobile-list">
                        {orders.map(order => {
                            const statusClass = STATUS_MAP[order.status] || 'order_placed';
                            const statusLabel = order.status?.replace(/_/g, ' ').toLowerCase() || '—';
                            const addr = order.addressData || order.address || {};
                            
                            // Get name from addressData
                            const addrName = addr.name || (addr.firstName && addr.lastName 
                                ? `${addr.firstName} ${addr.lastName}` 
                                : addr.firstName || '');

                            return (
                                <div key={order.id} className="ord-card">

                                    {/* Product items */}
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="ord-card-item">
                                            <div className="ord-card-img">
                                                <img 
                                                    src={item.image || item.images?.[0] || '/placeholder.png'} 
                                                    alt={item.name || 'Product'} 
                                                />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p className="ord-card-name">{item.name || 'Product'}</p>
                                                <p className="ord-card-meta">
                                                    {currency}{item.price || 0} · Qty: {item.quantity || 0} · {formatDate(order.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Address */}
                                    {addrName && (
                                        <div className="ord-card-addr">
                                            <span className="ord-card-addr-name">{addrName}</span>
                                            {(addr.street || addr.city) && (
                                                <span className="ord-card-addr-row">
                                                    <MapPinIcon size={11} />
                                                    {[
                                                        addr.street, 
                                                        addr.city, 
                                                        addr.division || addr.state
                                                    ].filter(Boolean).join(', ')}
                                                </span>
                                            )}
                                            {addr.phone && (
                                                <span className="ord-card-addr-row">
                                                    <PhoneIcon size={11} />
                                                    {addr.phone}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer: total + status */}
                                    <div className="ord-card-footer">
                                        <span className="ord-card-total">
                                            {currency}{order.total ?? order.totalAmount ?? 0}
                                        </span>
                                        <span className={"ord-status " + statusClass}>
                                            <span className="ord-status-dot" />
                                            {statusLabel}
                                        </span>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </>
    );
}