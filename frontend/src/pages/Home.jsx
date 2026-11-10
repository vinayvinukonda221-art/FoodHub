import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Flame,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  ShoppingBag,
  Percent,
  CheckCircle,
  Truck,
  Heart
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { foodService, categoryService } from '../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catsData, featData, bestData] = await Promise.all([
          categoryService.getAll().catch(() => []),
          foodService.getAll({ featured: 'true' }).catch(() => []),
          foodService.getAll({ bestSeller: 'true' }).catch(() => [])
        ]);

        setCategories(catsData);
        setFeaturedFoods(featData.slice(0, 4));
        setBestSellers(bestData.slice(0, 4));
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="home-page-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Express 30-Min Fast Food Delivery</span>
            </div>
            <h1 className="hero-title">
              Delicious Food Delivered to <span className="text-primary">Your Doorstep</span>
            </h1>
            <p className="hero-description">
              Savor authentic royal biryanis, crispy wood-fired pizzas, juicy artisan smash burgers, and traditional Indian thalis cooked with the freshest premium ingredients.
            </p>

            <div className="hero-cta-group">
              <Link to="/menu" className="btn btn-primary btn-lg">
                <span>Explore Menu</span>
                <ArrowRight size={18} />
              </Link>
              <a href="#offers" className="btn btn-secondary btn-lg">
                <Percent size={18} color="#FF6B35" />
                <span>Special Offers</span>
              </a>
            </div>

            {/* Quick Hero Stats */}
            <div className="hero-stats">
              <div className="hero-stat-item">
                <span className="stat-number">30<span className="text-primary">m</span></span>
                <span className="stat-label">Fast Delivery</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-number">10k<span className="text-primary">+</span></span>
                <span className="stat-label">Satisfied Foodies</span>
              </div>
              <div className="stat-divider" />
              <div className="hero-stat-item">
                <span className="stat-number">4.9<span className="text-primary">★</span></span>
                <span className="stat-label">Top Rated Dishes</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Banner */}
          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80"
                alt="Royal Hyderabadi Dum Biryani"
                className="hero-main-img"
              />
              <div className="floating-hero-pill top-pill">
                <div className="pill-icon-circle">
                  <Flame size={18} color="#FF6B35" />
                </div>
                <div>
                  <span className="pill-title">Royal Dum Biryani</span>
                  <span className="pill-sub">Hot & Freshly Cooked</span>
                </div>
              </div>

              <div className="floating-hero-pill bottom-pill">
                <div className="pill-icon-circle green-pill">
                  <Truck size={18} color="#10B981" />
                </div>
                <div>
                  <span className="pill-title">Free Delivery</span>
                  <span className="pill-sub">On orders over ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Food Categories */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Diverse Cravings</span>
              <h2 className="section-title">Popular Categories</h2>
            </div>
            <Link to="/menu" className="view-all-link">
              <span>View All Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category._id || category.name}
                className="category-card"
                onClick={() => navigate(`/menu?category=${encodeURIComponent(category.name)}`)}
              >
                <div className="category-img-box">
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                  />
                </div>
                <h3 className="category-name">{category.name}</h3>
                <span className="category-items-count">
                  {category.itemCount || 3}+ items
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Promotional Offer Section */}
      <section className="section-promo" id="offers">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-content">
              <span className="promo-tag">LIMITED TIME SPECIAL</span>
              <h2 className="promo-heading">Get 30% Flat Discount On Your First Feast!</h2>
              <p className="promo-subtext">
                Use coupon code <span className="coupon-code">FOODIE30</span> at checkout to enjoy up to ₹150 off. Hot, chef-crafted meals delivered right to your doorstep.
              </p>
              <div className="promo-features">
                <div className="promo-feature-item">
                  <CheckCircle size={18} color="#FF6B35" />
                  <span>No minimum order required</span>
                </div>
                <div className="promo-feature-item">
                  <CheckCircle size={18} color="#FF6B35" />
                  <span>Instant coupon verification</span>
                </div>
              </div>
              <Link to="/menu" className="btn btn-primary btn-lg promo-cta">
                Claim Offer & Order Now
              </Link>
            </div>
            <div className="promo-visual">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&auto=format&fit=crop&q=80"
                alt="Delicious Pizza Special"
                className="promo-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Food Items */}
      <section className="section-featured">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Chef Recommended</span>
              <h2 className="section-title">Featured Dishes</h2>
            </div>
            <Link to="/menu" className="view-all-link">
              <span>Explore All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spin spinner" />
              <p>Loading chef specials...</p>
            </div>
          ) : (
            <div className="grid-4">
              {featuredFoods.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Best-Selling Dishes */}
      <section className="section-bestsellers">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">Customer Favorites</span>
              <h2 className="section-title">Best-Selling Dishes</h2>
            </div>
            <Link to="/menu" className="view-all-link">
              <span>View Full Menu</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spin spinner" />
              <p>Loading bestsellers...</p>
            </div>
          ) : (
            <div className="grid-4">
              {bestSellers.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Choose FoodieHub */}
      <section className="section-features">
        <div className="container">
          <div className="features-header">
            <span className="section-subtitle">The FoodieHub Promise</span>
            <h2 className="section-title">Why Thousands Order From Us</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">
                <Clock size={28} color="#FF6B35" />
              </div>
              <h3 className="feature-title">Lightning 30-Min Delivery</h3>
              <p className="feature-desc">
                Our optimized kitchen and rider dispatch ensures steaming hot food reaches you in record time.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Award size={28} color="#FF6B35" />
              </div>
              <h3 className="feature-title">Fresh, Premium Ingredients</h3>
              <p className="feature-desc">
                Cooked by master chefs using farm-fresh vegetables, highest quality meat cuts, and artisanal spices.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <ShieldCheck size={28} color="#FF6B35" />
              </div>
              <h3 className="feature-title">100% Hygienic Packaging</h3>
              <p className="feature-desc">
                Tamper-proof, food-grade thermal containers keep your meal fresh, aromatic, and temperature-sealed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page-container {
          overflow-x: hidden;
        }

        /* Hero */
        .hero-section {
          padding: 60px 0 80px;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAFAFC 100%);
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFF2EC;
          color: #FF6B35;
          padding: 8px 18px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.88rem;
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: 3.4rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1px;
          color: #222222;
          margin-bottom: 20px;
        }
        .hero-description {
          font-size: 1.1rem;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 36px;
          max-width: 540px;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 28px;
          padding-top: 24px;
          border-top: 1px solid #E5E7EB;
        }
        .hero-stat-item {
          display: flex;
          flex-direction: column;
        }
        .stat-number {
          font-size: 1.7rem;
          font-weight: 800;
          color: #222222;
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.82rem;
          color: #6B7280;
          font-weight: 600;
        }
        .stat-divider {
          width: 1px;
          height: 36px;
          background: #E5E7EB;
        }

        /* Hero Visual */
        .hero-visual {
          position: relative;
        }
        .hero-image-card {
          position: relative;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
        }
        .hero-main-img {
          width: 100%;
          height: 480px;
          object-fit: cover;
          display: block;
        }
        .floating-hero-pill {
          position: absolute;
          background: #FFFFFF;
          padding: 12px 18px;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          gap: 12px;
          animation: floatSlow 4s ease-in-out infinite alternate;
        }
        .top-pill {
          top: 24px;
          left: -20px;
        }
        .bottom-pill {
          bottom: 24px;
          right: -16px;
          animation-delay: -2s;
        }
        .pill-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFF2EC;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .green-pill {
          background: #ECFDF5;
        }
        .pill-title {
          display: block;
          font-size: 0.88rem;
          font-weight: 700;
          color: #222222;
        }
        .pill-sub {
          display: block;
          font-size: 0.75rem;
          color: #6B7280;
        }
        @keyframes floatSlow {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }

        /* Section Commons */
        .section-categories, .section-featured, .section-bestsellers, .section-promo, .section-features {
          padding: 60px 0;
        }
        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .section-subtitle {
          display: block;
          font-size: 0.85rem;
          font-weight: 800;
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .section-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #222222;
          letter-spacing: -0.5px;
        }
        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: #FF6B35;
          font-size: 0.95rem;
          transition: gap 0.2s;
        }
        .view-all-link:hover {
          gap: 10px;
        }

        /* Categories */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
        }
        .category-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 20px 14px;
          text-align: center;
          border: 1px solid #F3F4F6;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .category-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 107, 53, 0.3);
          box-shadow: 0 14px 30px rgba(255, 107, 53, 0.12);
        }
        .category-img-box {
          width: 80px;
          height: 80px;
          margin: 0 auto 14px;
          border-radius: 50%;
          overflow: hidden;
          background: #F3F4F6;
          border: 3px solid #FFF2EC;
        }
        .category-img-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .category-name {
          font-size: 1rem;
          font-weight: 700;
          color: #222222;
          margin-bottom: 4px;
        }
        .category-items-count {
          font-size: 0.78rem;
          color: #9CA3AF;
        }

        /* Promo Banner */
        .promo-banner {
          background: linear-gradient(135deg, #FFF6F2 0%, #FFEFE8 100%);
          border-radius: 28px;
          padding: 50px 60px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: center;
          border: 1.5px solid #FFD4C2;
          box-shadow: 0 10px 30px rgba(255, 107, 53, 0.08);
        }
        .promo-tag {
          font-size: 0.78rem;
          font-weight: 800;
          color: #FF6B35;
          letter-spacing: 1px;
          background: #FFFFFF;
          padding: 6px 14px;
          border-radius: 9999px;
          display: inline-block;
          margin-bottom: 16px;
        }
        .promo-heading {
          font-size: 2.2rem;
          font-weight: 800;
          color: #222222;
          line-height: 1.2;
          margin-bottom: 14px;
        }
        .promo-subtext {
          font-size: 1rem;
          color: #4B5563;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .coupon-code {
          background: #FF6B35;
          color: #FFFFFF;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }
        .promo-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 28px;
        }
        .promo-feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.92rem;
          font-weight: 600;
          color: #374151;
        }
        .promo-cta {
          display: inline-block;
        }
        .promo-visual {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
        }
        .promo-img {
          width: 100%;
          height: 320px;
          object-fit: cover;
        }

        /* Features */
        .features-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        .feature-card {
          background: #FFFFFF;
          padding: 36px 28px;
          border-radius: 20px;
          border: 1px solid #F3F4F6;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
        }
        .feature-icon-box {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: #FFF2EC;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .feature-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #222222;
          margin-bottom: 10px;
        }
        .feature-desc {
          font-size: 0.92rem;
          color: #6B7280;
          line-height: 1.6;
        }

        .loading-container {
          text-align: center;
          padding: 60px 0;
          color: #6B7280;
        }
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #E5E7EB;
          border-top-color: #FF6B35;
          border-radius: 50%;
          margin: 0 auto 16px;
        }

        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; gap: 40px; }
          .hero-title { font-size: 2.8rem; }
          .categories-grid { grid-template-columns: repeat(3, 1fr); }
          .promo-banner { grid-template-columns: 1fr; padding: 36px; }
          .features-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .hero-title { font-size: 2.2rem; }
          .categories-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-stats { flex-direction: column; align-items: flex-start; gap: 16px; }
          .stat-divider { display: none; }
          .floating-hero-pill { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Home;

