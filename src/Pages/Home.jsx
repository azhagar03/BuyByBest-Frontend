import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
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
      const res = await fetch("https://buybybest-backend-0khu.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
    setLoading(false);
  };

  // Apply filters + sort
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
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container-fluid py-4 px-3 px-md-4" style={{ maxWidth: "1600px" }}>
        <div className="row g-4">

          {/* ── Sidebar ── */}
          <div className="col-lg-3 col-xl-2">
            <div className="position-sticky" style={{ top: "20px" }}>
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0 fw-bold text-dark">
                    <i className="bi bi-funnel me-2"></i>Filters
                  </h5>
                </div>
                <div className="card-body p-0">
                  <FilterSidebar onFilterChange={setLocalFilters} products={products} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Products Column ── */}
          <div className="col-lg-9 col-xl-10">

            {/* Sort bar */}
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <label className="text-muted small mb-0">Sort by:</label>
                    <select
                      className="form-select form-select-sm border-0 shadow-sm"
                      style={{ width: 170 }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                  <span className="text-muted small">
                    {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Product grid */}
            {filteredProducts.length === 0 ? (
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body text-center py-5">
                  <h5 className="text-muted mb-2">No products found</h5>
                  <p className="text-muted small">Try adjusting your filters or search query</p>
                </div>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-3 row-cols-xl-4 g-3">
                {filteredProducts.map((product) => {
                  const salePrice   = Number(product.price) || 0;
                  const origPrice   = Number(product.originalPrice) || 0;
                  const discountPct = product.discount || 0;
                  const hasDiscount = discountPct > 0 && origPrice > salePrice;
                  const stock       = product.stock ?? product.quantity ?? 0;
                  const isOutOfStock = stock === 0;

                  return (
                    <div key={product._id} className="col">
                      {/*
                        ✅ Whole card is clickable → goes to product details.
                        Buttons inside use e.stopPropagation() so they don't
                        trigger the card's onClick.
                      */}
                      <div
                        role="button"
                        tabIndex={0}
                        className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden hover-card"
                        style={{ cursor: "pointer" }}
                        onClick={() => onNavigate("productDetails", product)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") onNavigate("productDetails", product);
                        }}
                      >
                        {/* Image */}
                        <div className="position-relative bg-light" style={{ height: 185 }}>
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-100 h-100"
                              style={{ objectFit: "cover", pointerEvents: "none" }}
                            />
                          ) : (
                            <div className="w-100 h-100 d-flex align-items-center justify-content-center fs-1">
                              📦
                            </div>
                          )}

                          {hasDiscount && (
                            <span
                              className="position-absolute top-0 start-0 m-2 badge"
                              style={{ background: "#cc0c39", color: "#fff", fontSize: "0.68rem", fontWeight: 700, borderRadius: 4 }}
                            >
                              -{discountPct}% OFF
                            </span>
                          )}

                          {isOutOfStock ? (
                            <span className="position-absolute top-0 end-0 m-2 badge bg-secondary" style={{ fontSize: "0.65rem" }}>
                              Out of Stock
                            </span>
                          ) : stock <= 10 ? (
                            <span
                              className="position-absolute top-0 end-0 m-2 badge"
                              style={{ background: "#ff9800", color: "#fff", fontSize: "0.65rem" }}
                            >
                              Only {stock} left
                            </span>
                          ) : null}
                        </div>

                        {/* Body */}
                        <div className="card-body d-flex flex-column p-3">
                          <span
                            className="badge bg-light text-muted border mb-1 align-self-start"
                            style={{ fontSize: "0.65rem" }}
                          >
                            {product.category}
                          </span>

                          <h6
                            className="mb-2 fw-semibold"
                            style={{
                              fontSize: "0.82rem",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              minHeight: "2.4em",
                            }}
                          >
                            {product.name}
                          </h6>

                          {/* Amazon-style pricing */}
                          <div className="mt-auto">
                            {hasDiscount ? (
                              <>
                                <div className="d-flex align-items-baseline gap-1 flex-wrap">
                                  <span className="fw-bold" style={{ color: "#B12704", fontSize: "1.1rem" }}>
                                    ${salePrice.toFixed(2)}
                                  </span>
                                  <span className="text-muted text-decoration-line-through" style={{ fontSize: "0.72rem" }}>
                                    ${origPrice.toFixed(2)}
                                  </span>
                                </div>
                                <p className="mb-2 text-success fw-semibold" style={{ fontSize: "0.68rem" }}>
                                  Save ${(origPrice - salePrice).toFixed(2)} ({discountPct}% off)
                                </p>
                              </>
                            ) : (
                              <p className="fw-bold mb-2" style={{ color: "#0F1111", fontSize: "1.05rem" }}>
                                ${salePrice.toFixed(2)}
                              </p>
                            )}

                            {/* ✅ Buttons — stopPropagation keeps card click from firing */}
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-warning btn-sm flex-fill"
                                style={{ fontSize: "0.72rem", position: "relative", zIndex: 2 }}
                                disabled={isOutOfStock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToCart(product);
                                }}
                              >
                                <ShoppingCart size={12} className="me-1" />
                                Add to Cart
                              </button>

                              <button
                                className="btn btn-warning btn-sm flex-fill"
                                style={{ fontSize: "0.72rem", position: "relative", zIndex: 2 }}
                                disabled={isOutOfStock}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // onAddToCart(product);
                                  onNavigate("checkout");
                                }}
                              >
                                Buy Now
                              </button>
                            </div>
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

      <style>{`
        .hover-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .hover-card:hover { transform: translateY(-6px); box-shadow: 0 12px 28px rgba(0,0,0,0.14) !important; }
      `}</style>
    </div>
  );
};

export default Home;