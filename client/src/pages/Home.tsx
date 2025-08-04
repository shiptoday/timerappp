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
    <div className="max-w-md mx-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen iPhone-16-optimized iPhone-pro-optimized relative overflow-hidden" style={{ minHeight: '100dvh' }}>
      {/* Beautiful background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-8 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-6 w-20 h-20 bg-gradient-to-br from-green-400/20 to-cyan-400/20 rounded-full blur-lg"></div>
      </div>

      {/* Workout Selection */}
      <section className="relative z-10 px-6 pt-8 space-y-6 ios-scroll">
        
        {/* Mobility Button with Edit */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Link href="/session/mobility">
            <Button 
              className="relative w-full aspect-square gradient-mobility hover:opacity-90 text-white rounded-3xl text-2xl font-light button-beautiful h-44 shadow-2xl shadow-purple-500/25 border border-white/10"
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
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-coral-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Link href="/session/hangboard">
            <Button 
              className="relative w-full aspect-square gradient-hangboard hover:opacity-90 text-white rounded-3xl text-2xl font-light button-beautiful h-44 shadow-2xl shadow-pink-500/25 border border-white/10"
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
      <div className="fixed bottom-0 left-0 right-0 p-6 glass-strong border-t border-white/10 dark:border-gray-800/30 relative z-20" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}>
        <div className="max-w-md mx-auto">
          <Link href="/edit/new">
            <Button 
              className="w-full gradient-create hover:opacity-90 text-white rounded-2xl py-4 font-medium button-beautiful shadow-2xl shadow-pink-500/30 min-h-[56px] border border-white/10"
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
