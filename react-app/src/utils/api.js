// utils/api.js
// This file handles all the network requests to external APIs.
// Components should call these functions instead of using fetch() directly.
// APIs used:
//   - Nominatim (OpenStreetMap) for searching places by name
//   - Overpass API for finding nearby places by category
//   - OSRM for calculating driving routes

// Base URLs for each API
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

// We always send this header so results come back in English
const REQUEST_HEADERS = { 'Accept-Language': 'en' };

// Search for places by a text query (e.g. "Eiffel Tower" or "Mumbai")
export async function searchPlaces(query) {
  const url = NOMINATIM_URL + '/search?q=' + encodeURIComponent(query) + '&format=json&limit=10&addressdetails=1';
  const response = await fetch(url, { headers: REQUEST_HEADERS });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();

  // Convert raw API data into a clean format we use everywhere in the app
  const places = data.map(function(item) {
    return {
      id: String(item.place_id),
      name: item.display_name.split(',')[0].trim(),  // just the first part of the name
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      address: item.display_name.split(',').slice(1, 3).join(', ').trim(),
      category: item.class,
      type: item.type,
      rating: randomFloat(3.2, 5.0),  // fake rating since API doesn't have one
      reviews: randomInt(10, 600),
      open: Math.random() > 0.35,     // randomly decide if open (fake data)
    };
  });

  return places;
}

// Find places near a location by category (e.g. nearby restaurants)
export async function searchNearby(category, lat, lng, radius) {
  // Default search radius is 4km
  if (radius === undefined) {
    radius = 4000;
  }

  // This is the Overpass query language - it finds nodes/ways with a matching tag
  var query =
    '[out:json][timeout:20];' +
    '(node["amenity"="' + category + '"](around:' + radius + ',' + lat + ',' + lng + ');' +
    ' way["amenity"="' + category + '"](around:' + radius + ',' + lat + ',' + lng + '););' +
    'out body center 16;';

  const response = await fetch(OVERPASS_URL, { method: 'POST', body: query });

  if (!response.ok) {
    throw new Error('Overpass request failed');
  }

  const data = await response.json();

  // Build place objects from the Overpass results
  var places = [];

  for (var i = 0; i < data.elements.length; i++) {
    var el = data.elements[i];

    // Get lat/lng - nodes have it directly, ways have it in a "center" object
    var placeLat = el.lat;
    var placeLng = el.lon;

    if (placeLat === undefined && el.center) {
      placeLat = el.center.lat;
      placeLng = el.center.lon;
    }

    // Skip elements with no coordinates
    if (!placeLat || !placeLng) {
      continue;
    }

    var tags = el.tags || {};

    var place = {
      id: String(el.id),
      name: tags.name || capitalise(category),
      lat: placeLat,
      lng: placeLng,
      address: buildAddress(tags),
      phone: tags.phone || tags['contact:phone'] || null,
      website: tags.website || null,
      opening_hours: tags.opening_hours || null,
      category: category,
      rating: randomFloat(3.0, 5.0),
      reviews: randomInt(8, 500),
      open: Math.random() > 0.35,
      dist: haversine(lat, lng, placeLat, placeLng),  // distance from search center
    };

    places.push(place);
  }

  // Sort by distance so closer places show first, and limit to 14 results
  places.sort(function(a, b) { return a.dist - b.dist; });
  places = places.slice(0, 14);

  return places;
}

// Turn a text query into coordinates - used by the directions panel
export async function geocode(query) {
  const url = NOMINATIM_URL + '/search?q=' + encodeURIComponent(query) + '&format=json&limit=1';
  const response = await fetch(url, { headers: REQUEST_HEADERS });
  const data = await response.json();

  // If nothing found, return null
  if (!data[0]) {
    return null;
  }

  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

// Get driving directions between two coordinate pairs
export async function getRoute(originCoords, destCoords) {
  // OSRM expects coordinates as lng,lat (note: reversed from our [lat,lng] format!)
  var url =
    OSRM_URL + '/' +
    originCoords[1] + ',' + originCoords[0] + ';' +
    destCoords[1] + ',' + destCoords[0] +
    '?overview=full&geometries=geojson&steps=true';

  const response = await fetch(url);
  const data = await response.json();

  if (data.code !== 'Ok') {
    throw new Error('No route found between these points');
  }

  var route = data.routes[0];

  // Flip coordinates back from [lng,lat] to [lat,lng] for Leaflet
  var coords = route.geometry.coordinates.map(function(c) {
    return [c[1], c[0]];
  });

  return {
    distKm: (route.distance / 1000).toFixed(1),
    durMin: Math.round(route.duration / 60),
    coords: coords,
    steps: route.legs[0].steps.slice(0, 15),  // only show first 15 steps
  };
}

// ── Helper functions ─────────────────────────────────────────────────────────

// Build a human-readable address string from OSM tags
function buildAddress(tags) {
  var parts = [];

  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:city']) parts.push(tags['addr:city']);

  if (parts.length === 0) {
    return 'Address not listed';
  }

  return parts.join(', ');
}

// Calculate the straight-line distance in metres between two coordinates
export function haversine(lat1, lng1, lat2, lng2) {
  var R = 6371000;  // Earth's radius in metres
  var toRad = Math.PI / 180;

  var dLat = (lat2 - lat1) * toRad;
  var dLng = (lng2 - lng1) * toRad;

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Format a distance in metres to a nice string like "1.2 km" or "350 m"
export function formatDist(metres) {
  if (metres == null) return '';

  if (metres >= 1000) {
    return (metres / 1000).toFixed(1) + ' km';
  } else {
    return Math.round(metres) + ' m';
  }
}

// Capitalize the first letter of a string
export function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Turn a raw OSRM step into a human-readable instruction
export function humaniseStep(step) {
  var type = step.maneuver ? step.maneuver.type : '';
  var modifier = step.maneuver ? step.maneuver.modifier : '';
  var road = step.name || 'the road';

  if (type === 'depart') return 'Start on ' + road;
  if (type === 'arrive') return 'Arrive at your destination';
  if (type === 'turn') return 'Turn ' + modifier.replace('-', ' ') + ' onto ' + road;
  if (type === 'continue') return 'Continue on ' + road;
  if (type === 'merge') return 'Merge onto ' + road;
  if (type === 'roundabout') return 'At the roundabout, exit onto ' + road;
  if (type === 'fork') return 'Keep ' + (modifier || 'straight') + ' onto ' + road;

  // Fallback for anything else
  if (road) return 'Head along ' + road;
  return 'Continue straight';
}

// Random float between min and max, rounded to 1 decimal place
function randomFloat(min, max) {
  var value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(1));
}

// Random integer between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
