import { useState } from "react";
import { Star, Heart, MessageCircle } from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import CommentSection from "./CommentSection";

const ReviewCard = ({ review, onLike, onCommentClick }) => {
  const { user, isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="card shadow-sm border-0 mb-4 review-card">
      <div className="card-body p-4">
        <div className="d-flex align-items-start gap-3">
          {/* Avatar */}
          <img
            src={
              review.userId?.profilePic ||
              "https://via.placeholder.com/150"
            }
            alt={review.userId?.username}
            className="rounded-circle object-fit-cover"
            style={{ width: "48px", height: "48px" }}
          />

          {/* Content */}
          <div className="flex-grow-1">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 className="fw-bold mb-1">
                  {review.userId?.username}
                </h6>
                <div className="d-flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "text-warning fill-warning"
                          : "text-secondary"
                      }
                    />
                  ))}
                </div>
              </div>

              <small className="text-muted">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>

            {/* Review Text */}
            <p className="text-muted mb-3">
              {review.reviewText}
            </p>

            {/* Actions */}
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() =>
                  isAuthenticated && onLike(review._id)
                }
                disabled={!isAuthenticated}
                className={`btn btn-sm btn-link p-0 d-flex align-items-center gap-1 ${
                  !isAuthenticated ? "disabled" : ""
                }`}
              >
                <Heart size={18} />
                <span className="fw-semibold">
                  {review.likes}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowComments(!showComments);
                  onCommentClick(review._id);
                }}
                className="btn btn-sm btn-link p-0 d-flex align-items-center gap-1 text-decoration-none"
              >
                <MessageCircle size={18} />
                <span className="fw-semibold">Comments</span>
              </button>
            </div>

            {/* Comments */}
            {showComments && (
              <div className="mt-4">
                <CommentSection reviewId={review._id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
