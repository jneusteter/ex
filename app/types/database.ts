// Shared types for the application
// These mirror the types from server/database/schema.ts for use in the app

export interface Exercise {
  id: number;
  name: string;
  muscleGroup: string;
  equipment: string | null;
  notes: string | null;
  createdAt: Date;
}

export interface Workout {
  id: number;
  name: string | null;
  startedAt: Date;
  completedAt: Date | null;
  notes: string | null;
}

export interface WorkoutSet {
  id: number;
  workoutId: number;
  exerciseId: number;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  rpe: number | null;
  notes: string | null;
  completedAt: Date;
}

// Extended types for API responses
export interface WorkoutSetWithExercise extends WorkoutSet {
  exerciseName: string;
  muscleGroup: string;
}

export interface WorkoutWithSets extends Workout {
  sets: WorkoutSetWithExercise[];
}
