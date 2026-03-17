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

const CSS = [
    "@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');",
    ".ct-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; min-height: 70vh; }",
    "@keyframes ct-fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }",
    "@keyframes ct-lineIn { from { width:0; opacity:0; } to { width:40px; opacity:1; } }",

    ".ct-hero { background: linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%); border-bottom: 1.5px solid #f1f5f9; padding: 72px 24px 56px; text-align: center; animation: ct-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both; }",
    ".ct-eyebrow { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }",
    ".ct-eyebrow-line { width: 40px; height: 1.5px; background: #16a34a; border-radius: 2px; animation: ct-lineIn 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both; }",
    ".ct-eyebrow-text { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #16a34a; }",
    ".ct-hero-title { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #0f172a; letter-spacing: -0.03em; line-height: 1.15; margin: 0 0 16px; animation: ct-fadeUp 0.55s 0.08s cubic-bezier(0.4,0,0.2,1) both; }",
    ".ct-hero-title span { color: #16a34a; }",
    ".ct-hero-sub { font-size: 1rem; color: #64748b; font-weight: 400; max-width: 480px; margin: 0 auto; line-height: 1.7; animation: ct-fadeUp 0.55s 0.14s cubic-bezier(0.4,0,0.2,1) both; }",

    ".ct-body { max-width: 1000px; margin: 0 auto; padding: 64px 40px 80px; }",

    ".ct-intro { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; padding-bottom: 48px; border-bottom: 1.5px solid #f1f5f9; margin-bottom: 48px; opacity: 0; }",
    ".ct-intro.visible { animation: ct-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both; opacity: 1; }",
    ".ct-intro-heading { font-size: clamp(1.4rem, 2.8vw, 2rem); font-weight: 800; color: #0f172a; letter-spacing: -0.02em; line-height: 1.3; margin: 0; }",
    ".ct-intro-heading span { color: #16a34a; }",
    ".ct-intro-sub { font-size: 0.9rem; font-weight: 400; color: #64748b; line-height: 1.85; padding-top: 16px; border-top: 1.5px solid #f1f5f9; margin: 0; }",

    ".ct-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; opacity: 0; }",
    ".ct-cards.visible { opacity: 1; }",
    ".ct-cards.visible .ct-card:nth-child(1) { animation: ct-fadeUp 0.44s 0.06s cubic-bezier(0.4,0,0.2,1) both; }",
    ".ct-cards.visible .ct-card:nth-child(2) { animation: ct-fadeUp 0.44s 0.14s cubic-bezier(0.4,0,0.2,1) both; }",
    ".ct-cards.visible .ct-card:nth-child(3) { animation: ct-fadeUp 0.44s 0.22s cubic-bezier(0.4,0,0.2,1) both; }",

    ".ct-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 24px 22px; transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), border-color 0.25s, box-shadow 0.25s; }",
    ".ct-card:hover { transform: translateY(-4px); border-color: #bbf7d0; box-shadow: 0 16px 40px rgba(22,163,74,0.1); }",
    ".ct-card-icon { width: 46px; height: 46px; border-radius: 14px; background: #f8fafc; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #475569; margin-bottom: 16px; transition: background 0.22s, border-color 0.22s, color 0.22s; }",
    ".ct-card:hover .ct-card-icon { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }",
    ".ct-card-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #16a34a; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }",
    ".ct-card-label::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; border-radius: 2px; }",
    ".ct-card-text { font-size: 0.82rem; color: #64748b; line-height: 1.75; font-weight: 400; margin: 0; }",
    ".ct-card-link { display: block; font-size: 0.82rem; font-weight: 600; color: #16a34a; text-decoration: none; margin-bottom: 5px; }",
    ".ct-card-link:hover { text-decoration: underline; }",

    ".ct-banner { display: flex; align-items: center; justify-content: space-between; gap: 32px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 20px; padding: 28px 32px; margin-bottom: 28px; opacity: 0; }",
    ".ct-banner.visible { animation: ct-fadeUp 0.5s 0.06s cubic-bezier(0.4,0,0.2,1) both; opacity: 1; }",
    ".ct-banner-tag { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #16a34a; margin-bottom: 6px; }",
    ".ct-banner-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.02em; }",
    ".ct-banner-text { font-size: 0.85rem; color: #475569; line-height: 1.75; margin: 0; max-width: 480px; }",
    ".ct-banner-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #16a34a; color: #fff; font-size: 0.82rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 100px; cursor: pointer; text-decoration: none; white-space: nowrap; transition: all 0.22s; box-shadow: 0 4px 14px rgba(22,163,74,0.3); flex-shrink: 0; }",
    ".ct-banner-btn:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(22,163,74,0.38); }",

    ".ct-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; opacity: 0; }",
    ".ct-bottom.visible { opacity: 1; }",
    ".ct-bottom.visible .ct-bottom-cell:nth-child(1) { animation: ct-fadeUp 0.44s 0.04s cubic-bezier(0.4,0,0.2,1) both; }",
    ".ct-bottom.visible .ct-bottom-cell:nth-child(2) { animation: ct-fadeUp 0.44s 0.12s cubic-bezier(0.4,0,0.2,1) both; }",
    ".ct-bottom-cell { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 24px 26px; transition: border-color 0.2s, box-shadow 0.2s; }",
    ".ct-bottom-cell:hover { border-color: #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }",
    ".ct-bottom-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #16a34a; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }",
    ".ct-bottom-label::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; border-radius: 2px; }",
    ".ct-bottom-text { font-size: 0.85rem; color: #64748b; line-height: 1.75; font-weight: 400; margin: 0; }",
    ".ct-bottom-link { display: block; font-size: 0.85rem; font-weight: 600; color: #16a34a; text-decoration: none; margin-bottom: 6px; }",
    ".ct-bottom-link:hover { text-decoration: underline; }",

    "@media (max-width: 1024px) { .ct-body { padding: 56px 32px 72px; } }",
    "@media (max-width: 768px) { .ct-hero { padding: 56px 20px 44px; } .ct-body { padding: 48px 24px 64px; } .ct-intro { grid-template-columns: 1fr; gap: 20px; padding-bottom: 32px; margin-bottom: 32px; } .ct-cards { grid-template-columns: 1fr; } .ct-banner { flex-direction: column; align-items: flex-start; gap: 20px; padding: 24px; } .ct-banner-btn { width: 100%; justify-content: center; } .ct-bottom { grid-template-columns: 1fr; } .ct-hero-title { font-size: clamp(1.5rem, 3.5vw, 2.4rem); } .ct-hero-sub { font-size: 0.95rem; } }",
    "@media (max-width: 600px) { .ct-body { padding: 36px 16px 48px; } .ct-cards { grid-template-columns: 1fr; gap: 12px; } .ct-card { padding: 20px 18px; border-radius: 16px; } .ct-card-icon { width: 42px; height: 42px; margin-bottom: 12px; } .ct-card-label { font-size: 0.65rem; margin-bottom: 8px; } .ct-card-text { font-size: 0.78rem; line-height: 1.65; } .ct-card-link { font-size: 0.78rem; } .ct-intro { gap: 12px; padding-bottom: 24px; margin-bottom: 24px; } .ct-intro-heading { font-size: clamp(1.1rem, 2.8vw, 1.5rem); } .ct-intro-sub { font-size: 0.85rem; } .ct-banner { padding: 20px 16px; gap: 16px; } .ct-banner-title { font-size: 0.95rem; } .ct-banner-text { font-size: 0.78rem; } .ct-banner-btn { padding: 10px 18px; font-size: 0.75rem; } .ct-bottom { grid-template-columns: 1fr; gap: 12px; } .ct-bottom-cell { padding: 18px 16px; border-radius: 16px; } .ct-bottom-text { font-size: 0.78rem; } }",
    "@media (max-width: 480px) { .ct-hero { padding: 40px 16px 32px; } .ct-hero-title { font-size: clamp(1.2rem, 3vw, 1.8rem); } .ct-hero-sub { font-size: 0.9rem; max-width: 100%; } .ct-body { padding: 28px 14px 40px; } .ct-eyebrow-line { width: 25px; } .ct-cards { grid-template-columns: 1fr; gap: 10px; } .ct-card { padding: 18px 14px; } .ct-card-icon { width: 38px; height: 38px; } .ct-card-label { font-size: 0.6rem; letter-spacing: 0.1em; } .ct-card-text { font-size: 0.75rem; line-height: 1.6; } .ct-card-link { font-size: 0.75rem; } .ct-intro { gap: 10px; padding-bottom: 20px; margin-bottom: 20px; } .ct-intro-heading { font-size: clamp(1rem, 2.5vw, 1.3rem); } .ct-intro-sub { font-size: 0.8rem; padding-top: 12px; } .ct-banner { padding: 16px 12px; } .ct-banner-title { font-size: 0.9rem; margin-bottom: 6px; } .ct-banner-text { font-size: 0.75rem; } .ct-banner-btn { padding: 9px 16px; font-size: 0.7rem; } .ct-bottom-cell { padding: 16px 12px; } .ct-bottom-label { font-size: 0.6rem; } .ct-bottom-text { font-size: 0.75rem; } }",
].join("\n");

