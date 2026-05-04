import { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, X, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react";

const n = (v) => Number(v) || 0;

const STATUS_CONFIG = {
  placed:     { label: "Order Placed",   color: "#0dcaf0", icon: "📋", bg: "bg-info" },
  confirmed:  { label: "Confirmed",      color: "#0d6efd", icon: "✅", bg: "bg-primary" },
  processing: { label: "Processing",     color: "#ffc107", icon: "⚙️", bg: "bg-warning" },
  shipped:    { label: "Shipped",        color: "#17a2b8", icon: "🚚", bg: "bg-info" },
  delivered:  { label: "Delivered",      color: "#198754", icon: "📦", bg: "bg-success" },
  cancelled:  { label: "Cancelled",      color: "#dc3545", icon: "❌", bg: "bg-danger" },
};

const PAYMENT_CONFIG = {
  pending:  { label: "Pending",  cls: "bg-warning text-dark" },
  paid:     { label: "Paid",     cls: "bg-success text-white" },
  failed:   { label: "Failed",   cls: "bg-danger text-white" },
  refunded: { label: "Refunded", cls: "bg-secondary text-white" },
};

const canCancel = (order) => {
  const hoursElapsed = (Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60);
  return ["placed", "confirmed"].includes(order.orderStatus) && hoursElapsed <= 24;
};

const timeUntilCancelExpiry = (order) => {
  const hoursElapsed = (Date.now() - new Date(order.createdAt)) / (1000 * 60 * 60);
  const remaining = 24 - hoursElapsed;
  if (remaining <= 0) return null;
  const h = Math.floor(remaining);
  const m = Math.floor((remaining - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const AccountPage = ({ user, onNavigate, onLogout }) => {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [expandedOrder, setExpanded]  = useState(null);
  const [cancelling, setCancelling]   = useState(null);
  const [activeTab, setActiveTab]     = useState("all");
  const [cancelConfirm, setCancelConfirm] = useState(null);

  useEffect(() => {
    if (user?._id || user?.id) fetchOrders();
    else setLoading(false);
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const uid = user._id || user.id;
      const res  = await fetch(`https://buybybest-back-end.onrender.com/api/orders/user/${uid}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setOrders([]);
    }
    setLoading(false);
  };

  const handleCancel = async (orderId) => {
    setCancelling(orderId);
    try {
      const res  = await fetch(`https://buybybest-back-end.onrender.com/api/orders/${orderId}/cancel`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => o._id === orderId ? data.order : o));
        setCancelConfirm(null);
      } else {
        alert(data.message || "Could not cancel order");
      }
    } catch {
      alert("Failed to cancel order. Please try again.");
    }
    setCancelling(null);
  };

  const tabs = [
    { key: "all",       label: "All Orders" },
    { key: "active",    label: "Active" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const filtered = orders.filter((o) => {
    if (activeTab === "all")       return true;
    if (activeTab === "active")    return ["placed", "confirmed", "processing", "shipped"].includes(o.orderStatus);
    if (activeTab === "delivered") return o.orderStatus === "delivered";
    if (activeTab === "cancelled") return o.orderStatus === "cancelled";
    return true;
  });

  if (!user) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card border-0 shadow-sm p-5 text-center" style={{ maxWidth: 400 }}>
          <div style={{ fontSize: "4rem" }}>🔒</div>
          <h4 className="fw-bold mt-3 mb-2">Please Sign In</h4>
          <p className="text-muted mb-4">Log in to view your account and orders</p>
          <button className="btn btn-warning btn-lg" onClick={() => onNavigate("login")}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4" style={{ maxWidth: 960 }}>

        {/* ── Profile Header ── */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-4 flex-wrap">
              <div
                className="rounded-circle bg-warning d-flex align-items-center justify-content-center fw-bold text-dark flex-shrink-0"
                style={{ width: 72, height: 72, fontSize: "1.8rem" }}
              >
                {(user.username || user.name || "U")[0].toUpperCase()}
              </div>
              <div className="flex-grow-1">
                <h4 className="fw-bold mb-0">{user.username || user.name}</h4>
                <p className="text-muted mb-0">{user.email}</p>
                {user.phone && <p className="text-muted mb-0 small">📞 {user.phone}</p>}
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-warning px-4" onClick={() => onNavigate("home")}>
                  🛍️ Shop More
                </button>
                <button className="btn btn-outline-danger px-4" onClick={onLogout}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="row g-3 mb-4">
          {[
            { label: "Total Orders",  value: orders.length,                                          icon: "📦", color: "#1a1a2e" },
            { label: "Active",        value: orders.filter(o => ["placed","confirmed","processing","shipped"].includes(o.orderStatus)).length, icon: "⏳", color: "#e67e22" },
            { label: "Delivered",     value: orders.filter(o => o.orderStatus === "delivered").length, icon: "✅", color: "#27ae60" },
            { label: "Total Spent",   value: `₹${orders.filter(o=>o.orderStatus!=="cancelled").reduce((s,o)=>s+n(o.total),0).toFixed(0)}`, icon: "💰", color: "#8e44ad" },
          ].map((s) => (
            <div key={s.label} className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3 text-center">
                  <div style={{ fontSize: "1.8rem" }}>{s.icon}</div>
                  <h5 className="fw-bold mb-0 mt-1" style={{ color: s.color }}>{s.value}</h5>
                  <p className="text-muted small mb-0">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Orders Section ── */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
            <h5 className="fw-bold mb-3">My Orders</h5>
            {/* Tabs */}
            <div className="d-flex gap-1 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`btn btn-sm px-3 mb-2 ${activeTab === tab.key ? "btn-warning fw-bold" : "btn-light"}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  {tab.key !== "all" && (
                    <span className="ms-1 badge bg-secondary" style={{ fontSize: "0.6rem" }}>
                      {tab.key === "active"    && orders.filter(o=>["placed","confirmed","processing","shipped"].includes(o.orderStatus)).length}
                      {tab.key === "delivered" && orders.filter(o=>o.orderStatus==="delivered").length}
                      {tab.key === "cancelled" && orders.filter(o=>o.orderStatus==="cancelled").length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body p-4 pt-3">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" style={{ width: "2.5rem", height: "2.5rem" }} />
                <p className="text-muted mt-3">Loading your orders...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <Package size={56} className="text-muted mb-3" />
                <h6 className="text-muted">No orders found</h6>
                <button className="btn btn-warning mt-3 px-4" onClick={() => onNavigate("home")}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="vstack gap-3">
                {filtered.map((order) => {
                  const cfg          = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
                  const paymentCfg   = PAYMENT_CONFIG[order.paymentStatus] || PAYMENT_CONFIG.pending;
                  const cancellable  = canCancel(order);
                  const timeLeft     = timeUntilCancelExpiry(order);
                  const isExpanded   = expandedOrder === order._id;

                  return (
                    <div key={order._id} className="border rounded-3 overflow-hidden">
                      {/* Order Header */}
                      <div
                        className="p-3 bg-white"
                        style={{ cursor: "pointer" }}
                        onClick={() => setExpanded(isExpanded ? null : order._id)}
                      >
                        <div className="row align-items-center g-2">
                          {/* Order # and Date */}
                          <div className="col-12 col-sm-4">
                            <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>ORDER</p>
                            <span className="fw-bold text-warning">#{order.orderNumber}</span>
                            <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>
                              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                              })}
                            </p>
                          </div>

                          {/* Total */}
                          <div className="col-6 col-sm-2">
                            <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>TOTAL</p>
                            <span className="fw-bold">₹{n(order.total).toFixed(2)}</span>
                          </div>

                          {/* Status */}
                          <div className="col-6 col-sm-3">
                            <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>STATUS</p>
                            <div className="d-flex align-items-center gap-1 flex-wrap">
                              <span className={`badge ${cfg.bg} text-white`} style={{ fontSize: "0.7rem" }}>
                                {cfg.icon} {cfg.label}
                              </span>
                              <span className={`badge ${paymentCfg.cls}`} style={{ fontSize: "0.65rem" }}>
                                {paymentCfg.label}
                              </span>
                            </div>
                          </div>

                          {/* Cancel + expand */}
                          <div className="col-12 col-sm-3 d-flex align-items-center justify-content-sm-end gap-2">
                            {cancellable && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ fontSize: "0.75rem" }}
                                onClick={(e) => { e.stopPropagation(); setCancelConfirm(order._id); }}
                              >
                                <X size={13} className="me-1" />
                                Cancel
                              </button>
                            )}
                            {timeLeft && cancellable && (
                              <span className="text-muted" style={{ fontSize: "0.65rem" }}>
                                <Clock size={11} className="me-1" />
                                {timeLeft} left
                              </span>
                            )}
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {/* Cancel confirm prompt */}
                        {cancelConfirm === order._id && (
                          <div
                            className="mt-3 p-3 bg-danger bg-opacity-10 rounded-3 border border-danger"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <p className="fw-semibold mb-2 text-danger small">
                              ⚠️ Are you sure you want to cancel this order?
                            </p>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-danger btn-sm"
                                disabled={cancelling === order._id}
                                onClick={() => handleCancel(order._id)}
                              >
                                {cancelling === order._id ? (
                                  <><span className="spinner-border spinner-border-sm me-1" /> Cancelling...</>
                                ) : "Yes, Cancel Order"}
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setCancelConfirm(null)}
                              >
                                Keep Order
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items preview strip */}
                      {!isExpanded && (
                        <div className="px-3 pb-3 bg-white border-top d-flex gap-2 align-items-center flex-wrap">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div key={i} className="d-flex align-items-center gap-2 bg-light rounded px-2 py-1" style={{ maxWidth: 200 }}>
                              {item.images?.[0] ? (
                                <img src={item.images[0]} alt={item.name} style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 4 }} />
                              ) : <span>📦</span>}
                              <span className="text-truncate" style={{ fontSize: "0.72rem", maxWidth: 120 }}>{item.name}</span>
                              <span className="text-muted" style={{ fontSize: "0.68rem" }}>×{item.quantity}</span>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <span className="text-muted small">+{order.items.length - 3} more</span>
                          )}
                        </div>
                      )}

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="p-4 bg-light border-top">
                          {/* Order timeline */}
                          <div className="mb-4">
                            <h6 className="fw-bold mb-3">Order Timeline</h6>
                            <div className="d-flex align-items-center gap-0 overflow-auto pb-1">
                              {["placed","confirmed","processing","shipped","delivered"].map((s, i, arr) => {
                                const statusOrder = ["placed","confirmed","processing","shipped","delivered","cancelled"];
                                const currentIdx  = statusOrder.indexOf(order.orderStatus);
                                const thisIdx     = statusOrder.indexOf(s);
                                const isDone      = order.orderStatus !== "cancelled" && currentIdx >= thisIdx;
                                const isCurrent   = s === order.orderStatus;
                                const cfg2        = STATUS_CONFIG[s];
                                return (
                                  <div key={s} className="d-flex align-items-center flex-shrink-0">
                                    <div className="text-center" style={{ minWidth: 72 }}>
                                      <div
                                        className={`rounded-circle mx-auto d-flex align-items-center justify-content-center mb-1`}
                                        style={{
                                          width: 36, height: 36,
                                          background: isDone ? cfg2.color : "#dee2e6",
                                          color: isDone ? "#fff" : "#aaa",
                                          fontSize: "0.85rem",
                                          fontWeight: isCurrent ? "bold" : "normal",
                                          boxShadow: isCurrent ? `0 0 0 3px ${cfg2.color}40` : "none",
                                        }}
                                      >
                                        {cfg2.icon}
                                      </div>
                                      <p className="mb-0" style={{ fontSize: "0.6rem", color: isDone ? cfg2.color : "#aaa", fontWeight: isCurrent ? "700" : "400" }}>
                                        {cfg2.label}
                                      </p>
                                    </div>
                                    {i < arr.length - 1 && (
                                      <div style={{ height: 2, width: 32, background: isDone && currentIdx > thisIdx ? "#27ae60" : "#dee2e6", flexShrink: 0 }} />
                                    )}
                                  </div>
                                );
                              })}
                              {order.orderStatus === "cancelled" && (
                                <div className="ms-2 badge bg-danger px-3 py-2">❌ Cancelled</div>
                              )}
                            </div>
                          </div>

                          <div className="row g-4">
                            {/* Items */}
                            <div className="col-md-7">
                              <h6 className="fw-bold mb-3">Items Ordered</h6>
                              <div className="vstack gap-2">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="d-flex gap-3 align-items-center bg-white rounded p-2">
                                    <div style={{ width: 52, height: 52 }} className="flex-shrink-0 rounded overflow-hidden bg-light">
                                      {item.images?.[0] ? (
                                        <img src={item.images[0]} alt={item.name} className="w-100 h-100" style={{ objectFit: "cover" }} />
                                      ) : <div className="w-100 h-100 d-flex align-items-center justify-content-center">📦</div>}
                                    </div>
                                    <div className="flex-grow-1">
                                      <p className="fw-semibold mb-0 small">{item.name}</p>
                                      <small className="text-muted">Qty: {item.quantity} × ₹{n(item.price).toFixed(2)}</small>
                                    </div>
                                    <span className="fw-bold small">₹{(n(item.price) * n(item.quantity)).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Right: Address + Payment */}
                            <div className="col-md-5">
                              <h6 className="fw-bold mb-2">Delivery Address</h6>
                              <div className="bg-white rounded p-3 small text-muted mb-3">
                                <p className="fw-semibold text-dark mb-1">{order.shippingAddress?.fullName}</p>
                                <p className="mb-0">{order.shippingAddress?.address}</p>
                                <p className="mb-0">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                                <p className="mb-0">📞 {order.shippingAddress?.phone}</p>
                              </div>

                              <h6 className="fw-bold mb-2">Payment</h6>
                              <div className="bg-white rounded p-3 small">
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="text-muted">Method</span>
                                  <span className="fw-semibold text-capitalize">{order.paymentMethod}</span>
                                </div>
                                {n(order.discount) > 0 && (
                                  <div className="d-flex justify-content-between mb-1 text-success">
                                    <span>Saved</span>
                                    <span>-₹{n(order.discount).toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="text-muted">Shipping</span>
                                  <span>{n(order.shipping) === 0 ? "FREE" : `₹${n(order.shipping).toFixed(2)}`}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                  <span className="text-muted">Tax</span>
                                  <span>₹{n(order.tax).toFixed(2)}</span>
                                </div>
                                <hr className="my-1" />
                                <div className="d-flex justify-content-between fw-bold">
                                  <span>Total</span>
                                  <span className="text-warning">₹{n(order.total).toFixed(2)}</span>
                                </div>
                              </div>

                              {order.paymentMethod === "cod" && order.paymentStatus === "pending" && order.orderStatus !== "cancelled" && (
                                <div className="alert alert-warning mt-2 small py-2 mb-0">
                                  💵 Keep <strong>₹{n(order.total).toFixed(2)}</strong> ready for delivery
                                </div>
                              )}
                              {order.paymentStatus === "refunded" && (
                                <div className="alert alert-info mt-2 small py-2 mb-0">
                                  💳 Refund in 5-7 business days
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
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

export default AccountPage;