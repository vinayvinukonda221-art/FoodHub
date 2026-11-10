import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Tags, CheckCircle2, Image } from 'lucide-react';
import { categoryService } from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    iconName: 'Utensils'
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim()) {
      alert('Name and Image URL are required');
      return;
    }

    try {
      setSubmitting(true);
      await categoryService.create(formData);
      setSubmitting(false);
      setIsModalOpen(false);
      setFormData({ name: '', description: '', image: '', iconName: 'Utensils' });
      setMsg({ type: 'success', text: `Category "${formData.name}" added successfully!` });
      fetchCategories();
      setTimeout(() => setMsg(null), 4000);
    } catch (err) {
      setSubmitting(false);
      alert(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      try {
        await categoryService.delete(id);
        setMsg({ type: 'success', text: `Category "${name}" removed.` });
        fetchCategories();
        setTimeout(() => setMsg(null), 4000);
      } catch (err) {
        alert('Failed to delete category');
      }
    }
  };

  return (
    <div className="admin-categories-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Food Categories</h1>
          <p className="admin-page-sub">Configure menu taxonomy, banners, and category groupings</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {msg && (
        <div className={`feedback-alert ${msg.type}`}>
          <CheckCircle2 size={18} />
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="admin-loading-box">
          <div className="spin loader-ring" />
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="categories-admin-grid">
          {categories.map((cat) => (
            <div key={cat._id} className="category-admin-card">
              <div className="category-card-banner">
                <img src={cat.image} alt={cat.name} />
                <button
                  type="button"
                  className="cat-delete-btn"
                  onClick={() => handleDelete(cat._id, cat.name)}
                  title="Delete Category"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="category-card-body">
                <div className="cat-title-row">
                  <h4>{cat.name}</h4>
                  <span className="badge badge-primary">{cat.itemCount || 0} dishes</span>
                </div>
                <p className="cat-desc">{cat.description || 'No description provided.'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div className="modal-header">
              <h3>Create New Category</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Starters & Appetizers"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief description of this culinary genre..."
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="form-control"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .categories-admin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .category-admin-card {
          background: #FFFFFF;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #F3F4F6;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
        }
        .category-card-banner {
          position: relative;
          height: 160px;
          background: #F3F4F6;
        }
        .category-card-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cat-delete-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.9);
          color: #EF4444;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.2s;
        }
        .cat-delete-btn:hover {
          background: #EF4444;
          color: #FFFFFF;
        }
        .category-card-body {
          padding: 20px;
        }
        .cat-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .cat-title-row h4 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #222222;
        }
        .cat-desc {
          font-size: 0.85rem;
          color: #6B7280;
          line-height: 1.5;
        }
        @media (max-width: 900px) {
          .categories-admin-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminCategories;