const Contact = () => {
    const [introRef,  introVisible]  = useInView(0.08);
    const [cardsRef,  cardsVisible]  = useInView(0.08);
    const [bannerRef, bannerVisible] = useInView(0.08);
    const [bottomRef, bottomVisible] = useInView(0.08);

    return (
        <>
            <style>{CSS}</style>
            <div className="ct-root">

                {/* Hero */}
                <div className="ct-hero">
                    <div className="ct-eyebrow">
                        <div className="ct-eyebrow-line" />
                        <span className="ct-eyebrow-text">Reach Out</span>
                        <div className="ct-eyebrow-line" />
                    </div>
                    <h1 className="ct-hero-title">Contact <span>Us</span></h1>
                    <p className="ct-hero-sub">
                        Whether you have a question about an order, need product guidance, or just want to say hello — our team is ready to help.
                    </p>
                </div>

                <div className="ct-body">

                    {/* Intro */}
                    <div ref={introRef} className={"ct-intro" + (introVisible ? " visible" : "")}>
                        <h2 className="ct-intro-heading">
                            We're here whenever<br />you need <span>us.</span>
                        </h2>
                        <p className="ct-intro-sub">
                            Reach us through any of the channels below and we'll get back to you promptly. Our dedicated team reads every message carefully and answers with care.
                        </p>
                    </div>

                    {/* Cards */}
                    <div ref={cardsRef} className={"ct-cards" + (cardsVisible ? " visible" : "")}>

                        <div className="ct-card">
                            <div className="ct-card-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <p className="ct-card-label">Phone &amp; Email</p>
                            <div className="ct-card-text">
                                <a href="tel:+8801700000000" className="ct-card-link">+880 1700-000000</a>
                                <a href="mailto:support@dynamicxmart.com" className="ct-card-link">support@dynamicxmart.com</a>
                                <span style={{ marginTop: 8, display: "block" }}>Response within 24 business hours.</span>
                            </div>
                        </div>

                        <div className="ct-card">
                            <div className="ct-card-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="1" y="3" width="15" height="13" rx="1" />
                                    <path d="M16 8h4l3 5v3h-7V8z" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <p className="ct-card-label">Fast Delivery</p>
                            <p className="ct-card-text">
                                Orders dispatched within 1–2 business days. Track your order in real time from your account dashboard.
                            </p>
                        </div>

                        <div className="ct-card">
                            <div className="ct-card-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="23 4 23 10 17 10" />
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                                </svg>
                            </div>
                            <p className="ct-card-label">Easy Returns</p>
                            <p className="ct-card-text">
                                Not satisfied? Return any item within 7 days of delivery — hassle-free, no questions asked.
                            </p>
                        </div>

                    </div>

                    {/* Banner */}
                    <div ref={bannerRef} className={"ct-banner" + (bannerVisible ? " visible" : "")}>
                        <div>
                            <p className="ct-banner-tag">100% Online</p>
                            <p className="ct-banner-title">Shop with Confidence</p>
                            <p className="ct-banner-text">
                                DynamicxMart is entirely online — shop from the comfort of your home, anytime. Secure payments, fast dispatch, and real-time order tracking make every purchase effortless.
                            </p>
                        </div>
                        <a
                            href="https://dynamicxmart.com"
                            target="_blank"
                            rel="noreferrer"
                            className="ct-banner-btn"
                        >
                            Visit Store
                        </a>
                    </div>

                    {/* Bottom */}
                    <div ref={bottomRef} className={"ct-bottom" + (bottomVisible ? " visible" : "")}>
                        <div className="ct-bottom-cell">
                            <p className="ct-bottom-label">Online Store</p>
                            <a href="https://dynamicxmart.com" target="_blank" rel="noreferrer" className="ct-bottom-link">
                                dynamicxmart.com
                            </a>
                            <p className="ct-bottom-text">
                                Open 24 hours, 7 days a week. Orders processed within 1–2 business days.
                            </p>
                        </div>
                        <div className="ct-bottom-cell">
                            <p className="ct-bottom-label">A Note From Us</p>
                            <p className="ct-bottom-text">
                                Your satisfaction is our priority. Every message we receive is read carefully and answered with care. We are a dedicated team — and we are always here for you.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Contact;