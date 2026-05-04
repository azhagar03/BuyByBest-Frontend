import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useToast } from "../Context/ToastContext";

// Safe number — never NaN
const n = (val) => Number(val) || 0;

// ─── CartPage reads directly from the `cart` prop (flat array from App).
// All mutations go through App's handlers which persist to the server.
// No local state copy — so the count and amounts are always in sync.
const CartPage = ({ cart, onUpdateCart, onRemoveFromCart, onNavigate }) => {
  const showToast = useToast();

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const item = cart.find((i) => i.productId === productId);
    if (item && item.stock > 0 && newQuantity > item.stock) {
      showToast(`Only ${item.stock} items available in stock`, "error");
      return;
    }
    onUpdateCart(productId, newQuantity);   // goes to App → server
  };

  const removeItem = (productId) => {
    onRemoveFromCart(productId);             // goes to App → server
    showToast("Item removed from cart", "success");
  };

  // ── Totals computed from live prop, never from stale local state ──
  const subtotal = cart.reduce((s, i) => s + n(i.price) * n(i.quantity), 0);
  const discount = cart.reduce((s, i) => {
    const diff = n(i.originalPrice) - n(i.price);
    return diff > 0 ? s + diff * n(i.quantity) : s;
  }, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total    = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card border-0 shadow-sm p-5 text-center">
          <ShoppingCart size={72} className="text-muted mb-4 mx-auto" />
          <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
          <p className="text-muted mb-4">Add some items and come back!</p>
          <button className="btn btn-success btn-lg px-5" onClick={() => onNavigate("home")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-0">
            Shopping Cart
            <span className="ms-2 text-muted fs-5 fw-normal">
              ({cart.length} item{cart.length !== 1 ? "s" : ""})
            </span>
          </h1>
          <button className="btn btn-link text-decoration-none" onClick={() => onNavigate("home")}>
            ← Continue Shopping
          </button>
        </div>

        <div className="row g-4">
          {/* ── Items ── */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {/* Header row */}
                <div className="p-3 bg-light border-bottom d-none d-md-block">
                  <div className="row fw-semibold text-muted small">
                    <div className="col-5">PRODUCT</div>
                    <div className="col-2 text-center">PRICE</div>
                    <div className="col-3 text-center">QUANTITY</div>
                    <div className="col-2 text-end">TOTAL</div>
                  </div>
                </div>

                {cart.map((item) => {
                  const price     = n(item.price);
                  const origPrice = n(item.originalPrice);
                  const qty       = n(item.quantity);
                  const stock     = n(item.stock);
                  const pid       = item.productId;   // always a string

                  return (
                    <div key={pid} className="p-3 border-bottom">
                      <div className="row align-items-center gy-2">
                        {/* Product info */}
                        <div className="col-12 col-md-5">
                          <div className="d-flex gap-3">
                            <div
                              className="flex-shrink-0 rounded overflow-hidden bg-light"
                              style={{ width: 80, height: 80, cursor: "pointer" }}
                              onClick={() => onNavigate("productDetails", item)}
                            >
                              {item.images?.[0] ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.name}
                                  className="w-100 h-100"
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <div className="w-100 h-100 d-flex align-items-center justify-content-center fs-3">📦</div>
                              )}
                            </div>
                            <div>
                              <h6
                                className="fw-semibold mb-1"
                                style={{ cursor: "pointer" }}
                                onClick={() => onNavigate("productDetails", item)}
                              >
                                {item.name}
                              </h6>
                              <p className="text-muted small mb-1">{item.category}</p>
                              {stock > 0 && stock <= 10 && (
                                <p className="text-warning small mb-0">Only {stock} left</p>
                              )}
                              {stock === 0 && (
                                <p className="text-danger small mb-0">Out of Stock</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-4 col-md-2 text-center">
                          <div className="fw-bold" style={{ color: "#B12704" }}>
                            ${price.toFixed(2)}
                          </div>
                          {origPrice > price && (
                            <div className="text-muted text-decoration-line-through small">
                              ${origPrice.toFixed(2)}
                            </div>
                          )}
                        </div>

                        {/* Quantity stepper */}
                        <div className="col-4 col-md-3">
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              style={{ width: 30, height: 30, padding: 0 }}
                              onClick={() => updateQuantity(pid, qty - 1)}
                              disabled={qty <= 1}
                            >
                              <Minus size={13} />
                            </button>

                            <input
                              type="number"
                              className="form-control form-control-sm text-center px-1"
                              style={{ width: 52 }}
                              value={qty}
                              min="1"
                              max={stock || 999}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                updateQuantity(pid, val);
                              }}
                            />

                            <button
                              className="btn btn-sm btn-outline-secondary"
                              style={{ width: 30, height: 30, padding: 0 }}
                              onClick={() => updateQuantity(pid, qty + 1)}
                              disabled={stock > 0 && qty >= stock}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Line total + remove */}
                        <div className="col-4 col-md-2 text-end">
                          <div className="fw-bold mb-1">${(price * qty).toFixed(2)}</div>
                          <button
                            className="btn btn-sm btn-link text-danger p-0"
                            onClick={() => removeItem(pid)}
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm position-sticky" style={{ top: 20 }}>
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Order Summary</h4>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)
                  </span>
                  <span className="fw-semibold">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>You save</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-semibold">
                    {shipping === 0
                      ? <span className="text-success">FREE</span>
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {subtotal > 0 && subtotal < 50 && (
                  <div className="alert alert-info py-2 small mb-3">
                    Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for FREE shipping!
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <span className="h5 fw-bold mb-0">Total</span>
                  <span className="h5 fw-bold text-warning mb-0">${total.toFixed(2)}</span>
                </div>

                <button
                  className="btn btn-success btn-lg w-100 mb-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                  onClick={() => onNavigate("checkout")}
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>

                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => onNavigate("home")}
                >
                  Continue Shopping
                </button>

                <div className="mt-4 pt-3 border-top">
                  <p className="text-muted small mb-2">We Accept:</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <span className="badge bg-light text-dark border">💳 Visa</span>
                    <span className="badge bg-light text-dark border">💳 Mastercard</span>
                    <span className="badge bg-light text-dark border">💳 PayPal</span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <small className="text-muted">🔒 Secure checkout with SSL encryption</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
};

export default CartPage;