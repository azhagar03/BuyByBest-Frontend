import React, { useState } from "react";
import api from "../Services/Api";
import { toast } from "react-toastify";
import Logo from "../assets/Logo.png";

const AdminLogin = ({ onAdminLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const data = await api.adminLogin({ email, password });

    if (data.success && data.token) {
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));
      onAdminLogin();
    } else {
      setError(data.message || "Login failed");
    }
  } catch (err) {
    setError("Server error. Please try again.",err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-white px-3 py-5">
      <div className="card p-4" style={{ width: "350px" }}>
       
       <div style={{ textAlign: 'center', marginBottom: 28 }}>
               <img
                 src={Logo}
                 alt="The Indian Commerce"
                 style={{ height: 90, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(26,79,160,0.18))' }}
               />
               <p style={{ color: '#1a4fa0', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', marginTop: 6, textTransform: 'uppercase' }}>
                 Connect • Grow • Succeed
               </p>
             </div>
       
         <h3 className="mb-3 text-center fs-5">Admin Login</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button 
            className="btn btn-success w-100" 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;