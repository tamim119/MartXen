import { ArrowRight, StarIcon, UserCircleIcon, CheckCircle, XCircle } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useCurrentUser } from "../hooks/useAuth"
import { addProductReview } from "../lib/services/reviewService"

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.pdesc-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    margin: 64px 0 40px;
    animation: pdesc-fadeUp 0.6s 0.3s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes pdesc-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
.pdesc-tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1.5px solid #f1f5f9;
    margin-bottom: 32px;
    max-width: 480px;
}
.pdesc-tab {
    padding: 10px 20px;
    font-size: 0.85rem;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: none;
    border: none;
    border-bottom: 2.5px solid transparent;
    margin-bottom: -1.5px;
    cursor: pointer;
    color: #94a3b8;
    border-radius: 8px 8px 0 0;
    transition: color 0.2s, border-color 0.2s, background 0.18s;
    letter-spacing: 0.1px;
}
.pdesc-tab:hover { color: #16a34a; background: #f0fdf4; }
.pdesc-tab.active { color: #16a34a; border-bottom-color: #16a34a; background: none; }
.pdesc-text {
    font-size: 0.9rem;
    line-height: 1.85;
    color: #475569;
    max-width: 640px;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 18px;
    padding: 24px 28px;
    animation: pdesc-fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
}
.pdesc-text b, .pdesc-text strong { font-weight: 700; color: #0f172a; }
.pdesc-text i, .pdesc-text em { font-style: italic; }
.pdesc-text h3 { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 14px 0 6px; line-height: 1.3; }
.pdesc-text h3:first-child { margin-top: 0; }
.pdesc-text ul { padding-left: 20px; margin: 8px 0; list-style-type: disc; }
.pdesc-text ul li { margin-bottom: 5px; color: #475569; line-height: 1.65; }
.pdesc-text p { margin: 6px 0; }
.pdesc-text p:empty { margin: 4px 0; height: 6px; }
.pdesc-text br { display: block; margin: 2px 0; }

/* ── Inline Toast ── */
@keyframes rf-toast-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
}
.rf-toast {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 16px;
    animation: rf-toast-in 0.25s cubic-bezier(0.4,0,0.2,1) both;
    max-width: 640px;
}
.rf-toast.error   { background: #fff1f2; border: 1.5px solid #fecdd3; color: #9f1239; }
.rf-toast.success { background: #f0fdf4; border: 1.5px solid #bbf7d0; color: #14532d; }
.rf-toast svg { flex-shrink: 0; }

/* ── Review Form ── */
.review-form-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 18px;
    padding: 24px 28px;
    margin-bottom: 32px;
    max-width: 640px;
}
.review-form-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin-bottom: 20px; }
.review-user-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding: 10px 14px;
    background: #fff;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
}
.review-user-avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1.5px solid #e2e8f0; flex-shrink: 0; }
.review-user-name { font-size: 0.84rem; font-weight: 700; color: #0f172a; }
.review-user-email { font-size: 0.72rem; color: #94a3b8; font-weight: 400; }
.review-rating-wrapper { margin-bottom: 20px; }
.review-rating-label { font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 10px; display: block; }
.review-stars { display: flex; gap: 8px; }
.review-star { cursor: pointer; transition: transform 0.2s; }
.review-star:hover { transform: scale(1.2); }
.review-textarea {
    width: 100%; min-height: 120px; padding: 14px 16px;
    border: 1.5px solid #f1f5f9; border-radius: 12px;
    font-size: 0.875rem; font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a; background: #fff; resize: vertical;
    outline: none; transition: border-color 0.2s; box-sizing: border-box;
}
.review-textarea:focus { border-color: #16a34a; }
.review-textarea:disabled { background: #f8fafc; cursor: not-allowed; opacity: 0.6; }
.review-submit-btn {
    margin-top: 16px; padding: 12px 28px;
    background: #16a34a; color: #fff; border: none; border-radius: 12px;
    font-size: 0.875rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; transition: background 0.2s, transform 0.1s;
}
.review-submit-btn:hover:not(:disabled) { background: #15803d; }
.review-submit-btn:active { transform: scale(0.98); }
.review-submit-btn:disabled { background: #cbd5e1; cursor: not-allowed; opacity: 0.6; }
.review-login-msg { font-size: 0.875rem; color: #94a3b8; text-align: center; padding: 20px; }
.review-login-link { color: #16a34a; font-weight: 600; text-decoration: none; }
.review-login-link:hover { text-decoration: underline; }

/* ── Reviews ── */
.pdesc-reviews-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; max-width: 640px; }
.pdesc-reviews-divider-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
.pdesc-reviews-divider-line { flex: 1; height: 1.5px; background: #f1f5f9; }
.pdesc-reviews { display: flex; flex-direction: column; max-width: 640px; animation: pdesc-fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both; }
.pdesc-no-review { font-size: 0.85rem; color: #94a3b8; padding: 20px 0; }
.pdesc-review-card { display: flex; gap: 16px; padding: 22px 0; border-bottom: 1.5px solid #f1f5f9; }
.pdesc-review-card:last-child { border-bottom: none; }
.pdesc-avatar { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; flex-shrink: 0; background: #f1f5f9; display: none; }
.pdesc-avatar.loaded { display: block; }
.pdesc-avatar-placeholder { width: 42px; height: 42px; border-radius: 50%; border: 2px solid #e2e8f0; flex-shrink: 0; background: #f0fdf4; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; color: #16a34a; text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif; }
.pdesc-review-body { flex: 1; }
.pdesc-review-stars { display: flex; gap: 3px; margin-bottom: 8px; }
.pdesc-reviewer-name { font-size: 0.82rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.pdesc-review-text { font-size: 0.875rem; color: #475569; line-height: 1.75; max-width: 560px; margin-bottom: 6px; }
.pdesc-review-date { font-size: 0.775rem; color: #94a3b8; font-weight: 400; }
.pdesc-store { display: flex; align-items: center; gap: 14px; margin-top: 40px; padding: 18px 22px; background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 18px; max-width: 360px; transition: border-color 0.2s, box-shadow 0.2s; }
.pdesc-store:hover { border-color: #bbf7d0; box-shadow: 0 4px 16px rgba(22,163,74,0.08); }
.pdesc-store-logo { width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; flex-shrink: 0; }
.pdesc-store-name { font-size: 0.825rem; font-weight: 600; color: #334155; margin-bottom: 4px; }
.pdesc-store-link { display: inline-flex; align-items: center; gap: 5px; font-size: 0.8rem; font-weight: 600; color: #16a34a; text-decoration: none; transition: gap 0.18s; }
.pdesc-store-link:hover { gap: 8px; }
`;

const SmartAvatar = ({ name, image }) => {
    const [imgOk, setImgOk] = useState(!!image);
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    if (!image || !imgOk) return <div className="pdesc-avatar-placeholder">{initial}</div>;
    return <img src={image} alt={name} className="pdesc-avatar loaded" onError={() => setImgOk(false)} />;
};

// ── Inline Toast ──
const InlineToast = ({ toast }) => {
    if (!toast) return null;
    return (
        <div className={`rf-toast ${toast.type}`}>
            {toast.type === 'success'
                ? <CheckCircle size={15} />
                : <XCircle size={15} />
            }
            {toast.message}
        </div>
    );
};

// ── ReviewForm ──
const ReviewForm = ({ productId, onReviewAdded }) => {
    const { user, loading } = useCurrentUser();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null); // ✅ inline toast state

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) return null;

    if (!user) {
        return (
            <div className="review-form-root">
                <p className="review-login-msg">
                    Please <Link to="/login" className="review-login-link">login</Link> to write a review
                </p>
            </div>
        );
    }

    const displayName = user.displayName || user.email?.split('@')[0] || 'Anonymous';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating)               { showToast('error', 'Please select a star rating'); return; }
        if (!review.trim())        { showToast('error', 'Please write your review'); return; }
        if (review.trim().length < 10) { showToast('error', 'Review must be at least 10 characters'); return; }

        setSubmitting(true);
        try {
            await addProductReview(productId, {
                userId: user.uid,
                userName: displayName,
                userEmail: user.email,
                userImage: user.photoURL,
                rating,
                review: review.trim()
            });

            showToast('success', 'Review submitted successfully!');

            const newReview = {
                userId: user.uid,
                user: { name: displayName, email: user.email, image: user.photoURL || null },
                rating,
                review: review.trim(),
                createdAt: new Date().toISOString(),
                productId,
            };

            setRating(0);
            setReview('');
            if (onReviewAdded) onReviewAdded(newReview);

        } catch (error) {
            console.error(error);
            showToast('error', 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-form-root">
            <h3 className="review-form-title">Write a Review</h3>

            {/* ✅ Inline Toast */}
            <InlineToast toast={toast} />

            {/* User row */}
            <div className="review-user-row">
                {user.photoURL
                    ? <img src={user.photoURL} alt={displayName} className="review-user-avatar" />
                    : <UserCircleIcon size={34} style={{ color: '#94a3b8', flexShrink: 0 }} />
                }
                <div>
                    <p className="review-user-name">{displayName}</p>
                    <p className="review-user-email">{user.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="review-rating-wrapper">
                    <label className="review-rating-label">Your Rating</label>
                    <div className="review-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star} size={28} className="review-star"
                                style={{ color: 'transparent' }}
                                fill={star <= (hoverRating || rating) ? '#16a34a' : '#e2e8f0'}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>
                <div>
                    <label className="review-rating-label">Your Review</label>
                    <textarea
                        className="review-textarea"
                        placeholder="Share your experience with this product..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                        disabled={submitting}
                    />
                </div>
                <button type="submit" className="review-submit-btn" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

// ── Main ProductDescription ──
const isHTML = (str) => /<[a-z][\s\S]*>/i.test(str);

const ProductDescription = ({ product, onReviewAdded }) => {
    const [selectedTab, setSelectedTab] = useState('Description');
    const [localReviews, setLocalReviews] = useState(product?.rating || []);

    useEffect(() => {
        setLocalReviews(product?.rating || []);
    }, [product?.rating]);

    const handleReviewAdded = (newReview) => {
        setLocalReviews(prev => [newReview, ...prev]);
        if (onReviewAdded) onReviewAdded(newReview);
    };

    const formatDate = (createdAt) => {
        try {
            if (!createdAt) return '';
            if (createdAt?.toDate) return new Date(createdAt.toDate()).toDateString();
            return new Date(createdAt).toDateString();
        } catch { return ''; }
    };

    const getReviewerName = (item) => {
        const name = item.user?.name || item.userName;
        if (!name) return 'Anonymous';
        if (name.includes('@')) return name.split('@')[0];
        return name;
    };

    const descriptionHTML = product.description
        ? isHTML(product.description) ? product.description : `<p>${product.description}</p>`
        : '';

    return (
        <>
            <style>{CSS}</style>
            <div className="pdesc-root">

                <div className="pdesc-tabs">
                    {['Description', 'Reviews'].map((tab) => (
                        <button
                            key={tab}
                            className={`pdesc-tab ${tab === selectedTab ? 'active' : ''}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                            {tab === 'Reviews' && localReviews.length > 0 && (
                                <span style={{
                                    marginLeft: 6, background: '#f0fdf4', color: '#16a34a',
                                    borderRadius: 100, padding: '1px 7px',
                                    fontSize: '0.72rem', fontWeight: 700
                                }}>
                                    {localReviews.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {selectedTab === 'Description' && (
                    <div className="pdesc-text" dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
                )}

                {selectedTab === 'Reviews' && (
                    <>
                        <ReviewForm productId={product.id} onReviewAdded={handleReviewAdded} />

                        {localReviews.length > 0 && (
                            <div className="pdesc-reviews-divider">
                                <span className="pdesc-reviews-divider-label">
                                    {localReviews.length} {localReviews.length === 1 ? 'Review' : 'Reviews'}
                                </span>
                                <div className="pdesc-reviews-divider-line" />
                            </div>
                        )}

                        <div className="pdesc-reviews">
                            {localReviews.length === 0 && (
                                <p className="pdesc-no-review">No reviews yet. Be the first to review!</p>
                            )}
                            {localReviews.map((item, index) => (
                                <div key={index} className="pdesc-review-card">
                                    <SmartAvatar name={getReviewerName(item)} image={item.user?.image} />
                                    <div className="pdesc-review-body">
                                        <p className="pdesc-reviewer-name">{getReviewerName(item)}</p>
                                        <div className="pdesc-review-stars">
                                            {Array(5).fill('').map((_, i) => (
                                                <StarIcon
                                                    key={i} size={14}
                                                    style={{ color: 'transparent' }}
                                                    fill={item.rating >= i + 1 ? "#16a34a" : "#E2E8F0"}
                                                />
                                            ))}
                                        </div>
                                        <p className="pdesc-review-text">{item.review}</p>
                                        <p className="pdesc-review-date">{formatDate(item.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {product.store && (
                    <div className="pdesc-store">
                        <img src={product.store?.logo || '/default-avatar.png'} alt={product.store?.name || 'Store'} className="pdesc-store-logo" />
                        <div>
                            <p className="pdesc-store-name">By {product.store.name}</p>
                            <Link to={`/shop/${product.store.username}`} className="pdesc-store-link">
                                View Store <ArrowRight size={13} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductDescription;