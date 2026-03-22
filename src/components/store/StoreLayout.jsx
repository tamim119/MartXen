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
}
.sl-unauth-card {
    text-align: center;
    padding: 52px 44px;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.06);
    max-width: 420px;
    width: 100%;
}

/* ── Access Denied ── */
.sl-unauth-icon {
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
.sl-unauth-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    border-radius: 100px;
    padding: 4px 14px;
    margin-bottom: 16px;
}
.sl-unauth-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #16a34a;
    animation: sl-pulse-green 2s ease-in-out infinite;
}
@keyframes sl-pulse-green {
    0%,100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.3); }
    50%      { box-shadow: 0 0 0 5px rgba(22,163,74,0); }
}
.sl-unauth-badge-text {
    font-size: 0.68rem;
    font-weight: 700;
    color: #16a34a;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.sl-unauth-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px;
    letter-spacing: -0.4px;
}
.sl-unauth-sub {
    font-size: 0.825rem;
    color: #94a3b8;
    margin: 0 0 32px;
    line-height: 1.7;
    font-weight: 400;
}

/* Buttons */
.sl-unauth-btn-primary {
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
    width: 100%;
    box-sizing: border-box;
}
.sl-unauth-btn-primary:hover {
    background: #15803d;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(22,163,74,0.25);
}

/* ── Store Paused ── */
.sl-paused-icon {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: #fff7ed;
    border: 1.5px solid #fed7aa;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: #ea580c;
}

.sl-paused-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff7ed;
    border: 1.5px solid #fed7aa;
    border-radius: 100px;
    padding: 4px 14px;
    margin-bottom: 16px;
}
.sl-paused-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ea580c;
    animation: sl-pulse-orange 2s ease-in-out infinite;
}
@keyframes sl-pulse-orange {
    0%,100% { box-shadow: 0 0 0 0 rgba(234,88,12,0.3); }
    50%      { box-shadow: 0 0 0 5px rgba(234,88,12,0); }
}
.sl-paused-badge-text {
    font-size: 0.68rem;
    font-weight: 700;
    color: #ea580c;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.sl-paused-title {
    font-size: 1.3rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 10px;
    letter-spacing: -0.4px;
}
.sl-paused-sub {
    font-size: 0.825rem;
    color: #94a3b8;
    margin: 0 0 28px;
    line-height: 1.7;
    font-weight: 400;
}

.sl-paused-info {
    background: #fff7ed;
    border: 1.5px solid #fed7aa;
    border-radius: 16px;
    padding: 16px 18px;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.sl-paused-info-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
}
.sl-paused-info-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffedd5;
    border: 1.5px solid #fed7aa;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 0.6rem;
    font-weight: 800;
    color: #ea580c;
}
.sl-paused-info-text {
    font-size: 0.78rem;
    color: #9a3412;
    font-weight: 500;
    line-height: 1.55;
    margin: 0;
    padding-top: 2px;
}

@media (max-width: 480px) {
    .sl-unauth-card { padding: 40px 24px; }
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

    // ── Access Denied ──
    if (screenState === "denied") return (
        <>
            <style>{CSS}</style>
            <div className="sl-unauth">
                <div className="sl-unauth-card">

                    {/* Lock icon */}
                    <div className="sl-unauth-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                            <line x1="12" y1="15" x2="12" y2="17"/>
                        </svg>
                    </div>

                    {/* Badge */}
                    <div className="sl-unauth-badge">
                        <span className="sl-unauth-badge-dot" />
                        <span className="sl-unauth-badge-text">Store Panel</span>
                    </div>

                    <p className="sl-unauth-title">Access Denied</p>
                    <p className="sl-unauth-sub">
                        You don't have an active store. Create one to start selling on DynamicxMart.
                    </p>

                    <Link to="/create-store" className="sl-unauth-btn-primary">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Create Store
                    </Link>

                </div>
            </div>
        </>
    );

    // ── Store Paused ──
    if (screenState === "paused") return (
        <>
            <style>{CSS}</style>
            <div className="sl-unauth">
                <div className="sl-unauth-card">

                    {/* Pause icon */}
                    <div className="sl-paused-icon">
                        <PauseCircleIcon size={32} />
                    </div>

                    {/* Badge */}
                    <div className="sl-paused-badge">
                        <span className="sl-paused-badge-dot" />
                        <span className="sl-paused-badge-text">Store Paused</span>
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