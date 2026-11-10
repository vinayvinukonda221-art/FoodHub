import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const Checkout = () => {
  const { cartItems, subtotal, deliveryFee, discount, promoCode, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [simulatedCard, setSimulatedCard] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardHolder: '',
    expiry: '12/28',
    cvv: '•••'
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Pre-fill user information if authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || 'Bangalore',
        state: user.address?.state || 'Karnataka',
        pincode: user.address?.pincode || '560034'
      }));
      setSimulatedCard((prev) => ({
        ...prev,
        cardHolder: user.name || 'Foodie Customer'
      }));
    }
  }, [user]);

  // If cart is empty and no order was just placed, redirect to /cart
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, orderSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    // Validation
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.pincode.trim()) {
      setErrorMessage('Please provide your full name, phone number, complete street address, and pincode.');
      window.scrollTo(0, 0);
      return;
    }

    try {
      setSubmitting(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          foodId: item._id,
          quantity: item.quantity
        })),
        deliveryAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          street: formData.street.trim(),
          city: formData.city.trim() || 'Bangalore',
          state: formData.state.trim() || 'Karnataka',
          pincode: formData.pincode.trim()
        },
        paymentMethod,
        promoCode,
        notes: formData.notes
      };

      const createdOrder = await orderService.create(orderPayload);
      clearCart();
      setOrderSuccess(createdOrder);
      setSubmitting(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      setErrorMessage(msg);
      setSubmitting(false);
      window.scrollTo(0, 0);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container success-container">
        <div className="success-card">
          <div className="success-icon-box">
            <CheckCircle2 size={54} color="#10B981" />
          </div>
          <h1 className="success-title">Order Placed Successfully!</h1>
          <p className="success-sub">
            Thank you for ordering with FoodieHub! Your order <strong>#{orderSuccess._id.slice(-6).toUpperCase()}</strong> has been sent to our kitchen and is being freshly prepared.
          </p>

          <div className="success-summary-box">
            <div className="summary-line">
              <span>Estimated Delivery:</span>
              <strong>30 - 35 mins</strong>
            </div>
            <div className="summary-line">
              <span>Payment Mode:</span>
              <strong>{orderSuccess.paymentMethod}</strong>
            </div>
            <div className="summary-line">
              <span>Total Paid / Payable:</span>
              <strong className="text-primary font-bold">₹{orderSuccess.totalAmount}</strong>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/orders" className="btn btn-primary btn-lg">
              <span>Track Your Order</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/menu" className="btn btn-secondary btn-lg">
              Explore More Dishes
            </Link>
          </div>
        </div>

        <style>{`
          .success-container {
            padding: 80px 20px;
          }
          .success-card {
            background: #FFFFFF;
            max-width: 580px;
            margin: 0 auto;
            border-radius: 28px;
            padding: 48px 36px;
            text-align: center;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
            border: 1px solid #F3F4F6;
          }
          .success-icon-box {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: #ECFDF5;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          .success-title {
            font-size: 2rem;
            font-weight: 800;
            color: #222222;
            margin-bottom: 12px;
          }
          .success-sub {
            color: #4B5563;
            font-size: 0.96rem;
            line-height: 1.6;
            margin-bottom: 28px;
          }
          .success-summary-box {
            background: #F9FAFB;
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 32px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            text-align: left;
          }
          .summary-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.92rem;
            color: #374151;
          }
          .success-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1 className="checkout-title">Finalize Your Order</h1>
          <p className="checkout-sub">Enter delivery details and select your preferred payment mode</p>
        </div>

        {!isAuthenticated && (
          <div className="guest-login-notice">
            <Info size={20} color="#FF6B35" />
            <div>
              <strong>Quick Sign-In Required:</strong> Please login or create a free account to place your order and track live delivery.
            </div>
            <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="btn btn-primary btn-sm">
              Sign In Now
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="checkout-error-banner">
            <AlertCircle size={20} color="#EF4444" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          {/* Left Column: Delivery & Payment Details */}
          <div className="checkout-left-col">
            {/* Delivery Address Card */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div className="card-header-icon">
                  <MapPin size={20} color="#FF6B35" />
                </div>
                <h3>Delivery Address</h3>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address & Landmark *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Flat/House No., Building Name, Street, Landmark"
                  className="form-control"
                  required
                />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode / ZIP *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 560034"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Instructions / Cooking Note (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g. Ring the bell twice, keep it spicy, contactless drop..."
                  className="form-control"
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div className="card-header-icon">
                  <CreditCard size={20} color="#FF6B35" />
                </div>
                <h3>Payment Method</h3>
              </div>

              <div className="payment-options-grid">
                {/* Option 1: Cash on Delivery */}
                <label className={`payment-option-tile ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-tile-body">
                    <div className="payment-tile-icon">
                      <Banknote size={24} color="#10B981" />
                    </div>
                    <div>
                      <span className="payment-tile-title">Cash on Delivery (COD)</span>
                      <span className="payment-tile-desc">Pay cash or UPI upon delivery at your doorstep</span>
                    </div>
                  </div>
                </label>

                {/* Option 2: Simulated Online Payment */}
                <label className={`payment-option-tile ${paymentMethod === 'Simulated Online Payment' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Simulated Online Payment"
                    checked={paymentMethod === 'Simulated Online Payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-tile-body">
                    <div className="payment-tile-icon">
                      <CreditCard size={24} color="#FF6B35" />
                    </div>
                    <div>
                      <span className="payment-tile-title">Simulated Online Payment</span>
                      <span className="payment-tile-desc">Instant sandbox simulator (No real money deducted)</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Simulated Card Preview Box */}
              {paymentMethod === 'Simulated Online Payment' && (
                <div className="simulated-payment-box">
                  <div className="simulated-badge">
                    <ShieldCheck size={16} color="#10B981" />
                    <span>Demo Online Payment Gateway (Pre-Authorized)</span>
                  </div>
                  <div className="simulated-card-ui">
                    <div className="card-chip" />
                    <div className="card-number-display">{simulatedCard.cardNumber}</div>
                    <div className="card-meta-row">
                      <div>
                        <span className="card-sub-label">CARD HOLDER</span>
                        <span className="card-sub-val">{simulatedCard.cardHolder || 'DEMO CUSTOMER'}</span>
                      </div>
                      <div>
                        <span className="card-sub-label">EXPIRES</span>
                        <span className="card-sub-val">{simulatedCard.expiry}</span>
                      </div>
                    </div>
                  </div>
                  <p className="simulated-disclaimer">
                    ℹ️ <strong>Note:</strong> This is a secure academic simulator. No actual bank or credit card information is collected or processed.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Review */}
          <div className="checkout-right-col">
            <div className="checkout-card order-review-card">
              <h3 className="review-title">Order Review</h3>

              <div className="review-items-list">
                {cartItems.map((item) => (
                  <div key={item._id} className="review-item-row">
                    <div className="review-item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="review-item-details">
                      <h5 className="review-item-name">{item.name}</h5>
                      <span className="review-item-qty">
                        Qty: {item.quantity} × ₹{item.price}
                      </span>
                    </div>
                    <span className="review-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="checkout-bill-breakdown">
                <div className="checkout-bill-line">
                  <span>Subtotal</span>
                  <strong>₹{subtotal}</strong>
                </div>
                <div className="checkout-bill-line">
                  <span>Delivery Fee</span>
                  <strong>{deliveryFee === 0 ? <span className="free-badge">FREE</span> : `₹${deliveryFee}`}</strong>
                </div>
                {discount > 0 && (
                  <div className="checkout-bill-line">
                    <span>Discount ({promoCode})</span>
                    <strong className="text-success">-₹{discount}</strong>
                  </div>
                )}
                <div className="checkout-bill-line checkout-grand-total">
                  <span>Total Amount</span>
                  <span className="checkout-total-number">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg place-order-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="spin" style={{ width: '18px', height: '18px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%' }} />
                    <span>Processing Order...</span>
                  </div>
                ) : (
                  <span>Place Order • ₹{totalAmount}</span>
                )}
              </button>

              <div className="checkout-security-tag">
                <ShieldCheck size={16} color="#10B981" />
                <span>100% Genuine Ingredients & Fast Kitchen Dispatch</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .checkout-page {
          padding: 40px 0 80px;
        }
        .checkout-header {
          margin-bottom: 28px;
        }
        .checkout-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #222222;
        }
        .checkout-sub {
          color: #6B7280;
          font-size: 0.95rem;
        }
        .guest-login-notice {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFF2EC;
          border: 1.5px solid #FFD4C2;
          padding: 16px 20px;
          border-radius: 16px;
          margin-bottom: 24px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .checkout-error-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          padding: 14px 20px;
          border-radius: 14px;
          color: #991B1B;
          margin-bottom: 24px;
          font-size: 0.92rem;
          font-weight: 600;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 36px;
          align-items: start;
        }
        .checkout-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #F3F4F6;
          margin-bottom: 24px;
        }
        .checkout-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F3F4F6;
        }
        .card-header-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #FFF2EC;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .checkout-card-header h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #222222;
        }
        .payment-options-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }
        .payment-option-tile {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border: 2px solid #E5E7EB;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .payment-option-tile input {
          accent-color: #FF6B35;
          width: 18px;
          height: 18px;
        }
        .payment-option-tile:hover {
          border-color: #FF6B35;
          background: #FFF9F6;
        }
        .payment-option-tile.selected {
          border-color: #FF6B35;
          background: #FFF5F0;
        }
        .payment-tile-body {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .payment-tile-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .payment-tile-title {
          display: block;
          font-size: 0.98rem;
          font-weight: 700;
          color: #222222;
        }
        .payment-tile-desc {
          display: block;
          font-size: 0.8rem;
          color: #6B7280;
        }
        .simulated-payment-box {
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 18px;
          padding: 20px;
          margin-top: 16px;
        }
        .simulated-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ECFDF5;
          color: #065F46;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .simulated-card-ui {
          background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
          color: #FFFFFF;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          margin-bottom: 14px;
        }
        .card-chip {
          width: 40px;
          height: 28px;
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          border-radius: 6px;
          margin-bottom: 20px;
        }
        .card-number-display {
          font-family: monospace;
          font-size: 1.3rem;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }
        .card-meta-row {
          display: flex;
          justify-content: space-between;
        }
        .card-sub-label {
          display: block;
          font-size: 0.65rem;
          color: #9CA3AF;
          letter-spacing: 0.5px;
        }
        .card-sub-val {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .simulated-disclaimer {
          font-size: 0.78rem;
          color: #6B7280;
          line-height: 1.4;
        }
        .order-review-card {
          position: sticky;
          top: 96px;
        }
        .review-title {
          font-size: 1.25rem;
          font-weight: 800;
          padding-bottom: 16px;
          border-bottom: 1px solid #F3F4F6;
          margin-bottom: 20px;
        }
        .review-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-height: 280px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding-right: 4px;
        }
        .review-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .review-item-img {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          overflow: hidden;
          background: #F3F4F6;
          flex-shrink: 0;
        }
        .review-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .review-item-details {
          flex: 1;
        }
        .review-item-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #222222;
          margin-bottom: 2px;
          line-height: 1.3;
        }
        .review-item-qty {
          font-size: 0.8rem;
          color: #6B7280;
        }
        .review-item-price {
          font-size: 0.95rem;
          font-weight: 800;
          color: #222222;
        }
        .checkout-bill-breakdown {
          border-top: 1px dashed #E5E7EB;
          padding-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .checkout-bill-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.92rem;
          color: #4B5563;
        }
        .checkout-grand-total {
          border-top: 1px solid #E5E7EB;
          padding-top: 14px;
          font-size: 1.1rem;
          font-weight: 800;
          color: #222222;
        }
        .checkout-total-number {
          font-size: 1.6rem;
          color: #FF6B35;
        }
        .place-order-btn {
          width: 100%;
          margin-bottom: 16px;
        }
        .checkout-security-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #6B7280;
        }
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;

