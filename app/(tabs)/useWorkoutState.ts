import { create } from 'zustand';
import {json_db} from '../db/json_db' // Adjusted path to match the correct location
import {DB, Workout, Set} from '../db/Types'

const db: DB = new json_db();

interface WorkoutState {
  isWorkoutActive: boolean;
  workoutStartTime: number | null;
  elapsedTime: number;
  isPaused: boolean;
  exerciseList: Array<Set>;
  setIsWorkoutActive: (active: boolean) => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  endWorkout: () => void;
  addExercise: (ex: Set) => void;
  updateElapsedTime: (time: number) => void;
}

export const useWorkoutState = create<WorkoutState>((set) => ({
  isWorkoutActive: false,
  workoutStartTime: null,
  elapsedTime: 0,
  isPaused: false,
  exerciseList: [],
  
  setIsWorkoutActive: (active: boolean) => set({ isWorkoutActive: active }),
  
  startWorkout: () => set({
    isWorkoutActive: true,
    workoutStartTime: Date.now(),
    elapsedTime: 0,
    isPaused: false,
  }),
  
  pauseWorkout: () => set((state) => ({
    isPaused: true,
    // Store the current elapsed time when pausing
    elapsedTime: state.workoutStartTime 
      ? Math.floor((Date.now() - state.workoutStartTime) / 1000) 
      : state.elapsedTime
  })),
  
  resumeWorkout: () => set((state) => ({
    isPaused: false,
    // Update the start time to account for the pause duration
    workoutStartTime: Date.now() - (state.elapsedTime * 1000)
  })),
  
  endWorkout: () => set({
    isWorkoutActive: false,
    workoutStartTime: null,
    elapsedTime: 0,
    isPaused: false 
  }),

  addExercise: (ex: Set) => {
    set((state) => ({ exerciseList: [...state.exerciseList, ex] }));
  },
  
  updateElapsedTime: (time: number) => set({ elapsedTime: time })
}));
