import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, getDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../hooks/useAuth";

const PAYMENT_METHODS = [
    { id: "bkash",  label: "bKash",  sub: "Mobile Banking",  color: "#E2136E", lightBg: "#FDF0F6", border: "#F5B8D8", logo: "https://download.logo.wine/logo/BKash/BKash-Icon-Logo.wine.png",  fallback: "bK", placeholder: "e.g. ABC1234567" },
    { id: "nagad",  label: "Nagad",  sub: "Digital Payment", color: "#F4821F", lightBg: "#FEF5EC", border: "#FDDBB4", logo: "https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png",   fallback: "Na", placeholder: "e.g. 1234567890" },
    { id: "rocket", label: "Rocket", sub: "DBBL Mobile",     color: "#8B1FA9", lightBg: "#F8F0FC", border: "#DBAEF0", logo: "https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small_2x/rocket-color-logo-mobile-banking-icon-free-png.png", fallback: "Ro", placeholder: "e.g. DBBL1234567" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pay-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; min-height: 70vh; }

@keyframes pay-fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
@keyframes pay-slideIn { from { opacity:0; transform:translateY(-10px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes pay-spin    { to { transform:rotate(360deg); } }

.pay-hero { background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%); border-bottom: 1.5px solid #f1f5f9; padding: 56px 24px 44px; text-align: center; animation: pay-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both; }
.pay-eyebrow { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.pay-eyebrow-line { width: 36px; height: 1.5px; background: #16a34a; border-radius: 2px; }
.pay-eyebrow-text { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #16a34a; }
.pay-hero-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #0f172a; letter-spacing: -0.03em; line-height: 1.15; margin: 0 0 12px; }
.pay-hero-title span { color: #16a34a; }
.pay-hero-title span.red { color: #dc2626; }
.pay-hero-title span.orange { color: #ea580c; }
.pay-hero-sub { font-size: 0.9rem; color: #64748b; max-width: 380px; margin: 0 auto; line-height: 1.65; }

.pay-body { max-width: 800px; margin: 0 auto; padding: 48px 40px 80px; display: grid; grid-template-columns: 1fr 300px; gap: 32px; align-items: start; animation: pay-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both; }

.pay-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; font-size: 0.825rem; font-weight: 500; line-height: 1.5; margin-bottom: 16px; }
.pay-alert-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800; }
.pay-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.pay-alert.error   .pay-alert-icon { background: #fda4af; color: #9f1239; }
.pay-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.pay-alert.success .pay-alert-icon { background: #86efac; color: #14532d; }
.pay-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.pay-alert.warning .pay-alert-icon { background: #fcd34d; color: #92400e; }
.pay-alert.info    { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1e40af; }
.pay-alert.info    .pay-alert-icon { background: #93c5fd; color: #1e40af; }
.pay-alert-body { flex: 1; font-size: 0.8rem; }
.pay-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.pay-alert-close:hover { opacity: 1; }

.pay-sec-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #94a3b8; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.pay-sec-label::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

.pay-skeleton-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
.pay-skeleton-card { height: 90px; border-radius: 16px; background: linear-gradient(90deg, #f1f5f9 25%, #e8edf2 50%, #f1f5f9 75%); background-size: 200% 100%; animation: pay-shimmer 1.4s infinite; }
@keyframes pay-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.pay-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
.pay-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 16px 10px 12px; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s, background 0.18s; position: relative; min-height: 90px; }
.pay-card:hover { border-color: #e2e8f0; box-shadow: 0 6px 20px rgba(0,0,0,0.05); transform: translateY(-2px); }
.pay-card.sel { border-color: var(--mc); background: var(--mb); box-shadow: 0 0 0 1.5px var(--mc), 0 8px 24px rgba(0,0,0,0.07); transform: translateY(-2px); }
.pay-card-logo { width: 48px; height: 36px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.pay-card-name { font-size: 0.72rem; font-weight: 700; color: #0f172a; transition: color 0.18s; }
.pay-card.sel .pay-card-name { color: var(--mc); }
.pay-radio { position: absolute; top: 9px; right: 9px; width: 15px; height: 15px; border-radius: 50%; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; transition: border-color 0.18s; background: #fff; }
.pay-card.sel .pay-radio { border-color: var(--mc); }
.pay-radio-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--mc, #0f172a); opacity: 0; transform: scale(0.3); transition: opacity 0.18s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
.pay-card.sel .pay-radio-dot { opacity: 1; transform: scale(1); }

.pay-box { border-radius: 16px; padding: 18px 18px 20px; margin-bottom: 0; border: 1.5px solid; animation: pay-slideIn 0.28s cubic-bezier(0.4,0,0.2,1) both; }
.pay-box-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid rgba(0,0,0,0.06); }
.pay-box-logo { width: 40px; height: 40px; border-radius: 12px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.pay-box-title { font-size: 0.78rem; font-weight: 800; }
.pay-step { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 0.82rem; font-weight: 400; color: #475569; line-height: 1.6; }
.pay-step-n { width: 22px; height: 22px; border-radius: 50%; background: var(--mc, #0f172a); color: #fff; font-size: 0.68rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.pay-merchant { display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid; border-radius: 12px; padding: 11px 14px; margin: 6px 0 14px; font-size: 0.95rem; font-weight: 800; }
.pay-copy-btn { display: inline-flex; align-items: center; gap: 5px; margin-left: auto; padding: 5px 11px; border: 1.5px solid; border-radius: 8px; font-size: 0.68rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; background: transparent; flex-shrink: 0; }
.pay-copy-btn:hover { opacity: 0.8; }
.pay-copy-btn.copied { background: #f0fdf4 !important; border-color: #bbf7d0 !important; color: #16a34a !important; }
.pay-inputs { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); }
.pay-input-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px; display: block; }
.pay-input { width: 100%; padding: 11px 14px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.875rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #fff; outline: none; transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; box-sizing: border-box; }
.pay-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.pay-input.ok { border-color: #16a34a; background: #f0fdf4; }
.pay-input::placeholder { color: #cbd5e1; font-weight: 400; }

.pay-panel { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 22px; padding: 22px 20px; position: sticky; top: 90px; }
.pay-plan-card { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px; padding: 14px 16px; margin-bottom: 16px; }
.pay-plan-label { font-size: 0.65rem; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
.pay-plan-name  { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
.pay-plan-price-row { display: flex; align-items: baseline; gap: 2px; }
.pay-plan-amount { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; }
.pay-plan-period { font-size: 0.72rem; color: #94a3b8; font-weight: 500; margin-left: 2px; }
.pay-method-badge { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1.5px solid; border-radius: 14px; margin-bottom: 14px; }
.pay-method-badge-icon { width: 30px; height: 30px; border-radius: 9px; background: #fff; box-shadow: 0 1px 5px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.pay-method-badge-name { font-size: 0.78rem; font-weight: 700; }
.pay-method-badge-check { margin-left: auto; font-size: 0.68rem; font-weight: 700; color: #16a34a; display: flex; align-items: center; gap: 3px; }
.pay-submit { width: 100%; padding: 14px; background: #0f172a; color: #fff; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.22s; }
.pay-submit:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
.pay-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.pay-spin { animation: pay-spin 0.8s linear infinite; }
.pay-secure { text-align: center; font-size: 0.65rem; font-weight: 600; color: #cbd5e1; letter-spacing: 0.14em; text-transform: uppercase; margin-top: 10px; }

@media (max-width: 900px)  { .pay-body { grid-template-columns: 1fr; gap: 24px; } .pay-panel { position: static; } }
@media (max-width: 640px)  { .pay-body { padding: 36px 20px 60px; } }
@media (max-width: 480px)  { .pay-hero { padding: 40px 16px 32px; } .pay-body { padding: 28px 16px 48px; } }
`;

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', warning: '!', info: 'i' };
    return (
        <div className={`pay-alert ${type}`}>
            <div className="pay-alert-icon">{icons[type]}</div>
            <div className="pay-alert-body">{message}</div>
            <button className="pay-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

export default function PricingPayment() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { user: currentUser, loading: authLoading } = useCurrentUser();
    const { plan, billing, amount, currency: priceCurrency } = location.state || {};

    const [selected,        setSelected]        = useState("");
    const [senderNumber,    setSenderNumber]    = useState("");
    const [txId,            setTxId]            = useState("");
    const [logoErrors,      setLogoErrors]      = useState({});
    const [copiedNumber,    setCopiedNumber]    = useState(false);
    const [loading,         setLoading]         = useState(false);
    const [currency,        setCurrency]        = useState(priceCurrency || "৳");
    const [settingsLoading, setSettingsLoading] = useState(true);
    const [alert,           setAlert]           = useState(null);
    const [payAlert,        setPayAlert]        = useState(null);
    const [paymentNumbers,  setPaymentNumbers]  = useState({
        bkash:  { enabled: false, number: "" },
        nagad:  { enabled: false, number: "" },
        rocket: { enabled: false, number: "" },
    });

    // ── Screen states ──
    const [screen,         setScreen]         = useState(null);
    const [requestStatus,  setRequestStatus]  = useState(null);
    const [checking,       setChecking]       = useState(true);

    const showAlert    = (type, message) => setAlert({ type, message });
    const clearAlert   = () => setAlert(null);
    const showPayAlert = (type, message) => setPayAlert({ type, message });
    const clearPayAlert = () => setPayAlert(null);

    useEffect(() => {
        if (!priceCurrency) {
            getDoc(doc(db, "config", "pricing"))
                .then(snap => { if (snap.exists()) setCurrency(snap.data()?.currencySymbol ?? "৳"); })
                .catch(() => {});
        }
    }, [priceCurrency]);

    useEffect(() => {
        if (!plan || !amount) navigate("/pricing");
    }, [plan, amount, navigate]);

    // Payment settings
    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, "settings", "adminPayment"),
            (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    setPaymentNumbers({
                        bkash:  data.bkash  || { enabled: false, number: "" },
                        nagad:  data.nagad  || { enabled: false, number: "" },
                        rocket: data.rocket || { enabled: false, number: "" },
                    });
                } else {
                    setPaymentNumbers({ bkash: { enabled: false, number: "" }, nagad: { enabled: false, number: "" }, rocket: { enabled: false, number: "" } });
                }
                setSettingsLoading(false);
            },
            (err) => {
                console.error("Failed to fetch payment settings:", err);
                showAlert("error", "Failed to load payment settings. Please refresh.");
                setSettingsLoading(false);
            }
        );
        return () => unsub();
    }, []);

    // ── Main logic ──
    useEffect(() => {
        if (authLoading) return;

        const determineScreen = async () => {
            const user = currentUser;

            if (!user) {
                setChecking(false);
                setScreen("form");
                return;
            }

            try {
                const q = query(
                    collection(db, "plusRequests"),
                    where("userId", "==", user.uid)
                );
                const snap = await getDocs(q);

                if (snap.empty) {
                    setScreen("form");
                    setChecking(false);
                    return;
                }

                const docs = snap.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                const latest = docs[0];
                setRequestStatus(latest.status);

                if (latest.status === "pending") {
                    setScreen("review");
                } else if (latest.status === "approved") {
                    if (user.role === "plus" && !user.plusExpired) {
                        setScreen("review");
                    } else {
                        setScreen("form");
                    }
                } else if (latest.status === "rejected") {
                    setScreen("form");
                } else {
                    setScreen("form");
                }
            } catch (err) {
                console.error(err);
                setScreen("form");
            } finally {
                setChecking(false);
            }
        };

        determineScreen();
    }, [currentUser, authLoading]);

    useEffect(() => {
        if (selected && paymentNumbers[selected] && !paymentNumbers[selected].enabled) {
            setSelected(""); setSenderNumber(""); setTxId(""); setCopiedNumber(false);
            showAlert("info", "Selected payment method has been disabled.");
        }
    }, [paymentNumbers, selected]);

    const enabledMethods = PAYMENT_METHODS.filter(m => paymentNumbers[m.id]?.enabled);
    const activeMethod   = enabledMethods.find(m => m.id === selected);
    const merchantNumber = selected ? (paymentNumbers[selected]?.number || "") : "";

    const handleCopyNumber = (e) => {
        e?.preventDefault(); e?.stopPropagation();
        if (!merchantNumber) { showPayAlert("error", "Payment number not configured."); return; }
        try {
            navigator.clipboard.writeText(merchantNumber);
            setCopiedNumber(true);
            setTimeout(() => setCopiedNumber(false), 2000);
        } catch { showPayAlert("error", "Failed to copy number."); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearAlert(); clearPayAlert();

        if (!selected)                  { showPayAlert("error", "Please select a payment method."); return; }
        if (!merchantNumber)            { showPayAlert("error", `${activeMethod?.label} payment number not configured. Please contact admin.`); return; }
        if (!senderNumber.trim())       { showPayAlert("error", `Please enter your ${activeMethod?.label} number.`); return; }
        if (!/^01[3-9]\d{8}$/.test(senderNumber.replace(/\s/g,""))) { showPayAlert("error", "Please enter a valid mobile number (e.g. 01712345678)."); return; }
        if (!txId.trim())               { showPayAlert("error", "Please enter the Transaction ID."); return; }
        if (txId.trim().length < 5)     { showPayAlert("warning", "Transaction ID seems too short. Please verify."); return; }

        const user = getAuth().currentUser;
        if (!user) { showAlert("error", "Please login first."); navigate("/login"); return; }

        setLoading(true);
        try {
            const isRenewal = currentUser?.plusExpired === true ||
                              (!!(currentUser?.role !== "plus" && currentUser?.plusActivatedAt));

            await addDoc(collection(db, "plusRequests"), {
                userId: user.uid, userEmail: user.email,
                userName: user.displayName || "",
                plan, billing, amount, currency,
                paymentMethod: selected,
                txId: txId.trim(), senderNumber: senderNumber.trim(),
                merchantNumber, status: "pending",
                isRenewal: isRenewal,
                createdAt: new Date().toISOString(),
            });
            setRequestStatus("pending");
            setScreen("review");
        } catch (err) {
            console.error("Payment submission error:", err);
            showAlert("error", "Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (checking || authLoading) return null;

    // ════════════════════════════════════════════════
    // ── REVIEW SCREEN ──
    // ════════════════════════════════════════════════
    if (screen === "review") {
        const isApproved = requestStatus === "approved";
        const isRejected = requestStatus === "rejected";
        const isPending  = requestStatus === "pending";

        // Renewal/Upgrade/Downgrade detection
        const isRenewalUser = currentUser?.plusExpired === true ||
                              (!!(currentUser?.role !== "plus" && currentUser?.plusActivatedAt));
        
        const prevBilling = currentUser?.plusBilling || "monthly";
        const isSamePlan = !billing || billing === prevBilling;
        const isUpgrade = isRenewalUser && !isSamePlan && prevBilling === "monthly" && billing === "yearly";
        const isDowngrade = isRenewalUser && !isSamePlan && prevBilling === "yearly" && billing === "monthly";

        // Color config
        const cfg = isApproved
            ? { bg: '#f0fdf4', border: '#bbf7d0', iconBg: '#f0fdf4', iconStroke: '#16a34a', badgeBg: '#f0fdf4', badgeBorder: '#bbf7d0', badgeColor: '#14532d', dotColor: '#16a34a', infoBg: '#f0fdf4', infoBorder: '#bbf7d0', infoLabel: '#16a34a', numBg: '#f0fdf4', numBorder: '#bbf7d0', numColor: '#16a34a' }
            : isRejected
            ? { bg: '#fff1f2', border: '#fecdd3', iconBg: '#fff1f2', iconStroke: '#dc2626', badgeBg: '#fff1f2', badgeBorder: '#fecdd3', badgeColor: '#9f1239', dotColor: '#dc2626', infoBg: '#fff1f2', infoBorder: '#fecdd3', infoLabel: '#dc2626', numBg: '#fff1f2', numBorder: '#fecdd3', numColor: '#dc2626' }
            : { bg: '#fefce8', border: '#fde68a', iconBg: '#fefce8', iconStroke: '#d97706', badgeBg: '#fef9c3', badgeBorder: '#fde68a', badgeColor: '#854d0e', dotColor: '#f59e0b', infoBg: '#f8fafc', infoBorder: '#f1f5f9', infoLabel: '#94a3b8', numBg: '#f0fdf4', numBorder: '#bbf7d0', numColor: '#16a34a' };

        const heroTitle   = isApproved ? <>Payment <span>Approved</span></>
            : isRejected  ? <>Payment <span className="red">Declined</span></>
            : isUpgrade   ? <>Upgrade <span>Submitted</span></>
            : isDowngrade ? <>Downgrade <span className="orange">Submitted</span></>
            : isRenewalUser ? <>Renewal <span>Submitted</span></>
            : <>Payment <span>Submitted</span></>;

        const heroSub     = isApproved ? "Your Plus membership is now active!"
            : isRejected  ? "Your payment request was declined by admin."
            : isUpgrade   ? "Your upgrade request is being reviewed by our admin team."
            : isDowngrade ? "Your downgrade request is being reviewed by our admin team."
            : isRenewalUser ? "Your renewal request is being reviewed by our admin team."
            : "Your payment is being reviewed by our admin team.";

        const badgeLabel  = isApproved ? "Active"
            : isRejected  ? "Declined"
            : isUpgrade   ? "Upgrade Under Review"
            : isDowngrade ? "Downgrade Under Review"
            : isRenewalUser ? "Renewal Under Review"
            : "Under Review";

        const cardTitle   = isApproved ? "Plus Membership Active!"
            : isRejected  ? "Payment Declined"
            : isUpgrade   ? "Upgrade Request Submitted"
            : isDowngrade ? "Downgrade Request Submitted"
            : isRenewalUser ? "Renewal Request Submitted"
            : "Payment Under Review";

        const cardDesc    = isApproved
            ? <>Your account has been upgraded to <strong style={{ color: '#0f172a' }}>Plus membership</strong>. You can now create your store on DynamicxMart.</>
            : isRejected
            ? <>Your payment request was <strong style={{ color: '#0f172a' }}>declined</strong> by our admin team. Please submit a new payment request with a valid transaction ID.</>
            : isUpgrade
            ? <>Your upgrade to <strong style={{ color: '#0f172a' }}>Yearly plan</strong> has been submitted. Our admin team will verify and activate your new plan within <strong style={{ color: '#0f172a' }}>12 to 24 hours</strong>.</>
            : isDowngrade
            ? <>Your downgrade to <strong style={{ color: '#0f172a' }}>Monthly plan</strong> has been submitted. Our admin team will verify and update your plan within <strong style={{ color: '#0f172a' }}>12 to 24 hours</strong>.</>
            : isRenewalUser
            ? <>Your renewal payment has been submitted. Our admin team will verify and <strong style={{ color: '#0f172a' }}>reactivate your Plus membership</strong> within 12 to 24 hours.</>
            : <>Your payment has been submitted successfully. Our admin team will verify your transaction and activate your Plus membership within <strong style={{ color: '#0f172a' }}>12 to 24 hours</strong>.</>;

        return (
            <>
                <style>{CSS}</style>
                <div className="pay-root">
                    <div className="pay-hero">
                        <div className="pay-eyebrow">
                            <div className="pay-eyebrow-line" />
                            <span className="pay-eyebrow-text">Plus Membership</span>
                            <div className="pay-eyebrow-line" />
                        </div>
                        <h1 className="pay-hero-title">{heroTitle}</h1>
                        <p className="pay-hero-sub">{heroSub}</p>
                    </div>

                    <div style={{ maxWidth: 480, margin: '0 auto', padding: '48px 24px 80px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        <div style={{ background: '#fff', border: '1.5px solid #f1f5f9', borderRadius: 24, padding: '40px 32px', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>

                            {/* Icon */}
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: cfg.iconBg, border: `1.5px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                {isApproved ? (
                                    <svg width="32" height="32" fill="none" stroke={cfg.iconStroke} strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" /><polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : isRejected ? (
                                    <svg width="32" height="32" fill="none" stroke={cfg.iconStroke} strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                ) : (
                                    <svg width="32" height="32" fill="none" stroke={cfg.iconStroke} strokeWidth="1.8" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                    </svg>
                                )}
                            </div>

                            {/* Badge */}
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: cfg.badgeBg, border: `1.5px solid ${cfg.badgeBorder}`, color: cfg.badgeColor, borderRadius: 100, padding: '4px 14px', fontSize: '0.7rem', fontWeight: 700, marginBottom: 16 }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dotColor, flexShrink: 0 }} />
                                {badgeLabel}
                            </span>

                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.3px' }}>
                                {cardTitle}
                            </h2>

                            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.75, margin: '0 0 24px', fontWeight: 400 }}>
                                {cardDesc}
                            </p>

                            {/* Info box */}
                            <div style={{ background: cfg.infoBg, border: `1.5px solid ${cfg.infoBorder}`, borderRadius: 14, padding: '14px 18px', marginBottom: 24, textAlign: 'left' }}>
                                {isApproved ? (
                                    <>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: cfg.infoLabel, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>You now have access to</p>
                                        {["Create and manage your own store", "List unlimited products", "Priority customer support"].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6rem', fontWeight: 800, color: '#16a34a' }}>✓</div>
                                                <p style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                            </div>
                                        ))}
                                    </>
                                ) : isRejected ? (
                                    <>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: cfg.infoLabel, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Possible reasons for decline</p>
                                        {["Invalid or duplicate Transaction ID", "Payment amount did not match", "Incorrect sender number provided"].map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff1f2', border: '1.5px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6rem', fontWeight: 800, color: '#dc2626' }}>✕</div>
                                                <p style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{item}</p>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 700, color: cfg.infoLabel, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                                            {isUpgrade ? "Upgrade process" : isDowngrade ? "Downgrade process" : isRenewalUser ? "Renewal process" : "What happens next?"}
                                        </p>
                                        {(isUpgrade ? [
                                            "Admin verifies your upgrade payment",
                                            "Your plan switches to Yearly membership",
                                            "Your store stays active with extended access",
                                        ] : isDowngrade ? [
                                            "Admin verifies your downgrade payment",
                                            "Your plan switches to Monthly membership",
                                            "Your store stays active with updated billing",
                                        ] : isRenewalUser ? [
                                            "Admin verifies your renewal payment",
                                            "Your Plus membership gets reactivated",
                                            "Your store becomes active again",
                                        ] : [
                                            "Admin verifies your payment transaction ID",
                                            "Your account gets upgraded to Plus membership",
                                            "You can then create your store on DynamicxMart",
                                        ]).map((step, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: cfg.numBg, border: `1.5px solid ${cfg.numBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6rem', fontWeight: 800, color: cfg.numColor }}>{i + 1}</div>
                                                <p style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{step}</p>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>

                            {/* Action Button */}
                            {isApproved ? (
                                <button
                                    onClick={() => navigate("/create-store")}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: '#0f172a', color: '#fff', borderRadius: 100, fontSize: '0.84rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    Go to Create Store
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            ) : isRejected ? (
                                <button
                                    onClick={() => { setScreen("form"); setRequestStatus(null); }}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: '#dc2626', color: '#fff', borderRadius: 100, fontSize: '0.84rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    Try Again
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/")}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: '#0f172a', color: '#fff', borderRadius: 100, fontSize: '0.84rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    Back to Home
                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </>
        );
    }

    // ════════════════════════════════════════════════
    // ── PAYMENT FORM ──
    // ════════════════════════════════════════════════
    return (
        <>
            <style>{CSS}</style>
            <div className="pay-root">

                <div className="pay-hero">
                    <div className="pay-eyebrow">
                        <div className="pay-eyebrow-line" />
                        <span className="pay-eyebrow-text">Plus Membership</span>
                        <div className="pay-eyebrow-line" />
                    </div>
                    <h1 className="pay-hero-title">Complete <span>Payment</span></h1>
                    <p className="pay-hero-sub">Select your payment method and confirm your Plus membership</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="pay-body">

                        {/* ── LEFT ── */}
                        <div>
                            {requestStatus === "rejected" && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 12, background: '#fff1f2', border: '1.5px solid #fecdd3', color: '#9f1239', fontSize: '0.82rem', fontWeight: 500, marginBottom: 16 }}>
                                    <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#fda4af', color: '#9f1239', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, fontSize: '0.6rem', fontWeight: 800 }}>!</div>
                                    <span>Your previous payment request was <strong>declined</strong>. Please submit a new request with a correct Transaction ID.</span>
                                </div>
                            )}

                            {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                            <p className="pay-sec-label">Payment Method</p>

                            {settingsLoading ? (
                                <div className="pay-skeleton-grid">
                                    <div className="pay-skeleton-card" />
                                    <div className="pay-skeleton-card" />
                                    <div className="pay-skeleton-card" />
                                </div>
                            ) : enabledMethods.length > 0 ? (
                                <div className="pay-grid">
                                    {enabledMethods.map(m => (
                                        <div
                                            key={m.id}
                                            className={"pay-card" + (selected === m.id ? " sel" : "")}
                                            style={{ "--mc": m.color, "--mb": m.lightBg }}
                                            onClick={() => { setSelected(m.id); setSenderNumber(""); setTxId(""); setCopiedNumber(false); clearPayAlert(); }}
                                        >
                                            <div className="pay-radio"><div className="pay-radio-dot" /></div>
                                            <div className="pay-card-logo">
                                                {!logoErrors[m.id] ? (
                                                    <img src={m.logo} alt={m.label} style={{ maxWidth: 40, maxHeight: 34, objectFit: "contain" }} onError={() => setLogoErrors(p => ({ ...p, [m.id]: true }))} />
                                                ) : (
                                                    <span style={{ fontWeight: 800, fontSize: 11, color: m.color }}>{m.fallback}</span>
                                                )}
                                            </div>
                                            <p className="pay-card-name">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '20px 16px', background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: 14, marginBottom: 18 }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '0.84rem', fontWeight: 700, color: '#9f1239' }}>No Payment Methods Available</p>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#dc2626' }}>Please contact admin to enable payment methods.</p>
                                </div>
                            )}

                            {payAlert && <Alert type={payAlert.type} message={payAlert.message} onDismiss={clearPayAlert} />}

                            {activeMethod && (
                                <div className="pay-box" style={{ background: activeMethod.lightBg, borderColor: activeMethod.border, "--mc": activeMethod.color }}>
                                    <div className="pay-box-head">
                                        <div className="pay-box-logo">
                                            {!logoErrors[activeMethod.id] ? (
                                                <img src={activeMethod.logo} alt={activeMethod.label} style={{ width: 28, height: 28, objectFit: "contain" }} onError={() => setLogoErrors(p => ({ ...p, [activeMethod.id]: true }))} />
                                            ) : (
                                                <span style={{ fontWeight: 800, fontSize: 12, color: activeMethod.color }}>{activeMethod.fallback}</span>
                                            )}
                                        </div>
                                        <span className="pay-box-title" style={{ color: activeMethod.color }}>How to pay via {activeMethod.label}</span>
                                    </div>
                                    <div className="pay-step"><div className="pay-step-n">1</div><span>Open your <strong>{activeMethod.label}</strong> app → tap <strong>Send Money</strong></span></div>
                                    <div className="pay-step"><div className="pay-step-n">2</div><span>Send exactly <strong style={{ color: activeMethod.color }}>{currency}{amount}</strong> to our number:</span></div>
                                    <div className="pay-merchant" style={{ borderColor: activeMethod.border, color: activeMethod.color }}>
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                                        <span style={{ flex: 1 }}>{merchantNumber || "Not configured"}</span>
                                        <button type="button" className={"pay-copy-btn" + (copiedNumber ? " copied" : "")} style={{ borderColor: copiedNumber ? '#bbf7d0' : activeMethod.border, color: copiedNumber ? '#16a34a' : activeMethod.color }} onClick={handleCopyNumber} disabled={!merchantNumber}>
                                            {copiedNumber ? (<><svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Copied!</>) : (<><svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>Copy</>)}
                                        </button>
                                    </div>
                                    <div className="pay-step"><div className="pay-step-n">3</div><span>Copy the <strong>Transaction ID</strong> from your app and fill below</span></div>
                                    <div className="pay-inputs">
                                        <div>
                                            <label className="pay-input-label">Your {activeMethod.label} Number *</label>
                                            <input className={"pay-input" + (/^01[3-9]\d{8}$/.test(senderNumber.replace(/\s/g,"")) ? " ok" : "")} type="tel" placeholder="01XXXXXXXXX" maxLength={14} value={senderNumber} onChange={e => setSenderNumber(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="pay-input-label">Transaction ID (TxID) *</label>
                                            <input className={"pay-input" + (txId.length >= 6 ? " ok" : "")} placeholder={activeMethod.placeholder} value={txId} onChange={e => setTxId(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT ── */}
                        <div className="pay-panel">
                            <p className="pay-sec-label">Order Summary</p>
                            {amount && (
                                <div className="pay-plan-card">
                                    <p className="pay-plan-label">Plus Plan · {billing === "yearly" ? "Yearly" : "Monthly"}</p>
                                    <p className="pay-plan-name">Membership activation</p>
                                    <div className="pay-plan-price-row">
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{currency}</span>
                                        <span className="pay-plan-amount">{amount}</span>
                                        <span className="pay-plan-period">/{billing === "yearly" ? "yr" : "mo"}</span>
                                    </div>
                                </div>
                            )}
                            <div className="pay-method-badge" style={{ background: activeMethod?.lightBg || '#f8fafc', borderColor: activeMethod?.border || '#e2e8f0' }}>
                                <div className="pay-method-badge-icon">
                                    {activeMethod ? (
                                        !logoErrors[activeMethod.id] ? (
                                            <img src={activeMethod.logo} alt={activeMethod.label} style={{ width: 22, height: 22, objectFit: "contain" }} onError={() => setLogoErrors(p => ({ ...p, [activeMethod.id]: true }))} />
                                        ) : <span style={{ fontWeight: 800, fontSize: 9, color: activeMethod.color }}>{activeMethod.fallback}</span>
                                    ) : (
                                        <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                    )}
                                </div>
                                <span className="pay-method-badge-name" style={{ color: activeMethod?.color || '#94a3b8' }}>{activeMethod?.label || "Select method"}</span>
                                {activeMethod && txId && (
                                    <span className="pay-method-badge-check">
                                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                        TxID added
                                    </span>
                                )}
                            </div>
                            <button type="submit" className="pay-submit" disabled={loading || !selected || settingsLoading || enabledMethods.length === 0}>
                                {loading ? (
                                    <><svg className="pay-spin" width="13" height="13" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity=".8"/></svg>Activating...</>
                                ) : (
                                    <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>{selected ? "Confirm & Activate Plus" : "Select a Payment Method"}</>
                                )}
                            </button>
                            <p className="pay-secure">Secure · Encrypted · Trusted</p>
                        </div>

                    </div>
                </form>
            </div>
        </>
    );
}