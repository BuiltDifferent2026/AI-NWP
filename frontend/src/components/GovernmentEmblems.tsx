import React from 'react';

// National Emblem of India (Ashoka Lion Capital Silhouette)
export const IndiaEmblemSVG: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 120" fill="currentColor" style={{ flexShrink: 0 }}>
    {/* Ashoka Lion Capital Graphic Representation */}
    <g fill="#1F2933">
      {/* Central Lion */}
      <path d="M 40,15 C 40,8 45,2 50,2 C 55,2 60,8 60,15 C 60,20 57,25 50,25 C 43,25 40,20 40,15 Z" />
      <path d="M 35,22 C 32,15 35,8 42,5 C 38,10 38,18 42,22 Z" />
      <path d="M 65,22 C 68,15 65,8 58,5 C 62,10 62,18 58,22 Z" />
      {/* Manes & Shoulders */}
      <path d="M 42,25 L 58,25 L 62,45 L 38,45 Z" />
      <path d="M 30,30 C 25,25 22,35 28,45 L 38,45 L 34,32 Z" />
      <path d="M 70,30 C 75,25 78,35 72,45 L 62,45 L 66,32 Z" />
      {/* Body & Paws */}
      <path d="M 36,45 L 64,45 L 68,75 L 32,75 Z" />
      <path d="M 28,50 L 36,75 L 24,75 Z" />
      <path d="M 72,50 L 64,75 L 76,75 Z" />
      {/* Abacus Base with Ashoka Chakra */}
      <rect x="15" y="77" width="70" height="12" rx="2" fill="#0B3D62" />
      <circle cx="50" cy="83" r="5" fill="#FFFFFF" />
      <circle cx="50" cy="83" r="2" fill="#0B3D62" />
      {/* Plinth */}
      <path d="M 10,91 L 90,91 L 95,99 L 5,99 Z" fill="#475569" />
      <rect x="18" y="101" width="64" height="4" rx="1" fill="#64748B" />
      {/* Motto Satyameva Jayate Indicator */}
      <text x="50" y="114" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#0B3D62">
        सत्यमेव जयते
      </text>
    </g>
  </svg>
);

// NCMRWF Official Logo (Stylized Sun, Mountains, Monsoon Waves, Radar Rays)
export const NCMRWFLogoSVG: React.FC<{ size?: number }> = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#0B3D62" strokeWidth="2.5" />
    {/* Sun background */}
    <circle cx="50" cy="38" r="20" fill="#F59E0B" />
    <path d="M 50,12 L 50,16 M 50,60 L 50,64 M 24,38 L 28,38 M 72,38 L 76,38" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    {/* Mountain peaks */}
    <polygon points="20,62 38,40 54,62" fill="#0B3D62" />
    <polygon points="45,62 62,35 80,62" fill="#165384" />
    {/* White snow caps */}
    <polygon points="38,40 33,48 43,48" fill="#FFFFFF" />
    <polygon points="62,35 56,45 68,45" fill="#FFFFFF" />
    {/* Ocean/Atmospheric Monsoon Waves */}
    <path d="M 12,68 C 22,63 32,73 42,68 C 52,63 62,73 72,68 C 82,63 88,68 88,68" stroke="#0284C7" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 14,76 C 24,71 34,81 44,76 C 54,71 64,81 74,76 C 84,71 86,76 86,76" stroke="#0369A1" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M 18,84 C 26,80 36,88 46,84 C 56,80 66,88 76,84 C 82,80 84,84 84,84" stroke="#075985" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);
