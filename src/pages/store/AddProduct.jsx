import { useState, useRef, useEffect } from "react";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { addProduct } from "../../lib/services/productService";
import { uploadProductImage } from "../../lib/supabase";
import {
    TypeIcon, TagIcon, CircleDollarSignIcon,
    ImagePlusIcon, PackageIcon, StarIcon,
    BoldIcon, ItalicIcon, XIcon, ChevronDownIcon, CheckIcon
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ap-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; }

.ap-header { margin-bottom: 28px; }
.ap-subtitle { font-size: 0.82rem; color: #94a3b8; margin: 4px 0 0; font-weight: 400; }
.ap-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 4px; }
.ap-title span { color: #0f172a; font-weight: 800; }

/* ── Alert ── */
.ap-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; font-size: 0.825rem; font-weight: 500; line-height: 1.5; margin-bottom: 18px; }
.ap-alert-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800; }
.ap-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.ap-alert.error   .ap-alert-icon { background: #fda4af; color: #9f1239; }
.ap-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.ap-alert.success .ap-alert-icon { background: #86efac; color: #14532d; }
.ap-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.ap-alert.warning .ap-alert-icon { background: #fcd34d; color: #92400e; }
.ap-alert.info    { background: #eff6ff; border: 1.5px solid #bfdbfe; color: #1e40af; }
.ap-alert.info    .ap-alert-icon { background: #93c5fd; color: #1e40af; }
.ap-alert-body { flex: 1; font-size: 0.8rem; }
.ap-alert-close { background: none; border: none; cursor: pointer; padding: 0; opacity: 0.45; font-size: 0.95rem; color: inherit; transition: opacity 0.15s; flex-shrink: 0; }
.ap-alert-close:hover { opacity: 1; }

/* ── Layout ── */
.ap-layout { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }
.ap-left  { grid-column: 1; }
.ap-right { grid-column: 2; display: flex; flex-direction: column; gap: 14px; }
@media (max-width: 900px) {
    .ap-layout { grid-template-columns: 1fr; }
    .ap-left, .ap-right { grid-column: 1; }
}

/* ── Card ── */
.ap-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 20px; padding: 20px; }

/* ── Section label ── */
.ap-sec { font-size: 0.6rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.ap-sec::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

/* ── Image grid ── */
.ap-img-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 4px; max-width: 380px; }
@media (max-width: 900px) { .ap-img-grid { max-width: 100%; } }
.ap-img-slot { position: relative; aspect-ratio: 1/1; max-height: 90px; border-radius: 12px; border: 1.5px dashed #e2e8f0; background: #f8fafc; overflow: hidden; transition: border-color 0.2s, background 0.2s; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.ap-img-slot:hover { border-color: #16a34a; background: #f0fdf4; }
.ap-img-slot.has-img { border-style: solid; border-color: #bbf7d0; }
.ap-img-slot img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; }
.ap-img-placeholder { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #cbd5e1; transition: color 0.2s; }
.ap-img-slot:hover .ap-img-placeholder { color: #16a34a; }
.ap-img-placeholder span { font-size: 0.52rem; font-weight: 600; }
.ap-img-remove { position: absolute; top: 4px; right: 4px; width: 18px; height: 18px; border-radius: 50%; background: rgba(15,23,42,0.5); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: background 0.18s; z-index: 2; }
.ap-img-remove:hover { background: #ef4444; }
.ap-img-badge { position: absolute; bottom: 4px; left: 4px; font-size: 0.48rem; font-weight: 700; background: #16a34a; color: #fff; padding: 2px 5px; border-radius: 4px; }

/* ── Fields ── */
.ap-fields { display: flex; flex-direction: column; gap: 14px; }
.ap-field  { display: flex; flex-direction: column; gap: 5px; }
.ap-label { font-size: 0.67rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 5px; }
.ap-label svg { color: #94a3b8; }
.ap-optional { font-size: 0.65rem; color: #94a3b8; font-weight: 400; text-transform: none; letter-spacing: 0; margin-left: 2px; }

.ap-input {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid #f1f5f9; border-radius: 11px;
    font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; color: #0f172a; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-weight: 500; box-sizing: border-box;
}
.ap-input::placeholder { color: #cbd5e1; font-weight: 400; }
.ap-input[type=number]::-webkit-inner-spin-button,
.ap-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.ap-input[type=number] { -moz-appearance: textfield; }
.ap-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }

.ap-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 480px) { .ap-row { grid-template-columns: 1fr; } }

/* ── Custom Category Dropdown ── */
.ap-dd { position: relative; user-select: none; display: inline-block; width: 100%; }

.ap-dd-trigger {
    width: 100%; padding: 10px 38px 10px 13px;
    border: 1.5px solid #f1f5f9; border-radius: 11px;
    font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box; cursor: pointer;
    display: flex; align-items: center; gap: 8px; min-height: 42px;
    color: #cbd5e1; font-weight: 400;
}
.ap-dd-trigger.has-val { color: #0f172a; font-weight: 500; }
.ap-dd-trigger:hover { border-color: #e2e8f0; background: #fff; }
.ap-dd-trigger.open {
    border-color: #16a34a; background: #fff;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.09);
}
.ap-dd-icon {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%); pointer-events: none;
    display: flex; align-items: center; color: #94a3b8;
    transition: transform 0.2s ease, color 0.2s;
}
.ap-dd-icon.open { transform: translateY(-50%) rotate(180deg); color: #16a34a; }

/* Popover menu — floats, no border connection to trigger */
.ap-dd-menu {
    position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 9999;
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
    overflow: hidden;
    transform-origin: top center;

    /* entrance animation */
    animation: ap-dd-in 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes ap-dd-in {
    from { opacity: 0; transform: scale(0.95) translateY(-6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}
.ap-dd-menu.closing {
    animation: ap-dd-out 0.1s ease-in both;
}
@keyframes ap-dd-out {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to   { opacity: 0; transform: scale(0.95) translateY(-4px); }
}

.ap-dd-scroll { max-height: 220px; overflow-y: auto; padding: 5px; }
.ap-dd-scroll::-webkit-scrollbar { width: 3px; }
.ap-dd-scroll::-webkit-scrollbar-track { background: transparent; }
.ap-dd-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

.ap-dd-item {
    padding: 8px 12px; font-size: 0.82rem; font-weight: 500; color: #475569;
    cursor: pointer; border-radius: 8px; margin-bottom: 1px;
    transition: background 0.1s, color 0.1s;
    display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.ap-dd-item:hover { background: #f0fdf4; color: #15803d; }
.ap-dd-item.sel { background: #f0fdf4; color: #15803d; font-weight: 700; }

.ap-dd-check {
    width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
    background: #16a34a;
    display: flex; align-items: center; justify-content: center;
}

/* ── Rich Text Editor ── */
.ap-editor-wrap { border: 1.5px solid #f1f5f9; border-radius: 12px; background: #f8fafc; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.ap-editor-wrap:focus-within { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }
.ap-toolbar { display: flex; align-items: center; gap: 2px; padding: 7px 9px; border-bottom: 1.5px solid #f1f5f9; background: #fff; flex-wrap: wrap; }
.ap-tool-btn { height: 26px; padding: 0 8px; border-radius: 6px; display: flex; align-items: center; justify-content: center; gap: 4px; border: none; background: none; cursor: pointer; color: #64748b; font-size: 0.72rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
.ap-tool-btn:hover { background: #f0fdf4; color: #16a34a; }
.ap-tool-sep { width: 1px; height: 16px; background: #f1f5f9; margin: 0 2px; }
.ap-editor { min-height: 110px; padding: 12px 14px; outline: none; font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; line-height: 1.75; background: transparent; }
.ap-editor:empty::before { content: attr(data-placeholder); color: #cbd5e1; pointer-events: none; }
.ap-editor b, .ap-editor strong { font-weight: 700; }
.ap-editor i, .ap-editor em { font-style: italic; }
.ap-editor h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 6px 0 4px; }
.ap-editor ul { padding-left: 20px; margin: 4px 0; }
.ap-editor ul li { margin-bottom: 3px; }

/* ── Best Selling ── */
.ap-bs-box { display: flex; align-items: flex-start; gap: 11px; padding: 13px 14px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 14px; cursor: pointer; transition: border-color 0.2s, background 0.2s; user-select: none; }
.ap-bs-box:hover { border-color: #bbf7d0; background: #f0fdf4; }
.ap-bs-box.active { border-color: #16a34a; background: #f0fdf4; }
.ap-bs-check { width: 20px; height: 20px; border-radius: 6px; margin-top: 1px; border: 2px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s; }
.ap-bs-check.on { border-color: #16a34a; background: #16a34a; }
.ap-bs-title { font-size: 0.8rem; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
.ap-bs-sub   { font-size: 0.7rem; color: #94a3b8; font-weight: 400; margin: 0; line-height: 1.5; }

/* ── Tips ── */
.ap-tips { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 14px; padding: 14px; }
.ap-tips-title { font-size: 0.68rem; font-weight: 800; color: #15803d; margin: 0 0 9px; text-transform: uppercase; letter-spacing: 0.08em; }
.ap-tip { display: flex; align-items: flex-start; gap: 7px; font-size: 0.75rem; color: #475569; margin-bottom: 6px; line-height: 1.5; }
.ap-tip:last-child { margin-bottom: 0; }
.ap-tip-dot { width: 4px; height: 4px; border-radius: 50%; background: #16a34a; flex-shrink: 0; margin-top: 7px; }

/* ── Submit ── */
.ap-submit { width: 100%; padding: 13px; background: #16a34a; color: #fff; font-size: 0.875rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; box-shadow: 0 4px 14px rgba(22,163,74,0.28); }
.ap-submit:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); box-shadow: 0 8px 20px rgba(22,163,74,0.36); }
.ap-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
.ap-dots { display: inline-flex; align-items: center; gap: 4px; }
.ap-dots span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.85); display: inline-block; animation: ap-dot 1.1s ease-in-out infinite; }
.ap-dots span:nth-child(2) { animation-delay: 0.18s; }
.ap-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes ap-dot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }

@media (max-width: 768px) { .ap-title { font-size: 1.25rem; } }
`;

const CATS = [
    "Electronics", "Clothing", "Home & Kitchen", "Beauty & Health",
    "Toys & Games", "Sports & Outdoors", "Books & Media",
    "Food & Drink", "Hobbies & Crafts", "Others"
];

const Alert = ({ type, message, onDismiss }) => {
    const icons = { error: '✕', success: '✓', warning: '!', info: 'i' };
    return (
        <div className={`ap-alert ${type}`}>
            <div className="ap-alert-icon">{icons[type]}</div>
            <div className="ap-alert-body">{message}</div>
            <button className="ap-alert-close" onClick={onDismiss} type="button">✕</button>
        </div>
    );
};

// ── Custom Dropdown ──
const CategoryDropdown = ({ value, onChange }) => {
    const [open, setOpen]       = useState(false);
    const [closing, setClosing] = useState(false);
    const ref       = useRef(null);
    const closeTimer = useRef(null);

    const close = () => {
        setClosing(true);
        closeTimer.current = setTimeout(() => {
            setOpen(false);
            setClosing(false);
        }, 95);
    };

    useEffect(() => {
        return () => clearTimeout(closeTimer.current);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setClosing(true);
                setTimeout(() => { setOpen(false); setClosing(false); }, 95);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = () => { open ? close() : setOpen(true); };
    const select = (cat) => { onChange(cat); close(); };

    return (
        <div className="ap-dd" ref={ref}>
            <div
                className={`ap-dd-trigger${value ? ' has-val' : ''}${open ? ' open' : ''}`}
                onClick={toggle}
            >
                {value ? (
                    <span>{value}</span>
                ) : (
                    <span>Select a category</span>
                )}
            </div>
            <div className={`ap-dd-icon${open ? ' open' : ''}`}>
                <ChevronDownIcon size={14} />
            </div>
            {open && (
                <div className={`ap-dd-menu${closing ? ' closing' : ''}`}>
                    <div className="ap-dd-scroll">
                        {CATS.map(cat => (
                            <div
                                key={cat}
                                className={`ap-dd-item${value === cat ? ' sel' : ''}`}
                                onClick={() => select(cat)}
                            >
                                <span>{cat}</span>
                                {value === cat && (
                                    <span className="ap-dd-check">
                                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function StoreAddProduct() {
    const { user } = useCurrentUser();
    const editorRef = useRef(null);

    const [images, setImages]   = useState({ 1: null, 2: null, 3: null, 4: null });
    const [info, setInfo]       = useState({ name: "", mrp: "", price: "", category: "", bestSelling: false });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert]     = useState(null);

    const showAlert  = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    const onChange      = (e) => setInfo(p => ({ ...p, [e.target.name]: e.target.value }));
    const exec          = (cmd) => { editorRef.current?.focus(); document.execCommand(cmd, false, null); };
    const insertBullet  = () => { editorRef.current?.focus(); document.execCommand('insertUnorderedList', false, null); };
    const insertHeading = () => { editorRef.current?.focus(); document.execCommand('formatBlock', false, 'h3'); };
    const insertBlank   = () => { editorRef.current?.focus(); document.execCommand('insertParagraph', false, null); document.execCommand('insertParagraph', false, null); };
    const removeImage   = (e, key) => { e.preventDefault(); e.stopPropagation(); setImages(p => ({ ...p, [key]: null })); };

    const onSubmit = async (e) => {
        e.preventDefault();
        clearAlert();

        if (!user)               { showAlert("error", "Please login to add products."); return; }
        const desc = editorRef.current?.innerHTML || '';
        if (!desc.replace(/<[^>]+>/g, '').trim()) { showAlert("error", "Product description is required."); return; }
        if (!info.name.trim())   { showAlert("error", "Product name is required."); return; }
        if (!info.category)      { showAlert("error", "Please select a product category."); return; }

        const mrp   = parseFloat(info.mrp);
        const price = info.price !== "" ? parseFloat(info.price) : mrp;

        if (isNaN(mrp) || mrp <= 0)     { showAlert("error", "Please enter a valid actual price."); return; }
        if (isNaN(price) || price <= 0)  { showAlert("error", "Please enter a valid offer price."); return; }
        if (price > mrp)                 { showAlert("error", "Offer price cannot be higher than actual price."); return; }

        const files = Object.values(images).filter(Boolean);
        if (!files.length) { showAlert("warning", "Please add at least one product image."); return; }

        setLoading(true);
        showAlert("info", "Uploading your product, please wait…");

        try {
            const store = await getStoreByUser(user.uid);
            if (!store) { showAlert("error", "Store not found. Please create a store first."); setLoading(false); return; }

            const imageUrls = await Promise.all(
                files.map((f, i) => uploadProductImage(f, `${store.id}-${Date.now()}-${i}`))
            );
            await addProduct({ ...info, description: desc, mrp, price, storeId: store.id, images: imageUrls }, []);

            setInfo({ name: "", mrp: "", price: "", category: "", bestSelling: false });
            setImages({ 1: null, 2: null, 3: null, 4: null });
            if (editorRef.current) editorRef.current.innerHTML = '';
            showAlert("success", "Product added successfully!");

        } catch (err) {
            console.error("Add product error:", err);
            showAlert("error", err.message || "Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const LoadingDots = () => <span className="ap-dots"><span /><span /><span /></span>;

    return (
        <>
            <style>{CSS}</style>
            <div className="ap-root">

                <div className="ap-header">
                    <h1 className="ap-title">Add New <span>Product</span></h1>
                    <p className="ap-subtitle">Fill in the details below to list a new product in your store</p>
                </div>

                {alert && <Alert type={alert.type} message={alert.message} onDismiss={clearAlert} />}

                <form onSubmit={onSubmit}>
                    <div className="ap-layout">

                        {/* ── LEFT ── */}
                        <div className="ap-left">
                            <div className="ap-card">
                                <div className="ap-fields">

                                    {/* Images */}
                                    <div className="ap-field">
                                        <p className="ap-sec">Product Images</p>
                                        <div className="ap-img-grid">
                                            {Object.keys(images).map((key, idx) => (
                                                <label key={key} htmlFor={`img-${key}`} className={"ap-img-slot" + (images[key] ? " has-img" : "")}>
                                                    {images[key] ? (
                                                        <>
                                                            <img src={URL.createObjectURL(images[key])} alt="" />
                                                            {idx === 0 && <span className="ap-img-badge">Main</span>}
                                                            <button className="ap-img-remove" onClick={e => removeImage(e, key)}><XIcon size={8} /></button>
                                                        </>
                                                    ) : (
                                                        <div className="ap-img-placeholder">
                                                            <ImagePlusIcon size={15} />
                                                            <span>Photo {idx + 1}</span>
                                                        </div>
                                                    )}
                                                    <input type="file" accept="image/*" id={`img-${key}`} onChange={e => setImages(p => ({ ...p, [key]: e.target.files[0] }))} hidden />
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div className="ap-field">
                                        <label className="ap-label"><TypeIcon size={11} /> Product Name</label>
                                        <input className="ap-input" type="text" name="name" placeholder="e.g. Wireless Headphones Pro" value={info.name} onChange={onChange} />
                                    </div>

                                    {/* Description */}
                                    <div className="ap-field">
                                        <label className="ap-label">Description</label>
                                        <div className="ap-editor-wrap">
                                            <div className="ap-toolbar">
                                                <button type="button" className="ap-tool-btn" onClick={() => exec('bold')}><BoldIcon size={11} /> Bold</button>
                                                <button type="button" className="ap-tool-btn" onClick={() => exec('italic')}><ItalicIcon size={11} /> Italic</button>
                                                <div className="ap-tool-sep" />
                                                <button type="button" className="ap-tool-btn" onClick={insertBullet}>• Bullet</button>
                                                <button type="button" className="ap-tool-btn" onClick={insertHeading}>H Heading</button>
                                                <div className="ap-tool-sep" />
                                                <button type="button" className="ap-tool-btn" onClick={insertBlank}>↵ Line</button>
                                            </div>
                                            <div ref={editorRef} className="ap-editor" contentEditable suppressContentEditableWarning data-placeholder="Write a short product description..." spellCheck={false} />
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="ap-row">
                                        <div className="ap-field">
                                            <label className="ap-label"><CircleDollarSignIcon size={11} /> Actual Price</label>
                                            <input className="ap-input" type="number" name="mrp" placeholder="e.g. 1200" min="0" value={info.mrp} onChange={onChange} />
                                        </div>
                                        <div className="ap-field">
                                            <label className="ap-label"><CircleDollarSignIcon size={11} /> Offer Price <span className="ap-optional">(optional)</span></label>
                                            <input className="ap-input" type="number" name="price" placeholder="e.g. 999 (blank = no discount)" min="0" value={info.price} onChange={onChange} />
                                        </div>
                                    </div>

                                    {/* Category — Custom Dropdown */}
                                    <div className="ap-field">
                                        <label className="ap-label"><TagIcon size={11} /> Category</label>
                                        <CategoryDropdown
                                            value={info.category}
                                            onChange={(cat) => setInfo(p => ({ ...p, category: cat }))}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT ── */}
                        <div className="ap-right">

                            <div className="ap-card" style={{ padding: '16px' }}>
                                <p className="ap-sec">Visibility</p>
                                <div
                                    className={"ap-bs-box" + (info.bestSelling ? " active" : "")}
                                    onClick={() => setInfo(p => ({ ...p, bestSelling: !p.bestSelling }))}
                                >
                                    <div className={"ap-bs-check" + (info.bestSelling ? " on" : "")}>
                                        {info.bestSelling && (
                                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="ap-bs-title">
                                            <StarIcon size={10} style={{ display: 'inline', marginRight: 4, color: '#f59e0b' }} />
                                            Mark as Best Selling
                                        </p>
                                        <p className="ap-bs-sub">Shows in Best Selling section on homepage</p>
                                    </div>
                                </div>
                            </div>

                            <div className="ap-tips">
                                <p className="ap-tips-title">Tips</p>
                                <div className="ap-tip"><div className="ap-tip-dot" /><span>Add at least 2–3 clear photos for better conversions</span></div>
                                <div className="ap-tip"><div className="ap-tip-dot" /><span>First image will be shown as the main thumbnail</span></div>
                                <div className="ap-tip"><div className="ap-tip-dot" /><span>Set an offer price lower than actual to show a discount badge</span></div>
                                <div className="ap-tip"><div className="ap-tip-dot" /><span>Write a clear description to help customers find your product</span></div>
                            </div>

                            <button type="submit" className="ap-submit" disabled={loading}>
                                {loading ? <LoadingDots /> : <><PackageIcon size={15} /> Add Product</>}
                            </button>

                        </div>

                    </div>
                </form>
            </div>
        </>
    );
}