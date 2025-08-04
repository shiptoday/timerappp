import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Timer } from '../components/Timer';
import { getWorkoutSession } from '../lib/data';
import { getExerciseImage } from '../lib/exerciseImages';
import { workoutStorage } from '../lib/storage';
import { audioManager } from '../lib/audio';
import halfCrimpImg from '@assets/half crimp_1753216683487.png';
import openHandImg from '@assets/3-finger open hand_1753216683487.png';
import pocket1Img from '@assets/pocket1_1753216683488.png';
import pocket2Img from '@assets/pocket2_1753216683488.png';
import pocket3Img from '@assets/pocket3_1753216683488.png';
import { SessionStep, LogEntry } from '../types';
import { Play, Home, RotateCcw } from 'lucide-react';

export default function Session() {
  const params = useParams<{ type: string }>();
  const [, navigate] = useLocation();
  
  const sessionType = params.type as string;
  const session = getWorkoutSession(sessionType);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [sessionStartTime] = useState(Date.now());
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [isSessionCancelled, setIsSessionCancelled] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isTransitionPhase, setIsTransitionPhase] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);

  const currentStep = session?.steps[currentStepIndex];

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }

    // Initialize audio
    audioManager.initialize();
  }, [session, navigate]);

  useEffect(() => {
    // Track total elapsed time
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTotalElapsedTime(Date.now() - sessionStartTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, sessionStartTime]);

  const handleTimerComplete = () => {
    if (currentStep) {
      setCompletedSteps(prev => [...prev, currentStep.id]);
    }
    
    if (currentStepIndex < (session?.steps.length || 0) - 1) {
      // Play completion beep and start 10-second transition
      audioManager.playTimerComplete();
      setIsTransitionPhase(true);
      setIsRunning(true); // Keep running for transition timer
      setIsPaused(false);
    } else {
      // Session complete
      finishSession();
    }
  };

  const handleTransitionComplete = () => {
    // Move to next exercise and auto-start
    setIsTransitionPhase(false);
    setCurrentStepIndex(prev => prev + 1);
    setIsRunning(true);
    setIsPaused(false);
    // No sound here - transition sound only plays when exercise completes
  };

  const skipToNext = () => {
    if (currentStep) {
      setCompletedSteps(prev => [...prev, currentStep.id]);
    }
    
    if (currentStepIndex < (session?.steps.length || 0) - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsTransitionPhase(false); // Skip transition phase
      setIsRunning(true);
      setIsPaused(false);
      audioManager.playTimerComplete();
    } else {
      finishSession();
    }
  };

  const handleExerciseNameTap = () => {
    const now = Date.now();
    if (now - lastTapTime < 300) { // Double tap within 300ms
      skipToNext();
    }
    setLastTapTime(now);
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const toggleTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
      // Play beep when starting exercise
      audioManager.playTimerComplete();
    } else {
      if (isPaused) {
        // Resuming - play button press sound, not transition sound
        audioManager.playButtonPress();
      } else {
        // Pausing - play pause sound
        audioManager.playPause();
      }
      setIsPaused(!isPaused);
    }
  };

  const finishSession = (cancelled = false) => {
    setIsRunning(false);
    setShowCancelDialog(false);
    
    if (cancelled) {
      setIsSessionCancelled(true);
    } else {
      setIsSessionComplete(true);
      // Save workout log only if completed
      const logEntry: Omit<LogEntry, 'id'> = {
        date: new Date().toISOString().split('T')[0],
        sessionType: sessionType as any,
        completedExercises: completedSteps,
        totalTime: Math.floor(totalElapsedTime / 1000),
        completedAt: new Date().toISOString()
      };

      workoutStorage.addLog(logEntry);
      audioManager.playSessionComplete();
    }
  };

  const handleEndSessionClick = () => {
    audioManager.playButtonPress();
    setShowCancelDialog(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextStep = () => {
    if (!session) return null;
    
    if (currentStepIndex < session.steps.length - 1) {
      return session.steps[currentStepIndex + 1];
    }
    return null;
  };

  const getSessionColor = () => {
    switch (sessionType) {
      case 'mobility':
        return '#667eea'; // Gradient start color for mobility
      case 'hangboard':
        return '#f093fb'; // Gradient start color for hangboard
      default:
        return '#4facfe'; // Timer gradient start color
    }
  };

  const getHangboardImage = (exerciseName: string): string | null => {
    if (exerciseName.includes('Half‑Crimp')) {
      return halfCrimpImg;
    }
    if (exerciseName.includes('3‑Finger Open')) {
      return openHandImg;
    }
    if (exerciseName.includes('Pocket Hang #1')) {
      return pocket1Img;
    }
    if (exerciseName.includes('Pocket Hang #2')) {
      return pocket2Img;
    }
    if (exerciseName.includes('Pocket Hang #3')) {
      return pocket3Img;
    }
    return null;
  };

  const addExtraTime = () => {
    const seconds = sessionType === 'hangboard' ? 10 : 15;
    if ((window as any).timerAddTime) {
      (window as any).timerAddTime(seconds);
    }
    audioManager.playButtonPress();
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  if (isSessionComplete || isSessionCancelled) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen safe-area-top safe-area-bottom flex flex-col items-center justify-center p-6 text-center">
        {/* Status Icon */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${
          isSessionComplete 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          {isSessionComplete ? (
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Status Text */}
        <h2 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">
          {isSessionComplete ? 'Done' : 'Cancelled'}
        </h2>
        
        {/* Duration */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          {formatTime(Math.floor(totalElapsedTime / 1000))}
        </p>
        
        {/* Back to Home Button */}
        <Button 
          onClick={() => navigate('/')}
          className="w-full gradient-timer hover:opacity-90 text-white rounded-3xl py-4 text-lg font-medium button-beautiful shadow-lg shadow-blue-500/20 min-h-[56px] max-w-xs"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-gray-50/80 dark:bg-gray-950/80 min-h-screen iPhone-16-optimized iPhone-pro-optimized backdrop-blur-xl" style={{ minHeight: '100dvh' }}>
      
      {/* Premium header section */}
      <div className="px-4 pb-1">
        
        {/* Elegant progress indicator */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-white/60 dark:border-gray-700/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getSessionColor() }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {sessionType === 'mobility' ? 'Mobility Training' : 'Hangboard Training'}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {currentStepIndex + 1} / {session?.steps.length}
            </span>
          </div>
          
          {/* Modern progress bar */}
          <div className="h-2 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${((currentStepIndex + 1) / (session?.steps.length || 1)) * 100}%`,
                background: `linear-gradient(90deg, ${getSessionColor()} 0%, ${getSessionColor()}80 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Current Exercise Display */}
      <main className="px-4 py-2 flex-1 flex flex-col overflow-hidden">
        
        {/* Exercise card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/60 dark:border-gray-700/60 mb-3">
          
          {/* Exercise name and skip hint */}
          <div 
            className="text-center mb-2 cursor-pointer select-none group"
            onClick={handleExerciseNameTap}
          >
            <h2 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-1">
              {isTransitionPhase ? 'Rest & Prepare' : currentStep?.name}
            </h2>
            {!isTransitionPhase && (
              <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                Double tap to skip →
              </p>
            )}
          </div>

          {/* Exercise Image - Optimized for mobile screen */}
          {currentStep && !isTransitionPhase && (
            <div className="mb-3 h-32 flex items-center justify-center">
              {(() => {
                let imageUrl: string | null = null;
                
                if (sessionType === 'hangboard') {
                  imageUrl = getHangboardImage(currentStep.name);
                } else {
                  imageUrl = getExerciseImage(currentStep.name) || null;
                }
                
                return imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={currentStep.name}
                    className="max-h-full max-w-full object-contain rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Timer Display */}
        <div className="flex-1 flex items-center justify-center">
          <Timer
            key={isTransitionPhase ? `transition-${currentStepIndex}` : `exercise-${currentStepIndex}-${currentStep?.duration}`}
            duration={isTransitionPhase ? 3 : (currentStep?.duration || 0)}
            onComplete={isTransitionPhase ? handleTransitionComplete : handleTimerComplete}
            isRunning={isRunning}
            isPaused={isPaused}
            color={isTransitionPhase ? "#10B981" : getSessionColor()}
            onReset={false}
            onAddTime={!isTransitionPhase ? addExtraTime : undefined}
          />
        </div>

        {/* Add time button */}
        {isRunning && !isTransitionPhase && (
          <div className="flex justify-center mb-2">
            <Button
              onClick={addExtraTime}
              variant="outline"
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/60 dark:border-gray-700/60 hover:bg-white/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded-full shadow-lg font-medium transition-all text-sm"
              size="sm"
              aria-label={`Add ${sessionType === 'hangboard' ? '10' : '15'} seconds`}
            >
              +{sessionType === 'hangboard' ? '10' : '15'}s
            </Button>
          </div>
        )}

        {/* Next Exercise Preview - Clear and Easy to Read */}
        {getNextStep() && (
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-3 border border-white/60 dark:border-gray-700/60 shadow-lg">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next Exercise</p>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                {getNextStep()?.name}
              </h3>
            </div>
          </div>
        )}
      </main>

      {/* Session Controls */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-white/60 dark:border-gray-700/60 p-4" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-md mx-auto">
          
          <div className="flex items-center gap-3">
            {/* Main action button */}
            <Button 
              onClick={toggleTimer}
              className={`flex-1 py-4 text-lg font-medium rounded-2xl min-h-[56px] shadow-lg transition-all duration-300 border ${
                isPaused
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/25'
                : isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400 shadow-amber-500/25'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/25'
              }`}
              aria-label={isPaused ? "Resume timer" : isRunning ? "Pause timer" : "Start timer"}
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </>
              ) : isRunning ? (
                <>
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </>
              )}
            </Button>
            
            {/* End session button */}
            {(isRunning || isPaused) && (
              <Button 
                onClick={handleEndSessionClick}
                variant="outline"
                className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-white/60 dark:border-gray-700/60 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 shadow-lg"
                aria-label="End session"
              >
                ✕
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 text-center">
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
              End Workout?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Your progress won't be saved if you end early.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowCancelDialog(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Keep Going
              </Button>
              <Button 
                onClick={() => finishSession(true)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                End Workout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
