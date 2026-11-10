import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper" id="contact">
      <div className="container footer-content">
        {/* Col 1: Brand & Bio */}
        <div className="footer-col brand-col">
          <Link to="/" className="brand-logo footer-logo">
            <div className="logo-icon-bg">
              <Sparkles size={20} color="#FFFFFF" />
            </div>
            <span className="brand-name text-white">
              Foodie<span className="brand-highlight">Hub</span>
            </span>
          </Link>
          <p className="footer-desc">
            Craving perfection? FoodieHub delivers hot, freshly prepared chef specials right to your doorstep in 30 minutes. Savor every bite!
          </p>
          <div className="social-links">
            <a href="#instagram" className="social-icon" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#facebook" className="social-icon" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#twitter" className="social-icon" aria-label="Twitter">
              <Twitter size={18} />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Explore Menu</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/orders">Track Orders</Link></li>
            <li><Link to="/login">Customer Login</Link></li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div className="footer-col">
          <h4 className="footer-heading">Top Categories</h4>
          <ul className="footer-links">
            <li><Link to="/menu?category=Biryani">Royal Biryani</Link></li>
            <li><Link to="/menu?category=Pizza">Artisan Pizza</Link></li>
            <li><Link to="/menu?category=Burgers">Smash Burgers</Link></li>
            <li><Link to="/menu?category=Indian%20Meals">Indian Meals</Link></li>
            <li><Link to="/menu?category=Desserts">Gourmet Desserts</Link></li>
            <li><Link to="/menu?category=Beverages">Chilled Beverages</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact & Hours */}
        <div className="footer-col" id="about">
          <h4 className="footer-heading">Get in Touch</h4>
          <ul className="contact-list">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>42 Tech Park Avenue, Koramangala, Bangalore - 560034</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+91 98765 43210</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>support@foodiehub.com</span>
            </li>
            <li>
              <Clock size={18} className="contact-icon" />
              <span>Mon - Sun: 10:00 AM - 11:30 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-flex">
          <p>© {new Date().getFullYear()} FoodieHub Technologies Inc. All rights reserved.</p>
          <div className="bottom-badges">
            <span>⚡ 30-Min Delivery</span>
            <span>🔒 100% Safe Checkout</span>
            <span>⭐ 4.9/5 Rated Quality</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: #1A1D20;
          color: #E5E7EB;
          padding-top: 64px;
          margin-top: 80px;
        }
        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.8fr;
          gap: 40px;
          padding-bottom: 48px;
        }
        .brand-col .footer-logo {
          margin-bottom: 16px;
        }
        .brand-col .text-white {
          color: #FFFFFF;
        }
        .footer-desc {
          font-size: 0.92rem;
          color: #9CA3AF;
          line-height: 1.6;
          margin-bottom: 24px;
          max-width: 320px;
        }
        .social-links {
          display: flex;
          gap: 12px;
        }
        .social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #2D3139;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .social-icon:hover {
          background: #FF6B35;
          transform: translateY(-3px);
        }
        .footer-heading {
          font-size: 1.05rem;
          color: #FFFFFF;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links a {
          color: #9CA3AF;
          font-size: 0.92rem;
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: #FF6B35;
          padding-left: 4px;
        }
        .contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .contact-list li {
          display: flex;
          gap: 12px;
          font-size: 0.9rem;
          color: #9CA3AF;
          line-height: 1.5;
        }
        .contact-icon {
          color: #FF6B35;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .footer-bottom {
          border-top: 1px solid #2D3139;
          padding: 24px 0;
          font-size: 0.85rem;
          color: #6B7280;
        }
        .bottom-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .bottom-badges {
          display: flex;
          gap: 20px;
          color: #9CA3AF;
          font-weight: 600;
          font-size: 0.82rem;
        }
        @media (max-width: 900px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 600px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
          .bottom-flex {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

