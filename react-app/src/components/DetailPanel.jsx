import React from 'react';
import Button from './Button';
import StarRating from './StarRating';
import Badge from './Badge';
import './DetailPanel.css';

// SVG path data for the icons used in the action buttons
var ICON_DIRECTIONS = 'M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z';
var ICON_SHARE = 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.48-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z';
var ICON_SAVE = 'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z';

// DetailPanel shows detailed information about a selected place.
// It slides up from the bottom of the sidebar when you click a result.
//
// Props:
//   place        - place object to show details for, or null (hides the panel)
//   onDirections - called when user clicks the Directions button
//   onClose      - called when user clicks the X button
//   showToast    - function to show a popup message
export default function DetailPanel({ place, onDirections, onClose, showToast }) {
  // If no place is selected, don't render anything
  if (!place) {
    return null;
  }

  // Share the place as an OpenStreetMap link
  function handleShare() {
    var mapUrl = 'https://www.openstreetmap.org/?mlat=' + place.lat + '&mlon=' + place.lng + '&zoom=17';

    // Use the Web Share API if supported (mobile-friendly)
    if (navigator.share) {
      navigator.share({ title: place.name, url: mapUrl });
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(mapUrl);
      }
      showToast('Link copied ✓');
    }
  }

  return (
    <div className="detail">
      {/* Top section: place name, rating, and close button */}
      <div className="detail__header">
        <div className="detail__info">
          <h2 className="detail__name">{place.name}</h2>

          <div className="detail__meta">
            <StarRating rating={place.rating} reviews={place.reviews} size="md" />
            {/* Show "Open now" or "Closed" badge */}
            <Badge variant={place.open ? 'open' : 'closed'}>
              {place.open ? 'Open now' : 'Closed'}
            </Badge>
          </div>
        </div>

        {/* Close button - goes back to the results list */}
        <button className="detail__close" onClick={onClose}>✕</button>
      </div>

      {/* Action buttons */}
      <div className="detail__actions">
        <Button variant="primary" icon={ICON_DIRECTIONS} onClick={onDirections} size="sm">
          Directions
        </Button>
        <Button variant="secondary" icon={ICON_SHARE} onClick={handleShare} size="sm">
          Share
        </Button>
        <Button variant="secondary" icon={ICON_SAVE} onClick={() => showToast('Saved ✓')} size="sm">
          Save
        </Button>
      </div>

      {/* Info rows - only shown if the data exists */}
      <div className="detail__rows">
        {place.address       && <InfoRow icon="📍" text={place.address} />}
        {place.phone         && <InfoRow icon="📞" text={place.phone} />}
        {place.website       && (
          <InfoRow
            icon="🌐"
            href={place.website}
            text={place.website.replace(/^https?:\/\//, '')}
          />
        )}
        {place.opening_hours && <InfoRow icon="🕐" text={place.opening_hours} />}
        {place.dist != null  && <InfoRow icon="📏" text={formatDist(place.dist) + ' away'} />}
      </div>
    </div>
  );
}

// A single row of info (e.g. address, phone number, website)
function InfoRow({ icon, text, href }) {
  return (
    <div className="detail__row">
      <span className="detail__row-icon">{icon}</span>
      {/* If a link was given, make it clickable; otherwise just show text */}
      {href ? (
        <a className="detail__row-link" href={href} target="_blank" rel="noreferrer">
          {text}
        </a>
      ) : (
        <span className="detail__row-text">{text}</span>
      )}
    </div>
  );
}

// Format metres to a readable distance string
function formatDist(metres) {
  if (metres >= 1000) {
    return (metres / 1000).toFixed(1) + ' km';
  }
  return Math.round(metres) + ' m';
}
