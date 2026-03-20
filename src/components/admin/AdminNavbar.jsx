import { Link } from "react-router-dom";
import { MenuIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.an-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 62px;
    background: #fff; border-bottom: 1.5px solid #f1f5f9;
    flex-shrink: 0; position: sticky; top: 0; z-index: 30;
}
.an-left { display: flex; align-items: center; gap: 12px; }
.an-logo { display: flex; align-items: center; text-decoration: none; font-size: 1.45rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
.an-logo-accent { color: #16a34a; }
.an-logo-dot { color: #16a34a; font-size: 1.85rem; line-height: 0; margin-top: 6px; }
.an-admin-badge { display: inline-flex; align-items: center; gap: 5px; background: #16a34a; color: #fff; font-size: 0.62rem; font-weight: 700; padding: 3px 8px; border-radius: 100px; margin-left: 10px; letter-spacing: 0.4px; text-transform: uppercase; }
.an-admin-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.7); }
.an-right { display: flex; align-items: center; gap: 10px; }
.an-favicon-wrap { width: 34px; height: 34px; border-radius: 10px; border: 1.5px solid #f1f5f9; background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; transition: border-color 0.18s; }
.an-favicon-wrap:hover { border-color: #bbf7d0; }
.an-favicon { width: 22px; height: 22px; object-fit: contain; }
.an-hamburger { display: none; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; background: #f8fafc; border: 1.5px solid #f1f5f9; cursor: pointer; color: #475569; transition: all 0.18s; flex-shrink: 0; }
.an-hamburger:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
@media (max-width: 768px) { .an-hamburger { display: flex; } }
@media (max-width: 480px) { .an-root { padding: 0 16px; } }
`;

const AdminNavbar = ({ onMenuToggle }) => (
    <>
        <style>{CSS}</style>
        <nav className="an-root">
            <div className="an-left">
                <button className="an-hamburger" onClick={onMenuToggle} title="Toggle menu">
                    <MenuIcon size={18} />
                </button>
                <Link to="/" className="an-logo">
                    <span className="an-logo-accent">Mart</span>Xen
                    <span className="an-logo-dot">.</span>
                    <span className="an-admin-badge">
                        <span className="an-admin-badge-dot" />
                        Admin
                    </span>
                </Link>
            </div>
            <div className="an-right">
                <div className="an-favicon-wrap">
                    <img src="/favicon.png" alt="logo" className="an-favicon" />
                </div>
            </div>
        </nav>
    </>
);

export default AdminNavbar;