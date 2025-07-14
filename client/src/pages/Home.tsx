import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { workoutStorage } from '../lib/storage';
import { LogEntry } from '../types';
import { Play, BarChart3, Trash2, Dumbbell } from 'lucide-react';

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>(() => workoutStorage.getLogs());
  const [showStats, setShowStats] = useState(false);

  const deleteLog = (id: string) => {
    workoutStorage.deleteLog(id);
    setLogs(workoutStorage.getLogs());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const weeklyStats = workoutStorage.getWeeklyStats();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-8 text-center">
        <h1 className="text-3xl font-bold mb-2">FlowTrainer</h1>
        <p className="text-blue-100 text-sm">Your personal movement companion</p>
      </header>

      {/* Workout Selection */}
      <section className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-neutral mb-4">Choose Your Workout</h2>
        
        {/* Mobility Button */}
        <Link href="/session/mobility">
          <Button 
            className="w-full bg-secondary hover:bg-emerald-600 text-white rounded-2xl p-6 h-auto flex items-center justify-between transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Start Mobility workout - 15 minutes, 11 exercises"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center">
                <Play className="text-white w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Mobility</h3>
                <p className="text-emerald-100 text-sm">15 min • 11 exercises</p>
              </div>
            </div>
            <div className="text-emerald-200">→</div>
          </Button>
        </Link>

        {/* Hangboard Button */}
        <Link href="/session/hangboard">
          <Button 
            className="w-full bg-accent hover:bg-amber-600 text-white rounded-2xl p-6 h-auto flex items-center justify-between transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Start Hangboard workout - 15 minutes, strength training"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                <Dumbbell className="text-white w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Hangboard</h3>
                <p className="text-amber-100 text-sm">15 min • Strength training</p>
              </div>
            </div>
            <div className="text-amber-200">→</div>
          </Button>
        </Link>
      </section>

      {/* Workout Log */}
      <section className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral">Recent Workouts</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="text-primary hover:text-blue-600"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            View Stats
          </Button>
        </div>

        {/* Weekly Stats */}
        {showStats && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">This Week</span>
                <span className="text-lg font-bold text-primary">
                  {weeklyStats.reduce((sum, day) => sum + day.count, 0)} sessions
                </span>
              </div>
              <div className="space-y-2">
                {weeklyStats.map((day, index) => {
                  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(day.date).getDay()];
                  const maxCount = Math.max(...weeklyStats.map(d => d.count), 1);
                  const width = (day.count / maxCount) * 100;
                  
                  return (
                    <div key={day.date} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 w-8">{dayName}</span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <span className="text-gray-600 w-4">{day.count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Log Entries */}
        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        log.sessionType === 'mobility' ? 'bg-secondary' : 'bg-accent'
                      }`}>
                        {log.sessionType === 'mobility' ? 
                          <Play className="text-white w-4 h-4" /> : 
                          <Dumbbell className="text-white w-4 h-4" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-neutral capitalize">
                          {log.sessionType}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(log.completedAt)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLog(log.id)}
                      className="text-error hover:text-red-600 p-2"
                      aria-label="Delete workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{log.completedExercises.length} exercises completed</span>
                    <span>{formatDuration(log.totalTime)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No workouts yet</p>
            <p className="text-sm">Start your first session above!</p>
          </div>
        )}
      </section>
    </div>
  );
}
