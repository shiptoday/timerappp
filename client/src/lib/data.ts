import { WorkoutSession, SessionStep, HangboardSet } from '../types';
import { workoutStorage } from './storage';

// Mobility routine - 15 minutes, 1 minute each exercise
export const mobilitySteps: SessionStep[] = [
  {
    id: 'banded-shoulder-dislocates',
    name: 'Banded Shoulder Dislocates',
    duration: 60,
    instructions: 'Hold resistance band wide, slowly lift over head and behind back. Keep arms straight.',
    type: 'exercise'
  },
  {
    id: 'downward-dog',
    name: 'Downward Dog',
    duration: 60,
    instructions: 'Start on hands and knees, lift hips up and back. Straighten legs and arms.',
    type: 'exercise'
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow',
    duration: 60,
    instructions: 'Flow between cat and cow poses, arching and rounding your spine gently.',
    type: 'exercise'
  },
  {
    id: 'wrist-pulses',
    name: 'Wrist Pulses (Front/Back)',
    duration: 60,
    instructions: 'Extend arms forward, pulse wrists up and down, then front and back.',
    type: 'exercise'
  },
  {
    id: 'quadruped-hip-cars',
    name: 'Quadruped Hip CARs',
    duration: 60,
    instructions: 'On hands and knees, lift one leg and rotate hip in full circles.',
    type: 'exercise'
  },
  {
    id: 'hip-thrust-arch',
    name: 'Hip Thrust + Arch',
    duration: 60,
    instructions: 'Lying on back, thrust hips up then arch back into bridge position.',
    type: 'exercise'
  },
  {
    id: 'seated-forward-fold',
    name: 'Seated Wide-Leg Forward Fold',
    duration: 60,
    instructions: 'Sit with legs wide, fold forward from hips keeping back straight.',
    type: 'exercise'
  },
  {
    id: 'plow-pose',
    name: 'Plow Pose',
    duration: 60,
    instructions: 'Lie on back, lift legs over head, toes touching floor behind you.',
    type: 'exercise'
  },
  {
    id: 'garland-squat',
    name: 'Garland Squat',
    duration: 60,
    instructions: 'Deep squat position, hands in prayer, elbows pushing knees apart.',
    type: 'exercise'
  },
  {
    id: 'pigeon-frog',
    name: 'Pigeon + Frog (30s each)',
    duration: 60,
    instructions: 'Hold pigeon pose for 30s, then transition to frog pose for 30s.',
    type: 'exercise'
  },
  {
    id: 'active-bar-hang',
    name: 'Active Bar Hang',
    duration: 60,
    instructions: 'Hang from bar with active shoulders, engage lats and core.',
    type: 'exercise'
  }
];

