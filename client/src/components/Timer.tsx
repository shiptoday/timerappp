import { useTimer } from '../hooks/useTimer';
import { cn } from '../lib/utils';

interface TimerProps {
  duration: number;
  onComplete?: () => void;
  isRunning?: boolean;
  className?: string;
  color?: string;
}

export function Timer({ 
  duration, 
  onComplete, 
  isRunning = false, 
  className,
  color = '#10B981'
}: TimerProps) {
  const timer = useTimer({ 
    initialTime: duration, 
    onComplete, 
    autoStart: isRunning 
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (duration - timer.currentTime) / duration : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className={cn('relative', className)}>
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="#E5E7EB" 
            strokeWidth="6" 
            fill="none"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke={color} 
            strokeWidth="6" 
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-neutral mb-1">
              {formatTime(timer.currentTime)}
            </div>
            <div className="text-sm text-gray-500">
              {timer.isComplete ? 'complete' : timer.isPaused ? 'paused' : 'remaining'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
