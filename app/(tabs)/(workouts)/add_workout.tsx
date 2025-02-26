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
      TimeEnded: BigInt(Date.now()), // Placeholder, can be updated later
      Sets: exercises,
      WorkoutComment: workoutComment,
    };

    console.log("Workout saved:", newWorkout);
    Alert.alert("Success", "Workout saved successfully!");
    router.back(); // Navigate back to the previous screen
  };

  return (
    <View style={localStyles.container}>
      <ScrollView contentContainerStyle={localStyles.scrollContainer}>
        {/* Header */}
        <Text style={localStyles.header}>Create a New Workout</Text>

        {/* Workout Name Input */}
        <TextInput
          style={localStyles.input}
          placeholder="Workout Name"
          placeholderTextColor={colors.BUTTON_TEXT}
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        {/* Auto-repetition Days */}
        <Text style={localStyles.subHeader}>Auto-repetition:</Text>
        <View style={localStyles.daysContainer}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                localStyles.dayButton,
                selectedDays.includes(day) && localStyles.dayButtonSelected,
              ]}
              onPress={() => toggleDay(day)}
            >
              <Text style={localStyles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Exercise Section */}
        <Text style={localStyles.subHeader}>Exercises:</Text>
        <TouchableOpacity
          style={localStyles.addExerciseButton}
          onPress={addExercise}
        >
          <Text style={localStyles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>

        {/* List of Added Exercises */}
        {exercises.length > 0 &&
          exercises.map((exercise, index) => (
            <View key={index} style={localStyles.exerciseItem}>
              <Text style={localStyles.exerciseText}>
                {exercise.Exercise_Name}
              </Text>
              <Text style={localStyles.exerciseDetails}>
                {exercise.Reps} reps - {exercise.Weight} lbs
              </Text>
            </View>
          ))}

        {/* Workout Comment */}
        <Text style={localStyles.subHeader}>Workout Notes:</Text>
        <TextInput
          style={localStyles.commentInput}
          placeholder="Add any notes..."
          placeholderTextColor={colors.BUTTON_TEXT}
          value={workoutComment}
          onChangeText={setWorkoutComment}
          multiline
        />
      </ScrollView>

      {/* Save Workout Button */}
      <View style={localStyles.saveButtonContainer}>
        <TouchableOpacity style={localStyles.saveButton} onPress={saveWorkout}>
          <Text style={localStyles.saveButtonText}>Save Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
    padding: 20,
  },
  scrollContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.WHITE,
    marginBottom: 20,
    marginTop: 20,
  },
  subHeader: {
    fontSize: 18,
    color: colors.WHITE,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: colors.BUTTON_COLOR,
    borderRadius: 10,
    padding: 10,
    color: colors.BUTTON_TEXT,
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
    backgroundColor: colors.BUTTON_COLOR,
  },
  dayButtonSelected: {
    backgroundColor: colors.BUTTON_TEXT,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.BUTTON_TEXT,
  },
  addExerciseButton: {
    backgroundColor: colors.BUTTON_COLOR,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  addExerciseText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.BUTTON_TEXT,
  },
  exerciseItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.BUTTON_COLOR,
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
    color: colors.BUTTON_TEXT,
  },
  commentInput: {
    width: "100%",
    backgroundColor: colors.BUTTON_COLOR,
    borderRadius: 10,
    padding: 10,
    color: colors.BUTTON_TEXT,
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
    backgroundColor: colors.BUTTON_COLOR,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.WHITE,
  },
});
