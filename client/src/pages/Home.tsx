import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { workoutStorage } from '../lib/storage';
import { getAllWorkouts } from '../lib/data';
import { LogEntry } from '../types';
import { Play, Dumbbell, Edit, Plus } from 'lucide-react';

export default function Home() {
  const allWorkouts = getAllWorkouts();

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen safe-area-top safe-area-bottom">
      {/* Workout Selection */}
      <section className="px-6 pt-6 space-y-6">
        
        {/* Mobility Button with Edit */}
        <div className="relative">
          <Link href="/session/mobility">
            <Button 
              className="w-full aspect-square bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-3xl text-2xl font-light transition-all duration-200 h-44 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              aria-label="Start Mobility workout"
            >
              <div className="flex flex-col items-center">
                <Dumbbell className="w-8 h-8 mb-3 opacity-90" />
                Mobility
              </div>
            </Button>
          </Link>
          <Link href="/edit/mobility">
            <Button 
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl min-h-[44px] min-w-[44px]"
              aria-label="Edit Mobility workout"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Hangboard Button with Edit */}
        <div className="relative">
          <Link href="/session/hangboard">
            <Button 
              className="w-full aspect-square bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-3xl text-2xl font-light transition-all duration-200 h-44 shadow-lg shadow-green-500/20 active:scale-[0.98]"
              aria-label="Start Hangboard workout"
            >
              <div className="flex flex-col items-center">
                <Play className="w-8 h-8 mb-3 opacity-90" />
                Hangboard
              </div>
            </Button>
          </Link>
          <Link href="/edit/hangboard">
            <Button 
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl min-h-[44px] min-w-[44px]"
              aria-label="Edit Hangboard workout"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Create New Workout - Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 safe-area-bottom bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-md mx-auto">
          <Link href="/edit/new">
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl py-4 font-medium transition-all duration-200 shadow-lg shadow-orange-500/20 min-h-[56px] active:scale-[0.98]"
              aria-label="Create new workout"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Workout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
