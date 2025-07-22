# TimerAppp - Comprehensive App Documentation

## Overview
A simple, functional timer app for my mobility and hangboarding sessions. 

## Technical Architecture
React18 + Typescript. Vite. React hooks. TailwindCSS. Mobile optimized. 

## Application Features & Components

### Core Features
1. **Two Pre-defined Workout Types**:
   - **Mobility Routine**: 11 exercises, 15 minutes total, focusing on flexibility and movement preparation
   - **Hangboard Routine**: 19 exercises (3 sets each of Half-Crimp, 3-Finger Open, Pocket hangs), designed for finger strength training at 20mm edge @ 50% body weight

2. **Ultra-Minimal Session Interface**:
   - Large 320px timer (67% larger than standard) optimized for iPhone displays
   - Exercise name only (no instructions or descriptions)
   - Exercise position images (mobility exercises + hangboard grip demonstrations)
   - Single control button (green to start/resume, red to stop)
   - +15 second button during active exercises
   - "Next exercise" preview in bottom-right corner

3. **Smart Timer System**:
   - Precise countdown with millisecond accuracy
   - Auto-advance between exercises with 3-10 second transitions
   - Double-tap exercise name to skip current exercise
   - Confirmation dialog for ending workouts early
   - Timer preservation during pause (maintains position instead of resetting)

4. **Audio & Haptic Feedback**:
   - Transition beeps between exercises
   - Session completion sound
   - Button press sound effects
   - Haptic feedback using navigator.vibrate API
   - Volume-optimized for mobile devices

### Application Structure

#### Pages & Routing
- **Home Page (`/`)**: 
  - Large square blue workout buttons for mobility and hangboard
  - Small edit icons for modifying existing workouts
  - Orange "Create New Workout" button at bottom
  - No header or navigation clutter
  
- **Session Page (`/session/:type`)**:
  - Full-screen exercise interface
  - Exercise name and timer as primary elements
  - Exercise images (48px height for visibility)
  - Bottom control panel with backdrop blur effect
  - Safe-area padding for notch devices

- **Workout Editor**:
  - Custom workout creation and editing
  - Fields: exercise name, duration, image selection
  - Image picker from 11 available exercise positions
  - Streamlined interface without unused fields (instructions, exercise type)

#### Key Components

**Timer Component**:
- Circular progress indicator with gradient styling
- Large typography (6xl text size) for readability
- Real-time countdown with smooth animations
- State management for play/pause/reset functionality

**Exercise Images**:
- 11 mobility/stretching exercise images stored in @assets
- 5 hangboard grip demonstration images (half-crimp, 3-finger open, pocket variations)
- Fallback handling for failed image loads
- Context-aware display (grip images only during hangboard workouts)

**Audio Manager**:
- Web Audio API implementation for sound effects
- Custom sound files: transition beep, completion sound, button press
- Mobile-optimized playback with proper volume levels
- Fallback graceful handling for audio permission issues

### Data Management & Persistence

#### Local Storage Architecture
- **Workout Definitions**: Custom and default workout routines stored as JSON
- **Session Progress**: Current exercise index, timer state, pause timestamps
- **Workout History**: Completed sessions with metadata (date, type, duration, exercises)
- **Settings**: User preferences, audio settings, offline status

#### Offline Storage Utilities
- **Workout Caching**: Complete workout data cached for offline access
- **Progressive Sync**: Background synchronization when connection available
- **Fallback Workouts**: Emergency workout routines stored locally
- **Cache Invalidation**: Intelligent cleanup of expired cached data

#### PWA Offline Capabilities
- **Service Worker**: Custom implementation with intelligent caching strategies
- **Cache-First Strategy**: App shell and static assets served from cache
- **Stale-While-Revalidate**: Dynamic content updated in background
- **Network-First Fallback**: API calls with offline graceful degradation
- **Offline Status Detection**: Visual indicators and functionality adaptation

## Application Data Flow

### User Journey & Data Flow
1. **App Launch**:
   - Service worker activates and loads cached resources
   - Local storage checked for custom workouts and user preferences
   - Home page renders with available workouts (default + custom)

2. **Workout Selection**:
   - User taps workout button (mobility, hangboard, or custom)
   - App navigates to `/session/:type` route
   - Workout data loaded from localStorage or default definitions

3. **Session Initialization**:
   - Exercise array loaded with names, durations, and image references
   - Timer component initialized with first exercise duration
   - Audio manager prepared for feedback sounds
   - Session state saved to localStorage for recovery

4. **Exercise Execution Loop**:
   - Timer starts countdown for current exercise
   - Exercise image displayed based on workout type
   - User can pause/resume, add time (+15s), or skip (double-tap)
   - Audio feedback plays at exercise transitions
   - Progress automatically advances to next exercise

