import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import colors from "@/src/styles/themes/colors";
import { useWorkoutPresetState } from "../useWorkoutPresetState";
import { WorkoutPreset, Set } from "@/app/db/Types";
import BackButton from "@/components/back_button";
import { Ionicons } from "@expo/vector-icons";

export default function AddWorkoutScreen() {
  const router = useRouter();
  const { 
    savePreset, 
    isLoading, 
    error,
    selectedExercises,
    setSelectedExercises,
    addSelectedExercisesToPreset 
  } = useWorkoutPresetState();

  // Workout Data
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Set[]>([]);
  const [workoutComment, setWorkoutComment] = useState("");

  // Show error if any
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  // Handle selected exercises
  useEffect(() => {
    if (selectedExercises) {
      const updatedExercises = addSelectedExercisesToPreset({
        Name: workoutName,
        Comment: workoutComment || null,
        Preset: exercises
      }).Preset;
      
      setExercises(updatedExercises);
      setSelectedExercises(null); // Clear the selection
    }
  }, [selectedExercises]);

  // Function to handle adding a new exercise from search
  const handleAddExercise = () => {
    router.push({
      pathname: "/(tabs)/search",
      params: { returnScreen: "add" }
    });
  };

  // Function to save workout
  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert("Error", "Please enter a workout name.");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise.");
      return;
    }

    const newPreset: WorkoutPreset = {
      Name: workoutName,
      Comment: workoutComment || null,
      Preset: exercises,
    };

    const success = await savePreset(newPreset);
    if (success) {
      Alert.alert("Success", "Workout saved successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/workouts"),
        },
      ]);
    }
  };

  // Function to remove an exercise
  const removeExercise = (exerciseName: string) => {
    const updatedExercises = exercises.filter(
      (set) => set.Exercise_Name !== exerciseName
    );
    setExercises(updatedExercises);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, localStyles.centered]}>
        <ActivityIndicator size="large" color={colors.PURPLE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button and Header */}
        <View style={styles.headerContainer}>
          <BackButton />
          <View style={styles.headerTextContainer}>
            <Text style={styles.header}>Create a New Workout</Text>
          </View>
        </View>

        {/* Workout Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Workout Name"
          placeholderTextColor={colors.WHITE}
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        {/* Add Exercise Section */}
        <Text style={styles.subHeader}>Exercises:</Text>
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={handleAddExercise}
        >
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>

        {/* List of Added Exercises */}
        {Array.from(new Map(exercises.map(set => [set.Exercise_Name, set])).values()).map((exercise, index) => {
          const exerciseSets = exercises.filter(set => set.Exercise_Name === exercise.Exercise_Name);
          return (
            <View key={index} style={styles.exerciseItem}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseText}>{exercise.Exercise_Name}</Text>
                <TouchableOpacity
                  style={styles.deleteExerciseButton}
                  onPress={() => removeExercise(exercise.Exercise_Name)}
                >
                  <Ionicons name="close-circle" size={24} color={colors.WHITE} />
                </TouchableOpacity>
              </View>
              {exerciseSets.map((set, setIndex) => (
                <Text key={setIndex} style={styles.exerciseDetails}>
                  Set {setIndex + 1}: {set.Reps} reps @ {set.Weight} lbs
                </Text>
              ))}
            </View>
          );
        })}

        {/* Workout Comment */}
        <Text style={styles.subHeader}>Workout Notes:</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Add any notes..."
          placeholderTextColor={colors.WHITE}
          value={workoutComment}
          onChangeText={setWorkoutComment}
          multiline
        />
      </ScrollView>

      {/* Save Workout Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
          <Text style={styles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Reuse your color styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    padding: 20,
  },
  scrollContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 100,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    position: "relative",
  },
  headerTextContainer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  subHeader: {
    fontSize: 18,
    color: colors.WHITE,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: colors.BLACK,
    borderWidth: 1,
    borderColor: colors.WHITE,
    borderRadius: 10,
    padding: 10,
    color: colors.WHITE,
    marginBottom: 15,
  },
  addExerciseButton: {
    backgroundColor: colors.BLACK,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.WHITE,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  addExerciseText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  exerciseItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.BLACK,
    borderWidth: 1,
    borderColor: colors.WHITE,
    marginBottom: 10,
    width: "100%",
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  exerciseDetails: {
    fontSize: 14,
    color: colors.WHITE,
  },
  commentInput: {
    width: "100%",
    backgroundColor: colors.BLACK,
    borderWidth: 1,
    borderColor: colors.WHITE,
    borderRadius: 10,
    padding: 10,
    color: colors.WHITE,
    marginBottom: 15,
  },
  saveButtonContainer: {
    marginBottom: 100,
  },
  saveButton: {
    backgroundColor: colors.PURPLE,
    borderWidth: 1,
    borderColor: colors.WHITE,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  deleteExerciseButton: {
    padding: 5,
  },
});

const localStyles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});