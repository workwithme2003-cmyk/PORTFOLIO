/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class RetroAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private humNode: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private isEnabled: boolean = false;

  constructor() {
    // Sound is initially disabled to prevent browser policy warnings
  }

  private init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn('Web Audio API not supported in this browser:', e);
    }
  }

  public toggle(forceState?: boolean) {
    this.isEnabled = forceState !== undefined ? forceState : !this.isEnabled;
    this.init();

    if (this.isEnabled) {
      this.startHum();
    } else {
      this.stopHum();
    }
    return this.isEnabled;
  }

  public getEnabled() {
    return this.isEnabled;
  }

  private startHum() {
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stopHum(); // Ensure clean slate

      // CRT Hum: Combines 60Hz hum with a higher frequency whistle (15.75 kHz, scaled down slightly for human comfort)
      this.humNode = this.ctx.createOscillator();
      this.humNode.type = 'sine';
      this.humNode.frequency.setValueAtTime(60, this.ctx.currentTime); // 60Hz power line hum

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(120, this.ctx.currentTime);

      this.humGain = this.ctx.createGain();
      this.humGain.gain.setValueAtTime(0.005, this.ctx.currentTime); // Very quiet hum

      this.humNode.connect(lowpass);
      lowpass.connect(this.humGain);
      this.humGain.connect(this.ctx.destination);

      this.humNode.start();
    } catch (e) {
      console.error('Failed to start hum:', e);
    }
  }

  private stopHum() {
    try {
      if (this.humNode) {
        this.humNode.stop();
        this.humNode.disconnect();
        this.humNode = null;
      }
      if (this.humGain) {
        this.humGain.disconnect();
        this.humGain = null;
      }
    } catch (e) {
      // Ignore errors from stopping inactive nodes
    }
  }

  public playKey() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      
      // Synthesis of a short, mechanical key click
      // We combine a short sine click with some noise
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      
      // Pitch is randomized slightly to sound natural
      const freq = 350 + Math.random() * 150;
      osc.frequency.setValueAtTime(freq, now);
      
      // High frequency component for the metal "snap"
      const snap = this.ctx.createOscillator();
      snap.type = 'sine';
      snap.frequency.setValueAtTime(4000, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      snap.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      snap.start(now);
      osc.stop(now + 0.06);
      snap.stop(now + 0.04);
    } catch (e) {
      // Fail silently
    }
  }

  public playBeep(pitch: number = 800, duration: number = 0.1) {
    if (!this.isEnabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Fail silently
    }
  }

  public playFloppySeek() {
    if (!this.isEnabled || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      
      // Create a grinding/stepping disk seek sound (a series of pulse beeps)
      for (let i = 0; i < 4; i++) {
        const t = now + i * 0.12;
        const osc = this.ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150 - i * 15, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.03, t);
        gain.gain.setValueAtTime(0, t + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
      }
    } catch (e) {
      // Fail silently
    }
  }
}

export const retroAudio = new RetroAudioSynthesizer();
export default retroAudio;
