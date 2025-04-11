import { create } from 'zustand';

interface WorkoutState {
  isWorkoutActive: boolean;
  workoutStartTime: number | null;
  elapsedTime: number;
  isPaused: boolean;
  setIsWorkoutActive: (active: boolean) => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  endWorkout: () => void;
  updateElapsedTime: (time: number) => void;
}

export const useWorkoutState = create<WorkoutState>((set) => ({
  isWorkoutActive: false,
  workoutStartTime: null,
  elapsedTime: 0,
  isPaused: false,
  
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
  
  updateElapsedTime: (time: number) => set({ elapsedTime: time })
}));
