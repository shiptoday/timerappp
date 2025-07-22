import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Timer } from '../components/Timer';
import { getWorkoutSession } from '../lib/data';
import { getExerciseImage } from '../lib/exerciseImages';
import { workoutStorage } from '../lib/storage';
import { audioManager } from '../lib/audio';
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
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

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
    nextStep();
  };

  const nextStep = () => {
    if (!session) return;
    
    if (currentStepIndex < session.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      finishSession();
    }
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
    } else {
      setIsPaused(!isPaused);
    }
  };

  const finishSession = () => {
    setIsRunning(false);
    setIsSessionComplete(true);
    
    // Save workout log
    const logEntry: Omit<LogEntry, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      sessionType: sessionType as any,
      completedExercises: completedSteps,
      totalTime: Math.floor(totalElapsedTime / 1000),
      completedAt: new Date().toISOString()
    };

    workoutStorage.addLog(logEntry);
    audioManager.playSessionComplete();
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

  const addFifteenSeconds = () => {
    if ((window as any).timerAddTime) {
      (window as any).timerAddTime(15);
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  if (isSessionComplete) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <header className="bg-black text-white px-6 py-16 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-light mb-4">Complete</h1>
          <p className="text-gray-300 capitalize">
            {sessionType} session finished
          </p>
        </header>

        <main className="p-6 text-center">
          <div className="space-y-8 mb-12">
            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Duration</p>
              <p className="text-2xl font-light text-gray-800">{formatTime(Math.floor(totalElapsedTime / 1000))}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Exercises</p>
              <p className="text-2xl font-light text-gray-800">
                {completedSteps.length}/{session.steps.length}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-none py-4 font-light transition-colors"
            >
              Home
            </Button>
            
            <Button 
              onClick={() => navigate(`/session/${sessionType}`)}
              className="w-full bg-white hover:bg-gray-50 text-black border border-gray-200 rounded-none py-4 font-light transition-colors"
            >
              Start Again
            </Button>
          </div>
        </main>
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
        <h2 className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-gray-100 mb-6 px-2">
          {currentStep?.name}
        </h2>

        {/* Exercise Position Image */}
        <div className="mb-6 h-32 flex items-center justify-center flex-shrink-0">
          {currentStep && getExerciseImage(currentStep.name, currentStep.imageKey) ? (
            <img 
              src={getExerciseImage(currentStep.name, currentStep.imageKey)} 
              alt={currentStep.name}
              className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-gray-300 dark:text-gray-600 text-xs">No image available</div>
          )}
        </div>

        {/* Timer Display - Now Much Larger */}
        <div className="flex-1 flex items-center justify-center relative min-h-[320px]">
          <Timer
            duration={currentStep?.duration || 0}
            onComplete={handleTimerComplete}
            isRunning={isRunning}
            isPaused={isPaused}
            color={getSessionColor()}
            onReset={currentStepIndex !== undefined}
            onAddTime={addFifteenSeconds}
          />
          {/* +15sec Button - Now positioned better for larger timer */}
          {isRunning && (
            <Button
              onClick={addFifteenSeconds}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-full shadow-lg min-h-[44px] min-w-[44px] font-medium"
              size="sm"
              aria-label="Add 15 seconds"
            >
              +15s
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
                onClick={finishSession}
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
    </div>
  );
}
