# FlowTrainer - Replit.md

## Overview

FlowTrainer is a minimal, mobile-first web application designed for fitness enthusiasts focusing on mobility training and hangboard workouts. The app provides structured workout sessions with timers, audio feedback, and local workout logging. It's built as a single-page application with offline capabilities and no backend dependencies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with local state, no global state management
- **Data Fetching**: TanStack Query for caching and data synchronization
- **Styling**: TailwindCSS with Radix UI components for consistent design

### Backend Architecture
- **Server**: Express.js with TypeScript
- **API Structure**: RESTful endpoints (currently minimal, designed for future expansion)
- **Development Setup**: Vite integration with HMR for development workflow

## Key Components

### Core Application Structure
- **App.tsx**: Main application component with QueryClient provider and routing setup
- **Pages**: 
  - Home page (`/`) - workout selection and log viewing
  - Session page (`/session/:type`) - workout execution interface
- **Components**: Timer component for workout execution with circular progress display

### Workout System
- **Predefined Routines**: Hard-coded mobility (15 min) and hangboard (15 min) routines
- **Session Management**: Timer-based workout flow with start/pause/next/finish controls
- **Audio Feedback**: Web Audio API for beeps and navigator.vibrate for haptic feedback

### Data Management
- **Local Storage**: All workout data persisted locally using localStorage
- **Workout Logging**: Automatic logging of completed sessions with date, type, exercises, and duration
- **Statistics**: Weekly workout volume tracking and visualization

## Data Flow

1. **Workout Selection**: User selects mobility or hangboard from home screen
2. **Session Execution**: App loads predefined routine and enters timer-based flow
3. **Progress Tracking**: Timer component manages countdown and auto-advance
4. **Session Completion**: Results logged to localStorage with completion metadata
5. **History Display**: Home screen shows reverse-chronological workout history

## External Dependencies

### UI and Styling
- **Radix UI**: Complete component library for accessible UI primitives
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Class Variance Authority**: Type-safe variant management for components

### Development Tools
- **Vite**: Fast build tool with HMR and plugin ecosystem
- **TypeScript**: Type safety across client and server code
- **Testing**: Jest and React Testing Library for component testing

### Database and Storage
- **Drizzle ORM**: Configured for PostgreSQL but not actively used (future expansion)
- **Local Storage**: Primary data persistence mechanism for offline functionality

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both client and server with hot reload
- **Type Checking**: `npm run check` for TypeScript validation
- **Database Management**: `npm run db:push` for schema migrations (future use)

### Production Build
- **Client Build**: Vite builds optimized React bundle to `dist/public`
- **Server Build**: esbuild compiles Express server to `dist/index.js`
- **Single Command**: `npm run build` handles both client and server compilation

### Architecture Decisions

**Offline-First Approach**: Chosen to ensure app works without internet connection, using localStorage for persistence instead of remote database.

**Mobile-First Design**: TailwindCSS responsive utilities prioritize mobile experience, with touch-friendly controls and compact layouts.

**Hard-Coded Routines**: Simplified initial implementation avoids complex routine management, focusing on core timer and logging functionality.

**Express Backend**: Minimal server setup allows for future API expansion while maintaining simple development workflow.

**Component Library**: Radix UI provides accessible, unstyled components that work well with TailwindCSS customization approach.

## Recent Changes: Latest modifications with dates

- **January 14, 2025**: Fixed timer functionality - Timer now properly syncs with external play/pause controls
- **January 14, 2025**: Improved styling - Changed background to light gray, enhanced color contrast for better readability
- **January 14, 2025**: Added workout editing functionality - Users can now edit existing workouts and create new custom routines
- **January 14, 2025**: Implemented persistent custom workout storage using localStorage
- **January 14, 2025**: Enhanced Home page to display all available workouts (default + custom) with edit buttons