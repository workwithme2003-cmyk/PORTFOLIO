/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ScanlineOverlayProps {
  id?: string;
  className?: string;
  glowColor?: string;
}

export default function ScanlineOverlay({ 
  id = 'crt-scanline-overlay', 
  className = '', 
  glowColor = 'rgba(0, 255, 102, 0.1)' 
}: ScanlineOverlayProps) {
  return (
    <div 
      id={id}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-40 ${className}`}
    >
      {/* Curved CRT screen reflex gradient and glare */}
      <div 
        id="crt-glare"
        className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 mix-blend-multiply"
      />
      
      {/* Glare reflection highlight across the curved monitor glass */}
      <div 
        id="crt-reflection"
        className="absolute inset-0 bg-linear-to-tr from-transparent via-white/3 to-transparent pointer-events-none"
      />

      {/* Repeating horizontal scanlines */}
      <div 
        id="crt-scanlines"
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Phosphor glow shadow / Vignette overlay */}
      <div 
        id="crt-screen-shadow"
        className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] pointer-events-none"
        style={{
          boxShadow: `inset 0 0 100px rgba(0, 0, 0, 0.85), 0 0 20px ${glowColor}`,
        }}
      />

      {/* Screen flicker effect */}
      <div 
        id="crt-flicker-overlay"
        className="absolute inset-0 bg-[#00ff66]/[0.015] animate-[crt-flicker_0.15s_infinite] mix-blend-screen pointer-events-none"
      />

      {/* Custom styles injected for animations */}
      <style>{`
        @keyframes crt-flicker {
          0% { opacity: 0.97; }
          50% { opacity: 1.0; }
          100% { opacity: 0.98; }
        }
      `}</style>
    </div>
  );
}
