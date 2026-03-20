import { ArrowRightIcon } from 'lucide-react';
import { assets } from '../assets/assets';
import CategoriesMarquee from './CategoriesMarquee';
import { Link } from 'react-router-dom';

// Standing male model — full body, studio shot
const MALE_IMG = 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=800';

const Hero = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                .h-root {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    padding: 0 24px;
                }

                /* ══ Layout grid ══ */
                .h-grid {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    grid-template-rows: 1fr 1fr;
                    gap: 14px;
                    max-width: 1280px;
                    margin: 28px auto 0;
                }

                /* ══════════════════════════
                   MAIN CARD
                ══════════════════════════ */
                .h-main {
                    grid-column: 1;
                    grid-row: 1 / 3;
                    position: relative;
                    border-radius: 26px;
                    background: #f0fdf4;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    min-height: 480px;
                }

                /* background decoration layers */
                .h-bg-blob1 {
                    position: absolute;
                    width: 500px; height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #bbf7d0 0%, transparent 65%);
                    top: -160px; right: -100px;
                    pointer-events: none;
                }
                .h-bg-blob2 {
                    position: absolute;
                    width: 280px; height: 280px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #86efac 0%, transparent 65%);
                    bottom: 40px; left: -80px;
                    pointer-events: none;
                }
                .h-bg-arc {
                    position: absolute;
                    width: 560px; height: 560px;
                    border-radius: 50%;
                    border: 70px solid rgba(187,247,208,0.4);
                    bottom: -220px; right: -120px;
                    pointer-events: none;
                }
                .h-bg-dots {
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(circle, rgba(22,163,74,0.08) 1.5px, transparent 1.5px);
                    background-size: 28px 28px;
                    pointer-events: none;
                }

                /* content area */
                .h-main-content {
                    position: relative;
                    z-index: 2;
                    padding: 36px 40px 40px;
                    width: 52%;
                    animation: h-fadein 0.7s cubic-bezier(0.4,0,0.2,1) both;
                }
                @keyframes h-fadein {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* headline */
                .h-headline {
                    font-size: clamp(1.8rem, 3vw, 2.85rem);
                    font-weight: 800;
                    line-height: 1.15;
                    letter-spacing: -0.025em;
                    color: #0f172a;
                    max-width: 400px;
                    margin: 0 0 26px;
                }
                .h-accent {
                    color: #16a34a;
                    display: inline-block;
                    position: relative;
                }
                .h-accent::after {
                    content: '';
                    position: absolute;
                    bottom: -3px; left: 0;
                    width: 100%; height: 3px;
                    background: linear-gradient(90deg, #16a34a, #4ade80);
                    border-radius: 3px;
                    transform: scaleX(0);
                    transform-origin: left;
                    animation: h-line 0.55s 0.45s ease forwards;
                }
                @keyframes h-line { to { transform: scaleX(1); } }

                /* price + CTA row */
                .h-bottom {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 14px;
                    flex-wrap: wrap;
                }
                .h-price-label {
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: #64748b;
                    margin-bottom: 2px;
                }
                .h-price-val {
                    font-size: 2.4rem;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    color: #0f172a;
                    line-height: 1;
                }
                .h-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #1e293b;
                    color: #fff;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 13px 26px;
                    border-radius: 12px;
                    border: none;
                    cursor: pointer;
                    letter-spacing: 0.01em;
                    white-space: nowrap;
                    transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
                }
                .h-cta:hover {
                    background: #16a34a;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 22px rgba(22,163,74,0.3);
                }
                .h-cta:active { transform: translateY(0) scale(0.97); }
                .h-cta-arr { transition: transform 0.22s; }
                .h-cta:hover .h-cta-arr { transform: translateX(4px); }

                /* model image */
                .h-model {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    height: 100%;
                    width: 48%;
                    object-fit: cover;
                    object-position: center top;
                    z-index: 1;
                    animation: h-float 6s ease-in-out infinite;
                    -webkit-mask-image:
                        linear-gradient(to right, transparent 0%, black 28%),
                        linear-gradient(to top, transparent 0%, black 8%);
                    -webkit-mask-composite: destination-in;
                    mask-image:
                        linear-gradient(to right, transparent 0%, black 28%),
                        linear-gradient(to top, transparent 0%, black 8%);
                    mask-composite: intersect;
                }
                @keyframes h-float {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-7px); }
                }

                /* ══════════════════════════
                   SIDE CARDS
                ══════════════════════════ */
                .h-card {
                    border-radius: 22px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 22px 18px;
                    gap: 8px;
                    position: relative;
                    cursor: pointer;
                    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1), box-shadow 0.28s;
                    text-decoration: none;
                }
                .h-card:hover { transform: translateY(-3px); }

                .h-card-or {
                    background: #fff7ed;
                    animation: h-fadein 0.7s 0.1s cubic-bezier(0.4,0,0.2,1) both;
                }
                .h-card-or:hover { box-shadow: 0 10px 28px rgba(234,88,12,0.13); }

                .h-card-bl {
                    background: #eff6ff;
                    animation: h-fadein 0.7s 0.2s cubic-bezier(0.4,0,0.2,1) both;
                }
                .h-card-bl:hover { box-shadow: 0 10px 28px rgba(59,130,246,0.13); }

                .h-card-deco {
                    position: absolute;
                    width: 160px; height: 160px;
                    border-radius: 50%;
                    bottom: -55px; right: -35px;
                    pointer-events: none;
                }
                .h-card-or .h-card-deco { background: radial-gradient(circle, rgba(253,186,116,0.4) 0%, transparent 70%); }
                .h-card-bl .h-card-deco { background: radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 70%); }

                .h-card-body { position: relative; z-index: 1; }

                .h-card-label {
                    font-size: 0.67rem;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    margin-bottom: 5px;
                }
                .h-card-or .h-card-label { color: #ea580c; }
                .h-card-bl .h-card-label { color: #2563eb; }

                .h-card-title {
                    font-size: 1.3rem;
                    font-weight: 800;
                    line-height: 1.2;
                    letter-spacing: -0.02em;
                    color: #1e293b;
                    max-width: 120px;
                }
                .h-card-title em {
                    font-style: normal;
                    display: block;
                }
                .h-card-or .h-card-title em { color: #f97316; }
                .h-card-bl .h-card-title em { color: #3b82f6; }

                .h-card-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.79rem;
                    font-weight: 600;
                    margin-top: 10px;
                    transition: gap 0.22s;
                }
                .h-card-or .h-card-link { color: #ea580c; }
                .h-card-bl .h-card-link { color: #2563eb; }
                .h-card:hover .h-card-link { gap: 9px; }

                .h-card-img {
                    width: 95px; height: 95px;
                    object-fit: contain;
                    position: relative; z-index: 1;
                    flex-shrink: 0;
                    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
                    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
                }
                .h-card-or:hover .h-card-img { transform: scale(1.1) rotate(-4deg); }
                .h-card-bl:hover .h-card-img { transform: scale(1.1) rotate(4deg); }

                .h-card-badge {
                    position: absolute;
                    top: 11px; right: 11px;
                    font-size: 0.66rem; font-weight: 700;
                    padding: 3px 9px;
                    border-radius: 100px;
                    z-index: 2;
                }
                .h-card-or .h-card-badge { background: #fed7aa; color: #c2410c; }
                .h-card-bl .h-card-badge { background: #bfdbfe; color: #1d4ed8; }

                /* ══════════════════════════
                   RESPONSIVE
                ══════════════════════════ */

                /* Default: hide tablet/mobile row */
                .h-side-row { display: none; }

                /* ── Large Tablet / Small Desktop (≤1100px) ── */
                @media (max-width: 1100px) {
                    .h-grid {
                        grid-template-columns: 1fr;
                        grid-template-rows: auto;
                    }
                    .h-main {
                        grid-column: 1;
                        grid-row: 1;
                        min-height: 420px;
                    }
                    .h-side-desktop { display: none !important; }
                    .h-side-row {
                        display: grid !important;
                        grid-column: 1;
                        grid-row: 2;
                        grid-template-columns: 1fr 1fr;
                        gap: 14px;
                    }
                }

                /* ── Tablet (≤768px) ── */
                @media (max-width: 768px) {
                    .h-root { padding: 0 18px; }
                    .h-grid { margin: 22px auto 0; gap: 12px; }
                    .h-main { min-height: 380px; border-radius: 22px; }
                    .h-main-content { padding: 26px 28px 30px; width: 54%; }
                    .h-headline { font-size: clamp(1.6rem, 4vw, 2rem); margin-bottom: 20px; }
                    .h-price-val { font-size: 2rem; }
                    .h-cta { padding: 12px 22px; font-size: 0.84rem; }
                    .h-model { width: 50%; }
                    .h-side-row { grid-template-columns: 1fr 1fr !important; gap: 12px; }
                    .h-card { padding: 18px 15px; border-radius: 18px; }
                    .h-card-title { font-size: 1.2rem; }
                    .h-card-img { width: 85px; height: 85px; }
                }

                /* ── Mobile (≤640px) ── */
                @media (max-width: 640px) {
                    .h-root { padding: 0 12px; }
                    .h-grid { margin: 14px auto 0; gap: 10px; }
                    .h-main { min-height: 320px; border-radius: 20px; }
                    .h-main-content { padding: 18px 16px 22px; width: 56%; }
                    .h-headline { font-size: 1.45rem; margin-bottom: 16px; }
                    .h-price-val { font-size: 1.8rem; }
                    .h-cta { padding: 11px 18px; font-size: 0.82rem; }
                    .h-model { width: 46%; }
                    .h-side-row { grid-template-columns: 1fr 1fr !important; gap: 10px; }
                    .h-card { padding: 14px 12px; border-radius: 16px; }
                    .h-card-title { font-size: 1.05rem; max-width: 100px; }
                    .h-card-img { width: 74px; height: 74px; }
                    .h-card-badge { font-size: 0.6rem; padding: 2px 7px; }
                }

                /* ── Small Mobile (≤480px) ── */
                @media (max-width: 480px) {
                    .h-main { min-height: 290px; }
                    .h-main-content { padding: 16px 14px 20px; width: 58%; }
                    .h-headline { font-size: 1.3rem; margin-bottom: 14px; }
                    .h-price-val { font-size: 1.65rem; }
                    .h-cta { padding: 10px 16px; font-size: 0.79rem; border-radius: 10px; }
                    .h-model { width: 46%; }
                    .h-card { padding: 12px 10px; border-radius: 14px; }
                    .h-card-title { font-size: 0.95rem; max-width: 85px; }
                    .h-card-img { width: 64px; height: 64px; }
                    .h-card-label { font-size: 0.6rem; }
                    .h-card-link { font-size: 0.72rem; margin-top: 7px; }
                }

                /* ── XS / Very Small (≤400px) ── */
                @media (max-width: 400px) {
                    .h-root { padding: 0 10px; }
                    .h-grid { margin: 12px auto 0; gap: 9px; }
                    .h-main { min-height: 260px; border-radius: 18px; }
                    .h-main-content {
                        width: 100%;
                        padding: 16px 14px 18px;
                    }
                    .h-model { display: none; }
                    .h-headline { font-size: 1.25rem; margin-bottom: 14px; max-width: 100%; }
                    .h-price-val { font-size: 1.55rem; }
                    .h-cta { padding: 10px 16px; font-size: 0.78rem; }
                    /* Side cards go single column on very small screens */
                    .h-side-row { grid-template-columns: 1fr !important; gap: 9px; }
                    .h-card { padding: 14px 12px; border-radius: 14px; }
                    .h-card-title { font-size: 1.1rem; max-width: none; }
                    .h-card-img { width: 70px; height: 70px; }
                }
            `}</style>

            <div className="h-root">
                <div className="h-grid">

                    {/* ════ MAIN CARD ════ */}
                    <div className="h-main">
                        {/* bg layers */}
                        <div className="h-bg-blob1" />
                        <div className="h-bg-blob2" />
                        <div className="h-bg-arc" />
                        <div className="h-bg-dots" />

                        {/* male model */}
                        <img
                            className="h-model"
                            src={MALE_IMG}
                            alt="Male model"
                        />

                        {/* text */}
                        <div className="h-main-content">
                            <h1 className="h-headline">
                                Gadgets you'll{' '}
                                <span className="h-accent">love.</span>
                                <br />
                                Prices you'll{' '}
                                <span className="h-accent">trust.</span>
                            </h1>

                            <div className="h-bottom">
                                <div>
                                    <p className="h-price-label">Starts from</p>
                                    <p className="h-price-val">{currency}550</p>
                                </div>
                                <Link to="/shop">
                                    <button className="h-cta">
                                        Shop Now
                                        <ArrowRightIcon className="h-cta-arr" size={15} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* ════ SIDE CARDS — Desktop (in grid) ════ */}
                    <Link
                        to="/shop"
                        className="h-card h-card-or h-side-desktop"
                        style={{ gridColumn: 2, gridRow: 1 }}
                    >
                        <span className="h-card-badge">Hot 🔥</span>
                        <div className="h-card-deco" />
                        <div className="h-card-body">
                            <p className="h-card-label">Featured</p>
                            <p className="h-card-title">Best <em>products</em></p>
                            <p className="h-card-link">View more <ArrowRightIcon size={13} /></p>
                        </div>
                        <img className="h-card-img" src={assets.hero_product_img1} alt="Product 1" />
                    </Link>

                    <Link
                        to="/shop"
                        className="h-card h-card-bl h-side-desktop"
                        style={{ gridColumn: 2, gridRow: 2 }}
                    >
                        <span className="h-card-badge">Sale 🏷️</span>
                        <div className="h-card-deco" />
                        <div className="h-card-body">
                            <p className="h-card-label">Limited</p>
                            <p className="h-card-title">Stock<em></em></p>
                            <p className="h-card-link">View more <ArrowRightIcon size={13} /></p>
                        </div>
                        <img className="h-card-img" src={assets.hero_product_img2} alt="Product 2" />
                    </Link>

                    {/* ════ SIDE CARDS — Tablet / Mobile (2-col or 1-col row) ════ */}
                    <div className="h-side-row">
                        <Link to="/shop" className="h-card h-card-or">
                            <span className="h-card-badge">Hot 🔥</span>
                            <div className="h-card-deco" />
                            <div className="h-card-body">
                                <p className="h-card-label">Featured</p>
                                <p className="h-card-title">Best <em>products</em></p>
                                <p className="h-card-link">View more <ArrowRightIcon size={13} /></p>
                            </div>
                            <img className="h-card-img" src={assets.hero_product_img1} alt="Product 1" />
                        </Link>
                        
                        <Link to="/shop" className="h-card h-card-bl">
                            <span className="h-card-badge">Sale 🏷️</span>
                            <div className="h-card-deco" />
                            <div className="h-card-body">
                                <p className="h-card-label">Limited</p>
                                <p className="h-card-title">Stock<em></em></p>
                                <p className="h-card-link">View more <ArrowRightIcon size={13} /></p>
                            </div>
                            <img className="h-card-img" src={assets.hero_product_img2} alt="Product 2" />
                        </Link>
                    </div>

                </div>

                <div style={{ overflow: 'hidden', marginTop: '4px' }}>
                    <CategoriesMarquee />
                </div>
            </div>
        </>
    );
};

export default Hero;