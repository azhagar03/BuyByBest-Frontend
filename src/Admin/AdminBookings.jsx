import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const STATUS_COLORS = {
  placed:     { bg: "#0dcaf0", color: "#fff" },
  confirmed:  { bg: "#0d6efd", color: "#fff" },
  processing: { bg: "#ffc107", color: "#000" },
  shipped:    { bg: "#17a2b8", color: "#fff" },
  delivered:  { bg: "#198754", color: "#fff" },
  cancelled:  { bg: "#dc3545", color: "#fff" },
};
const PAYMENT_COLORS = {
  pending:  { bg: "#ffc107", color: "#000" },
  paid:     { bg: "#198754", color: "#fff" },
  failed:   { bg: "#dc3545", color: "#fff" },
  refunded: { bg: "#6c757d", color: "#fff" },
};
const ORDER_STATUSES   = ["placed","confirmed","processing","shipped","delivered","cancelled"];
const PAYMENT_STATUSES = ["pending","paid","failed","refunded"];

const n = (v) => Number(v) || 0;

const AdminBookings = () => {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [expandedOrder, setExpanded]  = useState(null);
  const [filterStatus, setFilterStatus]   = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [searchQuery, setSearchQuery]     = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch("https://buybybest-backend-0khu.onrender.com/orders/admin/all");
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Bookings fetch error:", err);
      setError(err.message);
      toast.error("Failed to fetch orders: " + err.message);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId, field, value) => {
    try {
      const res  = await fetch(`https://buybybest-backend-0khu.onrender.com/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, ...updated } : o));
      toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update: " + err.message);
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus  = filterStatus  === "all" || o.orderStatus  === filterStatus;
    const matchPayment = filterPayment === "all" || o.paymentStatus === filterPayment;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch  = !q ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.userName?.toLowerCase().includes(q) ||
      o.userEmail?.toLowerCase().includes(q) ||
      o.shippingAddress?.phone?.includes(q) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(q);
    return matchStatus && matchPayment && matchSearch;
  });

  const stats = {
    total:   orders.length,
    cod:     orders.filter(o => o.paymentMethod === "cod").length,
    online:  orders.filter(o => o.paymentMethod === "razorpay").length,
    pending: orders.filter(o => o.paymentStatus === "pending").length,
    revenue: orders.filter(o => o.paymentStatus === "paid").reduce((s,o) => s + n(o.total), 0),
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0">User Bookings</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchOrders}>
          🔄 Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Orders",    value: stats.total,                      icon: "📦", color: "#1a1a2e" },
          { label: "COD Orders",      value: stats.cod,                        icon: "💵", color: "#e67e22" },
          { label: "Online (Razorpay)", value: stats.online,                   icon: "💳", color: "#2ecc71" },
          { label: "Pending Payment", value: stats.pending,                    icon: "⏳", color: "#f39c12" },
          { label: "Revenue",         value: `₹${stats.revenue.toFixed(0)}`,  icon: "💰", color: "#8e44ad" },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-4 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                  <span className="text-muted small">{s.label}</span>
                </div>
                <h4 className="fw-bold mb-0" style={{ color: s.color }}>{s.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-4">
              <input
                className="form-control"
                placeholder="Search order#, name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Order Status</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-3">
              <select className="form-select" value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
                <option value="all">All Payment Status</option>
                {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-2">
              <span className="text-muted small">{filtered.length} of {orders.length} orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <span>⚠️</span>
          <div>
            <strong>Failed to load orders:</strong> {error}
            <br /><small>Check that the backend is running and <code>/api/orders/admin/all</code> route exists.</small>
          </div>
          <button className="btn btn-sm btn-danger ms-auto" onClick={fetchOrders}>Retry</button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" style={{ width: "2.5rem", height: "2.5rem" }} />
          <p className="text-muted mt-3">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5 text-muted">
            <p className="mb-0">No orders found{searchQuery ? ` for "${searchQuery}"` : ""}</p>
          </div>
        </div>
      ) : (
        <div className="vstack gap-3">
          {filtered.map((order) => (
            <div key={order._id} className="card border-0 shadow-sm">

              {/* Row header */}
              <div
                className="card-header bg-white p-3"
                style={{ cursor: "pointer" }}
                onClick={() => setExpanded(expandedOrder === order._id ? null : order._id)}
              >
                <div className="row align-items-center g-2">

                  <div className="col-6 col-md-2">
                    <p className="text-muted mb-0" style={{ fontSize: "0.68rem" }}>ORDER #</p>
                    <span className="fw-bold" style={{ color: "#ffc107", fontSize: "0.82rem" }}>
                      {order.orderNumber}
                    </span>
                    <p className="text-muted mb-0" style={{ fontSize: "0.65rem" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="col-6 col-md-2">
                    <p className="text-muted mb-0" style={{ fontSize: "0.68rem" }}>CUSTOMER</p>
                    <p className="fw-semibold mb-0 small text-truncate">
                      {order.userName || order.shippingAddress?.fullName || "N/A"}
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: "0.65rem" }}>
                      {order.shippingAddress?.phone || order.userPhone || "—"}
                    </p>
                  </div>

                  <div className="col-4 col-md-1 text-center">
                    <p className="text-muted mb-0" style={{ fontSize: "0.68rem" }}>ITEMS</p>
                    <span className="badge bg-light text-dark border">{order.items?.length || 0}</span>
                  </div>

                  <div className="col-4 col-md-2">
                    <p className="text-muted mb-0" style={{ fontSize: "0.68rem" }}>TOTAL</p>
                    <p className="fw-bold mb-0">₹{n(order.total).toFixed(2)}</p>
                    <span className="badge bg-light text-dark border text-uppercase" style={{ fontSize: "0.6rem" }}>
                      {order.paymentMethod}
                    </span>
                  </div>

                  <div className="col-4 col-md-2">
                    <p className="text-muted mb-0" style={{ fontSize: "0.68rem" }}>ORDER STATUS</p>
                    <select
                      className="form-select form-select-sm mt-1"
                      style={{
                        fontSize: "0.72rem",
                        background: STATUS_COLORS[order.orderStatus]?.bg || "#6c757d",
                        color:      STATUS_COLORS[order.orderStatus]?.color || "#fff",
                        border: "none",
                      }}
                      value={order.orderStatus}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); updateStatus(order._id, "orderStatus", e.target.value); }}
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s} style={{ background: "#fff", color: "#000" }}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6 col-md-2">
                    <p className="text-muted mb-0" style={{ fontSize: "0.68rem" }}>PAYMENT STATUS</p>
                    <select
                      className="form-select form-select-sm mt-1"
                      style={{
                        fontSize: "0.72rem",
                        background: PAYMENT_COLORS[order.paymentStatus]?.bg || "#ffc107",
                        color:      PAYMENT_COLORS[order.paymentStatus]?.color || "#000",
                        border: "none",
                      }}
                      value={order.paymentStatus}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); updateStatus(order._id, "paymentStatus", e.target.value); }}
                    >
                      {PAYMENT_STATUSES.map(s => (
                        <option key={s} value={s} style={{ background: "#fff", color: "#000" }}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6 col-md-1 text-end">
                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                      {expandedOrder === order._id ? "▲" : "▼"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded body */}
              {expandedOrder === order._id && (
                <div className="card-body border-top p-4">
                  <div className="row g-4">
                    {/* Items */}
                    <div className="col-md-7">
                      <h6 className="fw-bold mb-3">📦 Order Items</h6>
                      <div className="vstack gap-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="d-flex gap-3 align-items-center p-2 bg-light rounded">
                            <div style={{ width: 50, height: 50 }} className="flex-shrink-0 rounded overflow-hidden bg-white">
                              {item.images?.[0]
                                ? <img src={item.images[0]} alt={item.name} className="w-100 h-100" style={{ objectFit: "cover" }} />
                                : <div className="w-100 h-100 d-flex align-items-center justify-content-center">📦</div>}
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

                    {/* Right panel */}
                    <div className="col-md-5">
                      <h6 className="fw-bold mb-2">📍 Shipping</h6>
                      <div className="bg-light rounded p-3 small text-muted mb-3">
                        <p className="fw-semibold text-dark mb-1">{order.shippingAddress?.fullName}</p>
                        <p className="mb-0">{order.shippingAddress?.address}</p>
                        <p className="mb-0">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                        <p className="mb-0">{order.shippingAddress?.country}</p>
                        <p className="mb-0">📞 {order.shippingAddress?.phone}</p>
                        <p className="mb-0">✉️ {order.shippingAddress?.email || order.userEmail}</p>
                      </div>

                      <h6 className="fw-bold mb-2">💳 Payment</h6>
                      <div className="bg-light rounded p-3 small">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Method</span>
                          <span className="fw-semibold text-capitalize">{order.paymentMethod}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Subtotal</span>
                          <span>₹{n(order.subtotal).toFixed(2)}</span>
                        </div>
                        {n(order.discount) > 0 && (
                          <div className="d-flex justify-content-between mb-1 text-success">
                            <span>Discount</span><span>-₹{n(order.discount).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Tax</span>
                          <span>₹{n(order.tax).toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold pt-1 border-top">
                          <span>Total</span>
                          <span>₹{n(order.total).toFixed(2)}</span>
                        </div>
                        {order.razorpayPaymentId && (
                          <div className="mt-2 pt-2 border-top">
                            <small className="text-muted">Razorpay ID: {order.razorpayPaymentId}</small>
                          </div>
                        )}
                      </div>

                      <p className="text-muted mt-2 mb-0" style={{ fontSize: "0.68rem" }}>
                        Placed: {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;