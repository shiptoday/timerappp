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
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Square, Home, RotateCcw } from 'lucide-react';

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
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Session Header */}
      <header className="bg-black text-white px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:text-opacity-80 p-2"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold capitalize">
            {sessionType} Session
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={finishSession}
            className="text-white hover:text-opacity-80 p-2"
            aria-label="Finish session"
          >
            <Square className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / session.steps.length) * 100}%` }}
          />
        </div>
        <p className="text-gray-300 text-sm text-center">
          {currentStepIndex + 1} of {session.steps.length}
        </p>
      </header>

      {/* Current Exercise Display */}
      <main className="p-6 text-center relative min-h-[calc(100vh-200px)]">
        {/* Exercise Name */}
        <h2 className="text-3xl font-light text-gray-900 mb-12">
          {currentStep?.name}
        </h2>

        {/* Exercise Position Image */}
        <div className="mb-12 h-40 flex items-center justify-center">
          {currentStep && getExerciseImage(currentStep.name) ? (
            <img 
              src={getExerciseImage(currentStep.name)} 
              alt={currentStep.name}
              className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-gray-300 text-xs">Exercise position image</div>
          )}
        </div>

        {/* Timer Display */}
        <div className="mb-8">
          <Timer
            duration={currentStep?.duration || 0}
            onComplete={handleTimerComplete}
            isRunning={isRunning}
            isPaused={isPaused}
            color={getSessionColor()}
            onReset={currentStepIndex !== undefined}
          />
        </div>

        {/* Next Exercise Preview - Bottom Right Corner */}
        {getNextStep() && (
          <div className="absolute bottom-8 right-6 bg-gray-50 px-3 py-2 rounded shadow-sm border max-w-32">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Next</p>
            <p className="text-sm text-gray-600 font-light truncate">{getNextStep()?.name}</p>
          </div>
        )}
      </main>

      {/* Session Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            
            {/* Previous Button */}
            <Button 
              variant="outline"
              onClick={previousStep}
              disabled={currentStepIndex === 0}
              className="flex-1 rounded-none py-4 border-gray-200 text-gray-600 font-light"
              aria-label="Previous exercise"
            >
              <SkipBack className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {/* Play/Pause Button */}
            <Button 
              onClick={toggleTimer}
              className="flex-2 bg-black hover:bg-gray-800 text-white rounded-none py-4 font-light transition-colors"
              aria-label={isPaused ? "Resume timer" : isRunning ? "Pause timer" : "Start timer"}
            >
              {isPaused ? (
                <Play className="w-4 h-4 mr-2" />
              ) : isRunning ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPaused ? 'Resume' : isRunning ? 'Pause' : 'Start'}
            </Button>

            {/* Next Button */}
            <Button 
              variant="outline"
              onClick={nextStep}
              disabled={currentStepIndex === session.steps.length - 1}
              className="flex-1 rounded-none py-4 border-gray-200 text-gray-600 font-light"
              aria-label="Next exercise"
            >
              Next
              <SkipForward className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Emergency Stop */}
          <Button 
            variant="ghost"
            onClick={finishSession}
            className="w-full text-gray-400 hover:text-gray-600 text-sm font-light py-2"
            aria-label="Finish session early"
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
}
