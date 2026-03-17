import { Search, ShoppingCart, Menu, X, Home, Store, Sparkles, Phone, Heart, LogOut, ChevronDown, MapPinIcon, PackageIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useCurrentUser } from "../hooks/useAuth";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; }

.nb {
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: sticky; top: 0; z-index: 1000;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid transparent;
    transition: box-shadow 0.3s, border-color 0.3s;
}
.nb.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.08); border-color: #e2e8f0; }
.nb-inner {
    max-width: 1280px; margin: 0 auto;
    padding: 0 24px; height: 66px;
    display: flex; align-items: center;
    justify-content: space-between; gap: 16px;
}

.nb-logo { display: flex; align-items: center; text-decoration: none; position: relative; user-select: none; flex-shrink: 0; }
.nb-logo-text { font-size: 1.55rem; font-weight: 700; color: #334155; letter-spacing: -0.03em; line-height: 1; white-space: nowrap; }
.nb-g { color: #16a34a; }
.nb-dot { color: #16a34a; font-size: 2rem; line-height: 0.55; }
.nb-badge {
    position: absolute; top: -8px; right: -32px;
    background: #16a34a; color: #fff; font-size: 8.5px; font-weight: 700;
    letter-spacing: 0.04em; padding: 2px 7px; border-radius: 20px; text-transform: lowercase;
    animation: nb-pulse 3s ease-in-out infinite;
}
@keyframes nb-pulse {
    0%,100% { box-shadow: 0 2px 6px rgba(22,163,74,0.3); }
    50%      { box-shadow: 0 2px 14px rgba(22,163,74,0.65); }
}

.nb-links { display: flex; align-items: center; gap: 2px; }
.nb-link {
    position: relative; color: #475569; text-decoration: none;
    font-size: 0.875rem; font-weight: 500; padding: 7px 10px;
    border-radius: 8px; transition: color 0.2s, background 0.2s; white-space: nowrap;
}
.nb-link::after {
    content: ''; position: absolute; bottom: 3px; left: 10px; right: 10px;
    height: 2px; background: #16a34a; border-radius: 2px;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
}
.nb-link:hover { color: #16a34a; background: #f0fdf4; }
.nb-link:hover::after, .nb-link.active::after { transform: scaleX(1); }
.nb-link.active { color: #16a34a; }

.nb-search {
    display: flex; align-items: center; gap: 8px;
    background: #f1f5f9; border: 1.5px solid transparent;
    padding: 8px 14px; border-radius: 100px;
    transition: all 0.25s ease; width: 200px;
}
.nb-search.focused { background: #fff; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); width: 240px; }
.nb-search input, .nb-tsearch input, .nb-dsearch input {
    background: transparent; border: none; outline: none;
    font-size: 0.825rem; color: #334155; width: 100%; font-family: inherit;
}
.nb-search input::placeholder, .nb-tsearch input::placeholder, .nb-dsearch input::placeholder { color: #94a3b8; }

.nb-tsearch {
    display: flex; align-items: center; gap: 8px;
    background: #f1f5f9; border: 1.5px solid transparent;
    padding: 7px 13px; border-radius: 100px;
    transition: all 0.25s ease; flex: 1; max-width: 230px;
}
.nb-tsearch.focused { background: #fff; border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }

.nb-icon-btn {
    position: relative; display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 10px; border: 1.5px solid #e2e8f0;
    color: #475569; text-decoration: none; transition: all 0.2s; flex-shrink: 0;
    background: #fff;
}
.nb-icon-btn:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
.nb-icon-btn.wish:hover { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }
.nb-icon-btn.wish.active { border-color: #fca5a5; color: #ef4444; background: #fef2f2; }

.nb-cbadge {
    position: absolute; top: 2px; right: 2px; min-width: 16px; height: 16px;
    padding: 0 4px; background: #16a34a; color: #fff; font-size: 9px; font-weight: 700;
    border-radius: 100px; display: flex; align-items: center; justify-content: center;
}
.nb-wbadge {
    position: absolute; top: 2px; right: 2px; min-width: 16px; height: 16px;
    padding: 0 4px; background: #ef4444; color: #fff; font-size: 9px; font-weight: 700;
    border-radius: 100px; display: flex; align-items: center; justify-content: center;
}

.nb-login {
    padding: 8px 20px; background: #16a34a; color: #fff; font-size: 0.85rem; font-weight: 600;
    border: none; border-radius: 100px; cursor: pointer; font-family: inherit;
    transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(22,163,74,0.28);
}
.nb-login:hover { background: #15803d; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(22,163,74,0.38); }
.nb-login:active { transform: translateY(0); }

.nb-profile { position: relative; flex-shrink: 0; }
.nb-profile-btn {
    display: flex; align-items: center; gap: 8px; padding: 5px 12px 5px 5px;
    border: 1.5px solid #e2e8f0; border-radius: 100px; background: #fff;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.nb-profile-btn:hover { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.nb-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 11px; font-weight: 700; overflow: hidden; flex-shrink: 0;
}
.nb-avatar img { width: 100%; height: 100%; object-fit: cover; }
.nb-pname { font-size: 0.825rem; font-weight: 600; color: #334155; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nb-chevron { color: #94a3b8; transition: transform 0.2s; }
.nb-chevron.open { transform: rotate(180deg); }

.nb-dropdown {
    position: absolute; top: calc(100% + 10px); right: 0;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 8px;
    min-width: 185px; box-shadow: 0 12px 40px rgba(0,0,0,0.13);
    transform-origin: top right; animation: nb-drop 0.2s cubic-bezier(0.34,1.56,0.64,1); z-index: 200;
}
@keyframes nb-drop {
    from { opacity: 0; transform: scale(0.9) translateY(-6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}
.nb-ddi {
    display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px;
    color: #475569; text-decoration: none; font-size: 0.85rem; font-weight: 500;
    border-radius: 10px; border: none; background: none; cursor: pointer;
    font-family: inherit; text-align: left; transition: all 0.15s;
}
.nb-ddi:hover { background: #f8fafc; color: #16a34a; }
.nb-ddi.danger:hover { background: #fef2f2; color: #ef4444; }
.nb-ddiv { height: 1px; background: #f1f5f9; margin: 4px 0; }

.nb-hamburger {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; border-radius: 10px; border: 1.5px solid #e2e8f0;
    background: #fff; cursor: pointer; color: #475569; transition: all 0.2s; flex-shrink: 0;
}
.nb-hamburger:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }

.nb-overlay {
    position: fixed; inset: 0; background: rgba(15,23,42,0.4);
    backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
    z-index: 1100; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
}
.nb-overlay.open { opacity: 1; pointer-events: all; }

/* ══════════════════════════════
   DRAWER
══════════════════════════════ */
.nb-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(320px, 88vw); background: #fff; z-index: 1200;
    display: flex; flex-direction: column;
    transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    box-shadow: -8px 0 40px rgba(0,0,0,0.14);
}
.nb-drawer.open { transform: translateX(0); }

/* Header */
.nb-dhead {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 18px 14px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
}
.nb-dclose {
    width: 34px; height: 34px; border-radius: 9px; border: 1.5px solid #e2e8f0;
    background: #fff; display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #64748b; transition: all 0.2s;
}
.nb-dclose:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

/* Scrollable body */
.nb-dbody {
    flex: 1; overflow-y: auto; padding: 16px 14px 8px;
    display: flex; flex-direction: column; gap: 0;
}

/* Search */
.nb-dsearch {
    display: flex; align-items: center; gap: 9px;
    background: #f8fafc; border: 1.5px solid #e2e8f0;
    border-radius: 12px; padding: 11px 14px; margin-bottom: 20px;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.nb-dsearch:focus-within { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }

/* Section label */
.nb-dlabel {
    font-size: 0.68rem; font-weight: 700; color: #94a3b8;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0 4px; margin-bottom: 6px; margin-top: 2px;
}

/* Nav link item */
.nb-dlink {
    display: flex; align-items: center; gap: 12px; padding: 10px 10px;
    color: #475569; text-decoration: none; font-size: 0.88rem; font-weight: 500;
    border-radius: 12px; margin-bottom: 2px; transition: all 0.18s;
    font-family: inherit; border: none; background: none; width: 100%;
    cursor: pointer; text-align: left;
}
.nb-dlink:hover { background: #f0fdf4; color: #16a34a; }
.nb-dlink.active { background: #f0fdf4; color: #16a34a; font-weight: 600; }

/* Icon box */
.nb-dicon {
    width: 34px; height: 34px; border-radius: 10px; background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.18s, border-color 0.18s; color: #64748b;
}
.nb-dlink:hover .nb-dicon,
.nb-dlink.active .nb-dicon {
    background: #dcfce7; border-color: #bbf7d0; color: #16a34a;
}
/* Red icon for wishlist */
.nb-dlink:hover .nb-dicon.wish-icon,
.nb-dlink.active .nb-dicon.wish-icon {
    background: #fef2f2; border-color: #fecaca; color: #ef4444;
}

/* Section divider */
.nb-ddivider {
    height: 1px; background: #f1f5f9; margin: 10px 0;
}

/* Badge chips */
.nb-count-chip {
    margin-left: auto; font-size: 0.72rem; font-weight: 700;
    padding: 2px 9px; border-radius: 100px;
}
.nb-count-chip.green { background: #f0fdf4; color: #16a34a; }
.nb-count-chip.red   { background: #fef2f2; color: #ef4444; }

.nb-plus-badge {
    display: inline-flex; align-items: center; gap: 4px;
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: #fff; font-size: 0.68rem; font-weight: 700;
    padding: 3px 10px; border-radius: 100px;
    margin-left: auto; letter-spacing: 0.03em;
    box-shadow: 0 2px 8px rgba(22,163,74,0.3);
}

/* Footer */
.nb-dfooter {
    padding: 12px 14px 16px; border-top: 1px solid #f1f5f9; flex-shrink: 0;
}

/* User card */
.nb-ucard {
    display: flex; align-items: center; gap: 11px;
    padding: 11px 12px;
    background: linear-gradient(135deg, #f0fdf4, #f8fafc);
    border: 1.5px solid #dcfce7;
    border-radius: 14px; margin-bottom: 10px;
}
.nb-uavatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #4f46e5);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 13px; font-weight: 700; overflow: hidden; flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(22,163,74,0.3);
}
.nb-uavatar img { width: 100%; height: 100%; object-fit: cover; }
.nb-uinfo { overflow: hidden; flex: 1; }
.nb-uname  { margin: 0; font-weight: 700; font-size: 0.875rem; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nb-uemail { margin: 2px 0 0; font-size: 0.72rem; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Footer action links */
.nb-faction {
    display: flex; align-items: center; gap: 10px; padding: 9px 10px;
    color: #475569; text-decoration: none; font-size: 0.85rem; font-weight: 500;
    border-radius: 11px; margin-bottom: 2px; transition: all 0.18s;
    font-family: inherit; border: none; background: none; width: 100%;
    cursor: pointer; text-align: left;
}
.nb-faction:hover { background: #f8fafc; color: #0f172a; }
.nb-faction-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: #f1f5f9; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #64748b; transition: background 0.18s;
}
.nb-faction:hover .nb-faction-icon { background: #e2e8f0; }

.nb-signout {
    width: 100%; margin-top: 8px; padding: 11px;
    border-radius: 12px; border: 1.5px solid #fee2e2;
    background: #fff; color: #ef4444;
    font-size: 0.875rem; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-family: inherit; transition: all 0.2s;
}
.nb-signout:hover { background: #fef2f2; border-color: #fca5a5; }

.nb-dlogin {
    width: 100%; padding: 13px; border-radius: 14px;
    background: #16a34a; color: #fff; font-size: 0.9rem; font-weight: 600;
    border: none; cursor: pointer; font-family: inherit; transition: all 0.2s;
    box-shadow: 0 2px 10px rgba(22,163,74,0.3);
}
.nb-dlogin:hover { background: #15803d; }

@media (max-width: 767px) {
    .nb-inner { padding: 0 16px; height: 60px; }
    .nb-logo-text { font-size: 1.3rem; }
    .nb-dot { font-size: 1.7rem; }
    .nb-badge { right: -26px; font-size: 8px; }
    .nb-dzone, .nb-tzone { display: none !important; }
    .nb-mzone { display: flex !important; }
}
@media (min-width: 768px) and (max-width: 1023px) {
    .nb-inner { padding: 0 20px; height: 63px; }
    .nb-dzone { display: none !important; }
    .nb-tzone { display: flex !important; }
    .nb-mzone { display: flex !important; }
}
@media (min-width: 1024px) {
    .nb-dzone { display: flex !important; }
    .nb-tzone { display: none !important; }
    .nb-mzone { display: none !important; }
}
.nb-dzone { display: none; align-items: center; gap: 14px; }
.nb-tzone { display: none; align-items: center; gap: 10px; flex: 1; justify-content: flex-end; }
.nb-mzone { display: none; align-items: center; gap: 8px; }
`;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useCurrentUser();

    const [search,         setSearch]         = useState("");
    const [mobileOpen,     setMobileOpen]     = useState(false);
    const [scrolled,       setScrolled]       = useState(false);
    const [searchFocused,  setSearchFocused]  = useState(false);
    const [tSearchFocused, setTSearchFocused] = useState(false);
    const [profileOpen,    setProfileOpen]    = useState(false);
    const profileRef = useRef(null);

    const cartCount     = useSelector(state => state.cart.items?.reduce((n, i) => n + i.qty, 0) || 0);
    const wishlistCount = useSelector(state => state.wishlist?.items?.length || 0);
    const isPlus        = user?.role === "plus";

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    useEffect(() => {
        const fn = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target))
                setProfileOpen(false);
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        const q = search.trim();
        if (q) {
            navigate(`/shop?search=${encodeURIComponent(q)}`);
            setSearch("");
            setMobileOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully!");
            navigate("/");
        } catch {
            toast.error("Logout failed. Try again.");
        }
    };

    const navLinks = [
        { to: "/",        label: "Home",    Icon: Home  },
        { to: "/shop",    label: "Shop",    Icon: Store },
        { to: "/about",   label: "About",   Icon: Sparkles },
        { to: "/contact", label: "Contact", Icon: Phone },
    ];

    const isActive = (to) => location.pathname === to;
    const getInit  = () => (user?.displayName || user?.email || "U").charAt(0).toUpperCase();

    return (
        <>
            <style>{CSS}</style>

            <nav className={`nb${scrolled ? " scrolled" : ""}`}>
                <div className="nb-inner">

                    {/* Logo */}
                    <Link to="/" className="nb-logo">
                        <span className="nb-logo-text">
                            <span className="nb-g">Dynamicx</span>Mart
                            <span className="nb-dot">.</span>
                        </span>
                        {isPlus && <span className="nb-badge">plus</span>}
                    </Link>

                    {/* ── Desktop Zone ── */}
                    <div className="nb-dzone">
                        <div className="nb-links">
                            {navLinks.map(({ to, label }) => (
                                <Link key={to} to={to} className={`nb-link${isActive(to) ? " active" : ""}`}>
                                    {label}
                                </Link>
                            ))}
                        </div>

                        <form onSubmit={handleSearch} className={`nb-search${searchFocused ? " focused" : ""}`}>
                            <Search size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                            <input
                                type="text" placeholder="Search products…"
                                value={search} onChange={e => setSearch(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                        </form>

                        <Link to="/wishlist" className={`nb-icon-btn wish${isActive('/wishlist') ? ' active' : ''}`} aria-label="Wishlist">
                            <Heart size={17} fill={wishlistCount > 0 ? '#ef4444' : 'none'} stroke={wishlistCount > 0 ? '#ef4444' : 'currentColor'} />
                            {wishlistCount > 0 && <span className="nb-wbadge">{wishlistCount}</span>}
                        </Link>

                        <Link to="/cart" className="nb-icon-btn" aria-label="Cart">
                            <ShoppingCart size={17} />
                            {cartCount > 0 && <span className="nb-cbadge">{cartCount > 99 ? '99+' : cartCount}</span>}
                        </Link>

                        {user ? (
                            <div className="nb-profile" ref={profileRef}>
                                <button className="nb-profile-btn" onClick={() => setProfileOpen(p => !p)}>
                                    <div className="nb-avatar">
                                        {user.photoURL ? <img src={user.photoURL} alt="" /> : getInit()}
                                    </div>
                                    <span className="nb-pname">{user.displayName?.split(" ")[0] || "Account"}</span>
                                    <ChevronDown size={13} className={`nb-chevron${profileOpen ? " open" : ""}`} />
                                </button>
                                {profileOpen && (
                                    <div className="nb-dropdown">
                                        <Link to="/orders" className="nb-ddi" onClick={() => setProfileOpen(false)}>
                                            <ShoppingCart size={14} /> My Orders
                                        </Link>
                                        <Link to="/wishlist" className="nb-ddi" onClick={() => setProfileOpen(false)}>
                                            <Heart size={14} /> My Wishlist
                                        </Link>
                                        <Link to="/address-book" className="nb-ddi" onClick={() => setProfileOpen(false)}>
                                            <MapPinIcon size={14} /> Address Book
                                        </Link>
                                        {isPlus && (
                                            <>
                                                <div className="nb-ddiv" />
                                                <Link to="/store" className="nb-ddi" onClick={() => setProfileOpen(false)}>
                                                    <Store size={14} /> My Store
                                                </Link>
                                            </>
                                        )}
                                        <div className="nb-ddiv" />
                                        <button className="nb-ddi danger" onClick={handleLogout}>
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="nb-login" onClick={() => navigate("/login")}>Login</button>
                        )}
                    </div>

                    {/* ── Tablet Zone ── */}
                    <div className="nb-tzone">
                        <form onSubmit={handleSearch} className={`nb-tsearch${tSearchFocused ? " focused" : ""}`}>
                            <Search size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
                            <input
                                type="text" placeholder="Search…"
                                value={search} onChange={e => setSearch(e.target.value)}
                                onFocus={() => setTSearchFocused(true)}
                                onBlur={() => setTSearchFocused(false)}
                            />
                        </form>
                        <Link to="/wishlist" className={`nb-icon-btn wish${isActive('/wishlist') ? ' active' : ''}`} aria-label="Wishlist">
                            <Heart size={17} fill={wishlistCount > 0 ? '#ef4444' : 'none'} stroke={wishlistCount > 0 ? '#ef4444' : 'currentColor'} />
                            {wishlistCount > 0 && <span className="nb-wbadge">{wishlistCount}</span>}
                        </Link>
                        <Link to="/cart" className="nb-icon-btn" aria-label="Cart">
                            <ShoppingCart size={17} />
                            {cartCount > 0 && <span className="nb-cbadge">{cartCount > 99 ? '99+' : cartCount}</span>}
                        </Link>
                        <button className="nb-hamburger" onClick={() => setMobileOpen(true)}>
                            <Menu size={19} />
                        </button>
                    </div>

                    {/* ── Mobile Zone ── */}
                    <div className="nb-mzone">
                        <Link to="/wishlist" className={`nb-icon-btn wish${isActive('/wishlist') ? ' active' : ''}`} aria-label="Wishlist">
                            <Heart size={18} fill={wishlistCount > 0 ? '#ef4444' : 'none'} stroke={wishlistCount > 0 ? '#ef4444' : 'currentColor'} />
                            {wishlistCount > 0 && <span className="nb-wbadge">{wishlistCount}</span>}
                        </Link>
                        <Link to="/cart" className="nb-icon-btn" aria-label="Cart">
                            <ShoppingCart size={18} />
                            {cartCount > 0 && <span className="nb-cbadge">{cartCount > 99 ? '99+' : cartCount}</span>}
                        </Link>
                        <button className="nb-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                            <Menu size={19} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Overlay */}
            <div
                className={`nb-overlay${mobileOpen ? " open" : ""}`}
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
            />

            {/* ══════════════════════════════
                DRAWER
            ══════════════════════════════ */}
            <aside className={`nb-drawer${mobileOpen ? " open" : ""}`}>

                {/* Header */}
                <div className="nb-dhead">
                    <Link to="/" className="nb-logo" onClick={() => setMobileOpen(false)}>
                        <span className="nb-logo-text" style={{ fontSize: "1.25rem" }}>
                            <span className="nb-g">Dynamicx</span>Mart
                            <span className="nb-dot" style={{ fontSize: "1.6rem" }}>.</span>
                        </span>
                        {isPlus && <span className="nb-badge" style={{ right: "-26px" }}>plus</span>}
                    </Link>
                    <button className="nb-dclose" onClick={() => setMobileOpen(false)}>
                        <X size={16} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="nb-dbody">

                    {/* Search */}
                    <form onSubmit={handleSearch} className="nb-dsearch">
                        <Search size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />
                        <input
                            type="text" placeholder="Search products…"
                            value={search} onChange={e => setSearch(e.target.value)}
                        />
                    </form>

                    {/* ── MENU ── */}
                    <p className="nb-dlabel">Menu</p>
                    {navLinks.filter(l => l.to !== "/shop").map(({ to, label, Icon }) => (
                        <Link
                            key={to} to={to}
                            className={`nb-dlink${isActive(to) ? " active" : ""}`}
                        >
                            <span className="nb-dicon"><Icon size={15} /></span>
                            {label}
                        </Link>
                    ))}

                    <div className="nb-ddivider" />

                    {/* ── SHOPPING ── */}
                    <p className="nb-dlabel">Shopping</p>

                    <Link to="/shop" className={`nb-dlink${isActive("/shop") ? " active" : ""}`}>
                        <span className="nb-dicon"><Store size={15} /></span>
                        Shop
                    </Link>

                    <Link to="/cart" className={`nb-dlink${isActive("/cart") ? " active" : ""}`}>
                        <span className="nb-dicon" style={{ position: "relative" }}>
                            <ShoppingCart size={15} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: "absolute", top: -5, right: -5,
                                    background: "#16a34a", color: "#fff",
                                    fontSize: 8, fontWeight: 700, borderRadius: 100,
                                    minWidth: 14, height: 14, padding: "0 3px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </span>
                        Cart
                        {cartCount > 0 && (
                            <span className="nb-count-chip green">
                                {cartCount} item{cartCount > 1 ? "s" : ""}
                            </span>
                        )}
                    </Link>

                    <Link to="/wishlist" className={`nb-dlink${isActive("/wishlist") ? " active" : ""}`}>
                        <span className="nb-dicon wish-icon" style={{ position: "relative" }}>
                            <Heart size={15}
                                fill={wishlistCount > 0 ? '#ef4444' : 'none'}
                                stroke={wishlistCount > 0 ? '#ef4444' : 'currentColor'}
                            />
                            {wishlistCount > 0 && (
                                <span style={{
                                    position: "absolute", top: -5, right: -5,
                                    background: "#ef4444", color: "#fff",
                                    fontSize: 8, fontWeight: 700, borderRadius: 100,
                                    minWidth: 14, height: 14, padding: "0 3px",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {wishlistCount}
                                </span>
                            )}
                        </span>
                        Wishlist
                        {wishlistCount > 0 && (
                            <span className="nb-count-chip red">
                                {wishlistCount} saved
                            </span>
                        )}
                    </Link>

                    <Link to="/orders" className={`nb-dlink${isActive("/orders") ? " active" : ""}`} onClick={() => setMobileOpen(false)}>
                        <span className="nb-dicon"><PackageIcon size={15} /></span>
                        My Orders
                    </Link>

                    <Link to="/address-book" className={`nb-dlink${isActive("/address-book") ? " active" : ""}`} onClick={() => setMobileOpen(false)}>
                        <span className="nb-dicon"><MapPinIcon size={15} /></span>
                        Address Book
                    </Link>

                    {/* ── SELLER (Plus only) ── */}
                    {isPlus && (
                        <>
                            <div className="nb-ddivider" />
                            <p className="nb-dlabel">Seller</p>
                            <Link to="/store" className={`nb-dlink${isActive("/store") ? " active" : ""}`}>
                                <span className="nb-dicon"><Store size={15} /></span>
                                My Store
                                <span className="nb-plus-badge">✦ plus</span>
                            </Link>
                        </>
                    )}
                </div>

                {/* ══ Footer — User card + Sign out ══ */}
                <div className="nb-dfooter">
                    {user ? (
                        <>
                            <div className="nb-ucard">
                                <div className="nb-uavatar">
                                    {user.photoURL
                                        ? <img src={user.photoURL} alt="" />
                                        : getInit()
                                    }
                                </div>
                                <div className="nb-uinfo">
                                    <p className="nb-uname">{user.displayName || "User"}</p>
                                    <p className="nb-uemail">{user.email}</p>
                                </div>
                            </div>
                            <button className="nb-signout" onClick={handleLogout}>
                                <LogOut size={15} /> Sign out
                            </button>
                        </>
                    ) : (
                        <button
                            className="nb-dlogin"
                            onClick={() => { navigate("/login"); setMobileOpen(false); }}
                        >
                            Login to your account
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Navbar;