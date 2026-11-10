import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  ShoppingBag,
  Users,
  ArrowLeft,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="admin-sidebar">
      {/* Admin Brand */}
      <div className="admin-brand-box">
        <Link to="/admin" className="admin-brand-link">
          <div className="admin-logo-icon">
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div>
            <span className="admin-brand-name">Foodie<span className="text-primary">Hub</span></span>
            <span className="admin-badge-label">Admin Console</span>
          </div>
        </Link>
      </div>

      {/* Nav Menu */}
      <nav className="admin-nav-menu">
        <div className="admin-nav-section-title">MANAGEMENT</div>

        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={19} />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/admin/foods"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <UtensilsCrossed size={19} />
          <span>Manage Food</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Tags size={19} />
          <span>Manage Categories</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingBag size={19} />
          <span>Manage Orders</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={19} />
          <span>Manage Users</span>
        </NavLink>
      </nav>

      {/* Bottom Actions */}
      <div className="admin-sidebar-footer">
        <Link to="/" className="sidebar-store-link">
          <ArrowLeft size={16} />
          <span>Back to Storefront</span>
        </Link>

        <div className="admin-user-profile-strip">
          <div className="admin-user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="admin-user-meta">
            <span className="admin-user-name">{user?.name || 'Administrator'}</span>
            <span className="admin-user-role">Super Admin</span>
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .admin-sidebar {
          width: 260px;
          min-height: 100vh;
          background: #FFFFFF;
          border-right: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          flex-shrink: 0;
          z-index: 100;
        }
        .admin-brand-box {
          padding: 24px 20px;
          border-bottom: 1px solid #F3F4F6;
        }
        .admin-brand-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .admin-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #FF6B35 0%, #FF8F54 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          color: #222222;
          display: block;
          line-height: 1.2;
        }
        .admin-badge-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #FF6B35;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .admin-nav-menu {
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .admin-nav-section-title {
          font-size: 0.7rem;
          font-weight: 800;
          color: #9CA3AF;
          letter-spacing: 1px;
          padding: 8px 12px 6px;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #4B5563;
          font-weight: 600;
          font-size: 0.92rem;
          transition: all 0.2s;
          text-decoration: none;
        }
        .admin-nav-item:hover {
          background: #F9FAFB;
          color: #FF6B35;
        }
        .admin-nav-item.active {
          background: #FFF2EC;
          color: #FF6B35;
          font-weight: 700;
        }
        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid #F3F4F6;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .sidebar-store-link {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4B5563;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .sidebar-store-link:hover {
          background: #F3F4F6;
          color: #FF6B35;
        }
        .admin-user-profile-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #F9FAFB;
          border-radius: 12px;
        }
        .admin-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FF6B35;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-user-meta {
          flex: 1;
          overflow: hidden;
        }
        .admin-user-name {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #222222;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .admin-user-role {
          display: block;
          font-size: 0.72rem;
          color: #9CA3AF;
        }
        .admin-logout-btn {
          color: #9CA3AF;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.15s;
        }
        .admin-logout-btn:hover {
          color: #EF4444;
          background: #FEF2F2;
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;

