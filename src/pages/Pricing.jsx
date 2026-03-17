import { Link, useNavigate } from "react-router-dom";
import { CheckIcon, ZapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getPricing } from "../lib/services/pricingService";
import { getAuth } from "firebase/auth";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pricing-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    max-width: 760px;
    margin: 0 auto;
    padding: 80px 24px 100px;
    animation: pr-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes pr-fadeUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
}

/* ── Header ── */
.pricing-head {
    text-align: center;
    margin-bottom: 40px;
    animation: pr-fadeUp 0.5s 0.05s cubic-bezier(0.4,0,0.2,1) both;
}
.pricing-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 100px; padding: 5px 14px;
    font-size: 0.75rem; font-weight: 700; color: #16a34a;
    letter-spacing: 0.4px; margin-bottom: 18px;
}
.pricing-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #16a34a; box-shadow: 0 0 6px rgba(22,163,74,0.5);
    animation: pr-pulse 2s ease-in-out infinite;
}
@keyframes pr-pulse { 0%,100%{box-shadow:0 0 3px rgba(22,163,74,0.4);}50%{box-shadow:0 0 8px rgba(22,163,74,0.7);} }

.pricing-title {
    font-size: clamp(1.75rem, 4vw, 2.4rem);
    font-weight: 800; color: #0f172a;
    letter-spacing: -1px; margin: 0 0 10px; line-height: 1.15;
}
.pricing-sub { font-size: 0.9rem; color: #94a3b8; font-weight: 400; margin: 0; }

/* ── Toggle ── */
.pricing-toggle-wrap {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; margin-bottom: 44px;
    animation: pr-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
.pricing-toggle-pill {
    display: flex; background: #f8fafc;
    border: 1.5px solid #f1f5f9; border-radius: 100px; padding: 4px; gap: 4px;
}
.pricing-toggle-btn {
    padding: 8px 20px; border-radius: 100px;
    font-size: 0.82rem; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; cursor: pointer; transition: all 0.2s;
    color: #94a3b8; background: transparent;
}
.pricing-toggle-btn.active { background: #0f172a; color: #fff; box-shadow: 0 2px 10px rgba(15,23,42,0.18); }

.pricing-save-badge {
    background: #fefce8; border: 1.5px solid #fde68a;
    color: #854d0e; font-size: 0.68rem; font-weight: 700;
    padding: 3px 10px; border-radius: 100px; white-space: nowrap;
}

/* ── Grid ── */
.pricing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    animation: pr-fadeUp 0.55s 0.14s cubic-bezier(0.4,0,0.2,1) both;
}
@media (max-width: 560px) { .pricing-grid { grid-template-columns: 1fr; } }

/* ── Card ── */
.pricing-card {
    border-radius: 24px; padding: 28px 24px;
    border: 1.5px solid #e2e8f0; background: #fff;
    display: flex; flex-direction: column; position: relative;
    transition: transform 0.22s, box-shadow 0.22s;
}
.pricing-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.07); }
.pricing-card.hot {
    border-color: #16a34a;
    background: linear-gradient(160deg, #f0fdf4 0%, #fff 60%);
    box-shadow: 0 8px 32px rgba(22,163,74,0.12);
}
.pricing-card.hot:hover { box-shadow: 0 20px 48px rgba(22,163,74,0.18); }

.pricing-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #16a34a; color: #fff;
    font-size: 0.7rem; font-weight: 700;
    padding: 5px 12px; border-radius: 100px;
    margin-bottom: 18px; width: fit-content; letter-spacing: 0.3px;
}

.pricing-plan-name {
    font-size: 0.72rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;
}

