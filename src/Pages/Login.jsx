import { useState } from "react";
import api from "../Services/Api";
import { useToast } from "../Context/ToastContext";
import Logo from "../assets/Logo.png";

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e8f0fb 0%, #f0f7f1 50%, #fff5ec 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* Logo */}
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

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 8px 40px rgba(26,79,160,0.12)', border: '1px solid rgba(26,79,160,0.08)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0d2b5e', marginBottom: 6 }}>Sign in</h2>
          <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a4fa0', marginBottom: 6 }}>
                Email or mobile phone number
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={isLoading}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #c9d8f0', fontSize: 14, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1.5px solid #1a4fa0'}
                onBlur={e => e.target.style.border = '1.5px solid #c9d8f0'}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1a4fa0' }}>Password</label>
                <button type="button" style={{ background: 'none', border: 'none', color: '#FF7A00', fontSize: 12, cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={isLoading}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #c9d8f0', fontSize: 14, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.border = '1.5px solid #1a4fa0'}
                onBlur={e => e.target.style.border = '1.5px solid #c9d8f0'}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', padding: '11px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #FF7A00, #e06500)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, boxShadow: '0 4px 14px rgba(255,122,0,0.35)', transition: 'transform 0.1s' }}
              onMouseDown={e => { if (!isLoading) e.currentTarget.style.transform = 'scale(0.98)'; }}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLoading ? "Signing in..." : "Continue →"}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(26,79,160,0.15)' }} />
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>New to The Indian Commerce?</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(26,79,160,0.15)' }} />
        </div>

        {/* Create Account */}
        <button
          onClick={() => onNavigate("register")}
          style={{ width: '100%', padding: '11px', borderRadius: 8, border: '2px solid #1a4fa0', background: 'transparent', color: '#1a4fa0', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.01em' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1a4fa0'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a4fa0'; }}
        >
          Create your account
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#9ca3af', marginTop: 24 }}>
          © 2026, The Indian Commerce, Inc. or its affiliates
        </p>
      </div>
    </div>
  );
};

export default Login;