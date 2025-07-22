// Import sound files
import nextSoundUrl from '@assets/next_1753213600709.mp3';
import finishSoundUrl from '@assets/finish_1753213600708.m4a';
import pauseSoundUrl from '@assets/pause_1753213600709.mp3';

export class AudioManager {
  private nextSound: HTMLAudioElement | null = null;
  private finishSound: HTMLAudioElement | null = null;
  private pauseSound: HTMLAudioElement | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize audio elements
      this.nextSound = new Audio(nextSoundUrl);
      this.finishSound = new Audio(finishSoundUrl);
      this.pauseSound = new Audio(pauseSoundUrl);

      // Set volume levels
      this.nextSound.volume = 0.6;
      this.finishSound.volume = 0.7;
      this.pauseSound.volume = 0.5;

      // Preload audio files
      this.nextSound.preload = 'auto';
      this.finishSound.preload = 'auto';
      this.pauseSound.preload = 'auto';

      this.isInitialized = true;
    } catch (error) {
      console.warn('Error initializing sounds:', error);
    }
  }

  async playTimerComplete(): Promise<void> {
    // This is used for exercise transitions
    await this.initialize();
    this.playSound(this.nextSound);
    this.vibrate([200, 100, 200]);
  }

  async playSessionComplete(): Promise<void> {
    // This is used when the entire session is finished
    await this.initialize();
    this.playSound(this.finishSound);
    this.vibrate([300, 100, 300, 100, 300]);
  }

  async playButtonPress(): Promise<void> {
    // This is used for button interactions (stop/pause)
    await this.initialize();
    this.playSound(this.pauseSound);
  }

  async playPause(): Promise<void> {
    // This is used for pause button
    await this.initialize();
    this.playSound(this.pauseSound);
  }

  async playNext(): Promise<void> {
    // This is used for resume/next
    await this.initialize();
    this.playSound(this.nextSound);
  }

  private playSound(audio: HTMLAudioElement | null) {
    if (!audio) return;

    try {
      // Reset audio to beginning
      audio.currentTime = 0;
      // Play the sound
      audio.play().catch(error => {
        console.log('Error playing sound:', error);
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  }

  vibrate(pattern: number | number[] = 200): void {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
}

export const audioManager = new AudioManager();