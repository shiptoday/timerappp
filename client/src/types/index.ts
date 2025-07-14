export interface SessionStep {
  id: string;
  name: string;
  duration: number; // in seconds
  instructions: string;
  type: 'exercise' | 'rest' | 'warmup';
  imageUrl?: string;
}

export interface LogEntry {
  id: string;
  date: string;
  sessionType: 'mobility' | 'hangboard';
  completedExercises: string[];
  totalTime: number; // in seconds
  completedAt: string;
}

export interface WorkoutSession {
  type: 'mobility' | 'hangboard';
  steps: SessionStep[];
  totalDuration: number;
}

export interface TimerState {
  currentTime: number;
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
}

export interface HangboardSet {
  grip: string;
  description: string;
  hangTime: number;
  restTime: number;
  sets: number;
}
