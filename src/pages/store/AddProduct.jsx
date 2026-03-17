import { useState, useRef } from "react";
import { useFloatingToast } from "../../components/FloatingToastProvider";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { addProduct } from "../../lib/services/productService";
import { uploadProductImage } from "../../lib/supabase";
import {
    TypeIcon, TagIcon, CircleDollarSignIcon,
    ImagePlusIcon, PackageIcon, StarIcon,
    BoldIcon, ItalicIcon, XIcon
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.ap-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    animation: ap-fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
    margin-bottom: 80px;
}
@keyframes ap-fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

.ap-header { margin-bottom: 24px; }
.ap-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0; }
.ap-title span { color: #0f172a; font-weight: 800; }

/* ── Layout ── */
.ap-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 20px;
    align-items: start;
}
@media (max-width: 900px) { .ap-layout { grid-template-columns: 1fr; } }

/* ── Cards ── */
.ap-card {
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 22px;
    padding: 24px 22px;
    animation: ap-fadeUp 0.5s 0.06s cubic-bezier(0.4,0,0.2,1) both;
}

/* ── Section label ── */
.ap-sec {
    font-size: 0.62rem; font-weight: 700; color: #94a3b8;
    text-transform: uppercase; letter-spacing: 0.14em;
    margin-bottom: 12px; display: flex; align-items: center; gap: 6px;
}
.ap-sec::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }

/* ── Image grid ── */
.ap-img-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 4px;
}
@media (max-width: 480px) { .ap-img-grid { grid-template-columns: repeat(2, 1fr); } }

