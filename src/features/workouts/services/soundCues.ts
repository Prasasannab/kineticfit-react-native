import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * KineticFit - Audio & Tactile Cue Engine
 *
 * Provides synthesized acoustic cues and haptic patterns for interval training:
 * - 3-2-1 Countdown Ticks
 * - Work Interval Start Bells
 * - Rest Interval Notifications
 * - Routine Victory Chimes
 */

class AudioCueEngine {
  private isMuted: boolean = false;
  private audioCtx: any = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      } catch {
        // Fallback gracefully if Web Audio is unavailable
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private playTone(frequency: number, durationSec: number, type: OscillatorType = 'sine') {
    if (this.isMuted || !this.audioCtx) return;

    try {
      if (this.audioCtx.state === 'suspended') {
        void this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + durationSec);
    } catch {
      // Audio playback no-ops gracefully on unsupported platform states
    }
  }

  /**
   * Countdown Tick (3, 2, 1)
   */
  public playCountdownTick() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    this.playTone(660, 0.12, 'sine');
  }

  /**
   * Work Interval Start (High-energy double beep)
   */
  public playWorkStart() {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    this.playTone(880, 0.25, 'triangle');
  }

  /**
   * Rest Interval Transition
   */
  public playRestStart() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    this.playTone(440, 0.35, 'sine');
  }

  /**
   * Routine Complete Victory
   */
  public playVictory() {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (this.isMuted || !this.audioCtx) return;

    // Arpeggio chord (C5, E5, G5, C6)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.4, 'triangle');
      }, idx * 120);
    });
  }
}

export const soundCueEngine = new AudioCueEngine();
