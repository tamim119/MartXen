import { useEffect, useState } from "react";
import { getBannerSettings, updateBannerSettings } from "../../lib/services/bannerService";
import { getAllCoupons } from "../../lib/services/couponService";
import Loading from "../../components/Loading";
import { SaveIcon, TagIcon, TypeIcon, TicketIcon, EyeIcon, Copy, Check } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.abs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    margin-bottom: 80px;
    max-width: 640px;
}

.abs-title    { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 6px; }
.abs-title span { color: #0f172a; font-weight: 800; }
.abs-subtitle { font-size: 0.82rem; color: #94a3b8; margin: 0 0 28px; font-weight: 400; }

/* ── Alert ── */
.abs-alert { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.abs-alert-icon { width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.6rem; font-weight: 800; }
.abs-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.abs-alert.error   .abs-alert-icon { background: #fda4af; color: #9f1239; }
.abs-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.abs-alert.success .abs-alert-icon { background: #86efac; color: #14532d; }
.abs-alert-body { flex: 1; }
.abs-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.9rem; color: inherit; transition: opacity 0.15s; }
.abs-alert-close:hover { opacity: 1; }

/* ── Section label ── */
.abs-sec { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #94a3b8; margin: 0 0 12px; display: flex; align-items: center; gap: 8px; }
.abs-sec::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

/* ── Toggle card ── */
.abs-toggle-card {
    background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px;
    padding: 18px 20px; margin-bottom: 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    cursor: pointer; transition: border-color 0.18s, background 0.18s;
}
.abs-toggle-card.on { border-color: #bbf7d0; background: linear-gradient(140deg, #f0fdf4 0%, #fff 70%); }
.abs-toggle-info { display: flex; flex-direction: column; gap: 2px; }
.abs-toggle-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; }
.abs-toggle-sub  { font-size: 0.72rem; color: #94a3b8; font-weight: 400; }

.abs-toggle-track { position: relative; width: 38px; height: 21px; background: #e2e8f0; border-radius: 11px; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
.abs-toggle-track.on { background: #16a34a; }
.abs-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.abs-toggle-thumb { position: absolute; top: 2px; left: 2px; width: 17px; height: 17px; border-radius: 50%; background: #fff; pointer-events: none; transition: transform 0.2s cubic-bezier(0.4,0,0.2,1); box-shadow: 0 1px 4px rgba(0,0,0,0.18); }
.abs-toggle-track.on .abs-toggle-thumb { transform: translateX(17px); }

/* ── Form cards ── */
.abs-field-card {
    background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px;
    padding: 18px 20px; margin-bottom: 10px;
    transition: border-color 0.18s;
}
.abs-field-card:focus-within { border-color: #16a34a; }

.abs-field-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.abs-field-label svg { color: #94a3b8; }

.abs-input-row { display: flex; align-items: center; gap: 10px; }
.abs-input, .abs-select {
    flex: 1; border: none; outline: none;
    font-size: 0.875rem; font-weight: 500;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: transparent; color: #0f172a;
    padding: 0;
}
.abs-input::placeholder { color: #cbd5e1; font-weight: 400; }
.abs-select { cursor: pointer; }
.abs-select option { font-weight: 500; }

.abs-note { font-size: 0.72rem; color: #94a3b8; margin-top: 8px; font-weight: 400; }

/* ── Gradient pickers ── */
.abs-gradient-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.abs-color-item { display: flex; flex-direction: column; gap: 6px; }
.abs-color-label { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
.abs-color-wrap { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 12px; transition: border-color 0.18s; }
.abs-color-wrap:focus-within { border-color: #16a34a; }
.abs-color-swatch { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid rgba(0,0,0,0.08); flex-shrink: 0; cursor: pointer; }
.abs-color-hex { font-size: 0.75rem; font-weight: 600; color: #475569; font-family: monospace; flex: 1; border: none; outline: none; background: transparent; cursor: pointer; }
.abs-color-input { position: absolute; opacity: 0; width: 0; height: 0; }

/* ── Preview ── */
.abs-preview-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; margin-bottom: 24px; }
.abs-preview-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #94a3b8; padding: 14px 20px 10px; display: flex; align-items: center; gap: 6px; }
.abs-preview-label svg { color: #94a3b8; }
.abs-preview-bar { padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 42px; }
.abs-preview-text { font-size: 0.82rem; font-weight: 600; color: #fff; }
.abs-preview-pill { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.25); border-radius: 100px; padding: 4px 12px; }
.abs-preview-code { font-size: 0.72rem; font-weight: 800; color: #fff; letter-spacing: 0.08em; text-transform: uppercase; }

/* ── Save button ── */
.abs-save-btn {
    width: 100%; padding: 13px; background: #0f172a; color: #fff;
    font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.22s;
}
.abs-save-btn:hover:not(:disabled) { background: #1e293b; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(15,23,42,0.2); }
.abs-save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

/* loading dots */
.abs-dots { display: inline-flex; align-items: center; gap: 4px; }
.abs-dots span { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.85); display: inline-block; animation: abs-dot 1.1s ease-in-out infinite; }
.abs-dots span:nth-child(2) { animation-delay: 0.18s; }
.abs-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes abs-dot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-4px);opacity:1} }
`;

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓' };
    return (
        <div className={`abs-alert ${type}`}>
            <div className="abs-alert-icon">{icons[type]}</div>
            <div className="abs-alert-body">{message}</div>
            <button className="abs-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

export default function AdminBannerSettings() {
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [alert,   setAlert]   = useState(null);

    const showAlert  = (type, msg) => setAlert({ type, message: msg });
    const clearAlert = () => setAlert(null);

    const [settings, setSettings] = useState({
        enabled:          true,
        text:             "Get 20% OFF on Your First Order!",
        couponCode:       "",
        useCouponFromList: true,
        gradientFrom:     "#16a34a",
        gradientVia:      "#15803d",
        gradientTo:       "#166534",
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [bannerData, couponData] = await Promise.all([getBannerSettings(), getAllCoupons()]);
                if (bannerData) setSettings(bannerData);
                setCoupons(couponData || []);
            } catch (err) {
                console.error("Error loading settings:", err);
                showAlert("error", "Failed to load banner settings. Please refresh.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const update = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        clearAlert();
        if (settings.enabled && !settings.text.trim()) { showAlert("error", "Please enter banner text."); return; }
        if (settings.enabled && !settings.couponCode)  { showAlert("error", "Please select a coupon code."); return; }

        setSaving(true);
        try {
            await updateBannerSettings(settings);
            showAlert("success", settings.enabled ? "Banner saved and is now live." : "Banner saved and disabled.");
        } catch (err) {
            console.error("Error saving:", err);
            showAlert("error", "Failed to save banner settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading />;

    const bg = `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientVia ?? settings.gradientFrom}, ${settings.gradientTo})`;

    return (
        <>
            <style>{CSS}</style>
            <div className="abs-root">

                <h1 className="abs-title">Banner <span>Settings</span></h1>
                <p className="abs-subtitle">Customize the promotional banner shown on your site</p>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                {/* ── Enable ── */}
                <p className="abs-sec">Status</p>
                <div className={`abs-toggle-card ${settings.enabled ? "on" : ""}`} onClick={() => update("enabled", !settings.enabled)}>
                    <div className="abs-toggle-info">
                        <span className="abs-toggle-name">Enable Banner</span>
                        <span className="abs-toggle-sub">{settings.enabled ? "Banner is visible to all visitors" : "Banner is hidden from site"}</span>
                    </div>
                    <label className={`abs-toggle-track ${settings.enabled ? "on" : ""}`} onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={settings.enabled} onChange={e => update("enabled", e.target.checked)} />
                        <span className="abs-toggle-thumb" />
                    </label>
                </div>

                {/* ── Content ── */}
                <p className="abs-sec">Content</p>

                {/* Banner text */}
                <div className="abs-field-card">
                    <p className="abs-field-label"><TypeIcon size={12} /> Banner Text</p>
                    <div className="abs-input-row">
                        <input
                            className="abs-input"
                            type="text"
                            placeholder="Get 20% OFF on Your First Order!"
                            value={settings.text}
                            onChange={e => update("text", e.target.value)}
                        />
                    </div>
                </div>

                {/* Coupon */}
                <div className="abs-field-card" style={{ marginBottom: 24 }}>
                    <p className="abs-field-label"><TicketIcon size={12} /> Coupon Code</p>
                    <div className="abs-input-row">
                        <TagIcon size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                        <select className="abs-select" value={settings.couponCode} onChange={e => update("couponCode", e.target.value)}>
                            <option value="">— Select a coupon —</option>
                            {coupons.map(c => (
                                <option key={c.code} value={c.code}>{c.code} — {c.discount}% off{c.description ? ` · ${c.description}` : ''}</option>
                            ))}
                        </select>
                    </div>
                    {coupons.length === 0 && (
                        <p className="abs-note">No coupons yet. Create one in the Coupons page first.</p>
                    )}
                </div>

                {/* ── Gradient ── */}
                <p className="abs-sec">Gradient</p>
                <div className="abs-gradient-row">
                    {[
                        { key: "gradientFrom", label: "From" },
                        { key: "gradientVia",  label: "Via"  },
                        { key: "gradientTo",   label: "To"   },
                    ].map(({ key, label }) => (
                        <div key={key} className="abs-color-item">
                            <span className="abs-color-label">{label}</span>
                            <div className="abs-color-wrap">
                                <label style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                                    <div className="abs-color-swatch" style={{ background: settings[key] || '#16a34a' }} />
                                    <input type="color" className="abs-color-input" value={settings[key] || '#16a34a'} onChange={e => update(key, e.target.value)} />
                                </label>
                                <span className="abs-color-hex">{(settings[key] || '#16a34a').toUpperCase()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Preview ── */}
                <div className="abs-preview-card" style={{ marginTop: 24 }}>
                    <div className="abs-preview-label"><EyeIcon size={12} /> Preview</div>
                    <div className="abs-preview-bar" style={{ background: bg }}>
                        <span className="abs-preview-text">{settings.text || "Your banner text here"}</span>
                        {settings.couponCode && (
                            <div className="abs-preview-pill">
                                <span className="abs-preview-code">{settings.couponCode}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Save ── */}
                <button className="abs-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <span className="abs-dots"><span /><span /><span /></span>
                    ) : (
                        <><SaveIcon size={14} /> Save Banner Settings</>
                    )}
                </button>

            </div>
        </>
    );
}