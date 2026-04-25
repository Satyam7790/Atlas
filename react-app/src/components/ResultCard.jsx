import React from 'react';
import StarRating from './StarRating';
import Badge     from './Badge';
import { formatDist } from '../utils/api';
import './ResultCard.css';

export default function ResultCard({ place, isActive, onClick }) {
  return (
    <div
      className={`result-card ${isActive ? 'result-card--active' : ''}`}
      onClick={() => onClick(place)}
    >
      <div className="result-card__icon">{place.emoji || '📍'}</div>

      <div className="result-card__body">
        <p className="result-card__name">{place.name}</p>
        <div className="result-card__meta">
          <StarRating rating={place.rating} reviews={place.reviews} size="sm" />
          <Badge variant={place.open ? 'open' : 'closed'}>
            {place.open ? 'Open' : 'Closed'}
          </Badge>
        </div>
        <p className="result-card__addr">{place.address}</p>
      </div>

      {place.dist != null && (
        <span className="result-card__dist">{formatDist(place.dist)}</span>
      )}
    </div>
  );
}
