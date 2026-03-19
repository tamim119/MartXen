import { PencilIcon, CheckIcon, XIcon, ZapIcon, SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getPricing, updatePricing } from "../../lib/services/pricingService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.apr-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    margin-bottom: 80px;
    max-width: 640px;
}

.apr-title    { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 6px; }
.apr-title span { color: #0f172a; font-weight: 800; }
.apr-subtitle { font-size: 0.82rem; color: #94a3b8; margin: 0 0 28px; font-weight: 400; }

/* ── Alert ── */
.apr-alert { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.apr-alert-icon { width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.6rem; font-weight: 800; }
.apr-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.apr-alert.error   .apr-alert-icon { background: #fda4af; color: #9f1239; }
.apr-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.apr-alert.success .apr-alert-icon { background: #86efac; color: #14532d; }
.apr-alert-body { flex: 1; }
.apr-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.9rem; color: inherit; transition: opacity 0.15s; }
.apr-alert-close:hover { opacity: 1; }

/* ── Section label ── */
.apr-sec { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #94a3b8; margin: 0 0 12px; display: flex; align-items: center; gap: 8px; }
.apr-sec::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

/* ── Currency card ── */
.apr-cur-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; padding: 18px 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: border-color 0.18s; }
.apr-cur-card.editing { border-color: #16a34a; background: #f0fdf4; }
.apr-cur-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
.apr-cur-sub  { font-size: 0.72rem; color: #94a3b8; font-weight: 400; }
.apr-cur-right { display: flex; align-items: center; gap: 8px; }
.apr-cur-val  { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }

/* ── Plan cards ── */
.apr-plans { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
@media (max-width: 500px) { .apr-plans { grid-template-columns: 1fr; } }

.apr-plan-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; padding: 20px; transition: border-color 0.18s, background 0.18s; position: relative; overflow: hidden; }
.apr-plan-card.active  { border-color: #bbf7d0; background: linear-gradient(140deg, #f0fdf4 0%, #fff 70%); }
.apr-plan-card.editing { border-color: #16a34a; background: #f0fdf4; }
.apr-plan-card::before { content: ''; position: absolute; top: -20px; right: -20px; width: 72px; height: 72px; border-radius: 50%; background: rgba(22,163,74,0.07); pointer-events: none; }

.apr-plan-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; border-radius: 100px; padding: 3px 10px; margin-bottom: 14px; }
.apr-plan-price-row { display: flex; align-items: baseline; gap: 2px; margin-bottom: 4px; }
.apr-plan-cur    { font-size: 0.9rem; font-weight: 700; color: #64748b; }
.apr-plan-price  { font-size: 2rem; font-weight: 800; color: #0f172a; letter-spacing: -0.04em; line-height: 1; }
.apr-plan-period { font-size: 0.72rem; font-weight: 500; color: #94a3b8; margin-left: 2px; }
.apr-plan-desc   { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin: 0 0 16px; }

.apr-plan-input { width: 100%; padding: 9px 12px; border: 1.5px solid #16a34a; border-radius: 10px; font-size: 1rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #fff; outline: none; -moz-appearance: textfield; margin-bottom: 10px; box-sizing: border-box; }
.apr-plan-input::-webkit-outer-spin-button, .apr-plan-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.apr-plan-input:focus { box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }

.apr-btn-row { display: flex; gap: 7px; }
.apr-btn { height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all 0.18s; flex-shrink: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
.apr-btn:active { transform: scale(0.93); }
.apr-btn:disabled { opacity: 0.55; cursor: not-allowed; }
.apr-edit-btn   { padding: 0 14px; gap: 5px; font-size: 0.72rem; font-weight: 700; background: #fff; color: #64748b; border: 1.5px solid #e2e8f0; border-radius: 100px; }
.apr-edit-btn:hover:not(:disabled) { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.apr-save-btn   { flex: 1; background: #16a34a; color: #fff; box-shadow: 0 2px 8px rgba(22,163,74,0.28); font-size: 0.78rem; font-weight: 700; gap: 5px; }
.apr-save-btn:hover:not(:disabled) { background: #15803d; }
.apr-cancel-btn { width: 32px; background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0; }
.apr-cancel-btn:hover:not(:disabled) { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

/* ── Free plan ── */
.apr-free-card { background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 18px; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between; }
.apr-free-name { font-size: 0.84rem; font-weight: 700; color: #94a3b8; margin-bottom: 2px; }
.apr-free-sub  { font-size: 0.72rem; color: #cbd5e1; font-weight: 400; }
.apr-free-val  { font-size: 1.3rem; font-weight: 800; color: #cbd5e1; letter-spacing: -0.02em; }
`;

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓' };
    return (
        <div className={`apr-alert ${type}`}>
            <div className="apr-alert-icon">{icons[type]}</div>
            <div className="apr-alert-body">{message}</div>
            <button className="apr-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

const fmt   = (v) => { const n = parseFloat(v); if (isNaN(n)) return v; return n % 1 === 0 ? String(Math.floor(n)) : n.toFixed(2); };
const store = (v) => { const n = parseFloat(v); return n % 1 === 0 ? String(Math.floor(n)) : n.toFixed(2); };

export default function AdminPricing() {
    const [currency,    setCurrency]    = useState("৳");
    const [plusMonthly, setPlusMonthly] = useState("9.99");
    const [plusYearly,  setPlusYearly]  = useState("99.99");
    const [alert,       setAlert]       = useState(null);

    const showAlert  = (type, msg) => setAlert({ type, message: msg });
    const clearAlert = () => setAlert(null);

    const [editingCur, setEditingCur] = useState(false);
    const [editCurVal, setEditCurVal] = useState("");
    const [savingCur,  setSavingCur]  = useState(false);

    const [editingMo, setEditingMo] = useState(false);
    const [editMoVal, setEditMoVal] = useState("");
    const [savingMo,  setSavingMo]  = useState(false);

    const [editingYr, setEditingYr] = useState(false);
    const [editYrVal, setEditYrVal] = useState("");
    const [savingYr,  setSavingYr]  = useState(false);

    useEffect(() => {
        getPricing()
            .then(d => {
                setCurrency(d?.currencySymbol    ?? "৳");
                setPlusMonthly(d?.plusMonthlyPrice ?? "9.99");
                setPlusYearly(d?.plusYearlyPrice   ?? "99.99");
            })
            .catch(() => showAlert("error", "Failed to load pricing."));
    }, []);

    const saveCurrency = async () => {
        const val = editCurVal.trim();
        if (!val) { showAlert("error", "Currency symbol cannot be empty."); return; }
        setSavingCur(true);
        try { await updatePricing({ currencySymbol: val }); setCurrency(val); setEditingCur(false); showAlert("success", "Currency updated."); }
        catch { showAlert("error", "Failed to update currency."); }
        finally { setSavingCur(false); }
    };

    const saveMonthly = async () => {
        const val = parseFloat(editMoVal);
        if (isNaN(val) || val < 0) { showAlert("error", "Invalid price value."); return; }
        setSavingMo(true);
        try { const s = store(val); await updatePricing({ plusMonthlyPrice: s }); setPlusMonthly(s); setEditingMo(false); showAlert("success", "Monthly price updated."); }
        catch { showAlert("error", "Failed to update monthly price."); }
        finally { setSavingMo(false); }
    };

    const saveYearly = async () => {
        const val = parseFloat(editYrVal);
        if (isNaN(val) || val < 0) { showAlert("error", "Invalid price value."); return; }
        setSavingYr(true);
        try { const s = store(val); await updatePricing({ plusYearlyPrice: s }); setPlusYearly(s); setEditingYr(false); showAlert("success", "Yearly price updated."); }
        catch { showAlert("error", "Failed to update yearly price."); }
        finally { setSavingYr(false); }
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="apr-root">

                <h1 className="apr-title">Plan <span>Pricing</span></h1>
                <p className="apr-subtitle">Manage subscription prices and currency symbol</p>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                {/* ── Currency ── */}
                <p className="apr-sec">Currency</p>
                <div className={`apr-cur-card ${editingCur ? "editing" : ""}`}>
                    <div>
                        <p className="apr-cur-name">Currency Symbol</p>
                        <p className="apr-cur-sub">Shown on all prices across the site</p>
                    </div>
                    <div className="apr-cur-right">
                        {editingCur ? (
                            <>
                                <input className="apr-plan-input" style={{ width: 64, marginBottom: 0, textAlign: 'center' }} type="text" maxLength={4} value={editCurVal} onChange={e => setEditCurVal(e.target.value)} onKeyDown={e => e.key === "Enter" && saveCurrency()} autoFocus />
                                <button className="apr-btn apr-save-btn" style={{ width: 32, flex: 'none' }} onClick={saveCurrency} disabled={savingCur}><CheckIcon size={13} /></button>
                                <button className="apr-btn apr-cancel-btn" onClick={() => setEditingCur(false)} disabled={savingCur}><XIcon size={13} /></button>
                            </>
                        ) : (
                            <>
                                <span className="apr-cur-val">{currency}</span>
                                <button className="apr-edit-btn apr-btn" onClick={() => { setEditCurVal(currency); setEditingCur(true); }}>
                                    <PencilIcon size={11} /> Edit
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Plus Plans ── */}
                <p className="apr-sec">Plus Plans</p>
                <div className="apr-plans">

                    {/* Monthly */}
                    <div className={`apr-plan-card ${editingMo ? "editing" : "active"}`}>
                        <div className="apr-plan-tag"><ZapIcon size={9} /> Monthly</div>
                        {editingMo ? (
                            <>
                                <input className="apr-plan-input" type="number" min="0" step="0.01" value={editMoVal} onChange={e => setEditMoVal(e.target.value)} onKeyDown={e => e.key === "Enter" && saveMonthly()} autoFocus />
                                <div className="apr-btn-row">
                                    <button className="apr-btn apr-save-btn" onClick={saveMonthly} disabled={savingMo}><CheckIcon size={13} /> Save</button>
                                    <button className="apr-btn apr-cancel-btn" onClick={() => setEditingMo(false)} disabled={savingMo}><XIcon size={13} /></button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="apr-plan-price-row">
                                    <span className="apr-plan-cur">{currency}</span>
                                    <span className="apr-plan-price">{fmt(plusMonthly)}</span>
                                    <span className="apr-plan-period">/mo</span>
                                </div>
                                <p className="apr-plan-desc">Billed monthly, cancel anytime</p>
                                <button className="apr-edit-btn apr-btn" onClick={() => { setEditMoVal(plusMonthly); setEditingMo(true); }}>
                                    <PencilIcon size={11} /> Edit Price
                                </button>
                            </>
                        )}
                    </div>

                    {/* Yearly */}
                    <div className={`apr-plan-card ${editingYr ? "editing" : "active"}`}>
                        <div className="apr-plan-tag"><SparklesIcon size={9} /> Yearly</div>
                        {editingYr ? (
                            <>
                                <input className="apr-plan-input" type="number" min="0" step="0.01" value={editYrVal} onChange={e => setEditYrVal(e.target.value)} onKeyDown={e => e.key === "Enter" && saveYearly()} autoFocus />
                                <div className="apr-btn-row">
                                    <button className="apr-btn apr-save-btn" onClick={saveYearly} disabled={savingYr}><CheckIcon size={13} /> Save</button>
                                    <button className="apr-btn apr-cancel-btn" onClick={() => setEditingYr(false)} disabled={savingYr}><XIcon size={13} /></button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="apr-plan-price-row">
                                    <span className="apr-plan-cur">{currency}</span>
                                    <span className="apr-plan-price">{fmt(plusYearly)}</span>
                                    <span className="apr-plan-period">/yr</span>
                                </div>
                                <p className="apr-plan-desc">Best value, billed annually</p>
                                <button className="apr-edit-btn apr-btn" onClick={() => { setEditYrVal(plusYearly); setEditingYr(true); }}>
                                    <PencilIcon size={11} /> Edit Price
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Free */}
                <div className="apr-free-card">
                    <div>
                        <p className="apr-free-name">Free Plan</p>
                        <p className="apr-free-sub">Always free — no changes needed</p>
                    </div>
                    <span className="apr-free-val">{currency}0 <span style={{ fontSize: '0.7rem', fontWeight: 500 }}>/mo</span></span>
                </div>

            </div>
        </>
    );
}