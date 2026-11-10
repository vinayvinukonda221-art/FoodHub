import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { authService } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term))
    );
  });

  return (
    <div className="admin-users-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Registered Users</h1>
          <p className="admin-page-sub">View customer accounts, roles, order frequencies, and profiles</p>
        </div>
        <button type="button" className="btn-admin-secondary" onClick={fetchUsers}>
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="admin-controls-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="total-users-indicator">Total Accounts: <strong>{users.length}</strong></span>
      </div>

      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-box">
            <div className="spin loader-ring" />
            <p>Loading user database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state-notice">
            <p>No user accounts matched your search.</p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Orders Placed</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-cell-avatar">
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <strong className="user-cell-name">{u.name}</strong>
                          <span className="user-cell-email">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <span>📞 {u.phone || 'Not provided'}</span>
                        <span className="address-snippet">
                          📍 {u.address?.street ? `${u.address.street}, ${u.address.city || ''}` : 'Address not set'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-gray'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div className="orders-count-pill">
                        <ShoppingBag size={14} color="#FF6B35" />
                        <span>{u.totalOrders || 0} orders</span>
                      </div>
                    </td>
                    <td>
                      <span className="joined-date">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .admin-users-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .total-users-indicator {
          font-size: 0.9rem;
          color: #6B7280;
        }
        .user-profile-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-cell-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FF6B35;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .user-cell-name {
          display: block;
          color: #222222;
          font-size: 0.95rem;
        }
        .user-cell-email {
          display: block;
          font-size: 0.8rem;
          color: #6B7280;
        }
        .contact-cell {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 0.82rem;
          color: #374151;
        }
        .address-snippet {
          color: #9CA3AF;
          font-size: 0.78rem;
          max-width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .orders-count-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFF2EC;
          color: #FF6B35;
          padding: 4px 12px;
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.8rem;
        }
        .joined-date {
          font-size: 0.85rem;
          color: #6B7280;
        }
      `}</style>
    </div>
  );
};

export default AdminUsers;

