import { useState, useEffect } from "react";
import {
  Star, ShoppingCart, Share2,
  ChevronLeft, ChevronRight, Truck, Shield, RotateCcw,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import { useToast } from "../Context/ToastContext";

const ProductDetailsPage = ({ product, onNavigate, onAddToCart }) => {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  // Live stock from DB
  const [liveProduct, setLiveProduct] = useState(product);

  const { isAuthenticated } = useAuth();
  const showToast = useToast();

  useEffect(() => {
    if (product) {
      loadRelatedProducts();
      loadReviews();
      loadLiveProduct();
    }
  }, [product]);

  // Fetch the freshest product data including stock
  const loadLiveProduct = async () => {
    try {
      const res = await fetch(`https://buybybest-back-end.onrender.com/api/products/${product._id}`);
      if (res.ok) {
        const data = await res.json();
        setLiveProduct(data);
        setAvgRating(Number(data.avgRating) || 0);
        setReviewCount(data.reviewCount || 0);
      }
    } catch (err) {
      console.error("Error loading live product:", err);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const res = await fetch("https://buybybest-back-end.onrender.com/api/products");
      const data = await res.json();
      const related = data
        .filter((p) => p.category === product.category && p._id !== product._id)
        .slice(0, 6);
      setRelatedProducts(related);
    } catch (err) {
      console.error("Error loading related products:", err);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await fetch(`https://buybybest-back-end.onrender.com/api/reviews/${product._id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);
      setReviewCount(data.reviewCount || 0);
    } catch (err) {
      console.error("Error loading reviews", err);
    }
  };

  const currentStock = liveProduct?.stock ?? liveProduct?.quantity ?? 0;

  const handleAddToCart = () => {
    if (currentStock === 0) {
      showToast("Product is out of stock", "error");
      return;
    }
    onAddToCart({ ...liveProduct, quantity });
    showToast(`Added ${quantity} item(s) to cart`, "success");
  };

  const handleBuyNow = () => {
    if (currentStock === 0) {
      showToast("Product is out of stock", "error");
      return;
    }
    onAddToCart({ ...liveProduct, quantity });
    onNavigate("checkout");
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      showToast("Please login first", "error");
      return;
    }
    try {
      const res = await fetch("https://buybybest-back-end.onrender.com/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          userId: currentUser._id,
          userName: currentUser.username,
          rating: Number(rating),
          reviewText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast("Review added successfully!", "success");
      setShowReviewForm(false);
      setReviewText("");
      setRating(5);
      loadReviews();
    } catch (err) {
      showToast(err.message || "Error adding review", "error");
    }
  };

  if (!product || !product._id) {
    return <div className="text-center py-5">Loading...</div>;
  }

  const images =
    Array.isArray(liveProduct?.images) && liveProduct.images.length > 0
      ? liveProduct.images
      : [null];

  // Pricing
  const salePrice = Number(liveProduct?.price) || 0;
  const origPrice = Number(liveProduct?.originalPrice) || 0;
  const discountPct = liveProduct?.discount || 0;
  const hasDiscount = discountPct > 0 && origPrice > salePrice;
  const savedAmount = hasDiscount ? (origPrice - salePrice).toFixed(2) : null;

  // Stock thresholds
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 10;

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button onClick={() => onNavigate("home")} className="btn btn-link p-0 text-decoration-none">
                Home
              </button>
            </li>
            <li className="breadcrumb-item">
              <button onClick={() => onNavigate("home")} className="btn btn-link p-0 text-decoration-none">
                {liveProduct.category}
              </button>
            </li>
            <li className="breadcrumb-item active">{liveProduct.name}</li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="row g-4 mb-5">
          {/* Images */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div
                  className="position-relative mb-3 rounded-3 overflow-hidden"
                  style={{ height: 420, background: "#f8f9fa" }}
                >
                  {images[selectedImage] ? (
                    <img
                      src={images[selectedImage]}
                      alt={liveProduct.name}
                      className="w-100 h-100"
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                      <span style={{ fontSize: "5rem" }}>📦</span>
                    </div>
                  )}

                  {/* Discount badge */}
                  {hasDiscount && (
                    <div className="position-absolute top-0 start-0 m-3">
                      <span
                        className="badge px-3 py-2"
                        style={{
                          background: "#cc0c39",
                          color: "#fff",
                          fontSize: "0.9rem",
                          borderRadius: 6,
                        }}
                      >
                        -{discountPct}% OFF
                      </span>
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle"
                        style={{ width: 36, height: 36, padding: 0 }}
                        onClick={() =>
                          setSelectedImage((p) => (p === 0 ? images.length - 1 : p - 1))
                        }
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle"
                        style={{ width: 36, height: 36, padding: 0 }}
                        onClick={() =>
                          setSelectedImage((p) => (p === images.length - 1 ? 0 : p + 1))
                        }
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="d-flex gap-2 overflow-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        className={`btn p-0 border rounded-2 ${
                          selectedImage === idx ? "border-warning border-3" : "border-secondary"
                        }`}
                        style={{ width: 72, height: 72, flexShrink: 0 }}
                        onClick={() => setSelectedImage(idx)}
                      >
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            className="w-100 h-100 rounded-2"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                            📦
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                {/* Category */}
                <span className="badge bg-light text-dark border mb-2">
                  {liveProduct.category}
                </span>

                {/* Name */}
                <h1 className="h3 fw-bold mb-3">{liveProduct.name}</h1>

                {/* Rating */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="d-flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.floor(avgRating) ? "text-warning" : "text-muted"}
                        fill={i < Math.floor(avgRating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-muted small">
                    {Number(avgRating).toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>

                {/* ─── Amazon-style Pricing Block ─── */}
                <div
                  className="rounded-3 p-3 mb-4"
                  style={{ background: "#fff8e1", border: "1px solid #ffe082" }}
                >
                  {hasDiscount ? (
                    <>
                      {/* Deal tag */}
                      <div className="mb-1">
                        <span
                          className="badge px-2 py-1 me-2"
                          style={{ background: "#cc0c39", color: "#fff", fontSize: "0.7rem" }}
                        >
                          LIMITED DEAL
                        </span>
                        <span
                          className="fw-bold"
                          style={{ color: "#cc0c39", fontSize: "0.85rem" }}
                        >
                          {discountPct}% off
                        </span>
                      </div>

                      {/* Prices */}
                      <div className="d-flex align-items-baseline gap-3 flex-wrap">
                        <span
                          className="fw-bold"
                          style={{ fontSize: "2rem", color: "#B12704" }}
                        >
                          ${salePrice.toFixed(2)}
                        </span>
                        <div>
                          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                            M.R.P.:{" "}
                          </span>
                          <span
                            className="text-muted text-decoration-line-through"
                            style={{ fontSize: "0.9rem" }}
                          >
                            ${origPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Savings */}
                      <p className="text-success fw-semibold small mb-0 mt-1">
                        You save: ${savedAmount} ({discountPct}%)
                      </p>
                    </>
                  ) : (
                    <span className="fw-bold" style={{ fontSize: "2rem", color: "#0F1111" }}>
                      ${salePrice.toFixed(2)}
                    </span>
                  )}
                  <p className="text-muted" style={{ fontSize: "0.72rem", marginTop: 4 }}>
                    Inclusive of all taxes
                  </p>
                </div>

                {/* ─── Stock Status ─── */}
                <div className="mb-4">
                  {isOutOfStock ? (
                    <div
                      className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                      style={{ background: "#fff3f3", border: "1px solid #f5c6cb" }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>⊘</span>
                      <span className="fw-bold text-danger">Out of Stock</span>
                    </div>
                  ) : isLowStock ? (
                    <div
                      className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                      style={{ background: "#fff8e1", border: "1px solid #ffe082" }}
                    >
                      <span style={{ fontSize: "1rem" }}>⚠️</span>
                      <span className="fw-semibold" style={{ color: "#856404" }}>
                        Only <strong>{currentStock}</strong> left in stock — order soon!
                      </span>
                    </div>
                  ) : (
                    <div
                      className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-3"
                      style={{ background: "#e6f4ea", border: "1px solid #a8d5b0" }}
                    >
                      <span style={{ fontSize: "1rem" }}>✓</span>
                      <span className="fw-semibold text-success">
                        In Stock{" "}
                        <span className="text-muted fw-normal small">
                          ({currentStock} units available)
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {liveProduct.description && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-1">About this item</h6>
                    <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                      {liveProduct.description}
                    </p>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Quantity:</label>
                  <div className="input-group" style={{ maxWidth: 160 }}>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      value={quantity}
                      min="1"
                      max={currentStock || 99}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!v) return setQuantity(1);
                        setQuantity(
                          currentStock
                            ? Math.min(currentStock, Math.max(1, v))
                            : Math.max(1, v)
                        );
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() =>
                        setQuantity((p) =>
                          currentStock ? Math.min(currentStock, p + 1) : p + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="d-grid gap-2 mb-4">
                  <button
                    className="btn btn-warning btn-lg fw-bold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-lg fw-bold"
                    style={{
                      background: isOutOfStock ? "#ccc" : "#FF9900",
                      border: "none",
                      color: "#0F1111",
                    }}
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                  >
                    Buy Now
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="d-flex gap-2 mb-4">
                  <button
                    className="btn btn-outline-secondary flex-fill"
                    onClick={() => setShowReviewForm(true)}
                  >
                    <Star size={15} className="me-1" />
                    Write a Review
                  </button>
                  <button
                    className="btn btn-outline-secondary flex-fill"
                    onClick={() => {
                      const url = window.location.href;
                      const text = `Check out: ${liveProduct.name} — ${url}`;
                      if (navigator.share) {
                        navigator.share({ title: liveProduct.name, text, url });
                      } else {
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                      }
                    }}
                  >
                    <Share2 size={15} className="me-1" />
                    Share
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="border-top pt-3">
                  <div className="row g-2">
                    {[
                      { icon: <Truck size={20} className="text-warning" />, title: "Free Delivery", sub: "On orders above $50" },
                      { icon: <RotateCcw size={20} className="text-warning" />, title: "Easy Returns", sub: "30-day return policy" },
                      { icon: <Shield size={20} className="text-warning" />, title: "Secure Payment", sub: "100% secure transactions" },
                    ].map(({ icon, title, sub }) => (
                      <div key={title} className="col-12">
                        <div className="d-flex align-items-center gap-3">
                          {icon}
                          <div>
                            <strong className="small">{title}</strong>
                            <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>{sub}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Modal (floating) */}
        {showReviewForm && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1060 }}
          >
            <div className="modal-dialog">
              <div className="modal-content border-0 shadow-lg rounded-4">
                <div className="modal-header border-0 pb-1">
                  <h5 className="modal-title fw-bold">Write a Review</h5>
                  <button className="btn-close" onClick={() => setShowReviewForm(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Your Rating</label>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={30}
                          style={{ cursor: "pointer" }}
                          className={star <= rating ? "text-warning" : "text-muted"}
                          fill={star <= rating ? "currentColor" : "none"}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Share your experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button className="btn btn-light rounded-pill px-4" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-warning rounded-pill px-4 fw-bold" onClick={handleSubmitReview}>
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-5">
            <h4 className="fw-bold mb-4">You May Also Like</h4>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
              {relatedProducts.map((rp) => {
                const rpDiscount = rp.discount || 0;
                const rpOrig = Number(rp.originalPrice) || Number(rp.price);
                const rpSale = Number(rp.price);
                return (
                  <div key={rp._id} className="col">
                    <div
                      className="card h-100 border-0 shadow-sm hover-card"
                      style={{ cursor: "pointer" }}
                      onClick={() => onNavigate("productDetails", rp)}
                    >
                      <div
                        className="position-relative bg-light"
                        style={{ height: 140 }}
                      >
                        {rp.images?.[0] ? (
                          <img
                            src={rp.images[0]}
                            alt={rp.name}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center fs-2">
                            📦
                          </div>
                        )}
                        {rpDiscount > 0 && (
                          <span
                            className="position-absolute top-0 start-0 m-1 badge"
                            style={{ background: "#cc0c39", color: "#fff", fontSize: "0.65rem" }}
                          >
                            -{rpDiscount}%
                          </span>
                        )}
                      </div>
                      <div className="card-body p-2">
                        <p
                          className="small text-truncate mb-1"
                          style={{ fontSize: "0.78rem" }}
                        >
                          {rp.name}
                        </p>
                        <div className="d-flex align-items-baseline gap-1 flex-wrap">
                          <span className="fw-bold text-warning" style={{ fontSize: "0.9rem" }}>
                            ${rpSale.toFixed(2)}
                          </span>
                          {rpDiscount > 0 && rpOrig > rpSale && (
                            <span
                              className="text-muted text-decoration-line-through"
                              style={{ fontSize: "0.72rem" }}
                            >
                              ${rpOrig.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h4 className="fw-bold mb-4">Customer Reviews</h4>

            {isAuthenticated && (
              <button
                className="btn btn-outline-warning mb-4 rounded-pill px-4"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel" : "✍️ Write a Review"}
              </button>
            )}

            {reviews.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="vstack gap-3">
                {reviews.map((review) => (
                  <div key={review._id} className="border-bottom pb-3">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <div className="d-flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "text-warning" : "text-muted"}
                            fill={i < review.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <strong className="small">{review.userName}</strong>
                      <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mb-0 small">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hover-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 24px rgba(0,0,0,0.12) !important; }
      `}</style>
    </div>
  );
};

export default ProductDetailsPage;