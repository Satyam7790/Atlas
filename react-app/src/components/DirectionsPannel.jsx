import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import Button    from './Button';
import { geocode, getRoute, humaniseStep, formatDist } from '../utils/api';
import './DirectionsPanel.css';

export default function DirectionsPanel({ myLocation, destPreset, onRouteReady, showToast }) {
  const [origin, setOrigin]       = useState('My Location');
  const [dest,   setDest]         = useState(destPreset || '');
  const [loading, setLoading]     = useState(false);
  const [route,   setRoute]       = useState(null);  

  useEffect(() => { if (destPreset) setDest(destPreset); }, [destPreset]);

  async function handleGetRoute() {
    if (!dest.trim()) { showToast('Enter a destination'); return; }

    setLoading(true);
    setRoute(null);

    try {
      let originCoords = myLocation;
      if (!myLocation || origin.toLowerCase() !== 'my location') {
        originCoords = await geocode(origin);
        if (!originCoords) throw new Error(`Could not find: ${origin}`);
      }

      const destCoords = await geocode(dest);
      if (!destCoords) throw new Error(`Could not find: ${dest}`);

      const result = await getRoute(originCoords, destCoords);
      setRoute(result);
      onRouteReady(result.coords);
      showToast(`${result.distKm} km · ${result.durMin} min`);

    } catch (err) {
      showToast(err.message || 'Route not found');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dir">
      <div className="dir__inputs">
        <div className="dir__field">
          <SearchBar
            placeholder="Starting point"
            value={origin}
            onChange={setOrigin}
            onSubmit={handleGetRoute}
            showButton={false}
            dotColor="var(--green)"
            size="sm"
          />
        </div>

        <div className="dir__connector" />

        <div className="dir__field">
          <SearchBar
            placeholder="Where to?"
            value={dest}
            onChange={setDest}
            onSubmit={handleGetRoute}
            showButton={false}
            dotColor="var(--accent)"
            size="sm"
            autoFocus={!destPreset}
          />
        </div>
      </div>

      <div className="dir__go">
        <Button variant="primary" fullWidth disabled={loading} onClick={handleGetRoute}>
          {loading ? 'Calculating…' : 'Get Directions'}
        </Button>
      </div>

      {loading && (
        <div className="dir__state">
          <div className="dir__spinner" />
          <p>Finding the best route…</p>
        </div>
      )}

      {!loading && route && <RouteResult route={route} />}

      {!loading && !route && (
        <div className="dir__state dir__state--empty">
          <span className="dir__empty-icon">🧭</span>
          <p className="dir__empty-title">Turn-by-turn directions</p>
          <p className="dir__empty-sub">Enter an origin and destination above. Uses real road routing via OSRM — no API key needed.</p>
        </div>
      )}
    </div>
  );
}

function RouteResult({ route }) {
  return (
    <div className="dir__result">
      <div className="dir__stats">
        <StatCard value={`${route.distKm} km`}               label="Distance" />
        <StatCard value={`${route.durMin} min`}              label="By car" />
        <StatCard value={`${Math.round(route.durMin * 1.4)} min`} label="Walk est." />
      </div>

      <div className="dir__steps">
        {route.steps.map((step, i) => (
          <div className="dir__step" key={i}>
            <div className="dir__step-num">{i + 1}</div>
            <div>
              <p className="dir__step-text">{humaniseStep(step)}</p>
              <p className="dir__step-dist">{formatDist(step.distance)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="dir__stat">
      <span className="dir__stat-val">{value}</span>
      <span className="dir__stat-label">{label}</span>
    </div>
  );
}
