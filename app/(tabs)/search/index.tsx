import React, { useState } from "react";
import { Text, View, TextInput, FlatList, StyleSheet, Pressable, } from "react-native";
import colors from "@/src/styles/themes/colors";
import { styles } from "@/src/styles/globalStyles";
import { useRouter, Link, useSegments } from "expo-router";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [filteredExercises, setFilteredExercises] =
    useState<string[]>(exercises);
  const [filteredWorkouts, setFilteredWorkouts] = useState<string[]>(workouts);
  const router = useRouter();
  const segments = useSegments();

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

  return (
    console.log(JSON.stringify(segments)), 
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        placeholderTextColor={colors.WHITE}
        value={query}
        onChangeText={handleSearch}
      />

      <View style={styles.searchContainer}>
        {/* List of exercises */}
        <FlatList
            data={filteredExercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Pressable style ={styles.button} onPress={() => router.push('/search/add_exercise')} >
                <Text style={styles.buttonText}>{item}</Text>
              </Pressable>
            )}
            contentContainerStyle={{ gap: 10 }}
            style={styles.flatList}
            ListHeaderComponent={<Text style={localStyles.subHeaderText}>Exercises</Text>}
        />
      </View>

      <View style={localStyles.addButtonContainer}>
        <Pressable style={localStyles.addButton} onPress={() => router.push('/search/new_exercise')}>
          <Text style={localStyles.addButtonText}>+ New exercise</Text>
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
    flex: 0.10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    bottom: 100,
    padding: 10,
    backgroundColor: colors.BLACK,
  },
  addButton: {
    flex: 1,
    backgroundColor: colors.PURPLE,
    borderWidth: 2,
    borderColor: colors.WHITE,
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.WHITE,
    textAlign: "center",
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.WHITE,
  },
});