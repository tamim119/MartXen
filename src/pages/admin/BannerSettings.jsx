import { useEffect, useState } from "react";
import { getBannerSettings, updateBannerSettings } from "../../lib/services/bannerService";
import { getAllCoupons } from "../../lib/services/couponService";
import Loading from "../../components/Loading";
import { useFloatingToast } from "../../components/FloatingToastProvider"; // ✅ Import
import { SaveIcon, TypeIcon, TagIcon, TicketIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.abs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: abs-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes abs-fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.abs-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 8px; line-height: 1.2; }
.abs-title span { color: #0f172a; font-weight: 800; }
.abs-subtitle { font-size: 0.875rem; color: #94a3b8; margin: 0 0 24px; font-weight: 400; }

.abs-card {
    background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 24px;
    margin-bottom: 20px;
}

.abs-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; background: #f8fafc; border: 1.5px solid #f1f5f9;
    border-radius: 12px; margin-bottom: 20px;
    transition: border-color 0.18s, background 0.18s; cursor: pointer;
}
.abs-toggle-row:has(input:checked) { border-color: #bbf7d0; background: #f0fdf4; }
.abs-toggle-label { font-size: 0.875rem; font-weight: 600; color: #0f172a; }
.abs-toggle-track {
    position: relative; width: 40px; height: 22px;
    background: #e2e8f0; border-radius: 11px;
    cursor: pointer; transition: background 0.2s; flex-shrink: 0;
}
.abs-toggle-track:has(input:checked) { background: #16a34a; }
.abs-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.abs-toggle-thumb {
    position: absolute; top: 2px; left: 2px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #fff; pointer-events: none;
    transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.abs-toggle-track:has(input:checked) .abs-toggle-thumb { transform: translateX(18px); }

.abs-field { margin-bottom: 20px; }
.abs-label {
    font-size: 0.75rem; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; 
    display: flex; align-items: center; gap: 6px;
}
.abs-input-wrap {
    display: flex; align-items: center; gap: 10px; padding: 11px 14px;
    border: 1.5px solid #f1f5f9; border-radius: 12px; background: #f8fafc;
    transition: border-color 0.2s, background 0.2s;
}
.abs-input-wrap:focus-within { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.abs-input-wrap svg { color: #94a3b8; flex-shrink: 0; }
.abs-input, .abs-select {
    flex: 1; border: none; outline: none;
    font-size: 0.875rem; font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent; color: #0f172a;
}
.abs-input::placeholder { color: #cbd5e1; font-weight: 400; }
.abs-select { cursor: pointer; }

.abs-preview {
    padding: 10px 18px; 
    border-radius: 10px; 
    text-align: center;
    color: white; 
    font-weight: 600; 
    font-size: 0.8125rem;
    margin-top: 6px; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    min-height: 42px;
}

.abs-preview-code {
    background: rgba(255,255,255,0.3); 
    padding: 3px 10px; 
    border-radius: 6px; 
    font-weight: 700; 
    letter-spacing: 0.4px;
    font-size: 0.75rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    transition: all 0.2s;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.2);
}

.abs-preview-code:hover {
    background: rgba(255,255,255,0.4);
    transform: scale(1.03);
    border-color: rgba(255,255,255,0.3);
}

.abs-save-btn {
    width: 100%; padding: 10px 16px; color: #fff;
    font-size: 0.8125rem; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 10px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.2s; margin-top: 16px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    box-shadow: 0 2px 8px rgba(22,163,74,0.2);
}
.abs-save-btn:hover:not(:disabled) { filter: brightness(0.92); transform: translateY(-1px); box-shadow: 0 3px 10px rgba(22,163,74,0.3); }
.abs-save-btn:active { transform: scale(0.98); }
.abs-save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

@media (max-width: 640px) {
    .abs-save-btn {
        padding: 9px 14px;
        font-size: 0.75rem;
    }
    .abs-preview {
        padding: 8px 14px;
        font-size: 0.75rem;
        min-height: 40px;
    }
    .abs-preview-code {
        padding: 3px 8px;
        font-size: 0.7rem;
    }
}

.abs-note {
    font-size: 0.75rem; color: #94a3b8; margin-top: 6px; font-style: italic;
}
`;

export default function AdminBannerSettings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const { addToast } = useFloatingToast(); // ✅ Hook

    const [settings, setSettings] = useState({
        enabled: true,
        text: "Get 20% OFF on Your First Order!",
        buttonText: "Claim Offer",
        couponCode: "",
        useCouponFromList: true,
        gradientFrom: "#8B5CF6",
        gradientTo: "#E0724A",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [bannerData, couponData] = await Promise.all([
                    getBannerSettings(),
                    getAllCoupons()
                ]);
                
                if (bannerData) {
                    setSettings(bannerData);
                }
                setCoupons(couponData || []);
            } catch (err) {
                console.error("Error loading settings:", err);
                // ✅ Error toast
                addToast({
                    message: "Failed to load banner settings",
                    title: "Please refresh the page",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [addToast]);

    const update = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // ✅ Validation
        if (!settings.couponCode && settings.enabled) {
            addToast({
                message: "Please select a coupon code",
                type: "error",
            });
            return;
        }

        if (!settings.text.trim() && settings.enabled) {
            addToast({
                message: "Please enter banner text",
                type: "error",
            });
            return;
        }

        setSaving(true);
        try {
            await updateBannerSettings(settings);
            
            // ✅ Success toast
            addToast({
                message: "Banner settings saved successfully!",
                title: settings.enabled ? "Banner is now live" : "Banner is disabled",
                type: "success",
            });
        } catch (err) {
            console.error("Error saving banner settings:", err);
            // ✅ Error toast
            addToast({
                message: "Failed to save banner settings",
                title: "Please try again",
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
            <div className="abs-root">
                <h1 className="abs-title">Banner <span>Settings</span></h1>
                <p className="abs-subtitle">
                    Customize the promotional banner displayed on your site
                </p>

                <div className="abs-card">
                    {/* Enable/Disable Toggle */}
                    <div className="abs-toggle-row">
                        <span className="abs-toggle-label">Enable Banner</span>
                        <label className="abs-toggle-track">
                            <input
                                type="checkbox"
                                checked={settings.enabled}
                                onChange={e => update("enabled", e.target.checked)}
                            />
                            <span className="abs-toggle-thumb" />
                        </label>
                    </div>

                    {/* Coupon Selection */}
                    <div className="abs-field">
                        <label className="abs-label">
                            <TicketIcon size={14} />
                            Select Coupon
                        </label>
                        <div className="abs-input-wrap">
                            <TagIcon size={14} />
                            <select
                                className="abs-select"
                                value={settings.couponCode}
                                onChange={e => update("couponCode", e.target.value)}
                            >
                                <option value="">-- Select a coupon --</option>
                                {coupons.map(coupon => (
                                    <option key={coupon.code} value={coupon.code}>
                                        {coupon.code} - {coupon.discount}% off - {coupon.description}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {coupons.length === 0 && (
                            <p className="abs-note">
                                No coupons available. Create a coupon first in the Coupons page.
                            </p>
                        )}
                    </div>

                    {/* Banner Text */}
                    <div className="abs-field">
                        <label className="abs-label">
                            <TypeIcon size={14} />
                            Banner Text
                        </label>
                        <div className="abs-input-wrap">
                            <input
                                className="abs-input"
                                type="text"
                                placeholder="Get 20% OFF on Your First Order!"
                                value={settings.text}
                                onChange={e => update("text", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="abs-field">
                        <label className="abs-label">Preview</label>
                        <div 
                            className="abs-preview"
                            style={{
                                background: `linear-gradient(to right, ${settings.gradientFrom}, ${settings.gradientTo})`
                            }}
                        >
                            <span>{settings.text || "Your banner text here"}</span>
                            {settings.couponCode && (
                                <span className="abs-preview-code">{settings.couponCode}</span>
                            )}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        className="abs-save-btn"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <SaveIcon size={16} />
                        {saving ? "Saving..." : "Save Banner Settings"}
                    </button>
                </div>
            </div>
        </>
    );
}