import { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, X, Clock } from "lucide-react";
import Logo from "../assets/Logo.png";

const n = (v) => Number(v) || 0;

const STATUS_CONFIG = {
  placed:     { label: "Order Placed",   color: "#1a4fa0", icon: "📋", bg: "#e8f0fb" },
  confirmed:  { label: "Confirmed",      color: "#1a4fa0", icon: "✅", bg: "#e8f0fb" },
  processing: { label: "Processing",     color: "#FF7A00", icon: "⚙️", bg: "#fff3e0" },
  shipped:    { label: "Shipped",        color: "#0891b2", icon: "🚚", bg: "#e0f7fa" },
  delivered:  { label: "Delivered",      color: "#2d8c3c", icon: "📦", bg: "#e8f5e9" },
  cancelled:  { label: "Cancelled",      color: "#dc2626", icon: "❌", bg: "#fee2e2" },
};

const PAYMENT_CONFIG = {
  pending:  { label: "Pending",  color: "#FF7A00", bg: "#fff3e0" },
  paid:     { label: "Paid",     color: "#2d8c3c", bg: "#e8f5e9" },
  failed:   { label: "Failed",   color: "#dc2626", bg: "#fee2e2" },
  refunded: { label: "Refunded", color: "#6b7280", bg: "#f3f4f6" },
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

const Badge = ({ label, color, bg }) => (
  <span style={{ background: bg, color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, border: `1px solid ${color}30` }}>
    {label}
  </span>
);

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
      console.log("Fetched orders:", data);
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
    if (activeTab === "active")    return ["placed","confirmed","processing","shipped"].includes(o.orderStatus);
    if (activeTab === "delivered") return o.orderStatus === "delivered";
    if (activeTab === "cancelled") return o.orderStatus === "cancelled";
    return true;
  });

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f0fb, #f0f7f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', textAlign: 'center', maxWidth: 380, boxShadow: '0 8px 40px rgba(26,79,160,0.12)' }}>
          <img src={Logo} alt="The Indian Commerce" style={{ height: 72, marginBottom: 20 }} />
          <h4 style={{ color: '#0d2b5e', fontWeight: 700, marginBottom: 8 }}>Please Sign In</h4>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Log in to view your account and orders</p>
          <button onClick={() => onNavigate("login")} style={{ background: 'linear-gradient(135deg,#FF7A00,#e06500)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Orders",  value: orders.length, icon: "📦", color: "#1a4fa0", bg: "#e8f0fb" },
    { label: "Active",        value: orders.filter(o => ["placed","confirmed","processing","shipped"].includes(o.orderStatus)).length, icon: "⏳", color: "#FF7A00", bg: "#fff3e0" },
    { label: "Delivered",     value: orders.filter(o => o.orderStatus === "delivered").length, icon: "✅", color: "#2d8c3c", bg: "#e8f5e9" },
    { label: "Total Spent",   value: `₹${orders.filter(o=>o.orderStatus!=="cancelled").reduce((s,o)=>s+n(o.total),0).toFixed(0)}`, icon: "💰", color: "#7c3aed", bg: "#f3e8ff" },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        .tic-tab-btn { background: #e2e8f0; color: #475569; border: none; border-radius: 20px; padding: 7px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .tic-tab-btn.active { background: #1a4fa0; color: #fff; }
        .tic-tab-btn:hover:not(.active) { background: #cbd5e1; }
        .tic-order-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; transition: box-shadow 0.2s; }
        .tic-order-card:hover { box-shadow: 0 4px 20px rgba(26,79,160,0.1); }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>

        {/* Profile Header */}
        <div style={{ background: 'linear-gradient(135deg, #0d2b5e 0%, #1a4fa0 100%)', borderRadius: 16, padding: '28px 32px', marginBottom: 24, boxShadow: '0 8px 32px rgba(13,43,94,0.25)', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#FF7A00,#e06500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 4px 16px rgba(255,122,0,0.4)' }}>
            {(user.username || user.name || "U")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 2 }}>{user.username || user.name}</h4>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 0, fontSize: 13 }}>{user.email}</p>
            {user.phone && <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 0, fontSize: 13 }}>📞 {user.phone}</p>}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate("home")} style={{ background: 'linear-gradient(135deg,#FF7A00,#e06500)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              🛍️ Shop More
            </button>
            <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, padding: '9px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '18px 16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1px solid ${s.color}20` }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders Section */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 0' }}>
            <h5 style={{ fontWeight: 700, color: '#0d2b5e', marginBottom: 16 }}>My Orders</h5>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              {tabs.map(tab => (
                <button key={tab.key} className={`tic-tab-btn ${activeTab === tab.key ? 'active' : ''}`} onClick={() => setActiveTab(tab.key)}>
                  {tab.label}
                  {tab.key !== "all" && (
                    <span style={{ marginLeft: 5, background: 'rgba(255,255,255,0.3)', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>
                      {tab.key === "active"    && orders.filter(o=>["placed","confirmed","processing","shipped"].includes(o.orderStatus)).length}
                      {tab.key === "delivered" && orders.filter(o=>o.orderStatus==="delivered").length}
                      {tab.key === "cancelled" && orders.filter(o=>o.orderStatus==="cancelled").length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: 24 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ width: 40, height: 40, border: '4px solid #e8f0fb', borderTop: '4px solid #1a4fa0', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                <p style={{ color: '#6b7280', marginTop: 16 }}>Loading your orders...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Package size={52} color="#cbd5e1" style={{ marginBottom: 12 }} />
                <p style={{ color: '#6b7280' }}>No orders found</p>
                <button onClick={() => onNavigate("home")} style={{ background: 'linear-gradient(135deg,#FF7A00,#e06500)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 700, cursor: 'pointer' }}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map((order) => {
                  const cfg         = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
                  const paymentCfg  = PAYMENT_CONFIG[order.paymentStatus] || PAYMENT_CONFIG.pending;
                  const cancellable = canCancel(order);
                  const timeLeft    = timeUntilCancelExpiry(order);
                  const isExpanded  = expandedOrder === order._id;

                  return (
                    <div key={order._id} className="tic-order-card">
                      {/* Order Header */}
                      <div style={{ padding: '16px 20px', cursor: 'pointer' }} onClick={() => setExpanded(isExpanded ? null : order._id)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          <div style={{ minWidth: 140 }}>
                            <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order</div>
                            <div style={{ fontWeight: 700, color: '#FF7A00', fontSize: 14 }}>#{order.orderNumber}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>
                              {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                          </div>
                          <div style={{ minWidth: 80 }}>
                            <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#0d2b5e' }}>₹{n(order.total).toFixed(2)}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Status</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              <Badge label={`${cfg.icon} ${cfg.label}`} color={cfg.color} bg={cfg.bg} />
                              <Badge label={paymentCfg.label} color={paymentCfg.color} bg={paymentCfg.bg} />
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {cancellable && (
                              <button
                                onClick={e => { e.stopPropagation(); setCancelConfirm(order._id); }}
                                style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                              >
                                <X size={12} /> Cancel
                              </button>
                            )}
                            {timeLeft && cancellable && (
                              <span style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Clock size={11} />{timeLeft}
                              </span>
                            )}
                            {isExpanded ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
                          </div>
                        </div>

                        {/* Cancel Confirm */}
                        {cancelConfirm === order._id && (
                          <div onClick={e => e.stopPropagation()} style={{ marginTop: 12, background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', marginBottom: 10 }}>⚠️ Are you sure you want to cancel this order?</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button disabled={cancelling === order._id} onClick={() => handleCancel(order._id)}
                                style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                {cancelling === order._id ? "Cancelling..." : "Yes, Cancel"}
                              </button>
                              <button onClick={() => setCancelConfirm(null)}
                                style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                Keep Order
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Items preview strip */}
                      {!isExpanded && (
                        <div style={{ padding: '10px 20px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', borderRadius: 8, padding: '5px 10px', maxWidth: 200 }}>
                              {item.images?.[0]
                                ? <img src={item.images[0]} alt={item.name} style={{ width: 26, height: 26, objectFit: 'cover', borderRadius: 4 }} />
                                : <span>📦</span>
                              }
                              <span style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>{item.name}</span>
                              <span style={{ fontSize: 10, color: '#9ca3af' }}>×{item.quantity}</span>
                            </div>
                          ))}
                          {order.items?.length > 3 && <span style={{ fontSize: 11, color: '#9ca3af' }}>+{order.items.length - 3} more</span>}
                        </div>
                      )}

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: 24 }}>
                          {/* Timeline */}
                          <h6 style={{ fontWeight: 700, color: '#0d2b5e', marginBottom: 16 }}>Order Timeline</h6>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 8, marginBottom: 24 }}>
                            {["placed","confirmed","processing","shipped","delivered"].map((s, i, arr) => {
                              const statusOrder = ["placed","confirmed","processing","shipped","delivered","cancelled"];
                              const currentIdx  = statusOrder.indexOf(order.orderStatus);
                              const thisIdx     = statusOrder.indexOf(s);
                              const isDone      = order.orderStatus !== "cancelled" && currentIdx >= thisIdx;
                              const isCurrent   = s === order.orderStatus;
                              const c2          = STATUS_CONFIG[s];
                              return (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                  <div style={{ textAlign: 'center', minWidth: 72 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: '50%', margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDone ? c2.color : '#e2e8f0', fontSize: '0.9rem', boxShadow: isCurrent ? `0 0 0 3px ${c2.color}40` : 'none' }}>
                                      {c2.icon}
                                    </div>
                                    <p style={{ fontSize: '0.6rem', color: isDone ? c2.color : '#9ca3af', fontWeight: isCurrent ? 700 : 400, margin: 0 }}>{c2.label}</p>
                                  </div>
                                  {i < arr.length - 1 && (
                                    <div style={{ height: 2, width: 32, background: isDone && currentIdx > thisIdx ? '#2d8c3c' : '#e2e8f0', flexShrink: 0 }} />
                                  )}
                                </div>
                              );
                            })}
                            {order.orderStatus === "cancelled" && (
                              <span style={{ marginLeft: 12, background: '#fee2e2', color: '#dc2626', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>❌ Cancelled</span>
                            )}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                            {/* Items */}
                            <div>
                              <h6 style={{ fontWeight: 700, color: '#0d2b5e', marginBottom: 12 }}>Items Ordered</h6>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {order.items?.map((item, idx) => (
                                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fff', borderRadius: 8, padding: 10 }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                                      {item.images?.[0]
                                        ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                                      }
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{item.name}</p>
                                      <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>Qty: {item.quantity} × ₹{n(item.price).toFixed(2)}</p>
                                    </div>
                                    <span style={{ fontWeight: 700, fontSize: 13, color: '#FF7A00' }}>₹{(n(item.price)*n(item.quantity)).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Address + Payment */}
                            <div>
                              <h6 style={{ fontWeight: 700, color: '#0d2b5e', marginBottom: 10 }}>Delivery Address</h6>
                              <div style={{ background: '#fff', borderRadius: 8, padding: 14, fontSize: 13, marginBottom: 16 }}>
                                <p style={{ fontWeight: 700, color: '#0d2b5e', marginBottom: 4 }}>{order.shippingAddress?.fullName}</p>
                                <p style={{ color: '#6b7280', marginBottom: 2 }}>{order.shippingAddress?.address}</p>
                                <p style={{ color: '#6b7280', marginBottom: 2 }}>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                                <p style={{ color: '#6b7280', margin: 0 }}>📞 {order.shippingAddress?.phone}</p>
                              </div>

                              <h6 style={{ fontWeight: 700, color: '#0d2b5e', marginBottom: 10 }}>Payment</h6>
                              <div style={{ background: '#fff', borderRadius: 8, padding: 14, fontSize: 13 }}>
                                {[
                                  { label: 'Method', value: order.paymentMethod },
                                  n(order.discount) > 0 && { label: 'Saved', value: `-₹${n(order.discount).toFixed(2)}`, green: true },
                                  { label: 'Shipping', value: n(order.shipping) === 0 ? 'FREE' : `₹${n(order.shipping).toFixed(2)}` },
                                  { label: 'Tax', value: `₹${n(order.tax).toFixed(2)}` },
                                ].filter(Boolean).map(row => (
                                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: row.green ? '#2d8c3c' : '#6b7280' }}>
                                    <span>{row.label}</span><span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{row.value}</span>
                                  </div>
                                ))}
                                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 15 }}>
                                  <span style={{ color: '#0d2b5e' }}>Total</span>
                                  <span style={{ color: '#FF7A00' }}>₹{n(order.total).toFixed(2)}</span>
                                </div>
                              </div>
                              {order.paymentMethod === "cod" && order.paymentStatus === "pending" && order.orderStatus !== "cancelled" && (
                                <div style={{ background: '#fff3e0', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px', marginTop: 10, fontSize: 12 }}>
                                  💵 Keep <strong>₹{n(order.total).toFixed(2)}</strong> ready for delivery
                                </div>
                              )}
                              {order.paymentStatus === "refunded" && (
                                <div style={{ background: '#e0f7fa', border: '1px solid #a5f3fc', borderRadius: 8, padding: '10px 14px', marginTop: 10, fontSize: 12 }}>
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