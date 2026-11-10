import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: 'Bangalore',
    pincode: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setErrorMsg('Name, email, and password are required.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: 'Karnataka',
          pincode: formData.pincode.trim()
        }
      });
      setSubmitting(false);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <div className="auth-brand-icon">
              <Sparkles size={24} color="#FFFFFF" />
            </div>
            <h1 className="auth-title">Create an Account</h1>
            <p className="auth-sub">Join FoodieHub for delicious food delivered in 30 minutes</p>
          </div>

          {errorMsg && (
            <div className="auth-error-banner">
              <AlertCircle size={18} color="#EF4444" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  placeholder="e.g. 560034"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Street Address & Area</label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input
                  type="text"
                  name="street"
                  className="form-control"
                  placeholder="Flat/House, Building, Area"
                  value={formData.street}
                  onChange={handleChange}
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span>Register & Explore Menu</span>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already registered?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
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
        .register-card {
          max-width: 620px !important;
        }
        .auth-card {
          background: #FFFFFF;
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

export default Register;

