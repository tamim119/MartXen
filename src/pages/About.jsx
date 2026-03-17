import React, { useRef, useEffect, useState } from "react";

const useInView = (threshold = 0.08) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.ab-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #fff;
    min-height: 70vh;
}

/* ── Animations ── */
@keyframes ab-fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
@keyframes ab-lineIn  { from { width:0; opacity:0; } to { width:40px; opacity:1; } }
@keyframes ab-scaleIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

/* ── Hero header ── */
.ab-hero {
    background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%);
    border-bottom: 1.5px solid #f1f5f9;
    padding: 72px 24px 56px;
    text-align: center;
    animation: ab-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
}
.ab-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 16px;
}
.ab-eyebrow-line {
    height: 1.5px; background: #16a34a; border-radius: 2px;
    animation: ab-lineIn 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
.ab-eyebrow-text {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: #16a34a;
}
.ab-hero-title {
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 800; color: #0f172a;
    letter-spacing: -0.03em; line-height: 1.15;
    margin: 0 0 16px;
    animation: ab-fadeUp 0.55s 0.08s cubic-bezier(0.4,0,0.2,1) both;
}
.ab-hero-title span { color: #16a34a; }
.ab-hero-sub {
    font-size: 1rem; color: #64748b; font-weight: 400;
    max-width: 480px; margin: 0 auto;
    line-height: 1.7;
    animation: ab-fadeUp 0.55s 0.14s cubic-bezier(0.4,0,0.2,1) both;
}

/* ── Stats row ── */
.ab-stats {
    display: flex; justify-content: center; gap: 0;
    border-top: 1.5px solid #f1f5f9;
    border-bottom: 1.5px solid #f1f5f9;
    background: #fff;
    animation: ab-fadeUp 0.5s 0.18s cubic-bezier(0.4,0,0.2,1) both;
}
.ab-stat {
    flex: 1; max-width: 180px;
    text-align: center; padding: 28px 20px;
    border-right: 1.5px solid #f1f5f9;
    transition: background 0.2s;
}
.ab-stat:last-child { border-right: none; }
.ab-stat:hover { background: #f8fafc; }
.ab-stat-num {
    font-size: 1.6rem; font-weight: 800;
    color: #0f172a; letter-spacing: -0.04em;
    line-height: 1; margin-bottom: 5px;
}
.ab-stat-num span { color: #16a34a; }
.ab-stat-label {
    font-size: 0.72rem; font-weight: 600;
    color: #94a3b8; text-transform: uppercase;
    letter-spacing: 0.08em;
}

/* ── Story section ── */
.ab-story-section {
    max-width: 1000px; margin: 0 auto;
    padding: 72px 40px 64px;
    opacity: 0;
    transition: opacity 0.01s;
}
.ab-story-section.visible {
    opacity: 1;
}
.ab-story-section.visible .ab-section-eyebrow { animation: ab-fadeUp 0.45s 0.02s cubic-bezier(0.4,0,0.2,1) both; }
.ab-story-section.visible .ab-story-heading   { animation: ab-fadeUp 0.48s 0.08s cubic-bezier(0.4,0,0.2,1) both; }
.ab-story-section.visible .ab-story-grid      { animation: ab-fadeUp 0.45s 0.15s cubic-bezier(0.4,0,0.2,1) both; }
.ab-story-section.visible .ab-mission-box     { animation: ab-fadeUp 0.45s 0.22s cubic-bezier(0.4,0,0.2,1) both; }

.ab-section-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.15em;
    color: #16a34a; margin-bottom: 14px;
}
.ab-section-eyebrow::after {
    content: ''; width: 28px; height: 1.5px;
    background: #16a34a; border-radius: 2px;
    display: inline-block;
}

.ab-story-heading {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 800; color: #0f172a;
    letter-spacing: -0.02em; line-height: 1.25;
    margin: 0 0 36px;
}
.ab-story-heading span { color: #16a34a; }

.ab-story-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 32px; margin-bottom: 36px;
}
.ab-story-para {
    font-size: 0.9rem; font-weight: 400;
    color: #64748b; line-height: 1.85;
    padding-top: 16px;
    border-top: 1.5px solid #f1f5f9;
    margin: 0;
}

/* ── Mission box ── */
.ab-mission-box {
    display: flex; align-items: stretch; gap: 0;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 20px; overflow: hidden;
}
.ab-mission-side {
    background: #16a34a; padding: 28px 18px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.ab-mission-label {
    font-size: 0.65rem; font-weight: 800;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: #fff; writing-mode: vertical-rl;
    transform: rotate(180deg);
}
.ab-mission-body { padding: 28px 28px; flex: 1; }
.ab-mission-title {
    font-size: 0.78rem; font-weight: 700;
    color: #15803d; text-transform: uppercase;
    letter-spacing: 0.1em; margin: 0 0 10px;
}
.ab-mission-text {
    font-size: 0.95rem; font-weight: 400;
    color: #166534; line-height: 1.8;
    font-style: italic; margin: 0;
}

/* ── Why section ── */
.ab-why-section {
    max-width: 1000px; margin: 0 auto;
    padding: 0 40px 80px;
    opacity: 0;
    transition: opacity 0.01s;
}
.ab-why-section.visible { opacity: 1; }
.ab-why-section.visible .ab-why-head     { animation: ab-fadeUp 0.45s 0.04s cubic-bezier(0.4,0,0.2,1) both; }
.ab-why-section.visible .ab-why-card:nth-child(1) { animation: ab-fadeUp 0.44s 0.10s cubic-bezier(0.4,0,0.2,1) both; }
.ab-why-section.visible .ab-why-card:nth-child(2) { animation: ab-fadeUp 0.44s 0.18s cubic-bezier(0.4,0,0.2,1) both; }
.ab-why-section.visible .ab-why-card:nth-child(3) { animation: ab-fadeUp 0.44s 0.26s cubic-bezier(0.4,0,0.2,1) both; }

.ab-why-head {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-bottom: 24px; padding-bottom: 20px;
    border-bottom: 1.5px solid #f1f5f9;
}
.ab-why-title {
    font-size: clamp(1.25rem, 2.5vw, 1.8rem);
    font-weight: 800; color: #0f172a;
    letter-spacing: -0.02em; margin: 0;
}
.ab-why-title span { color: #16a34a; }
.ab-why-count {
    font-size: 0.72rem; font-weight: 700;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    color: #16a34a; padding: 4px 12px; border-radius: 100px;
}

.ab-why-cards {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}
.ab-why-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    padding: 28px 24px;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1),
                border-color 0.25s, box-shadow 0.25s;
}
.ab-why-card:hover {
    transform: translateY(-4px);
    border-color: #bbf7d0;
    box-shadow: 0 16px 40px rgba(22,163,74,0.1);
}
.ab-why-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    color: #475569; margin-bottom: 18px;
    transition: background 0.22s, border-color 0.22s, color 0.22s;
}
.ab-why-card:hover .ab-why-icon {
    background: #f0fdf4; border-color: #bbf7d0; color: #16a34a;
}
.ab-why-card-title {
    font-size: 0.9rem; font-weight: 700;
    color: #0f172a; margin: 0 0 8px;
    letter-spacing: -0.01em;
}
.ab-why-card-text {
    font-size: 0.82rem; font-weight: 400;
    color: #64748b; line-height: 1.75; margin: 0;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
    .ab-story-section, .ab-why-section { padding: 56px 32px 56px; }
    .ab-stats { flex-wrap: wrap; }
}

@media (max-width: 768px) {
    .ab-hero { padding: 56px 20px 44px; }
    .ab-story-section, .ab-why-section { padding: 48px 24px 48px; }
    .ab-story-grid { grid-template-columns: 1fr; gap: 20px; }
    .ab-why-cards  { grid-template-columns: 1fr; }
    .ab-stats      { flex-wrap: wrap; flex-direction: row; }
    .ab-stat       { min-width: 120px; padding: 20px 16px; border-right: none; border-bottom: 1.5px solid #f1f5f9; flex: 1; }
    .ab-stat:nth-child(odd) { border-right: 1.5px solid #f1f5f9; }
    .ab-stat:nth-child(3), .ab-stat:nth-child(4) { border-bottom: none; }
    .ab-mission-box { flex-direction: column; }
    .ab-mission-side { padding: 14px 20px; writing-mode: horizontal-tb; }
    .ab-mission-label { writing-mode: horizontal-tb; transform: none; text-align: center; }
    .ab-hero-title { font-size: clamp(1.5rem, 3.5vw, 2.4rem); }
    .ab-hero-sub { font-size: 0.95rem; }
    .ab-story-heading { font-size: clamp(1.2rem, 2.8vw, 1.8rem); }
    .ab-why-title { font-size: clamp(1rem, 2.2vw, 1.4rem); }
}

@media (max-width: 600px) {
    .ab-stats { border-top: none; border-bottom: none; gap: 0; }
    .ab-stat { padding: 18px 12px; border: 1.5px solid #f1f5f9; border-right: none; border-bottom: none; }
    .ab-stat:nth-child(1), .ab-stat:nth-child(2) { border-bottom: 1.5px solid #f1f5f9; }
    .ab-stat:nth-child(2), .ab-stat:nth-child(4) { border-right: 1.5px solid #f1f5f9; }
    .ab-stat:nth-child(3), .ab-stat:nth-child(4) { border-bottom: none; }
    .ab-stat-num { font-size: 1.4rem; }
    .ab-stat-label { font-size: 0.65rem; }
}

@media (max-width: 480px) {
    .ab-hero { padding: 40px 16px 32px; }
    .ab-story-section, .ab-why-section { padding: 32px 16px 40px; }
    .ab-hero-title { font-size: clamp(1.2rem, 3vw, 1.8rem); }
    .ab-hero-sub { font-size: 0.9rem; max-width: 100%; }
    .ab-eyebrow-line { width: 25px; }
    .ab-stats { border-top: 1.5px solid #f1f5f9; border-bottom: 1.5px solid #f1f5f9; }
    .ab-stat { padding: 16px 10px; border: 1.5px solid #f1f5f9; border-right: none; border-bottom: none; }
    .ab-stat:nth-child(1), .ab-stat:nth-child(2) { border-bottom: 1.5px solid #f1f5f9; }
    .ab-stat:nth-child(2), .ab-stat:nth-child(4) { border-right: 1.5px solid #f1f5f9; }
    .ab-stat:nth-child(3), .ab-stat:nth-child(4) { border-bottom: none; }
    .ab-stat-num { font-size: 1.3rem; margin-bottom: 3px; }
    .ab-stat-label { font-size: 0.6rem; }
    .ab-story-heading { font-size: clamp(1.1rem, 2.5vw, 1.4rem); }
    .ab-story-grid { gap: 12px; margin-bottom: 24px; }
    .ab-story-para { font-size: 0.85rem; padding-top: 12px; }
    .ab-mission-box { border-radius: 16px; }
    .ab-mission-side { padding: 12px 16px; }
    .ab-mission-body { padding: 20px; }
    .ab-mission-title { font-size: 0.7rem; margin-bottom: 8px; }
    .ab-mission-text { font-size: 0.85rem; }
    .ab-why-head { gap: 8px; margin-bottom: 20px; padding-bottom: 16px; }
    .ab-why-title { font-size: clamp(1rem, 2.2vw, 1.2rem); }
    .ab-why-count { font-size: 0.65rem; padding: 3px 10px; }
    .ab-why-cards { grid-template-columns: 1fr 1fr; gap: 10px; }
    .ab-why-card { padding: 20px 16px; }
    .ab-why-icon { width: 40px; height: 40px; margin-bottom: 12px; }
    .ab-why-card-title { font-size: 0.8rem; }
    .ab-why-card-text { font-size: 0.75rem; }
}
`;

const About = () => {
    const [storyRef, storyVisible] = useInView(0.08);
    const [whyRef,   whyVisible]   = useInView(0.08);

    return (
        <>
            <style>{CSS}</style>
            <div className="ab-root">

                {/* ── Hero ── */}
                <div className="ab-hero">
                    <div className="ab-eyebrow">
                        <div className="ab-eyebrow-line" style={{ width: 40 }} />
                        <span className="ab-eyebrow-text">Our Story</span>
                        <div className="ab-eyebrow-line" style={{ width: 40 }} />
                    </div>
                    <h1 className="ab-hero-title">
                        About <span>DynamicxMart</span>
                    </h1>
                    <p className="ab-hero-sub">
                        Born from a passion for innovation — delivering smarter, faster, and more joyful shopping experiences.
                    </p>
                </div>

                {/* ── Stats ── */}
                <div className="ab-stats">
                    <div className="ab-stat">
                        <div className="ab-stat-num">0<span>+</span></div>
                        <div className="ab-stat-label">Happy Customers</div>
                    </div>
                    <div className="ab-stat">
                        <div className="ab-stat-num">0<span>+</span></div>
                        <div className="ab-stat-label">Products</div>
                    </div>
                    <div className="ab-stat">
                        <div className="ab-stat-num">0<span>+</span></div>
                        <div className="ab-stat-label">Brands</div>
                    </div>
                    <div className="ab-stat">
                        <div className="ab-stat-num">24<span>/7</span></div>
                        <div className="ab-stat-label">Support</div>
                    </div>
                </div>

                {/* ── Story ── */}
                <div
                    ref={storyRef}
                    className={`ab-story-section${storyVisible ? " visible" : ""}`}
                >
                    <div className="ab-section-eyebrow">Who We Are</div>
                    <h2 className="ab-story-heading">
                        Born from a passion for <span>Innovation</span>
                    </h2>
                    <div className="ab-story-grid">
                        <p className="ab-story-para">
                            DynamicxMart was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea — to provide a platform where customers can easily discover, explore, and purchase a wide range of products.
                        </p>
                        <p className="ab-story-para">
                            Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference — from gadgets and electronics to accessories and clothing.
                        </p>
                    </div>

                    <div className="ab-mission-box">
                        <div className="ab-mission-side">
                            <span className="ab-mission-label">Our Mission</span>
                        </div>
                        <div className="ab-mission-body">
                            <p className="ab-mission-title">What drives us</p>
                            <p className="ab-mission-text">
                                To empower customers with choice, convenience, and confidence — delivering a seamless shopping experience that truly exceeds expectations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Why Us ── */}
                <div
                    ref={whyRef}
                    className={`ab-why-section${whyVisible ? " visible" : ""}`}
                >
                    <div className="ab-why-head">
                        <h2 className="ab-why-title">Why Choose <span>Us</span></h2>
                        <span className="ab-why-count">3 reasons</span>
                    </div>
                    <div className="ab-why-cards">
                        <div className="ab-why-card">
                            <div className="ab-why-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            </div>
                            <p className="ab-why-card-title">Quality Assurance</p>
                            <p className="ab-why-card-text">Every product is carefully vetted to meet our strict quality standards.</p>
                        </div>

                        <div className="ab-why-card">
                            <div className="ab-why-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                </svg>
                            </div>
                            <p className="ab-why-card-title">Convenience</p>
                            <p className="ab-why-card-text">Hassle-free ordering with a user-friendly interface you'll love.</p>
                        </div>

                        <div className="ab-why-card">
                            <div className="ab-why-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                            </div>
                            <p className="ab-why-card-title">Exceptional Support</p>
                            <p className="ab-why-card-text">Our team is available around the clock to assist with anything you need.</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default About;