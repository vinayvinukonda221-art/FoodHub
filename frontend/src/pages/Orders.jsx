import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { orderService } from '../services/api';
import OrderStatusTracker from '../components/OrderStatusTracker';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders();
      setOrders(data);
      // Auto expand the first order if exists
      if (data.length > 0) {
        setExpandedOrderId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
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

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-page-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-sub">Track live status and view past culinary delights</p>
          </div>
          <button type="button" className="refresh-orders-btn" onClick={fetchOrders} title="Refresh orders">
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {loading && orders.length === 0 ? (
          <div className="orders-loading">
            <div className="spin loader-ring" />
            <p>Retrieving your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders-card">
            <div className="empty-orders-icon">
              <Package size={48} color="#FF6B35" />
            </div>
            <h2>No orders yet</h2>
            <p>You haven't placed any delicious orders with us yet. Your tastebuds are waiting!</p>
            <Link to="/menu" className="btn btn-primary btn-lg">
              <span>Order Food Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="orders-list-wrapper">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={order._id} className="order-history-card">
                  {/* Card Header */}
                  <div className="order-card-header" onClick={() => toggleExpand(order._id)}>
                    <div className="order-header-left">
                      <div className="order-id-badge">
                        <Package size={18} color="#FF6B35" />
                        <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                      </div>
                      <div className="order-meta-info">
                        <div className="order-meta-item">
                          <Calendar size={14} />
                          <span>{dateFormatted}</span>
                        </div>
                        <span className="meta-sep">•</span>
                        <div className="order-meta-item">
                          <span>{order.items?.length || 0} items</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-header-right">
                      <span className={`badge ${getStatusBadgeClass(order.status)} status-badge`}>
                        {order.status}
                      </span>
                      <span className="order-header-total">₹{order.totalAmount}</span>
                      <button type="button" className="expand-chevron-btn" aria-label="Toggle details">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Card Body (Expandable) */}
                  {isExpanded && (
                    <div className="order-card-body">
                      {/* Live visual progress stepper */}
                      <OrderStatusTracker currentStatus={order.status} />

                      {/* Item thumbnails & list */}
                      <div className="order-items-table">
                        <h4 className="body-section-title">Dishes in this Order</h4>
                        <div className="order-items-grid">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="ordered-item-cell">
                              <div className="ordered-item-img">
                                <img src={item.image} alt={item.name} />
                              </div>
                              <div className="ordered-item-text">
                                <p className="ordered-item-name">{item.name}</p>
                                <span className="ordered-item-price-qty">
                                  {item.quantity} × ₹{item.price} = <strong>₹{item.price * item.quantity}</strong>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery & Payment details summary */}
                      <div className="order-meta-details-grid">
                        <div className="detail-box">
                          <div className="detail-box-header">
                            <MapPin size={16} color="#FF6B35" />
                            <h5>Delivery Destination</h5>
                          </div>
                          <p className="detail-name"><strong>{order.deliveryAddress?.fullName}</strong> ({order.deliveryAddress?.phone})</p>
                          <p className="detail-text">{order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}</p>
                          {order.notes && <p className="detail-notes">Note: "{order.notes}"</p>}
                        </div>

                        <div className="detail-box">
                          <div className="detail-box-header">
                            <CreditCard size={16} color="#FF6B35" />
                            <h5>Payment Summary</h5>
                          </div>
                          <p className="detail-text">Method: <strong>{order.paymentMethod}</strong></p>
                          <p className="detail-text">Payment Status: <span className="text-success font-bold">{order.paymentStatus}</span></p>
                          <div className="micro-bill">
                            <div><span>Subtotal:</span> <strong>₹{order.subtotal}</strong></div>
                            <div><span>Delivery:</span> <strong>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</strong></div>
                            {order.discount > 0 && <div><span>Discount:</span> <strong className="text-success">-₹{order.discount}</strong></div>}
                            <div className="micro-bill-total"><span>Total:</span> <strong>₹{order.totalAmount}</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .orders-page {
          padding: 40px 0 80px;
        }
        .orders-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .orders-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #222222;
        }
        .orders-sub {
          color: #6B7280;
          font-size: 0.95rem;
        }
        .refresh-orders-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 9999px;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          color: #374151;
          font-weight: 600;
          font-size: 0.88rem;
          transition: all 0.2s;
        }
        .refresh-orders-btn:hover {
          border-color: #FF6B35;
          color: #FF6B35;
        }
        .orders-loading {
          text-align: center;
          padding: 80px 0;
          color: #6B7280;
        }
        .loader-ring {
          width: 44px;
          height: 44px;
          border: 3.5px solid #F3F4F6;
          border-top-color: #FF6B35;
          border-radius: 50%;
          margin: 0 auto 16px;
        }
        .empty-orders-card {
          background: #FFFFFF;
          max-width: 520px;
          margin: 40px auto;
          border-radius: 28px;
          padding: 48px 36px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border: 1px solid #F3F4F6;
        }
        .empty-orders-icon {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: #FFF2EC;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .empty-orders-card h2 {
          font-size: 1.6rem;
          margin-bottom: 8px;
        }
        .empty-orders-card p {
          color: #6B7280;
          margin-bottom: 24px;
        }
        .orders-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .order-history-card {
          background: #FFFFFF;
          border-radius: 22px;
          border: 1px solid #F3F4F6;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .order-history-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }
        .order-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
          cursor: pointer;
          user-select: none;
          background: #FFFFFF;
          flex-wrap: wrap;
          gap: 16px;
        }
        .order-header-left {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .order-id-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 1.05rem;
          font-weight: 800;
          color: #222222;
        }
        .order-meta-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #6B7280;
        }
        .order-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .meta-sep {
          color: #D1D5DB;
        }
        .order-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .status-badge {
          padding: 6px 14px;
          font-size: 0.82rem;
        }
        .order-header-total {
          font-size: 1.25rem;
          font-weight: 800;
          color: #222222;
        }
        .expand-chevron-btn {
          color: #6B7280;
        }
        .order-card-body {
          padding: 24px 28px 28px;
          background: #FAFAFC;
          border-top: 1px solid #F3F4F6;
        }
        .body-section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #222222;
          margin-bottom: 14px;
        }
        .order-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .ordered-item-cell {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 12px;
        }
        .ordered-item-img {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          overflow: hidden;
          background: #F3F4F6;
          flex-shrink: 0;
        }
        .ordered-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ordered-item-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: #222222;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .ordered-item-price-qty {
          font-size: 0.82rem;
          color: #6B7280;
        }
        .order-meta-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .detail-box {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 20px;
        }
        .detail-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .detail-box-header h5 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #222222;
        }
        .detail-name {
          font-size: 0.9rem;
          color: #222222;
          margin-bottom: 4px;
        }
        .detail-text {
          font-size: 0.85rem;
          color: #6B7280;
          line-height: 1.5;
        }
        .detail-notes {
          font-size: 0.82rem;
          color: #F59E0B;
          margin-top: 6px;
          font-style: italic;
        }
        .micro-bill {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #E5E7EB;
          font-size: 0.85rem;
        }
        .micro-bill div {
          display: flex;
          justify-content: space-between;
          color: #4B5563;
        }
        .micro-bill-total {
          border-top: 1px solid #E5E7EB;
          padding-top: 6px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #222222;
        }
        @media (max-width: 768px) {
          .order-meta-details-grid {
            grid-template-columns: 1fr;
          }
          .order-card-header {
            padding: 16px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;

