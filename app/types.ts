import { NavigatorScreenParams } from '@react-navigation/native';

export type Set = {
  Exercise_Name: string;
  Weight: number;
  Reps: number;
  Comment: string | null;
};

export type WorkoutPreset = {
  Name: string;
  Comment: string | null;
  Preset: Set[];
};

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

export type RootStackParamList = {
    Index: undefined; // No parameters for the Index screen
    WorkoutPreset: undefined; // No parameters for the WorkoutPreset screen
    AddExercise: undefined;
}; 