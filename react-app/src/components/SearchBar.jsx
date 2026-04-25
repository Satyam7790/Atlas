import React, { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({
  placeholder = 'Search…',
  value,
  onChange,
  onSubmit,
  showButton = true,
  dotColor,
  size = 'md',
  autoFocus = false,
}) {
  const [internal, setInternal] = useState('');
  const isControlled = value !== undefined;
  const current      = isControlled ? value : internal;

  function handleChange(e) {
    if (!isControlled) setInternal(e.target.value);
    onChange?.(e.target.value);
  }

  function handleKey(e) {
    if (e.key === 'Enter') onSubmit?.(current);
  }

  function handleClear() {
    if (!isControlled) setInternal('');
    onChange?.('');
  }

  return (
    <div className={`searchbar searchbar--${size}`}>
      {dotColor ? (
        <span className="searchbar__dot" style={{ background: dotColor }} />
      ) : (
        <span className="searchbar__icon">
          <svg viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </span>
      )}

      <input
        className="searchbar__input"
        type="text"
        placeholder={placeholder}
        value={current}
        onChange={handleChange}
        onKeyDown={handleKey}
        autoFocus={autoFocus}
        autoComplete="off"
      />

      {current && (
        <button className="searchbar__clear" onClick={handleClear} aria-label="Clear">
          ✕
        </button>
      )}

      {showButton && (
        <button
          className="searchbar__btn"
          onClick={() => onSubmit?.(current)}
          aria-label="Search"
        >
          <svg viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>
      )}
    </div>
  );
}
