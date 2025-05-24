import { create } from 'zustand';
import { json_db } from '../db/json_db';
import { DB, WorkoutPreset, Set } from '../db/Types';

const db: DB = new json_db();

interface WorkoutPresetState {
  presets: WorkoutPreset[];
  isLoading: boolean;
  error: string | null;
  selectedExercises: Set[] | null;
  
  // Actions
  fetchPresets: () => Promise<void>;
  getPreset: (name: string) => Promise<WorkoutPreset | null>;
  savePreset: (preset: WorkoutPreset) => Promise<boolean>;
  deletePreset: (name: string) => Promise<boolean>;
  clearError: () => void;
  setSelectedExercises: (exercises: Set[] | null) => void;
  addSelectedExercisesToPreset: (preset: WorkoutPreset) => WorkoutPreset;
}

export const useWorkoutPresetState = create<WorkoutPresetState>((set, get) => ({
  presets: [],
  isLoading: false,
  error: null,
  selectedExercises: null,

  fetchPresets: async () => {
    set({ isLoading: true, error: null });
    try {
      // Get all presets from the database
      const allPresets = await db.getWorkoutPresetList();
      set({ presets: allPresets, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch workout presets', isLoading: false });
    }
  },

  getPreset: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const preset = await db.getWorkoutPreset(name);
      set({ isLoading: false });
      return preset;
    } catch (err) {
      set({ error: 'Failed to fetch workout preset', isLoading: false });
      return null;
    }
  },

  savePreset: async (preset: WorkoutPreset) => {
    set({ isLoading: true, error: null });
    try {
      const result = await db.saveWorkoutPreset(preset);
      // Refresh the presets list after saving
      await get().fetchPresets();
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: 'Failed to save workout preset', isLoading: false });
      return false;
    }
  },

  deletePreset: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await db.deleteWorkoutPreset(name);
      // Refresh the presets list after deleting
      await get().fetchPresets();
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ error: 'Failed to delete workout preset', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),

  setSelectedExercises: (exercises) => set({ selectedExercises: exercises }),

  addSelectedExercisesToPreset: (preset) => {
    const { selectedExercises } = get();
    if (!selectedExercises) return preset;

    // Group sets by exercise name
    const exerciseGroups = new Map<string, Set[]>();
    
    // Add existing exercises to groups
    preset.Preset.forEach(set => {
      if (!exerciseGroups.has(set.Exercise_Name)) {
        exerciseGroups.set(set.Exercise_Name, []);
      }
      exerciseGroups.get(set.Exercise_Name)?.push(set);
    });
    
    // Add new sets to groups
    selectedExercises.forEach(set => {
      if (!exerciseGroups.has(set.Exercise_Name)) {
        exerciseGroups.set(set.Exercise_Name, []);
      }
      exerciseGroups.get(set.Exercise_Name)?.push(set);
    });
    
    // Convert groups back to array
    const newExercises = Array.from(exerciseGroups.values()).flat();
    
    return {
      ...preset,
      Preset: newExercises
    };
  }
})); 