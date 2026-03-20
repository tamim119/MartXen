import ProductCard from "../components/ProductCard";
import { MoveLeftIcon, SearchXIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";

const PRODUCTS_PER_PAGE = 20;
const PRICE_MIN = 0;
const PRICE_MAX = 10000;

const CATEGORIES = [
    "Electronics", "Gadgets", "Clothing", "Home & Kitchen", "Beauty & Health",
    "Toys & Games", "Sports & Outdoors", "Books & Media",
    "Food & Drink", "Hobbies & Crafts", "Others"
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.shop-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 70vh;
    padding: 0 24px;
    animation: shop-fadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes shop-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
.shop-inner { max-width: 1280px; margin: 0 auto; }

.shop-header {
    display: flex; align-items: center; gap: 10px;
    margin: 32px 0 24px;
    animation: shop-fadeUp 0.5s 0.05s cubic-bezier(0.4,0,0.2,1) both;
    flex-wrap: wrap;
}
.shop-back-btn {
    display: flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 50%;
    background: #f1f5f9; border: 1.5px solid #e2e8f0;
    cursor: pointer; transition: background 0.18s, border-color 0.18s, transform 0.18s;
    flex-shrink: 0; color: #475569;
}
.shop-back-btn:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; transform: translateX(-2px); }
.shop-title {
    font-size: 1.5rem; font-weight: 500; color: #94a3b8; margin: 0;
    cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: color 0.18s; user-select: none;
}
.shop-title:hover { color: #64748b; }
.shop-title span { color: #0f172a; font-weight: 800; }
.shop-search-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 100px; padding: 4px 12px 4px 10px;
    font-size: 0.775rem; font-weight: 600; color: #16a34a;
    margin-left: 4px; animation: shop-badgeIn 0.3s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes shop-badgeIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
.shop-search-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; flex-shrink: 0; }
.shop-count {
    margin-left: auto; font-size: 0.775rem; font-weight: 600; color: #94a3b8;
    background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 100px;
    padding: 4px 12px; white-space: nowrap;
}

.shop-filter-toggle {
    display: none; align-items: center; gap: 6px;
    padding: 7px 16px; background: #f8fafc;
    border: 1.5px solid #e2e8f0; border-radius: 100px;
    font-size: 0.8rem; font-weight: 700; color: #475569;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; transition: all 0.18s; margin-bottom: 14px;
}
.shop-filter-toggle:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.shop-filter-toggle.active { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }

.shop-body { display: flex; gap: 24px; align-items: flex-start; }

.shop-sidebar {
    width: 240px; flex-shrink: 0; background: #fff;
    border: 1.5px solid #f1f5f9; border-radius: 20px;
    padding: 22px 20px; position: sticky; top: 90px;
    animation: shop-fadeUp 0.5s 0.08s cubic-bezier(0.4,0,0.2,1) both;
}
.shop-sidebar-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin: 0 0 18px; letter-spacing: -0.2px; }

.shop-filter-section { margin-bottom: 22px; }
.shop-filter-section:last-child { margin-bottom: 0; }
.shop-filter-label {
    font-size: 0.72rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.5px;
    margin-bottom: 12px; display: block;
}

.shop-check-row { display: flex; align-items: center; gap: 9px; margin-bottom: 9px; cursor: pointer; }
.shop-check-row:last-child { margin-bottom: 0; }
.shop-check-row input[type="checkbox"] { display: none; }
.shop-check-box {
    width: 17px; height: 17px; border-radius: 5px;
    border: 1.5px solid #e2e8f0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.16s;
}
.shop-check-row input:checked + .shop-check-box { background: #16a34a; border-color: #16a34a; }
.shop-check-box svg { display: none; }
.shop-check-row input:checked + .shop-check-box svg { display: block; }
.shop-check-text { font-size: 0.82rem; font-weight: 500; color: #475569; transition: color 0.16s; }
.shop-check-row:hover .shop-check-text { color: #0f172a; }
.shop-check-row input:checked ~ .shop-check-text { color: #16a34a; font-weight: 600; }

.shop-slider-wrap { position: relative; height: 28px; margin-bottom: 10px; }
.shop-slider-track { position: absolute; top: 50%; left: 0; right: 0; height: 4px; background: #e2e8f0; border-radius: 2px; transform: translateY(-50%); }
.shop-slider-fill { position: absolute; height: 4px; background: #16a34a; border-radius: 2px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.shop-slider-input {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 100%; height: 4px; background: transparent;
    -webkit-appearance: none; appearance: none;
    pointer-events: none; outline: none; border: none; margin: 0; padding: 0;
}
.shop-slider-input::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 18px; height: 18px; border-radius: 50%;
    background: #1e3a8a; border: 2.5px solid #fff;
    box-shadow: 0 1px 6px rgba(30,58,138,0.35);
    cursor: pointer; pointer-events: all; transition: transform 0.15s, box-shadow 0.15s;
}
.shop-slider-input::-webkit-slider-thumb:hover { transform: scale(1.18); box-shadow: 0 2px 10px rgba(30,58,138,0.45); }
.shop-slider-input::-moz-range-thumb {
    width: 18px; height: 18px; border-radius: 50%;
    background: #1e3a8a; border: 2.5px solid #fff;
    box-shadow: 0 1px 6px rgba(30,58,138,0.35);
    cursor: pointer; pointer-events: all;
}
.shop-price-labels { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.shop-price-label-val { font-size: 0.78rem; font-weight: 700; color: #475569; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 8px; padding: 3px 9px; }
.shop-price-label-sep { font-size: 0.72rem; color: #94a3b8; font-weight: 600; }
.shop-price-apply {
    width: 100%; padding: 8px 0;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 10px; font-size: 0.8rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; color: #16a34a;
    cursor: pointer; transition: all 0.18s;
}
.shop-price-apply:hover { background: #16a34a; color: #fff; border-color: #16a34a; }

.shop-cat-list { display: flex; flex-direction: column; gap: 2px; }
.shop-cat-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 10px; border-radius: 10px; cursor: pointer; transition: all 0.16s;
    font-size: 0.82rem; font-weight: 500; color: #475569; border: 1.5px solid transparent;
}
.shop-cat-item:hover { background: #f8fafc; color: #0f172a; }
.shop-cat-item.active { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; font-weight: 700; }
.shop-cat-count { font-size: 0.7rem; font-weight: 700; color: #94a3b8; background: #f8fafc; border-radius: 100px; padding: 1px 7px; border: 1.5px solid #f1f5f9; }
.shop-cat-item.active .shop-cat-count { background: #dcfce7; border-color: #bbf7d0; color: #16a34a; }

.shop-clear-btn {
    width: 100%; margin-top: 18px; padding: 9px 0;
    background: #fff; border: 1.5px solid #f1f5f9;
    border-radius: 10px; font-size: 0.8rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; color: #94a3b8;
    cursor: pointer; transition: all 0.18s;
}
.shop-clear-btn:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

.shop-main { flex: 1; min-width: 0; }

.shop-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
.shop-chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 100px; padding: 4px 10px 4px 12px;
    font-size: 0.75rem; font-weight: 600; color: #16a34a;
}
.shop-chip-x {
    display: flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; border-radius: 50%;
    background: #dcfce7; cursor: pointer; transition: background 0.15s;
    border: none; padding: 0; color: #16a34a;
}
.shop-chip-x:hover { background: #bbf7d0; }

.shop-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 14px; margin-bottom: 32px;
    animation: shop-fadeUp 0.55s 0.12s cubic-bezier(0.4,0,0.2,1) both;
}
@media (min-width: 768px)  { .shop-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
@media (min-width: 1024px) { .shop-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
@media (min-width: 1280px) { .shop-grid { grid-template-columns: repeat(4, 1fr); gap: 22px; } }
.shop-grid > *:nth-child(1)  { animation: shop-fadeUp 0.45s 0.08s cubic-bezier(0.4,0,0.2,1) both; }
.shop-grid > *:nth-child(2)  { animation: shop-fadeUp 0.45s 0.12s cubic-bezier(0.4,0,0.2,1) both; }
.shop-grid > *:nth-child(3)  { animation: shop-fadeUp 0.45s 0.16s cubic-bezier(0.4,0,0.2,1) both; }
.shop-grid > *:nth-child(4)  { animation: shop-fadeUp 0.45s 0.20s cubic-bezier(0.4,0,0.2,1) both; }
.shop-grid > *:nth-child(5)  { animation: shop-fadeUp 0.45s 0.24s cubic-bezier(0.4,0,0.2,1) both; }
.shop-grid > *:nth-child(6)  { animation: shop-fadeUp 0.45s 0.28s cubic-bezier(0.4,0,0.2,1) both; }
.shop-grid > *:nth-child(n+7){ animation: shop-fadeUp 0.45s 0.32s cubic-bezier(0.4,0,0.2,1) both; }

.shop-pagination { display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 60px; flex-wrap: wrap; }
.shop-page-btn {
    display: flex; align-items: center; justify-content: center;
    min-width: 36px; height: 36px; border-radius: 10px; padding: 0 6px;
    border: 1.5px solid #f1f5f9; background: #fff;
    font-size: 0.82rem; font-weight: 600; color: #64748b;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.16s;
}
.shop-page-btn:hover:not(:disabled) { border-color: #bbf7d0; background: #f0fdf4; color: #16a34a; }
.shop-page-btn.active { background: #16a34a; border-color: #16a34a; color: #fff; font-weight: 700; }
.shop-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.shop-page-dots { font-size: 0.82rem; color: #94a3b8; font-weight: 600; padding: 0 2px; letter-spacing: 1px; }

.shop-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 360px; animation: shop-fadeUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both; }
.shop-empty-card { text-align: center; padding: 48px 40px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 28px; box-shadow: 0 8px 32px rgba(0,0,0,0.05); max-width: 340px; width: 100%; }
.shop-empty-icon { width: 68px; height: 68px; border-radius: 50%; background: #f8fafc; border: 1.5px solid #e2e8f0; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; color: #94a3b8; }
.shop-empty-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 6px; }
.shop-empty-sub { font-size: 0.825rem; color: #94a3b8; margin: 0 0 22px; font-weight: 400; line-height: 1.6; }
.shop-empty-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 24px; background: #16a34a; color: #fff; font-size: 0.835rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 100px; cursor: pointer; transition: all 0.22s; box-shadow: 0 4px 14px rgba(22,163,74,0.3); }
.shop-empty-btn:hover { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(22,163,74,0.38); }
.shop-empty-btn:active { transform: scale(0.97); }

@media (max-width: 768px) {
    .shop-filter-toggle { display: inline-flex; }
    .shop-body { flex-direction: column; gap: 0; }
    .shop-sidebar { width: 100%; position: static; border-radius: 16px; margin-bottom: 16px; padding: 18px 16px; display: none; }
    .shop-sidebar.open { display: block; }
    .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
}
@media (max-width: 480px) {
    .shop-root { padding: 0 12px; }
    .shop-header { margin: 20px 0 16px; }
    .shop-title { font-size: 1.2rem; }
    .shop-count { display: none; }
    .shop-page-btn { min-width: 32px; height: 32px; font-size: 0.75rem; }
}
`;

const Check = () => (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function buildPages(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [];
    pages.push(1);
    if (current > 4) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 3) pages.push('...');
    pages.push(total);
    return pages;
}

export default function Shop() {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search");
    const navigate = useNavigate();
    const products = useSelector(state => state.product.items);

    const [selectedCat, setSelectedCat]   = useState('');
    const [stockFilter, setStockFilter]   = useState({ inStock: false, outOfStock: false });
    const [priceMin, setPriceMin]         = useState(PRICE_MIN);
    const [priceMax, setPriceMax]         = useState(PRICE_MAX);
    const [appliedPrice, setAppliedPrice] = useState({ min: PRICE_MIN, max: PRICE_MAX });
    const [currentPage, setCurrentPage]   = useState(1);
    const [sidebarOpen, setSidebarOpen]   = useState(false);

    useEffect(() => { setCurrentPage(1); }, [selectedCat, stockFilter, appliedPrice, search]);

    const catCounts = useMemo(() => {
        const map = {};
        products.forEach(p => { if (p.category) map[p.category] = (map[p.category] || 0) + 1; });
        return map;
    }, [products]);

    const filtered = useMemo(() => {
        return products.filter(p => {
            if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
            if (selectedCat && p.category !== selectedCat) return false;
            if (stockFilter.inStock && !stockFilter.outOfStock && !p.inStock) return false;
            if (stockFilter.outOfStock && !stockFilter.inStock && p.inStock) return false;
            const price = p.price || 0;
            if (price < appliedPrice.min || price > appliedPrice.max) return false;
            return true;
        });
    }, [products, search, selectedCat, stockFilter, appliedPrice]);

    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
    const paginated  = filtered.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
    const pages      = buildPages(currentPage, totalPages);

    const chips = [];
    if (selectedCat)            chips.push({ label: selectedCat,     onRemove: () => setSelectedCat('') });
    if (stockFilter.inStock)    chips.push({ label: 'In Stock',       onRemove: () => setStockFilter(s => ({ ...s, inStock: false })) });
    if (stockFilter.outOfStock) chips.push({ label: 'Out of Stock',   onRemove: () => setStockFilter(s => ({ ...s, outOfStock: false })) });
    if (appliedPrice.min !== PRICE_MIN || appliedPrice.max !== PRICE_MAX) {
        chips.push({
            label: `৳${Number(appliedPrice.min).toLocaleString()} – ৳${Number(appliedPrice.max).toLocaleString()}`,
            onRemove: () => { setAppliedPrice({ min: PRICE_MIN, max: PRICE_MAX }); setPriceMin(PRICE_MIN); setPriceMax(PRICE_MAX); }
        });
    }

    const clearAll = () => {
        setSelectedCat(''); setStockFilter({ inStock: false, outOfStock: false });
        setAppliedPrice({ min: PRICE_MIN, max: PRICE_MAX }); setPriceMin(PRICE_MIN); setPriceMax(PRICE_MAX);
    };
    const hasFilters = chips.length > 0;

    return (
        <>
            <style>{CSS}</style>
            <div className="shop-root">
                <div className="shop-inner">

                    {/* Header */}
                    <div className="shop-header">
                        {search && (
                            <button className="shop-back-btn" onClick={() => navigate("/shop")}>
                                <MoveLeftIcon size={16} />
                            </button>
                        )}
                        <h1 className="shop-title" onClick={() => navigate("/shop")}>
                            All <span>Products</span>
                        </h1>
                        {search && (
                            <div className="shop-search-badge">
                                <span className="shop-search-badge-dot" />
                                {search}
                            </div>
                        )}
                        {filtered.length > 0 && (
                            <span className="shop-count">
                                {filtered.length} item{filtered.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {/* Mobile filter toggle */}
                    <button
                        className={`shop-filter-toggle ${sidebarOpen ? 'active' : ''}`}
                        onClick={() => setSidebarOpen(o => !o)}
                    >
                        <SlidersHorizontalIcon size={14} />
                        Filters
                        {hasFilters && (
                            <span style={{ background: '#16a34a', color: '#fff', borderRadius: '100px', padding: '1px 7px', fontSize: '0.68rem', fontWeight: 700 }}>
                                {chips.length}
                            </span>
                        )}
                    </button>

                    <div className="shop-body">

                        {/* Sidebar */}
                        <aside className={`shop-sidebar ${sidebarOpen ? 'open' : ''}`}>
                            <p className="shop-sidebar-title">Product Filters</p>

                            {/* Stock */}
                            <div className="shop-filter-section">
                                <span className="shop-filter-label">Stock Status</span>
                                {[{ key: 'inStock', label: 'In Stock' }, { key: 'outOfStock', label: 'Out of Stock' }].map(({ key, label }) => (
                                    <label key={key} className="shop-check-row">
                                        <input type="checkbox" checked={stockFilter[key]} onChange={() => setStockFilter(s => ({ ...s, [key]: !s[key] }))} />
                                        <span className="shop-check-box"><Check /></span>
                                        <span className="shop-check-text">{label}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Price */}
                            <div className="shop-filter-section">
                                <span className="shop-filter-label">Price Range</span>
                                <div className="shop-slider-wrap">
                                    <div className="shop-slider-track" />
                                    <div className="shop-slider-fill" style={{
                                        left: `${((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                                        right: `${100 - ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                                    }} />
                                    <input type="range" className="shop-slider-input" min={PRICE_MIN} max={PRICE_MAX} step={100} value={priceMin}
                                        onChange={e => setPriceMin(Math.min(Number(e.target.value), priceMax - 100))} />
                                    <input type="range" className="shop-slider-input" min={PRICE_MIN} max={PRICE_MAX} step={100} value={priceMax}
                                        onChange={e => setPriceMax(Math.max(Number(e.target.value), priceMin + 100))} />
                                </div>
                                <div className="shop-price-labels">
                                    <span className="shop-price-label-val">৳{priceMin.toLocaleString()}</span>
                                    <span className="shop-price-label-sep">—</span>
                                    <span className="shop-price-label-val">৳{priceMax.toLocaleString()}</span>
                                </div>
                                <button className="shop-price-apply" onClick={() => setAppliedPrice({ min: priceMin, max: priceMax })}>Apply</button>
                            </div>

                            {/* ✅ Gadgets যোগ করা হয়েছে */}
                            <div className="shop-filter-section">
                                <span className="shop-filter-label">Category</span>
                                <div className="shop-cat-list">
                                    {CATEGORIES.map(cat => (
                                        <div key={cat} className={`shop-cat-item ${selectedCat === cat ? 'active' : ''}`}
                                            onClick={() => setSelectedCat(selectedCat === cat ? '' : cat)}>
                                            <span>{cat}</span>
                                            {catCounts[cat] > 0 && <span className="shop-cat-count">{catCounts[cat]}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {hasFilters && <button className="shop-clear-btn" onClick={clearAll}>Clear all filters</button>}
                        </aside>

                        {/* Main */}
                        <div className="shop-main">

                            {chips.length > 0 && (
                                <div className="shop-chips">
                                    {chips.map((chip, i) => (
                                        <span key={i} className="shop-chip">
                                            {chip.label}
                                            <button className="shop-chip-x" onClick={chip.onRemove}><XIcon size={9} /></button>
                                        </span>
                                    ))}
                                </div>
                            )}

                            {paginated.length > 0 && (
                                <div className="shop-grid">
                                    {paginated.map(product => <ProductCard key={product.id} product={product} />)}
                                </div>
                            )}

                            {filtered.length === 0 && (
                                <div className="shop-empty">
                                    <div className="shop-empty-card">
                                        <div className="shop-empty-icon"><SearchXIcon size={28} /></div>
                                        <p className="shop-empty-title">
                                            {search || hasFilters ? 'No results found' : 'No products yet'}
                                        </p>
                                        <p className="shop-empty-sub">
                                            {search ? `We couldn't find anything for "${search}".` : hasFilters ? 'Try adjusting your filters.' : 'Check back soon — new products are on the way.'}
                                        </p>
                                        {(search || hasFilters) && (
                                            <button className="shop-empty-btn" onClick={() => { navigate("/shop"); clearAll(); }}>← Clear all</button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="shop-pagination">
                                    <button className="shop-page-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
                                    {pages.map((p, i) =>
                                        p === '...'
                                            ? <span key={`d${i}`} className="shop-page-dots">···</span>
                                            : <button key={p} className={`shop-page-btn ${currentPage === p ? 'active' : ''}`}
                                                onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                                {p}
                                              </button>
                                    )}
                                    <button className="shop-page-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}