import { useEffect, useState, useRef } from "react";
import Loading from "../../components/Loading";
import { useCurrentUser } from "../../hooks/useAuth";
import { getStoreByUser } from "../../lib/services/storeService";
import { getProductsByStore } from "../../lib/services/productService";
import { uploadProductImage } from "../../lib/supabase";
import { db } from "../../lib/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { PackageIcon, Trash2Icon, PencilIcon, XIcon, CheckIcon, ImagePlusIcon, ChevronDownIcon, BoldIcon, ItalicIcon } from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; }

.mp-root { font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 80px; max-width: 100%; }

.mp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
.mp-title { font-size: 1.5rem; font-weight: 500; color: #64748b; margin: 0 0 3px; }
.mp-subtitle { font-size: 0.82rem; color: #94a3b8; margin: 0; font-weight: 400; }
.mp-title span { color: #0f172a; font-weight: 800; }
.mp-count { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 100px; }

.mp-alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; font-size: 0.825rem; font-weight: 500; line-height: 1.5; margin-bottom: 18px; }
.mp-alert-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; font-size: 0.65rem; font-weight: 800; }
.mp-alert.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.mp-alert.error   .mp-alert-icon { background: #fda4af; color: #9f1239; }
.mp-alert.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.mp-alert.success .mp-alert-icon { background: #86efac; color: #14532d; }
.mp-alert.warning { background: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; }
.mp-alert.warning .mp-alert-icon { background: #fcd34d; color: #92400e; }
.mp-alert-body { flex: 1; font-size: 0.8rem; min-width: 0; word-break: break-word; }
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
.mp-toggle-track { position: relative; width: 40px; height: 22px; background: #e2e8f0; border-radius: 11px; cursor: pointer; transition: background 0.2s; display: inline-block; flex-shrink: 0; }
.mp-toggle-track:has(input:checked) { background: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.12); }
.mp-toggle-track input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; margin: 0; }
.mp-toggle-thumb { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 0.2s; pointer-events: none; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
.mp-toggle-track:has(input:checked) .mp-toggle-thumb { transform: translateX(18px); }
.mp-actions { display: flex; align-items: center; gap: 6px; }
.mp-btn { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #f1f5f9; background: #f8fafc; cursor: pointer; transition: all 0.18s; flex-shrink: 0; color: #64748b; }
.mp-btn.edit:hover { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; }
.mp-btn.del:hover  { background: #fff1f2; border-color: #fecdd3; color: #ef4444; }

/* ── Mobile Cards — FIXED ── */
.mp-mobile-list { display: none; flex-direction: column; gap: 12px; }
.mp-card { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 18px; overflow: hidden; transition: border-color 0.2s; width: 100%; }
.mp-card:hover { border-color: #e2e8f0; }

.mp-card-top { display: flex; align-items: flex-start; gap: 12px; padding: 14px 14px 0; }
.mp-card-img { width: 60px; height: 60px; min-width: 60px; border-radius: 14px; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.mp-card-img img { width: 44px; height: 44px; object-fit: contain; mix-blend-mode: multiply; }
.mp-card-info { flex: 1; min-width: 0; }
.mp-card-name { font-size: 0.875rem; font-weight: 700; color: #0f172a; line-height: 1.3; margin-bottom: 5px; word-break: break-word; }
.mp-card-prices { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.mp-card-price { font-size: 0.9rem; font-weight: 800; color: #16a34a; }
.mp-card-mrp   { font-size: 0.75rem; color: #cbd5e1; text-decoration: line-through; }

.mp-card-desc { font-size: 0.78rem; color: #94a3b8; line-height: 1.55; margin: 10px 14px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word; }

.mp-card-bottom { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; border-top: 1.5px solid #f8fafc; margin-top: 12px; gap: 10px; }
.mp-card-stock-info { display: flex; align-items: center; gap: 8px; }
.mp-card-stock-label { font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
.mp-card-btns { display: flex; align-items: center; gap: 6px; }

/* ── Edit Modal ── */
.mp-modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(15,23,42,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.mp-modal { background: #fff; border-radius: 24px; width: 100%; max-width: 520px; max-height: 92vh; overflow-y: auto; padding: 28px 24px 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.15); }
.mp-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.mp-modal-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0; }
.mp-modal-close { width: 30px; height: 30px; border-radius: 50%; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.18s; flex-shrink: 0; }
.mp-modal-close:hover { background: #fff1f2; border-color: #fecdd3; color: #ef4444; }

.mp-modal-sec { font-size: 0.6rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.14em; margin: 18px 0 10px; display: flex; align-items: center; gap: 6px; }
.mp-modal-sec::after { content: ''; flex: 1; height: 1.5px; background: #f1f5f9; }
.mp-modal-sec:first-of-type { margin-top: 0; }

.mp-img-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 4px; width: 100%; }
.mp-img-slot { position: relative; aspect-ratio: 1/1; border-radius: 12px; border: 1.5px dashed #e2e8f0; background: #f8fafc; overflow: hidden; transition: border-color 0.2s; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; }
.mp-img-slot:hover { border-color: #16a34a; background: #f0fdf4; }
.mp-img-slot.has-img { border-style: solid; border-color: #bbf7d0; }
.mp-img-slot img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
.mp-img-placeholder { display: flex; flex-direction: column; align-items: center; gap: 3px; color: #cbd5e1; }
.mp-img-slot:hover .mp-img-placeholder { color: #16a34a; }
.mp-img-placeholder span { font-size: 0.5rem; font-weight: 600; }
.mp-img-remove { position: absolute; top: 3px; right: 3px; width: 16px; height: 16px; border-radius: 50%; background: rgba(15,23,42,0.5); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; z-index: 2; }
.mp-img-remove:hover { background: #ef4444; }
.mp-img-badge { position: absolute; bottom: 3px; left: 3px; font-size: 0.45rem; font-weight: 700; background: #16a34a; color: #fff; padding: 1px 4px; border-radius: 3px; }

.mp-field { margin-bottom: 12px; }
.mp-field-label { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; display: block; }
.mp-field-input { width: 100%; padding: 10px 13px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; color: #0f172a; background: #f8fafc; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
.mp-field-input:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }
.mp-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

/* ✅ Rich Text Editor in modal */
.mp-editor-wrap { border: 1.5px solid #f1f5f9; border-radius: 12px; background: #f8fafc; overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.mp-editor-wrap:focus-within { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }
.mp-toolbar { display: flex; align-items: center; gap: 2px; padding: 6px 8px; border-bottom: 1.5px solid #f1f5f9; background: #fff; flex-wrap: wrap; }
.mp-tool-btn { height: 24px; padding: 0 7px; border-radius: 5px; display: flex; align-items: center; justify-content: center; gap: 3px; border: none; background: none; cursor: pointer; color: #64748b; font-size: 0.7rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; white-space: nowrap; }
.mp-tool-btn:hover { background: #f0fdf4; color: #16a34a; }
.mp-tool-sep { width: 1px; height: 14px; background: #f1f5f9; margin: 0 2px; }
.mp-editor { min-height: 100px; padding: 11px 13px; outline: none; font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; line-height: 1.75; background: transparent; word-break: break-word; overflow-wrap: break-word; }
.mp-editor:empty::before { content: attr(data-placeholder); color: #cbd5e1; pointer-events: none; }
.mp-editor b, .mp-editor strong { font-weight: 700; }
.mp-editor i, .mp-editor em { font-style: italic; }
.mp-editor h3 { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 5px 0 3px; }
.mp-editor ul { padding-left: 18px; margin: 3px 0; }
.mp-editor ul li { margin-bottom: 2px; }

/* Chips */
.mp-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.mp-chip { padding: 4px 11px; border-radius: 100px; font-size: 0.72rem; font-weight: 600; border: 1.5px solid #f1f5f9; background: #f8fafc; color: #64748b; cursor: pointer; transition: all 0.15s; user-select: none; }
.mp-chip:hover { border-color: #bbf7d0; color: #16a34a; background: #f0fdf4; }
.mp-chip.sel { border-color: #16a34a; background: #f0fdf4; color: #16a34a; font-weight: 700; }

/* Dropdown */
.mp-dd { position: relative; width: 100%; }
.mp-dd-trigger { width: 100%; padding: 10px 36px 10px 13px; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 0.85rem; font-family: 'Plus Jakarta Sans', sans-serif; background: #f8fafc; outline: none; box-sizing: border-box; cursor: pointer; display: flex; align-items: center; min-height: 40px; color: #cbd5e1; font-weight: 400; transition: border-color 0.2s; }
.mp-dd-trigger.has-val { color: #0f172a; font-weight: 500; }
.mp-dd-trigger.open { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,0.09); }
.mp-dd-icon { position: absolute; right: 11px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #94a3b8; transition: transform 0.2s; }
.mp-dd-icon.open { transform: translateY(-50%) rotate(180deg); }
.mp-dd-menu { position: absolute; top: calc(100% + 5px); left: 0; right: 0; z-index: 99999; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); overflow: hidden; animation: mp-dd-in 0.12s ease both; }
@keyframes mp-dd-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
.mp-dd-scroll { max-height: 180px; overflow-y: auto; padding: 4px; }
.mp-dd-item { padding: 8px 11px; font-size: 0.8rem; font-weight: 500; color: #475569; cursor: pointer; border-radius: 8px; transition: background 0.1s; display: flex; align-items: center; justify-content: space-between; }
.mp-dd-item:hover { background: #f0fdf4; color: #15803d; }
.mp-dd-item.sel { background: #f0fdf4; color: #15803d; font-weight: 700; }

.mp-modal-save { width: 100%; padding: 13px; background: #16a34a; color: #fff; font-size: 0.84rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; border: none; border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; margin-top: 16px; box-shadow: 0 4px 14px rgba(22,163,74,0.28); }
.mp-modal-save:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); }
.mp-modal-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
.mp-save-dots { display: inline-flex; align-items: center; gap: 4px; }
.mp-save-dots span { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.85); display: inline-block; animation: mp-dot 1.1s ease-in-out infinite; }
.mp-save-dots span:nth-child(2) { animation-delay: 0.18s; }
.mp-save-dots span:nth-child(3) { animation-delay: 0.36s; }
@keyframes mp-dot { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }

/* ── Delete Modal ── */
.mp-del-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(15,23,42,0.45); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 20px; }
.mp-del-modal { background: #fff; border: 1.5px solid #f1f5f9; border-radius: 24px; max-width: 360px; width: 100%; padding: 28px 24px 24px; box-shadow: 0 24px 60px rgba(0,0,0,0.12); }
.mp-del-product { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #fff1f2; border: 1.5px solid #fecdd3; border-radius: 14px; margin-bottom: 20px; }
.mp-del-product-img { width: 44px; height: 44px; border-radius: 10px; background: #fff; border: 1.5px solid #fecdd3; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; }
.mp-del-product-img img { width: 32px; height: 32px; object-fit: contain; mix-blend-mode: multiply; }
.mp-del-product-name { font-size: 0.8rem; font-weight: 700; color: #9f1239; line-height: 1.4; word-break: break-word; }
.mp-del-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.mp-del-title-wrap { display: flex; align-items: center; gap: 9px; }
.mp-del-icon { width: 34px; height: 34px; border-radius: 10px; background: #fff1f2; border: 1.5px solid #fecdd3; display: flex; align-items: center; justify-content: center; color: #ef4444; flex-shrink: 0; }
.mp-del-title { font-size: 0.95rem; font-weight: 800; color: #0f172a; margin: 0; }
.mp-del-close { width: 28px; height: 28px; border-radius: 50%; background: #f8fafc; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #94a3b8; transition: all 0.18s; flex-shrink: 0; }
.mp-del-close:hover { background: #fff1f2; border-color: #fecdd3; color: #ef4444; }
.mp-del-sub { font-size: 0.78rem; color: #94a3b8; line-height: 1.6; margin: 0 0 20px; }
.mp-del-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.mp-del-cancel { padding: 11px; border-radius: 12px; border: 1.5px solid #f1f5f9; color: #64748b; background: #f8fafc; font-size: 0.8rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; }
.mp-del-cancel:hover { border-color: #e2e8f0; background: #fff; }
.mp-del-confirm { padding: 11px; border-radius: 12px; border: none; background: #ef4444; color: #fff; font-size: 0.8rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; transition: all 0.18s; }
.mp-del-confirm:hover { background: #dc2626; }
.mp-del-confirm:disabled { opacity: 0.6; cursor: not-allowed; }

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

const CATS = [
    "Clothing", "Electronics", "Gadgets", "Home & Kitchen",
    "Beauty & Health", "Toys & Games", "Sports & Outdoors",
    "Books & Media", "Food & Drink", "Hobbies & Crafts", "Others"
];

const CAT_FIELDS = {
    "Clothing":        { chips: { size: { label: "Size", options: ["XS","S","M","L","XL","XXL","XXXL"] }, color: { label: "Color", options: ["Black","White","Red","Blue","Green","Yellow","Pink","Gray","Brown","Navy","Purple","Orange"] } }, inputs: [{ key: "material", label: "Material", placeholder: "e.g. Cotton" }] },
    "Electronics":     { chips: {}, inputs: [{ key: "brand", label: "Brand", placeholder: "e.g. Samsung" }, { key: "warranty", label: "Warranty", placeholder: "e.g. 1 Year" }, { key: "connectivity", label: "Connectivity", placeholder: "e.g. WiFi, Bluetooth" }, { key: "model", label: "Model No.", placeholder: "e.g. SM-A546B" }] },
    "Gadgets":         { chips: {}, inputs: [{ key: "brand", label: "Brand", placeholder: "e.g. Apple" }, { key: "warranty", label: "Warranty", placeholder: "e.g. 6 Months" }, { key: "connectivity", label: "Connectivity", placeholder: "e.g. Bluetooth 5.0" }, { key: "model", label: "Model No.", placeholder: "e.g. Pro Max 2024" }] },
    "Home & Kitchen":  { chips: { color: { label: "Color", options: ["Black","White","Silver","Red","Blue","Brown","Beige","Gray"] } }, inputs: [{ key: "material", label: "Material", placeholder: "e.g. Stainless Steel" }, { key: "dimensions", label: "Dimensions", placeholder: "e.g. 30cm x 20cm" }] },
    "Beauty & Health": { chips: { skinType: { label: "Skin Type", options: ["All Skin","Oily","Dry","Combination","Sensitive","Normal"] } }, inputs: [{ key: "volume", label: "Volume / Weight", placeholder: "e.g. 200ml" }, { key: "ingredients", label: "Key Ingredients", placeholder: "e.g. Vitamin C" }] },
    "Toys & Games":    { chips: { ageRange: { label: "Age Range", options: ["0-2 yrs","3-5 yrs","6-8 yrs","9-12 yrs","13+ yrs","All Ages"] } }, inputs: [{ key: "material", label: "Material", placeholder: "e.g. Plastic" }, { key: "batteryRequired", label: "Battery Required", placeholder: "e.g. AA x 2" }] },
    "Sports & Outdoors": { chips: { size: { label: "Size", options: ["XS","S","M","L","XL","XXL"] }, color: { label: "Color", options: ["Black","White","Red","Blue","Green","Yellow","Gray","Navy"] } }, inputs: [{ key: "material", label: "Material", placeholder: "e.g. Nylon" }] },
    "Books & Media":   { chips: { language: { label: "Language", options: ["Bengali","English","Hindi","Arabic","Other"] } }, inputs: [{ key: "author", label: "Author", placeholder: "e.g. Humayun Ahmed" }, { key: "publisher", label: "Publisher", placeholder: "e.g. Ananya" }, { key: "isbn", label: "ISBN", placeholder: "e.g. 978-3-16..." }] },
    "Food & Drink":    { chips: {}, inputs: [{ key: "weight", label: "Weight / Volume", placeholder: "e.g. 500g" }, { key: "expiry", label: "Expiry / Shelf Life", placeholder: "e.g. 12 months" }, { key: "allergens", label: "Allergens", placeholder: "e.g. Contains nuts" }] },
    "Hobbies & Crafts": { chips: { color: { label: "Color", options: ["Black","White","Red","Blue","Green","Yellow","Mixed","Custom"] } }, inputs: [{ key: "material", label: "Material", placeholder: "e.g. Wood" }, { key: "dimensions", label: "Dimensions", placeholder: "e.g. A4" }] },
    "Others": { chips: {}, inputs: [] },
};

const stripHtml = (str) => str?.replace(/<[^>]+>/g, '') || "";

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

const Dropdown = ({ value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);
    return (
        <div className="mp-dd" ref={ref}>
            <div className={`mp-dd-trigger${value ? ' has-val' : ''}${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}>
                {value || "Select category"}
            </div>
            <div className={`mp-dd-icon${open ? ' open' : ''}`}><ChevronDownIcon size={13} /></div>
            {open && (
                <div className="mp-dd-menu">
                    <div className="mp-dd-scroll">
                        {options.map(opt => (
                            <div key={opt} className={`mp-dd-item${value === opt ? ' sel' : ''}`} onClick={() => { onChange(opt); setOpen(false); }}>
                                {opt}
                                {value === opt && <CheckIcon size={12} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ChipSelect = ({ label, options, selected = [], onChange }) => {
    const toggle = (opt) => {
        const s = new Set(selected);
        s.has(opt) ? s.delete(opt) : s.add(opt);
        onChange([...s]);
    };
    return (
        <div className="mp-field">
            <label className="mp-field-label">{label}</label>
            <div className="mp-chips">
                {options.map(opt => (
                    <span key={opt} className={`mp-chip${selected.includes(opt) ? ' sel' : ''}`} onClick={() => toggle(opt)}>{opt}</span>
                ))}
            </div>
        </div>
    );
};

export default function StoreManageProducts() {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "৳";
    const { user, loading: userLoading } = useCurrentUser();
    const editorRef = useRef(null);

    const [loading,    setLoading]    = useState(true);
    const [saving,     setSaving]     = useState(false);
    const [deleting,   setDeleting]   = useState(false);
    const [products,   setProducts]   = useState([]);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm,   setEditForm]   = useState({});
    const [editImages, setEditImages] = useState([]);
    const [delTarget,  setDelTarget]  = useState(null);
    const [alert,      setAlert]      = useState(null);

    const showAlert  = (type, message) => setAlert({ type, message });
    const clearAlert = () => setAlert(null);

    useEffect(() => {
        if (userLoading) return;
        const fetchData = async () => {
            if (!user) { setLoading(false); showAlert("warning", "Please login."); return; }
            try {
                const store = await getStoreByUser(user.uid);
                if (!store) { setLoading(false); showAlert("warning", "No store found."); return; }
                const list = await getProductsByStore(store.id);
                setProducts(list);
            } catch (err) {
                console.error(err);
                showAlert("error", "Failed to load products.");
            } finally { setLoading(false); }
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
            console.error(err);
            showAlert("error", "Failed to update stock.");
        }
    };

    const openEdit = (product) => {
        clearAlert();
        setEditTarget(product);
        const imgs = (product.images || []).map(url => ({ url, file: null }));
        while (imgs.length < 4) imgs.push({ url: null, file: null });
        setEditImages(imgs);

        const config = CAT_FIELDS[product.category] || { chips: {}, inputs: [] };
        const catData = {};
        Object.keys(config.chips).forEach(k => { catData[k] = product[k] || []; });
        config.inputs.forEach(({ key }) => { catData[key] = product[key] || ""; });

        setEditForm({
            name:        product.name        || "",
            price:       String(product.price || ""),
            mrp:         String(product.mrp   || ""),
            category:    product.category    || "",
            bestSelling: product.bestSelling || false,
            ...catData,
        });

        // ✅ description টা HTML হিসেবে editor এ set করবো
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.innerHTML = product.description || "";
            }
        }, 50);
    };

    const handleCategoryChange = (cat) => {
        const config = CAT_FIELDS[cat] || { chips: {}, inputs: [] };
        const catData = {};
        Object.keys(config.chips).forEach(k => { catData[k] = []; });
        config.inputs.forEach(({ key }) => { catData[key] = ""; });
        setEditForm(p => ({ ...p, category: cat, ...catData }));
    };

    const handleImageChange = (idx, file) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setEditImages(prev => { const next = [...prev]; next[idx] = { url, file }; return next; });
    };

    const removeEditImage = (e, idx) => {
        e.preventDefault(); e.stopPropagation();
        setEditImages(prev => { const next = [...prev]; next[idx] = { url: null, file: null }; return next; });
    };

    const exec          = (cmd) => { editorRef.current?.focus(); document.execCommand(cmd, false, null); };
    const insertBullet  = () => { editorRef.current?.focus(); document.execCommand('insertUnorderedList', false, null); };
    const insertHeading = () => { editorRef.current?.focus(); document.execCommand('formatBlock', false, 'h3'); };

    const saveEdit = async () => {
        if (!editTarget) return;
        const price = parseFloat(editForm.price);
        const mrp   = parseFloat(editForm.mrp);
        const desc  = editorRef.current?.innerHTML || '';

        if (!editForm.name.trim())      { showAlert("error", "Product name is required."); return; }
        if (isNaN(price) || price <= 0) { showAlert("error", "Please enter a valid sale price."); return; }
        if (!isNaN(mrp) && mrp < price) { showAlert("warning", "MRP cannot be less than sale price."); return; }

        setSaving(true);
        try {
            const finalImages = await Promise.all(
                editImages.map(async ({ url, file }, i) => {
                    if (!url) return null;
                    if (file) return await uploadProductImage(file, `${editTarget.id}-edit-${Date.now()}-${i}`);
                    return url;
                })
            );
            const imageUrls = finalImages.filter(Boolean);

            const config = CAT_FIELDS[editForm.category] || { chips: {}, inputs: [] };
            const catData = {};
            Object.keys(config.chips).forEach(k => { catData[k] = editForm[k]?.length > 0 ? editForm[k] : []; });
            config.inputs.forEach(({ key }) => { catData[key] = editForm[key]?.trim() || ""; });

            const updates = {
                name:        editForm.name.trim(),
                price,
                mrp:         isNaN(mrp) ? (editTarget.mrp || 0) : mrp,
                category:    editForm.category,
                description: desc,
                bestSelling: editForm.bestSelling || false,
                images:      imageUrls,
                ...catData,
            };

            await updateDoc(doc(db, "products", editTarget.id), updates);
            setProducts(prev => prev.map(p => p.id === editTarget.id ? { ...p, ...updates } : p));
            setEditTarget(null);
            showAlert("success", "Product updated successfully.");
        } catch (err) {
            console.error(err);
            showAlert("error", "Failed to update product.");
        } finally { setSaving(false); }
    };

    // ✅ Delete fix — proper async/await with loading state
    const confirmDelete = async () => {
        if (!delTarget) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "products", delTarget.id));
            setProducts(prev => prev.filter(p => p.id !== delTarget.id));
            setDelTarget(null);
            showAlert("success", `"${delTarget.name}" has been deleted.`);
        } catch (err) {
            console.error("Delete error:", err);
            showAlert("error", "Failed to delete product. Please try again.");
            setDelTarget(null);
        } finally { setDeleting(false); }
    };

    if (userLoading || loading) return <Loading />;

    const catConfig = editForm.category ? (CAT_FIELDS[editForm.category] || { chips: {}, inputs: [] }) : null;

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
                                    <col style={{ width: '26%' }} /><col style={{ width: '34%' }} />
                                    <col style={{ width: '14%' }} /><col style={{ width: '10%' }} /><col style={{ width: '16%' }} />
                                </colgroup>
                                <thead><tr><th>Product</th><th>Description</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td><div className="mp-product-cell"><div className="mp-img-wrap"><img src={product.images?.[0]} alt={product.name} /></div><span className="mp-product-name">{product.name}</span></div></td>
                                            <td><span className="mp-desc-text">{stripHtml(product.description)}</span></td>
                                            <td>
                                                <div className="mp-price">{currency}{product.price?.toLocaleString()}</div>
                                                {product.mrp > product.price && <div><span className="mp-mrp">{currency}{product.mrp?.toLocaleString()}</span></div>}
                                            </td>
                                            <td><label className="mp-toggle-track"><input type="checkbox" checked={!!product.inStock} onChange={() => toggleStock(product)} /><span className="mp-toggle-thumb" /></label></td>
                                            <td><div className="mp-actions"><button className="mp-btn edit" onClick={() => openEdit(product)}><PencilIcon size={13} /></button><button className="mp-btn del" onClick={() => setDelTarget(product)}><Trash2Icon size={13} /></button></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Mobile Cards — FIXED ── */}
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
                                                {product.mrp > product.price && <span className="mp-card-mrp">{currency}{product.mrp?.toLocaleString()}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {product.description && (
                                        <p className="mp-card-desc">{stripHtml(product.description)}</p>
                                    )}

                                    <div className="mp-card-bottom">
                                        <div className="mp-card-stock-info">
                                            <span className="mp-card-stock-label">In Stock</span>
                                            <label className="mp-toggle-track">
                                                <input type="checkbox" checked={!!product.inStock} onChange={() => toggleStock(product)} />
                                                <span className="mp-toggle-thumb" />
                                            </label>
                                        </div>
                                        <div className="mp-card-btns">
                                            <button className="mp-btn edit" onClick={() => openEdit(product)}><PencilIcon size={14} /></button>
                                            <button className="mp-btn del" onClick={() => setDelTarget(product)}><Trash2Icon size={14} /></button>
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
                <div className="mp-modal-overlay" onClick={() => !saving && setEditTarget(null)}>
                    <div className="mp-modal" onClick={e => e.stopPropagation()}>
                        <div className="mp-modal-head">
                            <p className="mp-modal-title">Edit Product</p>
                            <button className="mp-modal-close" onClick={() => setEditTarget(null)}><XIcon size={13} /></button>
                        </div>

                        {/* Images */}
                        <p className="mp-modal-sec">Images</p>
                        <div className="mp-img-grid">
                            {editImages.map(({ url }, idx) => (
                                <label key={idx} htmlFor={`edit-img-${idx}`} className={`mp-img-slot${url ? ' has-img' : ''}`}>
                                    {url ? (
                                        <>
                                            <img src={url} alt="" />
                                            {idx === 0 && <span className="mp-img-badge">Main</span>}
                                            <button className="mp-img-remove" onClick={e => removeEditImage(e, idx)}><XIcon size={7} /></button>
                                        </>
                                    ) : (
                                        <div className="mp-img-placeholder">
                                            <ImagePlusIcon size={13} />
                                            <span>Photo {idx + 1}</span>
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" id={`edit-img-${idx}`} onChange={e => handleImageChange(idx, e.target.files[0])} hidden />
                                </label>
                            ))}
                        </div>

                        {/* Basic Info */}
                        <p className="mp-modal-sec">Basic Info</p>
                        <div className="mp-field">
                            <label className="mp-field-label">Product Name</label>
                            <input className="mp-field-input" type="text" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} placeholder="Product name" />
                        </div>
                        <div className="mp-field-row">
                            <div className="mp-field">
                                <label className="mp-field-label">Sale Price *</label>
                                <input className="mp-field-input" type="number" value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))} />
                            </div>
                            <div className="mp-field">
                                <label className="mp-field-label">MRP (Original)</label>
                                <input className="mp-field-input" type="number" value={editForm.mrp} onChange={e => setEditForm(p => ({ ...p, mrp: e.target.value }))} />
                            </div>
                        </div>
                        <div className="mp-field">
                            <label className="mp-field-label">Category</label>
                            <Dropdown value={editForm.category} onChange={handleCategoryChange} options={CATS} />
                        </div>

                        {/* ✅ Rich Text Description Editor — AddProduct এর মতো */}
                        <div className="mp-field">
                            <label className="mp-field-label">Description</label>
                            <div className="mp-editor-wrap">
                                <div className="mp-toolbar">
                                    <button type="button" className="mp-tool-btn" onClick={() => exec('bold')}><BoldIcon size={11} /> Bold</button>
                                    <button type="button" className="mp-tool-btn" onClick={() => exec('italic')}><ItalicIcon size={11} /> Italic</button>
                                    <div className="mp-tool-sep" />
                                    <button type="button" className="mp-tool-btn" onClick={insertBullet}>• Bullet</button>
                                    <button type="button" className="mp-tool-btn" onClick={insertHeading}>H Head</button>
                                </div>
                                <div
                                    ref={editorRef}
                                    className="mp-editor"
                                    contentEditable
                                    suppressContentEditableWarning
                                    data-placeholder="Write product description..."
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                        {/* Category-specific fields */}
                        {catConfig && (Object.keys(catConfig.chips).length > 0 || catConfig.inputs.length > 0) && (
                            <>
                                <p className="mp-modal-sec">{editForm.category} Details</p>
                                {Object.entries(catConfig.chips).map(([key, { label, options }]) => (
                                    <ChipSelect key={key} label={label} options={options} selected={editForm[key] || []} onChange={val => setEditForm(p => ({ ...p, [key]: val }))} />
                                ))}
                                {catConfig.inputs.length > 0 && (
                                    <div className={catConfig.inputs.length >= 2 ? "mp-field-row" : ""}>
                                        {catConfig.inputs.map(({ key, label, placeholder }) => (
                                            <div className="mp-field" key={key}>
                                                <label className="mp-field-label">{label}</label>
                                                <input className="mp-field-input" type="text" placeholder={placeholder} value={editForm[key] || ""} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Best Selling */}
                        <p className="mp-modal-sec">Visibility</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 12, border: '1.5px solid #f1f5f9', cursor: 'pointer' }} onClick={() => setEditForm(p => ({ ...p, bestSelling: !p.bestSelling }))}>
                            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${editForm.bestSelling ? '#16a34a' : '#e2e8f0'}`, background: editForm.bestSelling ? '#16a34a' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                                {editForm.bestSelling && <CheckIcon size={11} color="#fff" />}
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>Mark as Best Selling</span>
                        </div>

                        <button className="mp-modal-save" onClick={saveEdit} disabled={saving}>
                            {saving ? <span className="mp-save-dots"><span /><span /><span /></span> : <><CheckIcon size={15} /> Save Changes</>}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Delete Modal ── */}
            {delTarget && (
                <div className="mp-del-overlay" onClick={() => !deleting && setDelTarget(null)}>
                    <div className="mp-del-modal" onClick={e => e.stopPropagation()}>
                        <div className="mp-del-head">
                            <div className="mp-del-title-wrap">
                                <div className="mp-del-icon"><Trash2Icon size={16} /></div>
                                <p className="mp-del-title">Delete Product?</p>
                            </div>
                            <button className="mp-del-close" onClick={() => setDelTarget(null)} disabled={deleting}><XIcon size={12} /></button>
                        </div>
                        <div className="mp-del-product">
                            <div className="mp-del-product-img"><img src={delTarget.images?.[0]} alt={delTarget.name} /></div>
                            <p className="mp-del-product-name">{delTarget.name}</p>
                        </div>
                        <p className="mp-del-sub">This product will be permanently removed and cannot be recovered.</p>
                        <div className="mp-del-btns">
                            <button className="mp-del-cancel" onClick={() => setDelTarget(null)} disabled={deleting}>Cancel</button>
                            <button className="mp-del-confirm" onClick={confirmDelete} disabled={deleting}>
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}