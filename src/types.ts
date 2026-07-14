/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  details: string[];
  tech: string[];
  link?: string;
  category: 'ml' | 'data' | 'visualization' | 'web';
}

export interface Skill {
  name: string;
  category: 'language' | 'database' | 'tool' | 'framework';
  level: number; // 0-100
  details?: string;
}

export interface Education {
  degree: string;
  institution: string;
  duration: string;
  gpa: string;
  specialization: string;
  highlights: string[];
}

export interface BootStep {
  text: string;
  delay: number;
  type: 'info' | 'success' | 'warning' | 'error';
}

export type TerminalTheme = 'classic-green' | 'amber-glow' | 'cyber-cyan' | 'matrix-white';
