import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.oac-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    width: 100%;
}

.oac-tooltip {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    padding: 10px 14px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    font-family: 'Plus Jakarta Sans', sans-serif;
}
.oac-tooltip-label {
    font-size: 0.72rem;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}
.oac-tooltip-val {
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
}
.oac-tooltip-val span {
    font-size: 0.72rem;
    font-weight: 500;
    color: #16a34a;
    margin-left: 4px;
}
`;

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <>
            <style>{CSS}</style>
            <div className="oac-tooltip">
                <p className="oac-tooltip-label">{label}</p>
                <p className="oac-tooltip-val">
                    {payload[0].value}
                    <span>orders</span>
                </p>
            </div>
        </>
    );
};

export default function OrdersAreaChart({ allOrders }) {

    const ordersPerDay = allOrders.reduce((acc, order) => {
        const date = order.createdAt?.toDate
            ? order.createdAt.toDate().toISOString().split('T')[0]
            : new Date(order.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(ordersPerDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, orders: count }));

    return (
        <>
            <style>{CSS}</style>
            <div className="oac-root">
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="oac-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.18} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f1f5f9"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="date"
                            tick={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 11,
                                fill: '#94a3b8',
                                fontWeight: 500,
                            }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => {
                                const d = new Date(v);
                                return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                            }}
                        />

                        <YAxis
                            allowDecimals={false}
                            tick={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 11,
                                fill: '#94a3b8',
                                fontWeight: 500,
                            }}
                            tickLine={false}
                            axisLine={false}
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{
                                stroke: '#16a34a',
                                strokeWidth: 1,
                                strokeDasharray: '4 4',
                                opacity: 0.5,
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="orders"
                            stroke="#16a34a"
                            strokeWidth={2.5}
                            fill="url(#oac-grad)"
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: '#16a34a',
                                stroke: '#fff',
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}