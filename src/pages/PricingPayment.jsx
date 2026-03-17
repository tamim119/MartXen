import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, getDoc, addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFloatingToast } from "../components/FloatingToastProvider";
import { useNavigate, useLocation } from "react-router-dom";

const PAYMENT_METHODS = [
    {
        id: "bkash",
        label: "bKash",
        sub: "Mobile Banking",
        color: "#E2136E",
        lightBg: "#FDF0F6",
        border: "#F5B8D8",
        logo: "https://download.logo.wine/logo/BKash/BKash-Icon-Logo.wine.png",
        fallback: "bK",
        placeholder: "e.g. ABC1234567",
    },
    {
        id: "nagad",
        label: "Nagad",
        sub: "Digital Payment",
        color: "#F4821F",
        lightBg: "#FEF5EC",
        border: "#FDDBB4",
        logo: "https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png",
        fallback: "Na",
        placeholder: "e.g. 1234567890",
    },
    {
        id: "rocket",
        label: "Rocket",
        sub: "DBBL Mobile",
        color: "#8B1FA9",
        lightBg: "#F8F0FC",
        border: "#DBAEF0",
        logo: "https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small_2x/rocket-color-logo-mobile-banking-icon-free-png.png",
        fallback: "Ro",
        placeholder: "e.g. DBBL1234567",
    },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pay-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff; min-height: 70vh;
}

