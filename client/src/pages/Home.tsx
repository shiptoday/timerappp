import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { workoutStorage } from '../lib/storage';
import { getAllWorkouts } from '../lib/data';
import { LogEntry } from '../types';
import { Play, BarChart3, Trash2, Dumbbell } from 'lucide-react';

export default function Home() {
  const [logs, setLogs] = useState<LogEntry[]>(() => workoutStorage.getLogs());
  const [showStats, setShowStats] = useState(false);
  
  const allWorkouts = getAllWorkouts();

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
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-8 text-center">
        <h1 className="text-3xl font-bold mb-2">FlowTrainer</h1>
        <p className="text-blue-100 text-sm">Your personal movement companion</p>
      </header>

      {/* Workout Selection */}
      <section className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Workout</h2>
        
        {/* Display all workouts */}
        {Object.entries(allWorkouts).map(([workoutId, workout]) => {
          const getWorkoutStyles = () => {
            switch (workoutId) {
              case 'mobility':
                return {
                  button: 'bg-emerald-500 hover:bg-emerald-600',
                  icon: 'bg-emerald-400',
                  text: 'text-emerald-100',
                  arrow: 'text-emerald-200',
                  edit: 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                };
              case 'hangboard':
                return {
                  button: 'bg-amber-500 hover:bg-amber-600',
                  icon: 'bg-amber-400',
                  text: 'text-amber-100',
                  arrow: 'text-amber-200',
                  edit: 'border-amber-500 text-amber-600 hover:bg-amber-50'
                };
              default:
                return {
                  button: 'bg-blue-500 hover:bg-blue-600',
                  icon: 'bg-blue-400',
                  text: 'text-blue-100',
                  arrow: 'text-blue-200',
                  edit: 'border-blue-500 text-blue-600 hover:bg-blue-50'
                };
            }
          };
          
          const styles = getWorkoutStyles();
          
          return (
            <div key={workoutId} className="flex items-center space-x-3 mb-2">
              <Link href={`/session/${workoutId}`}>
                <Button 
                  className={`flex-1 ${styles.button} text-white rounded-2xl p-6 h-auto flex items-center justify-between transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg`}
                  aria-label={`Start ${workout.type} workout - ${Math.floor(workout.totalDuration / 60)} minutes, ${workout.steps.length} exercises`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${styles.icon} rounded-full flex items-center justify-center`}>
                      {workoutId === 'mobility' ? (
                        <Play className="text-white w-6 h-6" />
                      ) : workoutId === 'hangboard' ? (
                        <Dumbbell className="text-white w-6 h-6" />
                      ) : (
                        <Play className="text-white w-6 h-6" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg capitalize">{workout.type}</h3>
                      <p className={`${styles.text} text-sm`}>
                        {Math.floor(workout.totalDuration / 60)} min • {workout.steps.length} exercises
                      </p>
                    </div>
                  </div>
                  <div className={styles.arrow}>→</div>
                </Button>
              </Link>
              <Link href={`/edit/${workoutId}`}>
                <Button 
                  variant="outline"
                  className={`px-4 py-6 rounded-2xl ${styles.edit}`}
                  aria-label={`Edit ${workout.type} workout`}
                >
                  ✏️
                </Button>
              </Link>
            </div>
          );
        })}
        
        {/* Add New Workout */}
        <Link href="/edit/new">
          <Button 
            variant="outline"
            className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700 rounded-2xl p-6 h-auto flex items-center justify-center transition-all duration-200"
            aria-label="Create new workout"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">+</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-lg">Add New Workout</h3>
                <p className="text-gray-500 text-sm">Create your custom routine</p>
              </div>
            </div>
          </Button>
        </Link>
      </section>

      {/* Workout Log */}
      <section className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Workouts</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="text-blue-600 hover:text-blue-700"
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
                <span className="text-lg font-bold text-blue-600">
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
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                        log.sessionType === 'mobility' ? 'bg-emerald-500' : 
                        log.sessionType === 'hangboard' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}>
                        {log.sessionType === 'mobility' ? 
                          <Play className="text-white w-4 h-4" /> : 
                          log.sessionType === 'hangboard' ? 
                          <Dumbbell className="text-white w-4 h-4" /> :
                          <Play className="text-white w-4 h-4" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 capitalize">
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
