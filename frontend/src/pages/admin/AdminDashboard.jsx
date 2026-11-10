import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bike,
  Plus,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { orderService } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateStatus(orderId, newStatus);
      await fetchStats();
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-success';
      case 'Cancelled':
        return 'badge-danger';
      case 'Out for Delivery':
        return 'badge-warning';
      default:
        return 'badge-primary';
    }
  };

  if (loading && !stats) {
    return (
      <div className="admin-loading-box">
        <div className="spin loader-ring" />
        <p>Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Executive Dashboard</h1>
          <p className="admin-page-sub">Real-time performance metrics and live order stream</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="btn-admin-secondary" onClick={fetchStats}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh Data</span>
          </button>
          <Link to="/admin/foods" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add New Dish</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="metrics-grid">
        {/* Total Revenue */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Revenue</span>
            <div className="metric-icon-box orange">
              <DollarSign size={20} color="#FF6B35" />
            </div>
          </div>
          <div className="metric-value">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
          <div className="metric-trend text-success">
            <TrendingUp size={14} />
            <span>From delivered orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Orders</span>
            <div className="metric-icon-box blue">
              <ShoppingBag size={20} color="#3B82F6" />
            </div>
          </div>
          <div className="metric-value">{stats?.totalOrders || 0}</div>
          <div className="metric-trend">
            <span>Across all customers</span>
          </div>
        </div>

        {/* Total Dishes */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Food Items</span>
            <div className="metric-icon-box green">
              <UtensilsCrossed size={20} color="#10B981" />
            </div>
          </div>
          <div className="metric-value">{stats?.totalFoodItems || 0}</div>
          <div className="metric-trend">
            <span>In 6 categories</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Registered Customers</span>
            <div className="metric-icon-box purple">
              <Users size={20} color="#8B5CF6" />
            </div>
          </div>
          <div className="metric-value">{stats?.totalCustomers || 0}</div>
          <div className="metric-trend">
            <span>Verified accounts</span>
          </div>
        </div>
      </div>

      {/* Status Breakdown Bar */}
      <div className="status-breakdown-row">
        <div className="breakdown-item">
          <Clock size={16} color="#F59E0B" />
          <span>Pending/Kitchen: <strong>{stats?.breakdown?.pendingOrders || 0}</strong></span>
        </div>
        <div className="breakdown-item">
          <Bike size={16} color="#3B82F6" />
          <span>Out for Delivery: <strong>{stats?.breakdown?.activeDeliveries || 0}</strong></span>
        </div>
        <div className="breakdown-item">
          <CheckCircle2 size={16} color="#10B981" />
          <span>Completed: <strong>{stats?.breakdown?.deliveredOrders || 0}</strong></span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="admin-card recent-orders-card">
        <div className="card-top-bar">
          <h3>Recent Customer Orders</h3>
          <Link to="/admin/orders" className="view-all-orders-link">
            <span>Manage All Orders</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <p className="no-orders-notice">No orders placed yet.</p>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span className="order-id-code">#{order._id.slice(-6).toUpperCase()}</span>
                      <span className="order-date-text">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <strong>{order.deliveryAddress?.fullName || order.userId?.name || 'Customer'}</strong>
                        <span>{order.deliveryAddress?.phone || order.userId?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="item-count-pill">{order.items?.length || 0} dishes</span>
                    </td>
                    <td>
                      <strong className="table-amount">₹{order.totalAmount}</strong>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-selector"
                        value={order.status}
                        onChange={(e) => handleQuickStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .admin-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-page-title {
          font-size: 2rem;
          font-weight: 800;
          color: #222222;
        }
        .admin-page-sub {
          color: #6B7280;
          font-size: 0.92rem;
        }
        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-admin-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9999px;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s;
        }
        .btn-admin-secondary:hover {
          border-color: #FF6B35;
          color: #FF6B35;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        .metric-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #F3F4F6;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
        }
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .metric-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #6B7280;
        }
        .metric-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-icon-box.orange { background: #FFF2EC; }
        .metric-icon-box.blue { background: #EFF6FF; }
        .metric-icon-box.green { background: #ECFDF5; }
        .metric-icon-box.purple { background: #F5F3FF; }
        .metric-value {
          font-size: 1.9rem;
          font-weight: 800;
          color: #222222;
          margin-bottom: 6px;
        }
        .metric-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: #9CA3AF;
        }
        .status-breakdown-row {
          display: flex;
          align-items: center;
          gap: 24px;
          background: #FFFFFF;
          border-radius: 16px;
          padding: 16px 24px;
          border: 1px solid #F3F4F6;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          color: #4B5563;
        }
        .admin-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 26px;
          border: 1px solid #F3F4F6;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F3F4F6;
        }
        .card-top-bar h3 {
          font-size: 1.2rem;
          font-weight: 800;
          color: #222222;
        }
        .view-all-orders-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #FF6B35;
        }
        .admin-table-responsive {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .admin-table th {
          padding: 12px 16px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          border-bottom: 1px solid #E5E7EB;
        }
        .admin-table td {
          padding: 16px;
          font-size: 0.9rem;
          color: #374151;
          border-bottom: 1px solid #F3F4F6;
        }
        .order-id-code {
          display: block;
          font-weight: 800;
          color: #222222;
        }
        .order-date-text {
          display: block;
          font-size: 0.75rem;
          color: #9CA3AF;
        }
        .customer-info strong {
          display: block;
          font-size: 0.9rem;
          color: #222222;
        }
        .customer-info span {
          display: block;
          font-size: 0.78rem;
          color: #9CA3AF;
        }
        .item-count-pill {
          background: #F3F4F6;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .table-amount {
          color: #222222;
          font-weight: 800;
        }
        .status-selector {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          font-size: 0.82rem;
          font-weight: 600;
          outline: none;
          background: #FFFFFF;
          cursor: pointer;
        }
        .status-selector:focus {
          border-color: #FF6B35;
        }
        .admin-loading-box {
          text-align: center;
          padding: 100px 0;
          color: #6B7280;
        }
        .loader-ring {
          width: 44px;
          height: 44px;
          border: 3.5px solid #E5E7EB;
          border-top-color: #FF6B35;
          border-radius: 50%;
          margin: 0 auto 16px;
        }
        @media (max-width: 1024px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

