import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Link, Outlet } from "react-router-dom";
import { ArrowRightIcon, ShieldOffIcon } from "lucide-react";
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
    text-align: center; padding: 52px 44px; background: #fff;
    border: 1.5px solid #f1f5f9; border-radius: 28px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.05);
    max-width: 400px; width: 100%;
}
.al-unauth-icon { width: 72px; height: 72px; border-radius: 50%; background: #fef2f2; border: 1.5px solid #fecaca; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #ef4444; }
.al-unauth-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.3px; }
.al-unauth-sub { font-size: 0.825rem; color: #94a3b8; margin: 0 0 28px; line-height: 1.65; font-weight: 400; }
.al-unauth-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #0f172a; color: #fff; font-size: 0.875rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 100px; cursor: pointer; text-decoration: none; transition: all 0.22s; box-shadow: 0 4px 14px rgba(15,23,42,0.18); }
.al-unauth-btn:hover { background: #1e293b; transform: translateY(-2px); }
`;

const AdminLayout = () => {
    const { user, loading: authLoading } = useCurrentUser();
    const [isAdmin, setIsAdmin]           = useState(false);
    const [loading, setLoading]           = useState(true);
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
                    <div className="al-unauth-icon"><ShieldOffIcon size={30} /></div>
                    <p className="al-unauth-title">Access Denied</p>
                    <p className="al-unauth-sub">
                        You don't have permission to access the admin panel. Please contact your administrator.
                    </p>
                    <Link to="/" className="al-unauth-btn">
                        Go to Home <ArrowRightIcon size={15} />
                    </Link>
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