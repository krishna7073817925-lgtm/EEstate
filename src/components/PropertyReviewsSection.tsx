import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle, ShieldAlert, Trash2, Calendar, User, Send, Sparkles } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { Property, PropertyReview } from '../types';

interface PropertyReviewsSectionProps {
  property: Property;
  onOpenAuth: () => void;
}

export const PropertyReviewsSection: React.FC<PropertyReviewsSectionProps> = ({
  property,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const {
    getPropertyReviews,
    getPropertyRatingStats,
    canUserReview,
    submitReview,
    deleteReview,
    setIsBookingModalOpen
  } = useProperty();

  const reviews = getPropertyReviews(property.id);
  const stats = getPropertyRatingStats(property.id);
  const eligibility = canUserReview(property.id);

  // Check if current user already submitted a review
  const existingUserReview = user ? reviews.find((r) => r.userId === user.uid) : null;

  const [rating, setRating] = useState<number>(existingUserReview ? existingUserReview.rating : 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingUserReview ? existingUserReview.comment : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMessage('Please write a review comment with at least 5 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await submitReview({
        propertyId: property.id,
        rating,
        comment: comment.trim()
      });
      setSuccessMessage(existingUserReview ? 'Your review was updated successfully!' : 'Thank you! Your verified review has been posted.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setErrorMessage(err?.message || 'Could not submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    let confirmed = true;
    try {
      confirmed = window.confirm('Are you sure you want to remove your review?');
    } catch {
      // In case iframe blocks window.confirm, proceed with delete
      confirmed = true;
    }
    if (confirmed) {
      try {
        await deleteReview(reviewId);
        setComment('');
        setRating(5);
      } catch (err: any) {
        console.error('Error deleting review:', err);
      }
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div id="property-reviews-section" className="pt-8 border-t border-stone-200/80 space-y-6">
      
      {/* Header & Rating Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#0B3B2C] mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Client Feedback & Ratings</span>
          </div>
          <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-stone-900">
            Reviews & Ratings
          </h3>
        </div>

        {/* Aggregate Score Badge */}
        {stats.count > 0 ? (
          <div className="flex items-center gap-3 bg-stone-50 px-4 py-2.5 rounded-2xl border border-stone-200/70">
            <div className="text-right">
              <span className="font-heading font-extrabold text-2xl text-stone-900 block leading-none">
                {stats.average.toFixed(1)}
              </span>
              <span className="text-[11px] text-stone-500 font-semibold block mt-0.5">
                out of 5.0 ({stats.count} {stats.count === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(stats.average) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <span className="text-xs font-semibold text-stone-400 bg-stone-50 px-3 py-1.5 rounded-xl">
            No reviews yet
          </span>
        )}
      </div>

      {/* Review Submission Area based on Verification Rules */}
      <div className="bg-stone-50/80 rounded-2xl p-5 sm:p-6 border border-stone-200/80">
        {!user ? (
          /* Case 1: Unauthenticated */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-sm text-stone-900">
                Want to review this property?
              </h4>
              <p className="text-xs text-stone-500 max-w-md">
                Sign in to rate this property and share your touring experience. Only verified viewing attendees and listing owners can review.
              </p>
            </div>
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-colors shrink-0"
            >
              Sign In to Review
            </button>
          </div>
        ) : !eligibility.allowed ? (
          /* Case 2: Authenticated but has not booked or listed */
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Verified Viewers Only</span>
              </div>
              <p className="text-xs text-stone-600 max-w-lg leading-relaxed">
                To guarantee genuine feedback for all buyers, ratings can only be submitted after scheduling a property viewing tour or by the listing owner.
              </p>
            </div>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-colors shrink-0 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Viewing to Review</span>
            </button>
          </div>
        ) : (
          /* Case 3: Eligible User (Has booked viewing or is owner) */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-800">
                  {existingUserReview ? 'Update Your Review' : 'Submit a Verified Review'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-[#0B3B2C] rounded-full">
                  Verified Attendee
                </span>
              </div>

              {/* Star selector */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-stone-500 font-semibold mr-1">Your Rating:</span>
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const filled = hoverRating ? starVal <= hoverRating : starVal <= rating;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starVal)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          filled ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-bold text-stone-700 ml-1">
                  {hoverRating || rating} / 5
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the property inspection? Share details on natural lighting, spatial layout, condition, and neighborhood vibe..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 focus:outline-none focus:border-[#0B3B2C] bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-400">
                Reviewing as <strong className="text-stone-700">{user.displayName || user.email}</strong>
              </span>

              <div className="flex items-center gap-2">
                {existingUserReview && (
                  <button
                    type="button"
                    onClick={() => handleDelete(existingUserReview.id)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-200/50 transition-colors"
                    title="Delete your review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full text-xs font-bold bg-[#0B3B2C] text-white hover:bg-[#07241B] transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Posting...' : existingUserReview ? 'Save Changes' : 'Post Review'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5">
        <h4 className="font-heading font-bold text-sm text-stone-800">
          Client Feedback ({reviews.length})
        </h4>

        {reviews.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl border border-dashed border-stone-200">
            <p className="text-xs text-stone-500">
              No reviews recorded for this property yet. Book a viewing tour to be the first to share your thoughts!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => {
              const isAuthor = user && user.uid === rev.userId;
              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-white border border-stone-100 shadow-sm space-y-2.5 transition-all hover:border-stone-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {rev.userPhoto ? (
                        <img
                          src={rev.userPhoto}
                          alt={rev.userName}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#EAF5EF] text-[#0B3B2C] flex items-center justify-center font-bold text-xs">
                          {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-bold text-xs sm:text-sm text-stone-900">
                            {rev.userName}
                          </span>
                          <span className="text-[10px] font-semibold text-[#0B3B2C] bg-[#EAF5EF] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>

                      {isAuthor && (
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete your review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line pl-10">
                    {rev.comment}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
