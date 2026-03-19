import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import Loading from "../../components/Loading";
import { Button } from "@/components/ui/button";
import {
    CheckIcon, XIcon, ClockIcon, BadgeCheckIcon,
    ZapIcon, RefreshCwIcon,
    ArrowUpIcon, ArrowDownIcon, ChevronDownIcon
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.apl-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

.apl-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
.apl-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.apl-title span { color: #0f172a; font-weight: 800; }
.apl-sub { font-size: 0.8rem; color: #94a3b8; margin: 0; font-weight: 400; }
.apl-count { display: inline-flex; align-items: center; gap: 7px; background: #fefce8; border: 1.5px solid #fde68a; border-radius: 100px; padding: 7px 14px; font-size: 0.78rem; font-weight: 700; color: #854d0e; flex-shrink: 0; align-self: center; }
.apl-count-dot { width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 6px rgba(245,158,11,0.5); animation: apl-pulse 2s ease-in-out infinite; }
@keyframes apl-pulse { 0%,100% { box-shadow: 0 0 4px rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 10px rgba(245,158,11,0.7); } }

.apl-alert { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.apl-alert-icon { width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.6rem; font-weight: 800; }
.apl-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.apl-alert.error   .apl-alert-icon { background: #fda4af; color: #9f1239; }
.apl-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.apl-alert.success .apl-alert-icon { background: #86efac; color: #14532d; }
.apl-alert.info    { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1e40af; }
.apl-alert.info    .apl-alert-icon { background: #93c5fd; color: #1e40af; }
.apl-alert-body { flex: 1; }
.apl-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.9rem; color: inherit; transition: opacity 0.15s; }
.apl-alert-close:hover { opacity: 1; }

.apl-list { display: flex; flex-direction: column; gap: 10px; }

.apl-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.apl-card:hover { border-color: #e2e8f0; }
.apl-card.open     { border-color: #bbf7d0; }
.apl-card.approved { border-color: #bbf7d0; }
.apl-card.rejected { border-color: #fecaca; }

.apl-card-head { display: flex; align-items: center; gap: 14px; padding: 14px 18px; cursor: pointer; user-select: none; }

.apl-card-num { font-size: 0.72rem; font-weight: 800; color: #16a34a; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; width: 28px; height: 28px; min-width: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.apl-card.approved .apl-card-num { color: #16a34a; }
.apl-card.rejected .apl-card-num { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

.apl-card-main { flex: 1; min-width: 0; }
.apl-card-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.apl-card-meta { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
.apl-card-email { font-size: 0.7rem; color: #94a3b8; }
.apl-card-sep   { color: #e2e8f0; font-size: 0.7rem; }
.apl-card-date  { font-size: 0.7rem; color: #94a3b8; }
@media (max-width: 640px) { .apl-card-date, .apl-card-sep { display: none; } }

.apl-card-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.apl-amount { font-size: 0.95rem; font-weight: 800; color: #0f172a; white-space: nowrap; }

.apl-billing-pill { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 6px; font-size: 0.62rem; font-weight: 700; flex-shrink: 0; }
.apl-billing-pill.monthly { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
.apl-billing-pill.yearly  { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }

.apl-status { display: inline-flex; align-items: center; gap: 4px; font-size: 0.65rem; font-weight: 700; border-radius: 100px; padding: 3px 10px; flex-shrink: 0; text-transform: capitalize; }
.apl-status.pending  { background: #fef9c3; border: 1.5px solid #fde68a; color: #854d0e; }
.apl-status.approved { background: #dcfce7; border: 1.5px solid #86efac; color: #15803d; }
.apl-status.rejected { background: #fef2f2; border: 1.5px solid #fecaca; color: #dc2626; }

.apl-chevron { width: 28px; height: 28px; min-width: 28px; border-radius: 8px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s; }
.apl-card.open .apl-chevron { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: rotate(180deg); }

.apl-card-body { border-top: 1.5px solid #f1f5f9; padding: 14px 18px 16px; background: #f8fafc; display: flex; flex-direction: column; gap: 10px; }

.apl-renewal-notice { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border-radius: 12px; border: 1.5px solid; font-size: 0.78rem; font-weight: 500; line-height: 1.55; }
.apl-renewal-notice-icon { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }

.apl-renewal-notice.renewal { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
.apl-renewal-notice.renewal .apl-renewal-notice-icon { background: #dbeafe; border-color: #bfdbfe; color: #1d4ed8; }

.apl-renewal-notice.upgrade { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.apl-renewal-notice.upgrade .apl-renewal-notice-icon { background: #dcfce7; border-color: #bbf7d0; color: #16a34a; }

.apl-renewal-notice.downgrade { background: #fff7ed; border-color: #fed7aa; color: #9a3412; }
.apl-renewal-notice.downgrade .apl-renewal-notice-icon { background: #ffedd5; border-color: #fed7aa; color: #ea580c; }

.apl-plan-box { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.apl-plan-box-left { display: flex; flex-direction: column; gap: 3px; }
.apl-plan-box-type { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
.apl-plan-box-name { font-size: 0.88rem; font-weight: 800; color: #0f172a; }
.apl-plan-box-email { font-size: 0.7rem; color: #64748b; font-weight: 500; margin-top: 1px; }
.apl-plan-box-duration { display: inline-flex; align-items: center; gap: 4px; margin-top: 2px; border-radius: 6px; padding: 2px 8px; font-size: 0.65rem; font-weight: 700; width: fit-content; }
.apl-plan-box-duration.green { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; }
.apl-plan-box-duration.blue  { background: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; }
.apl-plan-box-right { text-align: right; flex-shrink: 0; }
.apl-plan-box-price { font-size: 1.15rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
.apl-plan-box-period { font-size: 0.68rem; color: #94a3b8; font-weight: 500; }

.apl-info-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 10px 14px; display: flex; flex-direction: column; gap: 5px; }
.apl-info-row { display: flex; gap: 10px; align-items: flex-start; }
.apl-info-key { font-size: 0.68rem; font-weight: 600; color: #94a3b8; min-width: 72px; flex-shrink: 0; padding-top: 1px; }
.apl-info-val { font-size: 0.78rem; font-weight: 600; color: #0f172a; word-break: break-word; flex: 1; }
.apl-info-hr { height: 1.5px; background: #f1f5f9; border: none; margin: 2px 0; }

.apl-actions-col { display: flex; gap: 6px; padding-top: 2px; flex-wrap: wrap; }

.apl-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 280px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; gap: 8px; padding: 40px 24px; text-align: center; }
.apl-empty-icon { width: 64px; height: 64px; border-radius: 20px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.apl-empty-title { font-size: 0.9rem; font-weight: 700; color: #475569; margin: 0; }
.apl-empty-sub   { font-size: 0.775rem; color: #cbd5e1; margin: 0; }

@media (max-width: 640px) {
    .apl-title { font-size: 1.25rem; }
    .apl-card-head { padding: 12px 14px; gap: 10px; }
    .apl-card-body { padding: 14px; }
    .apl-card-right { gap: 6px; }
    .apl-amount { font-size: 0.88rem; }
    .apl-billing-pill { display: none; }
}
`;

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', info: 'i' };
    return (
        <div className={`apl-alert ${type}`}>
            <div className="apl-alert-icon">{icons[type]}</div>
            <div className="apl-alert-body">{message}</div>
            <button className="apl-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

const fmtDate = (val) => {
    if (!val) return "—";
    try {
        const d = val?.toDate ? val.toDate() : new Date(val);
        const day   = String(d.getDate()).padStart(2, "0");
        const month = d.toLocaleString("en-US", { month: "short" });
        const year  = d.getFullYear();
        const hour  = String(d.getHours()).padStart(2, "0");
        const min   = String(d.getMinutes()).padStart(2, "0");
        return `${day} ${month} ${year}, ${hour}:${min}`;
    } catch { return "—"; }
};

export default function AdminPlusApprove() {
    const [requests,    setRequests]    = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [expandedId,  setExpandedId]  = useState(null);
    const [approvingId, setApprovingId] = useState(null);
    const [decliningId, setDecliningId] = useState(null);
    const [alert,       setAlert]       = useState(null);
    const [userPreviousPlans, setUserPreviousPlans] = useState({});

    const showAlert  = (type, msg) => setAlert({ type, message: msg });
    const clearAlert = () => setAlert(null);

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, "plusRequests"),
            async snap => {
                const list = snap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                const previousPlans = {};
                for (const req of list) {
                    if (req.userId && req.isRenewal) {
                        const userApprovedRequests = list
                            .filter(r =>
                                r.userId === req.userId &&
                                r.status === "approved" &&
                                r.id !== req.id
                            )
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                        if (userApprovedRequests.length > 0) {
                            previousPlans[req.userId] = userApprovedRequests[0].billing || "monthly";
                        } else {
                            try {
                                const userDoc = await getDoc(doc(db, "users", req.userId));
                                if (userDoc.exists()) {
                                    const userData = userDoc.data();
                                    previousPlans[req.userId] = userData.plusBilling || "monthly";
                                } else {
                                    previousPlans[req.userId] = "monthly";
                                }
                            } catch (err) {
                                console.error("Error fetching user data:", err);
                                previousPlans[req.userId] = "monthly";
                            }
                        }
                    }
                }

                setUserPreviousPlans(previousPlans);
                setRequests(list);
                setLoading(false);
            },
            err => { console.error(err); showAlert("error", "Failed to load requests."); setLoading(false); }
        );
        return () => unsub();
    }, []);

    const handleApprove = async (req) => {
        setApprovingId(req.id);
        try {
            const now = new Date();
            const expiresAt = new Date(now);

            if (req.billing === "yearly") {
                expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            } else {
                expiresAt.setMonth(expiresAt.getMonth() + 1);
            }

            await updateDoc(doc(db, "users", req.userId), {
                role:              "plus",
                plusPlan:          req.plan,
                plusBilling:       req.billing,
                plusAmount:        req.amount,
                plusPaymentMethod: req.paymentMethod,
                plusTxId:          req.txId,
                plusActivatedAt:   now.toISOString(),
                plusExpiresAt:     expiresAt.toISOString(),
                plusExpired:       false,
                ...(req.isRenewal ? { plusRenewedAt: now.toISOString() } : {}),
            });

            await updateDoc(doc(db, "plusRequests", req.id), {
                status:     "approved",
                approvedAt: now.toISOString(),
            });

            setExpandedId(null);

            const expDay   = String(expiresAt.getDate()).padStart(2, "0");
            const expMonth = expiresAt.toLocaleString("en-US", { month: "short" });
            const expYear  = expiresAt.getFullYear();
            const planLabel = req.billing === "yearly" ? "Yearly — 1 Year" : "Monthly — 1 Month";

            showAlert("success",
                `Approved! Plan: ${planLabel}. Expires on ${expDay} ${expMonth} ${expYear}.`
            );
        } catch (err) {
            console.error(err);
            showAlert("error", "Failed to approve. Please try again.");
        } finally { setApprovingId(null); }
    };

    const handleReject = async (req) => {
        setDecliningId(req.id);
        try {
            await updateDoc(doc(db, "plusRequests", req.id), {
                status:     "rejected",
                rejectedAt: new Date().toISOString(),
            });
            setExpandedId(null);
            showAlert("info", "Request has been declined.");
        } catch (err) {
            console.error(err);
            showAlert("error", "Failed to decline. Please try again.");
        } finally { setDecliningId(null); }
    };

    const pendingCount = requests.filter(r => r.status === "pending").length;

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="apl-root">

                <div className="apl-header">
                    <div>
                        <h1 className="apl-title">Plus <span>Requests</span></h1>
                        <p className="apl-sub">Review payment proofs and approve Plus memberships</p>
                    </div>
                    {pendingCount > 0 && (
                        <div className="apl-count">
                            <span className="apl-count-dot" />
                            {pendingCount} pending
                        </div>
                    )}
                </div>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                {requests.length === 0 ? (
                    <div className="apl-empty">
                        <div className="apl-empty-icon"><ZapIcon size={26} style={{ color: '#cbd5e1' }} /></div>
                        <p className="apl-empty-title">No requests yet</p>
                        <p className="apl-empty-sub">Plus membership requests will appear here</p>
                    </div>
                ) : (
                    <div className="apl-list">
                        {requests.map((req, i) => {
                            const isOpen      = expandedId === req.id;
                            const isApproving = approvingId === req.id;
                            const isDeclining = decliningId === req.id;
                            const isBusy      = isApproving || isDeclining;
                            const status      = req.status || 'pending';
                            const isRenewal   = req.isRenewal === true;
                            const isYearly    = req.billing === "yearly";

                            const previousBilling = userPreviousPlans[req.userId];
                            let actionType = "new";
                            let actionText = "New Member";
                            let noticeClass = "renewal";
                            let noticeIcon = <RefreshCwIcon size={11} />;
                            let noticeText = "";

                            if (isRenewal && previousBilling) {
                                if (previousBilling === req.billing) {
                                    actionType = "renewal";
                                    actionText = "Renewal";
                                    noticeClass = "renewal";
                                    noticeIcon = <RefreshCwIcon size={11} />;
                                    noticeText = `Renewal Request — This user was previously a Plus member with a ${previousBilling} plan and is renewing with the same ${req.billing} plan.`;
                                } else if (previousBilling === "monthly" && req.billing === "yearly") {
                                    actionType = "upgrade";
                                    actionText = "Upgrade";
                                    noticeClass = "upgrade";
                                    noticeIcon = <ArrowUpIcon size={11} />;
                                    noticeText = `Upgrade Request — This user was previously on a Monthly plan and is upgrading to a Yearly plan.`;
                                } else if (previousBilling === "yearly" && req.billing === "monthly") {
                                    actionType = "downgrade";
                                    actionText = "Downgrade";
                                    noticeClass = "downgrade";
                                    noticeIcon = <ArrowDownIcon size={11} />;
                                    noticeText = `Downgrade Request — This user was previously on a Yearly plan and is downgrading to a Monthly plan.`;
                                }
                            } else if (isRenewal && !previousBilling) {
                                actionType = "renewal";
                                actionText = "Renewal";
                                noticeClass = "renewal";
                                noticeIcon = <RefreshCwIcon size={11} />;
                                noticeText = `Renewal Request — This user was previously a Plus member and is renewing their subscription.`;
                            }

                            return (
                                <div key={req.id} className={`apl-card${isOpen ? ' open' : ''} ${status !== 'pending' ? status : ''}`}>

                                    {/* ── Header ── */}
                                    <div className="apl-card-head" onClick={() => setExpandedId(isOpen ? null : req.id)}>
                                        <div className="apl-card-num">{i + 1}</div>

                                        <div className="apl-card-main">
                                            <p className="apl-card-name">{req.userName || "Unknown User"}</p>
                                            <div className="apl-card-meta">
                                                <span className="apl-card-email">{req.userEmail || req.userId}</span>
                                                <span className="apl-card-sep">·</span>
                                                <span className="apl-card-date">{fmtDate(req.createdAt)}</span>
                                            </div>
                                        </div>

                                        <div className="apl-card-right">
                                            <span className={`apl-billing-pill ${isYearly ? 'yearly' : 'monthly'}`}>
                                                {isYearly ? '📅 1 Year' : '🗓 1 Month'}
                                            </span>
                                            <span className="apl-amount">{req.currency}{req.amount}</span>
                                            <span className={`apl-status ${status}`}>
                                                {status === 'pending'  && <ClockIcon size={9} />}
                                                {status === 'approved' && <BadgeCheckIcon size={9} />}
                                                {status === 'rejected' && <XIcon size={9} />}
                                                {status === 'rejected' ? 'Declined' : status}
                                            </span>
                                            <div className="apl-chevron"><ChevronDownIcon size={14} /></div>
                                        </div>
                                    </div>

                                    {/* ── Expanded body ── */}
                                    {isOpen && (
                                        <div className="apl-card-body">

                                            {/* Action notice */}
                                            {actionType !== "new" && (
                                                <div className={`apl-renewal-notice ${noticeClass}`}>
                                                    <div className="apl-renewal-notice-icon">
                                                        {noticeIcon}
                                                    </div>
                                                    <span>
                                                        <strong>{noticeText.split('—')[0]}</strong> — {noticeText.split('—')[1]}
                                                    </span>
                                                </div>
                                            )}

                                            {/* ── Plan highlight box ── */}
                                            <div className="apl-plan-box">
                                                <div className="apl-plan-box-left">
                                                    <span className="apl-plan-box-type">{actionText}</span>
                                                    <span className="apl-plan-box-name">Plus {isYearly ? 'Yearly' : 'Monthly'} Plan</span>
                                                    <span className="apl-plan-box-email">{req.userEmail || req.userId}</span>
                                                    <span className={`apl-plan-box-duration ${isYearly ? 'green' : 'blue'}`}>
                                                        {isYearly ? '365 days · 1 Year' : '30 days · 1 Month'}
                                                    </span>
                                                </div>
                                                <div className="apl-plan-box-right">
                                                    <div className="apl-plan-box-price">{req.currency}{req.amount}</div>
                                                    <div className="apl-plan-box-period">per {isYearly ? 'year' : 'month'}</div>
                                                </div>
                                            </div>

                                            {/* Info card */}
                                            <div className="apl-info-card">
                                                <div className="apl-info-row">
                                                    <span className="apl-info-key">Method</span>
                                                    <span className="apl-info-val" style={{ fontWeight: 700, textTransform: 'capitalize' }}>{req.paymentMethod}</span>
                                                </div>
                                                <div className="apl-info-row">
                                                    <span className="apl-info-key">Sender</span>
                                                    <span className="apl-info-val">{req.senderNumber || "—"}</span>
                                                </div>
                                                <div className="apl-info-row">
                                                    <span className="apl-info-key">Merchant</span>
                                                    <span className="apl-info-val">{req.merchantNumber || "—"}</span>
                                                </div>
                                                <hr className="apl-info-hr" />
                                                <div className="apl-info-row">
                                                    <span className="apl-info-key">TxID</span>
                                                    <span className="apl-info-val" style={{ fontFamily: "monospace", letterSpacing: "0.02em" }}>{req.txId || "—"}</span>
                                                </div>
                                                <div className="apl-info-row">
                                                    <span className="apl-info-key">Submitted</span>
                                                    <span className="apl-info-val">{fmtDate(req.createdAt)}</span>
                                                </div>
                                                {req.approvedAt && (
                                                    <div className="apl-info-row">
                                                        <span className="apl-info-key">Approved</span>
                                                        <span className="apl-info-val">{fmtDate(req.approvedAt)}</span>
                                                    </div>
                                                )}
                                                {req.rejectedAt && (
                                                    <div className="apl-info-row">
                                                        <span className="apl-info-key">Rejected</span>
                                                        <span className="apl-info-val">{fmtDate(req.rejectedAt)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── Actions — শুধু pending এ দেখাবে ── */}
                                            {status === 'pending' && (
                                                <div className="apl-actions-col">
                                                    <Button
                                                        variant="outline"
                                                        disabled={isBusy}
                                                        onClick={() => handleReject(req)}
                                                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 gap-1.5 rounded-full text-xs font-bold"
                                                    >
                                                        <XIcon size={13} />
                                                        {isDeclining ? "Declining…" : "Decline"}
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        disabled={isBusy}
                                                        onClick={() => handleApprove(req)}
                                                        className="border-green-200 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 gap-1.5 rounded-full text-xs font-bold"
                                                    >
                                                        <CheckIcon size={13} />
                                                        {isApproving
                                                            ? "Approving…"
                                                            : actionType === "new"
                                                                ? `Approve · ${isYearly ? '1 Year' : '1 Month'}`
                                                                : actionType === "renewal"
                                                                    ? `Approve Renewal · ${isYearly ? '1 Year' : '1 Month'}`
                                                                    : actionType === "upgrade"
                                                                        ? `Approve Upgrade · ${isYearly ? '1 Year' : '1 Month'}`
                                                                        : `Approve Downgrade · ${isYearly ? '1 Year' : '1 Month'}`
                                                        }
                                                    </Button>
                                                </div>
                                            )}

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