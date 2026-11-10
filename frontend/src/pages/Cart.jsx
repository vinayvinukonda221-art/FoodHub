import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    totalAmount
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    const result = applyPromoCode(inputCoupon);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container empty-cart-container">
        <div className="empty-cart-card">
          <div className="empty-cart-icon-circle">
            <ShoppingBag size={48} color="#FF6B35" />
          </div>
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-subtext">
            Looks like you haven't added any dishes to your cart yet. Explore our delicious chef-crafted menu and find your next favorite meal!
          </p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            <span>Browse Delicious Menu</span>
            <ArrowRight size={18} />
          </Link>
        </div>
        <style>{`
          .empty-cart-container {
            padding: 80px 20px;
          }
          .empty-cart-card {
            background: #FFFFFF;
            max-width: 540px;
            margin: 0 auto;
            border-radius: 28px;
            padding: 50px 36px;
            text-align: center;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
            border: 1px solid #F3F4F6;
          }
          .empty-cart-icon-circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: #FFF2EC;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }
          .empty-cart-title {
            font-size: 1.8rem;
            font-weight: 800;
            color: #222222;
            margin-bottom: 12px;
          }
          .empty-cart-subtext {
            color: #6B7280;
            font-size: 0.98rem;
            line-height: 1.6;
            margin-bottom: 30px;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-item-count">{cartItems.length} items in your feast</p>
        </div>

        <div className="cart-layout-grid">
          {/* Left Column: Items List */}
          <div className="cart-items-column">
            <div className="cart-items-card">
              <div className="items-card-header">
                <h3>Order Items</h3>
                <button type="button" className="clear-cart-link" onClick={clearCart}>
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="items-list">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item-row">
                    {/* Item thumbnail */}
                    <div className="item-thumbnail-box">
                      <img src={item.image} alt={item.name} />
                      <div className="item-diet-tag">
                        <span className={item.isVeg ? 'veg-tag' : 'non-veg-tag'} />
                      </div>
                    </div>

                    {/* Item info */}
                    <div className="item-info-col">
                      <Link to={`/food/${item._id}`} className="item-name-link">
                        <h4>{item.name}</h4>
                      </Link>
                      <span className="item-unit-price">₹{item.price} each</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="item-qty-controls">
                      <button
                        type="button"
                        className="qty-action-btn"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        type="button"
                        className="qty-action-btn"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="item-subtotal-col">
                      <span className="item-total-price">₹{item.price * item.quantity}</span>
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      className="item-delete-btn"
                      onClick={() => removeFromCart(item._id)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Free delivery prompt banner */}
            <div className="delivery-perk-banner">
              <div className="perk-icon-circle">
                <Truck size={20} color="#FF6B35" />
              </div>
              <div className="perk-text-box">
                {subtotal >= 500 ? (
                  <p className="perk-text text-success font-bold">
                    🎉 You have unlocked <strong>FREE Delivery</strong> on this order!
                  </p>
                ) : (
                  <p className="perk-text">
                    Add <strong>₹{500 - subtotal}</strong> more to your cart to get <strong>FREE Delivery</strong>!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="cart-summary-column">
            {/* Promo Code Card */}
            <div className="summary-card promo-card">
              <div className="promo-card-header">
                <Tag size={18} color="#FF6B35" />
                <h4>Apply Promo Code</h4>
              </div>

              {promoCode ? (
                <div className="applied-coupon-box">
                  <div className="coupon-left">
                    <CheckCircle2 size={18} color="#10B981" />
                    <div>
                      <span className="coupon-code-name">{promoCode}</span>
                      <span className="coupon-desc">30% Flat Discount Applied</span>
                    </div>
                  </div>
                  <button type="button" className="remove-coupon-btn" onClick={removePromoCode}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-input-form">
                  <div className="coupon-input-wrapper">
                    <input
                      type="text"
                      placeholder="Enter code (e.g. FOODIE30)"
                      value={inputCoupon}
                      onChange={(e) => {
                        setInputCoupon(e.target.value);
                        setCouponError('');
                      }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="coupon-error-text">{couponError}</p>}
                  <p className="coupon-hint-text">
                    💡 Tip: Use <strong>FOODIE30</strong> for 30% off up to ₹150!
                  </p>
                </form>
              )}
            </div>

            {/* Bill Details Card */}
            <div className="summary-card bill-card">
              <h3 className="bill-title">Order Bill Details</h3>

              <div className="bill-rows">
                <div className="bill-row">
                  <span>Items Subtotal</span>
                  <span className="bill-val">₹{subtotal}</span>
                </div>

                <div className="bill-row">
                  <span>Delivery Partner Fee</span>
                  <span className="bill-val">
                    {deliveryFee === 0 ? (
                      <span className="free-badge">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="bill-row discount-row">
                    <span>Coupon Discount</span>
                    <span className="bill-val text-success">-₹{discount}</span>
                  </div>
                )}

                <div className="bill-row total-row">
                  <div>
                    <span className="total-label">Grand Total</span>
                    <span className="total-sub">Includes all taxes & packaging</span>
                  </div>
                  <span className="total-amount-val">₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg checkout-cta"
                onClick={() => navigate('/checkout')}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div className="secure-badge">
                <ShieldCheck size={16} color="#10B981" />
                <span>Safe & Secure 256-Bit Encrypted Ordering</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cart-page {
          padding: 40px 0 80px;
        }
        .cart-header {
          margin-bottom: 28px;
        }
        .cart-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #222222;
        }
        .cart-item-count {
          color: #6B7280;
          font-size: 0.95rem;
        }
        .cart-layout-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 36px;
          align-items: start;
        }
        .cart-items-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #F3F4F6;
          margin-bottom: 20px;
        }
        .items-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 18px;
          border-bottom: 1px solid #F3F4F6;
          margin-bottom: 18px;
        }
        .items-card-header h3 {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .clear-cart-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #EF4444;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .cart-item-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px dashed #F3F4F6;
        }
        .cart-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .item-thumbnail-box {
          position: relative;
          width: 76px;
          height: 76px;
          border-radius: 14px;
          overflow: hidden;
          background: #F3F4F6;
          flex-shrink: 0;
        }
        .item-thumbnail-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-diet-tag {
          position: absolute;
          top: 4px;
          left: 4px;
          background: #FFFFFF;
          padding: 2px;
          border-radius: 4px;
          display: flex;
        }
        .item-info-col {
          flex: 1;
        }
        .item-name-link {
          text-decoration: none;
        }
        .item-info-col h4 {
          font-size: 1.02rem;
          font-weight: 700;
          color: #222222;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .item-info-col h4:hover {
          color: #FF6B35;
        }
        .item-unit-price {
          font-size: 0.85rem;
          color: #6B7280;
        }
        .item-qty-controls {
          display: flex;
          align-items: center;
          background: #F3F4F6;
          border-radius: 9999px;
          padding: 4px;
          gap: 6px;
        }
        .qty-action-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #222222;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          transition: all 0.15s;
        }
        .qty-action-btn:hover {
          background: #FF6B35;
          color: #FFFFFF;
        }
        .qty-number {
          font-size: 0.9rem;
          font-weight: 700;
          min-width: 20px;
          text-align: center;
        }
        .item-subtotal-col {
          min-width: 70px;
          text-align: right;
        }
        .item-total-price {
          font-size: 1.1rem;
          font-weight: 800;
          color: #222222;
        }
        .item-delete-btn {
          color: #9CA3AF;
          padding: 6px;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .item-delete-btn:hover {
          color: #EF4444;
          background: #FEF2F2;
        }
        .delivery-perk-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #FFF2EC;
          border: 1px solid #FFD4C2;
          padding: 16px 20px;
          border-radius: 18px;
        }
        .perk-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .perk-text {
          font-size: 0.92rem;
          color: #374151;
        }
        .summary-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #F3F4F6;
          margin-bottom: 24px;
        }
        .promo-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .promo-card-header h4 {
          font-size: 1.05rem;
          font-weight: 700;
        }
        .coupon-input-wrapper {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
        }
        .coupon-input-wrapper input {
          flex: 1;
          padding: 10px 16px;
          border-radius: 12px;
          border: 1.5px solid #E5E7EB;
          font-size: 0.92rem;
          text-transform: uppercase;
          outline: none;
        }
        .coupon-input-wrapper input:focus {
          border-color: #FF6B35;
        }
        .coupon-hint-text {
          font-size: 0.8rem;
          color: #6B7280;
        }
        .coupon-error-text {
          font-size: 0.82rem;
          color: #EF4444;
          margin-bottom: 6px;
        }
        .applied-coupon-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          padding: 12px 16px;
          border-radius: 14px;
        }
        .coupon-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .coupon-code-name {
          display: block;
          font-size: 0.92rem;
          font-weight: 800;
          color: #065F46;
        }
        .coupon-desc {
          display: block;
          font-size: 0.76rem;
          color: #047857;
        }
        .remove-coupon-btn {
          color: #065F46;
        }
        .bill-title {
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F3F4F6;
        }
        .bill-rows {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }
        .bill-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.95rem;
          color: #4B5563;
        }
        .bill-val {
          font-weight: 700;
          color: #222222;
        }
        .free-badge {
          background: #ECFDF5;
          color: #10B981;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 800;
        }
        .total-row {
          padding-top: 18px;
          border-top: 1px dashed #E5E7EB;
          margin-top: 6px;
        }
        .total-label {
          display: block;
          font-size: 1.15rem;
          font-weight: 800;
          color: #222222;
        }
        .total-sub {
          display: block;
          font-size: 0.75rem;
          color: #9CA3AF;
        }
        .total-amount-val {
          font-size: 1.8rem;
          font-weight: 800;
          color: #FF6B35;
        }
        .checkout-cta {
          width: 100%;
          margin-bottom: 18px;
        }
        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #6B7280;
        }
        @media (max-width: 900px) {
          .cart-layout-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;

