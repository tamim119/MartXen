import { useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { getPaymentSettings, updatePaymentSettings } from "../../lib/services/paymentSettingsService";
import Loading from "../../components/Loading";
import { SaveIcon, SmartphoneIcon } from "lucide-react";

const METHODS = [
    {
        key: "bkash", name: "bKash", sub: "Mobile banking",
        logo: "https://download.logo.wine/logo/BKash/BKash-Icon-Logo.wine.png",
        color: "#E2136E", lightBg: "#FDF0F6", border: "#F5B8D8",
        placeholder: "01XXXXXXXXX", numberLabel: "bKash Number",
    },
    {
        key: "nagad", name: "Nagad", sub: "Mobile banking",
        logo: "https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png",
        color: "#F4821F", lightBg: "#FEF5EC", border: "#FDDBB4",
        placeholder: "01XXXXXXXXX", numberLabel: "Nagad Number",
    },
    {
        key: "rocket", name: "Rocket", sub: "Mobile banking",
        logo: "https://static.vecteezy.com/system/resources/thumbnails/068/706/013/small_2x/rocket-color-logo-mobile-banking-icon-free-png.png",
        color: "#8B1FA9", lightBg: "#F8F0FC", border: "#DBAEF0",
        placeholder: "01XXXXXXXXX", numberLabel: "Rocket Number",
    },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ps-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

.ps-title    { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 6px; line-height: 1.2; }
.ps-subtitle { font-size: 0.82rem; color: #94a3b8; margin: 0 0 24px; font-weight: 400; }
.ps-title span { color: #0f172a; font-weight: 800; }

/* ── Alert ── */
.ps-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; font-size: 0.825rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.ps-alert-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800; }
.ps-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.ps-alert.error   .ps-alert-icon { background: #fda4af; color: #9f1239; }
.ps-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.ps-alert.success .ps-alert-icon { background: #86efac; color: #14532d; }
.ps-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.ps-alert.warning .ps-alert-icon { background: #fcd34d; color: #92400e; }
.ps-alert-body { flex: 1; font-size: 0.8rem; }
.ps-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.ps-alert-close:hover { opacity: 1; }

.ps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
@media (max-width: 1024px) { .ps-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .ps-grid { grid-template-columns: 1fr; } }

.ps-card {
    background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 22px 20px;
    transition: border-color 0.18s, box-shadow 0.18s;
}
.ps-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }

.ps-card-head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1.5px solid #f8fafc;
}
.ps-card-icon { width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.ps-card-icon img { width: 30px; height: 30px; object-fit: contain; }
.ps-card-name { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.ps-card-sub  { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin: 0; }

.ps-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px; background: #f8fafc; border: 1.5px solid #f1f5f9;
    border-radius: 11px; margin-bottom: 12px;
    transition: border-color 0.18s, background 0.18s; cursor: pointer;
}
.ps-toggle-row:has(input:checked) { border-color: #bbf7d0; background: #f0fdf4; }
.ps-toggle-label { font-size: 0.81rem; font-weight: 600; color: #0f172a; }
.ps-toggle-track {
    position: relative; width: 36px; height: 20px;
    background: #e2e8f0; border-radius: 10px;
    cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.ps-toggle-track:has(input:checked) { background: #16a34a; }
.ps-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.ps-toggle-thumb {
    position: absolute; top: 2px; left: 2px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff; pointer-events: none;
    transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.ps-toggle-track:has(input:checked) .ps-toggle-thumb { transform: translateX(16px); }

.ps-field { margin-bottom: 10px; }
.ps-label { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; display: block; }
.ps-input-wrap {
    display: flex; align-items: center; gap: 8px; padding: 9px 12px;
    border: 1.5px solid #f1f5f9; border-radius: 11px; background: #f8fafc;
    transition: border-color 0.2s, background 0.2s;
}
.ps-input-wrap:focus-within { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.ps-input-wrap svg { color: #94a3b8; flex-shrink: 0; }
.ps-input { flex: 1; border: none; outline: none; font-size: 0.84rem; font-weight: 500; font-family: 'Plus Jakarta Sans', sans-serif; background: transparent; color: #0f172a; }
.ps-input::placeholder { color: #cbd5e1; font-weight: 400; }

.ps-save-btn {
    width: 100%; padding: 11px; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 100px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.2s; margin-top: 14px;
}
.ps-save-btn:hover:not(:disabled) { filter: brightness(0.9); transform: translateY(-1px); }
.ps-save-btn:active { transform: scale(0.97); }
.ps-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; filter: none; }

/* loading dots inside button */
.ps-dots { display: inline-flex; align-items: center; gap: 4px; }
.ps-dots span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.85); display: inline-block; animation: ps-dot 1.1s ease-in-out infinite; }
.ps-dots span:nth-child(2) { animation-delay: 0.18s; }
.ps-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes ps-dot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }

@media (max-width: 480px) {
    .ps-title { font-size: 1.2rem; margin-bottom: 18px; }
    .ps-card { padding: 16px; border-radius: 16px; }
}
`;

const CodIcon = () => (
    <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg, #475569, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <rect x=".5" y=".5" width="27" height="19" rx="3" stroke="#94a3b8"/>
            <rect y="5" width="28" height="6" fill="#64748b"/>
            <rect x="2" y="14" width="6" height="2.5" rx="1" fill="#94a3b8"/>
            <rect x="10" y="14" width="4" height="2.5" rx="1" fill="#94a3b8"/>
        </svg>
    </div>
);

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', warning: '!' };
    return (
        <div className={`ps-alert ${type}`}>
            <div className="ps-alert-icon">{icons[type]}</div>
            <div className="ps-alert-body">{message}</div>
            <button className="ps-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

const LoadingDots = () => (
    <span className="ps-dots"><span /><span /><span /></span>
);

export default function PaymentSettings() {
    const { user, loading: userLoading } = useCurrentUser();

    const [storeId, setStoreId]   = useState(null);
    const [loading, setLoading]   = useState(true);
    // per-card saving: { bkash: false, nagad: false, rocket: false, cod: false }
    const [saving, setSaving]     = useState({});
    const [alert, setAlert]       = useState(null);

    const [settings, setSettings] = useState({
        bkash:  { enabled: false, number: "" },
        nagad:  { enabled: false, number: "" },
        rocket: { enabled: false, number: "" },
        cod:    { enabled: true },
    });

    const showAlert  = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    useEffect(() => {
        if (userLoading) return;
        const load = async () => {
            if (!user) { setLoading(false); showAlert("warning", "Please login to manage payment settings."); return; }
            try {
                const store = await getStoreByUser(user.uid);
                if (!store) { setLoading(false); showAlert("warning", "No store found. Please create a store first."); return; }
                setStoreId(store.id);
                const data = await getPaymentSettings(store.id);
                if (data) setSettings(prev => ({ ...prev, ...data }));
            } catch (err) {
                console.error("Error loading payment settings:", err);
                showAlert("error", "Failed to load payment settings.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user, userLoading]);

    const update = (method, field, value) => {
        setSettings(prev => ({ ...prev, [method]: { ...prev[method], [field]: value } }));
    };

    const validatePhone = (number) => /^01[3-9]\d{8}$/.test(number.replace(/\s/g, ''));

    // Save only a specific card (methodKey: 'bkash' | 'nagad' | 'rocket' | 'cod')
    const handleSave = async (methodKey) => {
        clearAlert();

        if (!storeId) { showAlert("error", "Store not found. Please refresh the page."); return; }

        // Validate the specific method being saved
        if (methodKey !== 'cod') {
            const method = METHODS.find(m => m.key === methodKey);
            if (settings[methodKey]?.enabled) {
                const number = settings[methodKey]?.number?.trim();
                if (!number) { showAlert("error", `Please enter ${method.name} number.`); return; }
                if (!validatePhone(number)) { showAlert("error", `Please enter a valid ${method.name} number (e.g. 01712345678).`); return; }
            }
        }

        const hasEnabled = settings.cod?.enabled || settings.bkash?.enabled || settings.nagad?.enabled || settings.rocket?.enabled;
        if (!hasEnabled) { showAlert("warning", "Please enable at least one payment method."); return; }

        setSaving(prev => ({ ...prev, [methodKey]: true }));
        try {
            await updatePaymentSettings(storeId, settings);
            showAlert("success", "Payment settings saved successfully.");
        } catch (err) {
            console.error("Error saving payment settings:", err);
            showAlert("error", "Failed to save settings. Please try again.");
        } finally {
            setSaving(prev => ({ ...prev, [methodKey]: false }));
        }
    };

    if (userLoading || loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="ps-root">
                <h1 className="ps-title">Payment <span>Settings</span></h1>
                <p className="ps-subtitle">Configure which payment methods your customers can use at checkout</p>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                <div className="ps-grid">

                    {METHODS.map(method => (
                        <div key={method.key} className="ps-card">
                            <div className="ps-card-head">
                                <div className="ps-card-icon" style={{ background: method.lightBg, border: `1.5px solid ${method.border}` }}>
                                    <img src={method.logo} alt={method.name} onError={e => { e.target.style.display = 'none'; }} />
                                </div>
                                <div>
                                    <p className="ps-card-name">{method.name}</p>
                                    <p className="ps-card-sub">{method.sub}</p>
                                </div>
                            </div>

                            <div className="ps-toggle-row">
                                <span className="ps-toggle-label">Enable {method.name}</span>
                                <label className="ps-toggle-track">
                                    <input
                                        type="checkbox"
                                        checked={settings[method.key]?.enabled || false}
                                        onChange={e => update(method.key, "enabled", e.target.checked)}
                                    />
                                    <span className="ps-toggle-thumb" />
                                </label>
                            </div>

                            <div className="ps-field">
                                <label className="ps-label">{method.numberLabel}</label>
                                <div className="ps-input-wrap">
                                    <SmartphoneIcon size={14} />
                                    <input
                                        className="ps-input"
                                        type="text"
                                        placeholder={method.placeholder}
                                        value={settings[method.key]?.number || ""}
                                        onChange={e => update(method.key, "number", e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                className="ps-save-btn"
                                onClick={() => handleSave(method.key)}
                                disabled={saving[method.key]}
                                style={{ background: method.color, boxShadow: `0 4px 14px ${method.color}44` }}
                            >
                                <SaveIcon size={14} />
                                {saving[method.key] ? `Saving ${method.name}…` : `Save ${method.name}`}
                            </button>
                        </div>
                    ))}

                    {/* Cash on Delivery */}
                    <div className="ps-card">
                        <div className="ps-card-head">
                            <CodIcon />
                            <div>
                                <p className="ps-card-name">Cash on Delivery</p>
                                <p className="ps-card-sub">Collect payment on delivery</p>
                            </div>
                        </div>

                        <div className="ps-toggle-row">
                            <span className="ps-toggle-label">Enable Cash on Delivery</span>
                            <label className="ps-toggle-track">
                                <input
                                    type="checkbox"
                                    checked={settings.cod?.enabled || false}
                                    onChange={e => update("cod", "enabled", e.target.checked)}
                                />
                                <span className="ps-toggle-thumb" />
                            </label>
                        </div>

                        <button
                            className="ps-save-btn"
                            style={{ marginTop: 0, background: '#0f172a', boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}
                            onClick={() => handleSave("cod")}
                            disabled={saving["cod"]}
                        >
                            <SaveIcon size={14} />
                            {saving["cod"] ? "Saving…" : "Save"}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}