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
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "@/src/styles/themes/colors";
import { useWorkoutState } from "../useWorkoutState";
import { useWorkoutPresetState } from "../useWorkoutPresetState";
import { styles } from "@/src/styles/globalStyles";
import { WorkoutPreset, Set } from "@/app/db/Types";
import BackButton from "@/components/back_button";
import { Ionicons } from "@expo/vector-icons";

export default function EditWorkoutScreen() {
  const router = useRouter();
  const { presetName } = useLocalSearchParams();
  const { 
    getPreset, 
    savePreset, 
    deletePreset, 
    isLoading, 
    error,
    selectedExercises,
    setSelectedExercises,
    addSelectedExercisesToPreset 
  } = useWorkoutPresetState();
  const startWorkout = useWorkoutState((state) => state.startWorkout);

  // Local state for editing
  const [workoutName, setWorkoutName] = useState<string>("");
  const [exercises, setExercises] = useState<Set[]>([]);
  const [workoutComment, setWorkoutComment] = useState("");

  // Load preset data on mount
  useEffect(() => {
    const loadPreset = async () => {
      if (presetName) {
        const preset = await getPreset(presetName as string);
        if (preset) {
          setWorkoutName(preset.Name);
          setExercises(preset.Preset);
          setWorkoutComment(preset.Comment || "");
        }
      }
    };
    loadPreset();
  }, [presetName]);

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

  // Show error if any
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  // Function to handle adding a new exercise from search
  const handleAddExercise = () => {
    router.push({
      pathname: "/(tabs)/search",
      params: { returnScreen: "edit" }
    });
  };

  // Function to update the workout
  const updateWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert("Error", "Please enter a workout name.");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise.");
      return;
    }

    const updatedPreset: WorkoutPreset = {
      Name: workoutName,
      Comment: workoutComment || null,
      Preset: exercises,
    };

    const success = await savePreset(updatedPreset);
    if (success) {
      Alert.alert("Success", "Workout updated successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/workouts"),
        },
      ]);
    }
  };

  // Function to delete the workout
  const handleDelete = async () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (presetName) {
              const success = await deletePreset(presetName as string);
              if (success) {
                router.replace("/(tabs)/workouts");
              }
            }
          },
        },
      ]
    );
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
      <View style={[localStyles.container, localStyles.centered]}>
        <ActivityIndicator size="large" color={colors.PURPLE} />
      </View>
    );
  }

  return (
    <View style={localStyles.container}>
      <ScrollView contentContainerStyle={localStyles.scrollContainer}>
        {/* Back Button and Header */}
        <View style={localStyles.headerContainer}>
          <BackButton />
          <View style={localStyles.headerTextContainer}>
            <Text style={localStyles.header}>Edit Workout</Text>
          </View>
          <TouchableOpacity
            style={localStyles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={32} color={colors.WHITE} />
          </TouchableOpacity>
        </View>

        {/* Workout Name Input */}
        <TextInput
          style={localStyles.input}
          placeholder="Workout Name"
          placeholderTextColor={colors.WHITE}
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        {/* Add Exercise Section */}
        <Text style={localStyles.subHeader}>Exercises:</Text>
        <TouchableOpacity
          style={localStyles.addExerciseButton}
          onPress={handleAddExercise}
        >
          <Text style={localStyles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>

        {/* List of Exercises */}
        {Array.from(new Map(exercises.map(set => [set.Exercise_Name, set])).values()).map((exercise: Set, index: number) => {
          const exerciseSets = exercises.filter(set => set.Exercise_Name === exercise.Exercise_Name);
          return (
            <View key={index} style={localStyles.exerciseItem}>
              <View style={localStyles.exerciseHeader}>
                <Text style={localStyles.exerciseText}>
                  {exercise.Exercise_Name}
                </Text>
                <TouchableOpacity
                  style={localStyles.deleteExerciseButton}
                  onPress={() => removeExercise(exercise.Exercise_Name)}
                >
                  <Ionicons name="close-circle" size={24} color={colors.WHITE} />
                </TouchableOpacity>
              </View>
              {exerciseSets.map((set, setIndex) => (
                <Text key={setIndex} style={localStyles.exerciseDetails}>
                  Set {setIndex + 1}: {set.Reps} reps @ {set.Weight} lbs
                </Text>
              ))}
            </View>
          );
        })}

        {/* Workout Comment */}
        <Text style={localStyles.subHeader}>Workout Notes:</Text>
        <TextInput
          style={localStyles.commentInput}
          placeholder="Add any notes..."
          placeholderTextColor={colors.WHITE}
          value={workoutComment}
          onChangeText={setWorkoutComment}
          multiline
        />
      </ScrollView>

      {/* Update Workout Button */}
      <View style={localStyles.buttonContainer}>
        <TouchableOpacity
          style={localStyles.button}
          onPress={() => {
            startWorkout();
            router.push("/");
          }}
        >
          <Text style={styles.buttonText}>Start Workout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.button} onPress={updateWorkout}>
          <Text style={styles.buttonText}>Update Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    padding: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "space-between",
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
  deleteButton: {
    backgroundColor: colors.BLACK,
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
  },
  button: {
    backgroundColor: colors.PURPLE,
    borderWidth: 1,
    borderColor: colors.WHITE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
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
