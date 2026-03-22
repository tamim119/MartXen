import { useLocation, Link } from "react-router-dom";
import {
    HomeIcon, ShieldCheckIcon, StoreIcon,
    TicketPercentIcon, BadgeDollarSignIcon,
    PanelLeftCloseIcon, PanelLeftOpenIcon, XIcon,
    Settings2Icon, LayoutIcon, ZapIcon, UsersIcon
} from "lucide-react";
import { useState, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* ── Backdrop (mobile only) ── */
.asb-backdrop {
    display: none;
}
@media (max-width: 768px) { 
    .asb-backdrop {
        position: fixed; 
        inset: 0;
        background: rgba(0,0,0,0.45); 
        z-index: 40;
        animation: asb-fade-in 0.22s ease;
    }
    .asb-backdrop.open { 
        display: block; 
    } 
}
@keyframes asb-fade-in { from { opacity:0; } to { opacity:1; } }

/* ── Root sidebar (DESKTOP DEFAULT - ALWAYS VISIBLE) ── */
.asb-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; 
    flex-direction: column;
    height: 100%; 
    width: 220px; 
    flex-shrink: 0;
    border-right: 1.5px solid #f1f5f9;
    background: #fff; 
    padding-bottom: 24px;
    transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden; 
    position: relative; 
    z-index: 50;
}

.asb-root.collapsed { 
    width: 64px; 
}

