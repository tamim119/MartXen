import { useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/useAuth";
import { useFloatingToast } from "../../components/FloatingToastProvider";
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

.ps-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: ps-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes ps-fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.ps-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 24px; line-height: 1.2; }
.ps-title span { color: #0f172a; font-weight: 800; }

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
.ps-card-icon {
    width: 44px; height: 44px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
}
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
.ps-label {
    font-size: 0.7rem; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; display: block;
}
.ps-input-wrap {
    display: flex; align-items: center; gap: 8px; padding: 9px 12px;
    border: 1.5px solid #f1f5f9; border-radius: 11px; background: #f8fafc;
    transition: border-color 0.2s, background 0.2s;
}
.ps-input-wrap:focus-within { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.ps-input-wrap svg { color: #94a3b8; flex-shrink: 0; }
.ps-input {
    flex: 1; border: none; outline: none;
    font-size: 0.84rem; font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent; color: #0f172a;
}
.ps-input::placeholder { color: #cbd5e1; font-weight: 400; }

.ps-save-btn {
    width: 100%; padding: 11px; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 100px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.2s; margin-top: 14px;
}
.ps-save-btn:hover { filter: brightness(0.9); transform: translateY(-1px); }
.ps-save-btn:active { transform: scale(0.97); }
.ps-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.ps-cod-card {
    background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 22px 20px;
    transition: border-color 0.18s, box-shadow 0.18s;
}
.ps-cod-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }

@media (max-width: 480px) {
    .ps-title { font-size: 1.2rem; margin-bottom: 18px; }
    .ps-card, .ps-cod-card { padding: 16px; border-radius: 16px; }
}
`;

const CodIcon = () => (
    <div style={{
        width: 44, height: 44, borderRadius: 13,
        background: 'linear-gradient(135deg, #475569, #1e293b)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
        <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <rect x=".5" y=".5" width="27" height="19" rx="3" stroke="#94a3b8"/>
            <rect y="5" width="28" height="6" fill="#64748b"/>
            <rect x="2" y="14" width="6" height="2.5" rx="1" fill="#94a3b8"/>
            <rect x="10" y="14" width="4" height="2.5" rx="1" fill="#94a3b8"/>
        </svg>
    </div>
);

export default function PaymentSettings() {
    const { user } = useCurrentUser();
    const { showToast } = useFloatingToast();
    
    const [storeId, setStoreId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({
        bkash: { enabled: false, number: "" },
        nagad: { enabled: false, number: "" },
        rocket: { enabled: false, number: "" },
        cod: { enabled: true },
    });

    useEffect(() => {
        const load = async () => {
            if (!user) {
                setLoading(false);
                showToast("Please login to manage payment settings", "warning");
                return;
            }

            try {
                const store = await getStoreByUser(user.uid);
                
                if (!store) {
                    setLoading(false);
                    showToast("No store found. Please create a store first", "warning");
                    return;
                }

                setStoreId(store.id);
                const data = await getPaymentSettings(store.id);
                if (data) {
                    setSettings(prev => ({ ...prev, ...data }));
                }

            } catch (err) {
                console.error("Error loading payment settings:", err);
                showToast("Failed to load payment settings", "error");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user, showToast]);

    const update = (method, field, value) => {
        setSettings(prev => ({ ...prev, [method]: { ...prev[method], [field]: value } }));
    };

    const validatePhoneNumber = (number) => {
        // Bangladesh phone number validation (11 digits starting with 01)
        const bdPhoneRegex = /^01[3-9]\d{8}$/;
        return bdPhoneRegex.test(number.replace(/\s/g, ''));
    };

    const handleSave = async () => {
        if (!storeId) {
            showToast("Store not found. Please refresh the page", "error");
            return;
        }

        // Validate enabled payment methods have valid phone numbers
        for (const method of METHODS) {
            if (settings[method.key]?.enabled) {
                const number = settings[method.key]?.number?.trim();
                
                if (!number) {
                    showToast(`Please enter ${method.name} number`, "error");
                    return;
                }

                if (!validatePhoneNumber(number)) {
                    showToast(`Please enter a valid ${method.name} number (e.g., 01712345678)`, "error");
                    return;
                }
            }
        }

        // Check if at least one payment method is enabled
        const hasEnabledMethod = settings.cod?.enabled || 
            settings.bkash?.enabled || 
            settings.nagad?.enabled || 
            settings.rocket?.enabled;

        if (!hasEnabledMethod) {
            showToast("Please enable at least one payment method", "warning");
            return;
        }

        setSaving(true);
        
        try {
            await updatePaymentSettings(storeId, settings);
            showToast("✅ Payment settings saved successfully!", "success");
            
        } catch (err) {
            console.error("Error saving payment settings:", err);
            showToast("Failed to save payment settings. Please try again", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="ps-root">
                <h1 className="ps-title">Payment <span>Settings</span></h1>

                <div className="ps-grid">

                    {METHODS.map(method => (
                        <div key={method.key} className="ps-card">
                            <div className="ps-card-head">
                                <div
                                    className="ps-card-icon"
                                    style={{ background: method.lightBg, border: `1.5px solid ${method.border}` }}
                                >
                                    <img
                                        src={method.logo}
                                        alt={method.name}
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                <div>
                                    <p className="ps-card-name">{method.name}</p>
                                    <p className="ps-card-sub">{method.sub}</p>
                                </div>
                            </div>

                            {/* Enable toggle */}
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

                            {/* Number only — Account Type removed */}
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
                                onClick={handleSave}
                                disabled={saving}
                                style={{ background: method.color, boxShadow: `0 4px 14px ${method.color}44` }}
                            >
                                <SaveIcon size={14} />
                                {saving ? "Saving..." : `Save ${method.name}`}
                            </button>
                        </div>
                    ))}

                    {/* Cash on Delivery */}
                    <div className="ps-cod-card">
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
                            onClick={handleSave}
                            disabled={saving}
                        >
                            <SaveIcon size={14} />
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}