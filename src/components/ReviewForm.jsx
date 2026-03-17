import { useState } from 'react';
import { StarIcon } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ Import
import { useCurrentUser } from '../../hooks/useAuth';
import { addProductReview } from '../../lib/services/reviewService';
import { useFloatingToast } from '../FloatingToastProvider'; // ✅ Import

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.review-form-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f8fafc;
    border: 1.5px solid #f1f5f9;
    border-radius: 18px;
    padding: 24px 28px;
    margin-top: 32px;
    max-width: 640px;
}

.review-form-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 20px;
}

.review-rating-wrapper {
    margin-bottom: 20px;
}

.review-rating-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
    margin-bottom: 10px;
    display: block;
}

.review-stars {
    display: flex;
    gap: 8px;
}

.review-star {
    cursor: pointer;
    transition: transform 0.2s;
}

.review-star:hover {
    transform: scale(1.2);
}

.review-textarea {
    width: 100%;
    min-height: 120px;
    padding: 14px 16px;
    border: 1.5px solid #f1f5f9;
    border-radius: 12px;
    font-size: 0.875rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #0f172a;
    background: #fff;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.review-textarea:focus {
    border-color: #16a34a;
}

.review-textarea:disabled {
    background: #f8fafc;
    cursor: not-allowed;
    opacity: 0.6;
}

.review-submit-btn {
    margin-top: 16px;
    padding: 12px 28px;
    background: #16a34a;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
}

.review-submit-btn:hover:not(:disabled) {
    background: #15803d;
}

.review-submit-btn:active {
    transform: scale(0.98);
}

.review-submit-btn:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    opacity: 0.6;
}

.review-login-msg {
    font-size: 0.875rem;
    color: #94a3b8;
    text-align: center;
    padding: 20px;
}

.review-login-link {
    color: #16a34a;
    font-weight: 600;
    text-decoration: none;
}

.review-login-link:hover {
    text-decoration: underline;
}
`;

const ReviewForm = ({ productId, onReviewAdded }) => {
    const { user } = useCurrentUser();
    const { addToast } = useFloatingToast(); // ✅ Hook
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validation with meaningful errors
        if (!rating) {
            addToast({
                message: 'Please select a star rating',
                type: 'error',
            });
            return;
        }

        if (!review.trim()) {
            addToast({
                message: 'Please write your review',
                type: 'error',
            });
            return;
        }

        if (review.trim().length < 10) {
            addToast({
                message: 'Review must be at least 10 characters',
                type: 'error',
            });
            return;
        }

        setSubmitting(true);

        try {
            const displayName = user.displayName || user.email?.split('@')[0] || 'Anonymous';

            await addProductReview(productId, {
                userId: user.uid,
                userName: displayName,
                userEmail: user.email,
                userImage: user.photoURL,
                rating,
                review: review.trim()
            });

            // ✅ Success toast
            addToast({
                message: 'Review submitted successfully!',
                title: 'Thank you for your feedback',
                type: 'success',
            });

            setRating(0);
            setReview('');
            
            if (onReviewAdded) {
                onReviewAdded();
            }
        } catch (error) {
            console.error(error);
            // ✅ Error toast
            addToast({
                message: 'Failed to submit review',
                title: 'Please try again',
                type: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <>
                <style>{CSS}</style>
                <div className="review-form-root">
                    <p className="review-login-msg">
                        Please <Link to="/login" className="review-login-link">login</Link> to write a review
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{CSS}</style>
            <div className="review-form-root">
                <h3 className="review-form-title">Write a Review</h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="review-rating-wrapper">
                        <label className="review-rating-label">Your Rating</label>
                        <div className="review-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                    key={star}
                                    size={28}
                                    className="review-star"
                                    style={{ color: 'transparent' }}
                                    fill={
                                        star <= (hoverRating || rating)
                                            ? '#16a34a'
                                            : '#e2e8f0'
                                    }
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

                    <button
                        type="submit"
                        className="review-submit-btn"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default ReviewForm;