import React from 'react';

const TrashIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="shadow-trash" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2"/>
      </filter>
    </defs>
    <g filter="url(#shadow-trash)">
      {/* Bin Body */}
      <path d="M14 16H50L46 58H18L14 16Z" fill="#F9FAFB" fillOpacity="0.9"/>
      <path d="M15 19H49L45.5 55H18.5L15 19Z" stroke="#D1D5DB" strokeWidth="1"/>

      {/* Recycle Symbol */}
      <g transform="translate(32, 38) scale(0.6)">
        <path d="M8 -14L16 -8L8 0" stroke="#60A5FA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M-13.86 -4C-15.95 0 -15.12 5 -12 8C-8.88 11 -4 11.2 -1.41 8.79M13.86 4C15.95 0 15.12 -5 12 -8C8.88 -11 4 -11.2 1.41 -8.79" stroke="#60A5FA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M0 16L-8 8L0 0" stroke="#60A5FA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </g>
  </svg>
);

export default TrashIcon;