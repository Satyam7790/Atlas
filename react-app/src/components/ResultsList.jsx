import React from 'react';
import ResultCard from './ResultCard';
import './ResultsList.css';

export default function ResultsList({
  results, selectedId, onSelect,
  loading, emptyIcon = '🗺️', emptyTitle = 'Nothing here yet', emptySub = '',
}) {
  if (loading) {
    return (
      <div className="rlist__state">
        <div className="rlist__spinner" />
        <p className="rlist__state-text">Searching…</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="rlist__state">
        <span className="rlist__state-icon">{emptyIcon}</span>
        <p className="rlist__state-title">{emptyTitle}</p>
        <p className="rlist__state-sub">{emptySub}</p>
      </div>
    );
  }

  return (
    <div className="rlist">
      <div className="rlist__heading">{results.length} result{results.length !== 1 ? 's' : ''}</div>
      {results.map(place => (
        <ResultCard
          key={place.id}
          place={place}
          isActive={place.id === selectedId}
          onClick={onSelect}
        />
      ))}
    </div>
  );
}
