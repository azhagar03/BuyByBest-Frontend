import { useEffect, useState } from "react";
import { ShoppingCart, Star, Zap } from "lucide-react";
import FilterSidebar from "../Components/FilterSidebar";

const Home = ({ filters, onSelectProduct, onNavigate, onAddToCart, onViewDetails }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");

  const [localFilters, setLocalFilters] = useState({
    priceRange: [0, Infinity],
    categories: [],
    brands: [],
    minRating: 0,
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://buybybest-back-end.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = [...products];

    if (filters?.query) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(filters.query.toLowerCase())
      );
    }
    if (filters?.category) {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    filtered = filtered.filter((p) => {
      const price = Number(p.price ?? 0);
      return price >= localFilters.priceRange[0] && price <= localFilters.priceRange[1];
    });
    if (localFilters.categories.length > 0) {
      filtered = filtered.filter((p) => localFilters.categories.includes(p.category));
    }
    if (localFilters.brands.length > 0) {
      filtered = filtered.filter((p) => p.brand && localFilters.brands.includes(p.brand));
    }
    if (localFilters.minRating > 0) {
      filtered = filtered.filter(
        (p) => (Number(p.avgRating) || 0) >= localFilters.minRating
      );
    }

    switch (sortBy) {
      case "price-low": filtered.sort((a, b) => a.price - b.price); break;
      case "price-high": filtered.sort((a, b) => b.price - a.price); break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: break;
    }

    setFilteredProducts(filtered);
  }, [products, filters, localFilters, sortBy]);

  if (loading) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #f0f0f0', borderTopColor: '#FF6B00', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#888', fontFamily: 'Outfit, sans-serif', fontSize: 14 }}>Loading products...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        .tic-product-card {
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          border: 1px solid #f0f0f0;
          display: flex;
          flex-direction: column;
          height: 100%;
          font-family: 'Outfit', sans-serif;
        }
        .tic-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.10);
          border-color: #ffe0cc;
        }

        .tic-product-img {
          position: relative;
          height: 210px;
          background: #f5f5f5;
          overflow: hidden;
        }
        .tic-product-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .tic-product-card:hover .tic-product-img img {
          transform: scale(1.06);
        }

        .tic-badge-discount {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #cc0c39;
          color: #fff;
          border-radius: 6px;
          padding: 3px 9px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3px;
          font-family: 'Outfit', sans-serif;
        }
        .tic-badge-stock {
          position: absolute;
          top: 10px;
          right: 10px;
          border-radius: 6px;
          padding: 3px 9px;
          font-size: 10px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
        }
        .tic-badge-stock.oos { background: rgba(0,0,0,0.65); color: #fff; }
        .tic-badge-stock.low { background: #FF6B00; color: #fff; }

        .tic-product-body {
          padding: 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .tic-cat-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 6px;
          font-family: 'Outfit', sans-serif;
        }

        .tic-product-name {
          font-size: 13.5px;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.4;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-bottom: 10px;
          min-height: 2.8em;
          font-family: 'Outfit', sans-serif;
        }

        .tic-price-block { margin-top: auto; }
        .tic-price-sale {
          font-size: 1.25rem;
          font-weight: 800;
          color: #FF6B00;
          font-family: 'Outfit', sans-serif;
        }
        .tic-price-orig {
          font-size: 12px;
          color: #aaa;
          text-decoration: line-through;
          margin-left: 6px;
          font-family: 'Outfit', sans-serif;
        }
        .tic-price-save {
          font-size: 11px;
          color: #1a7a2e;
          font-weight: 600;
          margin-top: 2px;
          font-family: 'Outfit', sans-serif;
        }

        .tic-card-btns {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        .tic-btn-cart {
          flex: 1;
          border: 1.5px solid #FF6B00;
          background: transparent;
          color: #FF6B00;
          border-radius: 8px;
          padding: 8px 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.18s;
          font-family: 'Outfit', sans-serif;
        }
        .tic-btn-cart:hover { background: #FF6B00; color: #fff; }
        .tic-btn-cart:disabled { border-color: #ddd; color: #bbb; cursor: not-allowed; }

        .tic-btn-buy {
          flex: 1;
          border: none;
          background: #FF6B00;
          color: #fff;
          border-radius: 8px;
          padding: 8px 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: background 0.18s;
          font-family: 'Outfit', sans-serif;
        }
        .tic-btn-buy:hover { background: #e55d00; }
        .tic-btn-buy:disabled { background: #ddd; cursor: not-allowed; }

        /* Sort bar */
        .tic-sort-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 4px;
          margin-bottom: 20px;
        }
        .tic-sort-select {
          border: 1.5px solid #e0e0e0;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 13px;
          color: #333;
          background: #fff;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }
        .tic-sort-select:focus { border-color: #FF6B00; }

        .tic-result-count {
          font-size: 13px;
          color: #888;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
        }

        /* Stars */
        .tic-stars { display: flex; gap: 1px; }

        /* Empty state */
        .tic-empty {
          text-align: center;
          padding: 60px 20px;
          font-family: 'Outfit', sans-serif;
        }
        .tic-empty h4 { font-size: 18px; font-weight: 700; color: #333; margin-bottom: 8px; }
        .tic-empty p { color: #888; font-size: 14px; }
      `}</style>

      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* ── Sidebar ── */}
          <div style={{ width: 240, flexShrink: 0, position: 'sticky', top: 80 }} className="d-none d-lg-block">
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f5f5f5', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 15, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎯</span> Filters
              </div>
              <FilterSidebar onFilterChange={setLocalFilters} products={products} />
            </div>
          </div>

          {/* ── Products Area ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Sort bar */}
            <div className="tic-sort-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <label style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: '#666', fontWeight: 500 }}>Sort:</label>
                <select className="tic-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              <span className="tic-result-count">{filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="tic-empty">
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <h4>No products found</h4>
                <p>Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                gap: 18,
              }}>
                {filteredProducts.map((product) => {
                  const salePrice = Number(product.price) || 0;
                  const origPrice = Number(product.originalPrice) || 0;
                  const discountPct = product.discount || 0;
                  const hasDiscount = discountPct > 0 && origPrice > salePrice;
                  const stock = product.stock ?? product.quantity ?? 0;
                  const isOutOfStock = stock === 0;
                  const avgRating = Number(product.avgRating) || 0;

                  return (
                    <div
                      key={product._id}
                      className="tic-product-card"
                      onClick={() => onNavigate("productDetails", product)}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && onNavigate("productDetails", product)}
                    >
                      {/* Image */}
                      <div className="tic-product-img">
                        {product.images?.[0]
                          ? <img src={product.images[0]} alt={product.name} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42 }}>📦</div>
                        }
                        {hasDiscount && <span className="tic-badge-discount">-{discountPct}%</span>}
                        {isOutOfStock
                          ? <span className="tic-badge-stock oos">Out of Stock</span>
                          : stock <= 10
                          ? <span className="tic-badge-stock low">Only {stock} left</span>
                          : null
                        }
                      </div>

                      {/* Body */}
                      <div className="tic-product-body">
                        <span className="tic-cat-tag">{product.category}</span>
                        <div className="tic-product-name">{product.name}</div>

                        {/* Stars */}
                        {avgRating > 0 && (
                          <div className="tic-stars" style={{ marginBottom: 8 }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} color={i < Math.floor(avgRating) ? '#FF6B00' : '#ddd'} fill={i < Math.floor(avgRating) ? '#FF6B00' : 'none'} />
                            ))}
                            <span style={{ fontSize: 10, color: '#888', marginLeft: 4, fontFamily: 'Outfit, sans-serif' }}>{avgRating.toFixed(1)}</span>
                          </div>
                        )}

                        {/* Price */}
                        <div className="tic-price-block">
                          <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
                            <span className="tic-price-sale">₹{salePrice.toLocaleString('en-IN')}</span>
                            {hasDiscount && (
                              <span className="tic-price-orig">₹{origPrice.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                          {hasDiscount && (
                            <div className="tic-price-save">Save ₹{(origPrice - salePrice).toLocaleString('en-IN')} ({discountPct}% off)</div>
                          )}

                          {/* Buttons */}
                          <div className="tic-card-btns">
                            <button
                              className="tic-btn-cart"
                              disabled={isOutOfStock}
                              onClick={e => { e.stopPropagation(); onAddToCart(product); }}
                            >
                              <ShoppingCart size={13} />
                              Cart
                            </button>
                            <button
                              className="tic-btn-buy"
                              disabled={isOutOfStock}
                              onClick={e => { e.stopPropagation(); onNavigate("checkout"); }}
                            >
                              <Zap size={13} />
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;