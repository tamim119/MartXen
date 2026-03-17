import { PencilIcon, CheckIcon, XIcon, ZapIcon, ClockIcon, BadgeCheckIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getPricing, updatePricing } from "../../lib/services/pricingService";
import { useFloatingToast } from "../../components/FloatingToastProvider"; // ✅ Import

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.apr-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: apr-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes apr-fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
}

.apr-title {
    font-size: 1.5rem; font-weight: 500; color: #64748b;
    margin: 0 0 24px; line-height: 1.2;
}
.apr-title span { color: #0f172a; font-weight: 800; }

/* ── Grid ── */
.apr-grid {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 20px;
    align-items: start;
}
@media (max-width: 960px) { .apr-grid { grid-template-columns: 1fr; } }

/* ── Pricing box ── */
.apr-box {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 22px 20px;
    animation: apr-fadeUp 0.5s 0.06s cubic-bezier(0.4,0,0.2,1) both;
    position: sticky;
    top: 20px;
}
@media (max-width: 960px) { .apr-box { position: static; } }

.apr-box-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.apr-box-sub   { font-size: 0.75rem; color: #94a3b8; font-weight: 400; margin: 0 0 16px; }
.apr-box-divider { height: 1.5px; background: #f8fafc; margin: 0 -20px 16px; }

.apr-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; border-radius: 14px;
    border: 1.5px solid #f1f5f9; background: #f8fafc;
    margin-bottom: 10px; transition: border-color 0.18s, background 0.18s;
}
.apr-row:last-child { margin-bottom: 0; }
.apr-row.editing { border-color: #16a34a; background: #f0fdf4; }
.apr-row.hot { border-color: #bbf7d0; background: linear-gradient(135deg, #f0fdf4, #f8fafc); }

.apr-row-label { font-size: 0.8rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 5px; }
.apr-row-sub   { font-size: 0.65rem; font-weight: 600; color: #16a34a; background: #dcfce7; border-radius: 100px; padding: 2px 8px; margin-top: 3px; width: fit-content; }
.apr-row-sub.muted { color: #94a3b8; background: #f1f5f9; }

.apr-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.apr-val   { font-size: 1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; }
.apr-period { font-size: 0.7rem; color: #94a3b8; font-weight: 400; }

.apr-input {
    width: 72px; padding: 6px 10px; border: 1.5px solid #16a34a; border-radius: 10px;
    font-size: 0.9rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a; background: #fff; outline: none; text-align: right;
    -moz-appearance: textfield;
}
.apr-input::-webkit-outer-spin-button,
.apr-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.apr-input:focus { box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }

.apr-cur-input {
    width: 56px; padding: 6px 10px; border: 1.5px solid #16a34a; border-radius: 10px;
    font-size: 1rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a; background: #fff; outline: none; text-align: center;
}
.apr-cur-input:focus { box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }

.apr-btn {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    border: none; cursor: pointer; transition: all 0.18s; font-family: inherit;
    flex-shrink: 0;
}
.apr-btn:active { transform: scale(0.92); }
.apr-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.apr-edit   { background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0; }
.apr-edit:hover:not(:disabled) { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.apr-save   { background: #16a34a; color: #fff; box-shadow: 0 2px 8px rgba(22,163,74,0.25); }
.apr-save:hover:not(:disabled) { background: #15803d; }
.apr-cancel { background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0; }
.apr-cancel:hover:not(:disabled) { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

/* ── Requests panel ── */
.apr-requests {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 22px 20px;
    animation: apr-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}

.apr-req-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px; gap: 12px;
}
.apr-req-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.apr-req-sub   { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin: 0; }

.apr-req-count {
    font-size: 0.68rem; font-weight: 700;
    background: #fef9c3; border: 1.5px solid #fde68a; color: #854d0e;
    border-radius: 100px; padding: 4px 12px; flex-shrink: 0;
    display: inline-flex; align-items: center; gap: 5px;
}
.apr-req-count-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #f59e0b;
    box-shadow: 0 0 5px rgba(245,158,11,0.5);
    animation: apr-pulse 2s ease-in-out infinite;
}
@keyframes apr-pulse { 0%,100% { box-shadow:0 0 3px rgba(245,158,11,0.4); } 50% { box-shadow:0 0 8px rgba(245,158,11,0.7); } }
.apr-req-count.empty { background: #f1f5f9; border-color: #e2e8f0; color: #94a3b8; }

/* ── Request cards ── */
.apr-req-list { display: flex; flex-direction: column; gap: 12px; }

.apr-req-card {
    border: 1.5px solid #f1f5f9; border-radius: 16px;
    padding: 16px;
    transition: border-color 0.18s, box-shadow 0.18s;
    animation: apr-fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
.apr-req-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
.apr-req-card.approved { border-color: #bbf7d0; background: #f0fdf4; }
.apr-req-card.rejected { border-color: #fecaca; background: #fef2f2; opacity: 0.72; }

.apr-req-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 12px; margin-bottom: 12px;
}
.apr-req-user  { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.apr-req-email { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin: 0; }

.apr-req-status {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.65rem; font-weight: 700; border-radius: 100px;
    padding: 3px 10px; flex-shrink: 0; text-transform: capitalize;
}
.apr-req-status.pending  { background: #fef9c3; border: 1.5px solid #fde68a; color: #854d0e; }
.apr-req-status.approved { background: #dcfce7; border: 1.5px solid #86efac; color: #15803d; }
.apr-req-status.rejected { background: #fef2f2; border: 1.5px solid #fecaca; color: #dc2626; }

.apr-req-info {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
    margin-bottom: 12px;
}
@media (max-width: 480px) { .apr-req-info { grid-template-columns: 1fr; } }

.apr-req-info-item {
    background: #f8fafc; border-radius: 10px; padding: 8px 10px;
}
.apr-req-card.approved .apr-req-info-item { background: #fff; }
.apr-req-card.rejected .apr-req-info-item { background: #fff; }

.apr-req-info-label { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.4px; margin: 0 0 2px; }
.apr-req-info-val   { font-size: 0.8rem; font-weight: 700; color: #0f172a; margin: 0; }

.apr-req-actions { display: flex; gap: 8px; }
.apr-approve-btn {
    flex: 1; padding: 9px; border-radius: 10px; border: none;
    background: #16a34a; color: #fff; font-size: 0.78rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.18s; box-shadow: 0 2px 8px rgba(22,163,74,0.25);
}
.apr-approve-btn:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); }
.apr-approve-btn:active { transform: scale(0.97); }
.apr-approve-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.apr-reject-btn {
    padding: 9px 14px; border-radius: 10px;
    background: #fff; color: #ef4444;
    border: 1.5px solid #fecaca; font-size: 0.78rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.18s;
}
.apr-reject-btn:hover:not(:disabled) { background: #fef2f2; transform: translateY(-1px); }
.apr-reject-btn:active { transform: scale(0.97); }
.apr-reject-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.apr-req-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 10px;
}
.apr-req-date { font-size: 0.65rem; color: #cbd5e1; font-weight: 500; margin: 0; }

/* ── Empty state ── */
.apr-req-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 44px 20px; color: #94a3b8; text-align: center; gap: 8px;
}
.apr-req-empty-icon {
    width: 60px; height: 60px; border-radius: 18px;
    background: #f8fafc; border: 1.5px solid #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
}
.apr-req-empty p    { font-size: 0.875rem; font-weight: 600; color: #475569; margin: 0; }
.apr-req-empty span { font-size: 0.775rem; color: #cbd5e1; margin: 0; }

/* ── Mobile ── */
@media (max-width: 480px) {
    .apr-title { font-size: 1.2rem; margin-bottom: 18px; }
    .apr-box, .apr-requests { padding: 18px 16px; border-radius: 16px; }
}
`;

const formatPrice = (val) => {
    const n = parseFloat(val);
    if (isNaN(n)) return val;
    return n % 1 === 0 ? String(Math.floor(n)) : n.toFixed(2);
};
const storeVal = (val) => {
    const n = parseFloat(val);
    return n % 1 === 0 ? String(Math.floor(n)) : n.toFixed(2);
};

export default function AdminPricing() {
    const [currency, setCurrency]       = useState("৳");
    const [plusMonthly, setPlusMonthly] = useState("9.99");
    const [plusYearly, setPlusYearly]   = useState("99.99");
    const [requests, setRequests]       = useState([]);
    const { addToast } = useFloatingToast(); // ✅ Hook

    const [editingCur, setEditingCur] = useState(false);
    const [editCurVal, setEditCurVal] = useState("");
    const [savingCur, setSavingCur]   = useState(false);

    const [editingMo, setEditingMo] = useState(false);
    const [editMoVal, setEditMoVal] = useState("");
    const [savingMo, setSavingMo]   = useState(false);

    const [editingYr, setEditingYr] = useState(false);
    const [editYrVal, setEditYrVal] = useState("");
    const [savingYr, setSavingYr]   = useState(false);

    const [processingReq, setProcessingReq] = useState(null); // ✅ Track processing request

    useEffect(() => {
        getPricing()
            .then(data => {
                setCurrency(data?.currencySymbol    ?? "৳");
                setPlusMonthly(data?.plusMonthlyPrice ?? "9.99");
                setPlusYearly(data?.plusYearlyPrice   ?? "99.99");
            })
            .catch((error) => {
                console.error(error);
                addToast({
                    message: "Failed to load pricing",
                    type: "error",
                });
            });
    }, [addToast]);

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, "plusRequests"),
            snap => {
                const list = snap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRequests(list);
            },
            err => {
                console.warn(err);
                addToast({
                    message: "Failed to load Plus requests",
                    type: "error",
                });
            }
        );
        return () => unsub();
    }, [addToast]);

    const saveCurrency = async () => {
        const val = editCurVal.trim();
        if (!val) {
            addToast({ message: "Currency cannot be empty", type: "error" });
            return;
        }
        setSavingCur(true);
        try {
            await updatePricing({ currencySymbol: val });
            setCurrency(val);
            setEditingCur(false);
            addToast({
                message: "Currency updated successfully!",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            addToast({ message: "Failed to update currency", type: "error" });
        } finally {
            setSavingCur(false);
        }
    };

    const saveMonthly = async () => {
        const val = parseFloat(editMoVal);
        if (isNaN(val) || val < 0) {
            addToast({ message: "Invalid price value", type: "error" });
            return;
        }
        setSavingMo(true);
        try {
            const stored = storeVal(val);
            await updatePricing({ plusMonthlyPrice: stored });
            setPlusMonthly(stored);
            setEditingMo(false);
            addToast({
                message: "Monthly price updated successfully!",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            addToast({ message: "Failed to update monthly price", type: "error" });
        } finally {
            setSavingMo(false);
        }
    };

    const saveYearly = async () => {
        const val = parseFloat(editYrVal);
        if (isNaN(val) || val < 0) {
            addToast({ message: "Invalid price value", type: "error" });
            return;
        }
        setSavingYr(true);
        try {
            const stored = storeVal(val);
            await updatePricing({ plusYearlyPrice: stored });
            setPlusYearly(stored);
            setEditingYr(false);
            addToast({
                message: "Yearly price updated successfully!",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            addToast({ message: "Failed to update yearly price", type: "error" });
        } finally {
            setSavingYr(false);
        }
    };

    const approveRequest = async (req) => {
        setProcessingReq(req.id);
        try {
            await updateDoc(doc(db, "users", req.userId), {
                role: "plus", plusPlan: req.plan, plusBilling: req.billing,
                plusAmount: req.amount, plusPaymentMethod: req.paymentMethod,
                plusTxId: req.txId, plusActivatedAt: new Date().toISOString(),
            });
            await updateDoc(doc(db, "plusRequests", req.id), {
                status: "approved", approvedAt: new Date().toISOString(),
            });
            addToast({
                message: `${req.userEmail} approved as Plus member!`,
                title: "User upgraded successfully",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            addToast({
                message: "Failed to approve request",
                title: "Please try again",
                type: "error",
            });
        } finally {
            setProcessingReq(null);
        }
    };

    const rejectRequest = async (req) => {
        setProcessingReq(req.id);
        try {
            await updateDoc(doc(db, "plusRequests", req.id), {
                status: "rejected", rejectedAt: new Date().toISOString(),
            });
            addToast({
                message: "Request rejected",
                type: "info",
            });
        } catch (error) {
            console.error(error);
            addToast({
                message: "Failed to reject request",
                title: "Please try again",
                type: "error",
            });
        } finally {
            setProcessingReq(null);
        }
    };

    const deleteRequest = async (id) => {
        setProcessingReq(id);
        try {
            await deleteDoc(doc(db, "plusRequests", id));
            addToast({
                message: "Request deleted successfully",
                type: "success",
            });
        } catch (error) {
            console.error(error);
            addToast({
                message: "Failed to delete request",
                type: "error",
            });
        } finally {
            setProcessingReq(null);
        }
    };

    const pendingCount = requests.filter(r => r.status === "pending").length;

    const formatDate = (iso) => {
        if (!iso) return "";
        return new Date(iso).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="apr-root">

                <h1 className="apr-title">Plan <span>Pricing</span></h1>

                <div className="apr-grid">

                    {/* ── Pricing Settings ── */}
                    <div className="apr-box">
                        <p className="apr-box-title">Pricing Settings</p>
                        <p className="apr-box-sub">Manage currency & plan prices</p>
                        <div className="apr-box-divider" />

                        {/* Currency */}
                        <div className={`apr-row ${editingCur ? "editing" : ""}`}>
                            <div>
                                <p className="apr-row-label">Currency</p>
                                <p className="apr-row-sub muted">Symbol</p>
                            </div>
                            <div className="apr-right">
                                {editingCur ? (
                                    <>
                                        <input className="apr-cur-input" type="text" maxLength={4}
                                            value={editCurVal} onChange={e => setEditCurVal(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && saveCurrency()} autoFocus />
                                        <button className="apr-btn apr-save" onClick={saveCurrency} disabled={savingCur}><CheckIcon size={13} /></button>
                                        <button className="apr-btn apr-cancel" onClick={() => setEditingCur(false)} disabled={savingCur}><XIcon size={13} /></button>
                                    </>
                                ) : (
                                    <>
                                        <span className="apr-val">{currency}</span>
                                        <button className="apr-btn apr-edit" onClick={() => { setEditCurVal(currency); setEditingCur(true); }}><PencilIcon size={12} /></button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Free */}
                        <div className="apr-row">
                            <div>
                                <p className="apr-row-label">Free</p>
                                <p className="apr-row-sub">Always free</p>
                            </div>
                            <div className="apr-right">
                                <span className="apr-val">{currency}0</span>
                                <span className="apr-period">/mo</span>
                            </div>
                        </div>

                        {/* Plus Monthly */}
                        <div className={`apr-row hot ${editingMo ? "editing" : ""}`}>
                            <div>
                                <p className="apr-row-label"><ZapIcon size={11} color="#16a34a" /> Plus</p>
                                <p className="apr-row-sub">Monthly</p>
                            </div>
                            <div className="apr-right">
                                {editingMo ? (
                                    <>
                                        <input className="apr-input" type="number" min="0" step="0.01"
                                            value={editMoVal} onChange={e => setEditMoVal(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && saveMonthly()} autoFocus />
                                        <button className="apr-btn apr-save" onClick={saveMonthly} disabled={savingMo}><CheckIcon size={13} /></button>
                                        <button className="apr-btn apr-cancel" onClick={() => setEditingMo(false)} disabled={savingMo}><XIcon size={13} /></button>
                                    </>
                                ) : (
                                    <>
                                        <span className="apr-val">{currency}{formatPrice(plusMonthly)}</span>
                                        <span className="apr-period">/mo</span>
                                        <button className="apr-btn apr-edit" onClick={() => { setEditMoVal(plusMonthly); setEditingMo(true); }}><PencilIcon size={12} /></button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Plus Yearly */}
                        <div className={`apr-row hot ${editingYr ? "editing" : ""}`}>
                            <div>
                                <p className="apr-row-label"><ZapIcon size={11} color="#16a34a" /> Plus</p>
                                <p className="apr-row-sub">Yearly</p>
                            </div>
                            <div className="apr-right">
                                {editingYr ? (
                                    <>
                                        <input className="apr-input" type="number" min="0" step="0.01"
                                            value={editYrVal} onChange={e => setEditYrVal(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && saveYearly()} autoFocus />
                                        <button className="apr-btn apr-save" onClick={saveYearly} disabled={savingYr}><CheckIcon size={13} /></button>
                                        <button className="apr-btn apr-cancel" onClick={() => setEditingYr(false)} disabled={savingYr}><XIcon size={13} /></button>
                                    </>
                                ) : (
                                    <>
                                        <span className="apr-val">{currency}{formatPrice(plusYearly)}</span>
                                        <span className="apr-period">/yr</span>
                                        <button className="apr-btn apr-edit" onClick={() => { setEditYrVal(plusYearly); setEditingYr(true); }}><PencilIcon size={12} /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Plus Requests ── */}
                    <div className="apr-requests">
                        <div className="apr-req-head">
                            <div>
                                <p className="apr-req-title">Plus Membership Requests</p>
                                <p className="apr-req-sub">Review and approve upgrade requests</p>
                            </div>
                            {pendingCount > 0 ? (
                                <span className="apr-req-count">
                                    <span className="apr-req-count-dot" />
                                    {pendingCount} pending
                                </span>
                            ) : (
                                <span className="apr-req-count empty">{requests.length} total</span>
                            )}
                        </div>

                        {requests.length === 0 ? (
                            <div className="apr-req-empty">
                                <div className="apr-req-empty-icon">
                                    <ClockIcon size={24} style={{ color: '#cbd5e1' }} />
                                </div>
                                <p>No requests yet</p>
                                <span>Plus membership requests will appear here</span>
                            </div>
                        ) : (
                            <div className="apr-req-list">
                                {requests.map(req => (
                                    <div key={req.id} className={`apr-req-card ${req.status !== "pending" ? req.status : ""}`}>

                                        {/* Top: user + status */}
                                        <div className="apr-req-top">
                                            <div>
                                                <p className="apr-req-user">{req.userName || "Unknown"}</p>
                                                <p className="apr-req-email">{req.userEmail}</p>
                                            </div>
                                            <span className={`apr-req-status ${req.status}`}>
                                                {req.status === "pending"  && <ClockIcon size={9} />}
                                                {req.status === "approved" && <BadgeCheckIcon size={9} />}
                                                {req.status === "rejected" && <XIcon size={9} />}
                                                {req.status}
                                            </span>
                                        </div>

                                        {/* Info grid */}
                                        <div className="apr-req-info">
                                            <div className="apr-req-info-item">
                                                <p className="apr-req-info-label">Plan</p>
                                                <p className="apr-req-info-val">{req.plan} · {req.billing}</p>
                                            </div>
                                            <div className="apr-req-info-item">
                                                <p className="apr-req-info-label">Amount</p>
                                                <p className="apr-req-info-val">{req.currency}{req.amount}</p>
                                            </div>
                                            <div className="apr-req-info-item">
                                                <p className="apr-req-info-label">Method</p>
                                                <p className="apr-req-info-val" style={{ textTransform: "capitalize" }}>{req.paymentMethod}</p>
                                            </div>
                                            <div className="apr-req-info-item">
                                                <p className="apr-req-info-label">Sender Number</p>
                                                <p className="apr-req-info-val">{req.senderNumber}</p>
                                            </div>
                                            <div className="apr-req-info-item" style={{ gridColumn: "1 / -1" }}>
                                                <p className="apr-req-info-label">Transaction ID</p>
                                                <p className="apr-req-info-val">{req.txId}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {req.status === "pending" && (
                                            <div className="apr-req-actions">
                                                <button 
                                                    className="apr-reject-btn" 
                                                    onClick={() => rejectRequest(req)}
                                                    disabled={processingReq === req.id}
                                                >
                                                    <XIcon size={13} /> {processingReq === req.id ? "Rejecting..." : "Reject"}
                                                </button>
                                                <button 
                                                    className="apr-approve-btn" 
                                                    onClick={() => approveRequest(req)}
                                                    disabled={processingReq === req.id}
                                                >
                                                    <CheckIcon size={13} /> {processingReq === req.id ? "Approving..." : "Approve"}
                                                </button>
                                            </div>
                                        )}

                                        {/* Footer: date + delete */}
                                        <div className="apr-req-footer">
                                            <p className="apr-req-date">{formatDate(req.createdAt)}</p>
                                            {req.status !== "pending" && (
                                                <button 
                                                    className="apr-btn apr-cancel" 
                                                    onClick={() => deleteRequest(req.id)} 
                                                    title="Delete"
                                                    disabled={processingReq === req.id}
                                                >
                                                    <Trash2Icon size={12} />
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}