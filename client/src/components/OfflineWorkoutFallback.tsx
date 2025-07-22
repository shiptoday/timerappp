import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { Button } from './ui/button';
import { Wifi, WifiOff, Download } from 'lucide-react';

interface OfflineWorkoutFallbackProps {
  workoutType?: string;
  onRetry?: () => void;
}

const DEFAULT_WORKOUTS = {
  mobility: {
    name: "Mobility Flow",
    steps: [
      { name: "Cat-Cow Pose", duration: 30 },
      { name: "Shoulder Circles", duration: 30 },
      { name: "Hip Circles", duration: 30 },
      { name: "Arm Swings", duration: 30 },
      { name: "Leg Swings", duration: 30 },
      { name: "Neck Rolls", duration: 30 },
      { name: "Ankle Circles", duration: 30 },
      { name: "Deep Breathing", duration: 60 }
    ]
  },
  hangboard: {
    name: "Basic Hangboard",
    steps: [
      { name: "Half-Crimp Hang", duration: 10 },
      { name: "3-Finger Open Hand", duration: 10 },
      { name: "Pocket Hang #1", duration: 8 },
      { name: "Pocket Hang #2", duration: 8 },
      { name: "Half-Crimp Hang", duration: 10 },
      { name: "3-Finger Open Hand", duration: 10 }
    ]
  }
};

export function OfflineWorkoutFallback({ workoutType, onRetry }: OfflineWorkoutFallbackProps) {
  const { isOffline } = useOfflineStatus();

  if (!isOffline) {
    return null;
  }

  const defaultWorkout = workoutType ? DEFAULT_WORKOUTS[workoutType as keyof typeof DEFAULT_WORKOUTS] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <WifiOff size={48} className="mx-auto text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            You're Offline
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {defaultWorkout 
              ? "Don't worry! You can still do a basic workout offline."
              : "Connect to the internet to access your full workout library."
            }
          </p>
        </div>

        {defaultWorkout && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Available Offline: {defaultWorkout.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {defaultWorkout.steps.length} exercises • {defaultWorkout.steps.reduce((acc, step) => acc + step.duration, 0)} seconds total
            </p>
            <Button 
              onClick={() => {
                // Navigate to session with default workout
                window.location.href = `/session/${workoutType}`;
              }}
              className="w-full"
            >
              <Download size={16} className="mr-2" />
              Start Offline Workout
            </Button>
          </div>
        )}

        <div className="space-y-3">
          <Button 
            onClick={onRetry}
            variant="outline" 
            className="w-full"
            disabled={isOffline}
          >
            <Wifi size={16} className="mr-2" />
            Try Again
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Your progress will sync when you're back online
          </p>
        </div>
      </div>
    </div>
  );
}

export default OfflineWorkoutFallback;