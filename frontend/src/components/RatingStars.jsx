import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 4.5, count = null, size = 16 }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={rating >= star ? '#F59E0B' : rating >= star - 0.5 ? '#FBBF24' : '#E5E7EB'}
            stroke={rating >= star ? '#F59E0B' : rating >= star - 0.5 ? '#FBBF24' : '#D1D5DB'}
            strokeWidth={1.5}
          />
        ))}
      </div>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginLeft: '4px' }}>
        {rating.toFixed(1)}
      </span>
      {count !== null && (
        <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;

