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
    } else if (!isRunning) {
      timer.pause();
    }
  }, [isRunning, isPaused, timer.start, timer.pause]);

  // Reset timer when duration changes (but preserve current time when just pausing/resuming)
  useEffect(() => {
    // Only reset if duration actually changed, not just pause/resume
    if (timer.currentTime > duration || timer.currentTime === 0) {
      timer.reset(duration);
      // If should be running after reset, start it
      if (isRunning && !isPaused) {
        setTimeout(() => timer.start(), 50);
      }
    }
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
    <div className={cn('relative w-full flex justify-center items-center', className)}>
      <div className="relative">
        
        {/* Premium floating card design - optimized for mobile */}
        <div className="relative w-64 h-64 sm:w-60 sm:h-60">
          
          {/* Main timer card with modern depth */}
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.12)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/60 dark:border-gray-700/60">
            
            {/* Subtle gradient overlay */}
            <div 
              className="absolute inset-0 rounded-[3rem] opacity-[0.03]"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, transparent 50%, ${color} 100%)`
              }}
            />
            
            {/* Minimal progress ring */}
            <div className="absolute inset-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Track - very subtle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="currentColor" 
                  strokeWidth="1" 
                  fill="none"
                  className="text-gray-200/40 dark:text-gray-700/40"
                />
                
                {/* Progress - clean and minimal */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke={color}
                  strokeWidth="2" 
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
                  className="transition-all duration-1000 ease-out opacity-80"
                />
              </svg>
            </div>
            
            {/* Central content - minimal design */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              
              {/* Main time display - clean and minimal */}
              <div className="text-4xl sm:text-3xl font-extralight text-gray-900 dark:text-gray-50 tabular-nums tracking-tight text-optimized">
                {formatTime(timer.currentTime)}
              </div>
              
              {/* Only show status when paused or complete */}
              {(isPaused || timer.isComplete) && (
                <div className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {timer.isComplete ? 'Complete' : 'Paused'}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
