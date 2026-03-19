import StoreInfo from "../../components/admin/StoreInfo";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { StoreIcon } from "lucide-react";
import { getAllStores, updateStoreStatus } from "../../lib/services/storeService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.as-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

.as-page-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 6px; }
.as-page-title span { color: #0f172a; font-weight: 800; }
.as-page-sub { font-size: 0.82rem; color: #94a3b8; margin: 0 0 24px; font-weight: 400; }

/* ── Alert ── */
.as-alert { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.as-alert-icon { width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.6rem; font-weight: 800; }
.as-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.as-alert.error   .as-alert-icon { background: #fda4af; color: #9f1239; }
.as-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.as-alert.success .as-alert-icon { background: #86efac; color: #14532d; }
.as-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.as-alert.warning .as-alert-icon { background: #fcd34d; color: #92400e; }
.as-alert-body { flex: 1; }
.as-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.9rem; color: inherit; transition: opacity 0.15s; }
.as-alert-close:hover { opacity: 1; }

/* ── List ── */
.as-list { display: flex; flex-direction: column; gap: 12px; max-width: 860px; }

.as-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px; transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s; }
.as-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.05); transform: translateY(-1px); }
.as-card.active-card { border-color: #bbf7d0; }

@media (max-width: 640px) { .as-card { flex-direction: column; align-items: flex-start; } }

/* ── Toggle ── */
.as-toggle-wrap { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

.as-status { display: inline-flex; align-items: center; gap: 5px; border-radius: 100px; padding: 4px 10px; font-size: 0.7rem; font-weight: 700; }
.as-status.live   { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; }
.as-status.paused { background: #f8fafc; border: 1.5px solid #e2e8f0; color: #94a3b8; }
.as-status-dot { width: 6px; height: 6px; border-radius: 50%; }
.as-status.live   .as-status-dot { background: #16a34a; box-shadow: 0 0 5px rgba(22,163,74,0.5); }
.as-status.paused .as-status-dot { background: #cbd5e1; }

.as-toggle-track { position: relative; width: 42px; height: 24px; background: #e2e8f0; border-radius: 12px; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
.as-toggle-track:has(input:checked) { background: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
.as-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.as-toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.22s cubic-bezier(0.4,0,0.2,1); pointer-events: none; box-shadow: 0 1px 4px rgba(0,0,0,0.18); }
.as-toggle-track:has(input:checked) .as-toggle-thumb { transform: translateX(18px); }

/* ── Empty ── */
.as-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 280px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; max-width: 860px; color: #94a3b8; gap: 10px; }
.as-empty-icon { width: 64px; height: 64px; border-radius: 20px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.as-empty p    { font-size: 0.875rem; font-weight: 600; color: #475569; margin: 0; }
.as-empty span { font-size: 0.775rem; color: #cbd5e1; }
`;

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', warning: '!' };
    return (
        <div className={`as-alert ${type}`}>
            <div className="as-alert-icon">{icons[type]}</div>
            <div className="as-alert-body">{message}</div>
            <button className="as-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

export default function AdminStores() {
    const [stores,  setStores]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert,   setAlert]   = useState(null);

    const showAlert  = (type, msg) => setAlert({ type, message: msg });
    const clearAlert = () => setAlert(null);

    useEffect(() => {
        getAllStores()
            .then(data => setStores(data.filter(s => s.status === "approved")))
            .catch(() => showAlert("error", "Failed to load stores. Please refresh."))
            .finally(() => setLoading(false));
    }, []);

    const toggleIsActive = async (store) => {
        const newActive = !store.isActive;
        const name = store.name || "Store";
        try {
            await updateStoreStatus(store.id, store.status, newActive);
            setStores(prev => prev.map(s => s.id === store.id ? { ...s, isActive: newActive } : s));
            if (newActive) showAlert("success", `${name} is now live.`);
            else           showAlert("warning", `${name} has been paused.`);
        } catch (err) {
            console.error(err);
            showAlert("error", `Failed to update ${name}. Please try again.`);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="as-root">

                <h1 className="as-page-title">Live <span>Stores</span></h1>
                <p className="as-page-sub">Toggle store visibility for customers</p>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                {stores.length > 0 ? (
                    <div className="as-list">
                        {stores.map(store => (
                            <div key={store.id} className={`as-card ${store.isActive ? 'active-card' : ''}`}>
                                <StoreInfo store={store} />
                                <div className="as-toggle-wrap">
                                    <span className={`as-status ${store.isActive ? 'live' : 'paused'}`}>
                                        <span className="as-status-dot" />
                                        {store.isActive ? 'Live' : 'Paused'}
                                    </span>
                                    <label className="as-toggle-track">
                                        <input type="checkbox" checked={store.isActive || false} onChange={() => toggleIsActive(store)} />
                                        <span className="as-toggle-thumb" />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="as-empty">
                        <div className="as-empty-icon"><StoreIcon size={26} style={{ color: '#cbd5e1' }} /></div>
                        <p>No approved stores yet</p>
                        <span>Stores will appear here after approval</span>
                    </div>
                )}
            </div>
        </>
    );
}