@keyframes pay-fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
@keyframes pay-slideIn { from { opacity:0; transform:translateY(-10px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes pay-spin    { to { transform:rotate(360deg); } }

/* ── Hero ── */
.pay-hero {
    background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%);
    border-bottom: 1.5px solid #f1f5f9;
    padding: 56px 24px 44px; text-align: center;
    animation: pay-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
.pay-eyebrow { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.pay-eyebrow-line { width: 36px; height: 1.5px; background: #16a34a; border-radius: 2px; }
.pay-eyebrow-text { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #16a34a; }
.pay-hero-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #0f172a; letter-spacing: -0.03em; line-height: 1.15; margin: 0 0 12px; }
.pay-hero-title span { color: #16a34a; }
.pay-hero-sub { font-size: 0.9rem; color: #64748b; max-width: 380px; margin: 0 auto; line-height: 1.65; }

/* ── Body ── */
.pay-body {
    max-width: 800px; margin: 0 auto;
    padding: 48px 40px 80px;
    display: grid; grid-template-columns: 1fr 300px;
    gap: 32px; align-items: start;
    animation: pay-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}

/* ── Section label ── */
.pay-sec-label {
    font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.14em; color: #94a3b8;
    margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
}
.pay-sec-label::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

/* ── Method grid ── */
.pay-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 10px; margin-bottom: 18px;
}
.pay-card {
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 16px; padding: 16px 10px 12px;
    cursor: pointer; display: flex; flex-direction: column;
    align-items: center; gap: 8px; text-align: center;
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s, background 0.18s;
    position: relative; min-height: 90px;
}
.pay-card:hover { border-color: #e2e8f0; box-shadow: 0 6px 20px rgba(0,0,0,0.05); transform: translateY(-2px); }
.pay-card.sel {
    border-color: var(--mc); background: var(--mb);
    box-shadow: 0 0 0 1.5px var(--mc), 0 8px 24px rgba(0,0,0,0.07);
    transform: translateY(-2px);
}
.pay-card-logo {
    width: 48px; height: 36px; display: flex;
    align-items: center; justify-content: center; overflow: hidden;
}
.pay-card-name { font-size: 0.72rem; font-weight: 700; color: #0f172a; transition: color 0.18s; }
.pay-card.sel .pay-card-name { color: var(--mc); }

.pay-radio {
    position: absolute; top: 9px; right: 9px;
    width: 15px; height: 15px; border-radius: 50%;
    border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.18s; background: #fff;
}
.pay-card.sel .pay-radio { border-color: var(--mc); }
.pay-radio-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--mc, #0f172a);
    opacity: 0; transform: scale(0.3);
    transition: opacity 0.18s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
}
.pay-card.sel .pay-radio-dot { opacity: 1; transform: scale(1); }

/* ── Instructions box ── */
.pay-box {
    border-radius: 16px; padding: 18px 18px 20px;
    margin-bottom: 0; border: 1.5px solid;
    animation: pay-slideIn 0.28s cubic-bezier(0.4,0,0.2,1) both;
}
.pay-box-head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; padding-bottom: 14px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
}
.pay-box-logo {
    width: 40px; height: 40px; border-radius: 12px;
    background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
}
.pay-box-title { font-size: 0.78rem; font-weight: 800; }

.pay-step {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 12px; font-size: 0.82rem;
    font-weight: 400; color: #475569; line-height: 1.6;
}
.pay-step-n {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--mc, #0f172a); color: #fff;
    font-size: 0.68rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
}

/* merchant number */
.pay-merchant {
    display: flex; align-items: center; gap: 8px;
    background: #fff; border: 1.5px solid;
    border-radius: 12px; padding: 11px 14px;
    margin: 6px 0 14px; font-size: 0.95rem; font-weight: 800;
}
.pay-copy-btn {
    display: inline-flex; align-items: center; gap: 5px;
    margin-left: auto; padding: 5px 11px;
    border: 1.5px solid; border-radius: 8px;
    font-size: 0.68rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; transition: all 0.18s;
    background: transparent; flex-shrink: 0;
}
.pay-copy-btn:hover { opacity: 0.8; }
.pay-copy-btn.copied { background: #f0fdf4 !important; border-color: #bbf7d0 !important; color: #16a34a !important; }

/* inputs */
.pay-inputs { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); }
.pay-input-label { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px; display: block; }
.pay-input {
    width: 100%; padding: 11px 14px; border: 1.5px solid #f1f5f9;
    border-radius: 12px; font-size: 0.875rem; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a; background: #fff; outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; box-sizing: border-box;
}
.pay-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.pay-input.ok { border-color: #16a34a; background: #f0fdf4; }
.pay-input::placeholder { color: #cbd5e1; font-weight: 400; }

/* ── Right panel ── */
.pay-panel {
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 22px; padding: 22px 20px;
    position: sticky; top: 90px;
}

/* plan summary */
.pay-plan-card {
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 14px; padding: 14px 16px; margin-bottom: 16px;
}
.pay-plan-label { font-size: 0.65rem; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
.pay-plan-name  { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
.pay-plan-price-row { display: flex; align-items: baseline; gap: 2px; }
.pay-plan-amount { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; }
.pay-plan-period { font-size: 0.72rem; color: #94a3b8; font-weight: 500; margin-left: 2px; }

/* pay badge row */
.pay-method-badge {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border: 1.5px solid; border-radius: 14px;
    margin-bottom: 14px;
}
.pay-method-badge-icon {
    width: 30px; height: 30px; border-radius: 9px;
    background: #fff; box-shadow: 0 1px 5px rgba(0,0,0,0.1);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; flex-shrink: 0;
}
.pay-method-badge-name { font-size: 0.78rem; font-weight: 700; }
.pay-method-badge-check { margin-left: auto; font-size: 0.68rem; font-weight: 700; color: #16a34a; display: flex; align-items: center; gap: 3px; }

/* submit */
.pay-submit {
    width: 100%; padding: 14px; background: #0f172a; color: #fff;
    font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.22s;
}
.pay-submit:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
.pay-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.pay-spin { animation: pay-spin 0.8s linear infinite; }
.pay-secure { text-align: center; font-size: 0.65rem; font-weight: 600; color: #cbd5e1; letter-spacing: 0.14em; text-transform: uppercase; margin-top: 10px; }

.pay-empty {
    padding: 40px 20px; text-align: center;
    background: #fef2f2; border: 1.5px solid #fecaca;
    border-radius: 16px; margin-bottom: 18px;
}
.pay-empty-title { font-size: 0.9rem; font-weight: 700; color: #991b1b; margin: 0 0 8px; }
.pay-empty-text { font-size: 0.82rem; color: #dc2626; margin: 0; }

@media (max-width: 900px)  { .pay-body { grid-template-columns: 1fr; gap: 24px; } .pay-panel { position: static; } }
@media (max-width: 640px)  { .pay-body { padding: 36px 20px 60px; } }
@media (max-width: 480px)  { .pay-hero { padding: 40px 16px 32px; } .pay-body { padding: 28px 16px 48px; } .pay-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } }
`;

export default function PricingPayment() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { showToast } = useFloatingToast();
    const { plan, billing, amount, currency: priceCurrency } = location.state || {};

    const [selected,      setSelected]      = useState("");
    const [senderNumber,  setSenderNumber]  = useState("");
    const [txId,          setTxId]          = useState("");
    const [logoErrors,    setLogoErrors]    = useState({});
    const [copiedNumber,  setCopiedNumber]  = useState(false);
    const [loading,       setLoading]       = useState(false);
    const [currency,      setCurrency]      = useState(priceCurrency || "৳");
    const [paymentNumbers, setPaymentNumbers] = useState({
        bkash:  { enabled: false, number: "" },
        nagad:  { enabled: false, number: "" },
        rocket: { enabled: false, number: "" },
    });

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

    // Admin payment settings fetch করা হচ্ছে - Real-time listener
    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, "settings", "adminPayment"),
            (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    console.log("Payment settings updated:", data);
                    setPaymentNumbers({
                        bkash:  data.bkash  || { enabled: false, number: "" },
                        nagad:  data.nagad  || { enabled: false, number: "" },
                        rocket: data.rocket || { enabled: false, number: "" },
                    });
                } else {
                    console.log("No payment settings found");
                    setPaymentNumbers({
                        bkash:  { enabled: false, number: "" },
                        nagad:  { enabled: false, number: "" },
                        rocket: { enabled: false, number: "" },
                    });
                }
            },
            (err) => {
                console.error("Failed to fetch admin payment settings:", err);
                showToast("Failed to load payment settings", "error");
            }
        );

        return () => unsub();
    }, [showToast]);

    // যদি selected method disable হয়ে যায়, তাহলে selection clear করে দাও
    useEffect(() => {
        if (selected && paymentNumbers[selected] && !paymentNumbers[selected].enabled) {
            console.log(`Selected method ${selected} is now disabled, clearing selection`);
            setSelected("");
            setSenderNumber("");
            setTxId("");
            setCopiedNumber(false);
            showToast("Selected payment method has been disabled", "info");
        }
    }, [paymentNumbers, selected, showToast]);

    // Filter করে শুধু enabled methods দেখানো হবে
    const enabledMethods = PAYMENT_METHODS.filter(m => paymentNumbers[m.id]?.enabled);
    const activeMethod   = enabledMethods.find(m => m.id === selected);
    const merchantNumber = selected ? (paymentNumbers[selected]?.number || "Not set") : "";

    const handleCopyNumber = (e) => {
        e?.preventDefault(); 
        e?.stopPropagation();
        
        if (!merchantNumber || merchantNumber === "Not set") {
            showToast("Payment number not configured", "error");
            return;
        }
        
        try {
            navigator.clipboard.writeText(merchantNumber);
            setCopiedNumber(true);
            showToast(`${activeMethod?.label} number copied!`, "success");
            setTimeout(() => setCopiedNumber(false), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
            showToast("Failed to copy number", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selected) { 
            showToast("Please select a payment method", "error"); 
            return; 
        }
        
        if (!merchantNumber || merchantNumber === "Not set") { 
            showToast(`${activeMethod?.label} payment number not configured. Please contact admin.`, "error"); 
            return; 
        }
        
        if (!senderNumber.trim()) { 
            showToast(`Please enter your ${activeMethod?.label} number`, "error"); 
            return; 
        }
        
        if (!txId.trim()) { 
            showToast("Please enter the Transaction ID", "error"); 
            return; 
        }

        const user = getAuth().currentUser;
        if (!user) { 
            showToast("Please login first", "error"); 
            navigate("/login"); 
            return; 
        }

        setLoading(true);
        
        try {
            await addDoc(collection(db, "plusRequests"), {
                userId:        user.uid,
                userEmail:     user.email,
                userName:      user.displayName || "",
                plan, billing, amount, currency,
                paymentMethod: selected,
                txId:          txId.trim(),
                senderNumber:  senderNumber.trim(),
                merchantNumber,
                status:        "pending",
                createdAt:     new Date().toISOString(),
            });
            
            showToast("🎉 Request submitted! Waiting for admin approval.", "success");
            navigate("/");
        } catch (err) {
            console.error("Payment submission error:", err);
            showToast("Failed to submit. Please try again.", "error");
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="pay-root">

                {/* Hero */}
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
                            <p className="pay-sec-label">Payment Method</p>

                            {/* Method cards - শুধু enabled methods দেখাবে */}
                            {enabledMethods.length > 0 ? (
                                <div className="pay-grid">
                                    {enabledMethods.map(m => (
                                        <div
                                            key={m.id}
                                            className={"pay-card" + (selected === m.id ? " sel" : "")}
                                            style={{ "--mc": m.color, "--mb": m.lightBg }}
                                            onClick={() => { 
                                                setSelected(m.id); 
                                                setSenderNumber(""); 
                                                setTxId(""); 
                                                setCopiedNumber(false); 
                                            }}
                                        >
                                            <div className="pay-radio"><div className="pay-radio-dot" /></div>
                                            <div className="pay-card-logo">
                                                {!logoErrors[m.id] ? (
                                                    <img
                                                        src={m.logo} alt={m.label}
                                                        style={{ maxWidth: 40, maxHeight: 34, objectFit: "contain" }}
                                                        onError={() => setLogoErrors(p => ({ ...p, [m.id]: true }))}
                                                    />
                                                ) : (
                                                    <span style={{ fontWeight: 800, fontSize: 11, color: m.color }}>{m.fallback}</span>
                                                )}
                                            </div>
                                            <p className="pay-card-name">{m.label}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="pay-empty">
                                    <p className="pay-empty-title">No Payment Methods Available</p>
                                    <p className="pay-empty-text">
                                        Please contact admin to enable payment methods.
                                    </p>
                                </div>
                            )}

                            {/* Instructions */}
                            {activeMethod && (
                                <div
                                    className="pay-box"
                                    style={{
                                        background: activeMethod.lightBg,
                                        borderColor: activeMethod.border,
                                        "--mc": activeMethod.color,
                                    }}
                                >
                                    <div className="pay-box-head">
                                        <div className="pay-box-logo">
                                            {!logoErrors[activeMethod.id] ? (
                                                <img
                                                    src={activeMethod.logo} alt={activeMethod.label}
                                                    style={{ width: 28, height: 28, objectFit: "contain" }}
                                                    onError={() => setLogoErrors(p => ({ ...p, [activeMethod.id]: true }))}
                                                />
                                            ) : (
                                                <span style={{ fontWeight: 800, fontSize: 12, color: activeMethod.color }}>{activeMethod.fallback}</span>
                                            )}
                                        </div>
                                        <span className="pay-box-title" style={{ color: activeMethod.color }}>
                                            How to pay via {activeMethod.label}
                                        </span>
                                    </div>

                                    <div className="pay-step">
                                        <div className="pay-step-n">1</div>
                                        <span>Open your <strong>{activeMethod.label}</strong> app → tap <strong>Send Money</strong></span>
                                    </div>
                                    <div className="pay-step">
                                        <div className="pay-step-n">2</div>
                                        <span>Send exactly <strong style={{ color: activeMethod.color }}>{currency}{amount}</strong> to our number:</span>
                                    </div>

                                    <div className="pay-merchant" style={{ borderColor: activeMethod.border, color: activeMethod.color }}>
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                                        </svg>
                                        <span style={{ flex: 1 }}>{merchantNumber}</span>
                                        <button
                                            type="button"
                                            className={"pay-copy-btn" + (copiedNumber ? " copied" : "")}
                                            style={{
                                                borderColor: copiedNumber ? '#bbf7d0' : activeMethod.border,
                                                color: copiedNumber ? '#16a34a' : activeMethod.color,
                                            }}
                                            onClick={handleCopyNumber}
                                            disabled={!merchantNumber || merchantNumber === "Not set"}
                                        >
                                            {copiedNumber ? (
                                                <>
                                                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="pay-step">
                                        <div className="pay-step-n">3</div>
                                        <span>Copy the <strong>Transaction ID</strong> from your app and fill below</span>
                                    </div>

                                    <div className="pay-inputs">
                                        <div>
                                            <label className="pay-input-label">Your {activeMethod.label} Number *</label>
                                            <input
                                                className={"pay-input" + (senderNumber.length >= 11 ? " ok" : "")}
                                                type="tel" placeholder="01XXXXXXXXX" maxLength={14}
                                                value={senderNumber}
                                                onChange={e => setSenderNumber(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="pay-input-label">Transaction ID (TxID) *</label>
                                            <input
                                                className={"pay-input" + (txId.length >= 6 ? " ok" : "")}
                                                placeholder={activeMethod.placeholder}
                                                value={txId}
                                                onChange={e => setTxId(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT panel ── */}
                        <div className="pay-panel">
                            <p className="pay-sec-label">Order Summary</p>

                            {/* Plan card */}
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

                            {/* Selected payment badge */}
                            <div
                                className="pay-method-badge"
                                style={{
                                    background: activeMethod?.lightBg || '#f8fafc',
                                    borderColor: activeMethod?.border || '#e2e8f0',
                                }}
                            >
                                <div className="pay-method-badge-icon">
                                    {activeMethod ? (
                                        !logoErrors[activeMethod.id] ? (
                                            <img
                                                src={activeMethod.logo} alt={activeMethod.label}
                                                style={{ width: 22, height: 22, objectFit: "contain" }}
                                                onError={() => setLogoErrors(p => ({ ...p, [activeMethod.id]: true }))}
                                            />
                                        ) : (
                                            <span style={{ fontWeight: 800, fontSize: 9, color: activeMethod.color }}>{activeMethod.fallback}</span>
                                        )
                                    ) : (
                                        <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <rect x="1" y="4" width="22" height="16" rx="2"/>
                                            <line x1="1" y1="10" x2="23" y2="10"/>
                                        </svg>
                                    )}
                                </div>
                                <span
                                    className="pay-method-badge-name"
                                    style={{ color: activeMethod?.color || '#94a3b8' }}
                                >
                                    {activeMethod?.label || "Select method"}
                                </span>
                                {activeMethod && txId && (
                                    <span className="pay-method-badge-check">
                                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                        TxID added
                                    </span>
                                )}
                            </div>

                            {/* Submit */}
                            <button type="submit" className="pay-submit" disabled={loading || !selected || enabledMethods.length === 0}>
                                {loading ? (
                                    <>
                                        <svg className="pay-spin" width="13" height="13" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2"/>
                                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity=".8"/>
                                        </svg>
                                        Activating...
                                    </>
                                ) : (
                                    <>
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                                        {selected ? "Confirm & Activate Plus" : "Select a Payment Method"}
                                    </>
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