// Hangboard routine - 15 minutes with warmup and 3 grip types
export const hangboardSteps: SessionStep[] = [
  // Warmup
  {
    id: 'warmup-easy-jug-hangs',
    name: 'Warm‑up – Easy Jug Hangs',
    duration: 30,
    instructions: 'Total time: ≈ 15 min • Load: 20 mm edge @ 50% BW • Focus on relaxed shoulders & smooth breathing.',
    type: 'warmup'
  },
  {
    id: 'warmup-finger-flicks',
    name: 'Warm‑up – Finger Flicks + Rest',
    duration: 60,
    instructions: 'Gentle finger flexion and extension to warm up tendons.',
    type: 'warmup'
  },
  // Half-crimp sets (3 sets of 10s hang : 50s rest)
  {
    id: 'half-crimp-1',
    name: 'Half‑Crimp Hang #1',
    duration: 10,
    instructions: '20mm edge, 50% BW. Half-crimp grip position.',
    type: 'exercise'
  },
  {
    id: 'half-crimp-rest-1',
    name: 'Rest',
    duration: 50,
    instructions: 'Rest and prepare for next set.',
    type: 'rest'
  },
  {
    id: 'half-crimp-2',
    name: 'Half‑Crimp Hang #2',
    duration: 10,
    instructions: '20mm edge, 50% BW. Half-crimp grip position.',
    type: 'exercise'
  },
  {
    id: 'half-crimp-rest-2',
    name: 'Rest',
    duration: 50,
    instructions: 'Rest and prepare for next set.',
    type: 'rest'
  },
  {
    id: 'half-crimp-3',
    name: 'Half‑Crimp Hang #3',
    duration: 10,
    instructions: '20mm edge, 50% BW. Half-crimp grip position.',
    type: 'exercise'
  },
  // 3 minute rest between grips
  {
    id: 'grip-rest-1',
    name: 'Rest Between Grips',
    duration: 180,
    instructions: 'Rest between grip types. Shake out hands.',
    type: 'rest'
  },
  // Open 3-finger sets
  {
    id: 'open-3-finger-1',
    name: '3‑Finger Open Hang #1',
    duration: 10,
    instructions: '20mm edge, 50% BW. Open 3-finger grip.',
    type: 'exercise'
  },
  {
    id: 'open-3-finger-rest-1',
    name: 'Rest',
    duration: 50,
    instructions: 'Rest and prepare for next set.',
    type: 'rest'
  },
  {
    id: 'open-3-finger-2',
    name: '3‑Finger Open Hang #2',
    duration: 10,
    instructions: '20mm edge, 50% BW. Open 3-finger grip.',
    type: 'exercise'
  },
  {
    id: 'open-3-finger-rest-2',
    name: 'Rest',
    duration: 50,
    instructions: 'Rest and prepare for next set.',
    type: 'rest'
  },
  {
    id: 'open-3-finger-3',
    name: '3‑Finger Open Hang #3',
    duration: 10,
    instructions: '20mm edge, 50% BW. Open 3-finger grip.',
    type: 'exercise'
  },
  // 3 minute rest between grips
  {
    id: 'grip-rest-2',
    name: 'Rest Between Grips',
    duration: 180,
    instructions: 'Rest between grip types. Shake out hands.',
    type: 'rest'
  },
  // Pockets sets
  {
    id: 'pockets-1',
    name: 'Pocket Hang #1',
    duration: 10,
    instructions: '20mm edge, 50% BW. Pocket grip position.',
    type: 'exercise'
  },
  {
    id: 'pockets-rest-1',
    name: 'Rest',
    duration: 50,
    instructions: 'Rest and prepare for next set.',
    type: 'rest'
  },
  {
    id: 'pockets-2',
    name: 'Pocket Hang #2',
    duration: 10,
    instructions: '20mm edge, 50% BW. Pocket grip position.',
    type: 'exercise'
  },
  {
    id: 'pockets-rest-2',
    name: 'Rest',
    duration: 50,
    instructions: 'Rest and prepare for next set.',
    type: 'rest'
  },
  {
    id: 'pockets-3',
    name: 'Pocket Hang #3',
    duration: 10,
    instructions: '20mm edge, 50% BW. Pocket grip position.',
    type: 'exercise'
  }
];

const defaultWorkoutSessions: Record<string, WorkoutSession> = {
  mobility: {
    type: 'mobility',
    steps: mobilitySteps,
    totalDuration: mobilitySteps.reduce((sum, step) => sum + step.duration, 0)
  },
  hangboard: {
    type: 'hangboard',
    steps: hangboardSteps,
    totalDuration: hangboardSteps.reduce((sum, step) => sum + step.duration, 0)
  }
};

export const getWorkoutSession = (id: string): WorkoutSession | undefined => {
  // First check custom workouts
  const customWorkouts = workoutStorage.getCustomWorkouts();
  if (customWorkouts[id]) {
    return customWorkouts[id];
  }
  // Then check default workouts
  return defaultWorkoutSessions[id];
};

export const workoutSessions: Record<string, WorkoutSession> = new Proxy({}, {
  get(target, prop) {
    if (typeof prop === 'string') {
      return getWorkoutSession(prop);
    }
    return undefined;
  },
  
  ownKeys(target) {
    const customWorkouts = workoutStorage.getCustomWorkouts();
    return [...Object.keys(defaultWorkoutSessions), ...Object.keys(customWorkouts)];
  },

  has(target, prop) {
    if (typeof prop === 'string') {
      return getWorkoutSession(prop) !== undefined;
    }
    return false;
  }
});

export const getAllWorkouts = (): Record<string, WorkoutSession> => {
  const customWorkouts = workoutStorage.getCustomWorkouts();
  return { ...defaultWorkoutSessions, ...customWorkouts };
};
