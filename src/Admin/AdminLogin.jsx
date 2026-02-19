import React, { useState } from "react";
import api from "../Services/Api";
import { toast } from "react-toastify";

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
       
   <div className="text-center mb-4">
          <h1 className="fw-normal" style={{ 
            fontFamily: 'Arial, sans-serif',
            fontSize: '2rem',
            letterSpacing: '-0.5px'
          }}>
            <span style={{ color: '#000' }}>BuyByBest</span>
            <span style={{ color: '#FF9900' }}>.in</span>
          </h1>
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
            className="btn btn-dark w-100" 
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