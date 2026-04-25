import React from 'react';
import './StarRating.css';

export default function StarRating({ rating, reviews, size = 'sm' }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <span className={`stars stars--${size}`}>
      <span className="stars__icons">{'★'.repeat(filled)}{'☆'.repeat(5 - filled)}</span>
      <span className="stars__val">{rating}</span>
      {reviews != null && <span className="stars__ct">({reviews})</span>}
    </span>
  );
}
