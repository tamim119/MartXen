import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.oac-tooltip {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    padding: 10px 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-width: 110px;
}
.oac-tooltip-label {
    font-size: 0.68rem;
    font-weight: 700;
    color: #94a3b8;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.oac-tooltip-val {
    font-size: 1.05rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
}
.oac-tooltip-tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    color: #16a34a;
    border-radius: 100px;
    padding: 2px 7px;
    margin-top: 4px;
}
`;

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <>
            <style>{CSS}</style>
            <div className="oac-tooltip">
                <p className="oac-tooltip-label">{label}</p>
                <p className="oac-tooltip-val">{payload[0].value}</p>
                <span className="oac-tooltip-tag">orders</span>
            </div>
        </>
    );
};

export default function OrdersAreaChart({ allOrders }) {

    const ordersPerDay = allOrders.reduce((acc, order) => {
        try {
            const date = order.createdAt?.toDate
                ? order.createdAt.toDate().toISOString().split('T')[0]
                : new Date(order.createdAt).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + 1;
        } catch {}
        return acc;
    }, {});

    const chartData = Object.entries(ordersPerDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
            orders: count,
        }));

    if (chartData.length === 0) {
        return (
            <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                No order data yet
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="oac-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

                <XAxis
                    dataKey="date"
                    tick={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                    tickLine={false} axisLine={false}
                />
                <YAxis
                    allowDecimals={false}
                    tick={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                    tickLine={false} axisLine={false}
                />

                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#16a34a', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.4 }}
                />

                <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    fill="url(#oac-grad)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#16a34a', stroke: '#fff', strokeWidth: 2.5 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}