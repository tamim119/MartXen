import { useEffect, useState } from "react";
import Loading from "../Loading";
import { Link, Outlet } from "react-router-dom";
import { ArrowRightIcon, ShieldOffIcon, PauseCircleIcon } from "lucide-react";
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

/* ── Shared full-page screen ── */
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
    max-width: 420px;
    width: 100%;
}

/* ── Access Denied (no store / expired) ── */
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

/* ── Store Paused screen ── */
.sl-paused-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: #fff7ed;
    border: 1.5px solid #fed7aa;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    color: #ea580c;
}
.sl-paused-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #fff7ed; border: 1.5px solid #fed7aa;
    color: #c2410c; border-radius: 100px;
    padding: 5px 14px; font-size: 0.72rem; font-weight: 700;
    margin-bottom: 16px;
}
.sl-paused-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #ea580c;
    animation: sl-pulse 2s ease-in-out infinite;
}
@keyframes sl-pulse {
    0%,100% { box-shadow: 0 0 4px rgba(234,88,12,0.4); }
    50%      { box-shadow: 0 0 10px rgba(234,88,12,0.7); }
}
.sl-paused-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; }
.sl-paused-sub {
    font-size: 0.825rem; color: #94a3b8;
    margin: 0 0 24px; line-height: 1.65; font-weight: 400;
}
.sl-paused-info {
    background: #fff7ed; border: 1.5px solid #fed7aa;
    border-radius: 14px; padding: 14px 18px;
    text-align: left; display: flex; flex-direction: column; gap: 10px;
}
.sl-paused-info-row {
    display: flex; align-items: flex-start; gap: 10px;
}
.sl-paused-info-dot {
    width: 18px; height: 18px; border-radius: 50%;
    background: #ffedd5; border: 1.5px solid #fed7aa;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; font-size: 0.6rem; font-weight: 800; color: #ea580c;
}
.sl-paused-info-text {
    font-size: 0.78rem; color: #9a3412; font-weight: 500; line-height: 1.5; margin: 0;
}

@media (max-width: 480px) {
    .sl-unauth-card { padding: 36px 24px; }
}
`;

const StoreLayout = () => {
    const { user, loading: authLoading } = useCurrentUser();
    const [screenState,   setScreenState]   = useState("loading");
    const [storeInfo,     setStoreInfo]     = useState(null);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        const checkSeller = async () => {
            if (!user) { setScreenState("denied"); return; }

            // ✅ Role check — শুধু "plus" role ই /store এ ঢুকতে পারবে
            // Membership expired হলে role "customer" হয়ে যায়, তাই denied দেখাবে
            if (user.role !== "plus") {
                setScreenState("denied");
                return;
            }

            try {
                const store = await getStoreByUser(user.uid);

                if (!store || store.status !== "approved") {
                    setScreenState("denied");
                } else if (store.isActive === false) {
                    setStoreInfo(store);
                    setScreenState("paused");
                } else {
                    setStoreInfo(store);
                    setScreenState("ok");
                }
            } catch {
                setScreenState("denied");
            }
        };
        if (!authLoading) checkSeller();
    }, [user, authLoading]);

    if (authLoading || screenState === "loading") return <Loading />;

    // ── Role নেই / membership expired / store নেই ──
    if (screenState === "denied") return (
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

    // ── Store pause করা হয়েছে ──
    if (screenState === "paused") return (
        <>
            <style>{CSS}</style>
            <div className="sl-unauth">
                <div className="sl-unauth-card">
                    <div className="sl-paused-icon"><PauseCircleIcon size={32} /></div>
                    <div className="sl-paused-badge">
                        <span className="sl-paused-badge-dot" />
                        Store Paused
                    </div>
                    <p className="sl-paused-title">Your store has been paused</p>
                    <p className="sl-paused-sub">
                        Admin has temporarily paused your store. Please contact admin to reactivate it.
                    </p>
                    <div className="sl-paused-info">
                        <div className="sl-paused-info-row">
                            <div className="sl-paused-info-dot">!</div>
                            <p className="sl-paused-info-text">Your products are hidden from customers</p>
                        </div>
                        <div className="sl-paused-info-row">
                            <div className="sl-paused-info-dot">!</div>
                            <p className="sl-paused-info-text">No new orders can be placed on your store</p>
                        </div>
                        <div className="sl-paused-info-row">
                            <div className="sl-paused-info-dot">!</div>
                            <p className="sl-paused-info-text">Contact admin to get your store reactivated</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    // ── Normal store layout ──
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