import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  RefreshCw,
  Search,
  Eye,
  X
} from 'lucide-react';
import { orderService } from '../../services/api';
import OrderStatusTracker from '../../components/OrderStatusTracker';

const orderStatuses = [
  'All',
  'Placed',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      const data = await orderService.getAll(params);
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await orderService.updateStatus(orderId, newStatus);
      await fetchOrders();
      if (selectedOrderDetails && selectedOrderDetails._id === orderId) {
        setSelectedOrderDetails((prev) => ({ ...prev, status: newStatus }));
      }
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

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const idMatch = order._id.toLowerCase().includes(term);
    const customerMatch = order.deliveryAddress?.fullName?.toLowerCase().includes(term);
    const phoneMatch = order.deliveryAddress?.phone?.includes(term);
    return idMatch || customerMatch || phoneMatch;
  });

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Customer Orders</h1>
          <p className="admin-page-sub">Track incoming tickets, dispatch kitchen preparations, and update order statuses</p>
        </div>
        <button type="button" className="btn-admin-secondary" onClick={fetchOrders}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-controls-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Chips */}
        <div className="status-filter-chips">
          {orderStatuses.map((st) => (
            <button
              key={st}
              type="button"
              className={`status-chip ${selectedStatus === st ? 'active' : ''}`}
              onClick={() => setSelectedStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-box">
            <div className="spin loader-ring" />
            <p>Fetching active tickets...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state-notice">
            <p>No orders found for the selected status.</p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Info</th>
                  <th>Customer & Address</th>
                  <th>Items & Total</th>
                  <th>Payment</th>
                  <th>Status Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span className="order-id-code">#{order._id.slice(-6).toUpperCase()}</span>
                      <span className="order-date-text">
                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <strong>{order.deliveryAddress?.fullName}</strong>
                        <span>📞 {order.deliveryAddress?.phone}</span>
                        <span className="order-address-snippet">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                      </div>
                    </td>
                    <td>
                      <div className="order-items-snippet">
                        <span>{order.items?.length || 0} items</span>
                        <strong className="table-amount">₹{order.totalAmount}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="payment-method-text">{order.paymentMethod}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        className="status-selector"
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
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
                    <td>
                      <button
                        type="button"
                        className="btn-view-order"
                        onClick={() => setSelectedOrderDetails(order)}
                        title="View Full Order Breakdown"
                      >
                        <Eye size={16} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Order Detail Modal */}
      {selectedOrderDetails && (
        <div className="modal-backdrop">
          <div className="modal-content-card" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <div>
                <h3>Order #{selectedOrderDetails._id.slice(-6).toUpperCase()}</h3>
                <span className="order-modal-date">
                  Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString()}
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedOrderDetails(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="order-modal-body">
              {/* Status stepper */}
              <OrderStatusTracker currentStatus={selectedOrderDetails.status} />

              {/* Status update selector */}
              <div className="modal-status-update-row">
                <label>Change Status:</label>
                <select
                  value={selectedOrderDetails.status}
                  onChange={(e) => handleStatusUpdate(selectedOrderDetails._id, e.target.value)}
                  className="status-selector modal-status-select"
                >
                  <option value="Placed">Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Items List */}
              <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '20px 0 10px' }}>Ordered Items</h4>
              <div className="modal-items-list">
                {selectedOrderDetails.items?.map((item, idx) => (
                  <div key={idx} className="modal-item-row">
                    <img src={item.image} alt={item.name} className="modal-item-img" />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: '#222222', fontSize: '0.92rem' }}>{item.name}</p>
                      <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                        Qty: {item.quantity} × ₹{item.price}
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#222222' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery info */}
              <div className="modal-address-box">
                <h5>Customer & Delivery Info</h5>
                <p><strong>Name:</strong> {selectedOrderDetails.deliveryAddress?.fullName}</p>
                <p><strong>Phone:</strong> {selectedOrderDetails.deliveryAddress?.phone}</p>
                <p><strong>Address:</strong> {selectedOrderDetails.deliveryAddress?.street}, {selectedOrderDetails.deliveryAddress?.city} - {selectedOrderDetails.deliveryAddress?.pincode}</p>
                {selectedOrderDetails.notes && <p><strong>Notes:</strong> "{selectedOrderDetails.notes}"</p>}
              </div>

              {/* Bill breakdown */}
              <div className="modal-bill-summary">
                <div><span>Subtotal:</span> <strong>₹{selectedOrderDetails.subtotal}</strong></div>
                <div><span>Delivery Fee:</span> <strong>{selectedOrderDetails.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderDetails.deliveryFee}`}</strong></div>
                {selectedOrderDetails.discount > 0 && <div><span>Discount:</span> <strong className="text-success">-₹{selectedOrderDetails.discount}</strong></div>}
                <div className="modal-total-line">
                  <span>Grand Total:</span>
                  <strong>₹{selectedOrderDetails.totalAmount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-orders-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .status-filter-chips {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .status-chip {
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          background: #F3F4F6;
          color: #4B5563;
          transition: all 0.2s;
        }
        .status-chip:hover {
          background: #E5E7EB;
          color: #222222;
        }
        .status-chip.active {
          background: #FF6B35;
          color: #FFFFFF;
        }
        .order-address-snippet {
          font-size: 0.76rem;
          color: #6B7280;
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .order-items-snippet {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .payment-method-text {
          display: block;
          font-size: 0.82rem;
          color: #374151;
          font-weight: 600;
        }
        .btn-view-order {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          background: #EFF6FF;
          color: #2563EB;
          font-size: 0.82rem;
          font-weight: 700;
        }
        .btn-view-order:hover {
          background: #2563EB;
          color: #FFFFFF;
        }
        .order-modal-date {
          font-size: 0.82rem;
          color: #6B7280;
        }
        .modal-status-update-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F9FAFB;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 600;
        }
        .modal-status-select {
          flex: 1;
        }
        .modal-items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 16px;
        }
        .modal-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 8px;
          border-bottom: 1px dashed #E5E7EB;
        }
        .modal-item-img {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          object-fit: cover;
        }
        .modal-address-box {
          background: #F9FAFB;
          padding: 16px;
          border-radius: 14px;
          font-size: 0.86rem;
          margin-bottom: 16px;
          line-height: 1.5;
        }
        .modal-address-box h5 {
          font-size: 0.92rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #222222;
        }
        .modal-bill-summary {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.88rem;
          color: #4B5563;
        }
        .modal-bill-summary div {
          display: flex;
          justify-content: space-between;
        }
        .modal-total-line {
          border-top: 1px solid #E5E7EB;
          padding-top: 8px;
          font-size: 1.1rem;
          font-weight: 800;
          color: #FF6B35;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;

