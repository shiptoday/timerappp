export class AudioManager {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  async playBeep(frequency: number = 800, duration: number = 200): Promise<void> {
    if (!this.audioContext) {
      await this.initialize();
    }

    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Error playing beep:', error);
    }
  }

  vibrate(pattern: number | number[] = 200): void {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  async playTimerComplete(): Promise<void> {
    await this.playBeep(1000, 300);
    this.vibrate([200, 100, 200]);
  }

  async playSessionComplete(): Promise<void> {
    await this.playBeep(800, 200);
    setTimeout(() => this.playBeep(1000, 200), 300);
    setTimeout(() => this.playBeep(1200, 300), 600);
    this.vibrate([300, 100, 300, 100, 300]);
  }
}

export const audioManager = new AudioManager();
