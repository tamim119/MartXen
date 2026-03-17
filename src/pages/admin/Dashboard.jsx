import Loading from "../../components/Loading";
import OrdersAreaChart from "../../components/OrdersAreaChart";
import {
    CircleDollarSignIcon, ShoppingBasketIcon,
    StoreIcon, TagsIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllOrders } from "../../lib/services/orderService";
import { getAllStores } from "../../lib/services/storeService";
import { getAllProducts } from "../../lib/services/productService";
import { getPricing } from "../../lib/services/pricingService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.adash-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: adash-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes adash-fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
}

/* ── Page title ── */
.adash-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 24px;
    animation: adash-fadeUp 0.45s 0.04s cubic-bezier(0.4,0,0.2,1) both;
}
.adash-title span {
    color: #0f172a;
    font-weight: 800;
}

/* ── Stats grid ── */
.adash-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 28px;
    animation: adash-fadeUp 0.5s 0.08s cubic-bezier(0.4,0,0.2,1) both;
}
@media (min-width: 640px) {
    .adash-stats { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
    .adash-stats { grid-template-columns: repeat(4, 1fr); }
}

.adash-stat-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 18px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
}
.adash-stat-card:hover {
    border-color: #e2e8f0;
    box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    transform: translateY(-2px);
}
.adash-stat-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
}
.adash-stat-val {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
    line-height: 1;
}
.adash-stat-icon {
    width: 44px; height: 44px;
    border-radius: 14px;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #94a3b8;
    transition: background 0.18s, border-color 0.18s, color 0.18s;
}
.adash-stat-card:hover .adash-stat-icon {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
}

/* ── Chart section ── */
.adash-chart-section {
    animation: adash-fadeUp 0.5s 0.14s cubic-bezier(0.4,0,0.2,1) both;
}

.adash-chart-wrap {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 22px 22px 12px;
}

.adash-chart-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 4px;
    flex-wrap: wrap;
    gap: 8px;
}

.adash-chart-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 2px;
}
.adash-chart-sublabel {
    font-size: 0.72rem;
    color: #94a3b8;
    margin-bottom: 16px;
}

/* ── Responsive tweaks ── */
@media (max-width: 480px) {
    .adash-title { font-size: 1.2rem; margin-bottom: 18px; }
    .adash-stat-card { padding: 14px 14px; border-radius: 14px; }
    .adash-stat-val  { font-size: 1.2rem; }
    .adash-stat-icon { width: 38px; height: 38px; border-radius: 11px; }
    .adash-stats     { gap: 10px; margin-bottom: 20px; }
    .adash-chart-wrap { padding: 16px 14px 8px; border-radius: 16px; }
}
`;

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        products: 0, revenue: 0, orders: 0, stores: 0, allOrders: [],
    });
    const [currency, setCurrency] = useState("৳");

    useEffect(() => {
        const load = async () => {
            try {
                const [orders, stores, products, pricing] = await Promise.all([
                    getAllOrders(), getAllStores(), getAllProducts(), getPricing()
                ]);
                const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
                setDashboardData({
                    products: products.length,
                    revenue,
                    orders: orders.length,
                    stores: stores.length,
                    allOrders: orders,
                });
                setCurrency(pricing?.currencySymbol ?? "৳");
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const statCards = [
        { title: "Products", value: dashboardData.products,                      icon: ShoppingBasketIcon },
        { title: "Revenue",  value: currency + dashboardData.revenue.toFixed(2), icon: CircleDollarSignIcon },
        { title: "Orders",   value: dashboardData.orders,                        icon: TagsIcon },
        { title: "Stores",   value: dashboardData.stores,                        icon: StoreIcon },
    ];

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="adash-root">

                {/* Title */}
                <h1 className="adash-title">Admin <span>Dashboard</span></h1>

                {/* Stats */}
                <div className="adash-stats">
                    {statCards.map((card, i) => (
                        <div key={i} className="adash-stat-card">
                            <div>
                                <p className="adash-stat-label">{card.title}</p>
                                <p className="adash-stat-val">{card.value}</p>
                            </div>
                            <div className="adash-stat-icon"><card.icon size={20} /></div>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div className="adash-chart-section">
                    <div className="adash-chart-wrap">
                        <p className="adash-chart-label">Orders Overview</p>
                        <p className="adash-chart-sublabel">Revenue trend over time</p>
                        <OrdersAreaChart allOrders={dashboardData.allOrders} />
                    </div>
                </div>

            </div>
        </>
    );
}