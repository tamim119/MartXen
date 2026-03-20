import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import Loading from "../../components/Loading";
import {
    ZapIcon, CalendarIcon, ClockIcon,
    SearchIcon, ChevronDownIcon,
    BadgeCheckIcon, AlertTriangleIcon
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pu-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

.pu-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.pu-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.pu-title span { color: #0f172a; font-weight: 800; }
.pu-sub { font-size: 0.8rem; color: #94a3b8; margin: 0; font-weight: 400; }
.pu-count { display: inline-flex; align-items: center; gap: 7px; background: #fefce8; border: 1.5px solid #fde68a; border-radius: 100px; padding: 7px 14px; font-size: 0.78rem; font-weight: 700; color: #854d0e; flex-shrink: 0; align-self: center; }
.pu-count-dot { width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.5); animation: pu-pulse 2s ease-in-out infinite; }
@keyframes pu-pulse { 0%,100% { box-shadow: 0 0 4px rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 10px rgba(245,158,11,0.7); } }

.pu-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px; }
.pu-stat-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
.pu-stat-label { font-size: 0.68rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; }
.pu-stat-val { font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
.pu-stat-sub { font-size: 0.68rem; color: #94a3b8; font-weight: 500; }

.pu-search-wrap { position: relative; margin-bottom: 14px; }
.pu-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
.pu-search { width: 100%; padding: 9px 14px 9px 36px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #fff; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.pu-search:focus { border-color: #c7d2fe; }
.pu-search::placeholder { color: #cbd5e1; }

.pu-list { display: flex; flex-direction: column; gap: 10px; }

.pu-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; overflow: hidden; transition: border-color 0.2s; }
.pu-card:hover { border-color: #e2e8f0; }
.pu-card.open     { border-color: #c7d2fe; }
.pu-card.expired  { border-color: #fecaca; }
.pu-card.expiring { border-color: #fed7aa; }

.pu-card-head { display: flex; align-items: center; gap: 14px; padding: 14px 18px; cursor: pointer; user-select: none; }

.pu-card-num { font-size: 0.72rem; font-weight: 800; color: #6366f1; background: #eef2ff; border: 1.5px solid #c7d2fe; border-radius: 8px; width: 28px; height: 28px; min-width: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pu-card.expired  .pu-card-num { background: #fef2f2; border-color: #fecaca; color: #ef4444; }
.pu-card.expiring .pu-card-num { background: #fff7ed; border-color: #fed7aa; color: #ea580c; }

.pu-card-main { flex: 1; min-width: 0; }
.pu-card-name  { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pu-card-email { font-size: 0.7rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.pu-card-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.pu-billing-pill { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 6px; font-size: 0.62rem; font-weight: 700; background: #eef2ff; border: 1px solid #c7d2fe; color: #4338ca; }

.pu-expiry-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 700; border-radius: 100px; padding: 3px 10px; }
.pu-expiry-badge.active   { background: #dcfce7; border: 1.5px solid #86efac; color: #15803d; }
.pu-expiry-badge.expiring { background: #fff7ed; border: 1.5px solid #fed7aa; color: #c2410c; }
.pu-expiry-badge.expired  { background: #fef2f2; border: 1.5px solid #fecaca; color: #dc2626; }

.pu-chevron { width: 28px; height: 28px; min-width: 28px; border-radius: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s; }
.pu-card.open .pu-chevron { background: #eef2ff; border-color: #c7d2fe; color: #6366f1; transform: rotate(180deg); }

.pu-card-body { border-top: 1.5px solid #f1f5f9; padding: 14px 18px 16px; background: #f8fafc; display: flex; flex-direction: column; gap: 10px; }

.pu-notice { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; border: 1.5px solid; font-size: 0.78rem; font-weight: 600; }
.pu-notice.expired  { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
.pu-notice.expiring { background: #fff7ed; border-color: #fed7aa; color: #c2410c; }

.pu-member-box { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; }
.pu-avatar { width: 40px; height: 40px; border-radius: 12px; background: #eef2ff; border: 1.5px solid #c7d2fe; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 800; color: #4338ca; flex-shrink: 0; }
.pu-member-info { flex: 1; min-width: 0; }
.pu-member-name  { font-size: 0.86rem; font-weight: 800; color: #0f172a; }
.pu-member-email { font-size: 0.7rem; color: #64748b; margin-top: 2px; }
.pu-member-right { text-align: right; flex-shrink: 0; }
.pu-member-price  { font-size: 1.05rem; font-weight: 800; color: #0f172a; }
.pu-member-period { font-size: 0.65rem; color: #94a3b8; }

.pu-dates-box { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; display: flex; gap: 0; }
.pu-date-col { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.pu-date-col:first-child { border-right: 1.5px solid #f1f5f9; padding-right: 14px; }
.pu-date-col:last-child  { padding-left: 14px; }
.pu-date-label { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; }
.pu-date-val   { font-size: 0.82rem; font-weight: 700; color: #0f172a; }
.pu-date-sub   { font-size: 0.65rem; color: #94a3b8; }

.pu-progress-wrap { display: flex; flex-direction: column; gap: 6px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; }
.pu-progress-top { display: flex; justify-content: space-between; align-items: center; }
.pu-progress-label { font-size: 0.72rem; font-weight: 600; color: #64748b; }
.pu-progress-pct   { font-size: 0.72rem; font-weight: 700; color: #6366f1; }
.pu-progress-bar-bg { height: 7px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
.pu-progress-bar { height: 100%; border-radius: 100px; transition: width 0.6s ease; }
.pu-progress-bar.active   { background: #6366f1; }
.pu-progress-bar.expiring { background: #f59e0b; }
.pu-progress-bar.expired  { background: #ef4444; }
.pu-progress-ends { display: flex; justify-content: space-between; font-size: 0.62rem; color: #94a3b8; }

.pu-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 240px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; gap: 8px; padding: 40px 24px; text-align: center; }
.pu-empty-icon { width: 56px; height: 56px; border-radius: 18px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.pu-empty-title { font-size: 0.88rem; font-weight: 700; color: #475569; margin: 0; }
.pu-empty-sub   { font-size: 0.75rem; color: #cbd5e1; margin: 0; }

@media (max-width: 640px) {
    .pu-title { font-size: 1.25rem; }
    .pu-card-head { padding: 12px 14px; gap: 10px; }
    .pu-card-body { padding: 12px 14px 14px; }
    .pu-billing-pill { display: none; }
    .pu-stats { grid-template-columns: repeat(2, 1fr); }
}
`;

const fmtDate = (val) => {
    if (!val) return "—";
    try {
        const d = val?.toDate ? val.toDate() : new Date(val);
        const day   = String(d.getDate()).padStart(2, "0");
        const month = d.toLocaleString("en-US", { month: "short" });
        const year  = d.getFullYear();
        return `${day} ${month} ${year}`;
    } catch { return "—"; }
};

const getDaysLeft = (expiresAt) => {
    if (!expiresAt) return null;
    try {
        const exp = new Date(expiresAt);
        const now = new Date();
        return Math.floor((exp - now) / (1000 * 60 * 60 * 24));
    } catch { return null; }
};

// ✅ Fixed: expired হলে 100%, valid range এ proper calculation
const getProgress = (activatedAt, expiresAt) => {
    if (!activatedAt || !expiresAt) return 0;
    try {
        const start = new Date(activatedAt);
        const end   = new Date(expiresAt);
        const now   = new Date();

        // Expired — পুরো 100% দেখাও
        if (now >= end) return 100;

        // এখনো শুরু হয়নি (edge case)
        if (now <= start) return 0;

        const total = end - start;
        if (total <= 0) return 100;

        const used = now - start;
        return Math.min(100, Math.max(0, Math.round((used / total) * 100)));
    } catch { return 0; }
};

const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

// ✅ Expire হলে customer-এ downgrade করো
const downgradeIfExpired = async (u) => {
    if (!u.plusExpiresAt) return;
    const daysLeft = getDaysLeft(u.plusExpiresAt);
    if (daysLeft !== null && daysLeft <= 0 && u.role === "plus") {
        try {
            await updateDoc(doc(db, "users", u.id), {
                role:          "customer",
                plusExpired:   true,
                plusExpiredAt: new Date().toISOString(),
            });
        } catch (err) {
            console.error("Downgrade error:", err);
        }
    }
};

export default function PlusUsers() {
    const [users,      setUsers]      = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [search,     setSearch]     = useState("");
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, "users"),
            async snap => {
                const list = snap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter(u => u.plusActivatedAt)
                    .sort((a, b) => new Date(b.plusActivatedAt) - new Date(a.plusActivatedAt));

                // ✅ Expire check — role "plus" হলেই downgrade করো
                for (const u of list) {
                    await downgradeIfExpired(u);
                }

                setUsers(list);
                setLoading(false);
            },
            err => { console.error(err); setLoading(false); }
        );
        return () => unsub();
    }, []);

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        return (
            (u.name || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q)
        );
    });

    const activeCount   = users.filter(u => (getDaysLeft(u.plusExpiresAt) ?? 0) > 0).length;
    const expiredCount  = users.filter(u => (getDaysLeft(u.plusExpiresAt) ?? 1) <= 0).length;
    const expiringCount = users.filter(u => { const d = getDaysLeft(u.plusExpiresAt); return d !== null && d > 0 && d <= 7; }).length;

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="pu-root">

                <div className="pu-header">
                    <div>
                        <h1 className="pu-title">Plus <span>Members</span></h1>
                        <p className="pu-sub">All users with active or past Plus memberships</p>
                    </div>
                    {activeCount > 0 && (
                        <div className="pu-count">
                            <span className="pu-count-dot" />
                            {activeCount} active
                        </div>
                    )}
                </div>

                <div className="pu-stats">
                    <div className="pu-stat-card">
                        <span className="pu-stat-label">Total</span>
                        <span className="pu-stat-val">{users.length}</span>
                        <span className="pu-stat-sub">all time</span>
                    </div>
                    <div className="pu-stat-card">
                        <span className="pu-stat-label">Active</span>
                        <span className="pu-stat-val">{activeCount}</span>
                        <span className="pu-stat-sub">currently active</span>
                    </div>
                    <div className="pu-stat-card">
                        <span className="pu-stat-label">Expiring</span>
                        <span className="pu-stat-val">{expiringCount}</span>
                        <span className="pu-stat-sub">within 7 days</span>
                    </div>
                    <div className="pu-stat-card">
                        <span className="pu-stat-label">Expired</span>
                        <span className="pu-stat-val">{expiredCount}</span>
                        <span className="pu-stat-sub">need renewal</span>
                    </div>
                </div>

                <div className="pu-search-wrap">
                    <SearchIcon size={14} className="pu-search-icon" />
                    <input
                        className="pu-search"
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="pu-empty">
                        <div className="pu-empty-icon"><ZapIcon size={24} style={{ color: '#cbd5e1' }} /></div>
                        <p className="pu-empty-title">{search ? "No results found" : "No Plus members yet"}</p>
                        <p className="pu-empty-sub">{search ? "Try a different search term" : "Plus members will appear here after approval"}</p>
                    </div>
                ) : (
                    <div className="pu-list">
                        {filtered.map((u, i) => {
                            const isOpen     = expandedId === u.id;
                            const daysLeft   = getDaysLeft(u.plusExpiresAt);
                            const isExpired  = daysLeft !== null && daysLeft <= 0;
                            const isExpiring = daysLeft !== null && daysLeft > 0 && daysLeft <= 7;
                            const progress   = getProgress(u.plusActivatedAt, u.plusExpiresAt);
                            const isYearly   = u.plusBilling === "yearly";
                            const badgeClass = isExpired ? "expired" : isExpiring ? "expiring" : "active";
                            const cardClass  = isExpired ? "expired" : isExpiring ? "expiring" : "";
                            const progClass  = isExpired ? "expired" : isExpiring ? "expiring" : "active";

                            return (
                                <div key={u.id} className={`pu-card${isOpen ? ' open' : ''} ${cardClass}`}>

                                    <div className="pu-card-head" onClick={() => setExpandedId(isOpen ? null : u.id)}>
                                        <div className="pu-card-num">{i + 1}</div>
                                        <div className="pu-card-main">
                                            <p className="pu-card-name">{u.name || "Unknown"}</p>
                                        </div>
                                        <div className="pu-card-right">
                                            <span className="pu-billing-pill">
                                                <CalendarIcon size={10} />
                                                {isYearly ? '1 Year' : '1 Month'}
                                            </span>
                                            <span className={`pu-expiry-badge ${badgeClass}`}>
                                                {isExpired
                                                    ? <><AlertTriangleIcon size={9} /> Expired</>
                                                    : isExpiring
                                                        ? <><ClockIcon size={9} /> {daysLeft}d left</>
                                                        : <><BadgeCheckIcon size={9} /> {daysLeft}d left</>
                                                }
                                            </span>
                                            <div className="pu-chevron"><ChevronDownIcon size={14} /></div>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="pu-card-body">

                                            {(isExpired || isExpiring) && (
                                                <div className={`pu-notice ${isExpired ? 'expired' : 'expiring'}`}>
                                                    <AlertTriangleIcon size={14} />
                                                    {isExpired
                                                        ? `Membership expired on ${fmtDate(u.plusExpiresAt)}`
                                                        : `Expiring in ${daysLeft} day${daysLeft === 1 ? '' : 's'} — on ${fmtDate(u.plusExpiresAt)}`
                                                    }
                                                </div>
                                            )}

                                            <div className="pu-member-box">
                                                <div className="pu-avatar">{getInitials(u.name)}</div>
                                                <div className="pu-member-info">
                                                    <p className="pu-member-email">{u.email || "—"}</p>
                                                </div>
                                                <div className="pu-member-right">
                                                    <div className="pu-member-price">৳{u.plusAmount || "—"}</div>
                                                    <div className="pu-member-period">per {isYearly ? 'year' : 'month'}</div>
                                                </div>
                                            </div>

                                            <div className="pu-dates-box">
                                                <div className="pu-date-col">
                                                    <span className="pu-date-label">Activated</span>
                                                    <span className="pu-date-val">{fmtDate(u.plusActivatedAt)}</span>
                                                    <span className="pu-date-sub">{isYearly ? 'Yearly plan' : 'Monthly plan'}</span>
                                                </div>
                                                <div className="pu-date-col">
                                                    <span className="pu-date-label">Expires</span>
                                                    <span className="pu-date-val" style={{ color: isExpired ? '#dc2626' : isExpiring ? '#c2410c' : '#0f172a' }}>
                                                        {fmtDate(u.plusExpiresAt)}
                                                    </span>
                                                    <span className="pu-date-sub">
                                                        {isExpired ? 'Expired' : `${daysLeft} days left`}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pu-progress-wrap">
                                                <div className="pu-progress-top">
                                                    <span className="pu-progress-label">Membership usage</span>
                                                    <span className="pu-progress-pct" style={{ color: isExpired ? '#ef4444' : isExpiring ? '#f59e0b' : '#6366f1' }}>
                                                        {progress}% used
                                                    </span>
                                                </div>
                                                <div className="pu-progress-bar-bg">
                                                    <div className={`pu-progress-bar ${progClass}`} style={{ width: `${progress}%` }} />
                                                </div>
                                                <div className="pu-progress-ends">
                                                    <span>{fmtDate(u.plusActivatedAt)}</span>
                                                    <span>{fmtDate(u.plusExpiresAt)}</span>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}