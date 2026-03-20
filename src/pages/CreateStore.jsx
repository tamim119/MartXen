import { assets } from "../assets/assets";
import { useEffect, useState, useCallback } from "react";
import Loading from "../components/Loading";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCurrentUser } from "../hooks/useAuth";
import { getStoreByUser, createStore } from "../lib/services/storeService";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
    StoreIcon, UserIcon, TypeIcon, FileTextIcon,
    MailIcon, PhoneIcon, MapPinIcon, UploadIcon,
    ClockIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon,
    SparklesIcon, RefreshCwIcon
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.cs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 0 24px;
    margin: 48px auto 80px;
    max-width: 680px;
}
.cs-head { margin-bottom: 32px; }
.cs-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin: 0 0 8px; }
.cs-title span { color: #16a34a; }
.cs-subtitle { font-size: 0.85rem; color: #94a3b8; line-height: 1.65; margin: 0; max-width: 480px; font-weight: 400; }

.cs-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; font-size: 0.825rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.cs-alert-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800; }
.cs-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.cs-alert.error   .cs-alert-icon { background: #fda4af; color: #9f1239; }
.cs-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.cs-alert.success .cs-alert-icon { background: #86efac; color: #14532d; }
.cs-alert.info    { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1e40af; }
.cs-alert.info    .cs-alert-icon { background: #93c5fd; color: #1e40af; }
.cs-alert-body { flex: 1; font-size: 0.8rem; }
.cs-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.cs-alert-close:hover { opacity: 1; }

.cs-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 24px; padding: 32px 28px; }

.cs-logo-wrap { margin-bottom: 28px; }
.cs-logo-area { display: flex; align-items: center; gap: 20px; padding: 20px 22px; border: 1.5px solid #f1f5f9; border-radius: 18px; background: #f8fafc; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
.cs-logo-area:hover { border-color: #16a34a; background: #f0fdf4; }
.cs-logo-preview { width: 64px; height: 64px; border-radius: 14px; object-fit: cover; border: 1.5px solid #e2e8f0; flex-shrink: 0; }
.cs-logo-placeholder { width: 64px; height: 64px; border-radius: 14px; background: #fff; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #cbd5e1; flex-shrink: 0; }
.cs-logo-info { flex: 1; }
.cs-logo-title { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
.cs-logo-hint { font-size: 0.72rem; color: #94a3b8; font-weight: 400; }
.cs-logo-change { font-size: 0.72rem; font-weight: 700; color: #16a34a; margin-top: 4px; }

.cs-fields { display: flex; flex-direction: column; gap: 16px; }
.cs-field { display: flex; flex-direction: column; gap: 6px; }
.cs-label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; }
.cs-label svg { color: #94a3b8; }
.cs-input, .cs-textarea { width: 100%; padding: 12px 14px; border: 1.5px solid #f1f5f9; border-radius: 14px; font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; font-weight: 500; box-sizing: border-box; }
.cs-input::placeholder, .cs-textarea::placeholder { color: #cbd5e1; font-weight: 400; }
.cs-input:focus, .cs-textarea:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.cs-textarea { resize: none; line-height: 1.65; }
.cs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 480px) { .cs-row { grid-template-columns: 1fr; } }

.cs-dots { display: inline-flex; align-items: center; gap: 4px; }
.cs-dots span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.85); display: inline-block; animation: cs-dot 1.1s ease-in-out infinite; }
.cs-dots span:nth-child(2) { animation-delay: 0.18s; }
.cs-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes cs-dot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }

.cs-submit { width: 100%; padding: 14px; background: #16a34a; color: #fff; font-size: 0.9rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 14px; cursor: pointer; margin-top: 8px; transition: all 0.22s; box-shadow: 0 4px 16px rgba(22,163,74,0.3); display: flex; align-items: center; justify-content: center; gap: 8px; }
.cs-submit:hover:not(:disabled) { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(22,163,74,0.38); }
.cs-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.cs-status-root { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px; }

.cs-access-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 24px; max-width: 400px; width: 100%; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
.cs-access-body { padding: 32px 28px 28px; text-align: center; }
.cs-access-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.cs-access-icon.red { background: #fff1f2; border: 1.5px solid #fecdd3; color: #ef4444; }
.cs-access-icon.orange { background: #fff7ed; border: 1.5px solid #fed7aa; color: #ea580c; }
.cs-access-badge { display: inline-flex; align-items: center; gap: 6px; border-radius: 100px; padding: 4px 12px; font-size: 0.7rem; font-weight: 700; margin-bottom: 14px; }
.cs-access-badge.red { background: #fff1f2; border: 1.5px solid #fecdd3; color: #b91c1c; }
.cs-access-badge.orange { background: #fff7ed; border: 1.5px solid #fed7aa; color: #c2410c; }
.cs-access-badge-dot { width: 5px; height: 5px; border-radius: 50%; }
.cs-access-badge.red .cs-access-badge-dot { background: #ef4444; }
.cs-access-badge.orange .cs-access-badge-dot { background: #ea580c; }
.cs-access-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
.cs-access-msg { font-size: 0.82rem; color: #64748b; line-height: 1.7; margin: 0 0 20px; }
.cs-features { display: flex; flex-direction: column; gap: 7px; margin: 0 0 22px; text-align: left; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 12px 14px; }
.cs-feature { display: flex; align-items: center; gap: 9px; font-size: 0.78rem; font-weight: 500; color: #475569; }
.cs-feature-dot { width: 16px; height: 16px; border-radius: 50%; background: #f0fdf4; border: 1.5px solid #bbf7d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cs-feature-dot.warn { background: #fff7ed; border-color: #fed7aa; }

.cs-status-card { text-align: center; padding: 40px 32px 32px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 24px; box-shadow: 0 8px 40px rgba(0,0,0,0.06); max-width: 420px; width: 100%; position: relative; overflow: hidden; }

.cs-status-icon { width: 68px; height: 68px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.cs-status-icon.pending  { background: #fefce8; border: 1.5px solid #fde68a; color: #d97706; }
.cs-status-icon.approved { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; }
.cs-status-icon.rejected { background: #fff7ed; border: 1.5px solid #fed7aa; color: #ea580c; }

.cs-status-badge { display: inline-flex; align-items: center; gap: 6px; border-radius: 100px; padding: 4px 12px; font-size: 0.7rem; font-weight: 700; margin-bottom: 14px; }
.cs-status-badge.pending  { background: #fefce8; border: 1.5px solid #fde68a; color: #854d0e; }
.cs-status-badge.approved { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #15803d; }
.cs-status-badge.rejected { background: #fff7ed; border: 1.5px solid #fed7aa; color: #c2410c; }
.cs-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.cs-status-badge.pending  .cs-badge-dot { background: #f59e0b; }
.cs-status-badge.approved .cs-badge-dot { background: #16a34a; }
.cs-status-badge.rejected .cs-badge-dot { background: #ea580c; }

.cs-status-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
.cs-status-msg   { font-size: 0.82rem; color: #64748b; line-height: 1.7; margin: 0 0 22px; }

.cs-cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 100px; font-weight: 700; font-size: 0.84rem; text-decoration: none; transition: all 0.22s; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
.cs-cta-btn.green { background: #16a34a; color: #fff; box-shadow: 0 4px 14px rgba(22,163,74,0.3); }
.cs-cta-btn.green:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(22,163,74,0.38); }
.cs-cta-btn.red { background: #dc2626; color: #fff; box-shadow: 0 4px 14px rgba(220,38,38,0.3); }
.cs-cta-btn.red:hover { background: #b91c1c; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(220,38,38,0.38); }
.cs-cta-btn.ghost { background: #f1f5f9; color: #475569; box-shadow: none; }
.cs-cta-btn.ghost:hover { background: #e2e8f0; color: #0f172a; transform: translateY(-1px); }

.cs-redirect-note { font-size: 0.72rem; color: #94a3b8; display: flex; align-items: center; justify-content: center; gap: 5px; margin-top: 12px; }
.cs-redirect-note b { color: #16a34a; font-weight: 700; }

.cs-warn-items { display: flex; flex-direction: column; gap: 7px; margin: 0 0 20px; text-align: left; background: #fff7ed; border: 1.5px solid #fed7aa; border-radius: 12px; padding: 12px 14px; }
.cs-warn-item { display: flex; align-items: center; gap: 9px; font-size: 0.78rem; font-weight: 500; color: #475569; }
.cs-warn-dot { width: 16px; height: 16px; border-radius: 50%; background: #fff7ed; border: 1.5px solid #fed7aa; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.55rem; font-weight: 800; color: #ea580c; }

.cs-plan-section { margin-bottom: 20px; text-align: left; }
.cs-plan-label { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 10px; display: block; }
.cs-plan-toggle { display: flex; background: #f1f5f9; border-radius: 10px; padding: 3px; margin-bottom: 12px; }
.cs-plan-toggle-btn { flex: 1; padding: 7px 10px; border-radius: 8px; border: none; font-size: 0.75rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; background: transparent; color: #64748b; }
.cs-plan-toggle-btn.active { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
.cs-plan-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cs-plan-card { border: 1.5px solid #f1f5f9; border-radius: 14px; padding: 14px; cursor: pointer; transition: all 0.18s; background: #fff; position: relative; }
.cs-plan-card:hover { border-color: #e2e8f0; }
.cs-plan-card.selected { border-color: #dc2626; background: #fff1f2; box-shadow: 0 0 0 1.5px #dc2626; }
.cs-plan-card-name { font-size: 0.7rem; font-weight: 700; color: #64748b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.08em; }
.cs-plan-card-price { font-size: 1.3rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
.cs-plan-card-price span { font-size: 0.72rem; color: #94a3b8; font-weight: 500; }
.cs-plan-card-save { display: inline-block; font-size: 0.6rem; font-weight: 700; background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; border-radius: 6px; padding: 2px 6px; margin-top: 4px; }
.cs-plan-radio { position: absolute; top: 10px; right: 10px; width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; }
.cs-plan-card.selected .cs-plan-radio { border-color: #dc2626; }
.cs-plan-radio-dot { width: 6px; height: 6px; border-radius: 50%; background: #dc2626; opacity: 0; transform: scale(0.3); transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1); }
.cs-plan-card.selected .cs-plan-radio-dot { opacity: 1; transform: scale(1); }
.cs-plan-loading { height: 90px; border-radius: 14px; background: linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%); background-size: 200% 100%; animation: cs-shimmer 1.4s infinite; }
@keyframes cs-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ✅ Rejected info box */
.cs-rejected-info {
    background: #fff7ed;
    border: 1.5px solid #fed7aa;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 20px;
    text-align: left;
}
.cs-rejected-info-title {
    font-size: 0.78rem; font-weight: 700; color: #c2410c;
    margin-bottom: 6px; display: flex; align-items: center; gap: 6px;
}
.cs-rejected-info-text {
    font-size: 0.75rem; color: #78350f; line-height: 1.65; font-weight: 400;
}

@media (max-width: 480px) {
    .cs-root { padding: 0 14px; margin: 32px auto 60px; }
    .cs-card { padding: 22px 16px; border-radius: 18px; }
    .cs-access-body { padding: 24px 20px 22px; }
    .cs-status-card { padding: 32px 22px 28px; }
    .cs-title { font-size: 1.5rem; }
}
`;

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', info: 'i' };
    return (
        <div className={`cs-alert ${type}`}>
            <div className="cs-alert-icon">{icons[type]}</div>
            <div className="cs-alert-body">{message}</div>
            <button className="cs-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

// ✅ rejected badge/title/icon সব soft orange করা হয়েছে
const STATUS_CONFIG = {
    pending:  { icon: ClockIcon,       iconClass: 'pending',  badgeClass: 'pending',  badgeLabel: 'Under Review',  title: 'Application Under Review', cardClass: 'pending'  },
    approved: { icon: CheckCircleIcon, iconClass: 'approved', badgeClass: 'approved', badgeLabel: 'Approved',      title: 'Store Approved!',          cardClass: 'approved' },
    rejected: { icon: XCircleIcon,     iconClass: 'rejected', badgeClass: 'rejected', badgeLabel: 'Not Approved',  title: 'Application Not Approved', cardClass: 'rejected' },
};

export default function CreateStore() {
    const { user, loading: authLoading } = useCurrentUser();
    const navigate = useNavigate();

    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [status,     setStatus]     = useState("");
    const [loading,    setLoading]    = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message,    setMessage]    = useState("");
    const [alert,      setAlert]      = useState(null);
    const [countdown,  setCountdown]  = useState(3);

    const showAlert  = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    const [storeInfo, setStoreInfo] = useState({
        name: "", username: "", description: "",
        email: "", contact: "", address: "", image: ""
    });

    const onChange = (e) => { setStoreInfo(p => ({ ...p, [e.target.name]: e.target.value })); clearAlert(); };

    const fetchSellerStatus = async () => {
        if (!user) { setLoading(false); return; }

        const userIsExpired = user.plusExpired === true ||
                              (user.role === "customer" && !!user.plusActivatedAt);
        if (userIsExpired) { setLoading(false); return; }

        try {
            const store = await getStoreByUser(user.uid);
            if (store) {
                setAlreadySubmitted(true);
                setStatus(store.status);
                if (store.status === "pending") {
                    setMessage("Your store application has been submitted and is currently under review. Our admin team will review your application and get back to you within 12 to 24 hours.");
                } else if (store.status === "approved") {
                    setMessage("Your store is live! You'll be redirected to your seller dashboard shortly.");
                    setTimeout(() => navigate("/store"), 5000);
                } else if (store.status === "rejected") {
                    // ✅ Soft message
                    setMessage("Your application was not approved this time. You're welcome to review your details and resubmit a new application, or contact our support team for further assistance.");
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "approved" && alreadySubmitted) {
            setCountdown(3);
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) { clearInterval(interval); return 0; }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [status, alreadySubmitted]);

    const onSubmit = async (e) => {
        e.preventDefault();
        clearAlert();

        if (!user)                          { showAlert("error", "Please login first."); return; }
        if (!storeInfo.name.trim())         { showAlert("error", "Please enter store name."); return; }
        if (!storeInfo.username.trim())     { showAlert("error", "Please enter username."); return; }
        if (!storeInfo.description.trim())  { showAlert("error", "Please enter store description."); return; }
        if (!storeInfo.email.trim())        { showAlert("error", "Please enter email."); return; }
        if (!storeInfo.contact.trim())      { showAlert("error", "Please enter contact number."); return; }
        if (!/^01[3-9]\d{8}$/.test(storeInfo.contact.replace(/\s/g,""))) { showAlert("error", "Please enter a valid contact number (e.g. 01712345678)."); return; }
        if (!storeInfo.address.trim())      { showAlert("error", "Please enter address."); return; }

        setSubmitting(true);
        showAlert("info", "Creating your store, please wait…");

        try {
            await createStore(user.uid, {
                name: storeInfo.name, username: storeInfo.username,
                description: storeInfo.description, email: storeInfo.email,
                contact: storeInfo.contact, address: storeInfo.address,
            }, storeInfo.image || null);

            setAlreadySubmitted(true);
            setStatus("pending");
            setMessage("Your store application has been submitted and is currently under review. Our admin team will review your application and get back to you within 12 to 24 hours.");
        } catch (err) {
            console.error("Store creation error:", err);
            showAlert("error", err.message || "Failed to create store. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const [renewBilling,   setRenewBilling]   = useState("monthly");
    const [pricingData,    setPricingData]    = useState(null);
    const [pricingLoading, setPricingLoading] = useState(false);
    const [selectedPlan,   setSelectedPlan]   = useState(null);

    useEffect(() => {
        if (!authLoading) fetchSellerStatus();
    }, [user, authLoading]);

    useEffect(() => {
        if (!user) return;
        const userIsExpired = user.plusExpired === true ||
                              (user.role === "customer" && !!user.plusActivatedAt);
        if (!userIsExpired) return;

        setPricingLoading(true);
        getDoc(doc(db, "config", "pricing"))
            .then(snap => {
                if (snap.exists()) {
                    const d = snap.data();
                    setPricingData(d);
                    const defaultBilling = user?.plusBilling || "monthly";
                    setRenewBilling(defaultBilling);
                    const amt = defaultBilling === "yearly"
                        ? (d.yearlyPrice || d.yearlyAmount || d.yearly || d.plusYearlyPrice || d.plusYearly || "")
                        : (d.monthlyPrice || d.monthlyAmount || d.monthly || d.plusMonthlyPrice || d.plusMonthly || "");
                    setSelectedPlan({ billing: defaultBilling, amount: String(amt) });
                }
            })
            .catch(() => {})
            .finally(() => setPricingLoading(false));
    }, [user]);

    useEffect(() => {
        if (!pricingData) return;
        const amt = renewBilling === "yearly"
            ? (pricingData.yearlyPrice || pricingData.yearlyAmount || pricingData.yearly || pricingData.plusYearlyPrice || pricingData.plusYearly || "")
            : (pricingData.monthlyPrice || pricingData.monthlyAmount || pricingData.monthly || pricingData.plusMonthlyPrice || pricingData.plusMonthly || "");
        setSelectedPlan({ billing: renewBilling, amount: String(amt) });
    }, [renewBilling, pricingData]);

    const handleRenew = () => {
        if (!selectedPlan?.amount) { navigate("/pricing"); return; }
        navigate("/payment", {
            state: {
                plan:     "plus",
                billing:  selectedPlan.billing,
                amount:   selectedPlan.amount,
                currency: pricingData?.currencySymbol || "৳",
            },
        });
    };

    if (authLoading || loading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;

    const isExpired = user.plusExpired === true ||
                      (user.role === "customer" && !!user.plusActivatedAt);

    /* ── Expired ── */
    if (isExpired) {
        const currency   = pricingData?.currencySymbol || "৳";
        const monthlyAmt = pricingData?.monthlyPrice || pricingData?.monthlyAmount || pricingData?.monthly || pricingData?.plusMonthlyPrice || pricingData?.plusMonthly || "";
        const yearlyAmt  = pricingData?.yearlyPrice  || pricingData?.yearlyAmount  || pricingData?.yearly  || pricingData?.plusYearlyPrice  || pricingData?.plusYearly  || "";
        const yearlySaving = monthlyAmt && yearlyAmt ? Math.round((Number(monthlyAmt) * 12) - Number(yearlyAmt)) : null;

        return (
            <>
                <style>{CSS}</style>
                <div className="cs-status-root">
                    <div className="cs-access-card" style={{ maxWidth: 440 }}>
                        <div className="cs-access-body">
                            <div className="cs-access-icon orange"><XCircleIcon size={28} strokeWidth={1.8} /></div>
                            <span className="cs-access-badge orange"><span className="cs-access-badge-dot" />Subscription Expired</span>
                            <p className="cs-access-title">Your Membership Has Expired</p>
                            <p className="cs-access-msg" style={{ marginBottom: 16 }}>Renew your Plus membership to reactivate your store. Choose a plan below.</p>
                            <div className="cs-warn-items">
                                {["Your store is currently deactivated", "All your store data is safe and intact"].map((item, i) => (
                                    <div key={i} className="cs-warn-item"><div className="cs-warn-dot">!</div>{item}</div>
                                ))}
                            </div>
                            <div className="cs-plan-section">
                                <span className="cs-plan-label">Choose your plan</span>
                                <div className="cs-plan-toggle">
                                    <button className={"cs-plan-toggle-btn" + (renewBilling === "monthly" ? " active" : "")} onClick={() => setRenewBilling("monthly")} type="button">Monthly</button>
                                    <button className={"cs-plan-toggle-btn" + (renewBilling === "yearly" ? " active" : "")} onClick={() => setRenewBilling("yearly")} type="button">
                                        Yearly {yearlySaving > 0 && <span style={{color:'#16a34a', marginLeft: 4}}>· Save {currency}{yearlySaving}</span>}
                                    </button>
                                </div>
                                {pricingLoading ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <div className="cs-plan-loading" /><div className="cs-plan-loading" />
                                    </div>
                                ) : pricingData ? (
                                    <div className="cs-plan-cards">
                                        <div className={"cs-plan-card" + (renewBilling === "monthly" ? " selected" : "")} onClick={() => setRenewBilling("monthly")}>
                                            <div className="cs-plan-radio"><div className="cs-plan-radio-dot" /></div>
                                            <div className="cs-plan-card-name">Monthly</div>
                                            <div className="cs-plan-card-price">{currency}{monthlyAmt || "—"}<span>/mo</span></div>
                                        </div>
                                        <div className={"cs-plan-card" + (renewBilling === "yearly" ? " selected" : "")} onClick={() => setRenewBilling("yearly")}>
                                            <div className="cs-plan-radio"><div className="cs-plan-radio-dot" /></div>
                                            <div className="cs-plan-card-name">Yearly</div>
                                            <div className="cs-plan-card-price">{currency}{yearlyAmt || "—"}<span>/yr</span></div>
                                            {yearlySaving > 0 && <div className="cs-plan-card-save">Save {currency}{yearlySaving}</div>}
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center', margin: '8px 0' }}>
                                        Could not load pricing. <span style={{ color: '#dc2626', cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate("/pricing")}>View on pricing page →</span>
                                    </p>
                                )}
                            </div>
                            {(() => {
                                const prevBilling = user?.plusBilling || "monthly";
                                let actionText = "Renew";
                                if (prevBilling !== renewBilling) {
                                    actionText = prevBilling === "monthly" && renewBilling === "yearly" ? "Upgrade" : "Downgrade";
                                }
                                return (
                                    <button onClick={handleRenew} className="cs-cta-btn red" disabled={!selectedPlan?.amount} style={{ width: '100%', justifyContent: 'center', opacity: !selectedPlan?.amount ? 0.5 : 1 }}>
                                        <RefreshCwIcon size={14} />
                                        {actionText} — Pay {currency}{selectedPlan?.amount || "…"} / {renewBilling === "yearly" ? "yr" : "mo"}
                                        <ArrowRightIcon size={13} />
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    /* ── Not plus ── */
    if (user.role !== "plus" && user.role !== "seller") {
        return (
            <>
                <style>{CSS}</style>
                <div className="cs-status-root">
                    <div className="cs-access-card">
                        <div className="cs-access-body">
                            <div className="cs-access-icon red"><XCircleIcon size={28} strokeWidth={1.8} /></div>
                            <span className="cs-access-badge red"><span className="cs-access-badge-dot" />Access Denied</span>
                            <p className="cs-access-title">Plus Membership Required</p>
                            <p className="cs-access-msg">You need an active Plus membership to open a store on MartXen. Upgrade now and start selling today.</p>
                            <div className="cs-features">
                                {[
                                    "Create and manage your own online store",
                                    "List unlimited products with images",
                                    "Receive orders and manage deliveries",
                                    "Access seller analytics & earnings",
                                ].map((feat, i) => (
                                    <div key={i} className="cs-feature">
                                        <div className="cs-feature-dot">
                                            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        {feat}
                                    </div>
                                ))}
                            </div>
                            <Link to="/pricing" className="cs-cta-btn green">
                                <SparklesIcon size={14} /> Get Plus Membership <ArrowRightIcon size={13} />
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    /* ── Already submitted ── */
    if (alreadySubmitted) {
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.approved;
        const StatusIcon = cfg.icon;
        return (
            <>
                <style>{CSS}</style>
                <div className="cs-status-root">
                    <div className={`cs-status-card ${cfg.cardClass}`}>
                        <div className={`cs-status-icon ${cfg.iconClass}`}>
                            <StatusIcon size={28} strokeWidth={1.8} />
                        </div>
                        <span className={`cs-status-badge ${cfg.badgeClass}`}>
                            <span className="cs-badge-dot" />
                            {cfg.badgeLabel}
                        </span>
                        <p className="cs-status-title">{cfg.title}</p>
                        <p className="cs-status-msg">{message}</p>

                        {status === "approved" && (
                            <>
                                <Link to="/store" className="cs-cta-btn green">
                                    <StoreIcon size={14} /> Go to Dashboard <ArrowRightIcon size={13} />
                                </Link>
                                <p className="cs-redirect-note">
                                    <ArrowRightIcon size={11} />
                                    Auto-redirecting in <b>{countdown} second{countdown !== 1 ? 's' : ''}</b>
                                </p>
                            </>
                        )}

                        {status === "pending" && (
                            <Link to="/" className="cs-cta-btn green">
                                Back to Home <ArrowRightIcon size={13} />
                            </Link>
                        )}

                        {/* ✅ Rejected — resubmit option */}
                        {status === "rejected" && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', alignItems: 'center' }}>
                                {/* Info box */}
                                <div className="cs-rejected-info">
                                    <div className="cs-rejected-info-title">
                                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="#c2410c" strokeWidth="1.5"/>
                                            <path d="M8 5v3.5M8 11h.01" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round"/>
                                        </svg>
                                        What you can do
                                    </div>
                                    <p className="cs-rejected-info-text">
                                        Review your store details, make sure all information is accurate and complete, then resubmit your application. You can also reach out to our support team for guidance.
                                    </p>
                                </div>
                                <button
                                    className="cs-cta-btn green"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={() => { setAlreadySubmitted(false); setStatus(""); setStoreInfo({ name: "", username: "", description: "", email: "", contact: "", address: "", image: "" }); }}
                                >
                                    <StoreIcon size={14} /> Resubmit Application <ArrowRightIcon size={13} />
                                </button>
                                <Link to="/" className="cs-cta-btn ghost" style={{ width: '100%', justifyContent: 'center' }}>
                                    Back to Home
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    /* ── Create store form ── */
    return (
        <>
            <style>{CSS}</style>
            <div className="cs-root">
                <div className="cs-head">
                    <h1 className="cs-title">Create your <span>Store</span></h1>
                    <p className="cs-subtitle">Fill in your store details and start selling immediately on MartXen.</p>
                </div>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                <div className="cs-card">
                    <form onSubmit={onSubmit}>
                        <div className="cs-logo-wrap">
                            <label className="cs-logo-area">
                                {storeInfo.image ? (
                                    <img src={URL.createObjectURL(storeInfo.image)} className="cs-logo-preview" alt="Store logo" />
                                ) : (
                                    <div className="cs-logo-placeholder"><StoreIcon size={24} strokeWidth={1.5} /></div>
                                )}
                                <div className="cs-logo-info">
                                    <div className="cs-logo-title"><UploadIcon size={13} />{storeInfo.image ? 'Change Logo' : 'Upload Store Logo'}</div>
                                    <div className="cs-logo-hint">PNG, JPG up to 5MB · optional</div>
                                    {storeInfo.image && <div className="cs-logo-change">Click to change</div>}
                                </div>
                                <input type="file" accept="image/*" hidden onChange={e => setStoreInfo(p => ({ ...p, image: e.target.files[0] }))} />
                            </label>
                        </div>

                        <div className="cs-fields">
                            <div className="cs-row">
                                <div className="cs-field">
                                    <label className="cs-label"><UserIcon size={12} /> Username</label>
                                    <input className="cs-input" name="username" type="text" placeholder="happyshop" value={storeInfo.username} onChange={onChange} />
                                </div>
                                <div className="cs-field">
                                    <label className="cs-label"><TypeIcon size={12} /> Store Name</label>
                                    <input className="cs-input" name="name" type="text" placeholder="Happy Shop" value={storeInfo.name} onChange={onChange} />
                                </div>
                            </div>
                            <div className="cs-field">
                                <label className="cs-label"><FileTextIcon size={12} /> Description</label>
                                <textarea className="cs-textarea" name="description" rows={4} placeholder="Tell customers what your store is about..." value={storeInfo.description} onChange={onChange} />
                            </div>
                            <div className="cs-row">
                                <div className="cs-field">
                                    <label className="cs-label"><MailIcon size={12} /> Email</label>
                                    <input className="cs-input" name="email" type="email" placeholder="store@example.com" value={storeInfo.email} onChange={onChange} />
                                </div>
                                <div className="cs-field">
                                    <label className="cs-label"><PhoneIcon size={12} /> Contact</label>
                                    <input className="cs-input" name="contact" type="text" placeholder="01712345678" value={storeInfo.contact} onChange={onChange} />
                                </div>
                            </div>
                            <div className="cs-field">
                                <label className="cs-label"><MapPinIcon size={12} /> Address</label>
                                <textarea className="cs-textarea" name="address" rows={3} placeholder="123 Main St, Dhaka, Bangladesh" value={storeInfo.address} onChange={onChange} />
                            </div>
                            <button type="submit" className="cs-submit" disabled={submitting}>
                                {submitting ? <span className="cs-dots"><span /><span /><span /></span> : <><StoreIcon size={16} /> Create Store</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}