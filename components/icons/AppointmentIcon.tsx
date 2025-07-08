import React from 'react';

const AppointmentIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="shadow-appointment" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2"/>
      </filter>
    </defs>
    <g filter="url(#shadow-appointment)">
      {/* Main Body */}
      <rect x="6" y="12" width="52" height="46" rx="8" fill="#FFFFFF"/>
      <rect x="6" y="12" width="52" height="14" rx="8" ry="8" fill="#F87171"/>
      
      {/* Rings */}
      <rect x="16" y="6" width="8" height="12" rx="4" fill="#E5E7EB"/>
      <rect x="40" y="6" width="8" height="12" rx="4" fill="#E5E7EB"/>
      <rect x="16" y="6" width="8" height="8" rx="4" fill="#D1D5DB"/>
      <rect x="40" y="6" width="8" height="8" rx="4" fill="#D1D5DB"/>
      
      {/* Calendar Grid */}
      <rect x="16" y="34" width="8" height="6" rx="2" fill="#DBEAFE"/>
      <rect x="28" y="34" width="8" height="6" rx="2" fill="#DBEAFE"/>
      <rect x="40" y="34" width="8" height="6" rx="2" fill="#DBEAFE"/>
      <rect x="16" y="44" width="8" height="6" rx="2" fill="#DBEAFE"/>
      
      {/* Add Button */}
      <circle cx="45" cy="49" r="13" fill="#60A5FA"/>
      <path d="M45 42V56" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <path d="M38 49H52" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </svg>
);

export default AppointmentIcon;