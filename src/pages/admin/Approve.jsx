import { useEffect, useState } from "react";
import { CheckIcon, XIcon, StoreIcon } from "lucide-react";
import { useFloatingToast } from "../../components/FloatingToastProvider"; // ✅ Import
import Loading from "../../components/Loading";
import StoreInfo from "../../components/admin/StoreInfo";
import { getAllStores, updateStoreStatus } from "../../lib/services/storeService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.aa-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: aa-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes aa-fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
}

/* ── Header ── */
.aa-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 24px;
}
.aa-header-left {}
.aa-page-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #64748b;
    margin: 0 0 4px;
    line-height: 1.2;
}
.aa-page-title span { color: #0f172a; font-weight: 800; }
.aa-page-sub {
    font-size: 0.8rem;
    color: #94a3b8;
    margin: 0;
    font-weight: 400;
}

/* Pending count pill */
.aa-count-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: #fefce8;
    border: 1.5px solid #fde68a;
    border-radius: 100px;
    padding: 7px 14px;
    font-size: 0.78rem;
    font-weight: 700;
    color: #854d0e;
    flex-shrink: 0;
    align-self: center;
}
.aa-count-pill-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #f59e0b;
    box-shadow: 0 0 6px rgba(245,158,11,0.5);
    animation: aa-pulse 2s ease-in-out infinite;
}
@keyframes aa-pulse {
    0%,100% { box-shadow: 0 0 4px rgba(245,158,11,0.4); }
    50%      { box-shadow: 0 0 10px rgba(245,158,11,0.7); }
}

/* ── Cards ── */
.aa-list { display: flex; flex-direction: column; gap: 12px; }

.aa-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
    animation: aa-fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
.aa-card:nth-child(1) { animation-delay: 0.06s; }
.aa-card:nth-child(2) { animation-delay: 0.10s; }
.aa-card:nth-child(3) { animation-delay: 0.14s; }
.aa-card:nth-child(n+4) { animation-delay: 0.17s; }
.aa-card:hover {
    border-color: #fde68a;
    box-shadow: 0 6px 24px rgba(245,158,11,0.08);
    transform: translateY(-2px);
}

/* ── Actions ── */
.aa-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.aa-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    border-radius: 100px;
    font-size: 0.78rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}
.aa-btn:active { transform: scale(0.95) !important; }
.aa-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.aa-approve-btn {
    background: #16a34a;
    color: #fff;
    box-shadow: 0 3px 12px rgba(22,163,74,0.25);
}
.aa-approve-btn:hover:not(:disabled) {
    background: #15803d;
    box-shadow: 0 6px 18px rgba(22,163,74,0.35);
    transform: translateY(-1px);
}

.aa-reject-btn {
    background: #fff;
    color: #ef4444;
    border: 1.5px solid #fee2e2;
}
.aa-reject-btn:hover:not(:disabled) {
    background: #fef2f2;
    border-color: #fca5a5;
    transform: translateY(-1px);
}

/* Mobile */
@media (max-width: 640px) {
    .aa-card {
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
        border-radius: 16px;
    }
    .aa-actions { width: 100%; justify-content: flex-end; }
    .aa-page-title { font-size: 1.2rem; }
    .aa-btn { padding: 8px 14px; font-size: 0.75rem; }
}

/* ── Empty ── */
.aa-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    color: #94a3b8;
    gap: 8px;
    padding: 40px 24px;
    text-align: center;
}
.aa-empty-icon {
    width: 64px; height: 64px;
    border-radius: 20px;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
}
.aa-empty-title { font-size: 0.9rem; font-weight: 700; color: #475569; margin: 0; }
.aa-empty-sub   { font-size: 0.775rem; color: #cbd5e1; margin: 0; }
`;

export default function AdminApprove() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); // ✅ Track which store is being processed
    const { addToast } = useFloatingToast(); // ✅ Hook

    useEffect(() => {
        getAllStores()
            .then(data => setStores(data.filter(s => s.status === "pending")))
            .catch((error) => {
                console.error(error);
                addToast({
                    message: "Failed to load stores",
                    type: "error",
                });
            })
            .finally(() => setLoading(false));
    }, [addToast]);

    const handleApprove = async (store) => {
        setProcessingId(store.id);
        try {
            await updateStoreStatus(store.id, "approved", true);
            
            // ✅ Success toast
            addToast({
                message: `${store.name} approved successfully!`,
                title: "Store is now active",
                type: "success",
            });

            setStores(prev => prev.filter(s => s.id !== store.id));
        } catch (error) {
            console.error(error);
            // ✅ Error toast
            addToast({
                message: "Failed to approve store",
                title: "Please try again",
                type: "error",
            });
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (store) => {
        setProcessingId(store.id);
        try {
            await updateStoreStatus(store.id, "rejected", false);
            
            // ✅ Reject toast
            addToast({
                message: `${store.name} has been rejected`,
                type: "info",
            });

            setStores(prev => prev.filter(s => s.id !== store.id));
        } catch (error) {
            console.error(error);
            // ✅ Error toast
            addToast({
                message: "Failed to reject store",
                title: "Please try again",
                type: "error",
            });
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="aa-root">

                {/* Header */}
                <div className="aa-header">
                    <div className="aa-header-left">
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

                {stores.length ? (
                    <div className="aa-list">
                        {stores.map(store => (
                            <div key={store.id} className="aa-card">
                                <StoreInfo store={store} />
                                <div className="aa-actions">
                                    <button
                                        className="aa-btn aa-reject-btn"
                                        onClick={() => handleReject(store)}
                                        disabled={processingId === store.id}
                                    >
                                        <XIcon size={13} /> 
                                        {processingId === store.id ? "Rejecting..." : "Reject"}
                                    </button>
                                    <button
                                        className="aa-btn aa-approve-btn"
                                        onClick={() => handleApprove(store)}
                                        disabled={processingId === store.id}
                                    >
                                        <CheckIcon size={13} /> 
                                        {processingId === store.id ? "Approving..." : "Approve"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="aa-empty">
                        <div className="aa-empty-icon">
                            <StoreIcon size={26} style={{ color: '#cbd5e1' }} />
                        </div>
                        <p className="aa-empty-title">All caught up!</p>
                        <p className="aa-empty-sub">No pending store applications right now</p>
                    </div>
                )}

            </div>
        </>
    );
}