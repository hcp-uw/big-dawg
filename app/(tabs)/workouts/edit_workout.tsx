import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "@/src/styles/themes/colors";

export default function EditWorkoutScreen() {
  const router = useRouter();

  // Grab route params
  const {
    workoutId,
    name,
    days,
    exercises: preExercises,
    comment,
  } = useLocalSearchParams();

  // Memoize the parsed values to prevent new references on every render
  const existingName = useMemo(() => {
    return Array.isArray(name) ? name[0] : name ?? "";
  }, [name]);

  const existingDays = useMemo(() => {
    return days ? JSON.parse(days as string) : [];
  }, [days]);

  const existingExercises = useMemo(() => {
    return preExercises ? JSON.parse(preExercises as string) : [];
  }, [preExercises]);

  const existingComment = useMemo(() => {
    return Array.isArray(comment) ? comment[0] : comment ?? "";
  }, [comment]);

  // Local state for editing
  const [workoutName, setWorkoutName] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [exercises, setExercises] = useState<
    { Exercise_Name: string; Weight: number; Reps: number; Comment: string }[]
  >([]);
  const [workoutComment, setWorkoutComment] = useState("");

  const daysOfWeek = ["S", "M", "T", "W", "Th", "F", "Sa"];

  // On mount, pre-populate with existing data
  useEffect(() => {
    setWorkoutName(existingName);
    setSelectedDays(existingDays);
    setExercises(existingExercises);
    setWorkoutComment(existingComment);
  }, [existingName, existingDays, existingExercises, existingComment]);

  // Toggle days for repetition
  const toggleDay = (day: string) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  // Function to handle adding a new exercise from search
  const addExercise = () => {
    router.push("/search");
  };

  // Function to update the workout
  const updateWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert("Error", "Please enter a workout name.");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise.");
      return;
    }

    const updatedWorkout = {
      id: workoutId,
      Date: new Date(),
      TimeStarted: BigInt(Date.now()),
      TimeEnded: BigInt(Date.now()), // Placeholder
      Sets: exercises,
      WorkoutComment: workoutComment,
      Days: selectedDays,
      WorkoutName: workoutName,
    };

    console.log("Workout updated:", updatedWorkout);
    Alert.alert("Success", "Workout updated successfully!", [
      {
        text: "OK",
        onPress: () => router.replace("/(tabs)/workouts"),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.header}>Edit Workout</Text>

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

        {/* List of Exercises */}
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

      {/* Update Workout Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={updateWorkout}>
          <Text style={styles.saveButtonText}>Update Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
    backgroundColor: colors.BLACK,
    borderRadius: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: colors.WHITE,
    fontSize: 24,
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
    borderWidth: 1,
    borderColor: colors.WHITE,
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
    borderWidth: 1,
    borderColor: colors.WHITE,
  },
  dayButtonSelected: {
    backgroundColor: colors.PURPLE,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.WHITE,
  },
  addExerciseButton: {
    backgroundColor: colors.BLACK,
    borderWidth: 1,
    borderColor: colors.WHITE,
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
});
