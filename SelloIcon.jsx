import React from 'react';

export default function SelloIcon({ size = 64, className = '', glow = false }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, hsl(42 55% 82% / 0.15) 0%, transparent 70%)' }}
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Outer circle */}
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
        {/* Inner circle */}
        <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />

        {/* Crosshair lines */}
        <line x1="50" y1="4" x2="50" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="50" y1="86" x2="50" y2="96" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="4" y1="50" x2="14" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="86" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />

        {/* Diamond / Pyramid shape */}
        <polygon points="50,18 78,50 50,82 22,50" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />

        {/* Inner facets - left darker */}
        <polygon points="50,18 22,50 50,50" fill="currentColor" opacity="0.08" />
        <polygon points="50,50 22,50 50,82" fill="currentColor" opacity="0.04" />

        {/* Inner facets - right lighter */}
        <polygon points="50,18 78,50 50,50" fill="currentColor" opacity="0.15" />
        <polygon points="50,50 78,50 50,82" fill="currentColor" opacity="0.1" />

        {/* Center dot - divine spark */}
        <circle cx="50" cy="50" r="2.5" fill="currentColor" />
        <circle cx="50" cy="50" r="5" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />

        {/* Sacred geometry lines */}
        <line x1="50" y1="18" x2="50" y2="82" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
        <line x1="22" y1="50" x2="78" y2="50" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
      </svg>
    </div>
  );
}