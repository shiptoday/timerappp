# FlowTrainer - Comprehensive App Documentation

## Overview

FlowTrainer is a minimalist, mobile-first Progressive Web Application (PWA) specifically designed for climbers and fitness enthusiasts focusing on mobility training and hangboard workouts. The app provides distraction-free, timer-based workout sessions with comprehensive audio feedback, haptic responses, and local workout logging. Built with an ultra-minimal interface philosophy, it prioritizes focus and usability over visual complexity.

### Core Philosophy
- **Ultra-Minimal Interface**: Stripped down to essential elements only - exercise name, timer, and position images
- **Mobile-First Design**: Optimized specifically for iPhone and mobile devices with touch-friendly controls
- **Offline-First Architecture**: Complete functionality without internet connection after initial load
- **Distraction-Free Experience**: No unnecessary UI elements, progress bars, or complex navigation
- **Climbing-Focused**: Specifically tailored for hangboard training with grip-specific imagery and load specifications

## User Preferences

Preferred communication style: Simple, everyday language.

## Technical Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern React features
- **Build Tool**: Vite for fast development server, HMR, and optimized production builds
- **Routing**: Wouter for lightweight client-side routing (~2KB vs React Router's ~50KB)
- **State Management**: React hooks (useState, useEffect, useRef) with local component state - no complex global state
- **Data Fetching**: TanStack Query v5 for caching, synchronization, and query invalidation
- **Styling**: TailwindCSS utility-first framework with custom CSS variables for theming
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **PWA Framework**: Custom service worker with Workbox for caching strategies

### Backend Architecture (Minimal)
- **Server**: Express.js with TypeScript for type-safe server development
- **API Design**: RESTful endpoints (currently minimal, prepared for future expansion)
- **Development Integration**: Vite proxy integration for seamless full-stack development
- **Database Layer**: Drizzle ORM configured for PostgreSQL (not actively used - app is localStorage-first)

### Mobile Optimization
- **Viewport**: Enhanced mobile viewport with safe-area support for notch devices (iPhone X+)
- **Touch Targets**: All interactive elements meet 44px minimum touch target guidelines
- **Performance**: WebKit optimizations for iOS Safari, hardware acceleration for animations
- **PWA Features**: iOS-specific meta tags for home screen installation and app-like experience

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

### Development Workflow & Commands

#### Development Environment
- **`npm run dev`**: Starts development servers (Vite + Express) with HMR
- **`npm run build`**: Builds production bundles for both client and server
- **`npm run preview`**: Serves production build locally for testing
- **`npm run check`**: TypeScript type checking across entire codebase

#### Build Process
1. **Client Build** (Vite):
   - Bundles React app with code splitting and optimization
   - Generates service worker for PWA functionality
   - Outputs to `dist/public/` with fingerprinted assets
   
2. **Server Build** (ESBuild via Vite):
   - Compiles TypeScript Express server
   - Outputs single `dist/index.js` file for deployment

#### PWA Build Features
- **Service Worker Generation**: Automatic caching strategies for offline functionality
- **Asset Optimization**: Image compression and format optimization
- **Code Splitting**: Lazy loading of route components for faster initial load
- **Bundle Analysis**: Size optimization and tree shaking

## Deployment Strategy

### Production Deployment (Replit)
- **Platform**: Replit deployment with automatic scaling
- **Build Command**: `npm run build` - builds both client and server
- **Start Command**: `node dist/index.js` - runs Express server serving React app
- **Port Configuration**: Dynamic port allocation via `process.env.PORT || 5000`
- **Static Serving**: Express serves built React app from `dist/public/`

### PWA Installation
- **Desktop**: Chrome/Edge "Install App" option in address bar
- **iOS Safari**: "Add to Home Screen" from share menu
- **Android**: "Add to Home Screen" prompt or manual installation
- **App Icon**: Custom icon set with multiple sizes for different devices

### Performance Optimizations
- **Service Worker**: Aggressive caching of app shell and exercise assets
- **Image Optimization**: WebP format with fallbacks for better compression
- **Code Splitting**: Route-based lazy loading reduces initial bundle size
- **CSS Optimization**: TailwindCSS purging removes unused styles
- **Audio Preloading**: Sound effects loaded and cached on app initialization

## Architecture Decisions & Design Philosophy

### Core Design Principles

**Offline-First Architecture**: 
- Chosen to ensure app works without internet connection after initial load
- LocalStorage as primary data persistence instead of remote database
- Service worker with intelligent caching strategies for complete offline functionality
- Progressive enhancement approach with graceful online/offline transitions

**Ultra-Minimal Interface Philosophy**:
- Stripped interface to absolute essentials: exercise name, timer, and position image
- No progress bars, headers, navigation, or instructional text during workouts
- Single large timer (320px) optimized for iPhone displays with high contrast
- Focus-first design eliminates distractions during workout execution

**Mobile-First Development**:
- iPhone 16 as primary target device with safe-area support for notch
- Touch target optimization (minimum 44px) for all interactive elements
- Hardware acceleration and WebKit optimizations for smooth performance
- PWA implementation for native app-like experience on iOS

**Climbing-Specific Optimization**:
- Hangboard workout specifically designed for finger strength training
- Grip demonstration images for proper form guidance
- Load specifications (20mm edge @ 50% body weight) built into workout descriptions
- Timer precision for hangboard protocols with shorter rest periods

**Scalable Architecture**:
- Modular component structure allows easy feature additions
- Express backend prepared for future API expansion
- Drizzle ORM configured but unused, ready for database integration
- Separation of concerns between workout logic, timer functionality, and UI components

## Error Handling & Edge Cases

### Application Resilience
- **Timer Interruption**: Session state saved to localStorage for recovery after app closure/reload
- **Audio Failure**: Graceful fallback when Web Audio API unavailable or permissions denied
- **Image Loading**: Fallback handling for missing exercise images with placeholder alternatives
- **Offline Functionality**: Complete app functionality maintained without network connection
- **Battery Optimization**: Efficient timer implementation to minimize battery drain during long sessions

### User Experience Error States
- **Workout Completion Confirmation**: Dialog prevents accidental workout termination
- **Session Recovery**: Interrupted workouts can be resumed from exact position
- **Audio Permission**: User-friendly prompts for enabling audio feedback
- **Installation Guidance**: Clear PWA installation instructions across devices

## Future Expansion Roadmap

### Short-term Enhancements (Next Iteration)
- **Workout Statistics Dashboard**: Weekly/monthly volume tracking with visual charts
- **Custom Timer Sounds**: User-selectable audio themes for workout feedback
- **Exercise Progression Tracking**: Log sets, reps, or hold times for strength exercises
- **Dark Mode Support**: Complete dark theme implementation with user preference saving

### Medium-term Features (Future Versions)
- **Workout Sharing**: Export/import custom workouts between devices
- **Advanced Hangboard Protocols**: Additional grip types and training methodologies
- **Wearable Integration**: Apple Watch or fitness tracker synchronization
- **Workout Scheduling**: Calendar integration and reminder notifications

### Long-term Vision (Major Updates)
- **Multi-user Support**: Database backend for workout sharing and social features
- **AI Workout Generation**: Personalized routine creation based on user history and goals
- **Video Exercise Demonstrations**: Enhanced guidance with movement videos
- **Community Features**: Workout sharing, leaderboards, and progress comparisons

## Known Issues & Limitations

### Current Technical Limitations
- **iOS Safari Audio**: Initial audio playback may require user interaction due to autoplay policies
- **Background Processing**: Timer may pause when app is backgrounded on some mobile browsers
- **Storage Limits**: LocalStorage has size limitations for extensive workout history
- **Network Dependency**: Initial app load requires internet connection for asset downloading

### Browser Compatibility
- **Service Worker Support**: Requires modern browser with Service Worker API support
- **Audio Context**: Web Audio API availability varies across older mobile browsers
- **Vibration API**: Haptic feedback limited to supported devices and browsers
- **PWA Installation**: Installation experience varies significantly across platforms

---

*This documentation represents the comprehensive state of FlowTrainer as of January 22, 2025. For the most current information, refer to the Recent Changes section below and git commit history.*

## Recent Changes: Latest modifications with dates

- **January 14, 2025**: Fixed timer functionality - Timer now properly syncs with external play/pause controls
- **January 14, 2025**: Improved styling - Changed background to light gray, enhanced color contrast for better readability
- **January 14, 2025**: Added workout editing functionality - Users can now edit existing workouts and create new custom routines
- **January 14, 2025**: Implemented persistent custom workout storage using localStorage
- **January 14, 2025**: Enhanced Home page to display all available workouts (default + custom) with edit buttons
- **January 22, 2025**: Redesigned UI to be extremely minimal and simple - removed recent workouts display, simplified color scheme to black/white/gray
- **January 22, 2025**: Fixed workout persistence system to ensure custom workouts are properly saved and loaded
- **January 22, 2025**: Updated styling to clean minimalistic design with no rounded corners and light typography
- **January 22, 2025**: Moved "Next exercise" preview to small bottom-right corner to be less distracting, added space for exercise position images
- **January 22, 2025**: Removed exercise instruction text completely for ultra-minimal interface - only exercise name and timer remain
- **January 22, 2025**: Added exercise position images for all mobility/stretching exercises with fallback handling for failed image loads
- **January 22, 2025**: Fixed image loading using local backup images - all 11 mobility exercise images now display properly using @assets imports
- **January 22, 2025**: Removed instructions field from workout editor since instructions are no longer displayed in ultra-minimal interface
- **January 22, 2025**: Removed exercise type field from workout editor - simplified to just name, duration, and image selection
- **January 22, 2025**: Added custom image selection in workout editor - users can choose which exercise image to display for each step
- **January 22, 2025**: Updated exercise images with user's preferred versions - replaced 6 exercise images (shoulders, downward dog, wrist pulses, hip CARs, hip thrust, pigeon pose, active bar hang) with better quality alternatives
- **January 22, 2025**: Removed session header completely - eliminated progress bar, session title, and navigation buttons for ultra-minimal focus on exercise content only
- **January 22, 2025**: Redesigned controls - single large button (green to start/resume, red to stop), removed previous/next buttons, added +15sec button on timer during exercise
- **January 22, 2025**: Redesigned home page - big square blue workout buttons, small edit icons on workout buttons, orange create new workout button at bottom, removed header
- **January 22, 2025**: iPhone 16 optimizations - Enhanced mobile viewport settings, added safe area support for notch devices, implemented PWA meta tags for iOS, added -webkit optimizations for smoother performance
- **January 22, 2025**: Redesigned timer for iPhone - Increased timer size from 192px to 320px (67% larger), improved typography with 6xl text size, added gradient shadows and better contrast for high-DPI displays
- **January 22, 2025**: Enhanced mobile touch targets - All buttons now meet 44px minimum touch target requirement, improved tap areas, added active scale animations for better haptic feedback
- **January 22, 2025**: Added sound effects integration - Added custom transition beep, session completion sound, and button press sound with proper volume levels and mobile compatibility
- **January 22, 2025**: Enhanced session controls - Added 10-second transition phase between exercises, double-tap exercise name to skip, confirmation dialog for ending workout, auto-start next exercise after transition
- **January 22, 2025**: Improved mobile layout - Added flexbox layouts for better space utilization, relocated "next exercise" preview to be less intrusive, enhanced bottom navigation with backdrop blur and safe area padding
- **January 22, 2025**: Fixed timer flow issues - Resolved timer synchronization problems between exercises, fixed pause functionality to preserve timer position instead of resetting, ensured exercises start at correct durations, made exercise images larger (48px height)
- **January 22, 2025**: Updated hangboard workout - Modified to 19 exercises with specific naming (Half-Crimp Hang #1-3, 3-Finger Open Hang #1-3, Pocket Hang #1-3), reduced transition time from 10s to 3s, added workout description with load specifications (20mm edge @ 50% BW)
- **January 22, 2025**: Added hangboard grip images - Added 5 grip demonstration images (half-crimp, 3-finger open, 3 pocket variations) that display only during hangboard workouts, fixed unpause audio to use button press sound instead of transition sound
- **January 22, 2025**: Implemented comprehensive offline functionality - Added service worker with intelligent caching strategies, PWA manifest for app installation, offline storage utilities for workout data, offline status indicators, and fallback workouts for offline use. App now works completely offline after initial load.