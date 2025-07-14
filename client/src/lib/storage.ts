import { LogEntry, WorkoutSession } from '../types';

const STORAGE_KEY = 'flowtrainer_workout_logs';
const CUSTOM_WORKOUTS_KEY = 'flowtrainer_custom_workouts';

export const workoutStorage = {
  getLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const logs = JSON.parse(stored) as LogEntry[];
      return logs.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    } catch (error) {
      console.error('Error loading workout logs:', error);
      return [];
    }
  },

  addLog(log: Omit<LogEntry, 'id'>): LogEntry {
    const newLog: LogEntry = {
      ...log,
      id: Date.now().toString()
    };

    try {
      const logs = this.getLogs();
      logs.unshift(newLog);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
      return newLog;
    } catch (error) {
      console.error('Error saving workout log:', error);
      throw new Error('Failed to save workout log');
    }
  },

  deleteLog(id: string): void {
    try {
      const logs = this.getLogs();
      const filteredLogs = logs.filter(log => log.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLogs));
    } catch (error) {
      console.error('Error deleting workout log:', error);
      throw new Error('Failed to delete workout log');
    }
  },

  getWeeklyStats(): { date: string; count: number }[] {
    const logs = this.getLogs();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const dailyStats: Record<string, number> = {};
    
    logs.forEach(log => {
      const logDate = new Date(log.completedAt);
      if (logDate >= weekAgo) {
        const dateKey = logDate.toISOString().split('T')[0];
        dailyStats[dateKey] = (dailyStats[dateKey] || 0) + 1;
      }
    });

    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      result.push({
        date: dateKey,
        count: dailyStats[dateKey] || 0
      });
    }

    return result;
  },

  getCustomWorkouts(): Record<string, WorkoutSession> {
    try {
      const stored = localStorage.getItem(CUSTOM_WORKOUTS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading custom workouts:', error);
      return {};
    }
  },

  saveCustomWorkouts(workouts: Record<string, WorkoutSession>): void {
    try {
      localStorage.setItem(CUSTOM_WORKOUTS_KEY, JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving custom workouts:', error);
      throw new Error('Failed to save custom workouts');
    }
  },

  deleteCustomWorkout(workoutId: string): void {
    try {
      const workouts = this.getCustomWorkouts();
      delete workouts[workoutId];
      this.saveCustomWorkouts(workouts);
    } catch (error) {
      console.error('Error deleting custom workout:', error);
      throw new Error('Failed to delete custom workout');
    }
  }
};
