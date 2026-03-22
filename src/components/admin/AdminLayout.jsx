import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Link, Outlet } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useCurrentUser } from "../../hooks/useAuth";
import { getUser } from "../../lib/services/userService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.al-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f8fafc;
}
.al-body { display: flex; flex: 1; overflow: hidden; }
.al-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px 28px 60px;
    background: #f8fafc;
}
@media (min-width: 1024px) { .al-content { padding: 40px 44px 80px; } }
@media (max-width: 480px)  { .al-content { padding: 20px 16px 60px; } }

/* ── Access Denied ── */
.al-unauth {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #f8fafc;
}

.al-unauth-card {
    text-align: center;
    padding: 52px 44px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.06);
    max-width: 420px;
    width: 100%;
}

/* Lock icon */
.al-unauth-icon {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: #dcfce7;
    border: 1.5px solid #bbf7d0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: #16a34a;
}

/* Green pill badge */
.al-unauth-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 100px;
    padding: 4px 14px;
    margin-bottom: 16px;
}
.al-unauth-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #16a34a;
    animation: al-pulse 2s ease-in-out infinite;
}
@keyframes al-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.3); }
    50%      { box-shadow: 0 0 0 5px rgba(22,163,74,0); }
}
.al-unauth-badge-text {
    font-size: 0.68rem;
    font-weight: 700;
    color: #16a34a;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.al-unauth-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px;
    letter-spacing: -0.4px;
}
.al-unauth-sub {
    font-size: 0.825rem;
    color: #94a3b8;
    margin: 0 0 32px;
    line-height: 1.7;
    font-weight: 400;
}

/* Buttons */
.al-unauth-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.al-unauth-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 28px;
    background: #16a34a;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none;
    border-radius: 100px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.22s;
}
.al-unauth-btn-primary:hover {
    background: #15803d;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(22,163,74,0.25);
}

@media (max-width: 480px) {
    .al-unauth-card { padding: 40px 24px; }
}
`;

const AdminLayout = () => {
    const { user, loading: authLoading } = useCurrentUser();
    const [isAdmin, setIsAdmin]             = useState(false);
    const [loading, setLoading]             = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) { setIsAdmin(false); setLoading(false); return; }
            try {
                const userData = await getUser(user.uid);
                setIsAdmin(userData?.role === 'admin');
            } catch { setIsAdmin(false); }
            finally { setLoading(false); }
        };
        if (!authLoading) checkAdmin();
    }, [user, authLoading]);

    if (loading || authLoading) return <Loading />;

    if (!isAdmin) return (
        <>
            <style>{CSS}</style>
            <div className="al-unauth">
                <div className="al-unauth-card">

                    {/* Lock icon */}
                    <div className="al-unauth-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                            <line x1="12" y1="15" x2="12" y2="17"/>
                        </svg>
                    </div>

                    {/* Green badge */}
                    <div className="al-unauth-badge">
                        <span className="al-unauth-badge-dot" />
                        <span className="al-unauth-badge-text">Admin Panel</span>
                    </div>

                    <p className="al-unauth-title">Access Denied</p>
                    <p className="al-unauth-sub">
                        You don't have permission to access the admin panel.
                        Please contact your administrator if you think this is a mistake.
                    </p>

                    <div className="al-unauth-actions">
                        <Link to="/" className="al-unauth-btn-primary">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                            Go to Home
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="al-root">
                <AdminNavbar onMenuToggle={() => setMobileNavOpen(o => !o)} />
                <div className="al-body">
                    <AdminSidebar
                        mobileOpen={mobileNavOpen}
                        onMobileClose={() => setMobileNavOpen(false)}
                    />
                    <main className="al-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;