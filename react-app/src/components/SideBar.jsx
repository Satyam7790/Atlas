import React, { useState, useCallback } from 'react';
import FilterChips,   { CATEGORIES } from './FilterChips';
import ResultsList    from './ResultsList';
import DetailPanel    from './DetailPanel';
import DirectionsPanel from './DirectionsPanel';
import { searchPlaces, searchNearby } from '../utils/api';
import './Sidebar.css';

const CAT_EMOJI = {
  restaurant:'🍽️', cafe:'☕', hospital:'🏥', hotel:'🏨',
  atm:'🏧', supermarket:'🛒', pharmacy:'💊', school:'🏫', default:'📍',
};

export default function Sidebar({
  activeMode, onModeChange,
  myLocation, selectedPlace,
  onSelectPlace, onResults, onRouteReady,
  showToast,
}) {
  const [results,   setResults]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [activecat, setActivecat] = useState('restaurant');

  const handleCategorySelect = useCallback(async (cat) => {
    setActivecat(cat);
    setLoading(true);
    onResults([]);

    const center = myLocation || [20.5937, 78.9629];
    try {
      const places = await searchNearby(cat, center[0], center[1]);
      const enriched = places.map(p => ({ ...p, emoji: CAT_EMOJI[cat] || CAT_EMOJI.default }));
      setResults(enriched);
      onResults(enriched);
      if (!enriched.length) showToast(`No ${cat}s found nearby`);
    } catch {
      showToast('Could not fetch nearby places');
    } finally {
      setLoading(false);
    }
  }, [myLocation, onResults, showToast]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    onResults([]);
    onModeChange('explore');

    try {
      const places = await searchPlaces(query);
      const enriched = places.map(p => ({ ...p, emoji: CAT_EMOJI.default }));
      setResults(enriched);
      onResults(enriched);
      if (!enriched.length) showToast(`No results for "${query}"`);
    } catch {
      showToast('Search failed — check your connection');
    } finally {
      setLoading(false);
    }
  }, [onResults, onModeChange, showToast]);

  React.useEffect(() => {
    const handler = (e) => handleSearch(e.detail);
    window.addEventListener('mv:search', handler);
    return () => window.removeEventListener('mv:search', handler);
  }, [handleSearch]);

  return (
    <aside className="sidebar">

      <div className="sidebar__tabs">
        <button
          className={`sidebar__tab ${activeMode === 'explore' ? 'sidebar__tab--active' : ''}`}
          onClick={() => onModeChange('explore')}
        >
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          Explore
        </button>
        <button
          className={`sidebar__tab ${activeMode === 'directions' ? 'sidebar__tab--active' : ''}`}
          onClick={() => onModeChange('directions')}
        >
          <svg viewBox="0 0 24 24"><path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>
          Directions
        </button>
      </div>

      {activeMode === 'explore' && (
        <div className="sidebar__explore">
          <FilterChips active={activecat} onSelect={handleCategorySelect} />

          <ResultsList
            results={results}
            selectedId={selectedPlace?.id}
            onSelect={onSelectPlace}
            loading={loading}
            emptyIcon="🗺️"
            emptyTitle="Select a category above"
            emptySub="Or search any place worldwide using the search bar at the top."
          />

          <DetailPanel
            place={selectedPlace}
            onDirections={() => onModeChange('directions')}
            onClose={() => onSelectPlace(null)}
            showToast={showToast}
          />
        </div>
      )}

      {activeMode === 'directions' && (
        <DirectionsPanel
          myLocation={myLocation}
          destPreset={selectedPlace?.name || ''}
          onRouteReady={onRouteReady}
          showToast={showToast}
        />
      )}
    </aside>
  );
}
