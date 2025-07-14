import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Timer } from '../components/Timer';
import { workoutSessions } from '../lib/data';
import { workoutStorage } from '../lib/storage';
import { audioManager } from '../lib/audio';
import { SessionStep, LogEntry } from '../types';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Square, Home, RotateCcw } from 'lucide-react';

export default function Session() {
  const params = useParams<{ type: string }>();
  const [, navigate] = useLocation();
  
  const sessionType = params.type as 'mobility' | 'hangboard';
  const session = workoutSessions[sessionType];

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
      sessionType,
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
    if (currentStepIndex < session.steps.length - 1) {
      return session.steps[currentStepIndex + 1];
    }
    return null;
  };

  const getSessionColor = () => {
    return sessionType === 'mobility' ? '#10B981' : '#F59E0B';
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  if (isSessionComplete) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <header className={`bg-gradient-to-r ${
          sessionType === 'mobility' ? 'from-secondary to-emerald-600' : 'from-accent to-amber-600'
        } text-white px-6 py-12 text-center`}>
          <div className="animate-bounce mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Great Job!</h1>
          <p className={`${sessionType === 'mobility' ? 'text-emerald-100' : 'text-amber-100'}`}>
            You've completed your {sessionType} session
          </p>
        </header>

        <main className="p-6">
          <div className="space-y-4 mb-8">
            <Card className="bg-gray-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-neutral">{formatTime(Math.floor(totalElapsedTime / 1000))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    sessionType === 'mobility' ? 'bg-secondary' : 'bg-accent'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Exercises</p>
                    <p className="font-semibold text-neutral">
                      {completedSteps.length}/{session.steps.length} completed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-primary hover:bg-blue-600 text-white rounded-xl py-4 font-semibold transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            
            <Button 
              onClick={() => navigate(`/session/${sessionType}`)}
              className={`w-full ${
                sessionType === 'mobility' ? 'bg-secondary hover:bg-emerald-600' : 'bg-accent hover:bg-amber-600'
              } text-white rounded-xl py-4 font-semibold transition-colors`}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Start Another Session
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Session Header */}
      <header className={`bg-gradient-to-r ${
        sessionType === 'mobility' ? 'from-secondary to-emerald-600' : 'from-accent to-amber-600'
      } text-white px-6 py-6`}>
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
        <div className={`w-full ${
          sessionType === 'mobility' ? 'bg-emerald-400' : 'bg-amber-400'
        } rounded-full h-2 mb-2`}>
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex / session.steps.length) * 100}%` }}
          />
        </div>
        <p className={`${
          sessionType === 'mobility' ? 'text-emerald-100' : 'text-amber-100'
        } text-sm text-center`}>
          {currentStepIndex + 1} of {session.steps.length} exercises
        </p>
      </header>

      {/* Current Exercise Display */}
      <main className="p-6 text-center">
        {/* Exercise Name */}
        <h2 className="text-2xl font-bold text-neutral mb-2">
          {currentStep?.name}
        </h2>
        
        {/* Exercise Instructions */}
        <p className="text-gray-600 mb-8 px-4">
          {currentStep?.instructions}
        </p>

        {/* Timer Display */}
        <div className="mb-8">
          <Timer
            duration={currentStep?.duration || 0}
            onComplete={handleTimerComplete}
            isRunning={isRunning && !isPaused}
            color={getSessionColor()}
          />
        </div>

        {/* Next Exercise Preview */}
        {getNextStep() && (
          <Card className="bg-gray-50 mb-8">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-2">Next up:</p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-gray-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-neutral">{getNextStep()?.name}</p>
                  <p className="text-sm text-gray-500">{formatTime(getNextStep()?.duration || 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Session Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between space-x-4">
            
            {/* Previous Button */}
            <Button 
              variant="outline"
              onClick={previousStep}
              disabled={currentStepIndex === 0}
              className="flex-1 rounded-xl py-3 px-4 flex items-center justify-center"
              aria-label="Previous exercise"
            >
              <SkipBack className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Play/Pause Button */}
            <Button 
              onClick={toggleTimer}
              className="flex-1 bg-primary hover:bg-blue-600 text-white rounded-xl py-3 px-4 flex items-center justify-center transition-colors"
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
              className="flex-1 rounded-xl py-3 px-4 flex items-center justify-center"
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
            className="w-full mt-3 text-error hover:text-red-600 text-sm font-medium py-2"
            aria-label="Finish session early"
          >
            <Square className="w-4 h-4 mr-1" />
            Finish Session
          </Button>
        </div>
      </div>
    </div>
  );
}