/* price */
.pricing-price-row { display: flex; align-items: baseline; gap: 3px; margin-bottom: 4px; }
.pricing-sym { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.pricing-amount { font-size: 3rem; font-weight: 800; color: #0f172a; letter-spacing: -2px; line-height: 1; transition: all 0.2s; }
.pricing-period { font-size: 0.825rem; color: #94a3b8; font-weight: 400; margin-left: 2px; }
.pricing-price-note { font-size: 0.775rem; color: #94a3b8; margin-bottom: 20px; font-weight: 400; min-height: 18px; }

.pricing-divider { border: none; border-top: 1.5px solid #f1f5f9; margin: 0 0 18px; }

/* features */
.pricing-features { display: flex; flex-direction: column; gap: 10px; flex: 1; margin-bottom: 24px; list-style: none; padding: 0; }
.pricing-feat { display: flex; align-items: center; gap: 10px; font-size: 0.84rem; color: #475569; font-weight: 500; }
.pricing-check {
    width: 20px; height: 20px; border-radius: 50%;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.pricing-card.hot .pricing-check { background: #dcfce7; border-color: #86efac; }

/* CTA */
.pricing-cta {
    display: block; text-align: center; padding: 13px;
    border-radius: 100px; font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    text-decoration: none; transition: all 0.22s; margin-top: auto;
}
.pricing-cta.free { background: #0f172a; color: #fff; box-shadow: 0 4px 14px rgba(15,23,42,0.15); }
.pricing-cta.free:hover { background: #1e293b; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15,23,42,0.22); }
.pricing-cta.plus { background: #16a34a; color: #fff; box-shadow: 0 4px 16px rgba(22,163,74,0.35); }
.pricing-cta.plus:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.42); }
.pricing-cta:active { transform: scale(0.97) !important; }

/* skeleton */
.pricing-skeleton {
    height: 36px; width: 80px; border-radius: 10px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: pr-shimmer 1.4s infinite;
}
@keyframes pr-shimmer { from{background-position:200% 0;} to{background-position:-200% 0;} }

/* ── Mobile ── */
@media (max-width: 480px) {
    .pricing-root { padding: 48px 16px 64px; }
    .pricing-card { padding: 22px 18px; border-radius: 20px; }
    .pricing-toggle-btn { padding: 8px 14px; font-size: 0.78rem; }
    .pricing-amount { font-size: 2.4rem; }
    .pricing-head { margin-bottom: 28px; }
    .pricing-toggle-wrap { margin-bottom: 28px; flex-wrap: wrap; gap: 8px; }
}
@media (max-width: 360px) {
    .pricing-amount { font-size: 2rem; }
    .pricing-feat { font-size: 0.78rem; }
}
`;

const BASE_PLANS = [
    {
        key: "free",
        name: "Free",
        priceKey: null,
        defaultPrice: "0",
        features: [
            "Browse all products",
            "Place orders",
            "Order tracking",
            "Email support",
        ],
        cta: "Get Started",
        ctaClass: "free",
        href: "/login",
        highlight: false,
    },
    {
        key: "plus",
        name: "Plus",
        priceKey: "plusMonthlyPrice",
        yearlyPriceKey: "plusYearlyPrice",
        defaultPrice: "9.99",
        features: [
            "Everything in Free",
            "Exclusive member discounts",
            "Early access to sales",
            "Priority support",
            "Create your store",
        ],
        cta: "Become Plus Member",
        ctaClass: "plus",
        href: "/login",
        highlight: true,
    },
];

export default function Pricing() {
    const [prices,   setPrices]   = useState(null);
    const [currency, setCurrency] = useState("৳");
    const [loading,  setLoading]  = useState(true);
    const [billing,  setBilling]  = useState("monthly");
    const navigate = useNavigate();

    useEffect(() => {
        getPricing()
            .then(data => {
                setPrices(data);
                setCurrency(data?.currencySymbol ?? "৳");
            })
            .catch(() => setPrices({}))
            .finally(() => setLoading(false));
    }, []);

    const getDisplayPrice = (plan) => {
        if (!plan.priceKey) return "0";
        const key  = billing === "yearly" && plan.yearlyPriceKey ? plan.yearlyPriceKey : plan.priceKey;
        const raw  = prices?.[key];
        const base = parseFloat(raw ?? plan.defaultPrice);
        if (isNaN(base)) return plan.defaultPrice;
        return base % 1 === 0 ? String(Math.floor(base)) : base.toFixed(2);
    };

    const handlePlusClick = (e) => {
        e.preventDefault();
        const user = getAuth().currentUser;
        if (!user) { navigate("/login"); return; }
        const priceKey = billing === "yearly" ? "plusYearlyPrice" : "plusMonthlyPrice";
        const amount   = prices?.[priceKey] ?? "9.99";
        navigate("/payment", { state: { plan: "plus", billing, amount, currency } });
    };

    // yearly savings %
    const yearlySavings = (() => {
        if (!prices) return null;
        const m = parseFloat(prices?.plusMonthlyPrice);
        const y = parseFloat(prices?.plusYearlyPrice);
        if (isNaN(m) || isNaN(y) || m <= 0) return null;
        const saved = Math.round((1 - y / (m * 12)) * 100);
        return saved > 0 ? saved : null;
    })();

    return (
        <>
            <style>{CSS}</style>
            <div className="pricing-root">

                {/* Header */}
                <div className="pricing-head">
                    <div className="pricing-eyebrow">
                        <span className="pricing-eyebrow-dot" />
                        Simple, transparent pricing
                    </div>
                    <h1 className="pricing-title">Choose your plan</h1>
                    <p className="pricing-sub">Start free. Upgrade when you're ready.</p>
                </div>

                {/* Toggle */}
                <div className="pricing-toggle-wrap">
                    <div className="pricing-toggle-pill">
                        <button
                            className={"pricing-toggle-btn" + (billing === "monthly" ? " active" : "")}
                            onClick={() => setBilling("monthly")}
                        >
                            Monthly
                        </button>
                        <button
                            className={"pricing-toggle-btn" + (billing === "yearly" ? " active" : "")}
                            onClick={() => setBilling("yearly")}
                        >
                            Yearly
                        </button>
                    </div>
                    {billing === "yearly" && yearlySavings && (
                        <span className="pricing-save-badge">Save {yearlySavings}%</span>
                    )}
                </div>

                {/* Cards */}
                <div className="pricing-grid">
                    {BASE_PLANS.map(plan => (
                        <div key={plan.key} className={"pricing-card" + (plan.highlight ? " hot" : "")}>

                            {plan.highlight && (
                                <div className="pricing-badge">
                                    <ZapIcon size={10} /> Most Popular
                                </div>
                            )}

                            <p className="pricing-plan-name">{plan.name}</p>

                            {/* Price */}
                            <div className="pricing-price-row">
                                <span className="pricing-sym">{loading ? "" : currency}</span>
                                {loading
                                    ? <div className="pricing-skeleton" />
                                    : <span className="pricing-amount">{getDisplayPrice(plan)}</span>
                                }
                                <span className="pricing-period">
                                    /{billing === "yearly" ? "yr" : "mo"}
                                </span>
                            </div>

                            <p className="pricing-price-note">
                                {plan.key === "free" ? "No credit card required" : "Cancel anytime"}
                            </p>

                            <hr className="pricing-divider" />

                            {/* Features */}
                            <ul className="pricing-features">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="pricing-feat">
                                        <span className="pricing-check">
                                            <CheckIcon size={11} color="#16a34a" strokeWidth={2.5} />
                                        </span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            {plan.key === "plus" ? (
                                <button
                                    onClick={handlePlusClick}
                                    className={"pricing-cta " + plan.ctaClass}
                                    style={{ border: "none", cursor: "pointer" }}
                                >
                                    {plan.cta}
                                </button>
                            ) : (
                                <Link to={plan.href} className={"pricing-cta " + plan.ctaClass}>
                                    {plan.cta}
                                </Link>
                            )}

                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}