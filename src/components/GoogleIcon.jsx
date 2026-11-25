import React from 'react';

export default function GoogleIcon({
  name,
  className = '',
  size = 20,
  filled = false,
}) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? 'material-symbols-filled' : ''} ${className}`}
      style={{ fontSize: `${size}px` }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
