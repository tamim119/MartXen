import { Link } from "react-router-dom";
import { MenuIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.sn-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 62px;
    background: #fff;
    border-bottom: 1.5px solid #f1f5f9;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 30;
}
.sn-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 1.45rem;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.5px;
}
.sn-logo-accent { color: #16a34a; }
.sn-logo-dot { color: #16a34a; font-size: 1.85rem; line-height: 0; margin-top: 6px; }
.sn-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #16a34a;
    color: #fff;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 100px;
    margin-left: 10px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
}
.sn-badge-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,255,255,0.7);
}
.sn-right {
    display: flex;
    align-items: center;
    gap: 10px;
}
.sn-greeting {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 500;
}
.sn-greeting span { color: #0f172a; font-weight: 700; }
.sn-logo-img {
    width: 32px; height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f1f5f9;
}
.sn-logo-fallback {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
}

/* Hamburger button — mobile only */
.sn-hamburger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 36px; height: 36px;
    border-radius: 10px;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    cursor: pointer;
    color: #475569;
    transition: all 0.18s;
    flex-shrink: 0;
}
.sn-hamburger:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }

@media (max-width: 768px) {
    .sn-hamburger { display: flex; }
}
@media (max-width: 480px) {
    .sn-root { padding: 0 16px; }
    .sn-greeting { display: none; }
}
`;

const StoreNavbar = ({ storeInfo, onMenuToggle }) => {
    return (
        <>
            <style>{CSS}</style>
            <nav className="sn-root">
                {/* Left: Hamburger (mobile) + Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button className="sn-hamburger" onClick={onMenuToggle} title="Toggle menu">
                        <MenuIcon size={18} />
                    </button>
                    <Link to="/" className="sn-logo">
                        <span className="sn-logo-accent">Dynamicx</span>Mart
                        <span className="sn-logo-dot">.</span>
                        <span className="sn-badge">
                            <span className="sn-badge-dot" />
                            Store
                        </span>
                    </Link>
                </div>

                {/* Right: Greeting + Avatar */}
                <div className="sn-right">
                    <p className="sn-greeting">
                        Hi, <span>{storeInfo?.name || 'Seller'}</span>
                    </p>
                    {storeInfo?.logo ? (
                        <img src={storeInfo.logo} alt={storeInfo.name} className="sn-logo-img" />
                    ) : (
                        <div className="sn-logo-fallback">
                            {(storeInfo?.name || 'S')[0].toUpperCase()}
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default StoreNavbar;