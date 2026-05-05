import { useState, useEffect, useRef } from "react";
import {
  Star, ShoppingCart, Share2,
  ChevronLeft, ChevronRight, Truck, Shield, RotateCcw, Zap,
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
  const [liveProduct, setLiveProduct] = useState(product);

  const { isAuthenticated } = useAuth();
  const showToast = useToast();

  useEffect(() => {
    if (product) {
      loadRelatedProducts();
      loadReviews();
      loadLiveProduct();
      setSelectedImage(0);
    }
  }, [product]);

  const loadLiveProduct = async () => {
    try {
      const res = await fetch(`https://buybybest-back-end.onrender.com/api/products/${product._id}`);
      if (res.ok) {
        const data = await res.json();
        setLiveProduct(data);
        setAvgRating(Number(data.avgRating) || 0);
        setReviewCount(data.reviewCount || 0);
      }
    } catch (err) { console.error("Error loading live product:", err); }
  };

  const loadRelatedProducts = async () => {
    try {
      const res = await fetch("https://buybybest-back-end.onrender.com/api/products");
      const data = await res.json();
      const related = data.filter((p) => p.category === product.category && p._id !== product._id).slice(0, 6);
      setRelatedProducts(related);
    } catch (err) { console.error("Error loading related products:", err); }
  };

  const loadReviews = async () => {
    try {
      const res = await fetch(`https://buybybest-back-end.onrender.com/api/reviews/${product._id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);
      setReviewCount(data.reviewCount || 0);
    } catch (err) { console.error("Error loading reviews", err); }
  };

  const currentStock = liveProduct?.stock ?? liveProduct?.quantity ?? 0;

  const handleAddToCart = () => {
    if (currentStock === 0) { showToast("Product is out of stock", "error"); return; }
    onAddToCart({ ...liveProduct, quantity });
    showToast(`Added ${quantity} item(s) to cart`, "success");
  };

  const handleBuyNow = () => {
    if (currentStock === 0) { showToast("Product is out of stock", "error"); return; }
    onAddToCart({ ...liveProduct, quantity });
    onNavigate("checkout");
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) { showToast("Please login first", "error"); return; }
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
    } catch (err) { showToast(err.message || "Error adding review", "error"); }
  };

  if (!product || !product._id) return <div style={{ textAlign: 'center', padding: 80, fontFamily: 'Outfit, sans-serif' }}>Loading...</div>;

  const images = Array.isArray(liveProduct?.images) && liveProduct.images.length > 0 ? liveProduct.images : [null];
  const salePrice = Number(liveProduct?.price) || 0;
  const origPrice = Number(liveProduct?.originalPrice) || 0;
  const discountPct = liveProduct?.discount || 0;
  const hasDiscount = discountPct > 0 && origPrice > salePrice;
  const savedAmount = hasDiscount ? (origPrice - salePrice) : null;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= 10;

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        .pdp-root { font-family: 'Outfit', sans-serif; }

        /* Breadcrumb */
        .pdp-breadcrumb {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          font-size: 13px;
          color: #888;
          font-family: 'Outfit', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
        }
        .pdp-breadcrumb-wrap {
          background: #fff;
          border-bottom: 1px solid #f0f0f0;
        }
        .pdp-breadcrumb button {
          background: none;
          border: none;
          color: #FF6B00;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          font-weight: 500;
        }
        .pdp-breadcrumb button:hover { text-decoration: underline; }

        /* Main layout */
        .pdp-main {
          display: flex;
          gap: 50px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
          align-items: flex-start;
          justify-content: center;
        }

        /* LEFT: sticky image panel */
        .pdp-left {
          width: 500px;
          flex-shrink: 0;
          position: sticky;
          top: 72px;
          align-self: flex-start;
        }

        .pdp-main-img-wrap {
          width: 100%;
          height: 500px;
          border-radius: 18px;
          overflow: hidden;
          background: #fdf5e6;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdp-main-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px;
        }

        .pdp-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.18s;
          z-index: 2;
        }
        .pdp-nav-btn:hover { background: #FF6B00; border-color: #FF6B00; color: #fff; }

        .pdp-thumbs {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .pdp-thumbs::-webkit-scrollbar { display: none; }
        .pdp-thumb {
          width: 68px;
          height: 68px;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.18s;
        }
        .pdp-thumb.active { border-color: #FF6B00; }
        .pdp-thumb img { width: 100%; height: 100%; object-fit: cover; }

        /* RIGHT: scrollable info panel */
        .pdp-right {
          flex: 1;
          max-width: 550px;
          padding-left: 0;
        }

        /* Category tag */
        .pdp-cat-tag {
          display: inline-block;
          background: #f5f5f5;
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 700;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
        }

        /* Product name */
        .pdp-name {
          font-size: 1.6rem;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.25;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        /* Rating */
        .pdp-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          padding-bottom: 18px;
          border-bottom: 1px solid #f0f0f0;
        }

        /* Price */
        .pdp-price-block {
          margin-bottom: 20px;
        }
        .pdp-price-sale {
          font-size: 2.2rem;
          font-weight: 800;
          color: #FF6B00;
          letter-spacing: -1px;
        }
        .pdp-price-orig {
          font-size: 1rem;
          color: #aaa;
          text-decoration: line-through;
          margin-left: 10px;
        }
        .pdp-price-save {
          font-size: 13px;
          color: #1a7a2e;
          font-weight: 600;
          margin-top: 4px;
        }
        .pdp-deal-tag {
          display: inline-block;
          background: #cc0c39;
          color: #fff;
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        /* Stock */
        .pdp-stock {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 13.5px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .pdp-stock.oos { background: #fff0f0; color: #cc0000; border: 1px solid #ffcdd2; }
        .pdp-stock.low { background: #fff8e1; color: #856404; border: 1px solid #ffe082; }
        .pdp-stock.ok { background: #e8f5e9; color: #1a7a2e; border: 1px solid #a5d6a7; }

        /* Description */
        .pdp-desc {
          font-size: 14px;
          color: #555;
          line-height: 1.75;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        /* Quantity */
        .pdp-qty-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .pdp-qty-label { font-size: 13px; font-weight: 600; color: #666; }
        .pdp-qty-ctrl {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          border-radius: 10px;
          overflow: hidden;
          border: 1.5px solid #e8e8e8;
        }
        .pdp-qty-btn {
          background: none;
          border: none;
          width: 36px;
          height: 36px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          color: #333;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pdp-qty-btn:hover { background: #e0e0e0; }
        .pdp-qty-val {
          width: 44px;
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          color: #1a1a1a;
          border: none;
          background: transparent;
          font-family: 'Outfit', sans-serif;
        }
        .pdp-qty-val:focus { outline: none; }

        /* CTA Buttons */
        .pdp-cta {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .pdp-btn-cart {
          flex: 1;
          border: 2px solid #FF6B00;
          background: transparent;
          color: #FF6B00;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .pdp-btn-cart:hover:not(:disabled) { background: #FF6B00; color: #fff; }
        .pdp-btn-cart:disabled { border-color: #ddd; color: #bbb; cursor: not-allowed; }

        .pdp-btn-buy {
          flex: 1;
          border: none;
          background: #FF6B00;
          color: #fff;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .pdp-btn-buy:hover:not(:disabled) { background: #e55d00; }
        .pdp-btn-buy:disabled { background: #ddd; cursor: not-allowed; }

        /* Secondary btns */
        .pdp-sec-btns {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f0f0f0;
        }
        .pdp-sec-btn {
          flex: 1;
          background: #f5f5f5;
          border: 1px solid #e8e8e8;
          border-radius: 10px;
          padding: 10px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #444;
          transition: all 0.18s;
          font-family: 'Outfit', sans-serif;
        }
        .pdp-sec-btn:hover { background: #e8e8e8; }

        /* Trust badges */
        .pdp-trust {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pdp-trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pdp-trust-icon {
          width: 40px;
          height: 40px;
          background: #fff8f3;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pdp-trust-text strong { display: block; font-size: 13px; color: #1a1a1a; font-weight: 700; }
        .pdp-trust-text span { font-size: 11px; color: #888; }

        /* Related */
        .pdp-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 14px;
          margin-top: 16px;
        }
        .pdp-related-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid #f0f0f0;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pdp-related-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }

        /* Reviews */
        .pdp-review-item {
          padding: 16px 0;
          border-bottom: 1px solid #f5f5f5;
        }
        .pdp-review-item:last-child { border-bottom: none; }

        /* Section header */
        .pdp-section-header {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 18px;
          letter-spacing: -0.3px;
        }

        @media (max-width: 768px) {
          .pdp-main { flex-direction: column; padding: 16px; }
          .pdp-left { width: 100%; position: static; }
          .pdp-right { padding-left: 0; margin-top: 24px; }
          .pdp-main-img-wrap { height: 300px; }
          .pdp-name { font-size: 1.3rem; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div className="pdp-breadcrumb-wrap">
        <nav className="pdp-breadcrumb">
          <button onClick={() => onNavigate("home")}>Home</button>
          <span>›</span>
          <button onClick={() => onNavigate("home")}>{liveProduct.category}</button>
          <span>›</span>
          <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{liveProduct.name}</span>
        </nav>
      </div>

      <div className="pdp-main pdp-root">
        {/* ── LEFT: Sticky Image Panel ── */}
        <div className="pdp-left">
          <div className="pdp-main-img-wrap">
            {images[selectedImage]
              ? <img src={images[selectedImage]} alt={liveProduct.name} />
              : <div style={{ fontSize: 64 }}>📦</div>
            }

            {hasDiscount && (
              <div style={{ position: 'absolute', top: 14, left: 14, background: '#cc0c39', color: '#fff', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 800 }}>
                -{discountPct}% OFF
              </div>
            )}

            {images.length > 1 && (
              <>
                <button className="pdp-nav-btn" style={{ left: 10 }}
                  onClick={() => setSelectedImage(p => p === 0 ? images.length - 1 : p - 1)}>
                  <ChevronLeft size={18} />
                </button>
                <button className="pdp-nav-btn" style={{ right: 10 }}
                  onClick={() => setSelectedImage(p => p === images.length - 1 ? 0 : p + 1)}>
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="pdp-thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`pdp-thumb ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  {img
                    ? <img src={img} alt="" />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                  }
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Product Info ── */}
        <div className="pdp-right">
          <span className="pdp-cat-tag">{liveProduct.category}</span>
          <h1 className="pdp-name">{liveProduct.name}</h1>

          {/* Rating */}
          <div className="pdp-rating">
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color={i < Math.floor(avgRating) ? '#FF6B00' : '#ddd'} fill={i < Math.floor(avgRating) ? '#FF6B00' : 'none'} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>
              {Number(avgRating).toFixed(1)} ({reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="pdp-price-block">
            {hasDiscount && <div className="pdp-deal-tag">⚡ LIMITED DEAL · {discountPct}% OFF</div>}
            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span className="pdp-price-sale">₹{salePrice.toLocaleString('en-IN')}</span>
              {hasDiscount && <span className="pdp-price-orig">₹{origPrice.toLocaleString('en-IN')}</span>}
            </div>
            {hasDiscount && (
              <div className="pdp-price-save">You save: ₹{savedAmount.toLocaleString('en-IN')} ({discountPct}%)</div>
            )}
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Inclusive of all taxes</div>
          </div>

          {/* Stock */}
          <div>
            {isOutOfStock ? (
              <div className="pdp-stock oos">⊘ Out of Stock</div>
            ) : isLowStock ? (
              <div className="pdp-stock low">⚠️ Only <strong style={{ margin: '0 3px' }}>{currentStock}</strong> left — order soon!</div>
            ) : (
              <div className="pdp-stock ok">✓ In Stock <span style={{ color: '#888', fontWeight: 400, fontSize: 12 }}>({currentStock} available)</span></div>
            )}
          </div>

          {/* Description */}
          {liveProduct.description && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>About this item</div>
              <p className="pdp-desc">{liveProduct.description}</p>
            </div>
          )}

          {/* Quantity */}
          <div className="pdp-qty-wrap">
            <span className="pdp-qty-label">Quantity:</span>
            <div className="pdp-qty-ctrl">
              <button className="pdp-qty-btn" onClick={() => setQuantity(p => Math.max(1, p - 1))}>−</button>
              <input
                type="number"
                className="pdp-qty-val"
                value={quantity}
                min="1"
                max={currentStock || 99}
                onChange={e => {
                  const v = Number(e.target.value);
                  if (!v) return setQuantity(1);
                  setQuantity(currentStock ? Math.min(currentStock, Math.max(1, v)) : Math.max(1, v));
                }}
              />
              <button className="pdp-qty-btn" onClick={() => setQuantity(p => currentStock ? Math.min(currentStock, p + 1) : p + 1)}>+</button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pdp-cta">
            <button className="pdp-btn-cart" onClick={handleAddToCart} disabled={isOutOfStock}>
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="pdp-btn-buy" onClick={handleBuyNow} disabled={isOutOfStock}>
              <Zap size={18} /> Buy Now
            </button>
          </div>

          {/* Secondary */}
          <div className="pdp-sec-btns">
            <button className="pdp-sec-btn" onClick={() => setShowReviewForm(true)}>
              <Star size={14} /> Write Review
            </button>
            <button className="pdp-sec-btn" onClick={() => {
              const url = window.location.href;
              const text = `Check out: ${liveProduct.name} — ${url}`;
              if (navigator.share) navigator.share({ title: liveProduct.name, text, url });
              else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }}>
              <Share2 size={14} /> Share
            </button>
          </div>

          {/* Trust Badges */}
          <div className="pdp-trust">
            {[
              { icon: <Truck size={18} color="#FF6B00" />, title: "Free Delivery", sub: "On orders above ₹499" },
              { icon: <RotateCcw size={18} color="#FF6B00" />, title: "Easy Returns", sub: "30-day return policy" },
              { icon: <Shield size={18} color="#FF6B00" />, title: "Secure Payment", sub: "100% secure transactions" },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="pdp-trust-item">
                <div className="pdp-trust-icon">{icon}</div>
                <div className="pdp-trust-text">
                  <strong>{title}</strong>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Below fold: Related + Reviews ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 16px 48px' }}>
        {relatedProducts.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <div className="pdp-section-header">You May Also Like</div>
            <div className="pdp-related-grid">
              {relatedProducts.map(rp => {
                const rpSale = Number(rp.price);
                const rpOrig = Number(rp.originalPrice) || rpSale;
                const rpDisc = rp.discount || 0;
                return (
                  <div key={rp._id} className="pdp-related-card" onClick={() => onNavigate("productDetails", rp)}>
                    <div style={{ height: 140, background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
                      {rp.images?.[0]
                        ? <img src={rp.images[0]} alt={rp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📦</div>
                      }
                      {rpDisc > 0 && (
                        <span style={{ position: 'absolute', top: 6, left: 6, background: '#cc0c39', color: '#fff', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 800 }}>-{rpDisc}%</span>
                      )}
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#333', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>{rp.name}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, fontFamily: 'Outfit, sans-serif' }}>
                        <span style={{ fontWeight: 800, color: '#FF6B00', fontSize: 14 }}>₹{rpSale.toLocaleString('en-IN')}</span>
                        {rpDisc > 0 && rpOrig > rpSale && <span style={{ fontSize: 11, color: '#aaa', textDecoration: 'line-through' }}>₹{rpOrig.toLocaleString('en-IN')}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <div className="pdp-section-header">Customer Reviews</div>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{ border: '1.5px solid #FF6B00', background: 'transparent', color: '#FF6B00', borderRadius: 10, padding: '9px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginBottom: 24, fontFamily: 'Outfit, sans-serif', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FF6B00'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FF6B00'; }}
            >
              {showReviewForm ? "Cancel" : "✍️ Write a Review"}
            </button>
          )}

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontFamily: 'Outfit, sans-serif' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div>
              {reviews.map(review => (
                <div key={review._id} className="pdp-review-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} color={i < review.rating ? '#FF6B00' : '#ddd'} fill={i < review.rating ? '#FF6B00' : 'none'} />
                      ))}
                    </div>
                    <strong style={{ fontSize: 13, fontFamily: 'Outfit, sans-serif', color: '#1a1a1a' }}>{review.userName}</strong>
                    <span style={{ fontSize: 11, color: '#aaa', fontFamily: 'Outfit, sans-serif' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: '#444', fontFamily: 'Outfit, sans-serif', lineHeight: 1.6, margin: 0 }}>{review.reviewText}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h5 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 18 }}>Write a Review</h5>
              <button onClick={() => setShowReviewForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>×</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>Your Rating</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={30} style={{ cursor: 'pointer' }} color={star <= rating ? '#FF6B00' : '#ddd'} fill={star <= rating ? '#FF6B00' : 'none'} onClick={() => setRating(star)} />
                ))}
              </div>
            </div>
            <textarea
              style={{ width: '100%', border: '1.5px solid #e0e0e0', borderRadius: 10, padding: '12px 14px', fontFamily: 'Outfit, sans-serif', fontSize: 14, resize: 'vertical', minHeight: 120, outline: 'none', boxSizing: 'border-box' }}
              placeholder="Share your experience..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#FF6B00'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={() => setShowReviewForm(false)} style={{ flex: 1, background: '#f5f5f5', border: 'none', borderRadius: 10, padding: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSubmitReview} style={{ flex: 1, background: '#FF6B00', border: 'none', borderRadius: 10, padding: '12px', color: '#fff', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer', transition: 'background 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e55d00'}
                onMouseLeave={e => e.currentTarget.style.background = '#FF6B00'}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;