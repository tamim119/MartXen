import { useSelector } from "react-redux";
import { MapPinIcon, PhoneIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Status badge ── */
.oi-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 100px;
    padding: 4px 11px;
    font-size: 0.7rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    text-transform: capitalize;
    letter-spacing: 0.2px;
    white-space: nowrap;
}
.oi-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}
.oi-status.processing {
    background: #fefce8;
    border: 1.5px solid #fde68a;
    color: #854d0e;
}
.oi-status.processing .oi-status-dot {
    background: #f59e0b;
    box-shadow: 0 0 5px rgba(245,158,11,0.5);
}
.oi-status.delivered {
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    color: #15803d;
}
.oi-status.delivered .oi-status-dot {
    background: #16a34a;
    box-shadow: 0 0 5px rgba(22,163,74,0.5);
}
.oi-status.shipped {
    background: #eff6ff;
    border: 1.5px solid #bfdbfe;
    color: #1d4ed8;
}
.oi-status.shipped .oi-status-dot {
    background: #3b82f6;
    box-shadow: 0 0 5px rgba(59,130,246,0.4);
}
.oi-status.order_placed {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    color: #64748b;
}
.oi-status.order_placed .oi-status-dot { background: #94a3b8; }

/* ── Product cell ── */
.oi-product-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
}
.oi-img-wrap {
    width: 56px; height: 56px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
}
.oi-img-wrap img {
    width: 42px; height: 42px;
    object-fit: contain;
    mix-blend-mode: multiply;
}
.oi-product-name {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 3px;
    line-height: 1.3;
}
.oi-product-meta {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.75rem;
    color: #94a3b8;
    font-weight: 400;
    margin-bottom: 6px;
}

/* ── Total cell ── */
.oi-total {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 800;
    color: #0f172a;
    text-align: center;
    padding: 16px 18px;
    letter-spacing: -0.3px;
}

/* ── Address cell ── */
.oi-address {
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 16px 18px;
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 400;
    line-height: 1.65;
}
.oi-address-name {
    font-weight: 700;
    color: #0f172a;
    font-size: 0.82rem;
    margin-bottom: 3px;
}
.oi-address-row {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #94a3b8;
    font-size: 0.75rem;
    margin-top: 2px;
}
.oi-address-row svg { flex-shrink: 0; }

/* ── Status cell ── */
.oi-status-cell {
    padding: 16px 18px;
    text-align: center;
}

/* ── Mobile card ── */
.oi-mobile-row td {
    padding: 0 16px 16px;
}
.oi-mobile-card {
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 14px;
    padding: 14px 16px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.78rem;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}
.oi-mobile-addr { flex: 1; line-height: 1.6; min-width: 0; }
`;

const STATUS_MAP = {
    PROCESSING:   'processing',
    DELIVERED:    'delivered',
    SHIPPED:      'shipped',
    ORDER_PLACED: 'order_placed',
};

const OrderItem = ({ order }) => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

    const formatDate = (val) => {
        try {
            const d = val?.toDate ? val.toDate() : new Date(val);
            return d.toDateString();
        } catch { 
            return ''; 
        }
    };

    const statusClass = STATUS_MAP[order.status] || 'order_placed';
    const statusLabel = order.status?.replace(/_/g, ' ').toLowerCase() || '—';

    return (
        <>
            <style>{CSS}</style>

            {/* Main row */}
            <tr>
                {/* Product(s) */}
                <td style={{ verticalAlign: 'top' }}>
                    {order.items?.map((item, index) => (
                        <div key={index} className="oi-product-cell" style={{
                            borderBottom: index < order.items.length - 1 ? '1.5px solid #f8fafc' : 'none'
                        }}>
                            <div className="oi-img-wrap">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div>
                                <p className="oi-product-name">{item.name}</p>
                                <p className="oi-product-meta">
                                    {currency}{item.price} &nbsp;·&nbsp; Qty: {item.quantity} &nbsp;·&nbsp; {formatDate(order.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))}
                </td>

                {/* Total */}
                <td className="oi-total hide-mobile" style={{ verticalAlign: 'middle' }}>
                    {currency}{order.total}
                </td>

                {/* Address */}
                <td className="hide-mobile" style={{ verticalAlign: 'middle' }}>
                    {order.addressData ? (
                        <div className="oi-address">
                            <p className="oi-address-name">{order.addressData.name || `${order.addressData.firstName} ${order.addressData.lastName}`}</p>
                            <div className="oi-address-row">
                                <MapPinIcon size={11} />
                                {order.addressData.street}, {order.addressData.city}, {order.addressData.division || order.addressData.state} {order.addressData.zip || ''}, {order.addressData.country || 'Bangladesh'}
                            </div>
                            <div className="oi-address-row">
                                <PhoneIcon size={11} />
                                {order.addressData.phone}
                            </div>
                        </div>
                    ) : (
                        <div className="oi-address" style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>
                            Address not available
                        </div>
                    )}
                </td>

                {/* Status */}
                <td className="oi-status-cell" style={{ verticalAlign: 'middle' }}>
                    <span className={`oi-status ${statusClass}`}>
                        <span className="oi-status-dot" />
                        {statusLabel}
                    </span>
                </td>
            </tr>

            {/* Mobile address + status row */}
            <tr className="oi-mobile-row md:hidden">
                <td colSpan={4}>
                    <div className="oi-mobile-card">
                        {order.addressData && (
                            <div className="oi-mobile-addr">
                                <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                    {order.addressData.name || `${order.addressData.firstName} ${order.addressData.lastName}`}
                                </span>
                                {' — '}{order.addressData.city}, {order.addressData.country || 'Bangladesh'}
                            </div>
                        )}
                        <span className={`oi-status ${statusClass}`}>
                            <span className="oi-status-dot" />
                            {statusLabel}
                        </span>
                    </div>
                </td>
            </tr>
        </>
    );
};

export default OrderItem;