import { ShoppingCart, Bell, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/Logo.png";

const AdminLayout = ({ children, onLogout, activePage, onNavigate }) => {
  const [notifications, setNotifications]       = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount]           = useState(0);
  const [lastOpened, setLastOpened]             = useState(Date.now() - 24 * 60 * 60 * 1000);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const res   = await fetch(`https://buybybest-back-end.onrender.com/api/orders/admin/notifications?since=${since}`);
      if (!res.ok) return;
      const data  = await res.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        const newOnes = data.filter((n) => new Date(n.createdAt).getTime() > lastOpened);
        setUnreadCount(newOnes.length);
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  const handleBell = () => {
    setShowNotifications((v) => !v);
    if (!showNotifications) {
      setLastOpened(Date.now());
      setUnreadCount(0);
    }
  };

  const statusBadge = (s) => ({
    placed: "bg-info", confirmed: "bg-primary", processing: "bg-warning",
    shipped: "bg-info", delivered: "bg-success", cancelled: "bg-danger",
  }[s] || "bg-secondary");

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "bookings",  label: "User Bookings", icon: "📦" },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* ── Sidebar ── */}
      <div
        className="text-white d-flex flex-column position-fixed top-0 start-0"
        style={{ width: 240, height: "100vh", background: "#b5b5f0", zIndex: 1000 }}
      >
        {/* Logo */}
        <div className="p-4 border-bottom border-secondary">
            <div
              className="d-flex align-items-center justify-content-center "
              style={{ width: 100, height: 36 }}
            >
                <img
                             src={Logo}
                             alt="The Indian Commerce"
                             style={{ height: 90, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(26,79,160,0.18))' }}
                           />
                       
            </div>
        
          </div>

        {/* Nav items */}
        <nav className="flex-grow-1 p-3">
          <p className="text-black px-2 mb-2" style={{ fontSize: "0.70rem", letterSpacing: 1 }}>MENU</p>
          {navItems.map((item) => (
            <button
              key={item.key}
              className="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 mb-1"
              style={{
                borderRadius: 8,
                fontSize: "0.88rem",
                border: "none",
                background: activePage === item.key ? "#FF7A00" : "transparent",
                color:      activePage === item.key ? "#000"    : "white",
                fontWeight: activePage === item.key ? "700"     : "400",
              }}
              onClick={() => onNavigate(item.key)}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.key === "bookings" && unreadCount > 0 && (
                <span className="badge bg-danger ms-auto" style={{ fontSize: "0.6rem" }}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-top border-secondary">
          <button className="btn btn-outline-danger w-100 btn-sm" onClick={onLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div className="flex-grow-1" style={{ marginLeft: 240, background: "#f8f9fa", minHeight: "100vh" }}>

        {/* Top bar */}
        <div
          className="bg-white border-bottom d-flex align-items-center justify-content-between px-4 py-2 position-sticky top-0"
          style={{ zIndex: 900 }}
        >
          <h6 className="fw-bold mb-0 text-dark">
            {navItems.find((n) => n.key === activePage)?.label || "Dashboard"}
          </h6>

          {/* Bell */}
          <div className="position-relative" ref={notifRef}>
            <button
              className="btn btn-light border d-flex align-items-center justify-content-center position-relative"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
              onClick={handleBell}
              title="Order Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  className="position-absolute badge bg-danger rounded-pill"
                  style={{
                    top: -4, right: -4, fontSize: "0.6rem",
                    minWidth: 18, height: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div
                className="position-absolute bg-white shadow-lg rounded-3 border"
                style={{ right: 0, top: "110%", width: 360, maxHeight: 460, overflowY: "auto", zIndex: 1050 }}
              >
                <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-light">
                  <div>
                    <h6 className="fw-bold mb-0">Order Notifications</h6>
                    <small className="text-muted">Last 24 hours ({notifications.length})</small>
                  </div>
                  <button className="btn btn-sm btn-light" onClick={() => setShowNotifications(false)}>
                    <X size={15} />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <Bell size={32} className="mb-2" />
                    <p className="small mb-0">No new orders in last 24h</p>
                  </div>
                ) : (
                  <>
                    {notifications.map((n) => (
                      <div
                        key={n._id}
                        className="p-3 border-bottom"
                        style={{ cursor: "pointer" }}
                        onClick={() => { onNavigate("bookings"); setShowNotifications(false); }}
                      >
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold text-warning" style={{ fontSize: "0.8rem" }}>
                            🛍️ #{n.orderNumber}
                          </span>
                          <small className="text-muted" style={{ fontSize: "0.65rem" }}>
                            {new Date(n.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </small>
                        </div>
                        <p className="mb-1 small fw-semibold">{n.userName || n.shippingAddress?.fullName || "Customer"}</p>
                        <div className="d-flex gap-1 flex-wrap">
                          <span className="fw-bold small">₹{Number(n.total).toFixed(2)}</span>
                          <span className={`badge ${statusBadge(n.orderStatus)} text-white`} style={{ fontSize: "0.6rem" }}>{n.orderStatus}</span>
                          <span className={`badge ${n.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`} style={{ fontSize: "0.6rem" }}>{n.paymentStatus}</span>
                          <span className="badge bg-light text-dark border text-uppercase" style={{ fontSize: "0.6rem" }}>{n.paymentMethod}</span>
                        </div>
                      </div>
                    ))}
                    <div
                      className="text-center p-3 text-warning fw-semibold small"
                      style={{ cursor: "pointer" }}
                      onClick={() => { onNavigate("bookings"); setShowNotifications(false); }}
                    >
                      View All Orders →
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="p-4">{children}</div>
      </div>

      <style>{`
        nav button:hover { background: rgba(255,255,255,0.08) !important; color: white !important; }
      `}</style>
    </div>
  );
};

export default AdminLayout;