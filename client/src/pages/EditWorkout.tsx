import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { getWorkoutSession } from '../lib/data';
import { workoutStorage } from '../lib/storage';
import { SessionStep, WorkoutSession } from '../types';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';

export default function EditWorkout() {
  const params = useParams<{ type: string }>();
  const [, navigate] = useLocation();
  
  const workoutType = params.type as 'mobility' | 'hangboard' | 'new';
  const isNewWorkout = workoutType === 'new';
  
  const [workoutName, setWorkoutName] = useState('');
  const [workoutColor, setWorkoutColor] = useState('#10B981');
  const [steps, setSteps] = useState<SessionStep[]>([]);

  useEffect(() => {
    if (!isNewWorkout) {
      const session = getWorkoutSession(workoutType);
      if (session) {
        setWorkoutName(workoutType.charAt(0).toUpperCase() + workoutType.slice(1));
        setWorkoutColor(workoutType === 'mobility' ? '#10B981' : '#F59E0B');
        setSteps([...session.steps]);
      }
    } else {
      setWorkoutName('');
      setWorkoutColor('#10B981');
      setSteps([]);
    }
  }, [workoutType, isNewWorkout]);

  const addStep = () => {
    const newStep: SessionStep = {
      id: `step-${Date.now()}`,
      name: '',
      duration: 60,
      instructions: '', // Keep for compatibility but won't be displayed
      type: 'exercise'
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof SessionStep, value: any) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setSteps(updatedSteps);
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    const updatedSteps = [...steps];
    const [movedStep] = updatedSteps.splice(fromIndex, 1);
    updatedSteps.splice(toIndex, 0, movedStep);
    setSteps(updatedSteps);
  };

  const saveWorkout = () => {
    if (!workoutName.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (steps.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    const hasEmptySteps = steps.some(step => !step.name.trim() || !step.instructions.trim());
    if (hasEmptySteps) {
      alert('Please fill in all exercise names and instructions');
      return;
    }

    // Save to custom workouts in localStorage
    const customWorkouts = workoutStorage.getCustomWorkouts();
    const workoutId = isNewWorkout ? workoutName.toLowerCase().replace(/\s+/g, '-') : workoutType;
    
    const newWorkout: WorkoutSession = {
      type: workoutId as any,
      steps,
      totalDuration: steps.reduce((sum, step) => sum + step.duration, 0)
    };

    customWorkouts[workoutId] = newWorkout;
    workoutStorage.saveCustomWorkouts(customWorkouts);

    navigate('/');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="bg-black text-white px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:text-opacity-80 p-2"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-light">
            {isNewWorkout ? 'New Workout' : `Edit ${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)}`}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={saveWorkout}
            className="text-white hover:text-opacity-80 p-2 font-light"
            aria-label="Save workout"
          >
            Save
          </Button>
        </div>
      </header>

      {/* Workout Settings */}
      <main className="p-6 space-y-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor="workout-name">Workout Name</Label>
              <Input
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Enter workout name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="workout-color">Color Theme</Label>
              <Select value={workoutColor} onValueChange={setWorkoutColor}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="#10B981">🟢 Green</SelectItem>
                  <SelectItem value="#F59E0B">🟡 Amber</SelectItem>
                  <SelectItem value="#3B82F6">🔵 Blue</SelectItem>
                  <SelectItem value="#8B5CF6">🟣 Purple</SelectItem>
                  <SelectItem value="#EF4444">🔴 Red</SelectItem>
                  <SelectItem value="#F97316">🟠 Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total Duration: {formatTime(steps.reduce((sum, step) => sum + step.duration, 0))}</span>
                <span>Exercises: {steps.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Exercises</h2>
            <Button
              onClick={addStep}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Exercise
            </Button>
          </div>

          {steps.map((step, index) => (
            <Card key={step.id} className="bg-white">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      Exercise {index + 1}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStep(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`step-name-${index}`}>Exercise Name</Label>
                    <Input
                      id={`step-name-${index}`}
                      value={step.name}
                      onChange={(e) => updateStep(index, 'name', e.target.value)}
                      placeholder="Enter exercise name"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`step-duration-${index}`}>Duration (seconds)</Label>
                      <Input
                        id={`step-duration-${index}`}
                        type="number"
                        value={step.duration}
                        onChange={(e) => updateStep(index, 'duration', parseInt(e.target.value) || 0)}
                        min="1"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`step-image-${index}`}>Exercise Image</Label>
                      <Select 
                        value={step.imageKey || 'none'} 
                        onValueChange={(value) => updateStep(index, 'imageKey', value === 'none' ? undefined : value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select image" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No image</SelectItem>
                          <SelectItem value="Banded shoulder dislocates">Banded Shoulder Dislocates</SelectItem>
                          <SelectItem value="Adho mukha svanasana (Downward Dog)">Downward Dog</SelectItem>
                          <SelectItem value="Cat–Cow">Cat-Cow</SelectItem>
                          <SelectItem value="Wrist pulses (front/back on floor)">Wrist Pulses</SelectItem>
                          <SelectItem value="Quadruped Hip CAR's">Hip CARs</SelectItem>
                          <SelectItem value="Hip thrust + Arch">Hip Thrust + Arch</SelectItem>
                          <SelectItem value="Upavistha konasana">Wide-Leg Forward Fold</SelectItem>
                          <SelectItem value="Halasana (Knees to floor)">Plow Pose</SelectItem>
                          <SelectItem value="Garland squat">Garland Squat</SelectItem>
                          <SelectItem value="Pigeon pose + Frog">Pigeon + Frog</SelectItem>
                          <SelectItem value="Active bar hang">Active Bar Hang</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                </div>
              </CardContent>
            </Card>
          ))}

          {steps.length === 0 && (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <Plus className="w-12 h-12 mx-auto mb-2" />
                </div>
                <p className="text-gray-600 mb-4">No exercises added yet</p>
                <Button
                  onClick={addStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Your First Exercise
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-4 pb-8">
          <Button
            onClick={saveWorkout}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
          >
            {isNewWorkout ? 'Create Workout' : 'Save Changes'}
          </Button>
        </div>
      </main>
    </div>
  );
}