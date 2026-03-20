import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, getDocs, query, where } from "firebase/firestore";
import Loading from "../../components/Loading";
import { UsersIcon, SearchIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.usr-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

.usr-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.usr-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.usr-title span { color: #0f172a; font-weight: 800; }
.usr-sub { font-size: 0.8rem; color: #94a3b8; margin: 0; font-weight: 400; }
.usr-count { display: inline-flex; align-items: center; gap: 7px; background: #eef2ff; border: 1.5px solid #c7d2fe; border-radius: 100px; padding: 7px 14px; font-size: 0.78rem; font-weight: 700; color: #4338ca; flex-shrink: 0; align-self: center; }

.usr-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 20px; }
.usr-stat-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
.usr-stat-label { font-size: 0.68rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; }
.usr-stat-val { font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
.usr-stat-sub { font-size: 0.68rem; color: #94a3b8; font-weight: 500; }

.usr-search-wrap { position: relative; margin-bottom: 14px; }
.usr-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
.usr-search { width: 100%; padding: 9px 14px 9px 36px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.8rem; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #fff; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.usr-search:focus { border-color: #c7d2fe; }
.usr-search::placeholder { color: #cbd5e1; }

.usr-list { display: flex; flex-direction: column; gap: 8px; }

.usr-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 12px 16px; display: flex; align-items: center; gap: 12px; transition: border-color 0.2s; }
.usr-card:hover { border-color: #e2e8f0; }

.usr-avatar { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; font-size: 0.8rem; font-weight: 800; }
.usr-avatar img { width: 100%; height: 100%; object-fit: cover; }
.usr-avatar.customer { background: #eef2ff; border: 1.5px solid #c7d2fe; color: #4338ca; }
.usr-avatar.plus     { background: #fefce8; border: 1.5px solid #fde68a; color: #854d0e; }
.usr-avatar.seller   { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; }
.usr-avatar.admin    { background: #fdf2f8; border: 1.5px solid #f5d0fe; color: #7e22ce; }

.usr-info { flex: 1; min-width: 0; }
.usr-name { font-size: 0.82rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
.usr-email { font-size: 0.7rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }

.usr-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.usr-role-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 0.62rem; font-weight: 700; border-radius: 100px; padding: 3px 9px; }
.usr-role-badge.customer { background: #f1f5f9; border: 1.5px solid #e2e8f0; color: #475569; }
.usr-role-badge.plus     { background: #fefce8; border: 1.5px solid #fde68a; color: #854d0e; }
.usr-role-badge.seller   { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #15803d; }
.usr-role-badge.admin    { background: #fdf4ff; border: 1.5px solid #e9d5ff; color: #7e22ce; }

.usr-date { font-size: 0.68rem; color: #94a3b8; white-space: nowrap; }

.usr-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 240px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; gap: 8px; padding: 40px 24px; text-align: center; }
.usr-empty-icon { width: 56px; height: 56px; border-radius: 18px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.usr-empty-title { font-size: 0.88rem; font-weight: 700; color: #475569; margin: 0; }
.usr-empty-sub { font-size: 0.75rem; color: #cbd5e1; margin: 0; }

@media (max-width: 640px) {
    .usr-title { font-size: 1.25rem; }
    .usr-date { display: none; }
    .usr-stats { grid-template-columns: repeat(2, 1fr); }
}
`;

const ROLE_PRIORITY = ["admin", "seller", "plus", "customer", "user"];

const getRolePriorityIndex = (role) => {
    const idx = ROLE_PRIORITY.indexOf(role);
    return idx === -1 ? ROLE_PRIORITY.length : idx;
};

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

const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
};

const getRoleLabel = (role) => {
    if (role === "plus")   return "⚡ Plus";
    if (role === "seller") return "🏪 Seller";
    if (role === "admin")  return "🛡 Admin";
    return "Customer";
};

const getAvatarClass = (role) => {
    if (role === "plus")   return "plus";
    if (role === "seller") return "seller";
    if (role === "admin")  return "admin";
    return "customer";
};

const getBadgeClass = (role) => {
    if (role === "plus")   return "plus";
    if (role === "seller") return "seller";
    if (role === "admin")  return "admin";
    return "customer";
};

export default function Users() {
    const [users,       setUsers]       = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [search,      setSearch]      = useState("");
    const [sellerCount, setSellerCount] = useState(0); // ✅ stores collection থেকে আসবে

    useEffect(() => {
        // ✅ Approved store count — stores collection থেকে fetch
        getDocs(query(collection(db, "stores"), where("status", "==", "approved")))
            .then(snap => setSellerCount(snap.size))
            .catch(err => console.error("store count error:", err));

        const unsub = onSnapshot(
            collection(db, "users"),
            snap => {
                const raw = snap.docs.map(d => ({ id: d.id, ...d.data() }));

                const merged = {};
                raw.forEach(u => {
                    const key = u.email || u.id;
                    if (!merged[key]) {
                        merged[key] = { ...u };
                    } else {
                        const existingRank = getRolePriorityIndex(merged[key].role);
                        const newRank      = getRolePriorityIndex(u.role);
                        if (newRank < existingRank) {
                            merged[key].role = u.role;
                        }
                        const plusFields = ["plusActivatedAt","plusAmount","plusBilling","plusExpired","plusExpiresAt","plusPaymentMethod","plusPlan","plusTxId"];
                        plusFields.forEach(f => {
                            if (u[f] !== undefined && merged[key][f] === undefined) {
                                merged[key][f] = u[f];
                            }
                        });
                        if (u.createdAt && merged[key].createdAt) {
                            const existingDate = merged[key].createdAt?.toDate?.() || new Date(merged[key].createdAt);
                            const newDate      = u.createdAt?.toDate?.() || new Date(u.createdAt);
                            if (newDate < existingDate) merged[key].createdAt = u.createdAt;
                        }
                        if (!merged[key].photoURL && u.photoURL) merged[key].photoURL = u.photoURL;
                        if (!merged[key].photo    && u.photo)    merged[key].photo    = u.photo;
                        if (!merged[key].name        && u.name)        merged[key].name        = u.name;
                        if (!merged[key].displayName && u.displayName) merged[key].displayName = u.displayName;
                    }
                });

                const list = Object.values(merged).sort((a, b) => {
                    const rankDiff = getRolePriorityIndex(a.role) - getRolePriorityIndex(b.role);
                    if (rankDiff !== 0) return rankDiff;
                    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
                    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
                    return dateB - dateA;
                });

                setUsers(list);
                setLoading(false);
            },
            err => { console.error(err); setLoading(false); }
        );
        return () => unsub();
    }, []);

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        const role = u.role || "customer";
        return (
            (u.name || u.displayName || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            role.toLowerCase().includes(q) ||
            "customer".includes(q)
        );
    });

    const totalUsers = users.length;
    const plusCount  = users.filter(u => u.role === "plus").length;
    const adminCount = users.filter(u => u.role === "admin").length;

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="usr-root">

                <div className="usr-header">
                    <div>
                        <h1 className="usr-title">All <span>Users</span></h1>
                        <p className="usr-sub">Everyone who has signed in to DynamicxMart</p>
                    </div>
                    <div className="usr-count">
                        <UsersIcon size={13} />
                        {totalUsers} total
                    </div>
                </div>

                <div className="usr-stats">
                    <div className="usr-stat-card">
                        <span className="usr-stat-label">Total</span>
                        <span className="usr-stat-val">{totalUsers}</span>
                        <span className="usr-stat-sub">registered users</span>
                    </div>
                    <div className="usr-stat-card">
                        <span className="usr-stat-label">Plus</span>
                        <span className="usr-stat-val">{plusCount}</span>
                        <span className="usr-stat-sub">active members</span>
                    </div>
                    <div className="usr-stat-card">
                        <span className="usr-stat-label">Sellers</span>
                        <span className="usr-stat-val">{sellerCount}</span>
                        <span className="usr-stat-sub">store owners</span>
                    </div>
                    <div className="usr-stat-card">
                        <span className="usr-stat-label">Admins</span>
                        <span className="usr-stat-val">{adminCount}</span>
                        <span className="usr-stat-sub">administrators</span>
                    </div>
                </div>

                <div className="usr-search-wrap">
                    <SearchIcon size={14} className="usr-search-icon" />
                    <input
                        className="usr-search"
                        placeholder="Search by name, email or role…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="usr-empty">
                        <div className="usr-empty-icon"><UsersIcon size={24} style={{ color: '#cbd5e1' }} /></div>
                        <p className="usr-empty-title">{search ? "No results found" : "No users yet"}</p>
                        <p className="usr-empty-sub">{search ? "Try a different search term" : "Users will appear here after they sign in"}</p>
                    </div>
                ) : (
                    <div className="usr-list">
                        {filtered.map(u => {
                            const role = u.role || "customer";
                            const name = u.name || u.displayName || "Unknown";
                            const photo = u.photoURL || u.photo || null;
                            return (
                                <div key={u.id} className="usr-card">
                                    <div className={`usr-avatar ${getAvatarClass(role)}`}>
                                        {photo
                                            ? <img src={photo} alt={name} />
                                            : getInitials(name)
                                        }
                                    </div>
                                    <div className="usr-info">
                                        <p className="usr-name">{name}</p>
                                        <p className="usr-email">{u.email || "—"}</p>
                                    </div>
                                    <div className="usr-right">
                                        <span className={`usr-role-badge ${getBadgeClass(role)}`}>
                                            {getRoleLabel(role)}
                                        </span>
                                        <span className="usr-date">{fmtDate(u.createdAt)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}