5. **Session Completion**:
   - Completion sound plays and haptic feedback triggers
   - Session metadata logged (date, type, exercises completed, total duration)
   - User redirected to home page with updated workout history
   - Cache updated with latest session data

6. **Workout Customization** (Optional):
   - User accesses workout editor via edit icons
   - Modifications saved to localStorage with unique identifiers
   - Updated workout definitions immediately available for session selection

### State Management Architecture
- **Local Component State**: Exercise index, timer value, play/pause state
- **localStorage Persistence**: Workout definitions, user preferences, session history
- **Cache Storage**: Static assets, exercise images, audio files
- **Session Recovery**: Interrupted sessions can be resumed from localStorage state

## Dependencies & Technology Stack

### Core Frontend Dependencies
- **React** (v18+): Main UI framework with modern hooks and concurrent features
- **React DOM** (v18+): DOM rendering for React components
- **TypeScript** (v5+): Static typing for enhanced developer experience and runtime safety
- **Vite**: Fast build tool, development server, and module bundler
- **Wouter**: Lightweight (2KB) client-side routing library

### UI & Styling Dependencies
- **TailwindCSS**: Utility-first CSS framework with custom configuration
- **@tailwindcss/typography**: Enhanced typography utilities for text content
- **Radix UI Components**: Comprehensive accessible component library
  - Dialog, Button, Select, Form components
  - Tooltip, Progress, Separator, Tabs
  - All components unstyled and fully customizable
- **Class Variance Authority (CVA)**: Type-safe styling variant management
- **clsx**: Utility for constructing className strings conditionally
- **tailwind-merge**: Intelligent Tailwind class merging to prevent conflicts

### State Management & Data
- **TanStack Query** (v5): Server state management, caching, and synchronization
- **React Hook Form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Form validation resolvers (Zod integration)
- **Zod**: TypeScript-first schema validation library
- **date-fns**: Modern date utility library for date formatting

### Audio & Media
- **Web Audio API**: Native browser audio for workout feedback sounds
- **Navigator Vibration API**: Haptic feedback for mobile devices
- **Custom audio files**: Transition beep, completion sound, button press sound

### PWA & Offline Functionality
- **Vite PWA Plugin**: Service worker generation and PWA configuration
- **Workbox**: Google's PWA toolkit for caching strategies
- **Web App Manifest**: PWA installation and app-like behavior
- **Service Worker**: Custom implementation for offline functionality

### Development & Build Tools
- **ESBuild**: Fast JavaScript/TypeScript bundler (via Vite)
- **PostCSS**: CSS transformation tool with Autoprefixer
- **Autoprefixer**: Automatic CSS vendor prefixing
- **@vitejs/plugin-react**: Official Vite plugin for React support
- **TSX**: TypeScript execution environment for development

### Backend Dependencies (Minimal)
- **Express.js**: Web application framework for Node.js
- **Express Session**: Session management middleware (configured but not actively used)
- **Drizzle ORM**: SQL ORM with TypeScript support (configured for future use)
- **@neondatabase/serverless**: Serverless PostgreSQL client (prepared but not used)

### Asset Management
- **Static Assets**: Exercise images stored in client/public/assets/
- **Asset Imports**: Vite @assets alias for clean asset referencing
- **Image Optimization**: Proper formatting and compression for mobile performance

## Project Structure & File Organization

### Root Directory Structure
```
/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-based page components
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/         # Static assets (images, audio)
│   ├── public/             # Public static files
│   └── index.html          # Main HTML template
├── server/                 # Express backend (minimal)
│   ├── routes.ts           # API endpoint definitions
│   ├── storage.ts          # Storage interface (unused)
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database and API type definitions
└── Configuration files     # Build, deployment, and tool configs
```

### Key File Descriptions

#### Frontend Files
- **client/src/App.tsx**: Main application component with routing and providers
- **client/src/pages/Home.tsx**: Workout selection interface with minimal design
- **client/src/pages/Session.tsx**: Timer-based workout execution interface
- **client/src/pages/WorkoutEditor.tsx**: Custom workout creation and editing
- **client/src/components/ui/**: Radix UI components with Tailwind styling
- **client/src/lib/queryClient.ts**: TanStack Query configuration and API client
- **client/src/hooks/use-toast.ts**: Toast notification system hook

#### Assets & Media
- **client/public/assets/exercises/**: 11 mobility exercise position images
- **client/public/assets/hangboard/**: 5 hangboard grip demonstration images
- **client/public/assets/audio/**: Sound effects (transition, completion, button press)
- **client/public/manifest.json**: PWA manifest for app installation

#### Configuration Files
- **vite.config.ts**: Vite build configuration with plugins and aliases
- **tailwind.config.ts**: TailwindCSS configuration with custom colors
- **tsconfig.json**: TypeScript configuration for both client and server
- **package.json**: Dependencies, scripts, and project metadata