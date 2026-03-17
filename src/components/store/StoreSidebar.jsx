import { useLocation, Link } from "react-router-dom";
import {
    HomeIcon, LayoutListIcon, SquarePenIcon, SquarePlusIcon,
    PanelLeftCloseIcon, PanelLeftOpenIcon, XIcon, Settings2Icon
} from "lucide-react";
import { useState, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ssb-backdrop {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.45); z-index: 40;
    animation: ssb-fade-in 0.22s ease;
}
@keyframes ssb-fade-in { from { opacity:0; } to { opacity:1; } }
@media (max-width: 768px) { .ssb-backdrop.open { display: block; } }

.ssb-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; flex-direction: column; height: 100%;
    width: 220px; flex-shrink: 0;
    border-right: 1.5px solid #f1f5f9; background: #fff;
    padding-bottom: 24px;
    transition: width 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden; position: relative; z-index: 50;
}
.ssb-root.collapsed { width: 64px; }

@media (max-width: 768px) {
    .ssb-root { position: fixed; top: 0; left: 0; bottom: 0; width: 240px !important; transform: translateX(-100%); box-shadow: none; }
    .ssb-root.mobile-open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.12); }
    .ssb-toggle        { display: none !important; }
    .ssb-mobile-close  { display: flex !important; }
    .ssb-profile       { display: flex !important; }
    .ssb-nav-label     { display: block !important; }
    .ssb-link-text     { display: block !important; }
    .ssb-active-bar    { display: block !important; }
    .ssb-link { width: 100% !important; height: auto !important; padding: 10px 12px !important; justify-content: flex-start !important; }
    .ssb-link-icon { background: #f8fafc !important; border: 1.5px solid #f1f5f9 !important; width: 32px !important; height: 32px !important; }
    .ssb-link:hover .ssb-link-icon, .ssb-link.active .ssb-link-icon { background: #fff !important; border-color: #bbf7d0 !important; color: #16a34a !important; box-shadow: 0 2px 8px rgba(22,163,74,0.15) !important; }
    .ssb-nav { padding: 0 10px !important; align-items: stretch !important; }
}

.ssb-mobile-close { display: none; align-items: center; justify-content: space-between; padding: 14px 16px 4px; flex-shrink: 0; }
.ssb-mobile-close-btn { width: 30px; height: 30px; border-radius: 9px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; transition: all 0.18s; }
.ssb-mobile-close-btn:hover { background: #fef2f2; border-color: #fecaca; color: #ef4444; }
.ssb-mobile-close-title { font-size: 0.78rem; font-weight: 700; color: #0f172a; letter-spacing: -0.1px; }

.ssb-toggle { display: flex; align-items: center; justify-content: flex-end; padding: 12px 12px 4px; flex-shrink: 0; }
.ssb-toggle-btn { width: 30px; height: 30px; border-radius: 9px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; transition: all 0.18s; flex-shrink: 0; }
.ssb-toggle-btn:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.ssb-root.collapsed .ssb-toggle { justify-content: center; }

.ssb-profile { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 16px; border-bottom: 1.5px solid #f8fafc; margin-bottom: 10px; overflow: hidden; }
.ssb-root.collapsed .ssb-profile { display: none; }
.ssb-avatar-wrap { position: relative; width: 60px; height: 60px; flex-shrink: 0; }
.ssb-avatar-ring { position: absolute; inset: -3px; border-radius: 18px; background: linear-gradient(135deg, #16a34a, #4ade80, #15803d); animation: ssb-ring 3s ease-in-out infinite; z-index: 0; }
@keyframes ssb-ring { 0%,100% { opacity:0.6; } 50% { opacity:1; box-shadow:0 0 12px rgba(22,163,74,0.4); } }
.ssb-avatar { position: relative; z-index: 1; width: 60px; height: 60px; border-radius: 16px; object-fit: cover; border: 2.5px solid #fff; display: block; }
.ssb-avatar-fallback { position: relative; z-index: 1; width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #16a34a, #15803d); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.3rem; font-weight: 800; border: 2.5px solid #fff; }
.ssb-store-name { font-size: 0.84rem; font-weight: 800; color: #0f172a; text-align: center; letter-spacing: -0.2px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
.ssb-store-badge { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 100px; padding: 3px 10px; font-size: 0.62rem; font-weight: 700; color: #16a34a; white-space: nowrap; }
.ssb-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #16a34a; box-shadow: 0 0 5px rgba(22,163,74,0.6); animation: ssb-pulse 2s ease-in-out infinite; }
@keyframes ssb-pulse { 0%,100% { box-shadow:0 0 3px rgba(22,163,74,0.4); } 50% { box-shadow:0 0 8px rgba(22,163,74,0.7); } }

.ssb-nav-label { font-size: 0.58rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.12em; padding: 0 22px; margin-bottom: 4px; white-space: nowrap; }
.ssb-root.collapsed .ssb-nav-label { display: none; }

.ssb-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 10px; }
.ssb-root.collapsed .ssb-nav { padding: 0 8px; align-items: center; }

.ssb-nav-divider { height: 1.5px; background: #f8fafc; margin: 8px 10px; border-radius: 2px; }
.ssb-root.collapsed .ssb-nav-divider { margin: 8px; }

.ssb-link { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; text-decoration: none; font-size: 0.82rem; font-weight: 600; color: #94a3b8; transition: all 0.18s cubic-bezier(0.4,0,0.2,1); position: relative; white-space: nowrap; overflow: hidden; width: 100%; }
.ssb-root.collapsed .ssb-link { width: 44px; height: 44px; padding: 10px; justify-content: center; }
.ssb-link::before { content: ''; position: absolute; inset: 0; background: #f0fdf4; border-radius: 12px; opacity: 0; transform: scaleX(0.85); transform-origin: left; transition: opacity 0.18s, transform 0.22s cubic-bezier(0.4,0,0.2,1); z-index: 0; }
.ssb-link:hover::before, .ssb-link.active::before { opacity: 1; transform: scaleX(1); }
.ssb-link:hover { color: #475569; }
.ssb-link.active { color: #16a34a; }

.ssb-link-icon { position: relative; z-index: 1; width: 32px; height: 32px; border-radius: 9px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s; }
.ssb-root.collapsed .ssb-link-icon { background: none; border: none; width: 22px; height: 22px; }
.ssb-link:hover .ssb-link-icon, .ssb-link.active .ssb-link-icon { background: #fff; border-color: #bbf7d0; color: #16a34a; box-shadow: 0 2px 8px rgba(22,163,74,0.15); }
.ssb-root.collapsed .ssb-link:hover .ssb-link-icon, .ssb-root.collapsed .ssb-link.active .ssb-link-icon { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; box-shadow: none; width: 22px; height: 22px; }

.ssb-link-text { flex: 1; position: relative; z-index: 1; }
.ssb-root.collapsed .ssb-link-text { display: none; }

.ssb-active-bar { position: absolute; right: 0; top: 8px; bottom: 8px; width: 3px; border-radius: 2px 0 0 2px; background: linear-gradient(180deg, #16a34a, #4ade80); box-shadow: 0 0 8px rgba(22,163,74,0.4); z-index: 1; }
.ssb-root.collapsed .ssb-active-bar { display: none; }

.ssb-tooltip { display: none; position: absolute; left: 54px; top: 50%; transform: translateY(-50%); background: #0f172a; color: #fff; font-size: 0.72rem; font-weight: 600; padding: 5px 10px; border-radius: 8px; white-space: nowrap; pointer-events: none; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.ssb-tooltip::before { content: ''; position: absolute; left: -5px; top: 50%; transform: translateY(-50%); border: 5px solid transparent; border-right-color: #0f172a; border-left: 0; }
.ssb-root.collapsed .ssb-link:hover .ssb-tooltip { display: block; }
`;

const StoreSidebar = ({ storeInfo, mobileOpen, onMobileClose }) => {
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
        { name: 'Dashboard',       href: '/store',                icon: HomeIcon },
        { name: 'Add Product',     href: '/store/add-product',    icon: SquarePlusIcon },
        { name: 'Manage Products', href: '/store/manage-product', icon: SquarePenIcon },
        { name: 'Orders',          href: '/store/orders',         icon: LayoutListIcon },
    ];

    const settingsLinks = [
        { name: 'Payment Settings', href: '/store/payment-settings', icon: Settings2Icon },
    ];

    return (
        <>
            <style>{CSS}</style>
            <div className={"ssb-backdrop" + (mobileOpen ? " open" : "")} onClick={onMobileClose} />

            <aside className={"ssb-root" + (collapsed ? " collapsed" : "") + (mobileOpen ? " mobile-open" : "")}>

                {/* Mobile close */}
                <div className="ssb-mobile-close">
                    <span className="ssb-mobile-close-title">{storeInfo?.name || 'Store'}</span>
                    <button className="ssb-mobile-close-btn" onClick={onMobileClose} title="Close">
                        <XIcon size={14} />
                    </button>
                </div>

                {/* Desktop toggle */}
                <div className="ssb-toggle">
                    <button className="ssb-toggle-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand" : "Collapse"}>
                        {collapsed ? <PanelLeftOpenIcon size={14} /> : <PanelLeftCloseIcon size={14} />}
                    </button>
                </div>

                {/* Profile */}
                <div className="ssb-profile">
                    <div className="ssb-avatar-wrap">
                        <div className="ssb-avatar-ring" />
                        {storeInfo?.logo
                            ? <img src={storeInfo.logo} alt={storeInfo.name} className="ssb-avatar" />
                            : <div className="ssb-avatar-fallback">{(storeInfo?.name || 'S')[0].toUpperCase()}</div>
                        }
                    </div>
                    <p className="ssb-store-name">{storeInfo?.name}</p>
                    <span className="ssb-store-badge"><span className="ssb-badge-dot" /> Active Store</span>
                </div>

                {/* Main nav */}
                <p className="ssb-nav-label">Menu</p>
                <nav className="ssb-nav">
                    {mainLinks.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} to={link.href} className={"ssb-link" + (isActive ? " active" : "")}>
                                <span className="ssb-link-icon"><link.icon size={15} /></span>
                                <span className="ssb-link-text">{link.name}</span>
                                {isActive && <span className="ssb-active-bar" />}
                                <span className="ssb-tooltip">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Divider */}
                <div className="ssb-nav-divider" />

                {/* Settings nav */}
                <p className="ssb-nav-label">Settings</p>
                <nav className="ssb-nav">
                    {settingsLinks.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} to={link.href} className={"ssb-link" + (isActive ? " active" : "")}>
                                <span className="ssb-link-icon"><link.icon size={15} /></span>
                                <span className="ssb-link-text">{link.name}</span>
                                {isActive && <span className="ssb-active-bar" />}
                                <span className="ssb-tooltip">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

            </aside>
        </>
    );
};

export default StoreSidebar;