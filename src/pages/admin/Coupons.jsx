import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2Icon, PlusIcon, TagIcon, TicketIcon } from "lucide-react";
import {
    getAllCoupons,
    createCoupon,
    deleteCoupon as deleteCouponService
} from "../../lib/services/couponService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ac-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    margin-bottom: 80px;
}

.ac-page-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 6px; line-height: 1.2; }
.ac-page-title span { color: #0f172a; font-weight: 800; }
.ac-page-sub { font-size: 0.82rem; color: #94a3b8; margin: 0 0 24px; font-weight: 400; }

/* ── Alert ── */
.ac-alert { display: flex; align-items: flex-start; gap: 10px; padding: 11px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; line-height: 1.5; margin-bottom: 20px; }
.ac-alert-icon { width: 17px; height: 17px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.6rem; font-weight: 800; }
.ac-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.ac-alert.error   .ac-alert-icon { background: #fda4af; color: #9f1239; }
.ac-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.ac-alert.success .ac-alert-icon { background: #86efac; color: #14532d; }
.ac-alert-body { flex: 1; }
.ac-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.9rem; color: inherit; transition: opacity 0.15s; }
.ac-alert-close:hover { opacity: 1; }

/* form alert — inside form card */
.ac-form-alert { margin-bottom: 14px; }

/* ── Layout ── */
.ac-layout { display: flex; gap: 20px; align-items: flex-start; }
@media (max-width: 1024px) { .ac-layout { flex-direction: column; } }

/* ── Form card ── */
.ac-form-card { width: 300px; flex-shrink: 0; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 22px 20px; position: sticky; top: 20px; }
@media (max-width: 1024px) { .ac-form-card { width: 100%; position: static; box-sizing: border-box; } }

.ac-form-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.ac-form-sub   { font-size: 0.75rem; color: #94a3b8; margin: 0 0 16px; font-weight: 400; }
.ac-divider    { height: 1.5px; background: #f8fafc; margin: 0 -20px 16px; }

.ac-label { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; display: block; }
.ac-field { margin-bottom: 11px; }

.ac-input { width: 100%; padding: 9px 12px; border: 1.5px solid #f1f5f9; border-radius: 11px; font-size: 0.84rem; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; font-weight: 500; box-sizing: border-box; }
.ac-input::placeholder { color: #cbd5e1; font-weight: 400; }
.ac-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.ac-input:disabled { opacity: 0.6; cursor: not-allowed; }
.ac-input.err { border-color: #fca5a5; background: #fff1f2; }

.ac-row { display: flex; gap: 10px; }
.ac-row .ac-field { flex: 1; min-width: 0; }

/* ── Toggles ── */
.ac-toggles { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.ac-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 11px; transition: border-color 0.18s, background 0.18s; cursor: pointer; }
.ac-toggle-row:has(input:checked) { border-color: #bbf7d0; background: #f0fdf4; }
.ac-toggle-label { font-size: 0.81rem; font-weight: 600; color: #0f172a; }
.ac-toggle-track { position: relative; width: 36px; height: 20px; background: #e2e8f0; border-radius: 10px; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
.ac-toggle-track:has(input:checked) { background: #16a34a; }
.ac-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.ac-toggle-thumb { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 0.2s cubic-bezier(0.4,0,0.2,1); pointer-events: none; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
.ac-toggle-track:has(input:checked) .ac-toggle-thumb { transform: translateX(16px); }

/* ── Submit ── */
.ac-submit { width: 100%; padding: 11px; background: #16a34a; color: #fff; font-size: 0.875rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 100px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transition: all 0.2s; box-shadow: 0 4px 14px rgba(22,163,74,0.28); }
.ac-submit:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(22,163,74,0.36); }
.ac-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* loading dots */
.ac-dots { display: inline-flex; align-items: center; gap: 4px; }
.ac-dots span { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.85); display: inline-block; animation: ac-dot 1.1s ease-in-out infinite; }
.ac-dots span:nth-child(2) { animation-delay: 0.18s; }
.ac-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes ac-dot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-4px);opacity:1} }

/* ── Table section ── */
.ac-table-section { flex: 1; min-width: 0; width: 100%; }
.ac-table-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.ac-table-title  { font-size: 0.9rem; font-weight: 700; color: #0f172a; }
.ac-count-badge  { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.7rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

.ac-table-wrap { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; }
@media (max-width: 768px) { .ac-table-wrap { overflow: visible; background: transparent; border: none; border-radius: 0; } .ac-table { display: none; } .ac-coupon-cards { display: flex !important; flex-direction: column; gap: 10px; } }

.ac-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.ac-table thead tr th { padding: 11px 14px; font-size: 0.67rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; background: #f8fafc; border-bottom: 1.5px solid #f1f5f9; white-space: nowrap; }
.ac-table tbody tr { border-bottom: 1.5px solid #f8fafc; transition: background 0.15s; }
.ac-table tbody tr:last-child { border-bottom: none; }
.ac-table tbody tr:hover { background: #f8fafc; }
.ac-table td { padding: 12px 14px; color: #475569; font-weight: 500; vertical-align: middle; }

.ac-coupon-cards { display: none; }
.ac-coupon-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: border-color 0.18s, box-shadow 0.18s; }
.ac-coupon-card:hover { border-color: #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.05); }
.ac-coupon-card-left { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.ac-coupon-card-top  { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.ac-coupon-card-desc { font-size: 0.78rem; color: #64748b; font-weight: 500; }
.ac-coupon-card-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.ac-meta-tag     { font-size: 0.65rem; font-weight: 700; padding: 2px 8px; border-radius: 100px; background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; }
.ac-meta-expires { font-size: 0.65rem; font-weight: 600; color: #94a3b8; }

.ac-code-badge     { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 3px 9px; font-size: 0.76rem; font-weight: 700; color: #15803d; letter-spacing: 0.4px; white-space: nowrap; }
.ac-discount-badge { display: inline-block; background: #fef9c3; border: 1.5px solid #fde68a; border-radius: 8px; padding: 2px 8px; font-size: 0.76rem; font-weight: 700; color: #854d0e; white-space: nowrap; }
.ac-yes { color: #16a34a; font-weight: 700; }
.ac-no  { color: #e2e8f0; font-weight: 500; }

.ac-del-btn { width: 30px; height: 30px; border-radius: 8px; background: #fff; border: 1.5px solid #fee2e2; color: #ef4444; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s; flex-shrink: 0; }
.ac-del-btn:hover:not(:disabled) { background: #fef2f2; border-color: #fca5a5; transform: scale(1.08); box-shadow: 0 3px 10px rgba(239,68,68,0.15); }
.ac-del-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.ac-empty { width: 100%; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 52px 20px; color: #94a3b8; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; text-align: center; }
.ac-empty-icon { width: 60px; height: 60px; border-radius: 18px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
.ac-empty p    { font-size: 0.875rem; font-weight: 600; color: #475569; margin: 0 0 4px; }
.ac-empty span { font-size: 0.775rem; color: #cbd5e1; }

@media (max-width: 480px) { .ac-page-title { font-size: 1.2rem; } }
`;

const Alert = ({ type, message, onDismiss, small }) => {
    const icons = { error: '✕', success: '✓' };
    return (
        <div className={`ac-alert ${type}${small ? ' ac-form-alert' : ''}`}>
            <div className="ac-alert-icon">{icons[type]}</div>
            <div className="ac-alert-body">{message}</div>
            <button className="ac-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

const EMPTY = {
    code: "", description: "", discount: "",
    forNewUser: false, forMember: false,
    isPublic: false, expiresAt: new Date(),
};

export default function AdminCoupons() {
    const [coupons,      setCoupons]      = useState([]);
    const [newCoupon,    setNewCoupon]    = useState(EMPTY);
    const [submitting,   setSubmitting]   = useState(false);
    const [deletingCode, setDeletingCode] = useState(null);
    const [pageAlert,    setPageAlert]    = useState(null); // top-level alert
    const [formAlert,    setFormAlert]    = useState(null); // inside form card

    const showPageAlert = (type, msg) => setPageAlert({ type, message: msg });
    const showFormAlert = (type, msg) => setFormAlert({ type, message: msg });
    const clearPageAlert = () => setPageAlert(null);
    const clearFormAlert = () => setFormAlert(null);

    useEffect(() => {
        getAllCoupons()
            .then(setCoupons)
            .catch(() => showPageAlert("error", "Failed to load coupons."));
    }, []);

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
        clearFormAlert();
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        clearFormAlert();

        if (!newCoupon.code.trim())         { showFormAlert("error", "Please enter a coupon code."); return; }
        if (!newCoupon.description.trim())  { showFormAlert("error", "Please enter a description."); return; }
        if (!newCoupon.discount || newCoupon.discount < 1 || newCoupon.discount > 100) {
            showFormAlert("error", "Discount must be between 1% and 100%.");
            return;
        }

        setSubmitting(true);
        try {
            await createCoupon({
                ...newCoupon,
                discount: parseFloat(newCoupon.discount),
                expiresAt: new Date(newCoupon.expiresAt),
            });
            const updated = await getAllCoupons();
            setCoupons(updated);
            setNewCoupon(EMPTY);
            showPageAlert("success", `Coupon "${newCoupon.code}" created successfully.`);
        } catch (err) {
            console.error(err);
            showFormAlert("error", err.message || "Failed to create coupon. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (code) => {
        setDeletingCode(code);
        try {
            await deleteCouponService(code);
            setCoupons(prev => prev.filter(c => c.code !== code));
        } catch (err) {
            console.error(err);
            showPageAlert("error", `Failed to delete coupon "${code}". Please try again.`);
        } finally {
            setDeletingCode(null);
        }
    };

    const formatDate = (val) => {
        try {
            const d = val?.toDate ? val.toDate() : new Date(val);
            return format(d, "MMM dd, yyyy");
        } catch { return "—"; }
    };

    const deleteBtn = (coupon) => (
        <button className="ac-del-btn" onClick={() => handleDelete(coupon.code)} disabled={deletingCode === coupon.code}>
            <Trash2Icon size={13} />
        </button>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="ac-root">

                <h1 className="ac-page-title">Coupon <span>Management</span></h1>
                <p className="ac-page-sub">Create and manage discount codes for your customers</p>

                {pageAlert && <Alert type={pageAlert.type} message={pageAlert.message} onDismiss={clearPageAlert} />}

                <div className="ac-layout">

                    {/* ── Form ── */}
                    <div className="ac-form-card">
                        <p className="ac-form-title">Create Coupon</p>
                        <p className="ac-form-sub">Add a new discount code</p>
                        <div className="ac-divider" />

                        {formAlert && <Alert type={formAlert.type} message={formAlert.message} onDismiss={clearFormAlert} small />}

                        <form onSubmit={handleAddCoupon}>
                            <div className="ac-row">
                                <div className="ac-field">
                                    <label className="ac-label">Code</label>
                                    <input className="ac-input" type="text" name="code" placeholder="SAVE20" value={newCoupon.code} onChange={handleChange} disabled={submitting} />
                                </div>
                                <div className="ac-field">
                                    <label className="ac-label">Discount %</label>
                                    <input className="ac-input" type="number" name="discount" placeholder="20" min={1} max={100} value={newCoupon.discount} onChange={handleChange} disabled={submitting} />
                                </div>
                            </div>

                            <div className="ac-field">
                                <label className="ac-label">Description</label>
                                <input className="ac-input" type="text" name="description" placeholder="Summer sale discount" value={newCoupon.description} onChange={handleChange} disabled={submitting} />
                            </div>

                            <div className="ac-field">
                                <label className="ac-label">Expiry Date</label>
                                <input className="ac-input" type="date" name="expiresAt"
                                    value={format(newCoupon.expiresAt instanceof Date ? newCoupon.expiresAt : new Date(newCoupon.expiresAt), "yyyy-MM-dd")}
                                    onChange={e => setNewCoupon({ ...newCoupon, expiresAt: new Date(e.target.value) })}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="ac-toggles">
                                {[
                                    { key: "forNewUser", label: "For New Users" },
                                    { key: "forMember",  label: "For Plus Members" },
                                ].map(({ key, label }) => (
                                    <div key={key} className="ac-toggle-row">
                                        <span className="ac-toggle-label">{label}</span>
                                        <label className="ac-toggle-track">
                                            <input type="checkbox" checked={newCoupon[key]} onChange={e => setNewCoupon({ ...newCoupon, [key]: e.target.checked })} disabled={submitting} />
                                            <span className="ac-toggle-thumb" />
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" className="ac-submit" disabled={submitting}>
                                {submitting
                                    ? <span className="ac-dots"><span /><span /><span /></span>
                                    : <><PlusIcon size={15} /> Add Coupon</>
                                }
                            </button>
                        </form>
                    </div>

                    {/* ── Table / Cards ── */}
                    <div className="ac-table-section">
                        <div className="ac-table-header">
                            <p className="ac-table-title">Active Coupons</p>
                            {coupons.length > 0 && <span className="ac-count-badge">{coupons.length} total</span>}
                        </div>

                        {coupons.length === 0 ? (
                            <div className="ac-empty">
                                <div className="ac-empty-icon"><TicketIcon size={24} style={{ color: '#cbd5e1' }} /></div>
                                <p>No coupons yet</p>
                                <span>Create your first discount code</span>
                            </div>
                        ) : (
                            <>
                                <div className="ac-table-wrap">
                                    <table className="ac-table">
                                        <thead>
                                            <tr>{["Code","Description","Discount","Expires","New User","Plus Member",""].map(h => <th key={h}>{h}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {coupons.map(coupon => (
                                                <tr key={coupon.code}>
                                                    <td><span className="ac-code-badge"><TagIcon size={10} />{coupon.code}</span></td>
                                                    <td style={{ color: '#64748b' }}>{coupon.description}</td>
                                                    <td><span className="ac-discount-badge">{coupon.discount}% off</span></td>
                                                    <td style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{formatDate(coupon.expiresAt)}</td>
                                                    <td className={coupon.forNewUser ? 'ac-yes' : 'ac-no'}>{coupon.forNewUser ? "✓" : "—"}</td>
                                                    <td className={coupon.forMember  ? 'ac-yes' : 'ac-no'}>{coupon.forMember  ? "✓" : "—"}</td>
                                                    <td>{deleteBtn(coupon)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="ac-coupon-cards">
                                    {coupons.map(coupon => (
                                        <div key={coupon.code} className="ac-coupon-card">
                                            <div className="ac-coupon-card-left">
                                                <div className="ac-coupon-card-top">
                                                    <span className="ac-code-badge"><TagIcon size={10} />{coupon.code}</span>
                                                    <span className="ac-discount-badge">{coupon.discount}% off</span>
                                                </div>
                                                <p className="ac-coupon-card-desc">{coupon.description}</p>
                                                <div className="ac-coupon-card-meta">
                                                    {coupon.forNewUser && <span className="ac-meta-tag">New Users</span>}
                                                    {coupon.forMember  && <span className="ac-meta-tag">Plus Members</span>}
                                                    <span className="ac-meta-expires">Expires {formatDate(coupon.expiresAt)}</span>
                                                </div>
                                            </div>
                                            {deleteBtn(coupon)}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}