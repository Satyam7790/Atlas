import React from 'react';
import './Toast.css';

export default function Toast({ message }) {
  return (
    <div className={`toast ${message ? 'toast--visible' : ''}`}>
      {message}
    </div>
  );
}
