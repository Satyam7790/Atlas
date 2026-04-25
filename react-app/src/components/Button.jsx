import React from 'react';
import './Button.css';

export default function Button({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  icon,
  disabled = false,
  onClick,
  children,
}) {
  return (
    <button
      className={[
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? 'btn--full' : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <svg className="btn__icon" viewBox="0 0 24 24">
          <path d={icon} />
        </svg>
      )}
      {children}
    </button>
  );
}
