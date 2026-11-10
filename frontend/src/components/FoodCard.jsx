import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Star, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food._id);

  return (
    <div className={`food-card ${!food.available ? 'food-card-unavailable' : ''}`}>
      {/* Food Image Container */}
      <div className="food-image-wrapper">
        <Link to={`/food/${food._id}`}>
          <img
            src={food.image}
            alt={food.name}
            className="food-image"
            loading="lazy"
            decoding="async"
          />
        </Link>

        {/* Dietary tag (Veg / Non-Veg) */}
        <div className="dietary-badge-wrapper">
          <span className={food.isVeg ? 'veg-tag' : 'non-veg-tag'} title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'} />
        </div>

        {/* Category Pill */}
        <span className="card-category-pill">{food.category}</span>

        {/* Unavailable overlay if out of stock */}
        {!food.available && (
          <div className="unavailable-overlay">
            <span>Sold Out</span>
          </div>
        )}
      </div>

      {/* Food Card Content */}
      <div className="food-card-body">
        {/* Rating & Prep Time */}
        <div className="food-card-meta">
          <div className="food-rating-pill">
            <Star size={13} fill="#F59E0B" stroke="#F59E0B" />
            <span>{food.rating ? food.rating.toFixed(1) : '4.5'}</span>
            <span className="rating-count">({food.ratingCount || 100}+)</span>
          </div>
          {food.preparationTime && (
            <div className="food-prep-time">
              <Clock size={13} />
              <span>{food.preparationTime}</span>
            </div>
          )}
        </div>

        {/* Food Title */}
        <Link to={`/food/${food._id}`} className="food-card-title-link">
          <h3 className="food-card-title">{food.name}</h3>
        </Link>

        {/* Food Description */}
        <p className="food-card-desc">
          {food.description}
        </p>

        {/* Bottom Price & Add Action */}
        <div className="food-card-footer">
          <div className="food-price-box">
            <span className="currency-symbol">₹</span>
            <span className="price-amount">{food.price}</span>
          </div>

          <div className="food-action-box">
            {!food.available ? (
              <span className="sold-out-text">Unavailable</span>
            ) : quantity === 0 ? (
              <button
                type="button"
                className="btn-add-cart"
                onClick={() => addToCart(food, 1)}
                aria-label={`Add ${food.name} to cart`}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            ) : (
              <div className="cart-qty-pill">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateQuantity(food._id, quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateQuantity(food._id, quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .food-card {
          background: #FFFFFF;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .food-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(255, 107, 53, 0.12);
          border-color: rgba(255, 107, 53, 0.2);
        }
        .food-card-unavailable {
          opacity: 0.75;
        }
        .food-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #F3F4F6;
        }
        .food-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .food-card:hover .food-image {
          transform: scale(1.06);
        }
        .dietary-badge-wrapper {
          position: absolute;
          top: 14px;
          left: 14px;
          background: #FFFFFF;
          padding: 4px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          display: flex;
        }
        .card-category-pill {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #374151;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .unavailable-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.5px;
        }
        .food-card-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .food-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.82rem;
        }
        .food-rating-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 700;
          color: #1F2937;
        }
        .rating-count {
          font-size: 0.75rem;
          color: #9CA3AF;
          font-weight: 500;
        }
        .food-prep-time {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6B7280;
        }
        .food-card-title-link {
          text-decoration: none;
        }
        .food-card-title {
          font-size: 1.12rem;
          font-weight: 700;
          color: #222222;
          margin-bottom: 8px;
          line-height: 1.35;
          transition: color 0.2s;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .food-card:hover .food-card-title {
          color: #FF6B35;
        }
        .food-card-desc {
          font-size: 0.86rem;
          color: #6B7280;
          line-height: 1.5;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .food-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px dashed #F3F4F6;
        }
        .food-price-box {
          display: flex;
          align-items: baseline;
          color: #222222;
        }
        .currency-symbol {
          font-size: 0.95rem;
          font-weight: 700;
          color: #FF6B35;
          margin-right: 2px;
        }
        .price-amount {
          font-size: 1.35rem;
          font-weight: 800;
        }
        .btn-add-cart {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          background: #FFF2EC;
          color: #FF6B35;
          border: 1.5px solid #FFD4C2;
          border-radius: 9999px;
          font-size: 0.88rem;
          font-weight: 700;
          transition: all 0.2s;
        }
        .btn-add-cart:hover {
          background: #FF6B35;
          color: #FFFFFF;
          border-color: #FF6B35;
          transform: scale(1.04);
        }
        .cart-qty-pill {
          display: flex;
          align-items: center;
          background: #FF6B35;
          color: #FFFFFF;
          border-radius: 9999px;
          padding: 4px;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }
        .qty-btn {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transition: background 0.15s;
        }
        .qty-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        .qty-value {
          font-size: 0.88rem;
          font-weight: 800;
          min-width: 16px;
          text-align: center;
        }
        .sold-out-text {
          font-size: 0.82rem;
          font-weight: 600;
          color: #EF4444;
          background: #FEF2F2;
          padding: 6px 12px;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};

export default FoodCard;

