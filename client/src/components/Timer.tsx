import { useTimer } from '../hooks/useTimer';
import { cn } from '../lib/utils';
import { useEffect } from 'react';

interface TimerProps {
  duration: number;
  onComplete?: () => void;
  isRunning?: boolean;
  isPaused?: boolean;
  className?: string;
  color?: string;
  onReset?: boolean;
  onAddTime?: (seconds: number) => void;
}

export function Timer({ 
  duration, 
  onComplete, 
  isRunning = false,
  isPaused = false,
  className,
  color = '#10B981',
  onReset = false,
  onAddTime
}: TimerProps) {
  const timer = useTimer({ 
    initialTime: duration, 
    onComplete, 
    autoStart: false 
  });

  // Sync external controls with timer
  useEffect(() => {
    if (isRunning && !isPaused) {
      timer.start();
    } else if (isPaused) {
      timer.pause();
    }
  }, [isRunning, isPaused]);

  // Reset timer when duration changes
  useEffect(() => {
    timer.reset(duration);
  }, [duration]);

  // Handle external reset
  useEffect(() => {
    if (onReset) {
      timer.reset(duration);
    }
  }, [onReset, duration]);

  // Expose addTime function to parent
  useEffect(() => {
    if (onAddTime) {
      (window as any).timerAddTime = (seconds: number) => timer.addTime(seconds);
    }
  }, [onAddTime, timer.addTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (duration - timer.currentTime) / duration : 0;
  const circumference = 2 * Math.PI * 42; // Updated to match the radius
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className={cn('relative w-full flex justify-center', className)}>
      <div className="relative w-80 h-80 sm:w-72 sm:h-72">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="#E5E7EB" 
            strokeWidth="4" 
            fill="none"
            className="opacity-30"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke={color} 
            strokeWidth="4" 
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-6xl sm:text-5xl font-light text-gray-900 dark:text-gray-100 mb-2 leading-none tracking-tight">
              {formatTime(timer.currentTime)}
            </div>
            <div className="text-base sm:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              {timer.isComplete ? 'Complete' : isPaused ? 'Paused' : 'Remaining'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
