import React, { useState } from "react";
import { Text, View, TextInput, FlatList, StyleSheet, Pressable, } from "react-native";
import colors from "@/src/styles/themes/colors";
import { styles } from "@/src/styles/globalStyles";
import { useRouter } from "expo-router";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [filteredExercises, setFilteredExercises] =
    useState<string[]>(exercises);
  const [filteredWorkouts, setFilteredWorkouts] = useState<string[]>(workouts);
  const router = useRouter();

  const handleSearch = (text: string) => {
    setQuery(text);
    const filteredExercises = exercises.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    const filteredWorkouts = workouts.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredExercises(filteredExercises);
    setFilteredWorkouts(filteredWorkouts);
  };

  // handle when someone presses a workout
  const handleExercisePress = (exercise: string) => {
    router.push({
      pathname: '/(tabs)/(exercises)/add_exercise', 
      params: { exerciseName: exercise },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Search for an exercise:</Text>

      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={query}
        onChangeText={handleSearch}
      />

      <View style={styles.searchContainer}>
        {/* List of exercises */}
        <FlatList
            data={filteredExercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Pressable style={[styles.button, {marginBottom: 0}]} onPress={() => handleExercisePress(item)}>
                <Text style={styles.buttonText}>{item}</Text>
              </Pressable>
            )}
            contentContainerStyle={{ gap: 10 }}
            style={styles.flatList}
            ListHeaderComponent={<Text style={localStyles.subHeaderText}>Exercises</Text>}
        />
      </View>

      <View style={localStyles.addButtonContainer}>
        <Pressable
          style={localStyles.addButton}
          onPress={() => router.push('/(tabs)/(exercises)/new_exercise')}
        >
          <Text style={localStyles.addButtonText}>Add a new exercise</Text>
        </Pressable>
      </View>
    </View>
  );
}

const exercises = [
  "Bench Press",
  "Chest Press",
  "Incline Bench",
  "Bicep Curl",
  "Ab Crunch",
  "Squats",
  "Leg Curl",
];
const workouts = [
  "Push",
  "Pull",
  "Legs",
  "Full Body",
  "Upper Body",
  "Lower Body",
  "Core",
];

const localStyles = StyleSheet.create({
  addButtonContainer: {
    flex: 0.15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    bottom: '12%',
    padding: 10,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.BUTTON_COLOR,
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.BUTTON_TEXT,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
});
