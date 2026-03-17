import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFloatingToast } from './FloatingToastProvider'; // ✅ Import করুন
import { Copy } from 'lucide-react';

export default function Banner() {
    const [isOpen, setIsOpen] = useState(true);
    const [bannerSettings, setBannerSettings] = useState({
        enabled: false,
        text: "Get 20% OFF on Your First Order!",
        buttonText: "Claim Offer",
        couponCode: "NEW20",
        useCouponFromList: true,
        gradientFrom: "#8B5CF6",
        gradientVia: "#9938CA",
        gradientTo: "#E0724A",
    });

    const { addToast } = useFloatingToast(); // ✅ Hook use করুন

    // Real-time listener for banner settings
    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, "settings", "banner"),
            (snap) => {
                if (snap.exists()) {
                    setBannerSettings(snap.data());
                }
            },
            (err) => {
                console.error("Failed to fetch banner settings:", err);
            }
        );

        return () => unsub();
    }, []);

    // Don't show if disabled, manually closed, or no coupon code
    if (!bannerSettings.enabled || !isOpen || !bannerSettings.couponCode) {
        return null;
    }

    const handleCouponClick = () => {
        if (!bannerSettings.couponCode) {
            addToast({
                message: "No coupon code available",
                type: "error",
                duration: 3000,
            });
            return;
        }
        
        navigator.clipboard.writeText(bannerSettings.couponCode);
        addToast({
            message: `${bannerSettings.couponCode} copied!`,
            title: "Coupon code copied to clipboard",
            type: "success",
            duration: 3000,
        });
    };

    return (
        <div 
            className="w-full px-6 py-2 font-medium text-sm text-white"
            style={{
                background: `linear-gradient(135deg, ${bannerSettings.gradientFrom}, ${bannerSettings.gradientVia}, ${bannerSettings.gradientTo})`
            }}
        >
            <div className='flex items-center justify-between max-w-7xl mx-auto'>
                <p className="font-medium">{bannerSettings.text}</p>
                
                <div className="flex items-center gap-3">
                    {/* Coupon Code with Copy Icon */}
                    {bannerSettings.couponCode && (
                        <button 
                            onClick={handleCouponClick} 
                            type="button" 
                            className="inline-flex items-center gap-1.5 font-semibold text-gray-900 bg-white px-3 py-1 rounded-md hover:bg-gray-50 transition-colors cursor-pointer text-xs"
                        >
                            <span>{bannerSettings.couponCode}</span>
                            <Copy size={12} className="opacity-70" />
                        </button>
                    )}
                    
                    {/* Close Button */}
                    <button 
                        onClick={() => setIsOpen(false)} 
                        type="button" 
                        className="text-white hover:opacity-80 transition-opacity p-1"
                        aria-label="Close banner"
                    >
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="#fff" />
                            <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="#fff" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}