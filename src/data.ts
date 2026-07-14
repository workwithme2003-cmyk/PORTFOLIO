/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Skill, Education, BootStep } from './types';

export const portfolioEducation: Education = {
  degree: 'Bachelor of Technology (B.Tech)',
  institution: 'PSIT Kanpur',
  specialization: 'Artificial Intelligence & Machine Learning (AI & ML)',
  duration: '2024 - 2028',
  gpa: '8 out of 10 CGPA',
  highlights: [
    'Advanced research on neural architectures and cloud deployment strategies',
    'Core coursework in Database Management, Web Integration, and Advanced Python',
    'Completed specializations in Full-Stack web architecture, cloud systems, and data routing',
    'Active member of the Technical Developers Club and Database Analytics Circle'
  ]
};

export const portfolioSkills: Skill[] = [
  { name: 'Web Development', category: 'framework', level: 92, details: 'ReactJS, NodeJS, Express, Tailwind CSS, WebSockets, REST APIs' },
  { name: 'Python', category: 'language', level: 90, details: 'Data manipulation, Pandas, NumPy, Scikit-learn' },
  { name: 'SQL', category: 'database', level: 88, details: 'Complex querying, joins, window functions, schema optimizations' },
  { name: 'Power BI', category: 'tool', level: 85, details: 'Dynamic dashboards, DAX queries, ETL pipelines, and data modeling' },
  { name: 'Git & GitHub', category: 'tool', level: 85, details: 'Collaborative code gating, version branch control, CI/CD pipelines' },
  { name: 'Data Visualization', category: 'tool', level: 85, details: 'Matplotlib, Seaborn, custom telemetry chart plots' },
  { name: 'Excel (Advanced)', category: 'tool', level: 78, details: 'Pivot intelligence, power queries, lookup integrations' }
];

export const portfolioProjects: Project[] = [
  {
    id: 'celestia',
    title: 'Celestia: Astronomical Exploration Platform',
    description: 'A premium, high-fidelity website-based space telemetry and astronomical visualization hub featuring real-time orbital calculations.',
    category: 'web',
    tech: ['ReactJS', 'Tailwind CSS', 'motion', 'Lucide Icons', 'HTML5 Canvas'],
    details: [
      'Rendered fluid planetary trajectories and system simulations using physics-driven mathematical models.',
      'Designed an intuitive, bento-grid styled cosmic telemetry dashboard with interactive coordinate selectors.',
      'Crafted custom glassmorphism visual controllers, interactive star-map scales, and clean dark/light mode transitions.',
      'Optimized layout rendering workflows to maintain 60 FPS performance across all client devices.'
    ]
  },
  {
    id: 'anondoubt',
    title: 'AnonDoubt: Doubt Solving Hub',
    description: 'An anonymous, real-time peer-to-peer doubt-solving platform designed to securely link students with domain expert mentors.',
    category: 'web',
    tech: ['ReactJS', 'NodeJS', 'Express', 'Socket.io', 'Tailwind CSS', 'SQL'],
    details: [
      'Engineered a fast instant matching queue with sub-100ms response dispatch latency using WebSockets.',
      'Structured anonymous messaging systems with temporary chat session storage and real-time active indicators.',
      'Implemented full markdown output rendering, image payload transfer gating, and active room statistics tracking.',
      'Designed secure SQL database schemas to handle concurrent student queues and persistent feedback records.'
    ]
  }
];

export const bootSequence: BootStep[] = [
  { text: 'BIOS Version 4.19 (C) 1985-2026 RetroTech Inc.', delay: 100, type: 'info' },
  { text: 'RAM Test: 640KB OK // Extended Memory: 16384KB OK', delay: 150, type: 'info' },
  { text: 'Checking Floppy Drive A: ... Ready', delay: 200, type: 'info' },
  { text: 'Hard Disk C: [SYSTEM_DISK] Partition 1 Active (120MB)', delay: 120, type: 'info' },
  { text: 'Booting MS-DOS 6.22 / Retro Terminal Shell...', delay: 100, type: 'info' },
  { text: 'Loading MOUSE.SYS ... Driver Installed', delay: 80, type: 'info' },
  { text: 'Loading HIMEM.SYS ... Upper Memory Area Configured', delay: 80, type: 'info' },
  { text: 'Establishing Network Link ...', delay: 250, type: 'info' },
  { text: 'Host IP: 192.168.1.100 // Connection Secure', delay: 150, type: 'success' },
  { text: 'Initializing CRT Deflection Coils (V-HOLD/H-HOLD)...', delay: 200, type: 'info' },
  { text: 'Flicker Calibration: Success (60Hz Refresh Detected)', delay: 120, type: 'success' },
  { text: 'DECRYPTING PORTFOLIO DATA ENVELOPE...', delay: 180, type: 'warning' },
  { text: 'SUCCESS: Credentials decrypted.', delay: 100, type: 'success' },
  { text: 'Executing AUTOEXEC.BAT ...', delay: 100, type: 'info' },
  { text: 'SYSTEM ACCESS GRANTED || AP_CHAUDHARY_INIT', delay: 300, type: 'success' }
];

export const helpCommands = [
  { name: 'help', desc: 'Display all available terminal commands' },
  { name: 'about', desc: 'Display introduction and resume summary of Akhil' },
  { name: 'education', desc: 'Display details on B.Tech in AI & ML' },
  { name: 'skills', desc: 'Display list of technical competencies and levels' },
  { name: 'projects', desc: 'Display active projects list (use e.g. "project 1")' },
  { name: 'matrix', desc: 'Trigger or halt matrix code rain screen' },
  { name: 'theme', desc: 'Cycle screen phosphor colors' },
  { name: 'audio', desc: 'Toggle keyboard click and hum sound synthesis' },
  { name: 'clear', desc: 'Purge the screen memory buffer' }
];
