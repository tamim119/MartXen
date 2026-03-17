import StoreInfo from "../../components/admin/StoreInfo";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { useFloatingToast } from "../../components/FloatingToastProvider";
import { StoreIcon } from "lucide-react";
import { getAllStores, updateStoreStatus } from "../../lib/services/storeService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.as-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: as-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes as-fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
}

.as-page-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 24px;
}
.as-page-title span { color: #0f172a; font-weight: 800; }

/* ── Store card ── */
.as-list { display: flex; flex-direction: column; gap: 14px; max-width: 860px; }

.as-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 20px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
    animation: as-fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
.as-card:nth-child(1) { animation-delay: 0.06s; }
.as-card:nth-child(2) { animation-delay: 0.10s; }
.as-card:nth-child(3) { animation-delay: 0.14s; }
.as-card:nth-child(n+4) { animation-delay: 0.17s; }
.as-card:hover {
    border-color: #e2e8f0;
    box-shadow: 0 6px 20px rgba(0,0,0,0.05);
    transform: translateY(-2px);
}
.as-card.active-card { border-color: #bbf7d0; }

@media (max-width: 640px) {
    .as-card { flex-direction: column; align-items: flex-start; }
}

/* ── Toggle control ── */
.as-toggle-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}
.as-toggle-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #64748b;
    white-space: nowrap;
}
.as-toggle-label.on { color: #16a34a; }

.as-toggle-track {
    position: relative;
    width: 42px; height: 24px;
    background: #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
}
.as-toggle-track:has(input:checked) { background: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.15); }
.as-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.as-toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.22s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
.as-toggle-track:has(input:checked) .as-toggle-thumb { transform: translateX(18px); }

/* ── Status badge ── */
.as-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 100px;
    padding: 4px 10px;
    font-size: 0.7rem;
    font-weight: 700;
}
.as-status.live {
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    color: #16a34a;
}
.as-status.paused {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    color: #94a3b8;
}
.as-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
}
.as-status.live .as-status-dot { background: #16a34a; box-shadow: 0 0 5px rgba(22,163,74,0.5); }
.as-status.paused .as-status-dot { background: #cbd5e1; }

/* ── Empty ── */
.as-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 320px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    max-width: 860px;
    color: #94a3b8;
    gap: 10px;
}
.as-empty p { font-size: 0.9rem; font-weight: 500; }
`;

export default function AdminStores() {
    const toast = useFloatingToast();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const data = await getAllStores();
                const approvedStores = data.filter(s => s.status === "approved");
                setStores(approvedStores);
            } catch (err) {
                console.error("Error fetching stores:", err);
                toast.error(
                    "Failed to load stores",
                    "Please check your internet connection and try again"
                );
                setStores([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, [toast]);

    const toggleIsActive = async (store) => {
        const newActive = !store.isActive;
        const storeName = store.name || "Store";
        
        try {
            await updateStoreStatus(store.id, store.status, newActive);
            
            setStores(prev => prev.map(s =>
                s.id === store.id ? { ...s, isActive: newActive } : s
            ));
            
            if (newActive) {
                toast.success(
                    `${storeName} is now live!`,
                    "Customers can now view and purchase from this store"
                );
            } else {
                toast.warning(
                    `${storeName} has been paused`,
                    "This store is temporarily hidden from customers"
                );
            }
        } catch (err) {
            console.error("Error updating store status:", err);
            
            // Provide specific error messages based on error type
            let errorMessage = "Failed to update store status";
            let errorDetail = "Please try again in a moment";
            
            if (err.code === 'permission-denied') {
                errorMessage = "Permission denied";
                errorDetail = "You don't have permission to update this store";
            } else if (err.code === 'unavailable') {
                errorMessage = "Service unavailable";
                errorDetail = "Please check your internet connection";
            } else if (err.code === 'not-found') {
                errorMessage = "Store not found";
                errorDetail = "This store may have been deleted";
            } else if (err.message) {
                errorDetail = err.message;
            }
            
            toast.error(errorMessage, errorDetail);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="as-root">
                <h1 className="as-page-title">Live <span>Stores</span></h1>

                {stores.length > 0 ? (
                    <div className="as-list">
                        {stores.map(store => (
                            <div
                                key={store.id}
                                className={`as-card ${store.isActive ? 'active-card' : ''}`}
                            >
                                <StoreInfo store={store} />

                                <div className="as-toggle-wrap">
                                    <span className={`as-status ${store.isActive ? 'live' : 'paused'}`}>
                                        <span className="as-status-dot" />
                                        {store.isActive ? 'Live' : 'Paused'}
                                    </span>
                                    <label className="as-toggle-track">
                                        <input
                                            type="checkbox"
                                            checked={store.isActive || false}
                                            onChange={() => toggleIsActive(store)}
                                        />
                                        <span className="as-toggle-thumb" />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="as-empty">
                        <StoreIcon size={36} style={{ color: '#e2e8f0' }} />
                        <p>No approved stores yet</p>
                    </div>
                )}
            </div>
        </>
    );
}