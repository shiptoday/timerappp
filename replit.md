# TimerAppp - Mobile-First Fitness Timer App

## Overview

TimerAppp is a mobile-first web application designed for tracking mobility and hangboard training sessions. The app provides timed workout routines with audio/haptic feedback, offline functionality, and session logging. Built with React 18, TypeScript, and Vite, it emphasizes simplicity and mobile optimization for iPhone displays.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: TailwindCSS with mobile-first responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks and context for local state
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Structure**: RESTful endpoints under `/api` prefix
- **Session Management**: Connect-pg-simple for session storage
- **Data Layer**: Drizzle ORM with PostgreSQL support

### Mobile-First Design
- **Target Devices**: Optimized for iPhone displays (375px-430px viewports)
- **Safe Area Support**: iOS safe area insets for notched devices
- **Touch Optimization**: 44px minimum touch targets
- **PWA Support**: Service worker, manifest, and offline functionality

## Key Components

### Core Pages
1. **Home Page** (`/`): Workout selection with large square buttons for mobility and hangboard routines
2. **Session Page** (`/session/:type`): Full-screen timer interface with exercise display
3. **Edit Workout Page** (`/edit/:type`): Workout customization interface

### Timer System
- **Precision**: Millisecond-accurate countdown with auto-advance
- **Controls**: Start/pause/resume with +15 second addition capability
- **Skip Functionality**: Double-tap exercise name to skip current exercise
- **State Preservation**: Maintains timer position during pause instead of resetting

### Audio & Haptic Feedback
- **Exercise Transitions**: Beep sounds and vibration patterns
- **Session Completion**: Distinct completion sound and haptic feedback
- **User Interactions**: Button press sound effects
- **Web APIs**: Uses Web Audio API and navigator.vibrate for feedback

### Workout Data
- **Pre-defined Routines**: 
  - Mobility: 11 exercises, 15 minutes total
  - Hangboard: 19 exercises with specific grip patterns at 20mm edge @ 50% body weight
- **Custom Workouts**: User-editable routines with drag-and-drop reordering
- **Exercise Images**: Local asset mapping for all exercise types with fallback handling

## Recent Changes

### January 23, 2025
- **Updated App Branding**: Changed app name from "FlowTrainer" to "TimerAppp", updated all metadata including HTML title, manifest.json, PWA settings, and Apple web app configurations
- **New App Icon**: Replaced previous icons with pastel minimal clock icon design, updated favicon, Apple touch icons, and PWA manifest icons
- **Fixed Exercise Images Display**: Updated Session component to show exercise images for all workout types (not just hangboard), implementing proper image loading for mobility exercises through getExerciseImage function

## Data Flow

### Storage Strategy
- **Local Storage**: Primary data persistence using localStorage
- **Offline-First**: All functionality works without network connection
- **Session Logs**: Stored as `{ date, sessionType, completedExercises[], totalTime }`
- **Custom Workouts**: Cached locally with fallback to default routines

### State Management
- **Session State**: Current exercise index, timer state, completion tracking
- **Timer Logic**: Custom hook (`useTimer`) managing countdown and lifecycle
- **Workout Progress**: Real-time tracking of completed exercises and elapsed time

### Offline Capabilities
- **Service Worker**: Caches essential assets and provides offline functionality
- **Cache Strategy**: Static assets cached on install, runtime caching for dynamic content
- **Offline Indicator**: Visual feedback when network is unavailable
- **Data Synchronization**: Local-first approach with eventual consistency

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **State Management**: TanStack React Query for server state
- **UI Framework**: Radix UI primitives, TailwindCSS
- **Development**: Vite, TypeScript, ESBuild

### Database & ORM
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Zod validation
- **Migrations**: Drizzle Kit for schema management

### Audio Assets
- **Exercise Transition**: next_1753213600709.mp3
- **Session Complete**: finish_1753213600708.m4a
- **Pause Action**: pause_1753213600709.mp3

### Testing
- **Framework**: Vitest with React Testing Library
- **Coverage**: Component testing for Timer and core functionality

## Deployment Strategy

### Build Process
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: ESBuild bundles Express server to `dist`
- **Asset Handling**: Static assets served from build output

### Environment Configuration
- **Development**: Hot reload with Vite middleware
- **Production**: Optimized static serving with Express
- **Database**: Connection via DATABASE_URL environment variable

### PWA Features
- **Manifest**: Defines app metadata and installation behavior
- **Service Worker**: Provides offline functionality and caching
- **Icons**: SVG icons for various device sizes and contexts

### Performance Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Vite handles CSS/JS minification and bundling
- **Image Assets**: Optimized exercise images with WebP fallbacks
- **Caching Strategy**: Aggressive caching for static assets, smart caching for dynamic content

The application prioritizes mobile user experience with large touch targets, optimized loading times, and seamless offline functionality. The architecture supports both immediate use and long-term session tracking while maintaining simplicity in the user interface.