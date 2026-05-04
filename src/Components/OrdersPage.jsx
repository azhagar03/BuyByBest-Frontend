import { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, Truck } from "lucide-react";

const statusColors = {
  placed: "bg-info text-white",
  confirmed: "bg-primary text-white",
  processing: "bg-warning text-dark",
  shipped: "bg-info text-white",
  delivered: "bg-success text-white",
  cancelled: "bg-danger text-white",
};

const paymentColors = {
  pending: "bg-warning text-dark",
  paid: "bg-success text-white",
  failed: "bg-danger text-white",
  refunded: "bg-secondary text-white",
};

const OrdersPage = ({ user, onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (user?._id || user?.id) fetchOrders();
    else setLoading(false);
  }, [user]);

  const fetchOrders = async () => {
    try {
      const userId = user._id || user.id;
      const res = await fetch(`https://buybybest-back-end.onrender.com/api/orders/user/${userId}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="card border-0 shadow-sm p-5 text-center">
          <h4 className="fw-bold mb-3">Please log in to view your orders</h4>
          <button className="btn btn-success" onClick={() => onNavigate("login")}>Log In</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-warning" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4" style={{ maxWidth: 900 }}>
        <div className="mb-4">
          <button className="btn btn-link text-decoration-none mb-2 p-0" onClick={() => onNavigate("account")}>
            ← Back to Account
          </button>
          <h1 className="fw-bold">My Orders</h1>
          <p className="text-muted">{orders.length} order{orders.length !== 1 ? "s" : ""} found</p>
        </div>

        {orders.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <Package size={64} className="text-muted mb-3" />
              <h5 className="text-muted">No orders yet</h5>
              <p className="text-muted small mb-4">Start shopping and your orders will appear here</p>
              <button className="btn btn-success px-4" onClick={() => onNavigate("home")}>
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="vstack gap-3">
            {orders.map((order) => (
              <div key={order._id} className="card border-0 shadow-sm">
                <div
                  className="card-header bg-white border-bottom-0 p-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="row align-items-center g-2">
                    <div className="col-12 col-md-3">
                      <p className="text-muted small mb-0">Order Number</p>
                      <h6 className="fw-bold text-warning mb-0">#{order.orderNumber}</h6>
                    </div>
                    <div className="col-6 col-md-2">
                      <p className="text-muted small mb-0">Date</p>
                      <p className="fw-semibold mb-0 small">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="col-6 col-md-2">
                      <p className="text-muted small mb-0">Total</p>
                      <p className="fw-bold mb-0">₹{Number(order.total).toFixed(2)}</p>
                    </div>
                    <div className="col-6 col-md-2">
                      <span className={`badge ${statusColors[order.orderStatus] || "bg-secondary"}`}>
                        {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                      </span>
                    </div>
                    <div className="col-6 col-md-2">
                      <span className={`badge ${paymentColors[order.paymentStatus] || "bg-secondary"}`}>
                        {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1)}
                      </span>
                    </div>
                    <div className="col-md-1 text-end d-none d-md-block">
                      {expandedOrder === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="card-body p-4 border-top">
                    {/* Items */}
                    <h6 className="fw-bold mb-3">Items Ordered</h6>
                    <div className="vstack gap-3 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="d-flex gap-3 align-items-center">
                          <div className="flex-shrink-0 bg-light rounded" style={{ width: 56, height: 56 }}>
                            {item.images?.[0] ? (
                              <img src={item.images[0]} alt={item.name} className="w-100 h-100 rounded" style={{ objectFit: "cover" }} />
                            ) : (
                              <div className="w-100 h-100 d-flex align-items-center justify-content-center">📦</div>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <p className="fw-semibold mb-0">{item.name}</p>
                            <small className="text-muted">Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}</small>
                          </div>
                          <div className="fw-bold">₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <hr />

                    <div className="row g-4">
                      {/* Shipping */}
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-2">Shipping Address</h6>
                        <p className="mb-0 small text-muted">
                          {order.shippingAddress?.fullName}<br />
                          {order.shippingAddress?.address}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                          {order.shippingAddress?.country}<br />
                          📞 {order.shippingAddress?.phone}
                        </p>
                      </div>
                      {/* Payment */}
                      <div className="col-md-6">
                        <h6 className="fw-bold mb-2">Payment Details</h6>
                        <div className="small text-muted vstack gap-1">
                          <div className="d-flex justify-content-between">
                            <span>Method:</span>
                            <span className="fw-semibold text-dark text-capitalize">{order.paymentMethod}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>₹{Number(order.subtotal).toFixed(2)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="d-flex justify-content-between text-success">
                              <span>Discount:</span>
                              <span>-₹{Number(order.discount).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="d-flex justify-content-between">
                            <span>Shipping:</span>
                            <span>{order.shipping === 0 ? "FREE" : `₹${Number(order.shipping).toFixed(2)}`}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Tax:</span>
                            <span>₹{Number(order.tax).toFixed(2)}</span>
                          </div>
                          <hr className="my-1" />
                          <div className="d-flex justify-content-between fw-bold text-dark">
                            <span>Total:</span>
                            <span>₹{Number(order.total).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.paymentMethod === "cod" && order.paymentStatus === "pending" && (
                      <div className="alert alert-warning mt-3 mb-0 small d-flex align-items-center gap-2">
                        <Truck size={16} />
                        <span>Please keep <strong>₹{Number(order.total).toFixed(2)}</strong> ready for cash payment on delivery.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;