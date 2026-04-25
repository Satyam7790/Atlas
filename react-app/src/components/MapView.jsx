import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import './MapView.css';

const TILE_URLS = {
  dark:      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  street:    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  topo:      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
};

const CAT_COLORS = {
  restaurant:'#ff9f0a', cafe:'#ffd60a', hospital:'#0a84ff',
  hotel:'#bf5af2', atm:'#30d158', supermarket:'#ff6b6b',
  pharmacy:'#ff453a', school:'#64d2ff', default:'#0a84ff',
};

export default function MapView({
  mapView, results, selectedPlace, routeCoords,
  myLocation, onMarkerClick,
}) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const tileRef      = useRef(null);
  const markersRef   = useRef([]);
  const routeRef     = useRef(null);
  const myLocRef     = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: [20.5937, 78.9629], zoom: 5,
      zoomControl: true, attributionControl: false,
    });
    mapRef.current.zoomControl.setPosition('topright');
    L.control.attribution({ prefix: false, position: 'bottomright' }).addTo(mapRef.current);

    tileRef.current = L.tileLayer(TILE_URLS.dark, {
      maxZoom: 19, attribution: '© OpenStreetMap',
    }).addTo(mapRef.current);

    const onLayer = (e) => {
      const url = TILE_URLS[e.detail];
      if (!url) return;
      if (tileRef.current) mapRef.current.removeLayer(tileRef.current);
      tileRef.current = L.tileLayer(url, { maxZoom: 19 }).addTo(mapRef.current);
    };
    window.addEventListener('mv:layerChange', onLayer);
    return () => window.removeEventListener('mv:layerChange', onLayer);
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapView?.center) return;
    mapRef.current.setView(mapView.center, mapView.zoom, { animate: true });
  }, [mapView]);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach(m => mapRef.current.removeLayer(m));
    markersRef.current = [];
    if (!results.length) return;

    const color = CAT_COLORS[results[0]?.category] || CAT_COLORS.default;

    results.forEach((place, i) => {
      const isSelected = selectedPlace?.id === place.id;
      const marker = L.marker([place.lat, place.lng], {
        icon: makePinIcon(color, isSelected, i),
      }).addTo(mapRef.current);

      marker.bindPopup(makePopupHTML(place), { maxWidth: 230 });
      marker.on('click', () => onMarkerClick(place));
      marker._mvId = place.id;
      markersRef.current.push(marker);
    });

    const bounds = L.latLngBounds(results.map(p => [p.lat, p.lng]));
    mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true });
  }, [results]);

  useEffect(() => {
    if (!mapRef.current || !results.length) return;
    const color = CAT_COLORS[results[0]?.category] || CAT_COLORS.default;
    markersRef.current.forEach((m, i) => {
      const place = results[i];
      if (!place) return;
      const isSelected = selectedPlace?.id === place.id;
      m.setIcon(makePinIcon(color, isSelected, i));
      if (isSelected) m.openPopup();
    });
  }, [selectedPlace]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (routeRef.current) mapRef.current.removeLayer(routeRef.current);
    if (!routeCoords?.length) return;
    routeRef.current = L.polyline(routeCoords, {
      color: '#0a84ff', weight: 5, opacity: 0.85,
    }).addTo(mapRef.current);
    mapRef.current.fitBounds(routeRef.current.getBounds(), { padding: [60, 60], animate: true });
  }, [routeCoords]);

  useEffect(() => {
    if (!mapRef.current || !myLocation) return;
    if (myLocRef.current) mapRef.current.removeLayer(myLocRef.current);
    const html = `<div style="width:14px;height:14px;background:#0a84ff;border-radius:50%;border:3px solid white;box-shadow:0 0 0 5px rgba(10,132,255,0.25)"></div>`;
    myLocRef.current = L.marker(myLocation, {
      icon: L.divIcon({ className: '', html, iconSize: [14, 14], iconAnchor: [7, 7] }),
      zIndexOffset: 1000,
    }).addTo(mapRef.current)
      .bindPopup(`<div style="padding:10px 12px;font-family:Inter,sans-serif;font-size:13px;font-weight:500;color:#f5f5f7">📍 You are here</div>`);
  }, [myLocation]);

  return <div ref={containerRef} className="mapview" />;
}

function makePinIcon(color, selected, delayIndex) {
  const w = selected ? 32 : 26, h = selected ? 40 : 32;
  const svg = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
      <path d="M${w/2} 2C${w*0.27} 2 2 ${h*0.17} 2 ${h*0.4}
        c0 ${h*0.525} ${w/2-2} ${h*0.575} ${w/2-2} ${h*0.575}
        s${w/2-2}-${h*0.05} ${w/2-2}-${h*0.575}
        C${w-2} ${h*0.17} ${w*0.73} 2 ${w/2} 2z"
        fill="${color}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"
        filter="drop-shadow(0 2px 6px rgba(0,0,0,0.55))"/>
      <circle cx="${w/2}" cy="${h*0.4}" r="${w*0.18}" fill="white" opacity="0.9"/>
    </svg>`;

  return L.divIcon({
    className: '',
    html: `<div style="animation:markerDrop 0.28s cubic-bezier(0.34,1.56,0.64,1) ${delayIndex * 0.04}s both">${svg}</div>`,
    iconSize:   [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor:[0, -h],
  });
}

function makePopupHTML(place) {
  return `
    <div style="padding:12px 14px;font-family:Inter,sans-serif">
      <p style="font-size:13.5px;font-weight:500;color:#f5f5f7;margin-bottom:3px">${place.name}</p>
      <p style="font-size:11.5px;color:#636366;margin-bottom:8px">${place.address || ''}</p>
      <p style="font-size:11px;color:#ffd60a">${'★'.repeat(Math.round(place.rating || 4))} ${place.rating || ''}</p>
    </div>`;
}
