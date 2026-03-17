import React, { useState, useEffect } from "react";
import { useCurrentUser } from "../hooks/useAuth";
import { useFloatingToast } from "../components/FloatingToastProvider";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import {
    collection, addDoc, updateDoc,
    deleteDoc, doc, onSnapshot, serverTimestamp
} from "firebase/firestore";
import Loading from "../components/Loading";

export const DIVISIONS = [
    "Dhaka","Chattogram","Rajshahi","Khulna",
    "Barishal","Sylhet","Rangpur","Mymensingh"
];
export const getShippingFee = (division = "") =>
    division.toLowerCase().trim() === "dhaka" ? 60 : 120;

const emptyForm = {
    label: "Home", firstName: "", lastName: "",
    phone: "", street: "", city: "", division: "", isDefault: false
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.ab-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff; min-height: 70vh;
}

@keyframes ab-fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
@keyframes ab-fadeIn  { from { opacity:0; } to { opacity:1; } }
@keyframes ab-slideUp { from { opacity:0; transform:translateY(28px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
@keyframes ab-spin    { to { transform:rotate(360deg); } }

.ab-hero {
    background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%);
    border-bottom: 1.5px solid #f1f5f9;
    padding: 56px 24px 44px; text-align: center;
    animation: ab-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
.ab-eyebrow { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.ab-eyebrow-line { width: 36px; height: 1.5px; background: #16a34a; border-radius: 2px; }
.ab-eyebrow-text { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #16a34a; }
.ab-hero-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #0f172a; letter-spacing: -0.03em; line-height: 1.15; margin: 0 0 12px; }
.ab-hero-title span { color: #16a34a; }
.ab-hero-sub { font-size: 0.9rem; color: #64748b; max-width: 400px; margin: 0 auto; line-height: 1.65; }

.ab-body { max-width: 860px; margin: 0 auto; padding: 40px 32px 80px; }

.ab-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
    animation: ab-fadeUp 0.5s 0.08s cubic-bezier(0.4,0,0.2,1) both;
}
.ab-top-title { font-size: 0.82rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px; }
.ab-top-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.68rem; font-weight: 700; padding: 2px 10px; border-radius: 100px; }

.ab-add-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: #16a34a; color: #fff; border: none;
    padding: 10px 20px; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.78rem; font-weight: 700; border-radius: 100px;
    cursor: pointer; transition: all 0.22s;
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}
.ab-add-btn:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(22,163,74,0.38); }

.ab-empty {
    text-align: center; padding: 64px 24px;
    animation: ab-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
.ab-empty-icon {
    width: 72px; height: 72px; border-radius: 50%;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 18px; color: #cbd5e1;
}
.ab-empty-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
.ab-empty-sub { font-size: 0.82rem; color: #94a3b8; margin: 0; }

.ab-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
    animation: ab-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}

.ab-card {
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 20px; padding: 20px 20px 16px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.ab-card:hover { border-color: #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-2px); }
.ab-card.is-default { border-color: #16a34a; box-shadow: 0 4px 16px rgba(22,163,74,0.1); }

.ab-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; gap: 8px; }
.ab-card-badges { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.ab-card-label { font-size: 0.72rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.08em; }
.ab-default-badge { font-size: 0.62rem; font-weight: 700; background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; padding: 2px 8px; border-radius: 100px; }
.ab-ship-badge { font-size: 0.62rem; font-weight: 700; background: #f8fafc; color: #64748b; border: 1.5px solid #e2e8f0; padding: 2px 8px; border-radius: 100px; }

.ab-card-actions { display: flex; gap: 5px; flex-shrink: 0; }
.ab-action-btn {
    padding: 5px 10px; border-radius: 8px;
    font-size: 0.7rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: 1.5px solid #e2e8f0; background: #fff;
    color: #64748b; cursor: pointer; transition: all 0.18s;
}
.ab-action-btn:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
.ab-action-btn.danger:hover { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }

.ab-card-name { font-size: 0.875rem; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
.ab-card-line { font-size: 0.8rem; color: #64748b; line-height: 1.65; margin: 0; }
.ab-card-phone { font-size: 0.78rem; color: #94a3b8; margin: 8px 0 0; font-weight: 500; }

.ab-set-default-btn {
    margin-top: 12px; padding-top: 12px;
    border-top: 1.5px solid #f8fafc;
    display: flex; align-items: center; gap: 6px;
    background: none; border-left: none; border-right: none; border-bottom: none;
    width: 100%; cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.72rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.08em;
    transition: color 0.18s;
}
.ab-set-default-btn:hover { color: #16a34a; }

.ab-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15,23,42,0.5);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: ab-fadeIn 0.22s cubic-bezier(0.4,0,0.2,1) both;
}

.ab-modal {
    background: #fff; width: 100%; max-width: 500px;
    max-height: 92vh; overflow-y: auto;
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.2);
    animation: ab-slideUp 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
}
.ab-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 24px 18px; border-bottom: 1.5px solid #f1f5f9;
    position: sticky; top: 0; background: #fff; z-index: 1;
    border-radius: 24px 24px 0 0;
}
.ab-modal-eyebrow { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #94a3b8; margin-bottom: 3px; }
.ab-modal-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.01em; }
.ab-modal-close {
    width: 34px; height: 34px; border-radius: 50%;
    background: #f8fafc; border: 1.5px solid #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #94a3b8; transition: all 0.18s; flex-shrink: 0;
}
.ab-modal-close:hover { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

.ab-modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 18px; }

.ab-sec-label {
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: #94a3b8; margin-bottom: 10px;
    display: flex; align-items: center; gap: 8px;
}
.ab-sec-label::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

.ab-type-seg {
    display: grid; grid-template-columns: 1fr 1fr;
    border: 1.5px solid #f1f5f9; border-radius: 14px; overflow: hidden;
}
.ab-type-btn {
    padding: 11px 0; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.78rem; font-weight: 700; border: none; background: #f8fafc;
    cursor: pointer; color: #94a3b8;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: all 0.2s;
}
.ab-type-btn:last-child { border-left: 1.5px solid #f1f5f9; }
.ab-type-btn.on { background: #f0fdf4; color: #16a34a; }
.ab-type-btn.on:last-child { border-left-color: #bbf7d0; }

.ab-inp-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ab-field { position: relative; display: flex; align-items: center; }
.ab-field-icon { position: absolute; left: 12px; color: #cbd5e1; pointer-events: none; flex-shrink: 0; transition: color 0.18s; }
.ab-field:focus-within .ab-field-icon { color: #16a34a; }
.ab-inp {
    width: 100%; padding: 11px 14px 11px 36px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.855rem; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; color: #0f172a; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-weight: 500; box-sizing: border-box;
}
.ab-inp::placeholder { color: #cbd5e1; font-weight: 400; }
.ab-inp:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }

.ab-sel-wrap { position: relative; }
.ab-sel {
    width: 100%; padding: 11px 36px 11px 14px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.855rem; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; color: #0f172a; outline: none;
    appearance: none; cursor: pointer; font-weight: 500;
    transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
.ab-sel:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.ab-sel-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #94a3b8; }

.ab-ship-chip {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px;
}
.ab-ship-chip-tag { font-size: 0.62rem; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 2px; }
.ab-ship-chip-city { font-size: 0.78rem; color: #475569; font-weight: 500; }
.ab-ship-chip-fee { font-size: 1.1rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }

.ab-default-row {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px; border: 1.5px solid #f1f5f9; border-radius: 14px;
    cursor: pointer; transition: border-color 0.18s, background 0.18s; background: #f8fafc;
}
.ab-default-row:hover { border-color: #bbf7d0; background: #f0fdf4; }
.ab-default-chk { width: 16px; height: 16px; accent-color: #16a34a; flex-shrink: 0; cursor: pointer; }
.ab-default-txt { font-size: 0.82rem; font-weight: 600; color: #0f172a; }
.ab-default-sub { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin-top: 1px; }

.ab-modal-foot {
    padding: 16px 24px; border-top: 1.5px solid #f1f5f9;
    display: flex; gap: 10px; justify-content: flex-end;
    background: #f8fafc; border-radius: 0 0 24px 24px;
    position: sticky; bottom: 0;
}
.ab-modal-cancel {
    padding: 11px 20px; border-radius: 100px;
    border: 1.5px solid #e2e8f0; background: #fff; color: #64748b;
    font-size: 0.78rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s;
}
.ab-modal-cancel:hover { border-color: #94a3b8; color: #0f172a; }
.ab-modal-save {
    padding: 11px 24px; border-radius: 100px;
    background: #16a34a; color: #fff; border: none;
    font-size: 0.78rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
    display: inline-flex; align-items: center; gap: 7px;
    transition: all 0.22s; box-shadow: 0 4px 12px rgba(22,163,74,0.3);
}
.ab-modal-save:hover:not(:disabled) { background: #15803d; }
.ab-modal-save:disabled { opacity: 0.45; cursor: not-allowed; }
.ab-spin { animation: ab-spin 0.8s linear infinite; }

.ab-del-modal {
    background: #fff; width: 100%; max-width: 340px;
    border-radius: 24px; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.2);
    animation: ab-slideUp 0.28s cubic-bezier(0.34,1.3,0.64,1) both;
}
.ab-del-strip { height: 4px; background: linear-gradient(90deg, #dc2626, #ef4444, #fca5a5); }
.ab-del-body { padding: 28px 24px 22px; }
.ab-del-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: #fef2f2; border: 1.5px solid #fecaca;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px; color: #ef4444;
}
.ab-del-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 8px; }
.ab-del-sub { font-size: 0.82rem; color: #94a3b8; text-align: center; line-height: 1.65; margin: 0 0 22px; }
.ab-del-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.ab-del-cancel {
    padding: 12px; border-radius: 12px;
    border: 1.5px solid #e2e8f0; color: #64748b; background: #fff;
    font-size: 0.78rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s;
}
.ab-del-cancel:hover { border-color: #94a3b8; color: #0f172a; }
.ab-del-confirm {
    padding: 12px; border-radius: 12px; border: none;
    background: #ef4444; color: #fff;
    font-size: 0.78rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.18s;
}
.ab-del-confirm:hover { background: #dc2626; transform: translateY(-1px); }

@media (max-width: 600px) {
    .ab-body { padding: 28px 16px 60px; }
    .ab-inp-row { grid-template-columns: 1fr; }
    .ab-modal-body { padding: 18px 16px; }
    .ab-modal-head { padding: 18px 18px 14px; }
    .ab-modal-foot { padding: 14px 18px; }
}
@media (max-width: 480px) { .ab-hero { padding: 40px 16px 32px; } }
`;

const AddressBook = () => {
    const { user, loading: authLoading } = useCurrentUser();
    const { showToast } = useFloatingToast();
    const navigate = useNavigate();
    
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        
        if (!user) {
            navigate("/login");
            return;
        }

        const unsub = onSnapshot(
            collection(db, "users", user.uid, "addresses"),
            snap => {
                setAddresses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                setLoading(false);
            },
            err => {
                console.error("Error loading addresses:", err);
                showToast("Failed to load addresses", "error");
                setLoading(false);
            }
        );
        return () => unsub();
    }, [user, authLoading, navigate, showToast]);

    if (authLoading || loading) return <Loading />;

    const openAdd = () => { setForm(emptyForm); setModal("add"); };
    const openEdit = (addr) => {
        setForm({
            label: addr.label || "Home",
            firstName: addr.firstName || "",
            lastName: addr.lastName || "",
            phone: addr.phone || "",
            street: addr.street || "",
            city: addr.city || "",
            division: addr.division || "",
            isDefault: addr.isDefault || false,
        });
        setModal(addr);
    };

    const validatePhone = (phone) => {
        const bdPhoneRegex = /^01[3-9]\d{8}$/;
        return bdPhoneRegex.test(phone.replace(/\s/g, ''));
    };

    const handleSave = async () => {
        // Validation
        if (!form.firstName?.trim()) {
            showToast("Please enter first name", "error");
            return;
        }

        if (!form.phone?.trim()) {
            showToast("Please enter phone number", "error");
            return;
        }

        if (!validatePhone(form.phone)) {
            showToast("Please enter a valid phone number (e.g., 01712345678)", "error");
            return;
        }

        if (!form.street?.trim()) {
            showToast("Please enter street address", "error");
            return;
        }

        if (!form.city?.trim()) {
            showToast("Please enter city/area", "error");
            return;
        }

        if (!form.division) {
            showToast("Please select a division", "error");
            return;
        }

        setSaving(true);

        try {
            const ref = collection(db, "users", user.uid, "addresses");

            // If setting as default, remove default from others
            if (form.isDefault) {
                for (const a of addresses) {
                    if (a.isDefault && a.id !== modal?.id) {
                        await updateDoc(doc(db, "users", user.uid, "addresses", a.id), { isDefault: false });
                    }
                }
            }

            if (modal === "add") {
                await addDoc(ref, { ...form, createdAt: serverTimestamp() });
                showToast("✅ Address added successfully!", "success");
            } else {
                await updateDoc(doc(db, "users", user.uid, "addresses", modal.id), form);
                showToast("✅ Address updated successfully!", "success");
            }

            setModal(null);

        } catch (err) {
            console.error("Error saving address:", err);
            showToast("Failed to save address. Please try again", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "users", user.uid, "addresses", id));
            showToast("Address removed successfully", "success");
        } catch (err) {
            console.error("Error deleting address:", err);
            showToast("Failed to delete address. Please try again", "error");
        } finally {
            setDeleteConfirm(null);
        }
    };

    const setDefault = async (addr) => {
        try {
            // Remove default from others
            for (const a of addresses) {
                if (a.isDefault && a.id !== addr.id) {
                    await updateDoc(doc(db, "users", user.uid, "addresses", a.id), { isDefault: false });
                }
            }

            // Set this as default
            await updateDoc(doc(db, "users", user.uid, "addresses", addr.id), { isDefault: true });
            showToast("Default address updated", "success");

        } catch (err) {
            console.error("Error setting default address:", err);
            showToast("Failed to set default address", "error");
        }
    };

    const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

    return (
        <>
            <style>{CSS}</style>
            <div className="ab-root">

                {/* Hero */}
                <div className="ab-hero">
                    <div className="ab-eyebrow">
                        <div className="ab-eyebrow-line" />
                        <span className="ab-eyebrow-text">Account</span>
                        <div className="ab-eyebrow-line" />
                    </div>
                    <h1 className="ab-hero-title">Address <span>Book</span></h1>
                    <p className="ab-hero-sub">Manage your saved delivery addresses</p>
                </div>

                <div className="ab-body">
                    <div className="ab-top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="ab-top-title">Saved Addresses</span>
                            {addresses.length > 0 && (
                                <span className="ab-top-count">{addresses.length}</span>
                            )}
                        </div>
                        <button className="ab-add-btn" onClick={openAdd}>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Address
                        </button>
                    </div>

                    {addresses.length === 0 ? (
                        <div className="ab-empty">
                            <div className="ab-empty-icon">
                                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="ab-empty-title">No Addresses Saved</p>
                            <p className="ab-empty-sub">Add an address to speed up checkout</p>
                        </div>
                    ) : (
                        <div className="ab-grid">
                            {addresses.map(addr => (
                                <div key={addr.id} className={"ab-card" + (addr.isDefault ? " is-default" : "")}>
                                    <div className="ab-card-top">
                                        <div className="ab-card-badges">
                                            <span className="ab-card-label">{addr.label || "Address"}</span>
                                            {addr.isDefault && <span className="ab-default-badge">Default</span>}
                                            <span className="ab-ship-badge">৳{getShippingFee(addr.division)}</span>
                                        </div>
                                        <div className="ab-card-actions">
                                            <button className="ab-action-btn" onClick={() => openEdit(addr)}>Edit</button>
                                            <button className="ab-action-btn danger" onClick={() => setDeleteConfirm(addr.id)}>Delete</button>
                                        </div>
                                    </div>
                                    <p className="ab-card-name">{addr.firstName} {addr.lastName}</p>
                                    <p className="ab-card-line">{addr.street}</p>
                                    <p className="ab-card-line">{addr.city}, {addr.division} Division</p>
                                    <p className="ab-card-phone">{addr.phone}</p>
                                    {!addr.isDefault && (
                                        <button className="ab-set-default-btn" onClick={() => setDefault(addr)}>
                                            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" /><polyline points="12 8 12 12 14 14" />
                                            </svg>
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add / Edit Modal */}
                {modal && (
                    <div className="ab-overlay" onClick={() => setModal(null)}>
                        <div className="ab-modal" onClick={e => e.stopPropagation()}>
                            <div className="ab-modal-head">
                                <div>
                                    <div className="ab-modal-eyebrow">Address Book</div>
                                    <div className="ab-modal-title">
                                        {modal === "add" ? "Add New Address" : "Edit Address"}
                                    </div>
                                </div>
                                <button className="ab-modal-close" onClick={() => setModal(null)}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <div className="ab-modal-body">
                                {/* Type */}
                                <div>
                                    <p className="ab-sec-label">Address Type</p>
                                    <div className="ab-type-seg">
                                        {["Home", "Office"].map(l => (
                                            <button key={l} type="button"
                                                className={"ab-type-btn" + (form.label === l ? " on" : "")}
                                                onClick={() => f("label", l)}
                                            >
                                                {l === "Home" ? (
                                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                                                        <path d="M9 21V12h6v9" />
                                                    </svg>
                                                ) : (
                                                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                                        <rect x="2" y="7" width="20" height="14" rx="1" />
                                                        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                                                    </svg>
                                                )}
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <p className="ab-sec-label">Full Name</p>
                                    <div className="ab-inp-row">
                                        <div className="ab-field">
                                            <svg className="ab-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                                            <input className="ab-inp" placeholder="First Name *" value={form.firstName} onChange={e => f("firstName", e.target.value)} />
                                        </div>
                                        <div className="ab-field">
                                            <svg className="ab-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                                            <input className="ab-inp" placeholder="Last Name" value={form.lastName} onChange={e => f("lastName", e.target.value)} />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <p className="ab-sec-label">Contact</p>
                                    <div className="ab-field">
                                        <svg className="ab-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                                        <input className="ab-inp" type="tel" placeholder="Phone Number *" value={form.phone} onChange={e => f("phone", e.target.value)} />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <p className="ab-sec-label">Delivery Address</p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div className="ab-field">
                                            <svg className="ab-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                            <input className="ab-inp" placeholder="Street Address *" value={form.street} onChange={e => f("street", e.target.value)} />
                                        </div>
                                        <div className="ab-field">
                                            <svg className="ab-field-icon" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                                            <input className="ab-inp" placeholder="City / Area *" value={form.city} onChange={e => f("city", e.target.value)} />
                                        </div>
                                        <div className="ab-sel-wrap">
                                            <select className="ab-sel" value={form.division} onChange={e => f("division", e.target.value)}>
                                                <option value="">— Select Division * —</option>
                                                {DIVISIONS.map(d => <option key={d}>{d}</option>)}
                                            </select>
                                            <svg className="ab-sel-arrow" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping chip */}
                                {form.division && (
                                    <div className="ab-ship-chip">
                                        <div>
                                            <div className="ab-ship-chip-tag">Estimated Shipping</div>
                                            <div className="ab-ship-chip-city">{form.division} Division</div>
                                        </div>
                                        <div className="ab-ship-chip-fee">৳{getShippingFee(form.division)}</div>
                                    </div>
                                )}

                                {/* Default toggle */}
                                <label className="ab-default-row">
                                    <input type="checkbox" className="ab-default-chk" checked={form.isDefault} onChange={e => f("isDefault", e.target.checked)} />
                                    <div>
                                        <div className="ab-default-txt">Set as default address</div>
                                        <div className="ab-default-sub">Used automatically at checkout</div>
                                    </div>
                                </label>
                            </div>

                            <div className="ab-modal-foot">
                                <button className="ab-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
                                <button className="ab-modal-save" onClick={handleSave} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <svg className="ab-spin" width="12" height="12" fill="none" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".2" />
                                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity=".8" />
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Save Address
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete confirm */}
                {deleteConfirm && (
                    <div className="ab-overlay" onClick={() => setDeleteConfirm(null)}>
                        <div className="ab-del-modal" onClick={e => e.stopPropagation()}>
                            <div className="ab-del-strip" />
                            <div className="ab-del-body">
                                <div className="ab-del-icon">
                                    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <p className="ab-del-title">Remove Address?</p>
                                <p className="ab-del-sub">This address will be permanently removed from your address book.</p>
                                <div className="ab-del-btns">
                                    <button className="ab-del-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                                    <button className="ab-del-confirm" onClick={() => handleDelete(deleteConfirm)}>
                                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
};

export default AddressBook;