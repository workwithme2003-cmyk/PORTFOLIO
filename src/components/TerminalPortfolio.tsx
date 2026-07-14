/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  Terminal, Cpu, Network, BookOpen, Database, BarChart2, Award, 
  HelpCircle, Volume2, VolumeX, Eye, Sparkles, FolderGit2, CheckCircle2,
  Mail, ExternalLink, Compass, ShieldQuestion, Radio, Activity
} from 'lucide-react';
import { 
  portfolioEducation, portfolioSkills, portfolioProjects, helpCommands 
} from '../data';
import { retroAudio } from '../utils/audio';
import { TerminalTheme } from '../types';

interface AnimatedSectionNumberProps {
  num: string;
  textColor: string;
  caretColor: string;
}

function AnimatedSectionNumber({ num, textColor, caretColor }: AnimatedSectionNumberProps) {
  return (
    <motion.span
      className={`inline-flex items-center justify-center font-mono font-extrabold text-2xl sm:text-3xl px-3 py-1 rounded-lg border-2 border-stone-800 bg-[#faf8f5] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${textColor} relative overflow-hidden mr-2 select-none cursor-pointer`}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{
        y: [0, -3, 0],
        rotateX: [0, 4, -4, 0],
        rotateY: [0, -4, 4, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: parseInt(num) * 0.4
      }}
      whileHover={{
        scale: 1.1,
        rotateY: 15,
        rotateX: 10,
        z: 20,
        boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        borderColor: caretColor,
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10">[{num}]</span>
      {/* Subtle dynamic scanline/shine overlay inside the badge */}
      <motion.span 
        className="absolute inset-0 w-full h-full bg-linear-to-b from-transparent via-white/40 to-transparent pointer-events-none"
        animate={{
          y: ['-100%', '100%']
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </motion.span>
  );
}

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  onViewportEnter?: () => void;
  viewport?: any;
  key?: string;
}

function Interactive3DCard({ children, className = '', id, style = {}, onViewportEnter, viewport }: Interactive3DCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D card tilt rotation (limited to feel extremely elegant and stable!)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 15 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 15 });

  // Smooth springs for lift-up scale
  const scale = useSpring(1, { stiffness: 150, damping: 20 });
  const translateZ = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates between -0.5 and 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    scale.set(1.02);
    translateZ.set(15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
    translateZ.set(0);
  };

  return (
    <motion.div
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onViewportEnter={onViewportEnter}
      viewport={viewport}
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        scale,
        ...style,
      }}
      className={`transition-shadow duration-300 ${className}`}
    >
      <motion.div
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(18px)`,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface TerminalPortfolioProps {
  id?: string;
}

export default function TerminalPortfolio({ id = 'retro-terminal-portfolio' }: TerminalPortfolioProps) {
  const [theme, setTheme] = useState<TerminalTheme>('classic-green');
  const [isAudioActive, setIsAudioActive] = useState<boolean>(true);
  const [cliInput, setCliInput] = useState<string>('');
  const [cliHistory, setCliHistory] = useState<Array<{ command: string; output: React.ReactNode }>>([]);
  const [matrixActive, setMatrixActive] = useState<boolean>(false);
  const [runningProjectCode, setRunningProjectCode] = useState<string | null>(null);
  const [activeProjectAnalysis, setActiveProjectAnalysis] = useState<string | null>(null);
  const [inViewSections, setInViewSections] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll tracking for dynamic in-between interactive transitions
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Animated floating circuit matrix and deflection coordinates
  const circuitRotation = useTransform(scrollYProgress, [0.1, 0.9], [0, 360]);
  const circuitX = useTransform(scrollYProgress, [0.1, 0.9], [-40, 40]);
  const waveAmplitude = useTransform(scrollYProgress, [0.2, 0.8], [5, 28]);
  const coordinateY = useTransform(scrollYProgress, [0.1, 0.9], [120, 290]);

  // Sound play helper on interactions
  const handleKeypressAudio = () => {
    retroAudio.playKey();
  };

  // Keyboard shortcut to focus terminal input
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Sync with global retroAudio instance state
  useEffect(() => {
    const audioEnabled = retroAudio.getEnabled();
    setIsAudioActive(audioEnabled);
  }, []);

  // Command execution engine
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    let response: React.ReactNode = null;
    const colors = getThemeColors();

    if (trimmed === 'help') {
      response = (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 text-sm border-2 ${colors.borderColor} p-3.5 rounded-lg mt-1.5 font-technical bg-[#fbfaf7]`}>
          {helpCommands.map((c) => (
            <div key={c.name} className="flex gap-2">
              <span className={`${colors.textColor} font-funky text-lg font-bold min-w-[90px] tracking-wide`}>{c.name}</span>
              <span className="text-stone-600 font-mono text-xs mt-1">- {c.desc}</span>
            </div>
          ))}
        </div>
      );
    } else if (trimmed === 'about') {
      response = (
        <div className="text-sm leading-relaxed max-w-2xl font-technical p-1">
          <p className={`${colors.textColor} font-funky text-2xl font-bold mb-1.5 tracking-wider`}>=== AKHIL PRATAP CHAUDHARY ===</p>
          <p className="text-stone-700 font-medium">
            A dynamic, goal-driven full-stack developer specializing in scalable web systems, interactive database intelligence, and responsive data visualization pipelines. Deeply skilled in crafting high-efficiency client portals, custom websocket networks, and real-time telemetry visualizers that empower seamless end-user workflows.
          </p>
        </div>
      );
    } else if (trimmed === 'education') {
      response = (
        <div className="text-sm font-technical space-y-2 p-3 bg-[#fbfaf7] border border-stone-300 rounded-lg">
          <p className={`${colors.textColor} font-funky text-2xl font-bold tracking-wider`}>{portfolioEducation.degree}</p>
          <p className="text-stone-800 font-bold text-sm">{portfolioEducation.specialization}</p>
          <p className="text-stone-500 text-xs">{portfolioEducation.institution} // {portfolioEducation.duration}</p>
          <p className={`${colors.textColor} font-bold text-xs bg-stone-100 border px-2.5 py-0.5 rounded-sm inline-block`}>GPA: {portfolioEducation.gpa}</p>
          <div className="mt-2 border-l-2 border-stone-400 pl-3 py-1 space-y-1">
            {portfolioEducation.highlights.map((h, i) => (
              <p key={i} className="text-stone-600 text-xs">- {h}</p>
            ))}
          </div>
        </div>
      );
    } else if (trimmed === 'skills') {
      response = (
        <div className="text-sm font-technical space-y-3 max-w-md bg-[#fbfaf7] border border-stone-300 rounded-lg p-3.5">
          <p className="font-funky text-xl text-stone-700 tracking-wider">SKILLS INTEGRITY LOG</p>
          {portfolioSkills.map((s) => (
            <div key={s.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-stone-700 font-bold">{s.name} <span className="text-[10px] text-stone-400 font-medium">({s.category})</span></span>
                <span className={`${colors.textColor} font-bold`}>{s.level}%</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 border border-stone-300 rounded-sm overflow-hidden flex">
                <div 
                  className="h-full" 
                  style={{ width: `${s.level}%`, backgroundColor: colors.caretColor }}
                />
              </div>
            </div>
          ))}
        </div>
      );
    } else if (trimmed === 'projects') {
      response = (
        <div className="text-sm font-technical space-y-3">
          {portfolioProjects.map((p, idx) => (
            <div key={p.id} className={`border-2 ${colors.borderColor} p-3.5 rounded-xl bg-[#fbfaf7]`}>
              <p className={`${colors.textColor} font-funky text-xl font-bold tracking-wide`}>[{idx + 1}] {p.title}</p>
              <p className="text-stone-600 text-xs mt-1.5 leading-relaxed">{p.description}</p>
              <p className="text-[11px] text-stone-500 mt-2 font-bold font-mono">Tech: {p.tech.join(', ')}</p>
              <button 
                onClick={() => simulateProjectExecution(p.id)}
                className={`cursor-pointer mt-2.5 ${colors.textColor} border-2 ${colors.borderColor} hover:bg-stone-100 text-xs font-bold font-funky px-3.5 py-1 rounded shadow-[2px_2px_0px_0px_currentColor] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_currentColor] transition-all`}
              >
                COMPILE & PLOT PIPELINE DATA
              </button>
            </div>
          ))}
        </div>
      );
    } else if (trimmed.startsWith('project ')) {
      const parts = trimmed.split(' ');
      const idx = parseInt(parts[1]) - 1;
      if (idx >= 0 && idx < portfolioProjects.length) {
        const p = portfolioProjects[idx];
        response = (
          <div className={`text-sm font-technical border-2 ${colors.borderColor} p-4 rounded-xl max-w-2xl bg-[#fbfaf7]`}>
            <p className={`${colors.textColor} font-funky text-2xl font-bold tracking-wide mb-1`}>{p.title}</p>
            <p className="text-stone-500 text-xs mb-2 font-mono">Category: {p.category.toUpperCase()} // Stack: {p.tech.join(', ')}</p>
            <p className="text-stone-700 text-xs mb-3.5 leading-relaxed">{p.description}</p>
            <div className="space-y-1.5 border-t border-stone-200 pt-3">
              {p.details.map((d, i) => (
                <p key={i} className="text-stone-600 text-xs leading-relaxed">- {d}</p>
              ))}
            </div>
            <button 
              onClick={() => simulateProjectExecution(p.id)}
              className={`cursor-pointer mt-3.5 border-2 ${colors.borderColor} ${colors.textColor} hover:bg-stone-100 text-xs font-bold font-funky px-4 py-1.5 rounded-md shadow-[3px_3px_0px_0px_currentColor] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_currentColor] transition-all`}
            >
              TRIGGER LIVE TELEMETRY SIMULATION
            </button>
          </div>
        );
      } else {
        response = <span className="text-red-600 font-bold font-mono text-xs">ERROR: Project index out of range. Run "projects" to view active listings.</span>;
      }
    } else if (trimmed === 'matrix') {
      setMatrixActive(!matrixActive);
      response = <span className={`${colors.textColor} font-bold font-mono text-xs`}>SUCCESS: Matrix screen-saver toggled {matrixActive ? 'OFF' : 'ON'}</span>;
    } else if (trimmed === 'theme') {
      const themes: TerminalTheme[] = ['classic-green', 'amber-glow', 'cyber-cyan', 'matrix-white'];
      const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
      const nextTheme = themes[nextIdx];
      setTheme(nextTheme);
      response = <span className={`${colors.textColor} font-bold font-mono text-xs`}>SUCCESS: Repainted console manual theme to {nextTheme.toUpperCase()}</span>;
    } else if (trimmed === 'audio') {
      const active = retroAudio.toggle();
      setIsAudioActive(active);
      response = <span className={`${colors.textColor} font-bold font-mono text-xs`}>SUCCESS: Sound synthesis and keycap clicks toggled {active ? 'ON' : 'OFF'}</span>;
    } else if (trimmed === 'clear') {
      setCliHistory([]);
      return;
    } else if (trimmed === '') {
      response = null;
    } else {
      response = (
        <span className="text-red-600 font-technical text-xs font-semibold">
          COMMAND NOT COMPILING: "{cmdStr}". Type <span className={`${colors.textColor} font-bold underline cursor-pointer`} onClick={() => executeCommand('help')}>"help"</span> for guide book.
        </span>
      );
    }

    setCliHistory(prev => [...prev, { command: cmdStr, output: response }]);
    
    // Play system beep sound
    if (isAudioActive) {
      retroAudio.playBeep(trimmed === '' ? 380 : 700, 0.08);
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(cliInput);
    setCliInput('');
  };

  // Click handler to auto-focus terminal input
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Auto-scroll CLI history
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cliHistory, runningProjectCode]);

  // Project simulation code pipeline
  const simulateProjectExecution = (pId: string) => {
    setRunningProjectCode(pId);
    setActiveProjectAnalysis(null);
    if (isAudioActive) {
      retroAudio.playFloppySeek();
    }

    let codeLines: string[] = [];
    if (pId === 'celestia') {
      codeLines = [
        '>>> Initializing Celestia Vector Graphics System...',
        '>>> Allocating double-buffer canvas coordinates for 9 planetary orbits...',
        '>>> Fetching real-time orbital telemetry vectors via API link...',
        '>>> Executing Keplers mathematical equations for trajectory projection...',
        '>>> Drawing space simulation canvas: 1,500 coordinate starpoints mapped...',
        '>>> Stable 60 FPS viewport refresh achieved // Render latency: <1.8ms',
        '>>> Synchronizing interactive bento-grid stats overlays... Success.',
        '>>> CELESTIA SIMULATION CONTAINER BOOTED SUCCESS. RENDERING ACTIVE.'
      ];
    } else {
      codeLines = [
        '>>> Booting AnonDoubt Real-Time Collaboration Gateway...',
        '>>> Establishing highly concurrent secure WebSocket sockets pipeline...',
        '>>> Server socket pool configured on port 3000 // Handshake: Verified',
        '>>> Dispatching client ticket to pool query of active mentors...',
        '>>> Direct mentor matchmaking resolved. Tunnel latencies: 74ms',
        '>>> Allocating temporary, sandbox-isolated peer chat room session...',
        '>>> Mount Markdown formatting engine and active student queues tracker...',
        '>>> ANONDOUBT ROUTER SYSTEM SECURED & STREAMING LIVE. ACTIVE ROOMS: 18'
      ];
    }

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < codeLines.length) {
        setActiveProjectAnalysis(prev => (prev ? prev + '\n' + codeLines[currentLine] : codeLines[currentLine]));
        if (isAudioActive) {
          retroAudio.playKey();
        }
        currentLine++;
      } else {
        clearInterval(interval);
        if (isAudioActive) {
          retroAudio.playBeep(850, 0.15);
        }
      }
    }, 120);
  };

  // Map theme colors dynamically for our gorgeous retro Light & Boxy Blueprint layout
  const getThemeColors = () => {
    switch (theme) {
      case 'amber-glow':
        return {
          textColor: 'text-[#8c3619]', // Terracotta rust ink
          borderColor: 'border-[#8c3619]',
          borderColorFocus: 'focus:border-[#8c3619] border-[#8c3619]/60',
          bgColor: 'bg-[#fcfaf7]',
          caretColor: '#8c3619',
          accentColor: 'text-[#c2410c]',
          buttonBg: 'bg-[#8c3619]/10 hover:bg-[#8c3619]/20 text-[#8c3619]',
          badgeStyle: 'bg-[#8c3619]/10 border-2 border-[#8c3619] text-[#8c3619]',
          gridColor: 'rgba(140, 54, 25, 0.08)'
        };
      case 'cyber-cyan':
        return {
          textColor: 'text-[#1b366a]', // Blueprint blue ink
          borderColor: 'border-[#1b366a]',
          borderColorFocus: 'focus:border-[#1b366a] border-[#1b366a]/60',
          bgColor: 'bg-[#f4f7fc]',
          caretColor: '#1b366a',
          accentColor: 'text-[#1d4ed8]',
          buttonBg: 'bg-[#1b366a]/10 hover:bg-[#1b366a]/20 text-[#1b366a]',
          badgeStyle: 'bg-[#1b366a]/10 border-2 border-[#1b366a] text-[#1b366a]',
          gridColor: 'rgba(27, 54, 106, 0.08)'
        };
      case 'matrix-white':
        return {
          textColor: 'text-[#242322]', // Industrial Charcoal slate ink
          borderColor: 'border-[#242322]',
          borderColorFocus: 'focus:border-[#242322] border-[#242322]/60',
          bgColor: 'bg-[#fafafa]',
          caretColor: '#242322',
          accentColor: 'text-[#4b5563]',
          buttonBg: 'bg-[#242322]/10 hover:bg-[#242322]/20 text-[#242322]',
          badgeStyle: 'bg-[#242322]/10 border-2 border-[#242322] text-[#242322]',
          gridColor: 'rgba(36, 35, 34, 0.08)'
        };
      case 'classic-green':
      default:
        return {
          textColor: 'text-[#2d4a36]', // Olivetti Green manual typewriter ink
          borderColor: 'border-[#2d4a36]',
          borderColorFocus: 'focus:border-[#2d4a36] border-[#2d4a36]/60',
          bgColor: 'bg-[#f6fbf6]',
          caretColor: '#2d4a36',
          accentColor: 'text-[#15803d]',
          buttonBg: 'bg-[#2d4a36]/10 hover:bg-[#2d4a36]/20 text-[#2d4a36]',
          badgeStyle: 'bg-[#2d4a36]/10 border-2 border-[#2d4a36] text-[#2d4a36]',
          gridColor: 'rgba(45, 74, 54, 0.08)'
        };
    }
  };

  const styleSet = getThemeColors();

  // Draw falling matrix rain if active, otherwise clear the canvas (3D Net has been completely removed)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Matrix Rain configuration
    const alphabets = 'アィイゥウェエォオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン0123456789ABCDEFGHIJKLMNOPACT'.split('');
    const fontSize = 14;
    const columns = Math.floor(width / fontSize) + 1;
    const drops = Array(columns).fill(1);

    const getThemeRGB = () => {
      switch (theme) {
        case 'amber-glow': return '140, 54, 25';
        case 'cyber-cyan': return '27, 54, 106';
        case 'matrix-white': return '36, 35, 34';
        case 'classic-green':
        default:
          return '45, 74, 54';
      }
    };

    const draw = () => {
      const themeRGB = getThemeRGB();

      if (matrixActive) {
        ctx.fillStyle = 'rgba(233, 228, 217, 0.22)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = alphabets[Math.floor(Math.random() * alphabets.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillStyle = `rgba(${themeRGB}, 0.85)`;
          if (Math.random() > 0.95) ctx.fillStyle = '#000000';

          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [matrixActive, theme]);

  return (
    <div 
      id={id}
      ref={containerRef}
      className="relative min-h-screen select-text flex flex-col items-center justify-start overflow-x-hidden py-12 transition-all duration-700 bg-blueprint-light-animated"
    >
      {/* Fixed interactive 3D background canvas behind the whole workspace */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none opacity-65 z-0"
      />

      {/* Floating Header Toolbar */}
      <header 
        id="terminal-header-bar"
        className={`w-full max-w-6xl mx-auto px-6 py-3.5 flex justify-between items-center border-2 border-stone-800 rounded-2xl z-50 bg-[#faf8f5]/95 backdrop-blur-sm sticky top-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] transition-all ${styleSet.textColor}`}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 animate-pulse" />
          <span className="font-funky text-2xl tracking-wider font-extrabold uppercase">
            PORTFOLIO TERMINAL v4.2
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-technical">
          {/* Quick Stats Summary */}
          <div className="hidden lg:flex items-center gap-4 border-r-2 border-stone-800/20 pr-4 text-stone-600 font-mono">
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" /> CGPA: <strong className="text-stone-800">8 / 10</strong>
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <Network className="w-3.5 h-3.5" /> NODE: <strong className="text-stone-800">127.0.0.1</strong>
            </span>
          </div>

          {/* Quick theme buttons */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-stone-500 uppercase tracking-widest hidden sm:inline font-bold">Ink:</span>
            {(['classic-green', 'amber-glow', 'cyber-cyan', 'matrix-white'] as TerminalTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  if (isAudioActive) retroAudio.playBeep(650, 0.05);
                }}
                className={`w-4 h-4 rounded-full border-2 border-stone-800 cursor-pointer ${
                  t === 'classic-green' ? 'bg-[#2d4a36]' :
                  t === 'amber-glow' ? 'bg-[#8c3619]' :
                  t === 'cyber-cyan' ? 'bg-[#1b366a]' : 'bg-[#242322]'
                } ${theme === t ? 'scale-125 ring-2 ring-stone-800/30' : 'opacity-40 hover:opacity-100 transition-all'}`}
                title={t.replace('-', ' ')}
              />
            ))}
          </div>

          {/* Audio controller toggle */}
          <button
            onClick={() => {
              const active = retroAudio.toggle();
              setIsAudioActive(active);
            }}
            className="cursor-pointer p-1.5 rounded-lg border-2 border-stone-800 hover:bg-stone-100 transition-all text-stone-800"
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Grid Content Area */}
      <main 
        id="terminal-scroll-area"
        className="w-full max-w-6xl px-6 py-10 flex flex-col lg:flex-row gap-8 z-10 flex-1 relative"
      >
        {/* Left Side: Scrollable Resume Layout */}
        <section 
          id="retro-scrolling-resume"
          className="flex-1 space-y-12 pb-24"
        >
          {/* USER INTRODUCTION HEADER */}
          <Interactive3DCard 
            id="retro-terminal-ui-header"
            onViewportEnter={() => setInViewSections(prev => ({ ...prev, header: true }))}
            viewport={{ once: true, margin: "-100px" }}
            style={{ perspective: 1200 }}
            className={`border-2 border-stone-800 bg-[#faf8f5] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[240px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] cursor-pointer hover:shadow-[12px_12px_24px_0px_rgba(0,0,0,0.15)] transition-shadow duration-300 ${inViewSections.header ? 'glitch-viewport-entry' : 'opacity-0'}`}
          >
            <div className="flex justify-between items-start border-b-2 border-stone-800/10 pb-3 mb-4">
              <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold font-technical">Terminal Mainframe // Connection Verified</span>
              <span className={`text-xs bg-[#2d4a36]/10 text-[#2d4a36] border-2 border-[#2d4a36]/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> AP_ONLINE
              </span>
            </div>

            <div className="space-y-2 relative z-10">
              <h1 className="font-funky text-5xl sm:text-7xl leading-none text-stone-800 tracking-wide uppercase">
                AKHIL PRATAP CHAUDHARY
              </h1>
              <p className="text-sm font-sans-grotesk font-black text-stone-500 tracking-widest uppercase">
                B.Tech Artificial Intelligence & Machine Learning
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className={`text-xs font-bold font-funky px-3 py-1 rounded-sm ${styleSet.badgeStyle}`}>
                  FULL-STACK WEB
                </span>
                <span className={`text-xs font-bold font-funky px-3 py-1 rounded-sm ${styleSet.badgeStyle}`}>
                  SQL DATABASE INTEGRATION
                </span>
                <span className={`text-xs font-bold font-funky px-3 py-1 rounded-sm ${styleSet.badgeStyle}`}>
                  REAL-TIME TELEMETRY
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t-2 border-stone-800/10 mt-6 text-xs font-technical">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-0.5">LOCATION</p>
                <p className="text-stone-800 font-extrabold text-sm break-words">Lucknow, Uttar Pradesh, India</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-0.5">EMAIL GATEWAY</p>
                <a href="mailto:workwithme2003@gmail.com" className={`font-extrabold text-sm hover:underline break-all ${styleSet.textColor}`}>
                  workwithme2003@gmail.com
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-0.5">ACADEMICS</p>
                <p className="text-stone-800 font-extrabold text-sm">{portfolioEducation.institution}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-0.5">TIMEFRAME</p>
                <p className="text-stone-800 font-extrabold text-sm">{portfolioEducation.duration}</p>
              </div>
            </div>
          </Interactive3DCard>

          {/* Section 1: Education */}
          <motion.div 
            id="education-section-details" 
            onViewportEnter={() => setInViewSections(prev => ({ ...prev, education: true }))}
            viewport={{ once: true, margin: "-100px" }}
            className={`space-y-4 ${inViewSections.education ? 'glitch-viewport-entry' : 'opacity-0'}`}
          >
            <h2 className="font-funky text-4xl sm:text-5xl text-stone-800 flex items-center gap-2 tracking-wider">
              <motion.span
                animate={{ rotate: [0, 5, -5, 0], y: [0, -2, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <BookOpen className="w-8 h-8" />
              </motion.span>
              <AnimatedSectionNumber num="01" textColor={styleSet.textColor} caretColor={styleSet.caretColor} />
              Education Details
            </h2>
            <Interactive3DCard 
              style={{ perspective: 1200 }}
              className="border-2 border-stone-800 bg-[#faf8f5] p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.15)] rounded-xl relative cursor-pointer hover:shadow-[10px_10px_20px_0px_rgba(0,0,0,0.15)] transition-shadow duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                  <h3 className="text-lg font-black text-stone-800 font-sans-grotesk">{portfolioEducation.degree}</h3>
                  <p className={`text-sm font-bold ${styleSet.textColor} font-technical`}>{portfolioEducation.specialization}</p>
                  <p className="text-xs text-stone-500 font-technical mt-1">{portfolioEducation.institution}</p>
                </div>
                <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                  <span className="bg-stone-100 text-stone-600 text-xs px-2.5 py-1 rounded-md border border-stone-300 font-technical font-semibold">
                    {portfolioEducation.duration}
                  </span>
                  <div className="border-2 border-stone-800 px-3.5 py-1 bg-[#ffb703]/20 font-funky text-2xl text-stone-800 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {portfolioEducation.gpa}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-stone-800/10 space-y-2.5 mt-5">
                <p className="text-xs uppercase tracking-widest text-stone-400 font-bold font-technical">Academic Focus & Accomplishments:</p>
                {portfolioEducation.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-3 text-xs text-stone-700 items-start leading-relaxed font-technical">
                    <span className={`text-sm leading-none font-extrabold ${styleSet.textColor}`}>▸</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </Interactive3DCard>
          </motion.div>

          {/* Section 2: Technical Skills */}
          <motion.div 
            id="skills-section-details" 
            onViewportEnter={() => setInViewSections(prev => ({ ...prev, skills: true }))}
            viewport={{ once: true, margin: "-100px" }}
            className={`space-y-4 ${inViewSections.skills ? 'glitch-viewport-entry' : 'opacity-0'}`}
          >
            <h2 className="font-funky text-4xl sm:text-5xl text-stone-800 flex items-center gap-2 tracking-wider">
              <motion.span
                animate={{ scale: [1, 1.05, 0.95, 1], rotate: [0, -3, 3, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <Cpu className="w-8 h-8" />
              </motion.span>
              <AnimatedSectionNumber num="02" textColor={styleSet.textColor} caretColor={styleSet.caretColor} />
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolioSkills.map((skill) => (
                <Interactive3DCard 
                  key={skill.name}
                  style={{ perspective: 1000 }}
                  className="border-2 border-stone-800 bg-[#faf8f5] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] rounded-xl space-y-3 relative cursor-pointer hover:shadow-[8px_8px_16px_0px_rgba(0,0,0,0.15)] transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center text-xs font-technical">
                    <span className="font-bold text-stone-800 uppercase text-sm">{skill.name}</span>
                    <span className="text-stone-500 text-[10px] uppercase bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-300 font-bold">
                      {skill.category}
                    </span>
                  </div>
                  
                  {/* Dynamic Skill Level Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full h-3 bg-stone-100 border-2 border-stone-800 rounded-full overflow-hidden flex">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%`, backgroundColor: styleSet.caretColor }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-500 font-technical font-bold">
                      <span>STRENGTH_INDEX</span>
                      <span className={styleSet.textColor}>{skill.level}%</span>
                    </div>
                  </div>

                  {skill.details && (
                    <p className="text-xs text-stone-600 leading-relaxed pt-1.5 border-t border-stone-800/5 font-technical">
                      {skill.details}
                    </p>
                  )}
                </Interactive3DCard>
              ))}
            </div>
          </motion.div>

          {/* DYNAMIC SCROLL IN-BETWEEN WIDGET: Oscilloscope Vector Calibration Grid */}
          <Interactive3DCard
            id="calibration-widget"
            onViewportEnter={() => setInViewSections(prev => ({ ...prev, calibration: true }))}
            viewport={{ once: true, margin: "-80px" }}
            style={{ perspective: 1200 }}
            className={`border-2 border-stone-800 bg-[#faf8f5] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] rounded-2xl relative overflow-hidden space-y-4 cursor-pointer hover:shadow-[12px_12px_24px_0px_rgba(0,0,0,0.15)] transition-shadow duration-300 ${inViewSections.calibration ? 'glitch-viewport-entry' : 'opacity-0'}`}
          >
            <div className="flex justify-between items-center border-b-2 border-stone-800/10 pb-3">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold font-technical">SCROLL-BOUND VECTOR SIMULATOR</span>
                <h3 className="font-funky text-3xl font-extrabold text-stone-800 tracking-wide flex items-center gap-2">
                  <Activity className="w-6 h-6 animate-pulse text-[#ffa100]" /> SYSTEM CORE CALIBRATION
                </h3>
              </div>
              <div className="text-right text-[10px] font-mono text-stone-500 font-bold">
                GAUGE: [STABLE 60Hz]
              </div>
            </div>

            <p className="text-xs text-stone-600 font-technical leading-relaxed">
              Scroll up or down to calibrate the hardware vector coils. The SVG schema wireframe chip and micro-current electron lines dynamically rotate, translate, and cycle based on your scroll position in real-time.
            </p>

            {/* Interactive responsive SVG animation */}
            <div className="h-[140px] bg-stone-900 border-2 border-stone-800 rounded-xl relative overflow-hidden flex items-center justify-center p-2">
              <div className="absolute inset-0 pointer-events-none light-scanlines opacity-20" />
              
              {/* Dynamic Oscilloscope Waves */}
              <svg className="absolute inset-0 w-full h-full stroke-stone-600/30 stroke-1 fill-none">
                <line x1="0" y1="70" x2="100%" y2="70" />
                <line x1="50%" y1="0" x2="50%" y2="100%" />
              </svg>

              {/* Core Processor SVG rotating and translating on scroll */}
              <motion.svg 
                style={{ rotate: circuitRotation, x: circuitX }}
                className="w-24 h-24 z-10 origin-center"
                viewBox="0 0 100 100"
              >
                {/* Chip body */}
                <rect x="25" y="25" width="50" height="50" rx="8" className="stroke-[#39ff14] stroke-2 fill-stone-950 shadow-inner" />
                {/* Central silicon die */}
                <rect x="40" y="40" width="20" height="20" rx="4" className="stroke-[#ffa100] stroke-2 fill-stone-900" />
                {/* Pins */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <g key={i} transform={`rotate(${i * 90} 50 50)`}>
                    <line x1="50" y1="10" x2="50" y2="25" className="stroke-[#39ff14] stroke-2" />
                    <circle cx="50" cy="10" r="2" className="fill-[#39ff14]" />
                  </g>
                ))}
              </motion.svg>

              {/* Dynamic Wave Graph plotting on Scroll height */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-80">
                <motion.path 
                  d={`M 0,70 Q 100,20 200,120 T 400,70 T 600,70`}
                  className="stroke-[#39ff14] stroke-2 fill-none"
                  style={{ strokeWidth: 1.5 }}
                />
              </svg>

              {/* Float-by Telemetry Coordinates text updating on scroll */}
              <motion.div 
                style={{ y: coordinateY }}
                className="absolute right-3 top-2 text-[9px] font-mono text-[#39ff14] space-y-0.5 bg-stone-950/80 px-2 py-1 rounded border border-stone-800 z-20"
              >
                <p>SYS_ROT: {Math.floor(scrollYProgress.get() * 360)} DEG</p>
                <p>WAVE_AMP: {Math.floor(scrollYProgress.get() * 40)} V</p>
                <p>SECTOR: [0x{Math.floor(scrollYProgress.get() * 128).toString(16).toUpperCase()}]</p>
              </motion.div>
            </div>
          </Interactive3DCard>

          {/* Section 3: Projects */}
          <motion.div 
            id="projects-section-details" 
            onViewportEnter={() => setInViewSections(prev => ({ ...prev, projects: true }))}
            viewport={{ once: true, margin: "-100px" }}
            className={`space-y-4 ${inViewSections.projects ? 'glitch-viewport-entry' : 'opacity-0'}`}
          >
            <h2 className="font-funky text-4xl sm:text-5xl text-stone-800 flex items-center gap-2 tracking-wider">
              <motion.span
                animate={{ y: [0, -2, 2, 0], rotateX: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block"
              >
                <Database className="w-8 h-8" />
              </motion.span>
              <AnimatedSectionNumber num="03" textColor={styleSet.textColor} caretColor={styleSet.caretColor} />
              Projects & Dashboards
            </h2>
            <div className="space-y-6">
              {portfolioProjects.map((project, index) => (
                <Interactive3DCard 
                  key={project.id}
                  style={{ perspective: 1200 }}
                  className="border-2 border-stone-800 bg-[#faf8f5] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] rounded-xl space-y-4 relative overflow-hidden cursor-pointer hover:shadow-[10px_10px_20px_0px_rgba(0,0,0,0.15)] transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 border-b-2 border-stone-800/10 pb-3">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold font-technical">PROJECT_DOS_LOG_0{index + 1}</span>
                      <h3 className="text-xl font-black text-stone-800 mt-0.5 font-sans-grotesk">{project.title}</h3>
                    </div>
                    <span className={`self-start text-[11px] font-bold font-funky px-3 py-1 rounded-sm ${styleSet.badgeStyle}`}>
                      {project.category.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed font-technical">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((t) => (
                      <span key={t} className="bg-stone-100 text-stone-700 text-[10px] font-technical px-2.5 py-0.5 border border-stone-300 rounded font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 space-y-2 mt-2">
                    <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1 font-technical">Primary Outputs & Deliverables:</p>
                    {project.details.map((detail, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs text-stone-600 items-start leading-relaxed font-technical">
                        <span className={`text-sm leading-none font-bold ${styleSet.textColor}`}>•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive pipeline trigger */}
                  <div className="pt-4 border-t-2 border-stone-800/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                    <span className="text-[11px] text-stone-400 font-technical font-semibold">Ready to trace pipeline execution?</span>
                    <button
                      onClick={() => simulateProjectExecution(project.id)}
                      className={`cursor-pointer px-4 py-2 rounded-lg text-xs font-funky font-bold border-2 border-stone-800 flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all bg-white hover:bg-stone-50 ${styleSet.textColor}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> COMPILE & PLOT PIPELINE DATA
                    </button>
                  </div>

                  {/* Active Simulated Code Console inside Card */}
                  {runningProjectCode === project.id && activeProjectAnalysis && (
                    <div className="mt-4 bg-[#fcfbf9] border-2 border-dashed border-stone-400 p-4 rounded-xl shadow-inner relative">
                      <div className="flex justify-between items-center border-b border-stone-300 pb-2 mb-2.5 text-[10px] text-stone-500 font-technical">
                        <span>REPORT PRINTER OUTPUT // PLOTTER_STREAM_A</span>
                        <span className="text-[#c2410c] font-bold animate-pulse">● PLOTTING</span>
                      </div>
                      <pre className="text-xs text-stone-800 font-technical whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto">
                        {activeProjectAnalysis}
                        <span className="animate-pulse ml-0.5 font-bold">█</span>
                      </pre>
                    </div>
                  )}
                </Interactive3DCard>
              ))}
            </div>
          </motion.div>

          {/* Section 4: Communication Gateway (Contact Me) */}
          <motion.div 
            id="contact-section-details" 
            onViewportEnter={() => setInViewSections(prev => ({ ...prev, contact: true }))}
            viewport={{ once: true, margin: "-100px" }}
            className={`space-y-4 ${inViewSections.contact ? 'glitch-viewport-entry' : 'opacity-0'}`}
          >
            <h2 className="font-funky text-4xl sm:text-5xl text-stone-800 flex items-center gap-2 tracking-wider">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Network className="w-8 h-8 animate-pulse" />
              </motion.span>
              <AnimatedSectionNumber num="04" textColor={styleSet.textColor} caretColor={styleSet.caretColor} />
              Communications Gateway
            </h2>
            <Interactive3DCard 
              style={{ perspective: 1200 }}
              className="border-2 border-stone-800 bg-[#faf8f5] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] rounded-xl space-y-6 relative overflow-hidden cursor-pointer hover:shadow-[12px_12px_24px_0px_rgba(0,0,0,0.15)] transition-shadow duration-300"
            >
              <div className="border-b-2 border-stone-800/10 pb-3">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold font-technical">GATEWAY_CHANNEL_OPEN</span>
                <h3 className="text-xl font-black text-stone-800 mt-0.5 font-sans-grotesk">GET IN TOUCH / CONNECT</h3>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed font-technical">
                Ready to collaborate on full-stack web architectures, SQL databases, or interactive telemetry dashboards? Let's build something exceptional! Establish an external node link below:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* GitHub Connection */}
                <a 
                  href="https://github.com/workwithme2003-cmyk"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { if (isAudioActive) retroAudio.playBeep(900, 0.1); }}
                  className="group border-2 border-stone-800 bg-[#ffb703] p-4 rounded-xl flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-stone-900"
                >
                  <div className="p-2.5 rounded-lg border-2 border-stone-800 bg-white/50 group-hover:bg-white/80 transition-colors">
                    <FolderGit2 className="w-6 h-6 text-stone-900" />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-800/70 uppercase font-bold font-technical block">GITHUB NODE</span>
                    <span className="font-funky text-2xl font-bold tracking-wider text-stone-900 flex items-center gap-1.5">
                      workwithme2003-cmyk <ExternalLink className="w-4.5 h-4.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                </a>

                {/* LinkedIn Connection */}
                <a 
                  href="https://www.linkedin.com/in/akhil-pratap-chaudhary-307399319"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { if (isAudioActive) retroAudio.playBeep(900, 0.1); }}
                  className="group border-2 border-stone-800 bg-[#0077b5] p-4 rounded-xl flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-white"
                >
                  <div className="p-2.5 rounded-lg border-2 border-white/80 bg-white/10 group-hover:bg-white/30 transition-colors">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/70 uppercase font-bold font-technical block">LINKEDIN NODE</span>
                    <span className="font-funky text-2xl font-bold tracking-wider text-white flex items-center gap-1.5">
                      akhil-pratap-chaudhary <ExternalLink className="w-4.5 h-4.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                </a>
              </div>

              {/* Direct Mail */}
              <div className="pt-4 border-t-2 border-stone-800/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
                <div className="font-technical text-xs text-stone-500">
                  <span className="block font-bold">DIRECT MAIL GATEWAY:</span>
                  <a href="mailto:workwithme2003@gmail.com" className="hover:underline text-stone-800 font-extrabold text-sm">
                    workwithme2003@gmail.com
                  </a>
                </div>
                <a 
                  href="mailto:workwithme2003@gmail.com"
                  onClick={() => { if (isAudioActive) retroAudio.playBeep(950, 0.12); }}
                  className="cursor-pointer px-5 py-2.5 rounded-xl font-funky text-xl font-bold border-2 border-stone-800 bg-[#ffb703] hover:bg-[#ffb703]/90 text-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
                >
                  HIRE ME DIRECTLY
                </a>
              </div>
            </Interactive3DCard>
          </motion.div>
        </section>

        {/* Right Side: Interactive CLI Workspace */}
        <aside 
          id="retro-cli-workspace"
          className="w-full lg:w-[380px] flex flex-col z-20 lg:self-start lg:sticky lg:top-28 max-h-[calc(100vh-140px)]"
        >
          <div 
            onClick={handleTerminalClick}
            className="cursor-text border-2 border-stone-800 bg-[#faf8f5] rounded-2xl flex flex-col h-[400px] lg:h-[480px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] relative overflow-hidden"
          >
            {/* Horizontal Light Scanlines Overlay */}
            <div className="absolute inset-0 pointer-events-none mix-blend-multiply light-scanlines opacity-50 z-0" />

            {/* Terminal Window Header */}
            <div className="bg-[#f0ece5] px-4 py-3 flex justify-between items-center border-b-2 border-stone-800 select-none z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 border border-stone-800" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 border border-stone-800" />
                <span className="w-3 h-3 rounded-full bg-green-400 border border-stone-800" />
                <span className="text-xs font-black tracking-widest uppercase text-stone-600 ml-2 font-sans-grotesk">
                  interactive_cli.sys
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 border border-stone-400 rounded bg-[#e1ddd5] text-stone-600 font-technical font-bold">
                80x25 CO-SYS
              </span>
            </div>

            {/* Scrolling command output display area */}
            <div 
              id="cli-history-container"
              ref={historyContainerRef}
              className="flex-1 p-4 overflow-y-auto font-funky text-xl text-stone-800 space-y-3.5 flex flex-col justify-start z-10"
            >
              {/* Boot greetings */}
              <div className="text-sm font-technical text-stone-500 space-y-1">
                <p>AKHIL_PORTFOLIO [Version 4.19]</p>
                <p>(C) 1985-2026 Retro Computing Corporation.</p>
                <p className="text-stone-400">-----------------------------------------</p>
                <p>Type <strong className={`${styleSet.textColor} font-technical font-bold`}>"help"</strong> for active manual commands, or trigger dynamic project executions below.</p>
                <p className="text-stone-400">-----------------------------------------</p>
              </div>

              {/* Typed Commands Log */}
              {cliHistory.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 font-bold font-technical text-sm">C:\AKHIL_CHAUDHARY&gt;</span>
                    <span className="text-stone-950 font-bold tracking-wide">{item.command}</span>
                  </div>
                  {item.output && (
                    <div className="pl-4 border-l-2 border-stone-200 text-stone-700">
                      {item.output}
                    </div>
                  )}
                </div>
              ))}

              <div ref={terminalEndRef} />
            </div>

            {/* Input prompt footer */}
            <form 
              onSubmit={handleCommandSubmit}
              className="bg-[#f5f2eb] border-t-2 border-stone-800 p-3.5 flex items-center gap-2 select-none z-10"
            >
              <span className="text-stone-400 font-bold text-sm font-technical">C:\&gt;</span>
              <input
                id="retro-terminal-input"
                ref={inputRef}
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                onKeyDown={handleKeypressAudio}
                placeholder='Type "help", "about", "skills"...'
                className="flex-1 bg-transparent border-0 outline-none text-stone-900 font-funky text-2xl focus:ring-0 focus:outline-hidden p-0 placeholder-stone-400"
                style={{ caretColor: styleSet.caretColor }}
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>
        </aside>
      </main>

      {/* Static Scanline Overlay Custom CSS style */}
      <style>{`
        @keyframes grid-pan {
          from { background-position: 0 0; }
          to { background-position: 24px 24px; }
        }
        .bg-blueprint-light-animated {
          background-size: 24px 24px;
          background-image: 
            linear-gradient(to right, ${styleSet.gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${styleSet.gridColor} 1px, transparent 1px);
          animation: grid-pan 12s linear infinite;
        }

        @keyframes terminal-glitch-active {
          0% {
            opacity: 0;
            transform: translateY(30px) skewX(-12deg) scaleY(0.9);
            filter: contrast(1.4) brightness(1.7) hue-rotate(30deg);
            clip-path: inset(40% 0 30% 0);
          }
          12% {
            opacity: 0.5;
            transform: translateY(20px) skewX(15deg) scaleY(1.08);
            filter: contrast(1.2) brightness(1.3) hue-rotate(-30deg);
            clip-path: inset(10% 0 85% 0);
          }
          24% {
            opacity: 0.75;
            transform: translateY(12px) skewX(-8deg) scaleY(0.96);
            filter: contrast(1.1) brightness(1.1) invert(0.04);
            clip-path: inset(80% 0 5% 0);
          }
          36% {
            opacity: 0.88;
            transform: translateY(5px) skewX(4deg);
            filter: contrast(1.05) brightness(1.05);
            clip-path: inset(25% 0 35% 0);
          }
          48% {
            opacity: 0.96;
            transform: translateY(2px) skewX(-2deg);
            filter: none;
            clip-path: inset(0 0 0 0);
          }
          60% {
            opacity: 1;
            transform: translateY(0) skewX(0);
            filter: none;
            clip-path: inset(0);
          }
          100% {
            opacity: 1;
            transform: translateY(0) skewX(0);
            filter: none;
            clip-path: inset(0);
          }
        }

        .glitch-viewport-entry {
          animation: terminal-glitch-active 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
}
