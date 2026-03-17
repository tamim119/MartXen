import { assets } from "../assets/assets";
import { useEffect, useState } from "react";
import { useFloatingToast } from "../components/FloatingToastProvider";
import Loading from "../components/Loading";
import { useCurrentUser } from "../hooks/useAuth";
import { getStoreByUser, createStore } from "../lib/services/storeService";
import { useNavigate, Link, Navigate } from "react-router-dom";
import {
    StoreIcon, UserIcon, TypeIcon, FileTextIcon,
    MailIcon, PhoneIcon, MapPinIcon, UploadIcon,
    ClockIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon,
    SparklesIcon
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Root ── */
.cs-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    padding: 0 24px;
    margin: 48px auto 80px;
    max-width: 680px;
    animation: cs-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes cs-fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
}

/* ── Header ── */
.cs-head { margin-bottom: 32px; }
.cs-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin: 0 0 8px; }
.cs-title span { color: #16a34a; }
.cs-subtitle { font-size: 0.85rem; color: #94a3b8; line-height: 1.65; margin: 0; max-width: 480px; font-weight: 400; }

/* ── Form card ── */
.cs-card {
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 24px; padding: 32px 28px;
    animation: cs-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}

/* ── Logo upload ── */
.cs-logo-label {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 24px; border: 2px dashed #e2e8f0; border-radius: 18px;
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
    margin-bottom: 28px; background: #f8fafc;
}
.cs-logo-label:hover { border-color: #16a34a; background: #f0fdf4; }
.cs-logo-preview { width: 80px; height: 80px; border-radius: 18px; object-fit: cover; border: 2px solid #e2e8f0; }
.cs-logo-placeholder { width: 80px; height: 80px; border-radius: 18px; background: #f1f5f9; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
.cs-logo-text { font-size: 0.8rem; font-weight: 600; color: #64748b; text-align: center; display: flex; align-items: center; gap: 6px; }
.cs-logo-hint { font-size: 0.72rem; color: #94a3b8; font-weight: 400; }

/* ── Fields ── */
.cs-fields { display: flex; flex-direction: column; gap: 16px; }
.cs-field { display: flex; flex-direction: column; gap: 6px; }
.cs-label { font-size: 0.72rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; }
.cs-label svg { color: #94a3b8; }
.cs-input, .cs-textarea {
    width: 100%; padding: 12px 14px;
    border: 1.5px solid #f1f5f9; border-radius: 14px;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; color: #0f172a; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-weight: 500; box-sizing: border-box;
}
.cs-input::placeholder, .cs-textarea::placeholder { color: #cbd5e1; font-weight: 400; }
.cs-input:focus, .cs-textarea:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.cs-textarea { resize: none; line-height: 1.65; }
.cs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 480px) { .cs-row { grid-template-columns: 1fr; } }

/* ── Submit ── */
.cs-submit {
    width: 100%; padding: 14px; background: #16a34a; color: #fff;
    font-size: 0.9rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 14px; cursor: pointer; margin-top: 8px;
    transition: all 0.22s; box-shadow: 0 4px 16px rgba(22,163,74,0.3);
    display: flex; align-items: center; justify-content: center; gap: 8px;
}
.cs-submit:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 22px rgba(22,163,74,0.38); }
.cs-submit:active { transform: scale(0.98); }
.cs-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* ═══════════════════════════════════
   STATUS / ACCESS SCREENS
═══════════════════════════════════ */
.cs-status-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 80vh;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: cs-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}

.cs-status-card {
    text-align: center;
    padding: 52px 44px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.06);
    max-width: 420px; width: 100%;
    position: relative;
    overflow: hidden;
}

/* subtle top accent line */
.cs-status-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 28px 28px 0 0;
}
.cs-status-card.pending::before  { background: linear-gradient(90deg, #f59e0b, #fde68a); }
.cs-status-card.approved::before { background: linear-gradient(90deg, #16a34a, #4ade80); }
.cs-status-card.rejected::before { background: linear-gradient(90deg, #ef4444, #fca5a5); }
.cs-status-card.access::before   { background: linear-gradient(90deg, #ef4444, #fca5a5); }

/* icon circle */
.cs-status-icon {
    width: 76px; height: 76px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px;
}
.cs-status-icon.pending  { background: #fefce8; border: 1.5px solid #fde68a; color: #d97706; }
.cs-status-icon.approved { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; }
.cs-status-icon.rejected { background: #fef2f2; border: 1.5px solid #fecaca; color: #ef4444; }
.cs-status-icon.access   { background: #fef2f2; border: 1.5px solid #fecaca; color: #ef4444; }

/* badge */
.cs-status-badge {
    display: inline-flex; align-items: center; gap: 6px;
    border-radius: 100px; padding: 5px 14px;
    font-size: 0.75rem; font-weight: 700; margin-bottom: 16px;
}
.cs-status-badge.pending  { background: #fefce8; border: 1.5px solid #fde68a; color: #854d0e; }
.cs-status-badge.approved { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #15803d; }
.cs-status-badge.rejected { background: #fef2f2; border: 1.5px solid #fecaca; color: #b91c1c; }
.cs-status-badge.access   { background: #fef2f2; border: 1.5px solid #fecaca; color: #b91c1c; }

.cs-badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.cs-status-badge.pending  .cs-badge-dot { background: #f59e0b; }
.cs-status-badge.approved .cs-badge-dot { background: #16a34a; box-shadow: 0 0 5px rgba(22,163,74,0.5); animation: cs-badgePulse 2s ease-in-out infinite; }
.cs-status-badge.rejected .cs-badge-dot { background: #ef4444; }
.cs-status-badge.access   .cs-badge-dot { background: #ef4444; }
@keyframes cs-badgePulse { 0%,100%{box-shadow:0 0 3px rgba(22,163,74,0.4);} 50%{box-shadow:0 0 8px rgba(22,163,74,0.7);} }

.cs-status-title {
    font-size: 1.15rem; font-weight: 800; color: #0f172a;
    margin: 0 0 10px; letter-spacing: -0.3px;
}
.cs-status-msg {
    font-size: 0.84rem; color: #64748b; line-height: 1.7;
    margin: 0 0 24px; font-weight: 400;
}

/* CTA button */
.cs-cta-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 13px 28px; border-radius: 100px;
    font-weight: 700; font-size: 0.875rem; text-decoration: none;
    transition: all 0.22s; border: none; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
}
.cs-cta-btn.green {
    background: #16a34a; color: #fff;
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}
.cs-cta-btn.green:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(22,163,74,0.38); }

/* redirect note */
.cs-redirect-note {
    font-size: 0.75rem; color: #94a3b8;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    margin-top: 14px;
}
.cs-redirect-note b { color: #16a34a; font-weight: 700; }

/* pricing features list */
.cs-features {
    display: flex; flex-direction: column; gap: 8px;
    margin: 0 0 24px; text-align: left;
    background: #f8fafc; border: 1.5px solid #f1f5f9;
    border-radius: 14px; padding: 14px 16px;
}
.cs-feature {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.8rem; font-weight: 500; color: #475569;
}
.cs-feature-dot { width: 18px; height: 18px; border-radius: 50%; background: #f0fdf4; border: 1.5px solid #bbf7d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

@media (max-width: 480px) {
    .cs-root { padding: 0 14px; margin: 32px auto 60px; }
    .cs-card { padding: 22px 16px; border-radius: 18px; }
    .cs-status-card { padding: 40px 22px; border-radius: 22px; }
    .cs-title { font-size: 1.5rem; }
}
`;

const STATUS_CONFIG = {
    pending: {
        icon: ClockIcon, iconClass: 'pending',
        badgeClass: 'pending', badgeLabel: 'Under Review',
        title: 'Application Submitted!',
        cardClass: 'pending',
    },
    approved: {
        icon: CheckCircleIcon, iconClass: 'approved',
        badgeClass: 'approved', badgeLabel: 'Approved',
        title: 'Store Approved!',
        cardClass: 'approved',
    },
    rejected: {
        icon: XCircleIcon, iconClass: 'rejected',
        badgeClass: 'rejected', badgeLabel: 'Rejected',
        title: 'Application Rejected',
        cardClass: 'rejected',
    },
};

export default function CreateStore() {
    const { user, loading: authLoading } = useCurrentUser();
    const { showToast } = useFloatingToast();
    const navigate = useNavigate();

    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [status,  setStatus]  = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const [storeInfo, setStoreInfo] = useState({
        name: "", username: "", description: "",
        email: "", contact: "", address: "", image: ""
    });

    const onChange = (e) => setStoreInfo(p => ({ ...p, [e.target.name]: e.target.value }));

    const fetchSellerStatus = async () => {
        if (!user) { setLoading(false); return; }
        try {
            const store = await getStoreByUser(user.uid);
            if (store) {
                setAlreadySubmitted(true);
                setStatus(store.status);
                if (store.status === "pending") {
                    setMessage("Your store application is under review. Our team will respond within 24 hours.");
                } else if (store.status === "approved") {
                    setMessage("Your store is live! You'll be redirected to your seller dashboard shortly.");
                    setTimeout(() => navigate("/store"), 5000);
                } else if (store.status === "rejected") {
                    setMessage("Unfortunately your application was rejected. Please contact support for more information.");
                }
            }
        } catch (err) { 
            console.error(err);
            showToast("Failed to load store status", "error");
        }
        finally { setLoading(false); }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            showToast("Please login first!", "error");
            return;
        }

        // Validation
        if (!storeInfo.name.trim()) {
            showToast("Please enter store name", "error");
            return;
        }

        if (!storeInfo.username.trim()) {
            showToast("Please enter username", "error");
            return;
        }

        if (!storeInfo.description.trim()) {
            showToast("Please enter store description", "error");
            return;
        }

        if (!storeInfo.email.trim()) {
            showToast("Please enter email", "error");
            return;
        }

        if (!storeInfo.contact.trim()) {
            showToast("Please enter contact number", "error");
            return;
        }

        if (!storeInfo.address.trim()) {
            showToast("Please enter address", "error");
            return;
        }

        setSubmitting(true);
        showToast("Creating store...", "info");

        try {
            await createStore(user.uid, {
                name: storeInfo.name, 
                username: storeInfo.username,
                description: storeInfo.description, 
                email: storeInfo.email,
                contact: storeInfo.contact, 
                address: storeInfo.address,
            }, storeInfo.image || null);
            
            setAlreadySubmitted(true);
            setStatus("approved");
            setMessage("Your store is live! You'll be redirected to your seller dashboard shortly.");
            
            showToast("🎉 Store created successfully!", "success");
            
            setTimeout(() => navigate("/store"), 3000);
        } catch (err) { 
            console.error("Store creation error:", err);
            showToast(err.message || "Failed to create store. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (!authLoading) fetchSellerStatus();
    }, [user, authLoading]);

    if (authLoading || loading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;

    /* ── Access denied (no Plus) ── */
    if (user.role !== "plus" && user.role !== "seller") {
        return (
            <>
                <style>{CSS}</style>
                <div className="cs-status-root">
                    <div className="cs-status-card access">
                        <div className="cs-status-icon access">
                            <XCircleIcon size={32} strokeWidth={1.8} />
                        </div>

                        <span className="cs-status-badge access">
                            <span className="cs-badge-dot" />
                            Access Denied
                        </span>

                        <p className="cs-status-title">Plus Membership Required</p>
                        <p className="cs-status-msg">
                            You need an active Plus membership to open a store on DynamicxMart.
                            Upgrade now and start selling today.
                        </p>

                        {/* Feature highlights */}
                        <div className="cs-features">
                            {[
                                "Create and manage your own online store",
                                "List unlimited products with images",
                                "Receive orders and manage deliveries",
                                "Access seller analytics & earnings",
                            ].map((f, i) => (
                                <div key={i} className="cs-feature">
                                    <div className="cs-feature-dot">
                                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {f}
                                </div>
                            ))}
                        </div>

                        <Link to="/pricing" className="cs-cta-btn green">
                            <SparklesIcon size={15} />
                            Get Plus Membership
                            <ArrowRightIcon size={14} />
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    /* ── Already submitted — status screen ── */
    if (alreadySubmitted) {
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.approved;
        const StatusIcon = cfg.icon;
        return (
            <>
                <style>{CSS}</style>
                <div className="cs-status-root">
                    <div className={`cs-status-card ${cfg.cardClass}`}>
                        <div className={`cs-status-icon ${cfg.iconClass}`}>
                            <StatusIcon size={32} strokeWidth={1.8} />
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
                                    <StoreIcon size={15} />
                                    Go to Dashboard
                                    <ArrowRightIcon size={14} />
                                </Link>
                                <p className="cs-redirect-note">
                                    <ArrowRightIcon size={12} />
                                    Auto-redirecting in <b>3 seconds</b>
                                </p>
                            </>
                        )}
                        {status === "pending" && (
                            <Link to="/" className="cs-cta-btn green">
                                Back to Home <ArrowRightIcon size={14} />
                            </Link>
                        )}
                        {status === "rejected" && (
                            <Link to="/" className="cs-cta-btn green">
                                Back to Home <ArrowRightIcon size={14} />
                            </Link>
                        )}
                    </div>
                </div>
            </>
        );
    }

    /* ── Store creation form ── */
    return (
        <>
            <style>{CSS}</style>
            <div className="cs-root">
                <div className="cs-head">
                    <h1 className="cs-title">Create your <span>Store</span></h1>
                    <p className="cs-subtitle">
                        Fill in your store details and start selling immediately on DynamicxMart.
                    </p>
                </div>

                <div className="cs-card">
                    <form onSubmit={onSubmit}>
                        {/* Logo */}
                        <label className="cs-logo-label">
                            {storeInfo.image
                                ? <img src={URL.createObjectURL(storeInfo.image)} className="cs-logo-preview" alt="Store logo" />
                                : <div className="cs-logo-placeholder"><StoreIcon size={28} strokeWidth={1.5} /></div>
                            }
                            <span className="cs-logo-text">
                                <UploadIcon size={14} />
                                {storeInfo.image ? 'Change Logo' : 'Upload Store Logo'}
                            </span>
                            <span className="cs-logo-hint">PNG, JPG up to 5MB</span>
                            <input type="file" accept="image/*" hidden
                                onChange={e => setStoreInfo(p => ({ ...p, image: e.target.files[0] }))} />
                        </label>

                        <div className="cs-fields">
                            <div className="cs-row">
                                <div className="cs-field">
                                    <label className="cs-label"><UserIcon size={12} /> Username</label>
                                    <input className="cs-input" name="username" type="text"
                                        placeholder="happyshop"
                                        value={storeInfo.username} onChange={onChange} required />
                                </div>
                                <div className="cs-field">
                                    <label className="cs-label"><TypeIcon size={12} /> Store Name</label>
                                    <input className="cs-input" name="name" type="text"
                                        placeholder="Happy Shop"
                                        value={storeInfo.name} onChange={onChange} required />
                                </div>
                            </div>

                            <div className="cs-field">
                                <label className="cs-label"><FileTextIcon size={12} /> Description</label>
                                <textarea className="cs-textarea" name="description" rows={4}
                                    placeholder="Tell customers what your store is about..."
                                    value={storeInfo.description} onChange={onChange} required />
                            </div>

                            <div className="cs-row">
                                <div className="cs-field">
                                    <label className="cs-label"><MailIcon size={12} /> Email</label>
                                    <input className="cs-input" name="email" type="email"
                                        placeholder="store@example.com"
                                        value={storeInfo.email} onChange={onChange} required />
                                </div>
                                <div className="cs-field">
                                    <label className="cs-label"><PhoneIcon size={12} /> Contact</label>
                                    <input className="cs-input" name="contact" type="text"
                                        placeholder="+880 1234 567890"
                                        value={storeInfo.contact} onChange={onChange} required />
                                </div>
                            </div>

                            <div className="cs-field">
                                <label className="cs-label"><MapPinIcon size={12} /> Address</label>
                                <textarea className="cs-textarea" name="address" rows={3}
                                    placeholder="123 Main St, Dhaka, Bangladesh"
                                    value={storeInfo.address} onChange={onChange} required />
                            </div>

                            <button type="submit" className="cs-submit" disabled={submitting}>
                                <StoreIcon size={16} />
                                {submitting ? "Creating Store..." : "Create Store"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}