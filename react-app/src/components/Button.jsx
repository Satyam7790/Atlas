import React from 'react';
import './Button.css';

// Button is a reusable button component used throughout the app.
// It supports different visual styles and an optional SVG icon.
//
// Props:
//   variant   - 'primary' (filled blue), 'secondary' (outlined), or 'ghost' (transparent)
//   size      - 'sm' or 'md'
//   fullWidth - whether to stretch to full container width
//   icon      - SVG path string to show an icon inside the button
//   disabled  - whether the button is clickable
//   onClick   - function to call when clicked
//   children  - the button label text
export default function Button({
  variant,
  size,
  fullWidth,
  icon,
  disabled,
  onClick,
  children,
}) {
  // Default values for optional props
  if (variant  === undefined) variant  = 'secondary';
  if (size     === undefined) size     = 'md';
  if (fullWidth === undefined) fullWidth = false;
  if (disabled === undefined) disabled = false;

  // Build the class string by combining multiple classes
  var classes = 'btn btn--' + variant + ' btn--' + size;
  if (fullWidth) {
    classes = classes + ' btn--full';
  }

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Optional icon displayed to the left of the label */}
      {icon && (
        <svg className="btn__icon" viewBox="0 0 24 24">
          <path d={icon} />
        </svg>
      )}
      {children}
    </button>
  );
}
