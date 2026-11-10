import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, UtensilsCrossed, AlertTriangle, RefreshCw } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import CategoryBar from '../components/CategoryBar';
import { foodService } from '../services/api';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('popular');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'veg', 'non-veg'

  // Sync state if URL query params change
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    const urlSearch = searchParams.get('search') || '';
    setSelectedCategory(urlCategory);
    setSearchQuery(urlSearch);
  }, [searchParams]);

  // Fetch foods whenever filters change
  const fetchFoods = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (sortBy === 'price-low') {
        params.sort = 'price-low';
      } else if (sortBy === 'price-high') {
        params.sort = 'price-high';
      } else if (sortBy === 'rating') {
        params.sort = 'rating';
      }

      const data = await foodService.getAll(params);
      setFoods(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setApiError(
        'Unable to connect to the backend server. Please make sure the backend is running with "npm run dev:backend" or "npm run dev".'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('popular');
    setDietaryFilter('all');
    setSearchParams({});
  };

  // Filter client-side dietary preference (Veg / Non-Veg)
  const filteredFoods = foods.filter((food) => {
    if (dietaryFilter === 'veg') return food.isVeg === true;
    if (dietaryFilter === 'non-veg') return food.isVeg === false;
    return true;
  });

  return (
    <div className="menu-page">
      <div className="container">
        {/* Menu Hero Header */}
        <div className="menu-header">
          <h1 className="menu-title">Our Gourmet Menu</h1>
          <p className="menu-subtitle">
            From fragrant biryanis to Italian wood-fired crusts, crafted fresh for you.
          </p>
        </div>

        {/* Categories Bar */}
        <CategoryBar
          activeCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* Filter and Search Controls Bar */}
        <div className="menu-controls-bar">
          {/* Real-time search */}
          <div className="menu-search-input-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Filter by dish or ingredient..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => handleSearchChange({ target: { value: '' } })}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="controls-right-group">
            {/* Dietary Toggle Pills */}
            <div className="diet-toggles">
              <button
                type="button"
                className={`diet-btn ${dietaryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`diet-btn veg-btn ${dietaryFilter === 'veg' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('veg')}
              >
                <span className="veg-tag" /> Pure Veg
              </button>
              <button
                type="button"
                className={`diet-btn non-veg-btn ${dietaryFilter === 'non-veg' ? 'active' : ''}`}
                onClick={() => setDietaryFilter('non-veg')}
              >
                <span className="non-veg-tag" /> Non-Veg
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown-box">
              <ArrowUpDown size={16} className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedCategory !== 'All' || searchQuery || dietaryFilter !== 'all') && (
          <div className="active-filters-row">
            <span className="active-label">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="filter-pill">
                Category: {selectedCategory}
                <X size={12} onClick={() => handleCategorySelect('All')} />
              </span>
            )}
            {searchQuery && (
              <span className="filter-pill">
                Search: "{searchQuery}"
                <X size={12} onClick={() => handleSearchChange({ target: { value: '' } })} />
              </span>
            )}
            {dietaryFilter !== 'all' && (
              <span className="filter-pill">
                {dietaryFilter === 'veg' ? 'Pure Veg' : 'Non-Veg'}
                <X size={12} onClick={() => setDietaryFilter('all')} />
              </span>
            )}
            <button type="button" className="clear-all-link" onClick={clearAllFilters}>
              Reset All
            </button>
          </div>
        )}

        {/* API Error Notification */}
        {apiError && (
          <div className="backend-offline-banner">
            <div className="banner-icon">
              <AlertTriangle size={24} color="#EF4444" />
            </div>
            <div className="banner-content">
              <h4>Backend Server Offline</h4>
              <p>{apiError}</p>
              <div className="banner-hint">
                💡 <strong>To start the backend:</strong> In your terminal, run <code>npm run dev:backend</code> or run <code>npm run dev</code> from the root folder.
              </div>
            </div>
            <button type="button" className="retry-btn" onClick={fetchFoods}>
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Food Items Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spin loader-ring" />
            <p>Gathering fresh dishes...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="empty-menu-state">
            <div className="empty-icon-box">
              <UtensilsCrossed size={48} color="#FF6B35" />
            </div>
            <h3>No delicious dishes found</h3>
            <p>We couldn't find any items matching your selected criteria. Try adjusting your filters or search term.</p>
            <button type="button" className="btn btn-primary" onClick={clearAllFilters}>
              View All Dishes
            </button>
          </div>
        ) : (
          <div className="menu-items-grid">
            {filteredFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .backend-offline-banner {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: #FEF2F2;
          border: 1.5px solid #FECACA;
          border-radius: 16px;
          padding: 20px 24px;
          margin-bottom: 30px;
          color: #991B1B;
        }
        .banner-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .banner-content {
          flex: 1;
        }
        .banner-content h4 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #991B1B;
          margin-bottom: 4px;
        }
        .banner-content p {
          font-size: 0.92rem;
          color: #B91C1C;
          margin-bottom: 8px;
        }
        .banner-hint {
          font-size: 0.85rem;
          background: #FFFFFF;
          padding: 8px 14px;
          border-radius: 8px;
          border: 1px solid #FCA5A5;
          color: #374151;
          display: inline-block;
        }
        .banner-hint code {
          background: #F3F4F6;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          color: #FF6B35;
        }
        .retry-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #991B1B;
          color: #FFFFFF;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .retry-btn:hover {
          background: #7F1D1D;
        }
        .menu-page {
          padding: 40px 0 80px;
        }
        .menu-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .menu-title {
          font-size: 2.6rem;
          font-weight: 800;
          color: #222222;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .menu-subtitle {
          font-size: 1.05rem;
          color: #6B7280;
          max-width: 500px;
          margin: 0 auto;
        }
        .menu-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .menu-search-input-box {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          border-radius: 9999px;
          padding: 10px 18px;
          flex: 1;
          min-width: 280px;
          max-width: 420px;
          transition: all 0.2s;
        }
        .menu-search-input-box:focus-within {
          border-color: #FF6B35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
        }
        .menu-search-input-box input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          padding-left: 10px;
          font-size: 0.92rem;
          color: #222222;
        }
        .search-icon {
          color: #9CA3AF;
        }
        .clear-search-btn {
          color: #9CA3AF;
        }
        .controls-right-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .diet-toggles {
          display: flex;
          background: #F3F4F6;
          padding: 4px;
          border-radius: 9999px;
          gap: 4px;
        }
        .diet-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4B5563;
          border-radius: 9999px;
          transition: all 0.2s;
        }
        .diet-btn:hover {
          color: #1F2937;
        }
        .diet-btn.active {
          background: #FFFFFF;
          color: #222222;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        .sort-dropdown-box {
          display: flex;
          align-items: center;
          position: relative;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          border-radius: 9999px;
          padding: 0 16px;
          height: 44px;
        }
        .sort-icon {
          color: #6B7280;
          margin-right: 8px;
        }
        .sort-select {
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.88rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
        }
        .active-filters-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .active-label {
          font-size: 0.85rem;
          color: #6B7280;
          font-weight: 600;
        }
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFF2EC;
          color: #FF6B35;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }
        .clear-all-link {
          font-size: 0.85rem;
          color: #EF4444;
          font-weight: 600;
          text-decoration: underline;
        }
        .menu-items-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .loading-state {
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
        .empty-menu-state {
          text-align: center;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 60px 24px;
          margin-top: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .empty-icon-box {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #FFF2EC;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .empty-menu-state h3 {
          font-size: 1.4rem;
          margin-bottom: 8px;
        }
        .empty-menu-state p {
          color: #6B7280;
          max-width: 420px;
          margin: 0 auto 24px;
          font-size: 0.95rem;
        }
        @media (max-width: 1024px) {
          .menu-items-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .menu-items-grid { grid-template-columns: 1fr; }
          .menu-controls-bar { flex-direction: column; align-items: stretch; }
          .menu-search-input-box { max-width: 100%; }
          .controls-right-group { justify-content: space-between; }
        }
      `}</style>
    </div>
  );
};

export default Menu;