/* ── Mobile override ── */
@media (max-width: 768px) {
    .asb-root {
        position: fixed !important; 
        top: 0; 
        left: 0; 
        bottom: 0;
        width: 240px !important;
        transform: translateX(-100%); 
        box-shadow: none;
        transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        /* ✅ KEY FIX: flex column so scroll area can fill remaining height */
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        padding-bottom: 0 !important;
    }
    
    .asb-root.mobile-open {
        transform: translateX(0);
        box-shadow: 4px 0 24px rgba(0,0,0,0.12);
    }
    
    .asb-toggle { 
        display: none !important; 
    }
    
    .asb-mobile-close { 
        display: flex !important; 
    }

    /* ✅ KEY FIX: Scroll wrapper — fills leftover space and scrolls */
    .asb-scroll-area {
        flex: 1 1 0% !important;
        min-height: 0 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        -webkit-overflow-scrolling: touch !important;
        padding-bottom: 24px;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .asb-scroll-area::-webkit-scrollbar {
        display: none;
    }
}

/* ── Mobile close header (hidden on desktop) ── */
.asb-mobile-close {
    display: none; 
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 4px; 
    flex-shrink: 0;
}

.asb-mobile-close-btn {
    width: 30px; 
    height: 30px; 
    border-radius: 9px;
    background: #f8fafc; 
    border: 1.5px solid #f1f5f9;
    display: flex; 
    align-items: center; 
    justify-content: center;
    cursor: pointer; 
    color: #94a3b8; 
    transition: all 0.18s;
}

.asb-mobile-close-btn:hover { 
    background: #fef2f2; 
    border-color: #fecaca; 
    color: #ef4444; 
}

.asb-mobile-close-title { 
    font-size: 0.78rem; 
    font-weight: 700; 
    color: #0f172a; 
    letter-spacing: -0.1px; 
}

/* ── Desktop toggle (visible on desktop) ── */
.asb-toggle {
    display: flex; 
    align-items: center;
    justify-content: flex-end;
    padding: 12px 12px 4px; 
    flex-shrink: 0;
}

.asb-root.collapsed .asb-toggle { 
    justify-content: center; 
}

.asb-toggle-btn {
    width: 30px; 
    height: 30px; 
    border-radius: 9px;
    background: #f8fafc; 
    border: 1.5px solid #f1f5f9;
    display: flex; 
    align-items: center; 
    justify-content: center;
    cursor: pointer; 
    color: #94a3b8; 
    transition: all 0.18s; 
    flex-shrink: 0;
}

.asb-toggle-btn:hover { 
    background: #f0fdf4; 
    border-color: #bbf7d0; 
    color: #16a34a; 
}

/* ── Profile ── */
.asb-profile {
    display: flex; 
    flex-direction: column; 
    align-items: center;
    gap: 10px; 
    padding: 16px 16px 18px;
    border-bottom: 1.5px solid #f8fafc;
    margin-bottom: 8px; 
    overflow: visible;
    transition: padding 0.25s, gap 0.25s;
    flex-shrink: 0;
}

.asb-root.collapsed .asb-profile {
    padding: 10px 8px 14px;
    gap: 0;
    overflow: hidden;
}

.asb-favicon-wrap {
    width: 62px; 
    height: 62px; 
    border-radius: 18px;
    border: 1.5px solid #f1f5f9; 
    background: #f8fafc;
    display: flex; 
    align-items: center; 
    justify-content: center;
    overflow: hidden; 
    flex-shrink: 0;
    transition: width 0.25s, height 0.25s, border-radius 0.25s;
}

.asb-root.collapsed .asb-favicon-wrap {
    width: 38px; 
    height: 38px; 
    border-radius: 10px;
}

.asb-favicon {
    width: 40px; 
    height: 40px; 
    object-fit: contain;
    transition: width 0.25s, height 0.25s;
}

.asb-root.collapsed .asb-favicon { 
    width: 24px; 
    height: 24px; 
}

.asb-name {
    font-size: 0.95rem; 
    font-weight: 800; 
    color: #0f172a;
    text-align: center; 
    white-space: nowrap;
    overflow: visible; 
    text-overflow: clip; 
    max-width: 200px;
    display: block;
    line-height: 1.3;
}

.asb-root.collapsed .asb-name { 
    display: none; 
    overflow: hidden;
}

.asb-role {
    display: inline-flex; 
    align-items: center; 
    gap: 4px;
    background: #f0fdf4; 
    border: 1.5px solid #bbf7d0;
    border-radius: 100px; 
    padding: 3px 10px;
    font-size: 0.7rem; 
    font-weight: 700; 
    color: #16a34a;
    letter-spacing: 0.3px;
    white-space: nowrap;
}

.asb-root.collapsed .asb-role { 
    display: none; 
}

.asb-role-dot {
    width: 5px; 
    height: 5px; 
    border-radius: 50%;
    background: #16a34a; 
    box-shadow: 0 0 4px rgba(22,163,74,0.5);
    animation: asb-pulse 2s ease-in-out infinite;
}

@keyframes asb-pulse {
    0%,100% { box-shadow: 0 0 3px rgba(22,163,74,0.4); }
    50%      { box-shadow: 0 0 8px rgba(22,163,74,0.7); }
}

/* ── Nav labels ── */
.asb-nav-label {
    font-size: 0.58rem; 
    font-weight: 700; 
    color: #cbd5e1;
    text-transform: uppercase; 
    letter-spacing: 0.12em;
    padding: 0 22px; 
    margin-bottom: 4px; 
    white-space: nowrap;
}

.asb-root.collapsed .asb-nav-label { 
    display: none; 
}

/* ── Nav list ── */
.asb-nav { 
    display: flex; 
    flex-direction: column; 
    gap: 2px; 
    padding: 0 10px; 
}

.asb-root.collapsed .asb-nav { 
    padding: 0 8px; 
    align-items: center; 
}

.asb-nav-divider { 
    height: 1.5px; 
    background: #f8fafc; 
    margin: 8px 10px; 
    border-radius: 2px; 
}

.asb-root.collapsed .asb-nav-divider { 
    margin: 8px; 
}

/* ── Nav links ── */
.asb-link {
    display: flex; 
    align-items: center; 
    gap: 10px;
    padding: 10px 12px; 
    border-radius: 12px;
    text-decoration: none; 
    font-size: 0.82rem; 
    font-weight: 600;
    color: #94a3b8;
    transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
    position: relative; 
    white-space: nowrap; 
    overflow: hidden; 
    width: 100%;
}

.asb-root.collapsed .asb-link {
    width: 44px; 
    height: 44px; 
    padding: 10px; 
    justify-content: center;
}

.asb-link::before {
    content: ''; 
    position: absolute; 
    inset: 0;
    background: #f0fdf4; 
    border-radius: 12px; 
    opacity: 0;
    transform: scaleX(0.85); 
    transform-origin: left;
    transition: opacity 0.18s, transform 0.22s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
}

.asb-link:hover::before, 
.asb-link.active::before { 
    opacity: 1; 
    transform: scaleX(1); 
}

.asb-link:hover { 
    color: #475569; 
}

.asb-link.active { 
    color: #16a34a; 
}

.asb-link-icon {
    position: relative; 
    z-index: 1;
    width: 32px; 
    height: 32px; 
    border-radius: 9px;
    background: #f8fafc; 
    border: 1.5px solid #f1f5f9;
    display: flex; 
    align-items: center; 
    justify-content: center;
    flex-shrink: 0; 
    transition: all 0.18s;
}

.asb-root.collapsed .asb-link-icon { 
    background: none; 
    border: none; 
    width: 22px; 
    height: 22px; 
}

.asb-link:hover .asb-link-icon,
.asb-link.active .asb-link-icon {
    background: #fff; 
    border-color: #bbf7d0; 
    color: #16a34a;
    box-shadow: 0 2px 8px rgba(22,163,74,0.15);
}

.asb-root.collapsed .asb-link:hover .asb-link-icon,
.asb-root.collapsed .asb-link.active .asb-link-icon {
    background: #f0fdf4; 
    border-color: #bbf7d0; 
    color: #16a34a;
    box-shadow: none; 
    width: 22px; 
    height: 22px;
}

.asb-link-text { 
    flex: 1; 
    position: relative; 
    z-index: 1; 
}

.asb-root.collapsed .asb-link-text { 
    display: none; 
}

.asb-active-bar {
    position: absolute; 
    right: 0; 
    top: 8px; 
    bottom: 8px;
    width: 3px; 
    border-radius: 2px 0 0 2px;
    background: linear-gradient(180deg, #16a34a, #4ade80);
    box-shadow: 0 0 8px rgba(22,163,74,0.4); 
    z-index: 1;
}

.asb-root.collapsed .asb-active-bar { 
    display: none; 
}

.asb-badge {
    position: relative; 
    z-index: 1;
    background: #f59e0b; 
    color: #fff;
    font-size: 0.58rem; 
    font-weight: 800;
    border-radius: 100px; 
    padding: 1px 6px;
    min-width: 16px; 
    text-align: center; 
    flex-shrink: 0;
}

.asb-root.collapsed .asb-badge { 
    display: none; 
}

/* ── Tooltip (collapsed only) ── */
.asb-tooltip {
    display: none; 
    position: absolute; 
    left: 54px; 
    top: 50%;
    transform: translateY(-50%); 
    background: #0f172a; 
    color: #fff;
    font-size: 0.72rem; 
    font-weight: 600; 
    padding: 5px 10px;
    border-radius: 8px; 
    white-space: nowrap; 
    pointer-events: none;
    z-index: 100; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.asb-tooltip::before {
    content: ''; 
    position: absolute; 
    left: -5px; 
    top: 50%;
    transform: translateY(-50%); 
    border: 5px solid transparent;
    border-right-color: #0f172a; 
    border-left: 0;
}

.asb-root.collapsed .asb-link:hover .asb-tooltip { 
    display: block; 
}
`;

const AdminSidebar = ({ mobileOpen, onMobileClose, pendingPlusCount = 0 }) => {
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (onMobileClose) onMobileClose();
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const mainLinks = [
        { name: 'Dashboard',     href: '/admin',              icon: HomeIcon },
        { name: 'Plus Requests', href: '/admin/plusApprove',  icon: ZapIcon, badge: pendingPlusCount },
        { name: 'Stores',        href: '/admin/stores',       icon: StoreIcon },
        { name: 'Approve Store', href: '/admin/approve',      icon: ShieldCheckIcon },
        { name: 'Coupons',       href: '/admin/coupons',      icon: TicketPercentIcon },
        { name: 'Pricing',       href: '/admin/pricing',      icon: BadgeDollarSignIcon },
    ];

    const userLinks = [
        { name: 'Users',        href: '/admin/users',      icon: UsersIcon },
        { name: 'Plus Members', href: '/admin/plus-users', icon: ZapIcon },
    ];

    const settingsLinks = [
        { name: 'Payment Settings', href: '/admin/payment-settings', icon: Settings2Icon },
        { name: 'Banner Settings',  href: '/admin/banner-settings',  icon: LayoutIcon },
    ];

    const renderLinks = (links) => links.map(link => {
        const isActive = pathname === link.href;
        return (
            <Link
                key={link.href}
                to={link.href}
                className={"asb-link" + (isActive ? " active" : "")}
            >
                <span className="asb-link-icon"><link.icon size={15} /></span>
                <span className="asb-link-text">{link.name}</span>
                {link.badge > 0 && <span className="asb-badge">{link.badge}</span>}
                {isActive && <span className="asb-active-bar" />}
                <span className="asb-tooltip">{link.name}</span>
            </Link>
        );
    });

    return (
        <>
            <style>{CSS}</style>

            {/* Backdrop */}
            <div
                className={"asb-backdrop" + (mobileOpen ? " open" : "")}
                onClick={onMobileClose}
            />

            <aside className={[
                "asb-root",
                collapsed  ? "collapsed"   : "",
                mobileOpen ? "mobile-open" : "",
            ].filter(Boolean).join(" ")}>

                {/* ── Mobile close header — sticky at top, never scrolls ── */}
                <div className="asb-mobile-close">
                    <span className="asb-mobile-close-title">Admin Panel</span>
                    <button className="asb-mobile-close-btn" onClick={onMobileClose}>
                        <XIcon size={14} />
                    </button>
                </div>

                {/* ── Desktop toggle ── */}
                <div className="asb-toggle">
                    <button
                        className="asb-toggle-btn"
                        onClick={() => setCollapsed(c => !c)}
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? <PanelLeftOpenIcon size={14} /> : <PanelLeftCloseIcon size={14} />}
                    </button>
                </div>

                {/*
                    ✅ asb-scroll-area:
                    • Desktop → normal flow, no scroll needed
                    • Mobile  → flex:1, min-height:0, overflow-y:auto, touch scroll
                */}
                <div className="asb-scroll-area">

                    {/* Profile */}
                    <div className="asb-profile">
                        <div className="asb-favicon-wrap">
                            <img src="/favicon.png" alt="logo" className="asb-favicon" />
                        </div>
                        <p className="asb-name">Admin Panel</p>
                        <span className="asb-role">
                            <span className="asb-role-dot" />
                            Administrator
                        </span>
                    </div>

                    {/* Main nav */}
                    <p className="asb-nav-label">MENU</p>
                    <nav className="asb-nav">{renderLinks(mainLinks)}</nav>

                    <div className="asb-nav-divider" />

                    {/* Users nav */}
                    <p className="asb-nav-label">USERS</p>
                    <nav className="asb-nav">{renderLinks(userLinks)}</nav>

                    <div className="asb-nav-divider" />

                    {/* Settings nav */}
                    <p className="asb-nav-label">SETTINGS</p>
                    <nav className="asb-nav">{renderLinks(settingsLinks)}</nav>

                </div>

            </aside>
        </>
    );
};

export default AdminSidebar;