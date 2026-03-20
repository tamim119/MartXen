// Banner.js
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Copy, Check, Tag, X } from 'lucide-react';

const CSS = `
  @keyframes bn-slide {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes bn-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes bn-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.55; transform: scale(0.8); }
  }
  .bn-root {
    animation: bn-slide 0.38s cubic-bezier(0.34, 1.3, 0.64, 1) both;
  }
  .bn-pill {
    position: relative;
    overflow: hidden;
  }
  .bn-pill::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 35%,
      rgba(255,255,255,0.4) 50%,
      transparent 65%
    );
    background-size: 200% 100%;
    animation: bn-shimmer 2.6s ease-in-out infinite;
    pointer-events: none;
    border-radius: inherit;
  }
  .bn-dot {
    animation: bn-pulse 2s ease-in-out infinite;
  }
`;

export default function Banner() {
    const [isOpen,   setIsOpen]   = useState(true);
    const [copied,   setCopied]   = useState(false);
    const [settings, setSettings] = useState({
        enabled:      false,
        text:         "Get 20% OFF on Your First Order!",
        couponCode:   "",
        gradientFrom: "#8B5CF6",
        gradientVia:  "#9938CA",
        gradientTo:   "#E0724A",
    });

    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, "settings", "banner"),
            (snap) => { if (snap.exists()) setSettings(snap.data()); },
            (err)  => { console.error("Banner settings error:", err); }
        );
        return () => unsub();
    }, []);

    // ✅ Fix: শুধু enabled আর isOpen check করো, couponCode check বাদ
    if (!settings.enabled || !isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(settings.couponCode)
            .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); })
            .catch(() => {});
    };

    const bg = `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientVia ?? settings.gradientFrom}, ${settings.gradientTo})`;

    return (
        <>
            <style>{CSS}</style>
            <div className="bn-root w-full" style={{ background: bg }}>
                <div
                    className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3"
                    style={{ minHeight: 38 }}
                >
                    {/* Left — pulse dot + promo text */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="bn-dot flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white" />
                        <p
                            className="text-white text-xs sm:text-sm font-semibold truncate"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.01em' }}
                        >
                            {settings.text}
                        </p>
                    </div>

                    {/* Right — coupon (conditional) + close */}
                    <div className="flex items-center gap-2 flex-shrink-0">

                        {/* ✅ Fix: couponCode থাকলেই শুধু pill দেখাবে */}
                        {settings.couponCode && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="bn-pill flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1 hover:bg-white/25 active:scale-95 transition-all duration-150"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    <Tag size={10} className="text-white/75 flex-shrink-0" />
                                    <span className="text-white text-xs font-bold tracking-widest uppercase">
                                        {settings.couponCode}
                                    </span>
                                    <span className="w-px h-3 bg-white/30 mx-0.5 flex-shrink-0" />
                                    <span className="flex items-center transition-all duration-200">
                                        {copied
                                            ? <Check size={11} className="text-white" />
                                            : <Copy  size={11} className="text-white/70" />
                                        }
                                    </span>
                                </button>

                                {/* "Copied!" label — desktop only */}
                                <span
                                    className={`text-white/80 text-xs font-medium hidden sm:block transition-all duration-200 ${copied ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minWidth: 44 }}
                                >
                                    Copied!
                                </span>
                            </>
                        )}

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 transition-colors"
                            aria-label="Close banner"
                        >
                            <X size={11} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}