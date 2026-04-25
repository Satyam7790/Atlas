import React from 'react';
import './Badge.css';

// Badge is a small colored label.
// It's used to show things like "Open now" or "Closed".
//
// Props:
//   variant  - 'open' (green), 'closed' (red), 'info' (blue), or 'neutral' (grey)
//   children - the text inside the badge
export default function Badge({ variant, children }) {
  // Default to neutral if no variant is given
  if (variant === undefined) variant = 'neutral';

  return (
    <span className={'badge badge--' + variant}>
      {children}
    </span>
  );
}
