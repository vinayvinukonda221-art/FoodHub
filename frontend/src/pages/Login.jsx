import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sparkles, AlertCircle, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const user = await login(email.trim(), password);
      setSubmitting(false);
      if (user.role === 'admin' && redirectPath === '/') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      setSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg('');
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand-icon">
              <Sparkles size={24} color="#FFFFFF" />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-sub">Sign in to your FoodieHub account to order delicious meals</p>
          </div>

          {errorMsg && (
            <div className="auth-error-banner">
              <AlertCircle size={18} color="#EF4444" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Login Preset Buttons */}
          <div className="demo-credentials-box">
            <span className="demo-label">⚡ Fast Demo Logins (Click to autofill):</span>
            <div className="demo-buttons-grid">
              <button
                type="button"
                className="demo-btn customer-btn"
                onClick={() => handleQuickLogin('customer@foodiehub.com', 'customer123')}
              >
                <UserCheck size={14} />
                <span>Customer Login</span>
              </button>
              <button
                type="button"
                className="demo-btn admin-btn"
                onClick={() => handleQuickLogin('admin@foodiehub.com', 'admin123')}
              >
                <ShieldCheck size={14} />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="spin" style={{ width: '18px', height: '18px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%' }} />
                  <span>Signing In...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account yet?{' '}
              <Link to="/register" className="auth-link">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          padding: 60px 0 100px;
          min-height: calc(100vh - 200px);
          display: flex;
          align-items: center;
        }
        .auth-card {
          background: #FFFFFF;
          max-width: 480px;
          margin: 0 auto;
          border-radius: 28px;
          padding: 44px 36px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
          border: 1px solid #F3F4F6;
        }
        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-brand-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #FF6B35 0%, #FF8F54 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 6px 18px rgba(255, 107, 53, 0.3);
        }
        .auth-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #222222;
          margin-bottom: 6px;
        }
        .auth-sub {
          color: #6B7280;
          font-size: 0.92rem;
          line-height: 1.5;
        }
        .auth-error-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          padding: 12px 16px;
          border-radius: 12px;
          color: #991B1B;
          font-size: 0.88rem;
          margin-bottom: 20px;
        }
        .demo-credentials-box {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 24px;
        }
        .demo-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #4B5563;
          margin-bottom: 10px;
        }
        .demo-buttons-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .demo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          transition: all 0.2s;
        }
        .customer-btn {
          background: #FFF2EC;
          color: #FF6B35;
          border: 1px solid #FFD4C2;
        }
        .customer-btn:hover {
          background: #FF6B35;
          color: #FFFFFF;
        }
        .admin-btn {
          background: #EFF6FF;
          color: #2563EB;
          border: 1px solid #BFDBFE;
        }
        .admin-btn:hover {
          background: #2563EB;
          color: #FFFFFF;
        }
        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
        }
        .input-with-icon .form-control {
          padding-left: 42px;
        }
        .auth-submit-btn {
          width: 100%;
          margin-top: 10px;
        }
        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 0.9rem;
          color: #6B7280;
        }
        .auth-link {
          color: #FF6B35;
          font-weight: 700;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;

