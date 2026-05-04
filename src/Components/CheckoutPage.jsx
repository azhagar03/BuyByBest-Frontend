import { useState, useEffect } from "react";
import { CreditCard, MapPin, Truck, Lock, CheckCircle, Smartphone, Package } from "lucide-react";
import { useToast } from "../Context/ToastContext";

const n = (val) => Number(val) || 0;

const CheckoutPage = ({ cart, user, onNavigate, onClearCart }) => {
  const showToast = useToast();
  const [step, setStep]             = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [whatsappLink, setWhatsappLink] = useState(null); // from backend
  const [placing, setPlacing]       = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.username || "",
    email:    user?.email    || "",
    phone:    user?.phone    || "",
    address: "", city: "", state: "", zipCode: "", country: "India",
  });

  const subtotal = cart.reduce((s, i) => s + n(i.price) * n(i.quantity), 0);
  const discount = cart.reduce((s, i) => {
    const diff = n(i.originalPrice) - n(i.price);
    return diff > 0 ? s + diff * n(i.quantity) : s;
  }, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal + shipping + tax;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src   = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const placeOrderBackend = async (paymentData = {}) => {
    const payload = {
      userId:    user?._id || user?.id,
      userName:  user?.username,
      userEmail: user?.email,
      userPhone: user?.phone,
      items: cart.map((item) => ({
        productId:     item.productId || item._id,
        name:          item.name,
        price:         n(item.price),
        originalPrice: n(item.originalPrice),
        quantity:      n(item.quantity),
        images:        item.images,
        category:      item.category,
      })),
      shippingAddress: shippingInfo,
      paymentMethod,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax:      parseFloat(tax.toFixed(2)),
      total:    parseFloat(total.toFixed(2)),
      ...paymentData,
    };

    const res  = await fetch("https://buybybest-backend-0khu.onrender.com/orders", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Order failed");
    return data; // { order, whatsappLink }
  };

  const handleCODOrder = async () => {
    setPlacing(true);
    try {
      const { order, whatsappLink: waLink } = await placeOrderBackend({ paymentMethod: "cod" });
      setPlacedOrder(order);
      setWhatsappLink(waLink);
      setOrderPlaced(true);
      showToast("Order placed! Confirmation email sent.", "success");
      onClearCart();
    } catch (err) {
      showToast(err.message || "Failed to place order", "error");
    }
    setPlacing(false);
  };

  const handleRazorpayPayment = async () => {
    setPlacing(true);
    try {
      const res  = await fetch("https://buybybest-backend-0khu.onrender.com/api/orders/create-razorpay-order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ amount: total }),
      });
      const { order: rzpOrder } = await res.json();

      const options = {
        key:         process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID",
        amount:      rzpOrder.amount,
        currency:    "INR",
        name:        "BuyByBest",
        description: "Order Payment",
        order_id:    rzpOrder.id,
        prefill: {
          name:    shippingInfo.fullName,
          email:   shippingInfo.email,
          contact: shippingInfo.phone,
        },
        theme: { color: "#ffc107" },
        handler: async (response) => {
          try {
            const { order, whatsappLink: waLink } = await placeOrderBackend({
              paymentMethod:      "razorpay",
              razorpayOrderId:    response.razorpay_order_id,
              razorpayPaymentId:  response.razorpay_payment_id,
              razorpaySignature:  response.razorpay_signature,
            });
            setPlacedOrder(order);
            setWhatsappLink(waLink);
            setOrderPlaced(true);
            showToast("Payment successful! Confirmation email sent.", "success");
            onClearCart();
          } catch (err) {
            showToast("Order verification failed. Contact support.", "error",err);
          }
          setPlacing(false);
        },
        modal: {
          ondismiss: () => {
            showToast("Payment cancelled.", "error");
            setPlacing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showToast(err.message || "Payment initiation failed", "error");
      setPlacing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "cod") handleCODOrder();
    else handleRazorpayPayment();
  };

  // ── Order Success Screen ──
  if (orderPlaced && placedOrder) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-4">
        <div className="col-md-5 col-11">
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center p-5">
              <CheckCircle size={80} className="text-success mb-3" />
              <h2 className="fw-bold mb-2">Order Placed! 🎉</h2>

              {/* Email sent notice */}
              <div className="alert alert-success py-2 mb-3 d-flex align-items-center gap-2 text-start">
                <span style={{ fontSize: "1.1rem" }}>📧</span>
                <span className="small">
                  Confirmation email sent to <strong>{shippingInfo.email}</strong>
                </span>
              </div>

              <div className="bg-light p-3 rounded mb-3">
                <p className="text-muted small mb-1">Order Number</p>
                <h4 className="fw-bold text-warning mb-0">#{placedOrder.orderNumber}</h4>
              </div>

              <div className="bg-light rounded p-3 mb-4 text-start">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Payment Method</span>
                  <span className="fw-semibold text-capitalize">
                    {placedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                  </span>
                </div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Payment Status</span>
                  <span className={`badge ${placedOrder.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
                    {placedOrder.paymentStatus}
                  </span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Total</span>
                  <span className="fw-bold">₹{Number(placedOrder.total).toFixed(2)}</span>
                </div>
              </div>

              {/* WhatsApp share — uses link from backend (has customer's number pre-filled) */}
              {whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <span style={{ fontSize: "1.1rem" }}>📲</span>
                  Send Order Details via WhatsApp
                </a>
              ) : (
                // Fallback share (no number pre-filled)
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `✅ Order #${placedOrder.orderNumber} confirmed on BuyByBest!\nTotal: ₹${Number(placedOrder.total).toFixed(2)}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                >
                  <span style={{ fontSize: "1.1rem" }}>📲</span>
                  Share Order on WhatsApp
                </a>
              )}

              <button
                className="btn btn-outline-secondary w-100 mb-2"
                onClick={() => onNavigate("account")}
              >
                View My Orders
              </button>
              <button
                className="btn btn-warning w-100"
                onClick={() => onNavigate("home")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty Cart ──
  if (cart.length === 0) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card border-0 shadow-sm p-5 text-center">
          <h2 className="fw-bold mb-3">Your Cart is Empty</h2>
          <button className="btn btn-warning btn-lg" onClick={() => onNavigate("home")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        <div className="mb-4">
          <button className="btn btn-link text-decoration-none mb-2" onClick={() => onNavigate("cart")}>
            ← Back to Cart
          </button>
          <h1 className="fw-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center">
              {[{ num: 1, label: "Shipping" }, { num: 2, label: "Payment" }, { num: 3, label: "Review" }].map(
                ({ num, label }, idx, arr) => (
                  <div key={num} className="d-flex align-items-center flex-grow-1">
                    <div className={`d-flex align-items-center gap-2 ${step >= num ? "text-warning" : "text-muted"}`}>
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${step >= num ? "bg-warning text-dark" : "bg-light text-muted"}`}
                        style={{ width: 32, height: 32, fontSize: "0.85rem" }}
                      >
                        {step > num ? "✓" : num}
                      </div>
                      <span className="fw-semibold d-none d-md-inline">{label}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex-grow-1 mx-2" style={{ height: 2, background: step > num ? "#ffc107" : "#dee2e6" }} />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <MapPin size={22} className="text-warning" />
                    <h4 className="fw-bold mb-0">Shipping Information</h4>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Full Name *</label>
                        <input className="form-control" value={shippingInfo.fullName} required
                          onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email * <small className="text-muted">(confirmation will be sent here)</small></label>
                        <input type="email" className="form-control" value={shippingInfo.email} required
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">WhatsApp Number * <small className="text-muted">(for order updates)</small></label>
                        <input type="tel" className="form-control" value={shippingInfo.phone} required
                          placeholder="10-digit WhatsApp number"
                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Address *</label>
                        <input className="form-control" value={shippingInfo.address} required
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">City *</label>
                        <input className="form-control" value={shippingInfo.city} required
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">State *</label>
                        <input className="form-control" value={shippingInfo.state} required
                          onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">PIN Code *</label>
                        <input className="form-control" value={shippingInfo.zipCode} required
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Country</label>
                        <select className="form-select" value={shippingInfo.country}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}>
                          <option>India</option>
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Canada</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-warning btn-lg w-100 mt-4">
                      Continue to Payment
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <CreditCard size={22} className="text-warning" />
                    <h4 className="fw-bold mb-0">Payment Method</h4>
                  </div>

                  <div className="vstack gap-3 mb-4">
                    {/* COD */}
                    <div
                      className={`p-3 rounded-3 border-2 border ${paymentMethod === "cod" ? "border-warning bg-warning bg-opacity-10" : "border-light"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <input className="form-check-input" type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                        <div className="flex-shrink-0 bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                          <Package size={22} className="text-success" />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">Cash on Delivery</h6>
                          <small className="text-muted">Pay when your order arrives at your doorstep</small>
                        </div>
                      </div>
                    </div>

                    {/* Razorpay */}
                    <div
                      className={`p-3 rounded-3 border-2 border ${paymentMethod === "razorpay" ? "border-warning bg-warning bg-opacity-10" : "border-light"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setPaymentMethod("razorpay")}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <input className="form-check-input" type="radio" checked={paymentMethod === "razorpay"} onChange={() => setPaymentMethod("razorpay")} />
                        <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                          <Smartphone size={22} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">UPI / Card / Net Banking</h6>
                          <small className="text-muted">Pay via Razorpay — GPay, PhonePe, Paytm, Cards</small>
                        </div>
                      </div>
                      {paymentMethod === "razorpay" && (
                        <div className="mt-3 pt-2 border-top d-flex gap-2 flex-wrap">
                          {["GPay", "PhonePe", "Paytm", "VISA", "Mastercard"].map((p) => (
                            <span key={p} className="badge bg-light text-dark border px-2 py-1">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-lg flex-fill" onClick={() => setStep(1)}>Back</button>
                    <button className="btn btn-warning btn-lg flex-fill" onClick={() => setStep(3)}>Review Order</button>
                  </div>
                  <div className="mt-3 text-center">
                    <small className="text-muted"><Lock size={13} className="me-1" />100% Secure & Encrypted</small>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="vstack gap-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between mb-3">
                      <h5 className="fw-bold mb-0">Shipping Address</h5>
                      <button className="btn btn-sm btn-link p-0" onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <p className="mb-1 fw-semibold">{shippingInfo.fullName}</p>
                    <p className="mb-1 text-muted">{shippingInfo.address}</p>
                    <p className="mb-1 text-muted">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p className="mb-1 text-muted">{shippingInfo.country}</p>
                    <p className="mb-1 text-muted">📧 {shippingInfo.email}</p>
                    <p className="mb-0 text-muted">📲 {shippingInfo.phone}</p>
                  </div>
                </div>

                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between mb-3">
                      <h5 className="fw-bold mb-0">Payment Method</h5>
                      <button className="btn btn-sm btn-link p-0" onClick={() => setStep(2)}>Edit</button>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      {paymentMethod === "cod"
                        ? <><Package size={20} className="text-success" /> <span className="fw-semibold">Cash on Delivery</span></>
                        : <><Smartphone size={20} className="text-primary" /> <span className="fw-semibold">UPI / Card via Razorpay</span></>
                      }
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">Order Items ({cart.length})</h5>
                    <div className="vstack gap-3">
                      {cart.map((item) => (
                        <div key={item.productId || item._id} className="d-flex gap-3 align-items-center">
                          <div className="flex-shrink-0 bg-light rounded" style={{ width: 60, height: 60 }}>
                            {item.images?.[0]
                              ? <img src={item.images[0]} alt={item.name} className="w-100 h-100 rounded" style={{ objectFit: "cover" }} />
                              : <div className="w-100 h-100 d-flex align-items-center justify-content-center">📦</div>}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-semibold mb-0">{item.name}</h6>
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                          <div className="text-end fw-bold">₹{(n(item.price) * n(item.quantity)).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notification info box */}
                <div className="alert alert-info d-flex align-items-start gap-2 border-0 py-3">
                  <span style={{ fontSize: "1.1rem" }}>📧</span>
                  <div>
                    <strong>Confirmation will be sent to:</strong>
                    <p className="mb-0 small mt-1">
                      Email: <strong>{shippingInfo.email}</strong><br />
                      WhatsApp: <strong>{shippingInfo.phone}</strong>
                    </p>
                  </div>
                </div>

                {paymentMethod === "cod" && (
                  <div className="alert alert-warning d-flex align-items-start gap-2 border-0">
                    <Package size={20} className="flex-shrink-0 mt-1" />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p className="mb-0 small">Please keep ₹{total.toFixed(2)} ready at delivery.</p>
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary btn-lg flex-fill" onClick={() => setStep(2)}>Back</button>
                  <button
                    className="btn btn-warning btn-lg flex-fill fw-bold"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                  >
                    {placing
                      ? <><span className="spinner-border spinner-border-sm me-2" />Processing...</>
                      : <>{paymentMethod === "cod" ? "Place Order — " : "Pay — "}₹{total.toFixed(2)}</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm position-sticky" style={{ top: 20 }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount saved</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-success fw-semibold">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="h5 fw-bold mb-0">Total</span>
                  <span className="h5 fw-bold text-warning mb-0">₹{total.toFixed(2)}</span>
                </div>
                <div className="bg-light p-3 rounded">
                  <div className="d-flex align-items-start gap-2">
                    <Truck size={20} className="text-warning flex-shrink-0 mt-1" />
                    <div>
                      <p className="fw-semibold mb-0">Estimated Delivery</p>
                      <p className="text-muted small mb-0">3–5 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;