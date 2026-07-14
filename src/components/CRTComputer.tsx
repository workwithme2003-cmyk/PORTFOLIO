/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import ScanlineOverlay from './ScanlineOverlay';
import { bootSequence } from '../data';
import { retroAudio } from '../utils/audio';

interface CRTComputerProps {
  onZoomComplete: (complete: boolean) => void;
}

export default function CRTComputer({ onZoomComplete }: CRTComputerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [bootProgress, setBootProgress] = useState<number>(0);
  const [typedCommand, setTypedCommand] = useState<string>('');
  const [powerOn, setPowerOn] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  
  // Track scroll position of the zoom container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform values for zooming the computer monitor
  const scale = useTransform(scrollYProgress, [0, 0.75, 1], [1, 3.5, 4.5]);
  const yTranslate = useTransform(scrollYProgress, [0, 0.75, 1], ["0%", "15%", "15%"]);
  
  // Opacities for the floating desktop accessories (keyboard, mouse)
  const accessoriesOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const accessoriesY = useTransform(scrollYProgress, [0, 0.25], [0, 50]);

  // Audio trigger status
  const audioTriggered = useRef({ power: false, seek: false, end: false });

  // Monitor scroll progress to trigger state changes & sounds
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      // 1. Power On (20% scroll)
      if (latest >= 0.15) {
        setPowerOn(true);
        if (!audioTriggered.current.power && !isMuted) {
          retroAudio.playBeep(440, 0.15);
          setTimeout(() => retroAudio.playBeep(880, 0.25), 150);
          audioTriggered.current.power = true;
        }
      } else {
        setPowerOn(false);
        setBootProgress(0);
        setTypedCommand('');
        audioTriggered.current.power = false;
        audioTriggered.current.seek = false;
      }

      // 2. Typing boot command (20% to 35% scroll)
      if (latest >= 0.18 && latest < 0.35) {
        const fullCommand = 'C:\\> run akhil_portfolio.bat';
        const ratio = (latest - 0.18) / (0.35 - 0.18);
        const charsToShow = Math.floor(fullCommand.length * ratio);
        setTypedCommand(fullCommand.substring(0, charsToShow));
        if (!isMuted && charsToShow > typedCommand.length) {
          retroAudio.playKey();
        }
      } else if (latest >= 0.35) {
        setTypedCommand('C:\\> run akhil_portfolio.bat');
      }

      // 3. Floppy drive seeking sound (35% scroll)
      if (latest >= 0.35 && latest < 0.45) {
        if (!audioTriggered.current.seek && !isMuted) {
          retroAudio.playFloppySeek();
          audioTriggered.current.seek = true;
        }
      }

      // 4. Bios Boot logs progress (38% to 0.72% scroll)
      if (latest >= 0.38 && latest < 0.72) {
        const ratio = (latest - 0.38) / (0.72 - 0.38);
        const steps = Math.floor(bootSequence.length * ratio);
        setBootProgress(Math.min(steps, bootSequence.length));
      } else if (latest >= 0.72) {
        setBootProgress(bootSequence.length);
      } else {
        setBootProgress(0);
      }

      // 5. Notify parent component when full zoom/boot completes
      if (latest >= 0.95) {
        onZoomComplete(true);
        if (!audioTriggered.current.end && !isMuted) {
          retroAudio.playBeep(600, 0.4);
          audioTriggered.current.end = true;
        }
      } else {
        onZoomComplete(false);
        audioTriggered.current.end = false;
      }
    });
  }, [scrollYProgress, onZoomComplete, isMuted, typedCommand.length]);

  // Audio Toggle Button handler
  const handleToggleAudio = () => {
    const nextState = retroAudio.toggle();
    setIsMuted(!nextState);
  };

  // Matrix Code Rain Canvas (grows in intensity as we scroll to the end)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 400);
    let height = (canvas.height = canvas.offsetHeight || 300);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Matrix characters
    const katakana = 'アァカサタナハマヤャラワガザダバパイィウゥエェオォキシチニヒミリヰギジヂビピウゥクスツヌフムユュルヲグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=<>_!@#%';
    const alphabet = katakana.split('');

    const fontSize = 10;
    const columns = Math.floor(width / fontSize);

    // Drops array
    const rainDrops: number[] = Array(columns).fill(1);

    // Zooming matrix starfield array for the matrix transition (scroll progress > 0.7)
    interface MatrixStar {
      x: number;
      y: number;
      z: number;
      char: string;
      color: string;
    }
    const stars: MatrixStar[] = Array.from({ length: 150 }, () => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      z: Math.random() * 800 + 200,
      char: alphabet[Math.floor(Math.random() * alphabet.length)],
      color: `rgba(0, ${Math.floor(150 + Math.random() * 105)}, 0, `
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 8, 5, 0.15)';
      ctx.fillRect(0, 0, width, height);

      const currentScroll = scrollYProgress.get();

      // Normal falling rain during BIOS boot
      if (currentScroll >= 0.35 && currentScroll < 0.7) {
        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px monospace`;

        // Render standard drops
        for (let i = 0; i < rainDrops.length; i++) {
          const text = alphabet[Math.floor(Math.random() * alphabet.length)];
          const x = i * fontSize;
          const y = rainDrops[i] * fontSize;

          // Introduce randomness in coloring
          ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00cc44';
          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) {
            rainDrops[i] = 0;
          }
          rainDrops[i]++;
        }
      }

      // 3D Zoom Tunnel Rain (for scroll >= 0.7)
      if (currentScroll >= 0.7) {
        // Clear screen with custom fade
        ctx.fillStyle = `rgba(0, 0, 0, ${0.15 + (currentScroll - 0.7) * 0.4})`;
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        
        // Speed up the zoom tunnel as scroll increases
        const zoomSpeed = 12 + (currentScroll - 0.7) * 40;

        stars.forEach((star) => {
          star.z -= zoomSpeed;
          if (star.z <= 0) {
            star.z = 1000;
            star.x = (Math.random() - 0.5) * 600;
            star.y = (Math.random() - 0.5) * 600;
          }

          // 3D Projection
          const k = 400 / star.z;
          const px = star.x * k + cx;
          const py = star.y * k + cy;

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const size = Math.max(1, Math.floor(12 * k));
            const opacity = Math.min(1, (1000 - star.z) / 400);
            ctx.fillStyle = `${star.color}${opacity})`;
            ctx.font = `${size}px monospace`;
            ctx.fillText(star.char, px, py);
          }

          // Randomly change characters
          if (Math.random() > 0.9) {
            star.char = alphabet[Math.floor(Math.random() * alphabet.length)];
          }
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollYProgress]);

  return (
    <div 
      id="retro-computer-zoom-container"
      ref={containerRef} 
      className="relative w-full h-[320vh] bg-[#f0ede6] flex flex-col items-center justify-start overflow-clip"
    >
      {/* Sticky background wrapper containing the floating computer */}
      <div 
        id="computer-viewport"
        className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Sound Toggle Control Panel */}
        <div 
          id="audio-controls"
          className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200/50 shadow-sm"
        >
          <span className="text-xs text-stone-500 font-sans tracking-wide">Synthesizer Hum & Audio:</span>
          <button
            id="toggle-synth-audio-btn"
            onClick={handleToggleAudio}
            className={`cursor-pointer px-3 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
              isMuted 
                ? 'bg-stone-200 text-stone-600 hover:bg-stone-300' 
                : 'bg-green-600 text-white shadow-sm shadow-green-600/30 font-bold animate-pulse'
            }`}
          >
            {isMuted ? 'SOUND: OFF' : 'SOUND: ACTIVE'}
          </button>
        </div>

        {/* Outer scrolling directions helper */}
        <motion.div 
          id="scroll-directions"
          className="absolute top-24 left-1/2 -translate-x-1/2 z-40 text-center flex flex-col items-center gap-1.5"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
        >
          <span className="text-xs font-sans uppercase tracking-widest text-stone-400 font-medium">Scroll down to power-on and enter computer</span>
          <div className="w-1 h-8 bg-stone-300 rounded-full overflow-hidden mt-1 relative">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-stone-600 rounded-full animate-bounce" />
          </div>
        </motion.div>

        {/* The 3D-Like Retro Computer */}
        <motion.div
          id="retro-computer-chassis"
          style={{ scale, y: yTranslate }}
          className="relative w-[380px] h-[340px] flex flex-col items-center justify-center transition-shadow"
        >
          {/* Main Beige Macintosh Body Casing */}
          <div className="relative w-full h-[310px] bg-gradient-to-b from-[#e8e4db] via-[#dfdacf] to-[#cfc8bc] rounded-3xl border-t border-white/40 shadow-2xl flex flex-col items-center pt-5 pb-4 px-6 border-b-[6px] border-b-stone-400/80">
            
            {/* Dark Bezel surrounding screen */}
            <div className="relative w-full h-[210px] bg-gradient-to-b from-[#5c564c] to-[#453f36] rounded-2xl border-2 border-stone-300/40 p-4 shadow-inner flex items-center justify-center">
              
              {/* Actual CRT glass Screen surface */}
              <div 
                id="crt-monitor-screen"
                className={`relative w-full h-full rounded-lg overflow-hidden transition-all duration-500 shadow-inner ${
                  powerOn ? 'bg-[#050805]' : 'bg-[#2b2b2a]'
                }`}
              >
                {/* HTML5 Canvas for Matrix Rain and Tunneling */}
                <canvas 
                  id="crt-code-rain-canvas"
                  ref={canvasRef} 
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                    powerOn ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* System Terminal Overlay */}
                {powerOn && (
                  <div 
                    id="system-terminal-screen"
                    className="absolute inset-0 p-3 flex flex-col text-left font-mono leading-tight select-none pointer-events-none"
                  >
                    {/* Booting text commands */}
                    <div className="text-[9px] text-[#39ff14] glow-green font-semibold">
                      {typedCommand}
                      <span className="animate-[blink_1s_infinite] ml-1">_</span>
                    </div>

                    {/* Scrolling BIOS Reports */}
                    {bootProgress > 0 && (
                      <div 
                        id="bios-logs-scroll"
                        className="flex flex-col gap-0.5 mt-2 overflow-hidden text-[7px]"
                        style={{ maxHeight: '115px' }}
                      >
                        {bootSequence.slice(0, bootProgress).map((step, idx) => (
                          <div 
                            key={idx} 
                            className={`${
                              step.type === 'success' ? 'text-green-400' :
                              step.type === 'warning' ? 'text-amber-400' :
                              step.type === 'error' ? 'text-red-400' : 'text-stone-300'
                            }`}
                          >
                            {step.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* CRT Scanline and curvature shadow */}
                <ScanlineOverlay 
                  id="computer-screen-overlay"
                  className={powerOn ? 'opacity-100' : 'opacity-20'}
                  glowColor={powerOn ? 'rgba(0, 255, 102, 0.15)' : 'rgba(0,0,0,0)'}
                />
              </div>
            </div>

            {/* Apple-esque logo slot and Floppy disk drives */}
            <div className="w-full mt-3 flex justify-between items-center px-2">
              {/* Rainbow ventilation badge */}
              <div className="flex gap-0.5 items-center">
                <div className="w-1.5 h-4 bg-[#ff4b4b] rounded-xs opacity-80" />
                <div className="w-1.5 h-4 bg-[#ffa834] rounded-xs opacity-80" />
                <div className="w-1.5 h-4 bg-[#ffe83c] rounded-xs opacity-80" />
                <div className="w-1.5 h-4 bg-[#41d636] rounded-xs opacity-80" />
                <div className="w-1.5 h-4 bg-[#3da4ff] rounded-xs opacity-80" />
              </div>

              {/* Floppy drive slit */}
              <div className="relative w-36 h-3 bg-gradient-to-b from-stone-800 to-stone-900 rounded-sm border border-stone-500/30 flex items-center justify-end px-1.5">
                {/* Red Disk Reading LED */}
                <div 
                  className={`w-1 h-1 rounded-full transition-colors duration-200 ${
                    scrollYProgress.get() >= 0.35 && scrollYProgress.get() < 0.45
                      ? 'bg-red-500 animate-ping'
                      : powerOn ? 'bg-red-900/60' : 'bg-transparent'
                  }`}
                />
              </div>

              {/* Computer Status LED */}
              <div className="flex items-center gap-1">
                <span className="text-[6px] font-sans text-stone-500 font-bold uppercase tracking-wide">PWR</span>
                <div className={`w-2 h-2 rounded-full border border-stone-400/40 transition-all duration-300 ${
                  powerOn ? 'bg-green-500 shadow-xs shadow-green-500/50' : 'bg-stone-500/40'
                }`} />
              </div>
            </div>
          </div>

          {/* Computer Stand / Foot Support */}
          <div className="w-[180px] h-[30px] bg-gradient-to-b from-[#b3aca1] to-[#999287] rounded-b-xl border-x border-b border-black/15 shadow-md -mt-1" />

          {/* Keyboard & Mouse Accessories floating below */}
          <motion.div
            id="retro-computer-accessories"
            style={{ opacity: accessoriesOpacity, y: accessoriesY }}
            className="absolute -bottom-36 w-[420px] h-32 flex justify-between items-end px-4"
          >
            {/* Retro Keyboard */}
            <div className="w-[300px] h-20 bg-gradient-to-b from-[#e1ddd3] via-[#ccc5b7] to-[#bfae9b] rounded-xl border border-stone-300 shadow-md flex flex-col justify-between p-1.5 border-b-[4px] border-b-stone-400">
              <div className="grid grid-cols-12 gap-0.5 h-full">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="bg-[#edeae2] rounded-xs border-b border-stone-400 flex items-center justify-center text-[5px] font-mono text-stone-500" />
                ))}
              </div>
            </div>

            {/* Retro Mouse */}
            <div className="w-[60px] h-12 bg-gradient-to-b from-[#e1ddd3] via-[#ccc5b7] to-[#b3a897] rounded-xl border border-stone-300 shadow-md relative flex flex-col border-b-[3px] border-b-stone-400">
              {/* Mouse Button split */}
              <div className="w-full h-[18px] border-b border-stone-400 flex">
                <div className="w-1/2 h-full border-r border-stone-300" />
              </div>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ff4b4b] rounded-full opacity-60" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Global CSS declarations inside components */}
      <style>{`
        .glow-green {
          text-shadow: 0 0 4px rgba(0, 255, 102, 0.7);
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
