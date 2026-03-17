import { useEffect, useState } from "react";
import { useFloatingToast } from "../../components/FloatingToastProvider";
import Loading from "../../components/Loading";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { getProductsByStore } from "../../lib/services/productService";
import { db } from "../../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { PackageIcon, Trash2Icon, PencilIcon, XIcon, CheckIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.mp-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: mp-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes mp-fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.mp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
.mp-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0; }
.mp-title span { color: #0f172a; font-weight: 800; }
.mp-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

/* ── Desktop Table ── */
.mp-table-wrap { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; }
.mp-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; table-layout: fixed; }
.mp-table thead tr th { padding: 12px 16px; font-size: 0.68rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; background: #f8fafc; border-bottom: 1.5px solid #f1f5f9; }
.mp-table tbody tr { border-bottom: 1.5px solid #f8fafc; transition: background 0.15s; }
.mp-table tbody tr:last-child { border-bottom: none; }
.mp-table tbody tr:hover { background: #f8fafc; }
.mp-table td { padding: 13px 16px; color: #475569; font-weight: 500; vertical-align: middle; }

.mp-product-cell { display: flex; align-items: center; gap: 12px; }
.mp-img-wrap { width: 48px; height: 48px; border-radius: 12px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.mp-img-wrap img { width: 38px; height: 38px; object-fit: contain; mix-blend-mode: multiply; }
.mp-product-name { font-size: 0.82rem; font-weight: 600; color: #0f172a; line-height: 1.35; }
.mp-desc-text { font-size: 0.78rem; color: #94a3b8; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; }
.mp-price { font-weight: 700; color: #0f172a; white-space: nowrap; }
.mp-mrp   { color: #94a3b8; text-decoration: line-through; font-size: 0.75rem; }

/* toggle */
.mp-toggle-track { position: relative; width: 40px; height: 22px; background: #e2e8f0; border-radius: 11px; cursor: pointer; transition: background 0.2s; display: inline-block; }
.mp-toggle-track:has(input:checked) { background: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
.mp-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.mp-toggle-thumb { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 0.2s; pointer-events: none; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
.mp-toggle-track:has(input:checked) .mp-toggle-thumb { transform: translateX(18px); }

/* action buttons */
.mp-actions { display: flex; align-items: center; gap: 6px; }
.mp-btn { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #f1f5f9; background: #f8fafc; cursor: pointer; transition: all 0.18s; flex-shrink: 0; color: #64748b; }
.mp-btn.edit:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.mp-btn.del:hover  { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

/* ── Mobile Cards ── */
.mp-mobile-list { display: none; flex-direction: column; gap: 12px; }
.mp-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; transition: border-color 0.2s; }
.mp-card:hover { border-color: #e2e8f0; }
.mp-card-top { display: flex; align-items: center; gap: 12px; padding: 14px 14px 0; }
.mp-card-img { width: 56px; height: 56px; border-radius: 14px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.mp-card-img img { width: 42px; height: 42px; object-fit: contain; mix-blend-mode: multiply; }
.mp-card-info { flex: 1; min-width: 0; }
.mp-card-name { font-size: 0.875rem; font-weight: 700; color: #0f172a; line-height: 1.3; margin-bottom: 4px; }
.mp-card-prices { display: flex; align-items: center; gap: 8px; }
.mp-card-price { font-size: 0.875rem; font-weight: 800; color: #16a34a; }
.mp-card-mrp   { font-size: 0.75rem; color: #cbd5e1; text-decoration: line-through; }
.mp-card-desc  { font-size: 0.78rem; color: #94a3b8; line-height: 1.55; margin: 10px 14px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.mp-card-stock-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-top: 1.5px solid #f8fafc; margin-top: 12px; }
.mp-card-stock-label { font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
.mp-card-action-row { display: flex; gap: 6px; }

/* ── Edit Modal ── */
.mp-modal-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15,23,42,0.55); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: mp-fadeIn 0.2s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes mp-fadeIn { from { opacity:0; } to { opacity:1; } }

.mp-modal {
    background: #fff; border-radius: 24px;
    width: 100%; max-width: 460px;
    max-height: 90vh; overflow-y: auto;
    padding: 28px 24px 24px;
    animation: mp-modalIn 0.3s cubic-bezier(0.34,1.1,0.64,1) both;
    box-shadow: 0 32px 80px rgba(0,0,0,0.2);
}
@keyframes mp-modalIn { from { transform:scale(0.94) translateY(10px); opacity:0; } to { transform:scale(1) translateY(0); opacity:1; } }

.mp-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.mp-modal-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0; }
.mp-modal-close { width: 30px; height: 30px; border-radius: 50%; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.18s; }
.mp-modal-close:hover { background: #fef2f2; border-color: #fecaca; color: #ef4444; }

.mp-modal-product { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 14px; margin-bottom: 22px; }
.mp-modal-product-img { width: 48px; height: 48px; border-radius: 12px; background: #fff; display: flex; align-items: center; justify-content: center; border: 1.5px solid #f1f5f9; flex-shrink: 0; overflow: hidden; }
.mp-modal-product-img img { width: 36px; height: 36px; object-fit: contain; mix-blend-mode: multiply; }
.mp-modal-product-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; line-height: 1.35; }

.mp-field { margin-bottom: 14px; }
.mp-field-label { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; display: block; }
.mp-field-input {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500; color: #0f172a; background: #fff; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
.mp-field-input:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.mp-field-textarea {
    width: 100%; padding: 11px 14px; min-height: 110px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500; color: #0f172a; background: #fff; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
    resize: vertical; line-height: 1.6;
}
.mp-field-textarea:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.mp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.mp-modal-save {
    width: 100%; padding: 13px; background: #16a34a; color: #fff;
    font-size: 0.84rem; font-weight: 700; letter-spacing: 0.06em;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.22s; margin-top: 8px;
    box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}
.mp-modal-save:hover { background: #15803d; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(22,163,74,0.35); }

/* ── Delete Confirm ── */
.mp-del-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(15,23,42,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: mp-fadeIn 0.2s cubic-bezier(0.4,0,0.2,1) both; }
.mp-del-modal { background: #fff; border-radius: 22px; max-width: 320px; width: 100%; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.2); animation: mp-scaleIn 0.28s cubic-bezier(0.34,1.3,0.64,1) both; }
@keyframes mp-scaleIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
.mp-del-strip { height: 4px; background: linear-gradient(90deg,#dc2626,#ef4444,#fca5a5); }
.mp-del-body  { padding: 24px 22px 20px; }
.mp-del-icon  { width: 52px; height: 52px; border-radius: 50%; background: #fef2f2; border: 1.5px solid #fecaca; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: #ef4444; }
.mp-del-title { font-size: 1rem; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 6px; }
.mp-del-sub   { font-size: 0.8rem; color: #94a3b8; text-align: center; margin: 0 0 20px; line-height: 1.6; }
.mp-del-btns  { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mp-del-cancel  { padding: 11px; border-radius: 12px; border: 1.5px solid #e2e8f0; color: #64748b; background: #fff; font-size: 0.78rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; }
.mp-del-cancel:hover { border-color: #94a3b8; }
.mp-del-confirm { padding: 11px; border-radius: 12px; border: none; background: #ef4444; color: #fff; font-size: 0.78rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; }
.mp-del-confirm:hover { background: #dc2626; }

.mp-empty { text-align: center; padding: 48px 20px; color: #94a3b8; font-size: 0.85rem; }

@media (max-width: 768px) {
    .mp-table-wrap { display: none; }
    .mp-mobile-list { display: flex; }
    .mp-title { font-size: 1.25rem; }
    .mp-modal { border-radius: 24px 24px 0 0; max-width: 100%; padding: 20px 18px 36px; }
    .mp-modal-overlay { align-items: flex-end; padding: 0; }
    .mp-field-row { grid-template-columns: 1fr; }
    @keyframes mp-modalIn { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
}
`;

const stripHtml = (str) => str?.replace(/<[^>]+>/g, '') || "";

export default function StoreManageProducts() {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "৳";
    const { user } = useCurrentUser();
    const { showToast } = useFloatingToast();
    
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ price: "", mrp: "", description: "" });
    const [delTarget, setDelTarget] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                showToast("Please login to manage products", "warning");
                return;
            }

            try {
                const store = await getStoreByUser(user.uid);
                
                if (!store) {
                    setLoading(false);
                    showToast("No store found. Please create a store first", "warning");
                    return;
                }

                const productList = await getProductsByStore(store.id);
                setProducts(productList);

            } catch (err) {
                console.error("Error fetching products:", err);
                showToast("Failed to load products. Please try again", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, showToast]);

    const toggleStock = async (product) => {
        const newValue = !product.inStock;
        
        try {
            await updateDoc(doc(db, "products", product.id), { inStock: newValue });
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newValue } : p));
            showToast(
                newValue ? "Product is now in stock" : "Product marked as out of stock",
                "success"
            );
        } catch (err) {
            console.error("Error updating stock:", err);
            showToast("Failed to update stock status", "error");
        }
    };

    const openEdit = (product) => {
        setEditTarget(product);
        setEditForm({
            price: String(product.price || ""),
            mrp: String(product.mrp || ""),
            description: stripHtml(product.description),
        });
    };

    const saveEdit = async () => {
        if (!editTarget) return;

        const price = parseFloat(editForm.price);
        const mrp = parseFloat(editForm.mrp);

        // Validation
        if (isNaN(price) || price <= 0) {
            showToast("Please enter a valid sale price", "error");
            return;
        }

        if (!isNaN(mrp) && mrp < price) {
            showToast("MRP cannot be less than sale price", "warning");
            return;
        }

        if (!editForm.description.trim()) {
            showToast("Product description cannot be empty", "error");
            return;
        }

        try {
            const updates = {
                price,
                mrp: isNaN(mrp) ? (editTarget.mrp || 0) : mrp,
                description: editForm.description.trim() || editTarget.description || "",
            };

            await updateDoc(doc(db, "products", editTarget.id), updates);
            setProducts(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...updates } : p));
            setEditTarget(null);
            showToast("✅ Product updated successfully!", "success");

        } catch (err) {
            console.error("Error updating product:", err);
            showToast("Failed to update product. Please try again", "error");
        }
    };

    const confirmDelete = async () => {
        if (!delTarget) return;

        try {
            await deleteDoc(doc(db, "products", delTarget.id));
            setProducts(prev => prev.filter(p => p.id !== delTarget.id));
            showToast(`"${delTarget.name}" has been deleted`, "success");
        } catch (err) {
            console.error("Error deleting product:", err);
            showToast("Failed to delete product. Please try again", "error");
        } finally {
            setDelTarget(null);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="mp-root">

                <div className="mp-header">
                    <h1 className="mp-title">Manage <span>Products</span></h1>
                    {products.length > 0 && <span className="mp-count">{products.length} products</span>}
                </div>

                {products.length === 0 ? (
                    <div className="mp-empty">
                        <PackageIcon size={32} style={{ margin: '0 auto 10px', color: '#e2e8f0', display: 'block' }} />
                        <p>No products yet.</p>
                    </div>
                ) : (
                    <>
                        {/* ── Desktop Table ── */}
                        <div className="mp-table-wrap">
                            <table className="mp-table">
                                <colgroup>
                                    <col style={{ width: '26%' }} />
                                    <col style={{ width: '34%' }} />
                                    <col style={{ width: '14%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '16%' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Description</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="mp-product-cell">
                                                    <div className="mp-img-wrap">
                                                        <img src={product.images?.[0]} alt={product.name} />
                                                    </div>
                                                    <span className="mp-product-name">{product.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="mp-desc-text">{stripHtml(product.description)}</span>
                                            </td>
                                            <td>
                                                <div className="mp-price">{currency}{product.price?.toLocaleString()}</div>
                                                {product.mrp > product.price && (
                                                    <div><span className="mp-mrp">{currency}{product.mrp?.toLocaleString()}</span></div>
                                                )}
                                            </td>
                                            <td>
                                                <label className="mp-toggle-track">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!product.inStock}
                                                        onChange={() => toggleStock(product)}
                                                    />
                                                    <span className="mp-toggle-thumb" />
                                                </label>
                                            </td>
                                            <td>
                                                <div className="mp-actions">
                                                    <button className="mp-btn edit" onClick={() => openEdit(product)} title="Edit">
                                                        <PencilIcon size={13} />
                                                    </button>
                                                    <button className="mp-btn del" onClick={() => setDelTarget(product)} title="Delete">
                                                        <Trash2Icon size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Mobile Cards ── */}
                        <div className="mp-mobile-list">
                            {products.map(product => (
                                <div key={product.id} className="mp-card">
                                    <div className="mp-card-top">
                                        <div className="mp-card-img">
                                            <img src={product.images?.[0]} alt={product.name} />
                                        </div>
                                        <div className="mp-card-info">
                                            <p className="mp-card-name">{product.name}</p>
                                            <div className="mp-card-prices">
                                                <span className="mp-card-price">{currency}{product.price?.toLocaleString()}</span>
                                                {product.mrp > product.price && (
                                                    <span className="mp-card-mrp">{currency}{product.mrp?.toLocaleString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {product.description && (
                                        <p className="mp-card-desc">{stripHtml(product.description)}</p>
                                    )}

                                    <div className="mp-card-stock-row">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span className="mp-card-stock-label">In Stock</span>
                                            <label className="mp-toggle-track">
                                                <input
                                                    type="checkbox"
                                                    checked={!!product.inStock}
                                                    onChange={() => toggleStock(product)}
                                                />
                                                <span className="mp-toggle-thumb" />
                                            </label>
                                        </div>
                                        <div className="mp-card-action-row">
                                            <button className="mp-btn edit" onClick={() => openEdit(product)} title="Edit">
                                                <PencilIcon size={13} />
                                            </button>
                                            <button className="mp-btn del" onClick={() => setDelTarget(product)} title="Delete">
                                                <Trash2Icon size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Edit Modal — desktop center, mobile bottom sheet ── */}
            {editTarget && (
                <div className="mp-modal-overlay" onClick={() => setEditTarget(null)}>
                    <div className="mp-modal" onClick={e => e.stopPropagation()}>

                        <div className="mp-modal-head">
                            <p className="mp-modal-title">Edit Product</p>
                            <button className="mp-modal-close" onClick={() => setEditTarget(null)}>
                                <XIcon size={13} />
                            </button>
                        </div>

                        {/* Product preview */}
                        <div className="mp-modal-product">
                            <div className="mp-modal-product-img">
                                <img
                                    src={editTarget.images?.[0]}
                                    alt={editTarget.name}
                                    style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: 'multiply' }}
                                />
                            </div>
                            <p className="mp-modal-product-name">{editTarget.name}</p>
                        </div>

                        {/* Price + MRP side by side */}
                        <div className="mp-field-row">
                            <div className="mp-field">
                                <label className="mp-field-label">Sale Price *</label>
                                <input
                                    className="mp-field-input"
                                    type="number"
                                    placeholder="e.g. 890"
                                    value={editForm.price}
                                    onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))}
                                    autoFocus
                                />
                            </div>
                            <div className="mp-field">
                                <label className="mp-field-label">MRP (Original)</label>
                                <input
                                    className="mp-field-input"
                                    type="number"
                                    placeholder="e.g. 1200"
                                    value={editForm.mrp}
                                    onChange={e => setEditForm(p => ({ ...p, mrp: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mp-field">
                            <label className="mp-field-label">Description</label>
                            <textarea
                                className="mp-field-textarea"
                                placeholder="Product description..."
                                value={editForm.description}
                                onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                            />
                        </div>

                        <button className="mp-modal-save" onClick={saveEdit}>
                            <CheckIcon size={15} />
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm ── */}
            {delTarget && (
                <div className="mp-del-overlay" onClick={() => setDelTarget(null)}>
                    <div className="mp-del-modal" onClick={e => e.stopPropagation()}>
                        <div className="mp-del-strip" />
                        <div className="mp-del-body">
                            <div className="mp-del-icon"><Trash2Icon size={22} /></div>
                            <p className="mp-del-title">Delete Product?</p>
                            <p className="mp-del-sub">
                                "<strong>{delTarget.name}</strong>" will be permanently removed.
                            </p>
                            <div className="mp-del-btns">
                                <button className="mp-del-cancel" onClick={() => setDelTarget(null)}>Cancel</button>
                                <button className="mp-del-confirm" onClick={confirmDelete}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}