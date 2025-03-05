import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import colors from "@/src/styles/themes/colors";

export default function AddWorkoutScreen() {
  const router = useRouter();

  // Workout Data
  const [workoutName, setWorkoutName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [exercises, setExercises] = useState<
    { Exercise_Name: string; Weight: number; Reps: number; Comment: string }[]
  >([]);
  const [workoutComment, setWorkoutComment] = useState("");

  const daysOfWeek = ["S", "M", "T", "W", "Th", "F", "Sa"];

  // Toggle days for repetition
  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) => {
      return prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day];
    });
  };

  // Function to handle adding a new exercise from search
  const addExercise = () => {
    router.push("/search");
  };

  // Function to save workout
  const saveWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert("Error", "Please enter a workout name.");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise.");
      return;
    }

    const newWorkout = {
      Date: new Date(),
      TimeStarted: BigInt(Date.now()),
      TimeEnded: BigInt(Date.now()), // Placeholder
      Sets: exercises,
      WorkoutComment: workoutComment,
    };

    console.log("Workout saved:", newWorkout);
    Alert.alert("Success", "Workout saved successfully!");
    router.back(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>&lt; Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.header}>Create a New Workout</Text>

        {/* Workout Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Workout Name"
          placeholderTextColor={colors.WHITE}
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        {/* Auto-repetition Days */}
        <Text style={styles.subHeader}>Auto-repetition:</Text>
        <View style={styles.daysContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDays.includes(day) && styles.dayButtonSelected,
              ]}
              onPress={() => toggleDay(day)}
            >
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Exercise Section */}
        <Text style={styles.subHeader}>Exercises:</Text>
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={addExercise}
        >
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>

        {/* List of Added Exercises */}
        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseText}>{exercise.Exercise_Name}</Text>
            <Text style={styles.exerciseDetails}>
              {exercise.Reps} reps - {exercise.Weight} lbs
            </Text>
          </View>
        ))}

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
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.BUTTON_COLOR,
    borderRadius: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: colors.BUTTON_TEXT,
    fontSize: 14,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.WHITE,
    marginBottom: 20,
    marginTop: 10,
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
    borderRadius: 10,
    padding: 10,
    color: colors.WHITE,
    marginBottom: 15,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.BLACK,
  },
  dayButtonSelected: {
    backgroundColor: colors.WHITE,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  addExerciseButton: {
    backgroundColor: colors.BLACK,
    padding: 10,
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
    borderRadius: 10,
    padding: 10,
    color: colors.WHITE,
    marginBottom: 15,
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    padding: 10,
  },
  saveButton: {
    backgroundColor: colors.BLACK,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.BUTTON_TEXT,
  },
});