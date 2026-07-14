/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Cpu, RotateCcw, Zap, Disc, HardDrive, Terminal } from 'lucide-react';

export default function TeardownOutro() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the bottom teardown container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Scroll mappings for the hardware explosion offsets
  const leftSpread = useTransform(scrollYProgress, [0.1, 0.8], [0, -160]);
  const farLeftSpread = useTransform(scrollYProgress, [0.1, 0.8], [0, -280]);
  
  const rightSpread = useTransform(scrollYProgress, [0.1, 0.8], [0, 160]);
  const farRightSpread = useTransform(scrollYProgress, [0.1, 0.8], [0, 280]);

  const frontSpread = useTransform(scrollYProgress, [0.1, 0.8], [0, 120]);
  const frontScale = useTransform(scrollYProgress, [0.1, 0.8], [1, 1.15]);
  const backSpread = useTransform(scrollYProgress, [0.1, 0.8], [0, -100]);

  const fanRotation = useTransform(scrollYProgress, [0, 1], [0, 1080]);
  const fanY = useTransform(scrollYProgress, [0.1, 0.8], [0, -120]);

  const textOpacity = useTransform(scrollYProgress, [0.6, 0.95], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.6, 0.95], [30, 0]);

  const lineDraw = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <div 
      id="retro-computer-teardown-outro"
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[#f5f5f4] text-stone-800 flex flex-col items-center justify-start overflow-clip select-none"
    >
      {/* Sticky background panel holding the parts canvas */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Subtle grid background to look like a draft blueprint workspace */}
        <div className="absolute inset-0 bg-blue-blueprint opacity-5 pointer-events-none" />

        <div className="absolute top-16 text-center space-y-1 z-20">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400">Section 04 // Interactive Outro</span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-stone-800 tracking-tight">SYSTEM TEARDOWN EXPLODED-VIEW</h2>
          <p className="text-xs font-mono text-stone-500">Keep scrolling to dismantle and disconnect the computer core</p>
        </div>

        {/* Explosion Canvas Wrapper */}
        <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center scale-90 sm:scale-100">
          
          {/* Connector blueprints lines shown as we spread */}
          <motion.div 
            style={{ opacity: lineDraw }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
          >
            <svg className="w-full h-full stroke-stone-300 stroke-2 stroke-dasharray-[4,4] fill-none">
              <line x1="20%" y1="50%" x2="80%" y2="50%" />
              <line x1="50%" y1="20%" x2="50%" y2="80%" />
            </svg>
          </motion.div>

          {/* ========================================================= */}
          {/* 1. FAR LEFT MODULE: EXTRUDED RAM & PCI SLOTS */}
          {/* ========================================================= */}
          <motion.div 
            style={{ x: farLeftSpread }}
            className="absolute z-10 flex flex-col items-center gap-1.5"
          >
            <div className="w-16 h-40 bg-[#c0b39c] border-2 border-stone-400 rounded-lg shadow-md flex items-center justify-center flex-wrap p-1 relative">
              <div className="absolute -top-3 text-[8px] font-mono font-bold text-stone-500">PORTS</div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-12 h-6 bg-stone-600 border border-stone-500 rounded-xs flex items-center justify-center gap-1">
                  <div className="w-1 h-3 bg-yellow-500/80 rounded-xs" />
                  <div className="w-1 h-3 bg-yellow-500/80 rounded-xs" />
                  <div className="w-1 h-3 bg-yellow-500/80 rounded-xs" />
                </div>
              ))}
            </div>
            <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Disc className="w-2.5 h-2.5" /> SERIAL_BUS
            </span>
          </motion.div>

          {/* ========================================================= */}
          {/* 2. INNER LEFT MODULE: MOTHERBOARD & CHIPS */}
          {/* ========================================================= */}
          <motion.div 
            style={{ x: leftSpread }}
            className="absolute z-10 flex flex-col items-center gap-2"
          >
            <div className="w-24 h-48 bg-[#4c7a5d] border-2 border-[#3d624a] rounded-xl shadow-lg p-3 relative flex flex-col justify-between">
              <div className="absolute -top-3 text-[8px] font-mono font-bold text-stone-500">MOTHERBOARD</div>
              
              {/* Central Micro CPU */}
              <div className="w-10 h-10 bg-stone-800 border-2 border-stone-700 rounded-md flex items-center justify-center relative shadow-sm">
                <Cpu className="w-5 h-5 text-yellow-500" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#4c7a5d] border border-stone-700 rotate-45" />
              </div>

              {/* Capacitors & RAM blocks */}
              <div className="flex gap-1">
                <div className="w-2 h-14 bg-[#ffa100] border border-amber-600 rounded-sm" />
                <div className="w-2 h-14 bg-[#ffa100] border border-amber-600 rounded-sm" />
                <div className="w-2 h-14 bg-stone-900 border border-stone-800 rounded-sm" />
              </div>

              {/* Graphic processor */}
              <div className="w-16 h-8 bg-[#2d4938] border border-[#23382b] rounded-sm flex items-center justify-around px-1">
                <div className="w-1 h-4 bg-[#39ff14]/80 rounded-xs" />
                <div className="w-1 h-4 bg-[#39ff14]/80 rounded-xs" />
                <div className="w-1 h-4 bg-[#39ff14]/80 rounded-xs" />
              </div>
            </div>
            <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5 text-[#3d624a]" /> CPU_CORE_6502
            </span>
          </motion.div>

          {/* ========================================================= */}
          {/* 3. REAR RECOIL MODULE: REAR VENTILATED CASING */}
          {/* ========================================================= */}
          <motion.div 
            style={{ z: backSpread, scale: 0.9 }}
            className="absolute z-0 flex flex-col items-center gap-2 opacity-60"
          >
            <div className="w-64 h-[240px] bg-gradient-to-b from-[#e8e4db] to-[#cfc8bc] rounded-2xl border-2 border-stone-300 shadow-md flex flex-col justify-between p-4">
              {/* Rear Cooling vents grill */}
              <div className="grid grid-cols-6 gap-1 h-12 w-full mt-2">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="bg-stone-700 h-2 rounded-full" />
                ))}
              </div>
              <div className="border-t border-stone-300 pt-2 flex justify-between items-center text-[7px] font-mono text-stone-400 font-bold">
                <span>R-TECH MFG CORP.</span>
                <span>FCC ID: K9A85A</span>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 4. CENTRAL SCREEN CORE: CRT MONITOR GLASS & FOCUS */}
          {/* ========================================================= */}
          <motion.div 
            style={{ scale: frontScale, y: frontSpread }}
            className="absolute z-30 flex flex-col items-center gap-3"
          >
            {/* Front outer Bezel panel */}
            <div className="w-56 h-48 bg-gradient-to-b from-[#dfdacf] to-[#cfc8bc] rounded-2xl border-2 border-stone-300 shadow-xl flex items-center justify-center p-3 relative">
              <div className="absolute -top-3 text-[8px] font-mono font-bold text-stone-500 font-extrabold">FRONT_BEZEL</div>
              
              {/* Glass CRT Monitor screen tube */}
              <div className="w-full h-full bg-[#3c3c3a] rounded-lg shadow-inner overflow-hidden flex flex-col items-center justify-center border-t border-white/20 border-b border-stone-800">
                <div className="w-10 h-10 bg-[#39ff14]/10 rounded-full border border-[#39ff14]/30 animate-ping absolute" />
                <Terminal className="w-10 h-10 text-stone-400 animate-pulse" />
              </div>
            </div>
            <span className="text-[8px] font-mono text-stone-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Disc className="w-3 h-3 text-stone-500" /> glass_crt_tube
            </span>
          </motion.div>

          {/* ========================================================= */}
          {/* 5. UPPER FLOAT: ROTATING VENTILATION FAN */}
          {/* ========================================================= */}
          <motion.div 
            style={{ y: fanY, rotate: fanRotation }}
            className="absolute z-20 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-stone-900 border-2 border-stone-700 rounded-full flex items-center justify-center relative shadow-lg">
              <div className="absolute -top-4 text-[8px] font-mono font-bold text-stone-500 select-none">COOLING_FAN</div>
              {/* Fan blades */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute w-2.5 h-8 bg-stone-600 rounded-sm"
                  style={{ transform: `rotate(${i * 72}deg)`, transformOrigin: 'center 10px' }}
                />
              ))}
              <div className="w-5 h-5 bg-stone-800 border border-stone-600 rounded-full z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* 6. INNER RIGHT MODULE: POWER SUPPLY UNIT (PSU) */}
          {/* ========================================================= */}
          <motion.div 
            style={{ x: rightSpread }}
            className="absolute z-10 flex flex-col items-center gap-2"
          >
            <div className="w-24 h-40 bg-[#d6d3d1] border-2 border-stone-400 rounded-xl shadow-lg p-3 relative flex flex-col justify-between">
              <div className="absolute -top-3 text-[8px] font-mono font-bold text-stone-500">POWER_SUPPLY</div>
              {/* Copper coil coil wrap */}
              <div className="w-full h-8 bg-[#b45309] border border-amber-800 rounded-sm flex flex-col justify-around p-1">
                <div className="h-1 bg-yellow-500 rounded-full" />
                <div className="h-1 bg-yellow-500 rounded-full" />
                <div className="h-1 bg-yellow-500 rounded-full" />
              </div>

              {/* Power circuit components */}
              <div className="flex justify-between items-end">
                <div className="w-4 h-12 bg-stone-800 rounded flex flex-col justify-between p-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <Zap className="w-8 h-8 text-[#ffa100] animate-pulse" />
              </div>
            </div>
            <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-amber-500" /> PSU_AC_TO_DC_12V
            </span>
          </motion.div>

          {/* ========================================================= */}
          {/* 7. FAR RIGHT MODULE: FLOPPY CONTROLLER & DISKETTE */}
          {/* ========================================================= */}
          <motion.div 
            style={{ x: farRightSpread }}
            className="absolute z-10 flex flex-col items-center gap-1.5"
          >
            <div className="w-20 h-44 bg-[#a1a19a] border-2 border-stone-400 rounded-lg shadow-md flex flex-col justify-between p-3 relative">
              <div className="absolute -top-3 text-[8px] font-mono font-bold text-stone-500">FLOPPY_DRIVE</div>
              
              {/* Floppy disc controller plate */}
              <div className="w-full h-12 bg-stone-800 rounded-sm flex items-center justify-center p-2 relative">
                <div className="w-10 h-1 bg-stone-600 rounded-full" />
                <div className="absolute bottom-1 right-2 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              </div>

              {/* Hard drive spindle */}
              <div className="w-full h-14 bg-stone-900 rounded-sm flex flex-col justify-around p-1.5 border border-stone-700">
                <div className="w-6 h-6 rounded-full border-2 border-stone-600 border-dashed animate-spin flex items-center justify-center mx-auto">
                  <div className="w-2 h-2 bg-stone-400 rounded-full" />
                </div>
              </div>
            </div>
            <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <HardDrive className="w-2.5 h-2.5" /> HDD_PARTITION_C
            </span>
          </motion.div>

        </div>

        {/* Closing Greetings Credits Outro */}
        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          className="absolute bottom-16 text-center space-y-4 max-w-lg px-6 z-40"
        >
          <div className="inline-flex items-center gap-2 bg-stone-200 border border-stone-300/60 px-4 py-1.5 rounded-full shadow-sm text-stone-600 text-xs font-mono font-bold">
            <RotateCcw className="w-3.5 h-3.5" /> TEARDOWN COMPLETE
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-2xl font-black uppercase text-stone-800 tracking-tight">
              AKHIL PRATAP CHAUDHARY
            </h3>
            <p className="text-xs font-mono text-stone-500 leading-relaxed max-w-sm mx-auto">
              B.Tech Artificial Intelligence & Machine Learning // Thank you for exploring my interactive hardware portfolio system.
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <a 
              href="mailto:workwithme2003@gmail.com" 
              className="cursor-pointer bg-stone-900 text-white hover:bg-stone-800 text-xs font-bold font-mono px-5 py-2 rounded-lg transition-all shadow-md"
            >
              HIRE CHAUDHARY
            </a>
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 text-xs font-bold font-mono px-5 py-2 rounded-lg transition-all"
            >
              RE-BOOT SYSTEM
            </button>
          </div>
        </motion.div>

      </div>
      <style>{`
        .bg-blue-blueprint {
          background-size: 20px 20px;
          background-image: 
            linear-gradient(to right, rgba(0, 0, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 255, 0.1) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
