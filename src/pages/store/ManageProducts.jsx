import { useEffect, useState } from "react";
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
    margin-bottom: 80px;
}

.mp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
.mp-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 3px; }
.mp-subtitle { font-size: 0.82rem; color: #94a3b8; margin: 0; font-weight: 400; }
.mp-title span { color: #0f172a; font-weight: 800; }
.mp-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

/* ── Inline Alert ── */
.mp-alert {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px; border-radius: 12px;
    font-size: 0.825rem; font-weight: 500; line-height: 1.5;
    margin-bottom: 18px;
}
.mp-alert-icon {
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800;
}
.mp-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.mp-alert.error   .mp-alert-icon { background: #fda4af; color: #9f1239; }
.mp-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.mp-alert.success .mp-alert-icon { background: #86efac; color: #14532d; }
.mp-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.mp-alert.warning .mp-alert-icon { background: #fcd34d; color: #92400e; }
.mp-alert-body { flex: 1; font-size: 0.8rem; }
.mp-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.mp-alert-close:hover { opacity: 1; }

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
.mp-btn.del:hover  { background: #fff1f2; border-color: #fecdd3; color: #ef4444; }

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
    background: rgba(15,23,42,0.5); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
}
.mp-modal {
    background: #fff; border-radius: 24px;
    width: 100%; max-width: 460px;
    max-height: 90vh; overflow-y: auto;
    padding: 28px 24px 24px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.15);
}
.mp-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.mp-modal-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0; }
.mp-modal-close { width: 30px; height: 30px; border-radius: 50%; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.18s; }
.mp-modal-close:hover { background: #fff1f2; border-color: #fecdd3; color: #ef4444; }

.mp-modal-product { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 14px; margin-bottom: 22px; }
.mp-modal-product-img { width: 48px; height: 48px; border-radius: 12px; background: #fff; display: flex; align-items: center; justify-content: center; border: 1.5px solid #f1f5f9; flex-shrink: 0; overflow: hidden; }
.mp-modal-product-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; line-height: 1.35; }

.mp-field { margin-bottom: 14px; }
.mp-field-label { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; display: block; }
.mp-field-input {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500; color: #0f172a; background: #f8fafc; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
.mp-field-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }
.mp-field-textarea {
    width: 100%; padding: 11px 14px; min-height: 110px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500; color: #0f172a; background: #f8fafc; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
    resize: vertical; line-height: 1.6;
}
.mp-field-textarea:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }
.mp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.mp-modal-save {
    width: 100%; padding: 13px; background: #16a34a; color: #fff;
    font-size: 0.84rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.2s; margin-top: 8px;
    box-shadow: 0 4px 14px rgba(22,163,74,0.28);
}
.mp-modal-save:hover { background: #15803d; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(22,163,74,0.36); }

/* ── Delete Modal ── */
.mp-del-overlay {
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15,23,42,0.45); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
}
.mp-del-modal {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 24px;
    max-width: 360px; width: 100%;
    padding: 28px 24px 24px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.12);
}

/* product row inside delete modal */
.mp-del-product {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    background: #fff1f2; border: 1.5px solid #fecdd3;
    border-radius: 14px; margin-bottom: 20px;
}
.mp-del-product-img {
    width: 44px; height: 44px; border-radius: 10px;
    background: #fff; border: 1.5px solid #fecdd3;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; overflow: hidden;
}
.mp-del-product-img img { width: 32px; height: 32px; object-fit: contain; mix-blend-mode: multiply; }
.mp-del-product-name { font-size: 0.8rem; font-weight: 700; color: #9f1239; line-height: 1.4; }

.mp-del-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.mp-del-title-wrap { display: flex; align-items: center; gap: 9px; }
.mp-del-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: #fff1f2; border: 1.5px solid #fecdd3;
    display: flex; align-items: center; justify-content: center;
    color: #ef4444; flex-shrink: 0;
}
.mp-del-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin: 0; }
.mp-del-close {
    width: 28px; height: 28px; border-radius: 50%;
    background: #f8fafc; border: 1.5px solid #f1f5f9;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #94a3b8; transition: all 0.18s; flex-shrink: 0;
}
.mp-del-close:hover { background: #fff1f2; border-color: #fecdd3; color: #ef4444; }

.mp-del-sub { font-size: 0.78rem; color: #94a3b8; line-height: 1.6; margin: 0 0 20px; }

.mp-del-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mp-del-cancel {
    padding: 11px; border-radius: 12px;
    border: 1.5px solid #f1f5f9; color: #64748b;
    background: #f8fafc; font-size: 0.8rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s;
}
.mp-del-cancel:hover { border-color: #e2e8f0; background: #fff; }
.mp-del-confirm {
    padding: 11px; border-radius: 12px; border: none;
    background: #ef4444; color: #fff;
    font-size: 0.8rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s;
    box-shadow: 0 4px 12px rgba(239,68,68,0.28);
}
.mp-del-confirm:hover { background: #dc2626; box-shadow: 0 6px 16px rgba(239,68,68,0.38); }

.mp-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px 20px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; text-align: center; gap: 8px; }
.mp-empty-icon { width: 64px; height: 64px; border-radius: 20px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.mp-empty p    { font-size: 0.875rem; font-weight: 600; color: #475569; margin: 0; }
.mp-empty span { font-size: 0.775rem; color: #cbd5e1; }

@media (max-width: 768px) {
    .mp-table-wrap { display: none; }
    .mp-mobile-list { display: flex; }
    .mp-title { font-size: 1.25rem; }
    .mp-modal { border-radius: 24px 24px 0 0; max-width: 100%; padding: 20px 18px 36px; }
    .mp-modal-overlay { align-items: flex-end; padding: 0; }
    .mp-field-row { grid-template-columns: 1fr; }
    .mp-del-modal { border-radius: 24px 24px 0 0; max-width: 100%; }
    .mp-del-overlay { align-items: flex-end; padding: 0; }
}
`;

const stripHtml = (str) => str?.replace(/<[^>]+>/g, '') || "";

// ── Inline Alert ──
const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', warning: '!' };
    return (
        <div className={`mp-alert ${type}`}>
            <div className="mp-alert-icon">{icons[type]}</div>
            <div className="mp-alert-body">{message}</div>
            <button className="mp-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

export default function StoreManageProducts() {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "৳";
    const { user, loading: userLoading } = useCurrentUser();

    const [loading, setLoading]     = useState(true);
    const [products, setProducts]   = useState([]);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm]   = useState({ price: "", mrp: "", description: "" });
    const [delTarget, setDelTarget] = useState(null);
    const [alert, setAlert]         = useState(null);

    const showAlert  = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    useEffect(() => {
        if (userLoading) return;

        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                showAlert("warning", "Please login to manage products.");
                return;
            }
            try {
                const store = await getStoreByUser(user.uid);
                if (!store) {
                    setLoading(false);
                    showAlert("warning", "No store found. Please create a store first.");
                    return;
                }
                const productList = await getProductsByStore(store.id);
                setProducts(productList);
            } catch (err) {
                console.error("Error fetching products:", err);
                showAlert("error", "Failed to load products. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, userLoading]);

    const toggleStock = async (product) => {
        const newValue = !product.inStock;
        try {
            await updateDoc(doc(db, "products", product.id), { inStock: newValue });
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: newValue } : p));
            showAlert("success", newValue ? "Product is now in stock." : "Product marked as out of stock.");
        } catch (err) {
            console.error("Error updating stock:", err);
            showAlert("error", "Failed to update stock status.");
        }
    };

    const openEdit = (product) => {
        clearAlert();
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
        const mrp   = parseFloat(editForm.mrp);

        if (isNaN(price) || price <= 0)     { showAlert("error", "Please enter a valid sale price."); return; }
        if (!isNaN(mrp) && mrp < price)     { showAlert("warning", "MRP cannot be less than sale price."); return; }
        if (!editForm.description.trim())   { showAlert("error", "Product description cannot be empty."); return; }

        try {
            const updates = {
                price,
                mrp: isNaN(mrp) ? (editTarget.mrp || 0) : mrp,
                description: editForm.description.trim() || editTarget.description || "",
            };
            await updateDoc(doc(db, "products", editTarget.id), updates);
            setProducts(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...updates } : p));
            setEditTarget(null);
            showAlert("success", "Product updated successfully.");
        } catch (err) {
            console.error("Error updating product:", err);
            showAlert("error", "Failed to update product. Please try again.");
        }
    };

    const confirmDelete = async () => {
        if (!delTarget) return;
        try {
            await deleteDoc(doc(db, "products", delTarget.id));
            setProducts(prev => prev.filter(p => p.id !== delTarget.id));
            showAlert("success", `"${delTarget.name}" has been deleted.`);
        } catch (err) {
            console.error("Error deleting product:", err);
            showAlert("error", "Failed to delete product. Please try again.");
        } finally {
            setDelTarget(null);
        }
    };

    if (userLoading || loading) return <Loading />;

    return (
        <>
            <style>{CSS}</style>
            <div className="mp-root">

                <div className="mp-header">
                    <div>
                        <h1 className="mp-title">Manage <span>Products</span></h1>
                        <p className="mp-subtitle">Edit, delete or toggle stock for your products</p>
                    </div>
                    {products.length > 0 && <span className="mp-count">{products.length} products</span>}
                </div>

                {/* Inline Alert */}
                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                {products.length === 0 ? (
                    <div className="mp-empty">
                        <div className="mp-empty-icon"><PackageIcon size={26} style={{ color: '#cbd5e1' }} /></div>
                        <p>No products yet</p>
                        <span>Add your first product to get started</span>
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
                                            <td><span className="mp-desc-text">{stripHtml(product.description)}</span></td>
                                            <td>
                                                <div className="mp-price">{currency}{product.price?.toLocaleString()}</div>
                                                {product.mrp > product.price && (
                                                    <div><span className="mp-mrp">{currency}{product.mrp?.toLocaleString()}</span></div>
                                                )}
                                            </td>
                                            <td>
                                                <label className="mp-toggle-track">
                                                    <input type="checkbox" checked={!!product.inStock} onChange={() => toggleStock(product)} />
                                                    <span className="mp-toggle-thumb" />
                                                </label>
                                            </td>
                                            <td>
                                                <div className="mp-actions">
                                                    <button className="mp-btn edit" onClick={() => openEdit(product)} title="Edit"><PencilIcon size={13} /></button>
                                                    <button className="mp-btn del" onClick={() => setDelTarget(product)} title="Delete"><Trash2Icon size={13} /></button>
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
                                                <input type="checkbox" checked={!!product.inStock} onChange={() => toggleStock(product)} />
                                                <span className="mp-toggle-thumb" />
                                            </label>
                                        </div>
                                        <div className="mp-card-action-row">
                                            <button className="mp-btn edit" onClick={() => openEdit(product)}><PencilIcon size={13} /></button>
                                            <button className="mp-btn del" onClick={() => setDelTarget(product)}><Trash2Icon size={13} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ── Edit Modal ── */}
            {editTarget && (
                <div className="mp-modal-overlay" onClick={() => setEditTarget(null)}>
                    <div className="mp-modal" onClick={e => e.stopPropagation()}>
                        <div className="mp-modal-head">
                            <p className="mp-modal-title">Edit Product</p>
                            <button className="mp-modal-close" onClick={() => setEditTarget(null)}><XIcon size={13} /></button>
                        </div>
                        <div className="mp-modal-product">
                            <div className="mp-modal-product-img">
                                <img src={editTarget.images?.[0]} alt={editTarget.name} style={{ width: 36, height: 36, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                            </div>
                            <p className="mp-modal-product-name">{editTarget.name}</p>
                        </div>
                        <div className="mp-field-row">
                            <div className="mp-field">
                                <label className="mp-field-label">Sale Price *</label>
                                <input className="mp-field-input" type="number" placeholder="e.g. 890" value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))} autoFocus />
                            </div>
                            <div className="mp-field">
                                <label className="mp-field-label">MRP (Original)</label>
                                <input className="mp-field-input" type="number" placeholder="e.g. 1200" value={editForm.mrp} onChange={e => setEditForm(p => ({ ...p, mrp: e.target.value }))} />
                            </div>
                        </div>
                        <div className="mp-field">
                            <label className="mp-field-label">Description</label>
                            <textarea className="mp-field-textarea" placeholder="Product description..." value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
                        </div>
                        <button className="mp-modal-save" onClick={saveEdit}>
                            <CheckIcon size={15} /> Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* ── Delete Modal ── */}
            {delTarget && (
                <div className="mp-del-overlay" onClick={() => setDelTarget(null)}>
                    <div className="mp-del-modal" onClick={e => e.stopPropagation()}>

                        <div className="mp-del-head">
                            <div className="mp-del-title-wrap">
                                <div className="mp-del-icon"><Trash2Icon size={16} /></div>
                                <p className="mp-del-title">Delete Product?</p>
                            </div>
                            <button className="mp-del-close" onClick={() => setDelTarget(null)}><XIcon size={12} /></button>
                        </div>

                        {/* Product preview */}
                        <div className="mp-del-product">
                            <div className="mp-del-product-img">
                                <img src={delTarget.images?.[0]} alt={delTarget.name} />
                            </div>
                            <p className="mp-del-product-name">{delTarget.name}</p>
                        </div>

                        <p className="mp-del-sub">This product will be permanently removed and cannot be recovered.</p>

                        <div className="mp-del-btns">
                            <button className="mp-del-cancel" onClick={() => setDelTarget(null)}>Cancel</button>
                            <button className="mp-del-confirm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}