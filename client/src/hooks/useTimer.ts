import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerState } from '../types';
import { audioManager } from '../lib/audio';

export interface UseTimerProps {
  initialTime: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useTimer({ initialTime, onComplete, autoStart = false }: UseTimerProps) {
  const [state, setState] = useState<TimerState>({
    currentTime: initialTime,
    isRunning: autoStart,
    isPaused: false,
    isComplete: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timer logic
  useEffect(() => {
    if (state.isRunning && !state.isPaused && !state.isComplete) {
      intervalRef.current = setInterval(() => {
        setState(prevState => {
          const newTime = prevState.currentTime - 1;
          
          if (newTime <= 0) {
            audioManager.playTimerComplete();
            onCompleteRef.current?.();
            return {
              ...prevState,
              currentTime: 0,
              isRunning: false,
              isComplete: true
            };
          }
          
          return {
            ...prevState,
            currentTime: newTime
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.isPaused, state.isComplete]);

  const start = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isRunning: true,
      isPaused: false
    }));
  }, []);

  const pause = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isPaused: true
    }));
  }, []);

  const resume = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      isPaused: false
    }));
  }, []);

  const reset = useCallback((newTime?: number) => {
    setState({
      currentTime: newTime ?? initialTime,
      isRunning: false,
      isPaused: false,
      isComplete: false
    });
  }, [initialTime]);

  const skip = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      currentTime: 0,
      isRunning: false,
      isComplete: true
    }));
    onCompleteRef.current?.();
  }, []);

  return {
    ...state,
    start,
    pause,
    resume,
    reset,
    skip,
    toggle: state.isPaused ? resume : pause
  };
}
