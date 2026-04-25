import React, { useState } from 'react';
import SearchBar from './SearchBar';
import './TopBar.css';

const LAYERS = [
  { id: 'dark',      label: 'Dark',        emoji: '🌙' },
  { id: 'street',    label: 'Street',      emoji: '🗺️' },
  { id: 'satellite', label: 'Satellite',   emoji: '🛰️' },
  { id: 'topo',      label: 'Topographic', emoji: '🏔️' },
];

export default function TopBar({ onSearch, onLocate, locating, showToast }) {
  const [layerOpen, setLayerOpen]     = useState(false);
  const [activeLayer, setActiveLayer] = useState('dark');

  function handleLayerSelect(id) {
    setActiveLayer(id);
    setLayerOpen(false);
    window.dispatchEvent(new CustomEvent('mv:layerChange', { detail: id }));
    showToast(`${LAYERS.find(l => l.id === id)?.label} map`);
  }

  return (
    <header className="topbar">
      <a href="/" className="topbar__logo">
        <div className="topbar__logo-mark">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <span className="topbar__logo-name">MapVista</span>
      </a>

      <div className="topbar__search">
        <SearchBar
          placeholder="Search places, cities, addresses…"
          onSubmit={onSearch}
          size="md"
        />
      </div>

      <div className="topbar__actions">
        <button
          className={`topbar__icon-btn ${locating ? 'topbar__icon-btn--active' : ''}`}
          onClick={onLocate}
          title="My location"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06z" />
          </svg>
        </button>

        <div className="topbar__layer-wrap">
          <button
            className="topbar__icon-btn"
            onClick={() => setLayerOpen(v => !v)}
            title="Map style"
          >
            <svg viewBox="0 0 24 24">
              <path d="M11.99 2L2 7l10 5 10-5-10.01-5zM2 17l10 5 10-5-10-5-10 5zm0-5l10 5 10-5-10-5-10 5z" />
            </svg>
          </button>

          {layerOpen && (
            <div className="topbar__layer-menu">
              <p className="topbar__layer-title">Map Style</p>
              {LAYERS.map(l => (
                <button
                  key={l.id}
                  className={`topbar__layer-opt ${activeLayer === l.id ? 'topbar__layer-opt--active' : ''}`}
                  onClick={() => handleLayerSelect(l.id)}
                >
                  {l.emoji} {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
