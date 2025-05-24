import { create } from 'zustand';
import { json_db } from '../db/json_db';
import { DB, Workout } from '../db/Types';
import { Set } from '../types';

const db = new json_db();

interface WorkoutState {
  isWorkoutActive: boolean;
  workoutStartTime: number;
  elapsedTime: number;
  isPaused: boolean;
  totalWorkoutMinutes: number;
  goalCompletion: number; // value between 0 and 1
  percentMargin: number;
  exerciseList: Array<Set>;

  setIsWorkoutActive: (active: boolean) => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  endWorkout: () => void;
  addExercise: (ex: Set) => void;
  updateElapsedTime: (time: number) => void;
  removeExercise: (index: number) => void;
  updateExercise: (index: number, updatedSet: Set) => void;
}

export const useWorkoutState = create<WorkoutState>((set, get) => ({
  isWorkoutActive: false,
  workoutStartTime: 0,
  elapsedTime: 0,
  isPaused: false,
  totalWorkoutMinutes: 0,
  goalCompletion: 0,
  percentMargin: 70,

  exerciseList: [
    { Exercise_Name: "test", Weight: 4, Reps: 4, Comment: null },
    { Exercise_Name: "test2", Weight: 4, Reps: 4, Comment: "hellooo" }
  ],

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
  
  endWorkout: () => { 
    const state = get();
    const durationInMinutes = Math.floor(state.elapsedTime / 60);

    const newTotal = state.totalWorkoutMinutes + durationInMinutes;
    const newGoalCompletion = Math.min(newTotal / 60, 1); // cap at 1 (100%)

    let newPercentMargin = state.percentMargin;
    if (newGoalCompletion > 0.99) {
      newPercentMargin = 85;
    } else if (newGoalCompletion >= 0.1) {
      newPercentMargin = 80;
    }

    set({
      isWorkoutActive: false,
      workoutStartTime: 0,
      elapsedTime: 0,
      isPaused: false,
      totalWorkoutMinutes: newTotal,
      goalCompletion: newGoalCompletion,
      percentMargin: newPercentMargin,
    });

    const date = new Date();

    const newWorkout: Workout = {
      Date: date,
      TimeStarted: state.workoutStartTime,
      TimeEnded: state.workoutStartTime + state.elapsedTime,
      Sets: state.exerciseList,
      WorkoutComment: null,
    }

    db.saveWorkout(newWorkout);
  },

  addExercise: (ex: Set) => {
    set((state) => ({ exerciseList: [...state.exerciseList, ex] }));
  },

  removeExercise: (index: number) =>
    set((state) => ({
      exerciseList: state.exerciseList.filter((_, i) => i !== index),
    })),
  
  updateExercise: (index: number, updatedSet: Set) =>
    set((state) => ({
      exerciseList: state.exerciseList.map((set, i) =>
        i === index ? updatedSet : set
      ),
    })),
  
  updateElapsedTime: (time: number) => set({ elapsedTime: time })
}));
