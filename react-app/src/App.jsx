import React, { useState, useCallback } from 'react';
import TopBar          from './components/TopBar';
import Sidebar         from './components/Sidebar';
import MapView         from './components/MapView';
import Toast           from './components/Toast';
import useToast        from './hooks/useToast';
import useGeolocation  from './hooks/useGeolocation';
import './styles/global.css';
import './App.css';

export default function App() {
  const { toast, showToast }       = useToast();
  const { myLocation, locating, locate } = useGeolocation();

  const [results,       setResults]       = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [routeCoords,   setRouteCoords]   = useState(null);
  const [activeMode,    setActiveMode]    = useState('explore');
  const [mapView,       setMapView]       = useState({ center: [20.5937, 78.9629], zoom: 5 });

  const handleSelectPlace = useCallback((place) => {
    setSelectedPlace(place);
    if (place) setMapView({ center: [place.lat, place.lng], zoom: 16 });
  }, []);

  const handleResults = useCallback((newResults) => {
    setResults(newResults);
    setSelectedPlace(null);
    setRouteCoords(null);
  }, []);

  const handleLocate = useCallback(() => {
    showToast('Getting your location…');
    locate(
      (coords) => { setMapView({ center: coords, zoom: 14 }); showToast('Location found!'); },
      (err)    => showToast(err)
    );
  }, [locate, showToast]);

  return (
    <div className="app-shell">
      <TopBar
        onSearch={() => setActiveMode('explore')}
        onLocate={handleLocate}
        locating={locating}
        showToast={showToast}
      />

      <div className="app-body">
        <Sidebar
          activeMode={activeMode}
          onModeChange={setActiveMode}
          myLocation={myLocation}
          selectedPlace={selectedPlace}
          onSelectPlace={handleSelectPlace}
          onResults={handleResults}
          onRouteReady={setRouteCoords}
          showToast={showToast}
        />

        <MapView
          mapView={mapView}
          results={results}
          selectedPlace={selectedPlace}
          routeCoords={routeCoords}
          myLocation={myLocation}
          onMarkerClick={handleSelectPlace}
          onMapMove={(center) => setMapView(v => ({ ...v, center }))}
          showToast={showToast}
        />
      </div>

      <Toast message={toast} />
    </div>
  );
}
