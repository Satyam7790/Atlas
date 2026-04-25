import React from 'react';
import './FilterChips.css';

const CATEGORIES = [
  { id: 'restaurant',  label: 'Restaurants', emoji: '🍽️' },
  { id: 'cafe',        label: 'Cafes',        emoji: '☕' },
  { id: 'hospital',    label: 'Hospitals',    emoji: '🏥' },
  { id: 'hotel',       label: 'Hotels',       emoji: '🏨' },
  { id: 'atm',         label: 'ATMs',         emoji: '🏧' },
  { id: 'supermarket', label: 'Markets',      emoji: '🛒' },
  { id: 'pharmacy',    label: 'Pharmacy',     emoji: '💊' },
  { id: 'school',      label: 'Schools',      emoji: '🏫' },
];

export { CATEGORIES };

export default function FilterChips({ active, onSelect }) {
  return (
    <div className="filter-chips">
      {CATEGORIES.map(cat => (
        <button
          key={cat.id}
          className={`filter-chips__chip ${active === cat.id ? 'filter-chips__chip--active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          <span className="filter-chips__emoji">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
