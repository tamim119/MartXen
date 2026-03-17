import { useEffect, useState } from "react";
import { getAdminPaymentSettings, updateAdminPaymentSettings } from "../../lib/services/adminPaymentSettingsService";
import Loading from "../../components/Loading";
import { useFloatingToast } from "../../components/FloatingToastProvider"; // ✅ Import
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

.aps-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: aps-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes aps-fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.aps-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 8px; line-height: 1.2; }
.aps-title span { color: #0f172a; font-weight: 800; }
.aps-subtitle { font-size: 0.875rem; color: #94a3b8; margin: 0 0 24px; font-weight: 400; }

.aps-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
@media (max-width: 1024px) { .aps-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px)  { .aps-grid { grid-template-columns: 1fr; } }

.aps-card {
    background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 22px 20px;
    transition: border-color 0.18s, box-shadow 0.18s;
}
.aps-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }

.aps-card-head {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1.5px solid #f8fafc;
}
.aps-card-icon {
    width: 44px; height: 44px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
}
.aps-card-icon img { width: 30px; height: 30px; object-fit: contain; }
.aps-card-name { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.aps-card-sub  { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin: 0; }

.aps-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 12px; background: #f8fafc; border: 1.5px solid #f1f5f9;
    border-radius: 11px; margin-bottom: 12px;
    transition: border-color 0.18s, background 0.18s; cursor: pointer;
}
.aps-toggle-row:has(input:checked) { border-color: #bbf7d0; background: #f0fdf4; }
.aps-toggle-label { font-size: 0.81rem; font-weight: 600; color: #0f172a; }
.aps-toggle-track {
    position: relative; width: 36px; height: 20px;
    background: #e2e8f0; border-radius: 10px;
    cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.aps-toggle-track:has(input:checked) { background: #16a34a; }
.aps-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.aps-toggle-thumb {
    position: absolute; top: 2px; left: 2px;
    width: 16px; height: 16px; border-radius: 50%;
    background: #fff; pointer-events: none;
    transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.aps-toggle-track:has(input:checked) .aps-toggle-thumb { transform: translateX(16px); }

.aps-field { margin-bottom: 10px; }
.aps-label {
    font-size: 0.7rem; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; display: block;
}
.aps-input-wrap {
    display: flex; align-items: center; gap: 8px; padding: 9px 12px;
    border: 1.5px solid #f1f5f9; border-radius: 11px; background: #f8fafc;
    transition: border-color 0.2s, background 0.2s;
}
.aps-input-wrap:focus-within { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.aps-input-wrap svg { color: #94a3b8; flex-shrink: 0; }
.aps-input {
    flex: 1; border: none; outline: none;
    font-size: 0.84rem; font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent; color: #0f172a;
}
.aps-input::placeholder { color: #cbd5e1; font-weight: 400; }
.aps-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.aps-save-btn {
    width: 100%; padding: 11px; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 100px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.2s; margin-top: 14px;
}
.aps-save-btn:hover:not(:disabled) { filter: brightness(0.9); transform: translateY(-1px); }
.aps-save-btn:active { transform: scale(0.97); }
.aps-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

@media (max-width: 480px) {
    .aps-title { font-size: 1.2rem; margin-bottom: 6px; }
    .aps-subtitle { font-size: 0.8rem; margin-bottom: 18px; }
    .aps-card { padding: 16px; border-radius: 16px; }
}
`;

export default function AdminPaymentSettings() {
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const { addToast } = useFloatingToast(); // ✅ Hook

    const [settings, setSettings] = useState({
        bkash:  { enabled: false, number: "" },
        nagad:  { enabled: false, number: "" },
        rocket: { enabled: false, number: "" },
    });

    useEffect(() => {
        const load = async () => {
            try {
                console.log("Loading admin payment settings...");
                const data = await getAdminPaymentSettings();
                console.log("Loaded data from Firebase:", data);
                
                if (data) {
                    setSettings({
                        bkash:  data.bkash  || { enabled: false, number: "" },
                        nagad:  data.nagad  || { enabled: false, number: "" },
                        rocket: data.rocket || { enabled: false, number: "" },
                    });
                }
            } catch (err) { 
                console.error("Error loading payment settings:", err);
                // ✅ Error toast
                addToast({
                    message: "Failed to load payment settings",
                    title: "Please refresh the page",
                    type: "error",
                });
            } finally { 
                setLoading(false); 
            }
        };
        load();
    }, [addToast]);

    const update = (method, field, value) => {
        console.log(`Updating ${method}.${field} to:`, value);
        setSettings(prev => ({ 
            ...prev, 
            [method]: { ...prev[method], [field]: value } 
        }));
    };

    const handleSave = async () => {
        // ✅ Validation
        const enabledMethods = Object.entries(settings).filter(([_, data]) => data.enabled);
        
        for (const [key, data] of enabledMethods) {
            if (!data.number.trim()) {
                const methodName = METHODS.find(m => m.key === key)?.name;
                addToast({
                    message: `Please enter ${methodName} number`,
                    type: "error",
                });
                return;
            }
            
            // Phone number validation (Bangladesh format)
            if (!/^01[0-9]{9}$/.test(data.number.trim())) {
                const methodName = METHODS.find(m => m.key === key)?.name;
                addToast({
                    message: `Invalid ${methodName} number format`,
                    title: "Number should be 11 digits starting with 01",
                    type: "error",
                });
                return;
            }
        }

        setSaving(true);
        try {
            console.log("Saving payment settings:", settings);
            await updateAdminPaymentSettings(settings);
            
            // ✅ Success toast
            addToast({
                message: "Payment settings saved successfully!",
                title: "Changes are now active",
                type: "success",
            });
        } catch (err) {
            console.error("Error saving payment settings:", err);
            // ✅ Error toast
            addToast({
                message: "Failed to save payment settings",
                title: "Please try again or check console",
                type: "error",
            });
        } finally { 
            setSaving(false); 
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="aps-root">
                <h1 className="aps-title">Payment <span>Settings</span></h1>
                <p className="aps-subtitle">
                    Set default payment numbers for all users
                </p>

                <div className="aps-grid">
                    {METHODS.map(method => (
                        <div key={method.key} className="aps-card">
                            <div className="aps-card-head">
                                <div
                                    className="aps-card-icon"
                                    style={{ 
                                        background: method.lightBg, 
                                        border: `1.5px solid ${method.border}` 
                                    }}
                                >
                                    <img
                                        src={method.logo}
                                        alt={method.name}
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                </div>
                                <div>
                                    <p className="aps-card-name">{method.name}</p>
                                    <p className="aps-card-sub">{method.sub}</p>
                                </div>
                            </div>

                            {/* Enable toggle */}
                            <div className="aps-toggle-row">
                                <span className="aps-toggle-label">Enable {method.name}</span>
                                <label className="aps-toggle-track">
                                    <input
                                        type="checkbox"
                                        checked={settings[method.key]?.enabled || false}
                                        onChange={e => update(method.key, "enabled", e.target.checked)}
                                        disabled={saving}
                                    />
                                    <span className="aps-toggle-thumb" />
                                </label>
                            </div>

                            {/* Number input */}
                            <div className="aps-field">
                                <label className="aps-label">{method.numberLabel}</label>
                                <div className="aps-input-wrap">
                                    <SmartphoneIcon size={14} />
                                    <input
                                        className="aps-input"
                                        type="text"
                                        placeholder={method.placeholder}
                                        value={settings[method.key]?.number || ""}
                                        onChange={e => update(method.key, "number", e.target.value)}
                                        disabled={saving}
                                        maxLength={11}
                                    />
                                </div>
                            </div>

                            {/* Individual save button */}
                            <button
                                className="aps-save-btn"
                                onClick={handleSave}
                                disabled={saving}
                                style={{ 
                                    background: method.color, 
                                    boxShadow: `0 4px 14px ${method.color}44` 
                                }}
                            >
                                <SaveIcon size={14} />
                                {saving ? "Saving..." : `Save ${method.name}`}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}