import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Link, Outlet } from "react-router-dom";
import { ArrowRightIcon, ShieldOffIcon } from "lucide-react";
import StoreNavbar from "./StoreNavbar";
import StoreSidebar from "./StoreSidebar";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.sl-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f8fafc;
}
.sl-body { display: flex; flex: 1; overflow: hidden; }
.sl-content {
    flex: 1;
    overflow-y: auto;
    padding: 32px 28px 60px;
    background: #f8fafc;
}
@media (min-width: 1024px) { .sl-content { padding: 40px 44px 80px; } }
@media (max-width: 480px)  { .sl-content { padding: 20px 16px 60px; } }

.sl-unauth {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #f8fafc;
    animation: sl-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes sl-fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
}
.sl-unauth-card {
    text-align: center;
    padding: 52px 44px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 28px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.05);
    max-width: 400px;
    width: 100%;
}
.sl-unauth-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: #fef2f2;
    border: 1.5px solid #fecaca;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: #ef4444;
}
.sl-unauth-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
.sl-unauth-sub {
    font-size: 0.825rem; color: #94a3b8;
    margin: 0 0 28px; line-height: 1.65; font-weight: 400;
}
.sl-unauth-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; background: #0f172a; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 100px; cursor: pointer;
    text-decoration: none; transition: all 0.22s;
    box-shadow: 0 4px 14px rgba(15,23,42,0.18);
}
.sl-unauth-btn:hover {
    background: #1e293b; transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15,23,42,0.25);
}
`;

const StoreLayout = () => {
    const { user, loading: authLoading } = useCurrentUser();
    const [isSeller, setIsSeller]     = useState(false);
    const [loading, setLoading]       = useState(true);
    const [storeInfo, setStoreInfo]   = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        const checkSeller = async () => {
            if (!user) { setIsSeller(false); setLoading(false); return; }
            try {
                const store = await getStoreByUser(user.uid);
                if (store && store.isActive) { setStoreInfo(store); setIsSeller(true); }
                else setIsSeller(false);
            } catch { setIsSeller(false); }
            finally { setLoading(false); }
        };
        if (!authLoading) checkSeller();
    }, [user, authLoading]);

    if (loading || authLoading) return <Loading />;

    if (!isSeller) return (
        <>
            <style>{CSS}</style>
            <div className="sl-unauth">
                <div className="sl-unauth-card">
                    <div className="sl-unauth-icon"><ShieldOffIcon size={30} /></div>
                    <p className="sl-unauth-title">Access Denied</p>
                    <p className="sl-unauth-sub">
                        You don't have an active store. Create one to start selling on DynamicxMart.
                    </p>
                    <Link to="/create-store" className="sl-unauth-btn">
                        Create Store <ArrowRightIcon size={15} />
                    </Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="sl-root">
                <StoreNavbar
                    storeInfo={storeInfo}
                    onMenuToggle={() => setMobileNavOpen(o => !o)}
                />
                <div className="sl-body">
                    <StoreSidebar
                        storeInfo={storeInfo}
                        mobileOpen={mobileNavOpen}
                        onMobileClose={() => setMobileNavOpen(false)}
                    />
                    <main className="sl-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default StoreLayout;