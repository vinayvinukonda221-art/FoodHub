import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Minus,
  Star,
  Clock,
  ShieldCheck,
  ChefHat,
  ShoppingBag,
  Sparkles,
  Share2
} from 'lucide-react';
import { foodService } from '../services/api';
import { useCart } from '../context/CartContext';
import RatingStars from '../components/RatingStars';
import FoodCard from '../components/FoodCard';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setQuantity(1);

        const data = await foodService.getById(id);
        setFood(data);

        // Fetch related items from the same category
        if (data.category) {
          const categoryDishes = await foodService.getAll({ category: data.category });
          setRelatedFoods(categoryDishes.filter((item) => item._id !== data._id).slice(0, 3));
        }
      } catch (err) {
        setError('Dish not found or temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (food) {
      addToCart(food, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container details-loading">
        <div className="spin details-spinner" />
        <p>Loading dish details...</p>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="container details-error">
        <h2>Oops! Food Item Not Found</h2>
        <p>{error || "The dish you're looking for doesn't exist or was removed."}</p>
        <Link to="/menu" className="btn btn-primary">
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="food-details-page">
      <div className="container">
        {/* Breadcrumb / Back Link */}
        <div className="details-nav-row">
          <button type="button" className="back-link" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/menu">Menu</Link>
            <span>/</span>
            <Link to={`/menu?category=${encodeURIComponent(food.category)}`}>{food.category}</Link>
            <span>/</span>
            <span className="current-crumb">{food.name}</span>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="details-grid">
          {/* Left: Food Image */}
          <div className="details-image-card">
            <img
              src={food.image}
              alt={food.name}
              className="details-main-img"
            />
            <div className="details-dietary-badge">
              <span className={food.isVeg ? 'veg-tag' : 'non-veg-tag'} />
              <span>{food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
            </div>
            {food.isBestSeller && (
              <span className="bestseller-badge">🔥 Bestseller</span>
            )}
          </div>

          {/* Right: Info & Ordering */}
          <div className="details-info-pane">
            <div className="details-header-meta">
              <span className="category-pill-sm">{food.category}</span>
              <div className="prep-time-badge">
                <Clock size={14} color="#6B7280" />
                <span>{food.preparationTime || '25-30 mins'}</span>
              </div>
            </div>

            <h1 className="details-dish-title">{food.name}</h1>

            {/* Rating */}
            <div className="details-rating-row">
              <RatingStars rating={food.rating || 4.5} count={food.ratingCount || 150} size={18} />
              <span className="rating-tagline">• 100% Chef Verified</span>
            </div>

            {/* Price Box */}
            <div className="details-price-row">
              <span className="price-label">Price:</span>
              <span className="price-currency">₹</span>
              <span className="price-val">{food.price}</span>
              <span className="taxes-note">(Taxes included)</span>
            </div>

            {/* Description */}
            <div className="details-description-box">
              <h3 className="section-subheading">About This Dish</h3>
              <p className="details-desc-text">{food.description}</p>
            </div>

            {/* Perks */}
            <div className="details-perks-row">
              <div className="perk-item">
                <ChefHat size={18} color="#FF6B35" />
                <span>Cooked Fresh on Order</span>
              </div>
              <div className="perk-item">
                <ShieldCheck size={18} color="#FF6B35" />
                <span>Food-Grade Thermal Packaging</span>
              </div>
            </div>

            {/* Order Controls */}
            {food.available ? (
              <div className="details-actions-wrapper">
                <div className="qty-selector-box">
                  <span className="qty-label">Quantity:</span>
                  <div className="qty-counter">
                    <button
                      type="button"
                      className="qty-btn-dec"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      type="button"
                      className="qty-btn-inc"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-lg add-to-cart-cta"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={20} />
                  <span>Add to Cart • ₹{food.price * quantity}</span>
                </button>
              </div>
            ) : (
              <div className="sold-out-alert">
                <h3>Currently Out of Stock</h3>
                <p>Our kitchen is currently prepping more fresh batches. Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Dishes */}
        {relatedFoods.length > 0 && (
          <div className="related-dishes-section">
            <div className="section-header">
              <div>
                <span className="section-subtitle">Pair With Your Feast</span>
                <h2 className="section-title">More in {food.category}</h2>
              </div>
            </div>

            <div className="grid-3">
              {relatedFoods.map((relFood) => (
                <FoodCard key={relFood._id} food={relFood} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .food-details-page {
          padding: 30px 0 80px;
        }
        .details-nav-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: #374151;
          background: #FFFFFF;
          padding: 8px 16px;
          border-radius: 9999px;
          border: 1.5px solid #E5E7EB;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .back-link:hover {
          background: #F3F4F6;
          border-color: #D1D5DB;
        }
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: #9CA3AF;
        }
        .breadcrumbs a {
          color: #6B7280;
        }
        .breadcrumbs a:hover {
          color: #FF6B35;
        }
        .current-crumb {
          color: #222222;
          font-weight: 600;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 50px;
          background: #FFFFFF;
          border-radius: 28px;
          padding: 36px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          border: 1px solid #F3F4F6;
          margin-bottom: 60px;
        }
        .details-image-card {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          background: #F8F9FA;
          height: 440px;
        }
        .details-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .details-dietary-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #FFFFFF;
          padding: 6px 14px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #374151;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }
        .bestseller-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #FF6B35;
          color: #FFFFFF;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.35);
        }
        .details-info-pane {
          display: flex;
          flex-direction: column;
        }
        .details-header-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        .category-pill-sm {
          background: #FFF2EC;
          color: #FF6B35;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .prep-time-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          color: #6B7280;
          font-weight: 600;
        }
        .details-dish-title {
          font-size: 2.3rem;
          font-weight: 800;
          color: #222222;
          line-height: 1.25;
          margin-bottom: 14px;
        }
        .details-rating-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .rating-tagline {
          font-size: 0.82rem;
          color: #10B981;
          font-weight: 600;
        }
        .details-price-row {
          display: flex;
          align-items: baseline;
          padding: 16px 0;
          border-top: 1px dashed #E5E7EB;
          border-bottom: 1px dashed #E5E7EB;
          margin-bottom: 24px;
        }
        .price-label {
          font-size: 0.95rem;
          color: #6B7280;
          margin-right: 12px;
          font-weight: 600;
        }
        .price-currency {
          font-size: 1.4rem;
          font-weight: 800;
          color: #FF6B35;
          margin-right: 2px;
        }
        .price-val {
          font-size: 2.2rem;
          font-weight: 800;
          color: #222222;
        }
        .taxes-note {
          font-size: 0.82rem;
          color: #9CA3AF;
          margin-left: 10px;
        }
        .details-description-box {
          margin-bottom: 24px;
        }
        .section-subheading {
          font-size: 1.05rem;
          font-weight: 700;
          color: #222222;
          margin-bottom: 8px;
        }
        .details-desc-text {
          font-size: 0.96rem;
          color: #4B5563;
          line-height: 1.7;
        }
        .details-perks-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 30px;
          background: #F9FAFB;
          padding: 16px;
          border-radius: 14px;
        }
        .perk-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
        }
        .details-actions-wrapper {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: auto;
          flex-wrap: wrap;
        }
        .qty-selector-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qty-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: #4B5563;
        }
        .qty-counter {
          display: flex;
          align-items: center;
          background: #F3F4F6;
          border-radius: 9999px;
          padding: 4px;
          gap: 8px;
        }
        .qty-btn-dec, .qty-btn-inc {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #222222;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          transition: all 0.2s;
        }
        .qty-btn-dec:hover:not(:disabled), .qty-btn-inc:hover {
          background: #FF6B35;
          color: #FFFFFF;
        }
        .qty-btn-dec:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .qty-display {
          font-size: 1rem;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }
        .add-to-cart-cta {
          flex: 1;
        }
        .sold-out-alert {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          padding: 20px;
          border-radius: 16px;
          color: #991B1B;
        }
        .sold-out-alert h3 {
          color: #991B1B;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .sold-out-alert p {
          font-size: 0.9rem;
          color: #B91C1C;
        }
        .details-loading, .details-error {
          text-align: center;
          padding: 100px 0;
        }
        .details-spinner {
          width: 44px;
          height: 44px;
          border: 3.5px solid #E5E7EB;
          border-top-color: #FF6B35;
          border-radius: 50%;
          margin: 0 auto 16px;
        }
        .related-dishes-section {
          margin-top: 40px;
        }
        @media (max-width: 900px) {
          .details-grid {
            grid-template-columns: 1fr;
            padding: 24px;
          }
          .details-image-card {
            height: 320px;
          }
          .details-dish-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FoodDetails;

