import React from 'react';

const MonitorIcon: React.FC<{ className?: string, size?: number }> = ({ className, size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
        <linearGradient id="screen-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <filter id="shadow-monitor" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2"/>
        </filter>
    </defs>
    <g filter="url(#shadow-monitor)">
        {/* Stand */}
        <path d="M24 58H40" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
        <rect x="30" y="44" width="4" height="14" fill="#D1D5DB" />
        {/* Monitor Body */}
        <rect x="4" y="6" width="56" height="38" rx="6" fill="#4B5563" />
        {/* Screen */}
        <rect x="8" y="10" width="48" height="30" rx="2" fill="url(#screen-gradient)" />
    </g>
  </svg>
);

export default MonitorIcon;