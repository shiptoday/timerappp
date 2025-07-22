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
    return '#000000';
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
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-3xl py-4 text-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/20 min-h-[56px] active:scale-[0.98] max-w-xs"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen safe-area-top safe-area-bottom">
      {/* Progress Bar */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Exercise {currentStepIndex + 1} of {session?.steps.length}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(((currentStepIndex + 1) / (session?.steps.length || 1)) * 100)}%
          </span>
        </div>
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / (session?.steps.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Exercise Display */}
      <main className="px-4 py-6 text-center relative min-h-[calc(100vh-220px)] flex flex-col">
        {/* Exercise Name */}
        <h2 
          className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-gray-100 mb-6 px-2 cursor-pointer select-none"
          onClick={handleExerciseNameTap}
        >
          {isTransitionPhase ? 'Rest & Prepare' : currentStep?.name}
          {!isTransitionPhase && (
            <span className="block text-xs text-gray-400 dark:text-gray-500 mt-2">
              Double tap to skip →
            </span>
          )}
        </h2>

        {/* Hangboard Grip Image */}
        {sessionType === 'hangboard' && currentStep && !isTransitionPhase && (
          <div className="mb-6 h-32 flex items-center justify-center flex-shrink-0">
            {getHangboardImage(currentStep.name) ? (
              <img 
                src={getHangboardImage(currentStep.name)} 
                alt={currentStep.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
          </div>
        )}

        {/* Timer Display - Now Much Larger */}
        <div className="flex-1 flex items-center justify-center relative min-h-[320px]">
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
          {/* +15sec Button - Now positioned better for larger timer */}
          {isRunning && !isTransitionPhase && (
            <Button
              onClick={addExtraTime}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full shadow-lg min-h-[44px] min-w-[44px] font-medium"
              size="sm"
              aria-label={`Add ${sessionType === 'hangboard' ? '10' : '15'} seconds`}
            >
              +{sessionType === 'hangboard' ? '10' : '15'}s
            </Button>
          )}
        </div>

        {/* Next Exercise Preview - Repositioned for better mobile layout */}
        {getNextStep() && (
          <div className="mt-4 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm border dark:border-gray-700 mx-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Next Exercise</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{getNextStep()?.name}</p>
          </div>
        )}
      </main>

      {/* Session Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 safe-area-bottom">
        <div className="max-w-md mx-auto">
          {/* Main Action Button - Now Pause/Resume */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={toggleTimer}
              className={`flex-1 py-4 text-lg font-semibold rounded-xl transition-all duration-200 min-h-[56px] shadow-lg ${
                isPaused
                ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-green-500/20'
                : isRunning
                ? 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white shadow-orange-500/20'
                : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-green-500/20'
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
            
            {/* Small End Session Button */}
            {(isRunning || isPaused) && (
              <Button 
                onClick={handleEndSessionClick}
                variant="outline"
                className="w-12 h-12 rounded-lg border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 p-0"
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
