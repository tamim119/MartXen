import { useEffect, useState } from "react";
import { CheckIcon, XIcon, StoreIcon, ChevronDownIcon } from "lucide-react";
import Loading from "../../components/Loading";
import { getAllStores, updateStoreStatus } from "../../lib/services/storeService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.aa-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

/* ── Header ── */
.aa-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.aa-page-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.aa-page-title span { color: #0f172a; font-weight: 800; }
.aa-page-sub { font-size: 0.8rem; color: #94a3b8; margin: 0; font-weight: 400; }
.aa-count-pill { display: inline-flex; align-items: center; gap: 7px; background: #fefce8; border: 1.5px solid #fde68a; border-radius: 100px; padding: 7px 14px; font-size: 0.78rem; font-weight: 700; color: #854d0e; flex-shrink: 0; align-self: center; }
.aa-count-pill-dot { width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.5); animation: aa-pulse 2s ease-in-out infinite; }
@keyframes aa-pulse { 0%,100% { box-shadow: 0 0 4px rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 10px rgba(245,158,11,0.7); } }

/* ── Alert ── */
.aa-alert { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.aa-alert-icon { width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.6rem; font-weight: 800; }
.aa-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.aa-alert.error   .aa-alert-icon { background: #fda4af; color: #9f1239; }
.aa-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.aa-alert.success .aa-alert-icon { background: #86efac; color: #14532d; }
.aa-alert.info    { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1e40af; }
.aa-alert.info    .aa-alert-icon { background: #93c5fd; color: #1e40af; }
.aa-alert-body { flex: 1; }
.aa-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.9rem; color: inherit; transition: opacity 0.15s; }
.aa-alert-close:hover { opacity: 1; }

/* ── List ── */
.aa-list { display: flex; flex-direction: column; gap: 10px; }

/* ── Card ── */
.aa-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.aa-card:hover { border-color: #e2e8f0; }
.aa-card.open { border-color: #bbf7d0; }

/* ── Card header — clickable ── */
.aa-card-head { display: flex; align-items: center; gap: 14px; padding: 14px 18px; cursor: pointer; user-select: none; }
.aa-card-num { font-size: 0.72rem; font-weight: 800; color: #16a34a; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; width: 28px; height: 28px; min-width: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.aa-card-main { flex: 1; min-width: 0; }
.aa-card-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.aa-card-meta-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.aa-card-user { font-size: 0.7rem; color: #94a3b8; }
.aa-card-sep  { color: #e2e8f0; font-size: 0.7rem; }
.aa-card-date { font-size: 0.7rem; color: #94a3b8; }
.aa-card-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

/* Pending badge */
.aa-pending-badge { display: inline-flex; align-items: center; gap: 4px; background: #fef9c3; border: 1.5px solid #fde68a; border-radius: 100px; padding: 3px 10px; font-size: 0.65rem; font-weight: 700; color: #854d0e; }

/* Chevron */
.aa-chevron { width: 28px; height: 28px; min-width: 28px; border-radius: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s; }
.aa-card.open .aa-chevron { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: rotate(180deg); }

/* ── Expanded body ── */
.aa-card-body { border-top: 1.5px solid #f1f5f9; padding: 14px 18px 16px; background: #f8fafc; display: flex; flex-direction: column; gap: 10px; }

/* Store logo row */
.aa-store-row { display: flex; align-items: center; gap: 12px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; }
.aa-store-logo { width: 44px; height: 44px; border-radius: 12px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.aa-store-logo img { width: 100%; height: 100%; object-fit: cover; }
.aa-store-name-big { font-size: 0.88rem; font-weight: 800; color: #0f172a; margin-bottom: 2px; }
.aa-store-handle   { font-size: 0.7rem; color: #94a3b8; font-weight: 400; }

/* Info card */
.aa-info-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 10px 14px; display: flex; flex-direction: column; gap: 5px; }
.aa-info-row { display: flex; gap: 10px; align-items: flex-start; }
.aa-info-key { font-size: 0.68rem; font-weight: 600; color: #94a3b8; min-width: 72px; flex-shrink: 0; padding-top: 1px; }
.aa-info-val { font-size: 0.78rem; font-weight: 600; color: #0f172a; word-break: break-word; flex: 1; line-height: 1.5; }
.aa-info-hr  { height: 1.5px; background: #f1f5f9; border: none; margin: 2px 0; }

/* Actions */
.aa-actions-row { display: flex; gap: 6px; padding-top: 2px; }
.aa-approve-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 100px; border: 1.5px solid #bbf7d0; background: #f0fdf4; color: #16a34a; font-size: 0.75rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; }
.aa-approve-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.aa-decline-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 100px; border: 1.5px solid #fde68a; background: #fefce8; color: #92400e; font-size: 0.75rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; }
.aa-decline-btn:disabled { opacity: 0.55; cursor: not-allowed; }

/* ── Empty ── */
.aa-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; gap: 8px; padding: 40px 24px; text-align: center; }
.aa-empty-icon { width: 64px; height: 64px; border-radius: 20px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.aa-empty-title { font-size: 0.9rem; font-weight: 700; color: #475569; margin: 0; }
.aa-empty-sub   { font-size: 0.775rem; color: #cbd5e1; margin: 0; }

@media (max-width: 640px) {
    .aa-page-title { font-size: 1.25rem; }
    .aa-card-head  { padding: 12px 14px; gap: 10px; }
    .aa-card-body  { padding: 12px 14px 14px; }
    .aa-card-date, .aa-card-sep { display: none; }
}
`;

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', info: 'i' };
    return (
        <div className={`aa-alert ${type}`}>
            <div className="aa-alert-icon">{icons[type]}</div>
            <div className="aa-alert-body">{message}</div>
            <button className="aa-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

export default function AdminApprove() {
    const [stores,      setStores]      = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [expandedId,  setExpandedId]  = useState(null);
    const [approvingId, setApprovingId] = useState(null);
    const [decliningId, setDecliningId] = useState(null);
    const [alert,       setAlert]       = useState(null);

    const showAlert  = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    useEffect(() => {
        getAllStores()
            .then(data => {
                const pending = data.filter(s => s.status === "pending");
                setStores(pending);
            })
            .catch(() => showAlert("error", "Failed to load stores."))
            .finally(() => setLoading(false));
    }, []);

    const handleApprove = async (store) => {
        setApprovingId(store.id);
        try {
            await updateStoreStatus(store.id, "approved", true);
            showAlert("success", `${store.name} approved and is now live.`);
            setStores(prev => prev.filter(s => s.id !== store.id));
            setExpandedId(null);
        } catch {
            showAlert("error", "Failed to approve store. Please try again.");
        } finally { setApprovingId(null); }
    };

    const handleDecline = async (store) => {
        setDecliningId(store.id);
        try {
            await updateStoreStatus(store.id, "rejected", false);
            showAlert("info", `${store.name} has been declined.`);
            setStores(prev => prev.filter(s => s.id !== store.id));
            setExpandedId(null);
        } catch {
            showAlert("error", "Failed to decline store. Please try again.");
        } finally { setDecliningId(null); }
    };

    const formatDate = (val) => {
        if (!val) return "—";
        try {
            const d = val?.toDate ? val.toDate() : new Date(val);
            return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        } catch { return "—"; }
    };

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="aa-root">

                <div className="aa-header">
                    <div>
                        <h1 className="aa-page-title">Approve <span>Stores</span></h1>
                        <p className="aa-page-sub">Review and approve pending store applications</p>
                    </div>
                    {stores.length > 0 && (
                        <div className="aa-count-pill">
                            <span className="aa-count-pill-dot" />
                            {stores.length} pending {stores.length === 1 ? "application" : "applications"}
                        </div>
                    )}
                </div>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                {stores.length ? (
                    <div className="aa-list">
                        {stores.map((store, i) => {
                            const isOpen      = expandedId === store.id;
                            const isApproving = approvingId === store.id;
                            const isDeclining = decliningId === store.id;
                            const isBusy      = isApproving || isDeclining;

                            return (
                                <div key={store.id} className={`aa-card${isOpen ? ' open' : ''}`}>

                                    {/* ── Header row ── */}
                                    <div className="aa-card-head" onClick={() => setExpandedId(isOpen ? null : store.id)}>
                                        <div className="aa-card-num">{i + 1}</div>

                                        <div className="aa-card-main">
                                            <p className="aa-card-name">{store.name}</p>
                                            <div className="aa-card-meta-row">
                                                <span className="aa-card-user">@{store.username || store.ownerEmail || "—"}</span>
                                                {store.createdAt && <>
                                                    <span className="aa-card-sep">·</span>
                                                    <span className="aa-card-date">{formatDate(store.createdAt)}</span>
                                                </>}
                                            </div>
                                        </div>

                                        <div className="aa-card-right">
                                            <span className="aa-pending-badge">Pending Review</span>
                                            <div className="aa-chevron"><ChevronDownIcon size={14} /></div>
                                        </div>
                                    </div>

                                    {/* ── Expanded body ── */}
                                    {isOpen && (
                                        <div className="aa-card-body">

                                            {/* Store logo + name */}
                                            <div className="aa-store-row">
                                                <div className="aa-store-logo">
                                                    {store.logo
                                                        ? <img src={store.logo} alt={store.name} />
                                                        : <StoreIcon size={20} style={{ color: '#cbd5e1' }} />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="aa-store-name-big">{store.name}</p>
                                                    <p className="aa-store-handle">@{store.username || "—"}</p>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="aa-info-card">
                                                {store.description && (
                                                    <>
                                                        <div className="aa-info-row">
                                                            <span className="aa-info-key">About</span>
                                                            <span className="aa-info-val">{store.description}</span>
                                                        </div>
                                                        <hr className="aa-info-hr" />
                                                    </>
                                                )}
                                                {store.email && (
                                                    <div className="aa-info-row">
                                                        <span className="aa-info-key">Email</span>
                                                        <span className="aa-info-val">{store.email}</span>
                                                    </div>
                                                )}
                                                {store.contact && (
                                                    <div className="aa-info-row">
                                                        <span className="aa-info-key">Phone</span>
                                                        <span className="aa-info-val">{store.contact}</span>
                                                    </div>
                                                )}
                                                {store.address && (
                                                    <div className="aa-info-row">
                                                        <span className="aa-info-key">Address</span>
                                                        <span className="aa-info-val">{store.address}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="aa-actions-row">
                                                <button
                                                    className="aa-decline-btn"
                                                    onClick={() => handleDecline(store)}
                                                    disabled={isBusy}
                                                >
                                                    <XIcon size={12} /> {isDeclining ? "Declining…" : "Decline"}
                                                </button>
                                                <button
                                                    className="aa-approve-btn"
                                                    onClick={() => handleApprove(store)}
                                                    disabled={isBusy}
                                                >
                                                    <CheckIcon size={12} /> {isApproving ? "Approving…" : "Approve"}
                                                </button>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="aa-empty">
                        <div className="aa-empty-icon"><StoreIcon size={26} style={{ color: '#cbd5e1' }} /></div>
                        <p className="aa-empty-title">All caught up!</p>
                        <p className="aa-empty-sub">No pending store applications right now</p>
                    </div>
                )}

            </div>
        </>
    );
}