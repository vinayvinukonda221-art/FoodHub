import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Menu as MenuIcon,
  X,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-bg">
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <span className="brand-name">
            Foodie<span className="brand-highlight">Hub</span>
          </span>
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="nav-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for biryani, pizza, burgers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
            >
              <X size={14} />
            </button>
          )}
        </form>

        {/* Navigation Links (Desktop) */}
        <nav className="desktop-nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/menu" className={`nav-link ${isActive('/menu') ? 'active' : ''}`}>
            Menu
          </Link>
          <a href="#about" className="nav-link" onClick={(e) => {
            if (location.pathname !== '/') {
              e.preventDefault();
              navigate('/#about');
            }
          }}>
            About
          </a>
          <a href="#contact" className="nav-link" onClick={(e) => {
            if (location.pathname !== '/') {
              e.preventDefault();
              navigate('/#contact');
            }
          }}>
            Contact
          </a>
        </nav>

        {/* Action Buttons: Cart, Auth, Admin */}
        <div className="navbar-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
            <ShoppingBag size={22} />
            {totalItemCount > 0 && (
              <span className="cart-badge">{totalItemCount}</span>
            )}
          </Link>

          {/* Auth State */}
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button
                className="user-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name-display">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div
                  className="user-dropdown-menu"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                    <span className="badge badge-primary">{user.role}</span>
                  </div>

                  <hr className="dropdown-divider" />

                  <Link
                    to="/orders"
                    className="dropdown-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <Clock size={16} /> My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item admin-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  )}

                  <hr className="dropdown-divider" />

                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <form onSubmit={handleSearchSubmit} className="mobile-search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/menu" onClick={() => setMobileMenuOpen(false)}>Menu</Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
            {isAdmin && (
              <Link to="/admin" className="admin-nav-item" onClick={() => setMobileMenuOpen(false)}>
                Admin Dashboard
              </Link>
            )}
            {!isAuthenticated ? (
              <div className="mobile-auth-grid">
                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </div>
            ) : (
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                <LogOut size={16} /> Logout ({user.name})
              </button>
            )}
          </nav>
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #FFFFFF;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          gap: 16px;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon-bg {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #FF6B35 0%, #FF8F54 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(255, 107, 53, 0.3);
        }
        .brand-name {
          font-size: 1.45rem;
          font-weight: 800;
          color: #222222;
          letter-spacing: -0.5px;
        }
        .brand-highlight {
          color: #FF6B35;
        }
        .nav-search-bar {
          display: flex;
          align-items: center;
          position: relative;
          background: #F3F4F6;
          border-radius: 9999px;
          padding: 8px 16px;
          width: 320px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .nav-search-bar:focus-within {
          background: #FFFFFF;
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
        }
        .nav-search-bar input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.88rem;
          width: 100%;
          padding-left: 8px;
          color: #222222;
        }
        .search-icon {
          color: #9CA3AF;
        }
        .search-clear-btn {
          color: #9CA3AF;
        }
        .desktop-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-link {
          font-size: 0.95rem;
          font-weight: 600;
          color: #4B5563;
          transition: color 0.2s;
        }
        .nav-link:hover, .nav-link.active {
          color: #FF6B35;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #FFF2EC;
          color: #FF6B35;
          transition: all 0.2s;
        }
        .cart-btn:hover {
          background: #FFE4D8;
          transform: translateY(-2px);
        }
        .cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #FF6B35;
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 800;
          min-width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid #FFFFFF;
        }
        .user-menu-container {
          position: relative;
        }
        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 9999px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #FF6B35;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .user-name-display {
          font-size: 0.88rem;
          font-weight: 600;
          color: #222222;
        }
        .user-dropdown-menu {
          position: absolute;
          right: 0;
          top: 115%;
          width: 230px;
          background: #FFFFFF;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(0, 0, 0, 0.06);
          padding: 12px;
          z-index: 1010;
        }
        .dropdown-header {
          padding: 8px;
        }
        .dropdown-user-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #222222;
        }
        .dropdown-user-email {
          font-size: 0.8rem;
          color: #6B7280;
          margin-bottom: 6px;
          word-break: break-all;
        }
        .dropdown-divider {
          border: none;
          height: 1px;
          background: #F3F4F6;
          margin: 8px 0;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
          border-radius: 8px;
          transition: background 0.15s;
          width: 100%;
          text-align: left;
        }
        .dropdown-item:hover {
          background: #F3F4F6;
        }
        .admin-link {
          color: #FF6B35;
        }
        .admin-link:hover {
          background: #FFF2EC;
        }
        .logout-item {
          color: #EF4444;
        }
        .logout-item:hover {
          background: #FEF2F2;
        }
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mobile-menu-toggle {
          display: none;
          color: #222222;
        }
        .mobile-drawer {
          display: none;
        }

        @media (max-width: 900px) {
          .nav-search-bar { display: none; }
          .desktop-nav-links { display: none; }
          .mobile-menu-toggle { display: block; }
          .mobile-drawer {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px 24px 24px;
            background: #FFFFFF;
            border-top: 1px solid #F3F4F6;
          }
          .mobile-search-bar {
            display: flex;
            align-items: center;
            background: #F3F4F6;
            border-radius: 9999px;
            padding: 10px 16px;
          }
          .mobile-search-bar input {
            border: none;
            background: transparent;
            outline: none;
            width: 100%;
            margin-left: 8px;
          }
          .mobile-nav-links {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .mobile-nav-links a {
            font-size: 1rem;
            font-weight: 600;
            color: #374151;
          }
          .mobile-auth-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 8px;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

