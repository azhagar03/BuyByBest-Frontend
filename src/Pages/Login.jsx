import { useState } from "react";
import api from "../Services/Api";
import { useToast } from "../Context/ToastContext";

const Login = ({ onNavigate, onLogin }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await api.login(form);
      if (data.token && data.user) {
        // Store token and user in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        // Call the onLogin prop to update App state
        onLogin(data.user);
                onNavigate("home");
      } else {
        showToast(data.message || "Login failed", "error");
      }
    } catch (error) {
      showToast(error.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white px-3 py-5">
      <div className="w-100" style={{ maxWidth: "350px" }}>
        {/* Logo */}
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

        {/* Login Card */}
        <div className="border rounded p-4" style={{ borderColor: '#ddd' }}>
          <h1 className="fs-4 fw-normal mb-3">Sign in</h1>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-3">
              <label className="form-label fw-bold small">
                Email or mobile phone number
              </label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={isLoading}
                style={{
                  borderColor: '#a6a6a6',
                  borderRadius: '3px',
                  padding: '8px 10px',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-bold small mb-0">
                  Password
                </label>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none small"
                  style={{ fontSize: '12px', color: '#007185' }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={isLoading}
                style={{
                  borderColor: '#a6a6a6',
                  borderRadius: '3px',
                  padding: '8px 10px',
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100 mb-3"
              disabled={isLoading}
              style={{
                backgroundColor: '#FFD814',
                borderColor: '#FCD200',
                color: '#0F1111',
                padding: '8px',
                fontSize: '13px',
                fontWeight: '400',
                borderRadius: '8px',
                boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)'
              }}
            >
              {isLoading ? "Signing in..." : "Continue"}
            </button>

            {/* Terms Text */}
            {/* <p className="text-muted small mb-0" style={{ fontSize: '11px', lineHeight: '1.4' }}>
              By continuing, you agree to BuyByBest's{" "}
              <a href="#" className="text-decoration-none" style={{ color: '#007185' }}>
                Conditions of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-decoration-none" style={{ color: '#007185' }}>
                Privacy Notice
              </a>
              .
            </p> */}
          </form>
        </div>

        {/* New to BuyByBest */}
        <div className="position-relative text-center my-4">
          <div 
            className="position-absolute w-100 top-50 start-0" 
            style={{ 
              height: '1px', 
              background: 'linear-gradient(to right, white, #e7e7e7, white)',
              zIndex: 0
            }}
          />
          <span 
            className="position-relative bg-white px-2 text-muted small"
            style={{ fontSize: '12px', zIndex: 1 }}
          >
            New to BuyByBest?
          </span>
        </div>

        {/* Create Account Button */}
        <button
          onClick={() => onNavigate("register")}
          className="btn w-100"
          style={{
            backgroundColor: '#f0f2f2',
            borderColor: '#adb1b8 #a2a6ac #8d9096',
            color: '#0F1111',
            padding: '8px',
            fontSize: '13px',
            fontWeight: '400',
            borderRadius: '8px',
            boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)'
          }}
        >
          Create your BuyByBest account
        </button>

        {/* Footer Links */}
        <div className="text-center mt-4">
          {/* <div className="d-flex justify-content-center gap-3 mb-2">
            <a href="#" className="text-decoration-none small" style={{ color: '#007185', fontSize: '11px' }}>
              Conditions of Use
            </a>
            <a href="#" className="text-decoration-none small" style={{ color: '#007185', fontSize: '11px' }}>
              Privacy Notice
            </a>
            <a href="#" className="text-decoration-none small" style={{ color: '#007185', fontSize: '11px' }}>
              Help
            </a>
          </div> */}
          <p className="text-muted small mb-0" style={{ fontSize: '11px' }}>
            © 2026, BuyByBest.in, Inc. or its affiliates
          </p>
        </div>
      </div>

      <style>{`
        .form-control:focus {
          border-color: #e77600 !important;
          box-shadow: 0 0 0 3px rgba(228, 121, 17, 0.5), 0 1px 2px rgba(15, 17, 17, 0.15) inset !important;
        }
      `}</style>
    </div>
  );
};

export default Login;