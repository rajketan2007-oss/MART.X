import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { createReviewApi } from '../../services/api';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { addToast } = useUI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to submit a review', 'error');
      return;
    }

    if (!comment.trim()) {
      addToast('Please enter a review comment', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await createReviewApi({ productId, rating, comment });
      addToast('Review submitted successfully!', 'success');
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-extrad-peach/50 rounded-xl p-5 border border-extrad-border">
      <h4 className="text-sm font-bold text-extrad-dark mb-3">Write a Customer Review</h4>

      {/* Interactive Star Rating Picker */}
      <div className="flex items-center gap-1.5 mb-4">
        <span className="text-xs font-semibold text-extrad-muted mr-2">Rating:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`w-5 h-5 ${
                (hoverRating || rating) >= star
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-extrad-dark ml-2">
          {rating} / 5 Stars
        </span>
      </div>

      {/* Review Comment Area */}
      <textarea
        rows="3"
        placeholder="Share your experience regarding fit, fabric quality, and delivery..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full text-xs p-3 rounded-lg bg-white border border-gray-300 focus:border-extrad-pink focus:outline-none mb-3"
      />

      <button
        type="submit"
        disabled={submitting}
        className="gradient-bg text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 hover:opacity-95 transition-opacity disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        {submitting ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
