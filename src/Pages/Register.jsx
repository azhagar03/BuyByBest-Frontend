import { useState } from "react";
import api from "../Services/Api";
import { useToast } from "../Context/ToastContext";
import Logo from "../assets/Logo.png";

const Register = ({ onNavigate, onLogin }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #c9d8f0',
    fontSize: 14,
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#1a4fa0',
    marginBottom: 6,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.register({
        username: form.username,
        email: form.email,
        password: form.password
      });
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
        showToast("Registration successful!", "success");
        onNavigate("home");
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch (error) {
      showToast(error.message || "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f0fb 0%, #f0f7f1 50%, #fff5ec 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src={Logo}
            alt="The Indian Commerce"
            style={{ height: 85, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(26,79,160,0.18))' }}
          />
          <p style={{ color: '#1a4fa0', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', marginTop: 6, textTransform: 'uppercase' }}>
            Connect • Grow • Succeed
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 8px 40px rgba(26,79,160,0.12)', border: '1px solid rgba(26,79,160,0.08)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0d2b5e', marginBottom: 6 }}>Create account</h2>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Join The Indian Commerce today.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Your name</label>
              <input
                type="text"
                placeholder="First and last name"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required disabled={isLoading}
                style={inputStyle}
                onFocus={e => e.target.style.border = '1.5px solid #1a4fa0'}
                onBlur={e => e.target.style.border = '1.5px solid #c9d8f0'}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Mobile number</label>
              <input
                type="tel"
                placeholder="Mobile number"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                required disabled={isLoading}
                style={inputStyle}
                onFocus={e => e.target.style.border = '1.5px solid #1a4fa0'}
                onBlur={e => e.target.style.border = '1.5px solid #c9d8f0'}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required disabled={isLoading}
                style={inputStyle}
                onFocus={e => e.target.style.border = '1.5px solid #1a4fa0'}
                onBlur={e => e.target.style.border = '1.5px solid #c9d8f0'}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required disabled={isLoading}
                style={inputStyle}
                onFocus={e => e.target.style.border = '1.5px solid #1a4fa0'}
                onBlur={e => e.target.style.border = '1.5px solid #c9d8f0'}
              />
              <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, display: 'block' }}>Passwords must be at least 6 characters.</span>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Re-enter password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required disabled={isLoading}
                style={inputStyle}
                onFocus={e => e.target.style.border = '1.5px solid #1a4fa0'}
                onBlur={e => e.target.style.border = '1.5px solid #c9d8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #2d8c3c, #236b30)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(45,140,60,0.3)', transition: 'transform 0.1s' }}
              onMouseDown={e => { if (!isLoading) e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLoading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 20 }}>
          Already have an account?{" "}
          <button
            onClick={() => onNavigate("login")}
            style={{ background: 'none', border: 'none', color: '#FF7A00', fontWeight: 700, cursor: 'pointer', fontSize: 13, padding: 0 }}
          >
            Sign in
          </button>
        </p>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
          © 2026, The Indian Commerce, Inc. or its affiliates
        </p>
      </div>
    </div>
  );
};

export default Register;