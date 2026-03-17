import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MailIcon, MapPinIcon, PhoneIcon, PackageIcon, StoreIcon } from "lucide-react";
import Loading from "../components/Loading";
import { getAllStores } from "../lib/services/storeService";
import { getProductsByStore } from "../lib/services/productService";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ss-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 70vh;
    padding: 0 24px;
    animation: ss-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes ss-fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
}
.ss-inner { max-width: 1280px; margin: 0 auto; }

/* ── Store banner ── */
.ss-banner {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 22px;
    padding: 28px 28px;
    margin-top: 28px;
    display: flex;
    align-items: center;
    gap: 24px;
    animation: ss-fadeUp 0.5s 0.06s cubic-bezier(0.4,0,0.2,1) both;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}
@media (max-width: 640px) {
    .ss-banner { flex-direction: column; align-items: flex-start; padding: 20px; gap: 16px; }
}

.ss-logo {
    width: 80px; height: 80px;
    border-radius: 18px;
    object-fit: cover;
    border: 1.5px solid #f1f5f9;
    flex-shrink: 0;
}

.ss-store-name {
    font-size: 1.4rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px;
    letter-spacing: -0.4px;
}
.ss-store-desc {
    font-size: 0.825rem;
    color: #64748b;
    line-height: 1.65;
    margin: 0 0 14px;
    max-width: 540px;
    font-weight: 400;
}

.ss-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
.ss-meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.775rem;
    color: #64748b;
    font-weight: 500;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 100px;
    padding: 4px 11px;
    transition: border-color 0.18s, color 0.18s;
}
.ss-meta-item:hover { border-color: #bbf7d0; color: #15803d; }
.ss-meta-item svg { color: #94a3b8; flex-shrink: 0; }

/* ── Products section ── */
.ss-products-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 36px 0 20px;
    animation: ss-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}
.ss-products-title {
    font-size: 1.25rem;
    font-weight: 500;
    color: #64748b;
    margin: 0;
}
.ss-products-title span { color: #0f172a; font-weight: 800; }
.ss-count {
    background: #f0fdf4;
    border: 1.5px solid #bbf7d0;
    color: #16a34a;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 100px;
}

/* ── Grid ── */
.ss-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 80px;
    animation: ss-fadeUp 0.5s 0.14s cubic-bezier(0.4,0,0.2,1) both;
}
@media (min-width: 768px)  { .ss-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; } }
@media (min-width: 1024px) { .ss-grid { grid-template-columns: repeat(5, 1fr); gap: 20px; } }
@media (min-width: 1280px) { .ss-grid { grid-template-columns: repeat(6, 1fr); gap: 22px; } }
@media (max-width: 480px)  { .ss-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

/* stagger */
.ss-grid > *:nth-child(1)  { animation: ss-fadeUp 0.4s 0.08s cubic-bezier(0.4,0,0.2,1) both; }
.ss-grid > *:nth-child(2)  { animation: ss-fadeUp 0.4s 0.12s cubic-bezier(0.4,0,0.2,1) both; }
.ss-grid > *:nth-child(3)  { animation: ss-fadeUp 0.4s 0.16s cubic-bezier(0.4,0,0.2,1) both; }
.ss-grid > *:nth-child(4)  { animation: ss-fadeUp 0.4s 0.20s cubic-bezier(0.4,0,0.2,1) both; }
.ss-grid > *:nth-child(n+5){ animation: ss-fadeUp 0.4s 0.24s cubic-bezier(0.4,0,0.2,1) both; }

/* ── Empty ── */
.ss-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 20px;
    margin-bottom: 80px;
    color: #94a3b8;
    gap: 10px;
}
.ss-empty p { font-size: 0.875rem; font-weight: 500; }

/* ── Not found ── */
.ss-notfound {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}
.ss-notfound-card {
    text-align: center;
    padding: 52px 44px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 28px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.05);
    max-width: 360px;
    width: 100%;
}
.ss-notfound-icon {
    width: 68px; height: 68px;
    border-radius: 50%;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
    color: #cbd5e1;
}
.ss-notfound-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
.ss-notfound-sub   { font-size: 0.825rem; color: #94a3b8; margin: 0; }

@media (max-width: 480px) {
    .ss-root { padding: 0 12px; }
    .ss-banner { margin-top: 20px; }
    .ss-logo { width: 60px; height: 60px; border-radius: 14px; }
    .ss-store-name { font-size: 1.15rem; }
}
`;

export default function StoreShop() {
    const { username } = useParams();
    const [products, setProducts] = useState([]);
    const [storeInfo, setStoreInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const stores = await getAllStores();
                const store = stores.find(s => s.username === username);
                if (!store) return;
                setStoreInfo(store);
                const prods = await getProductsByStore(store.id);
                setProducts(prods);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStoreData();
    }, [username]);

    if (loading) return <Loading />;

    if (!storeInfo) return (
        <>
            <style>{CSS}</style>
            <div className="ss-notfound">
                <div className="ss-notfound-card">
                    <div className="ss-notfound-icon">
                        <StoreIcon size={28} />
                    </div>
                    <p className="ss-notfound-title">Store not found</p>
                    <p className="ss-notfound-sub">This store doesn't exist or may have been removed.</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <style>{CSS}</style>
            <div className="ss-root">
                <div className="ss-inner">

                    {/* Banner */}
                    <div className="ss-banner">
                        <img
                            src={storeInfo.logo}
                            alt={storeInfo.name}
                            className="ss-logo"
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 className="ss-store-name">{storeInfo.name}</h1>
                            {storeInfo.description && (
                                <p className="ss-store-desc">{storeInfo.description}</p>
                            )}
                            <div className="ss-meta">
                                {storeInfo.address && (
                                    <span className="ss-meta-item">
                                        <MapPinIcon size={12} /> {storeInfo.address}
                                    </span>
                                )}
                                {storeInfo.email && (
                                    <span className="ss-meta-item">
                                        <MailIcon size={12} /> {storeInfo.email}
                                    </span>
                                )}
                                {storeInfo.contact && (
                                    <span className="ss-meta-item">
                                        <PhoneIcon size={12} /> {storeInfo.contact}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="ss-products-head">
                        <h2 className="ss-products-title">
                            Store <span>Products</span>
                        </h2>
                        {products.length > 0 && (
                            <span className="ss-count">
                                {products.length} product{products.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {products.length === 0 ? (
                        <div className="ss-empty">
                            <PackageIcon size={32} style={{ color: '#e2e8f0' }} />
                            <p>No products yet.</p>
                        </div>
                    ) : (
                        <div className="ss-grid">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}