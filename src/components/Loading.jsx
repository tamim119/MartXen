import { useEffect, useState } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ld-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    position: fixed;
    inset: 0;
    z-index: 9999;
    animation: ld-in 0.3s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes ld-in {
    from { opacity: 0; }
    to   { opacity: 1; }
}

.ld-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
}

/* ── Logo ── */
.ld-logo {
    font-size: 1.6rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
    animation: ld-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes ld-fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}
.ld-logo-accent { color: #16a34a; }
.ld-logo-dot    { color: #16a34a; font-size: 2rem; line-height: 0; margin-top: 6px; }

/* ── Spinner ring ── */
.ld-spinner-wrap {
    position: relative;
    width: 56px;
    height: 56px;
    animation: ld-fadeUp 0.5s 0.18s cubic-bezier(0.4,0,0.2,1) both;
}
.ld-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2.5px solid transparent;
}
.ld-ring-track {
    border-color: #f1f5f9;
}
.ld-ring-spin {
    border-top-color: #16a34a;
    border-right-color: #16a34a;
    animation: ld-spin 0.85s cubic-bezier(0.4,0,0.6,1) infinite;
}
@keyframes ld-spin {
    to { transform: rotate(360deg); }
}
.ld-ring-inner {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: rgba(22,163,74,0.25);
    animation: ld-spin 1.4s cubic-bezier(0.4,0,0.6,1) infinite reverse;
}
.ld-ring-dot {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #16a34a;
    box-shadow: 0 0 10px rgba(22,163,74,0.5);
    animation: ld-pulse 1.2s ease-in-out infinite;
}
@keyframes ld-pulse {
    0%,100% { transform: translate(-50%,-50%) scale(1);   opacity: 1; }
    50%      { transform: translate(-50%,-50%) scale(1.3); opacity: 0.7; }
}

/* ── Dots ── */
.ld-dots {
    display: flex;
    gap: 6px;
    animation: ld-fadeUp 0.5s 0.26s cubic-bezier(0.4,0,0.2,1) both;
}
.ld-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #cbd5e1;
    animation: ld-dotBounce 1.2s ease-in-out infinite;
}
.ld-dot:nth-child(1) { animation-delay: 0s; }
.ld-dot:nth-child(2) { animation-delay: 0.18s; }
.ld-dot:nth-child(3) { animation-delay: 0.36s; }
@keyframes ld-dotBounce {
    0%,80%,100% { transform: scale(1);   background: #cbd5e1; }
    40%         { transform: scale(1.5); background: #16a34a; }
}
`;

export default function Loading() {
    return (
        <>
            <style>{CSS}</style>
            <div className="ld-root">
                <div className="ld-inner">

                    {/* Logo */}
                    <div className="ld-logo">
                        <span className="ld-logo-accent">Dynamicx</span>Mart<span className="ld-logo-dot">.</span>
                    </div>

                    {/* Spinner */}
                    <div className="ld-spinner-wrap">
                        <div className="ld-ring ld-ring-track" />
                        <div className="ld-ring ld-ring-spin" />
                        <div className="ld-ring-inner" />
                        <div className="ld-ring-dot" />
                    </div>

                    {/* Bouncing dots */}
                    <div className="ld-dots">
                        <span className="ld-dot" />
                        <span className="ld-dot" />
                        <span className="ld-dot" />
                    </div>

                </div>
            </div>
        </>
    );
}