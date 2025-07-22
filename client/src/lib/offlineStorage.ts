// Offline storage utilities for caching workout data and session progress

interface CachedWorkout {
  id: string;
  name: string;
  type: string;
  steps: any[];
  cachedAt: number;
}

interface SessionProgress {
  sessionId: string;
  currentStepIndex: number;
  startTime: number;
  completedSteps: string[];
  isRunning: boolean;
  cachedAt: number;
}

class OfflineStorage {
  private static instance: OfflineStorage;
  
  private constructor() {}
  
  static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }

  // Cache workout data
  cacheWorkout(workout: any): void {
    try {
      const cached: CachedWorkout = {
        id: workout.id || workout.type,
        name: workout.name,
        type: workout.type,
        steps: workout.steps,
        cachedAt: Date.now()
      };
      
      localStorage.setItem(`workout_${cached.id}`, JSON.stringify(cached));
      this.updateCacheIndex('workouts', cached.id);
    } catch (error) {
      console.warn('Failed to cache workout:', error);
    }
  }

  // Get cached workout
  getCachedWorkout(workoutId: string): any | null {
    try {
      const cached = localStorage.getItem(`workout_${workoutId}`);
      if (cached) {
        const workout: CachedWorkout = JSON.parse(cached);
        
        // Check if cache is not too old (24 hours)
        const maxAge = 24 * 60 * 60 * 1000;
        if (Date.now() - workout.cachedAt < maxAge) {
          return {
            id: workout.id,
            name: workout.name,
            type: workout.type,
            steps: workout.steps
          };
        } else {
          // Remove expired cache
          this.removeCachedWorkout(workoutId);
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to get cached workout:', error);
      return null;
    }
  }

  // Remove cached workout
  removeCachedWorkout(workoutId: string): void {
    try {
      localStorage.removeItem(`workout_${workoutId}`);
      this.removeFromCacheIndex('workouts', workoutId);
    } catch (error) {
      console.warn('Failed to remove cached workout:', error);
    }
  }

  // Save session progress
  saveSessionProgress(sessionId: string, progress: Omit<SessionProgress, 'sessionId' | 'cachedAt'>): void {
    try {
      const sessionProgress: SessionProgress = {
        sessionId,
        ...progress,
        cachedAt: Date.now()
      };
      
      localStorage.setItem(`session_${sessionId}`, JSON.stringify(sessionProgress));
    } catch (error) {
      console.warn('Failed to save session progress:', error);
    }
  }

  // Get session progress
  getSessionProgress(sessionId: string): SessionProgress | null {
    try {
      const cached = localStorage.getItem(`session_${sessionId}`);
      if (cached) {
        const progress: SessionProgress = JSON.parse(cached);
        
        // Check if session is not too old (1 hour)
        const maxAge = 60 * 60 * 1000;
        if (Date.now() - progress.cachedAt < maxAge) {
          return progress;
        } else {
          // Remove expired session
          this.removeSessionProgress(sessionId);
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to get session progress:', error);
      return null;
    }
  }

  // Remove session progress
  removeSessionProgress(sessionId: string): void {
    try {
      localStorage.removeItem(`session_${sessionId}`);
    } catch (error) {
      console.warn('Failed to remove session progress:', error);
    }
  }

  // Cache application data for offline use
  cacheAppData(key: string, data: any): void {
    try {
      const cached = {
        data,
        cachedAt: Date.now()
      };
      localStorage.setItem(`app_${key}`, JSON.stringify(cached));
    } catch (error) {
      console.warn('Failed to cache app data:', error);
    }
  }

  // Get cached application data
  getCachedAppData(key: string, maxAge: number = 24 * 60 * 60 * 1000): any | null {
    try {
      const cached = localStorage.getItem(`app_${key}`);
      if (cached) {
        const { data, cachedAt } = JSON.parse(cached);
        
        if (Date.now() - cachedAt < maxAge) {
          return data;
        } else {
          localStorage.removeItem(`app_${key}`);
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to get cached app data:', error);
      return null;
    }
  }

  // Update cache index for cleanup
  private updateCacheIndex(category: string, id: string): void {
    try {
      const index = this.getCacheIndex(category);
      if (!index.includes(id)) {
        index.push(id);
        localStorage.setItem(`cache_index_${category}`, JSON.stringify(index));
      }
    } catch (error) {
      console.warn('Failed to update cache index:', error);
    }
  }

  // Remove from cache index
  private removeFromCacheIndex(category: string, id: string): void {
    try {
      const index = this.getCacheIndex(category);
      const newIndex = index.filter(item => item !== id);
      localStorage.setItem(`cache_index_${category}`, JSON.stringify(newIndex));
    } catch (error) {
      console.warn('Failed to remove from cache index:', error);
    }
  }

  // Get cache index
  private getCacheIndex(category: string): string[] {
    try {
      const index = localStorage.getItem(`cache_index_${category}`);
      return index ? JSON.parse(index) : [];
    } catch (error) {
      console.warn('Failed to get cache index:', error);
      return [];
    }
  }

  // Clean up old cached data
  cleanupOldCaches(): void {
    try {
      const workoutIndex = this.getCacheIndex('workouts');
      workoutIndex.forEach(id => {
        const workout = this.getCachedWorkout(id);
        if (!workout) {
          this.removeFromCacheIndex('workouts', id);
        }
      });
      
      // Clean up old sessions (older than 1 hour)
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('session_')) {
          const sessionId = key.replace('session_', '');
          this.getSessionProgress(sessionId); // This will auto-cleanup if expired
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup old caches:', error);
    }
  }

  // Check available storage space
  getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      const test = 'test';
      let used = 0;
      
      // Calculate used space
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
      
      // Estimate available space (localStorage limit is usually 5-10MB)
      const estimated_total = 5 * 1024 * 1024; // 5MB
      const available = estimated_total - used;
      const percentage = (used / estimated_total) * 100;
      
      return { used, available, percentage };
    } catch (error) {
      console.warn('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  // Clear all cached data
  clearAllCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('workout_') || 
            key.startsWith('session_') || 
            key.startsWith('app_') || 
            key.startsWith('cache_index_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
}

export const offlineStorage = OfflineStorage.getInstance();
export default offlineStorage;