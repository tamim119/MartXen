import Loading from "../../components/Loading";
import OrdersAreaChart from "../../components/OrdersAreaChart";
import {
    CircleDollarSignIcon, ShoppingBasketIcon,
    StoreIcon, TagsIcon, TrendingUpIcon
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
    margin-bottom: 80px;
}

/* ── Header ── */
.adash-header { margin-bottom: 28px; }
.adash-title  { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.adash-title span { color: #0f172a; font-weight: 800; }
.adash-subtitle { font-size: 0.8rem; color: #94a3b8; margin: 0; font-weight: 400; }

/* ── Stats grid ── */
.adash-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 20px;
}
@media (max-width: 1024px) { .adash-stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .adash-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

.adash-stat-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
}
.adash-stat-card::before {
    content: '';
    position: absolute;
    top: -20px; right: -20px;
    width: 72px; height: 72px;
    border-radius: 50%;
    background: rgba(22,163,74,0.05);
    pointer-events: none;
}
.adash-stat-card:hover {
    border-color: #bbf7d0;
    box-shadow: 0 6px 24px rgba(22,163,74,0.08);
    transform: translateY(-2px);
}

.adash-stat-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.adash-stat-label { font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; margin: 0; }
.adash-stat-icon {
    width: 36px; height: 36px; border-radius: 11px;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #16a34a;
}
.adash-stat-val {
    font-size: 1.65rem; font-weight: 800; color: #0f172a;
    letter-spacing: -0.6px; line-height: 1; margin: 0;
}

/* ── Chart card ── */
.adash-chart-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 22px 22px 14px;
}
.adash-chart-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 8px; }
.adash-chart-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.adash-chart-sub   { font-size: 0.72rem; color: #94a3b8; margin: 0; font-weight: 400; }
.adash-chart-badge { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.68rem; font-weight: 700; padding: 4px 10px; border-radius: 100px; }

@media (max-width: 480px) {
    .adash-stat-card { padding: 16px; border-radius: 16px; }
    .adash-stat-val  { font-size: 1.35rem; }
    .adash-chart-card { padding: 16px 14px 10px; }
}
`;

export default function AdminDashboard() {
    const [loading, setLoading]           = useState(true);
    const [dashboardData, setDashboardData] = useState({ products: 0, revenue: 0, orders: 0, stores: 0, allOrders: [] });
    const [currency, setCurrency]         = useState("৳");

    useEffect(() => {
        const load = async () => {
            try {
                const [orders, stores, products, pricing] = await Promise.all([
                    getAllOrders(), getAllStores(), getAllProducts(), getPricing()
                ]);
                const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
                setDashboardData({ products: products.length, revenue, orders: orders.length, stores: stores.length, allOrders: orders });
                setCurrency(pricing?.currencySymbol ?? "৳");
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    if (loading) return <Loading />;

    const statCards = [
        { title: "Total Revenue",  value: currency + dashboardData.revenue.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 2 }), icon: CircleDollarSignIcon },
        { title: "Total Orders",   value: dashboardData.orders,   icon: TagsIcon },
        { title: "Total Products", value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: "Active Stores",  value: dashboardData.stores,   icon: StoreIcon },
    ];

    return (
        <>
            <style>{CSS}</style>
            <div className="adash-root">

                <div className="adash-header">
                    <h1 className="adash-title">Admin <span>Dashboard</span></h1>
                    <p className="adash-subtitle">Overview of your store performance</p>
                </div>

                <div className="adash-stats">
                    {statCards.map((card, i) => (
                        <div key={i} className="adash-stat-card">
                            <div className="adash-stat-top">
                                <p className="adash-stat-label">{card.title}</p>
                                <div className="adash-stat-icon"><card.icon size={17} /></div>
                            </div>
                            <p className="adash-stat-val">{card.value}</p>
                        </div>
                    ))}
                </div>

                <div className="adash-chart-card">
                    <div className="adash-chart-head">
                        <div>
                            <p className="adash-chart-title">Orders Overview</p>
                            <p className="adash-chart-sub">Daily order volume over time</p>
                        </div>
                        <span className="adash-chart-badge">
                            <TrendingUpIcon size={11} />
                            {dashboardData.orders} total orders
                        </span>
                    </div>
                    <OrdersAreaChart allOrders={dashboardData.allOrders} />
                </div>

            </div>
        </>
    );
}