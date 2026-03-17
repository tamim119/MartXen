import { XIcon, UserIcon, MailIcon, MapPinIcon, BuildingIcon, HashIcon, PhoneIcon, GlobeIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "../hooks/useAuth";
import { addAddress } from "../lib/features/address/addressSlice";

const PAYMENT_ICONS = {
    bkash:  { color: "#E2136E", bg: "#FDF0F6", label: "bKash" },
    nagad:  { color: "#F4821F", bg: "#FEF5EC", label: "Nagad" },
    rocket: { color: "#8B1FA9", bg: "#F8F0FC", label: "Rocket" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.am-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15,23,42,0.45);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: am-fadeIn 0.22s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes am-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
.am-card {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 24px;
    padding: 28px 24px;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,0.15);
    animation: am-slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    position: relative;
}
@keyframes am-slideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
.am-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
}
.am-title { font-size: 1.1rem; font-weight: 500; color: #64748b; margin: 0; }
.am-title span { color: #0f172a; font-weight: 800; }
.am-close {
    width: 32px; height: 32px; border-radius: 50%;
    background: #f8fafc; border: 1.5px solid #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #94a3b8; transition: all 0.18s;
}
.am-close:hover { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

/* ── Section divider ── */
.am-section {
    font-size: 0.68rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin: 18px 0 10px; display: flex; align-items: center; gap: 8px;
}
.am-section::after {
    content: ''; flex: 1; height: 1px; background: #f1f5f9;
}

.am-fields { display: flex; flex-direction: column; gap: 10px; }
.am-field { position: relative; display: flex; align-items: center; }
.am-field-icon {
    position: absolute; left: 12px; color: #cbd5e1;
    pointer-events: none; flex-shrink: 0; transition: color 0.18s;
}
.am-field:focus-within .am-field-icon { color: #16a34a; }
.am-input {
    width: 100%; padding: 11px 14px 11px 36px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.855rem; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; color: #0f172a; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-weight: 500; box-sizing: border-box;
}
.am-input::placeholder { color: #cbd5e1; font-weight: 400; }
.am-input:focus {
    border-color: #16a34a; background: #fff;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
}
.am-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* ── Payment number fields ── */
.am-pay-grid {
    display: flex; flex-direction: column; gap: 10px;
}
.am-pay-field {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    background: #f8fafc;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.am-pay-field:focus-within {
    border-color: var(--pay-color);
    background: var(--pay-bg);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--pay-color) 12%, transparent);
}
.am-pay-badge {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 9px;
    font-size: 0.7rem; font-weight: 800;
    flex-shrink: 0;
    color: var(--pay-color);
    background: var(--pay-bg);
    border: 1.5px solid color-mix(in srgb, var(--pay-color) 25%, transparent);
    letter-spacing: -0.3px;
}
.am-pay-input {
    flex: 1; border: none; outline: none; background: transparent;
    font-size: 0.855rem; font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500; color: #0f172a;
}
.am-pay-input::placeholder { color: #cbd5e1; font-weight: 400; }
.am-pay-label {
    font-size: 0.68rem; font-weight: 700;
    color: var(--pay-color); white-space: nowrap;
}
.am-pay-optional {
    font-size: 0.62rem; color: #cbd5e1; font-weight: 400;
    margin-left: 2px; white-space: nowrap;
}

/* ── Submit ── */
.am-submit {
    width: 100%; padding: 13px;
    background: #16a34a; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 100px; cursor: pointer;
    margin-top: 6px; transition: all 0.22s;
    box-shadow: 0 4px 16px rgba(22,163,74,0.3);
}
.am-submit:hover {
    background: #15803d; transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(22,163,74,0.38);
}
.am-submit:active { transform: scale(0.98); }

@media (max-width: 480px) {
    .am-card { padding: 22px 16px; border-radius: 18px; }
    .am-row  { grid-template-columns: 1fr; }
}
`;

const AddressModal = ({ setShowAddressModal }) => {
    const dispatch = useDispatch();
    const { user } = useCurrentUser();

    const [address, setAddress] = useState({
        name: '', email: '', street: '',
        city: '', state: '', zip: '',
        country: '', phone: '',
        bkash: '', nagad: '', rocket: '',
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) throw new Error("Please login first!");

        // payment fields optional — empty হলে save করব না
        const payload = {
            name:    address.name,
            email:   address.email,
            street:  address.street,
            city:    address.city,
            state:   address.state,
            zip:     address.zip,
            country: address.country,
            phone:   address.phone,
            ...(address.bkash.trim()  && { bkash:  address.bkash.trim()  }),
            ...(address.nagad.trim()  && { nagad:  address.nagad.trim()  }),
            ...(address.rocket.trim() && { rocket: address.rocket.trim() }),
        };

        const result = await dispatch(addAddress({ userId: user.uid, address: payload }));
        if (addAddress.rejected.match(result)) throw new Error(result.payload || "Failed to save address");
        setShowAddressModal(false);
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="am-overlay" onClick={() => setShowAddressModal(false)}>
                <div className="am-card" onClick={e => e.stopPropagation()}>

                    <div className="am-header">
                        <p className="am-title">Add New <span>Address</span></p>
                        <button className="am-close" onClick={() => setShowAddressModal(false)}>
                            <XIcon size={14} />
                        </button>
                    </div>

                    <div className="am-fields">

                        {/* ── Personal Info ── */}
                        <p className="am-section">Personal Info</p>

                        <div className="am-field">
                            <UserIcon size={14} className="am-field-icon" />
                            <input className="am-input" name="name"
                                onChange={handleChange} value={address.name}
                                type="text" placeholder="Full name" required />
                        </div>
                        <div className="am-field">
                            <MailIcon size={14} className="am-field-icon" />
                            <input className="am-input" name="email"
                                onChange={handleChange} value={address.email}
                                type="email" placeholder="Email address" required />
                        </div>
                        <div className="am-field">
                            <PhoneIcon size={14} className="am-field-icon" />
                            <input className="am-input" name="phone"
                                onChange={handleChange} value={address.phone}
                                type="text" placeholder="Phone number" required />
                        </div>

                        {/* ── Address ── */}
                        <p className="am-section">Delivery Address</p>

                        <div className="am-field">
                            <MapPinIcon size={14} className="am-field-icon" />
                            <input className="am-input" name="street"
                                onChange={handleChange} value={address.street}
                                type="text" placeholder="Street address" required />
                        </div>

                        <div className="am-row">
                            <div className="am-field">
                                <BuildingIcon size={14} className="am-field-icon" />
                                <input className="am-input" name="city"
                                    onChange={handleChange} value={address.city}
                                    type="text" placeholder="City" required />
                            </div>
                            <div className="am-field">
                                <MapPinIcon size={14} className="am-field-icon" />
                                <input className="am-input" name="state"
                                    onChange={handleChange} value={address.state}
                                    type="text" placeholder="State" required />
                            </div>
                        </div>

                        <div className="am-row">
                            <div className="am-field">
                                <HashIcon size={14} className="am-field-icon" />
                                <input className="am-input" name="zip"
                                    onChange={handleChange} value={address.zip}
                                    type="text" placeholder="Zip code" required />
                            </div>
                            <div className="am-field">
                                <GlobeIcon size={14} className="am-field-icon" />
                                <input className="am-input" name="country"
                                    onChange={handleChange} value={address.country}
                                    type="text" placeholder="Country" required />
                            </div>
                        </div>

                        {/* ── Mobile Payment Numbers ── */}
                        <p className="am-section">
                            Payment Numbers
                            <span style={{ fontSize: '0.62rem', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#cbd5e1', marginLeft: 4 }}>
                                optional
                            </span>
                        </p>

                        <div className="am-pay-grid">
                            {Object.entries(PAYMENT_ICONS).map(([key, { color, bg, label }]) => (
                                <div
                                    key={key}
                                    className="am-pay-field"
                                    style={{ '--pay-color': color, '--pay-bg': bg }}
                                >
                                    <div className="am-pay-badge">{label.slice(0, 2)}</div>
                                    <input
                                        className="am-pay-input"
                                        name={key}
                                        type="tel"
                                        placeholder={`${label} number`}
                                        value={address[key]}
                                        onChange={handleChange}
                                        maxLength={14}
                                    />
                                    <span className="am-pay-label">
                                        {label}
                                        <span className="am-pay-optional"> · optional</span>
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            className="am-submit"
                            onClick={e => toast.promise(
                                handleSubmit(e),
                                {
                                    loading: "Saving address...",
                                    success: "Address saved!",
                                    error: e => e.message
                                }
                            )}
                        >
                            Save Address
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddressModal;