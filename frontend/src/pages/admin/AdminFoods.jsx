import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { foodService, categoryService } from '../../services/api';

const categoriesList = [
  'Biryani',
  'Pizza',
  'Burgers',
  'Indian Meals',
  'Desserts',
  'Beverages'
];

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Biryani',
    price: '',
    image: '',
    rating: 4.8,
    isVeg: true,
    available: true,
    preparationTime: '25-35 mins',
    featured: false,
    isBestSeller: false
  });

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCat !== 'All') params.category = selectedCat;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await foodService.getAll(params);
      setFoods(data);
    } catch (err) {
      console.error('Failed to load foods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedCat, searchTerm]);

  const openAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      category: 'Biryani',
      price: '',
      image: '',
      rating: 4.8,
      isVeg: true,
      available: true,
      preparationTime: '25-35 mins',
      featured: false,
      isBestSeller: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      category: food.category,
      price: food.price,
      image: food.image,
      rating: food.rating || 4.8,
      isVeg: food.isVeg !== undefined ? food.isVeg : true,
      available: food.available !== undefined ? food.available : true,
      preparationTime: food.preparationTime || '25-35 mins',
      featured: Boolean(food.featured),
      isBestSeller: Boolean(food.isBestSeller)
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFood(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setModalSubmitting(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        rating: Number(formData.rating)
      };

      if (editingFood) {
        await foodService.update(editingFood._id, payload);
        setFeedbackMsg({ type: 'success', text: `Dish "${formData.name}" updated successfully!` });
      } else {
        await foodService.create(payload);
        setFeedbackMsg({ type: 'success', text: `Dish "${formData.name}" created successfully!` });
      }

      setModalSubmitting(false);
      closeModal();
      fetchFoods();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      setModalSubmitting(false);
      alert(err.response?.data?.message || 'Error saving food item');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        await foodService.delete(id);
        setFeedbackMsg({ type: 'success', text: `"${name}" was deleted.` });
        fetchFoods();
        setTimeout(() => setFeedbackMsg(null), 4000);
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      await foodService.update(food._id, { available: !food.available });
      setFoods((prev) =>
        prev.map((f) => (f._id === food._id ? { ...f, available: !f.available } : f))
      );
    } catch (err) {
      alert('Failed to update availability');
    }
  };

  return (
    <div className="admin-foods-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Manage Food Items</h1>
          <p className="admin-page-sub">View, add, edit, delete, and control menu availability</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add New Dish</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className={`feedback-alert ${feedbackMsg.type}`}>
          <CheckCircle2 size={18} />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="admin-controls-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search dish by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter-box">
          <Filter size={16} />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="All">All Categories ({foods.length})</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Foods Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading-box">
            <div className="spin loader-ring" />
            <p>Loading dishes...</p>
          </div>
        ) : foods.length === 0 ? (
          <div className="empty-state-notice">
            <p>No dishes found matching your search.</p>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Dietary</th>
                  <th>Rating</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    <td>
                      <div className="food-table-cell">
                        <img src={food.image} alt={food.name} className="food-cell-img" />
                        <div>
                          <strong className="food-cell-name">{food.name}</strong>
                          <span className="food-cell-desc">{food.description.slice(0, 50)}...</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray">{food.category}</span>
                    </td>
                    <td>
                      <strong className="table-price">₹{food.price}</strong>
                    </td>
                    <td>
                      <span className={food.isVeg ? 'veg-tag' : 'non-veg-tag'} />
                      <span style={{ fontSize: '0.8rem', marginLeft: '6px' }}>{food.isVeg ? 'Veg' : 'Non-Veg'}</span>
                    </td>
                    <td>
                      <span className="rating-num">★ {food.rating ? food.rating.toFixed(1) : '4.5'}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`availability-toggle-btn ${food.available ? 'active' : ''}`}
                        onClick={() => handleToggleAvailability(food)}
                      >
                        {food.available ? <ToggleRight size={24} color="#10B981" /> : <ToggleLeft size={24} color="#9CA3AF" />}
                        <span>{food.available ? 'In Stock' : 'Sold Out'}</span>
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action edit"
                          onClick={() => openEditModal(food)}
                          title="Edit Dish"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action delete"
                          onClick={() => handleDelete(food._id, food.name)}
                          title="Delete Dish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Food Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div className="modal-header">
              <h3>{editingFood ? 'Edit Dish' : 'Add New Dish to Menu'}</h3>
              <button type="button" className="modal-close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body-form">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Dish Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Royal Chicken Biryani"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="form-control"
                    required
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Describe ingredients, cooking technique, and flavors..."
                  className="form-control"
                  required
                />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="299"
                    className="form-control"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleFormChange}
                    className="form-control"
                    min="1"
                    max="5"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prep Time</label>
                  <input
                    type="text"
                    name="preparationTime"
                    value={formData.preparationTime}
                    onChange={handleFormChange}
                    placeholder="20-30 mins"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleFormChange}
                  placeholder="https://images.unsplash.com/..."
                  className="form-control"
                  required
                />
              </div>

              {/* Toggles */}
              <div className="modal-checkboxes-grid">
                <label className="checkbox-tile">
                  <input
                    type="checkbox"
                    name="isVeg"
                    checked={formData.isVeg}
                    onChange={handleFormChange}
                  />
                  <span>Is Pure Vegetarian</span>
                </label>

                <label className="checkbox-tile">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleFormChange}
                  />
                  <span>Currently Available (In Stock)</span>
                </label>

                <label className="checkbox-tile">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleFormChange}
                  />
                  <span>Feature on Home Page</span>
                </label>

                <label className="checkbox-tile">
                  <input
                    type="checkbox"
                    name="isBestSeller"
                    checked={formData.isBestSeller}
                    onChange={handleFormChange}
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={modalSubmitting}>
                  {modalSubmitting ? 'Saving...' : editingFood ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-foods-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .feedback-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
          padding: 12px 18px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .admin-controls-card {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 16px 20px;
          border: 1px solid #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .search-box {
          display: flex;
          align-items: center;
          background: #F9FAFB;
          border: 1.5px solid #E5E7EB;
          border-radius: 9999px;
          padding: 8px 16px;
          width: 380px;
        }
        .search-box input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          margin-left: 8px;
          font-size: 0.88rem;
        }
        .category-filter-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F9FAFB;
          border: 1.5px solid #E5E7EB;
          border-radius: 9999px;
          padding: 8px 16px;
        }
        .category-filter-box select {
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
        }
        .food-table-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .food-cell-img {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          object-fit: cover;
          background: #F3F4F6;
        }
        .food-cell-name {
          display: block;
          font-size: 0.95rem;
          color: #222222;
        }
        .food-cell-desc {
          display: block;
          font-size: 0.75rem;
          color: #9CA3AF;
        }
        .table-price {
          color: #222222;
          font-weight: 800;
        }
        .rating-num {
          font-weight: 700;
          color: #F59E0B;
        }
        .availability-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #6B7280;
        }
        .availability-toggle-btn.active {
          color: #10B981;
        }
        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-action {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .btn-action.edit {
          background: #EFF6FF;
          color: #2563EB;
        }
        .btn-action.edit:hover {
          background: #2563EB;
          color: #FFFFFF;
        }
        .btn-action.delete {
          background: #FEF2F2;
          color: #EF4444;
        }
        .btn-action.delete:hover {
          background: #EF4444;
          color: #FFFFFF;
        }
        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }
        .modal-content-card {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 680px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          padding: 32px;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 1px solid #F3F4F6;
          margin-bottom: 24px;
        }
        .modal-header h3 {
          font-size: 1.3rem;
          font-weight: 800;
        }
        .modal-close-btn {
          color: #9CA3AF;
        }
        .modal-checkboxes-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
          background: #F9FAFB;
          padding: 16px;
          border-radius: 14px;
        }
        .checkbox-tile {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
        }
        .checkbox-tile input {
          accent-color: #FF6B35;
          width: 16px;
          height: 16px;
        }
        .modal-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>
    </div>
  );
};

export default AdminFoods;