.ap-img-slot {
    position: relative;
    aspect-ratio: 1/1;
    border-radius: 16px;
    border: 2px dashed #e2e8f0;
    background: #f8fafc;
    overflow: hidden;
    transition: border-color 0.2s, background 0.2s;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
}
.ap-img-slot:hover { border-color: #16a34a; background: #f0fdf4; }
.ap-img-slot.has-img { border-style: solid; border-color: #bbf7d0; }
.ap-img-slot img { width: 100%; height: 100%; object-fit: cover; mix-blend-mode: multiply; }
.ap-img-placeholder { display: flex; flex-direction: column; align-items: center; gap: 5px; color: #cbd5e1; transition: color 0.2s; }
.ap-img-slot:hover .ap-img-placeholder { color: #16a34a; }
.ap-img-placeholder span { font-size: 0.62rem; font-weight: 600; }
.ap-img-remove {
    position: absolute; top: 6px; right: 6px;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(15,23,42,0.55); color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; border: none; transition: background 0.18s;
    z-index: 2;
}
.ap-img-remove:hover { background: #ef4444; }
.ap-img-badge {
    position: absolute; bottom: 6px; left: 6px;
    font-size: 0.55rem; font-weight: 700; background: #16a34a;
    color: #fff; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.06em;
}

/* ── Fields ── */
.ap-fields { display: flex; flex-direction: column; gap: 16px; }

.ap-field { display: flex; flex-direction: column; gap: 6px; }
.ap-label {
    font-size: 0.68rem; font-weight: 700; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.08em;
    display: flex; align-items: center; gap: 5px;
}
.ap-label svg { color: #94a3b8; }
.ap-optional { font-size: 0.65rem; color: #94a3b8; font-weight: 400; text-transform: none; letter-spacing: 0; margin-left: 2px; }

.ap-input, .ap-select {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc; color: #0f172a; outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-weight: 500; box-sizing: border-box;
}
.ap-input::placeholder { color: #cbd5e1; font-weight: 400; }
.ap-input:focus, .ap-select:focus {
    border-color: #16a34a; background: #fff;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
}
.ap-select { cursor: pointer; appearance: none; }
.ap-select-wrap { position: relative; }
.ap-select-arr { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #94a3b8; }

.ap-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 480px) { .ap-row { grid-template-columns: 1fr; } }

/* ── Rich Text Editor ── */
.ap-editor-wrap {
    border: 1.5px solid #f1f5f9; border-radius: 14px;
    background: #f8fafc; overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.ap-editor-wrap:focus-within {
    border-color: #16a34a; background: #fff;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
}
.ap-toolbar {
    display: flex; align-items: center; gap: 2px;
    padding: 8px 10px; border-bottom: 1.5px solid #f1f5f9;
    background: #fff; flex-wrap: wrap;
}
.ap-tool-btn {
    height: 28px; padding: 0 8px; border-radius: 7px;
    display: flex; align-items: center; justify-content: center; gap: 4px;
    border: none; background: none; cursor: pointer;
    color: #64748b; font-size: 0.75rem; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.18s;
}
.ap-tool-btn:hover { background: #f0fdf4; color: #16a34a; }
.ap-tool-sep { width: 1px; height: 18px; background: #f1f5f9; margin: 0 3px; }
.ap-editor {
    min-height: 130px; padding: 13px 16px; outline: none;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a; line-height: 1.75; background: transparent;
}
.ap-editor:empty::before { content: attr(data-placeholder); color: #cbd5e1; pointer-events: none; }
.ap-editor b, .ap-editor strong { font-weight: 700; }
.ap-editor i, .ap-editor em { font-style: italic; }
.ap-editor h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 6px 0 4px; }
.ap-editor ul { padding-left: 20px; margin: 4px 0; }
.ap-editor ul li { margin-bottom: 3px; }

/* ── Right panel ── */
.ap-right { display: flex; flex-direction: column; gap: 16px; }

/* ── Best Selling ── */
.ap-bs-box {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px; background: #f8fafc;
    border: 1.5px solid #f1f5f9; border-radius: 16px;
    cursor: pointer; transition: border-color 0.2s, background 0.2s;
    user-select: none;
}
.ap-bs-box:hover { border-color: #bbf7d0; background: #f0fdf4; }
.ap-bs-box.active { border-color: #16a34a; background: #f0fdf4; }
.ap-bs-check {
    width: 22px; height: 22px; border-radius: 7px; margin-top: 1px;
    border: 2px solid #e2e8f0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.18s;
}
.ap-bs-check.on { border-color: #16a34a; background: #16a34a; }
.ap-bs-title { font-size: 0.82rem; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.ap-bs-sub   { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin: 0; line-height: 1.5; }

/* ── Tips card ── */
.ap-tips {
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 16px; padding: 16px;
}
.ap-tips-title { font-size: 0.72rem; font-weight: 800; color: #15803d; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.08em; }
.ap-tip { display: flex; align-items: flex-start; gap: 8px; font-size: 0.78rem; color: #475569; margin-bottom: 7px; line-height: 1.5; }
.ap-tip:last-child { margin-bottom: 0; }
.ap-tip-dot { width: 5px; height: 5px; border-radius: 50%; background: #16a34a; flex-shrink: 0; margin-top: 6px; }

/* ── Submit ── */
.ap-submit {
    width: 100%; padding: 14px; background: #16a34a; color: #fff;
    font-size: 0.875rem; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    border: none; border-radius: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.22s; box-shadow: 0 4px 14px rgba(22,163,74,0.3);
}
.ap-submit:hover:not(:disabled) { background: #15803d; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(22,163,74,0.38); }
.ap-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

@media (max-width: 768px) { .ap-title { font-size: 1.25rem; } }
`;

const CATS = [
    "Electronics", "Clothing", "Home & Kitchen", "Beauty & Health",
    "Toys & Games", "Sports & Outdoors", "Books & Media",
    "Food & Drink", "Hobbies & Crafts", "Others"
];

export default function StoreAddProduct() {
    const { user } = useCurrentUser();
    const { showToast } = useFloatingToast();
    const editorRef = useRef(null);

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
    const [info, setInfo] = useState({
        name: "", mrp: "", price: "", category: "", bestSelling: false,
    });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setInfo(p => ({ ...p, [e.target.name]: e.target.value }));

    const exec = (cmd) => { editorRef.current?.focus(); document.execCommand(cmd, false, null); };
    const insertBullet  = () => { editorRef.current?.focus(); document.execCommand('insertUnorderedList', false, null); };
    const insertHeading = () => { editorRef.current?.focus(); document.execCommand('formatBlock', false, 'h3'); };
    const insertBlank   = () => { editorRef.current?.focus(); document.execCommand('insertParagraph', false, null); document.execCommand('insertParagraph', false, null); };

    const removeImage = (e, key) => {
        e.preventDefault(); e.stopPropagation();
        setImages(p => ({ ...p, [key]: null }));
        showToast("Image removed successfully", "success");
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        // Validation checks with meaningful error messages
        if (!user) {
            showToast("Please login to add products", "error");
            return;
        }

        const desc = editorRef.current?.innerHTML || '';
        if (!desc.replace(/<[^>]+>/g, '').trim()) {
            showToast("Product description is required", "error");
            return;
        }

        const mrp = parseFloat(info.mrp);
        const price = info.price !== "" ? parseFloat(info.price) : mrp;

        if (!info.name.trim()) {
            showToast("Product name is required", "error");
            return;
        }

        if (!info.category) {
            showToast("Please select a product category", "error");
            return;
        }

        if (isNaN(mrp) || mrp <= 0) {
            showToast("Please enter a valid actual price", "error");
            return;
        }

        if (isNaN(price) || price <= 0) {
            showToast("Please enter a valid offer price", "error");
            return;
        }

        if (price > mrp) {
            showToast("Offer price cannot be higher than actual price", "error");
            return;
        }

        const files = Object.values(images).filter(Boolean);
        if (!files.length) {
            showToast("Please add at least one product image", "warning");
            return;
        }

        setLoading(true);
        showToast("Adding your product...", "info");

        try {
            const store = await getStoreByUser(user.uid);
            
            if (!store) {
                showToast("Store not found! Please create a store first", "error");
                setLoading(false);
                return;
            }

            // Upload images
            const imageUrls = await Promise.all(
                files.map((f, i) => uploadProductImage(f, `${store.id}-${Date.now()}-${i}`))
            );

            // Add product
            await addProduct({ 
                ...info, 
                description: desc, 
                mrp, 
                price, 
                storeId: store.id, 
                images: imageUrls 
            }, []);

            // Success! Reset form
            setInfo({ name: "", mrp: "", price: "", category: "", bestSelling: false });
            setImages({ 1: null, 2: null, 3: null, 4: null });
            if (editorRef.current) editorRef.current.innerHTML = '';

            showToast("🎉 Product added successfully!", "success");

        } catch (err) {
            console.error("Add product error:", err);
            showToast(err.message || "Failed to add product. Please try again", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{CSS}</style>
            <div className="ap-root">

                <div className="ap-header">
                    <h1 className="ap-title">Add New <span>Product</span></h1>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="ap-layout">

                        {/* ── LEFT — main form ── */}
                        <div className="ap-card">
                            <div className="ap-fields">

                                {/* Images */}
                                <div className="ap-field">
                                    <p className="ap-sec">Product Images</p>
                                    <div className="ap-img-grid">
                                        {Object.keys(images).map((key, idx) => (
                                            <label
                                                key={key}
                                                htmlFor={`img-${key}`}
                                                className={"ap-img-slot" + (images[key] ? " has-img" : "")}
                                            >
                                                {images[key] ? (
                                                    <>
                                                        <img src={URL.createObjectURL(images[key])} alt="" />
                                                        {idx === 0 && <span className="ap-img-badge">Main</span>}
                                                        <button
                                                            className="ap-img-remove"
                                                            onClick={e => removeImage(e, key)}
                                                        >
                                                            <XIcon size={10} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="ap-img-placeholder">
                                                        <ImagePlusIcon size={20} />
                                                        <span>Photo {idx + 1}</span>
                                                    </div>
                                                )}
                                                <input
                                                    type="file" accept="image/*" id={`img-${key}`}
                                                    onChange={e => {
                                                        setImages(p => ({ ...p, [key]: e.target.files[0] }));
                                                        showToast("Image added", "success");
                                                    }}
                                                    hidden
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Name */}
                                <div className="ap-field">
                                    <label className="ap-label"><TypeIcon size={12} /> Product Name</label>
                                    <input
                                        className="ap-input" type="text" name="name"
                                        placeholder="e.g. Wireless Headphones Pro"
                                        value={info.name} onChange={onChange} required
                                    />
                                </div>

                                {/* Description */}
                                <div className="ap-field">
                                    <label className="ap-label">Description</label>
                                    <div className="ap-editor-wrap">
                                        <div className="ap-toolbar">
                                            <button type="button" className="ap-tool-btn" onClick={() => exec('bold')} title="Bold">
                                                <BoldIcon size={12} /> Bold
                                            </button>
                                            <button type="button" className="ap-tool-btn" onClick={() => exec('italic')} title="Italic">
                                                <ItalicIcon size={12} /> Italic
                                            </button>
                                            <div className="ap-tool-sep" />
                                            <button type="button" className="ap-tool-btn" onClick={insertBullet} title="Bullet list">
                                                • Bullet
                                            </button>
                                            <button type="button" className="ap-tool-btn" onClick={insertHeading} title="Heading">
                                                H Heading
                                            </button>
                                            <div className="ap-tool-sep" />
                                            <button type="button" className="ap-tool-btn" onClick={insertBlank} title="Blank line">
                                                ↵ Line
                                            </button>
                                        </div>
                                        <div
                                            ref={editorRef}
                                            className="ap-editor"
                                            contentEditable
                                            suppressContentEditableWarning
                                            data-placeholder="Write a short product description..."
                                            spellCheck={false}
                                        />
                                    </div>
                                </div>

                                {/* Price row */}
                                <div className="ap-row">
                                    <div className="ap-field">
                                        <label className="ap-label">
                                            <CircleDollarSignIcon size={12} /> Actual Price
                                        </label>
                                        <input
                                            className="ap-input" type="number" name="mrp"
                                            placeholder="0.00" min="0"
                                            value={info.mrp} onChange={onChange} required
                                        />
                                    </div>
                                    <div className="ap-field">
                                        <label className="ap-label">
                                            <CircleDollarSignIcon size={12} /> Offer Price
                                            <span className="ap-optional">(optional)</span>
                                        </label>
                                        <input
                                            className="ap-input" type="number" name="price"
                                            placeholder="Same as actual" min="0"
                                            value={info.price} onChange={onChange}
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="ap-field">
                                    <label className="ap-label"><TagIcon size={12} /> Category</label>
                                    <div className="ap-select-wrap">
                                        <select
                                            className="ap-select"
                                            value={info.category}
                                            onChange={e => setInfo(p => ({ ...p, category: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {CATS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                        <svg className="ap-select-arr" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ── RIGHT panel ── */}
                        <div className="ap-right">

                            {/* Best Selling */}
                            <div className="ap-card" style={{ padding: '18px 18px' }}>
                                <p className="ap-sec">Visibility</p>
                                <div
                                    className={"ap-bs-box" + (info.bestSelling ? " active" : "")}
                                    onClick={() => setInfo(p => ({ ...p, bestSelling: !p.bestSelling }))}
                                >
                                    <div className={"ap-bs-check" + (info.bestSelling ? " on" : "")}>
                                        {info.bestSelling && (
                                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <p className="ap-bs-title">
                                            <StarIcon size={11} style={{ display: 'inline', marginRight: 4, color: '#f59e0b' }} />
                                            Mark as Best Selling
                                        </p>
                                        <p className="ap-bs-sub">Shows in Best Selling section on homepage</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="ap-tips">
                                <p className="ap-tips-title">💡 Tips</p>
                                <div className="ap-tip"><div className="ap-tip-dot" /><span>Add at least 2–3 clear product photos for better conversions</span></div>
                                <div className="ap-tip"><div className="ap-tip-dot" /><span>First image will be shown as the main product thumbnail</span></div>
                                <div className="ap-tip"><div className="ap-tip-dot" /><span>Set an offer price lower than actual price to show a discount badge</span></div>
                                <div className="ap-tip"><div className="ap-tip-dot" /><span>Write a clear, keyword-rich description to help customers find your product</span></div>
                            </div>

                            {/* Submit */}
                            <button type="submit" className="ap-submit" disabled={loading}>
                                <PackageIcon size={16} />
                                {loading ? "Adding..." : "Add Product"}
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}