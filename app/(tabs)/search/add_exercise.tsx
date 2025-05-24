import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "@/src/styles/themes/colors";
import { useWorkoutPresetState } from "../useWorkoutPresetState";
import { Set } from "@/app/db/Types";
import { styles } from "@/src/styles/globalStyles";
import BackButton from "@/components/back_button";

export default function AddExerciseScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { item, returnScreen } = useLocalSearchParams();
  const exerciseName = Array.isArray(item) ? item[0] : item as string;
  const { setSelectedExercises } = useWorkoutPresetState();

  const [sets, setSets] = useState<Set[]>([
    {
      Exercise_Name: exerciseName,
      Reps: 0,
      Weight: 0,
      Comment: "",
    },
  ]);

  const handleInputChange = (text: string, index: number, field: keyof Set) => {
    const newSets = [...sets];
    const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10) || 0;
    if(field === "Reps") {
      newSets[index].Reps = numericValue;
    } else if(field === "Weight") {
      newSets[index].Weight = numericValue;
    }
    setSets(newSets);
  };

  const handleCommentChange = (text: string, index: number) => {
    const newSets = [...sets];
    newSets[index].Comment = text;
    setSets(newSets);
  };

  const addSet = () => {
    setSets([
      ...sets,
      {
        Exercise_Name: exerciseName,
        Reps: 0,
        Weight: 0,
        Comment: "",
      },
    ]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const saveSet = () => {
    // Validate sets
    const invalidSets = sets.filter(
      (set) => set.Reps <= 0 || set.Weight <= 0
    );
    if (invalidSets.length > 0) {
      Alert.alert(
        "Invalid Sets",
        "Please ensure all sets have valid reps and weight values."
      );
      return;
    }

    const setsWithCorrectName = sets.map(set => ({
      ...set,
      Exercise_Name: exerciseName
    }));
    
    setSelectedExercises(setsWithCorrectName);
    
    // Navigate back to the appropriate screen
    if (returnScreen === "edit") {
      router.replace("/(tabs)/workouts/edit_workout");
    } else {
      router.replace("/(tabs)/workouts/add_workout");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[localStyles.container]}
    >
      <View style={styles.backContainer}>
        <BackButton />
        <Text style={styles.headerText}>{exerciseName}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.PURPLE, padding: 7 }]}
          onPress={saveSet}
        >
          <Text style={[styles.buttonText]}>Add Exercise</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        ref={scrollViewRef}
        style={localStyles.scrollContainer}
        contentContainerStyle={{ paddingBottom: "20%" }}
        keyboardShouldPersistTaps="handled"
      >
        {sets.map((set, index) => (
          <View key={index} style={styles.container}>
            <Text style={styles.headerText}>Set {index + 1}</Text>

            <TextInput
              style={styles.input}
              placeholder="Reps..."
              placeholderTextColor={colors.WHITE}
              value={set.Reps ? set.Reps.toString() : ""}
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={(text) => handleInputChange(text, index, "Reps")}
            />

            <TextInput
              style={styles.input}
              placeholder="Weight..."
              placeholderTextColor={colors.WHITE}
              value={set.Weight ? set.Weight.toString() : ""}
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={(text) => handleInputChange(text, index, "Weight")}
            />

            <TextInput
              style={styles.input}
              placeholder="Comments..."
              placeholderTextColor={colors.WHITE}
              value={set.Comment ?? ""}
              keyboardType="default"
              returnKeyType="done"
              multiline
              onChangeText={(text) => handleCommentChange(text, index)}
            />

            {sets.length > 1 && (
              <TouchableOpacity 
                style={[styles.button, { width: "96%" }]} 
                onPress={() => removeSet(index)}
              >
                <Text style={styles.buttonText}>Remove Set</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.button, { marginTop: 10, backgroundColor: colors.PURPLE }]}
          onPress={addSet}
        >
          <Text style={[styles.buttonText, { fontWeight: "bold" }]}>+ Add Another Set</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    justifyContent: "center",
    paddingBottom: "20%",
  },
  scrollContainer: {
    flex: 1,
    flexGrow: 1,
  },
});