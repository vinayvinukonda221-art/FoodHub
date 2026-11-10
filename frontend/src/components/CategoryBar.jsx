import React from 'react';
import { Flame, Pizza, Beef, Utensils, Cake, Coffee, Sparkles } from 'lucide-react';

const categoryMeta = [
  { name: 'All', icon: Sparkles },
  { name: 'Biryani', icon: Flame },
  { name: 'Pizza', icon: Pizza },
  { name: 'Burgers', icon: Beef },
  { name: 'Indian Meals', icon: Utensils },
  { name: 'Desserts', icon: Cake },
  { name: 'Beverages', icon: Coffee }
];

const CategoryBar = ({ activeCategory = 'All', onSelectCategory }) => {
  return (
    <div className="category-bar-wrapper">
      <div className="category-scroll-container">
        {categoryMeta.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;

          return (
            <button
              key={cat.name}
              type="button"
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <div className="chip-icon-box">
                <Icon size={18} />
              </div>
              <span className="chip-name">{cat.name}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .category-bar-wrapper {
          width: 100%;
          margin: 24px 0;
          overflow: hidden;
        }
        .category-scroll-container {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow-x: auto;
          padding: 8px 4px;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .category-scroll-container::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }
        .category-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: #FFFFFF;
          border: 1.5px solid #E5E7EB;
          border-radius: 9999px;
          color: #4B5563;
          font-weight: 600;
          font-size: 0.92rem;
          white-space: nowrap;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        .category-chip:hover {
          border-color: #FF6B35;
          color: #FF6B35;
          background: #FFF2EC;
          transform: translateY(-2px);
        }
        .category-chip.active {
          background: #FF6B35;
          border-color: #FF6B35;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(255, 107, 53, 0.35);
          transform: translateY(-2px);
        }
        .chip-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default CategoryBar;

