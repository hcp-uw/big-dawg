import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkoutPreset } from './types';
import { json_db } from './db/json_db';

const db = new json_db();

export default function Index() {
  const [workoutPreset, setWorkoutPreset] = useState<WorkoutPreset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkoutPreset = async () => {
      try {
        const preset = await db.getWorkoutPreset("");
        setWorkoutPreset(preset);
      } catch (error) {
        console.error("Error loading workout preset:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadWorkoutPreset();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {workoutPreset ? (
        <Text>Current Workout: {workoutPreset.Name}</Text>
      ) : (
        <Text>No workout preset selected</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 