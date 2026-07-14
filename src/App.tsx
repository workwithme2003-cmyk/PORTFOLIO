/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import CRTComputer from './components/CRTComputer';
import TerminalPortfolio from './components/TerminalPortfolio';
import TeardownOutro from './components/TeardownOutro';
import { retroAudio } from './utils/audio';

export default function App() {
  const [isZoomComplete, setIsZoomComplete] = useState<boolean>(false);

  // Initialize a subtle body background color and global font smoothing
  useEffect(() => {
    document.body.className = 'bg-[#f0ede6] transition-colors duration-700 overflow-x-hidden antialiased';
    
    // Automatically change body background color based on active section
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollY / docHeight;

      if (scrollPercent < 0.25) {
        document.body.className = 'bg-[#f0ede6] transition-colors duration-700 overflow-x-hidden antialiased';
      } else if (scrollPercent >= 0.25 && scrollPercent < 0.75) {
        document.body.className = 'bg-[#e9e4d9] transition-colors duration-700 overflow-x-hidden antialiased';
      } else {
        document.body.className = 'bg-[#f5f5f4] transition-colors duration-700 overflow-x-hidden antialiased';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="retro-portfolio-mainframe" className="relative w-full min-h-screen">
      {/* 
        STAGE 1: Retro Computer Zooming-In Bootup Sequence. 
        As the user scrolls, this sticky viewport zooms into the screen.
      */}
      <CRTComputer onZoomComplete={setIsZoomComplete} />

      {/* 
        STAGE 2: Interactive Terminal Portfolio.
        This represents the main resume section: B.Tech AI & ML education, Skills, and Projects.
        It has a fully interactive terminal prompt!
      */}
      <TerminalPortfolio id="main-terminal-portfolio-view" />

      {/* 
        STAGE 3: Technical Teardown Exploded Outro.
        This provides the final floating dismantling components scroll-outro.
      */}
      <TeardownOutro />
    </div>
  );
}
