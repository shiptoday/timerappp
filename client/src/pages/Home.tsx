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
    <div className="max-w-md mx-auto bg-white min-h-screen p-6">
      {/* Workout Selection */}
      <section className="space-y-6">
        
        {/* Mobility Button with Edit */}
        <div className="relative">
          <Link href="/session/mobility">
            <Button 
              className="w-full aspect-square bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-2xl font-light transition-all duration-200 h-40"
              aria-label="Start Mobility workout"
            >
              Mobility
            </Button>
          </Link>
          <Link href="/edit/mobility">
            <Button 
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-white hover:text-blue-200 p-1"
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
              className="w-full aspect-square bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-2xl font-light transition-all duration-200 h-40"
              aria-label="Start Hangboard workout"
            >
              Hangboard
            </Button>
          </Link>
          <Link href="/edit/hangboard">
            <Button 
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-white hover:text-blue-200 p-1"
              aria-label="Edit Hangboard workout"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Create New Workout - Bottom */}
      <div className="fixed bottom-6 left-6 right-6">
        <div className="max-w-md mx-auto">
          <Link href="/edit/new">
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-4 font-light transition-all duration-200"
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
