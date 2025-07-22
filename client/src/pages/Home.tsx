import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { workoutStorage } from '../lib/storage';
import { getAllWorkouts } from '../lib/data';
import { LogEntry } from '../types';
import { Play, Dumbbell } from 'lucide-react';

export default function Home() {
  const allWorkouts = getAllWorkouts();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Workout Selection */}
      <section className="px-6 space-y-6">
        
        {/* Mobility Button */}
        <Link href="/session/mobility">
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white rounded-none py-8 text-xl font-light transition-all duration-200"
            aria-label="Start Mobility workout"
          >
            Mobility
          </Button>
        </Link>

        {/* Hangboard Button */}
        <Link href="/session/hangboard">
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white rounded-none py-8 text-xl font-light transition-all duration-200"
            aria-label="Start Hangboard workout"
          >
            Hangboard
          </Button>
        </Link>

        {/* Edit Section */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex space-x-4">
            <Link href="/edit/mobility" className="flex-1">
              <Button 
                variant="outline"
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 rounded-none py-4 font-light"
              >
                Edit Mobility
              </Button>
            </Link>
            <Link href="/edit/hangboard" className="flex-1">
              <Button 
                variant="outline"
                className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 rounded-none py-4 font-light"
              >
                Edit Hangboard
              </Button>
            </Link>
          </div>
          <Link href="/edit/new">
            <Button 
              variant="outline"
              className="w-full mt-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 rounded-none py-4 font-light"
            >
              Create New Workout
            </Button>
          </Link>
        </div>
      </section>


    </div>
  );
}
