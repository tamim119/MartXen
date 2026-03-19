// components/PlusBanner.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkSubscriptionExpiry, formatExpiryMessage } from "../utils/plusMemberChecker";
import { useCurrentUser } from "../hooks/useAuth";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.sub-banner-wrapper { position: sticky; top: 0; z-index: 999; font-family: 'Plus Jakarta Sans', sans-serif; }

.sub-banner {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 20px; border-bottom: 1.5px solid;
    animation: sub-slideDown 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes sub-slideDown { from { opacity: 0; transform: translateY(-100%); } to { opacity: 1; transform: translateY(0); } }

.sub-banner.warning { background: #fffbeb; border-color: #fde68a; color: #92400e; }
.sub-banner.danger  { background: #fff1f2; border-color: #fecdd3; color: #9f1239; }

.sub-banner-icon {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 0.7rem; font-weight: 800;
}
.sub-banner.warning .sub-banner-icon { background: #fef3c7; border: 1.5px solid #fde68a; color: #d97706; }
.sub-banner.danger  .sub-banner-icon { background: #ffe4e6; border: 1.5px solid #fecdd3; color: #dc2626; }

.sub-banner-content { flex: 1; }
.sub-banner-title { font-size: 0.8rem; font-weight: 700; margin-bottom: 2px; }
.sub-banner-msg   { font-size: 0.72rem; opacity: 0.88; font-weight: 500; }

.sub-banner-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 100px;
    font-size: 0.72rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; transition: all 0.2s;
    border: 1.5px solid; text-decoration: none;
}
.sub-banner.warning .sub-banner-btn {
    background: #fef3c7; border-color: #fcd34d; color: #92400e;
}
.sub-banner.warning .sub-banner-btn:hover {
    background: #fde68a; transform: translateY(-1px);
}
.sub-banner.danger .sub-banner-btn {
    background: #dc2626; border-color: #dc2626; color: #fff;
}
.sub-banner.danger .sub-banner-btn:hover {
    background: #b91c1c; transform: translateY(-1px);
}

.sub-banner-close {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    background: transparent; border: 1.5px solid transparent;
    cursor: pointer; transition: all 0.2s;
    font-size: 0.85rem; opacity: 0.5;
}
.sub-banner-close:hover { opacity: 1; background: rgba(0,0,0,0.05); }
`;

export default function PlusBanner() {
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [expiry, setExpiry] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (!user || user.role !== "plus") return;

        const checkExpiry = async () => {
            const result = await checkSubscriptionExpiry(user.uid);
            setExpiry(result);

            // যদি expire হয়ে গেছে বা 7 দিনের কম বাকি আছে, banner দেখাও
            if (result.expired || (result.daysLeft !== null && result.daysLeft <= 7)) {
                setShow(true);
            }
        };

        checkExpiry();

        // প্রতি ঘণ্টায় check করো
        const interval = setInterval(checkExpiry, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    if (!show || dismissed || !expiry) return null;

    const isExpired = expiry.expired;
    const daysLeft = expiry.daysLeft;

    return (
        <>
            <style>{CSS}</style>
            <div className="sub-banner-wrapper">
                <div className={`sub-banner ${isExpired ? 'danger' : 'warning'}`}>
                    <div className="sub-banner-icon">
                        {isExpired ? '⚠' : '⏰'}
                    </div>
                    <div className="sub-banner-content">
                        <div className="sub-banner-title">
                            {isExpired 
                                ? 'Your Plus subscription has expired' 
                                : `Your Plus subscription ${daysLeft === 1 ? 'expires tomorrow' : `expires in ${daysLeft} days`}`
                            }
                        </div>
                        <div className="sub-banner-msg">
                            {isExpired
                                ? 'Renew now to continue enjoying Plus benefits and keep your store active.'
                                : 'Renew your subscription to continue enjoying unlimited features.'
                            }
                        </div>
                    </div>
                    <button 
                        className="sub-banner-btn"
                        onClick={() => navigate('/pricing')}
                    >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M3 3h18l-2 13H5L3 3z"/>
                            <path d="M9 21a1 1 0 100-2 1 1 0 000 2zM17 21a1 1 0 100-2 1 1 0 000 2z"/>
                        </svg>
                        Renew Now
                    </button>
                    <button 
                        className="sub-banner-close"
                        onClick={() => setDismissed(true)}
                        type="button"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </>
    );
}