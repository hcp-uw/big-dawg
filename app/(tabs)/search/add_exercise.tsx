import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { styles } from "@/src/styles/globalStyles";
import colors from "@/src/styles/themes/colors";
import { useState, useRef } from "react";
import BackButton from "@/components/back_button";
import { useWorkoutState } from "../useWorkoutState";
import { Set } from "../../db/Types"; // Import the Set type

const WorkoutInput = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { item } = useLocalSearchParams();
  const router = useRouter();
  const { addExercise } = useWorkoutState();
  const [sets, setSets] = useState<Set[]>([
    { Exercise_Name: item as string, Reps: 0, Weight: 0, Comment: "1-0" }, // Initial set
  ]);

  const handleInputChange = (text: string, index: number, field: keyof Set) => {
    const newSets = [...sets];
    const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10) || 0; // Allow only numbers
    if(field === "Reps") {
      newSets[index].Reps = numericValue;
    } else if(field === "Weight") {
      newSets[index].Weight = numericValue;
    }
    setSets(newSets); // Update the state
  };

  const addSet = () => {
    setSets([
      ...sets,
      { Exercise_Name: `${sets.length + 1}`, Reps: 0, Weight: 0, Comment: `${sets.length + 1}-${Date.now()}` } as Set,
    ]);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const saveSet = () => {
    for(const set of sets) {
      addExercise(set);
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[localStyles.container]}
    >
      <View style={styles.backContainer}>
        <BackButton />
        <Text style={styles.headerText}>{item}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.PURPLE, padding: 7 }]}
          onPress={() => saveSet()}
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
          <View key={set.Comment} style={styles.container}>
            <Text style={styles.headerText}>Set {index + 1}</Text>

            <TextInput
              style={styles.input}
              placeholder="Reps..."
              placeholderTextColor={colors.WHITE}
              value={set.Reps ? set.Reps.toString() : ""} // Convert Reps to string for display
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={(text) => handleInputChange(text, index, "Reps")}
            />

            <TextInput
              style={styles.input}
              placeholder="Weight..."
              placeholderTextColor={colors.WHITE}
              value={set.Weight ? set.Weight.toString() : ""} // Convert Weight to string for display
              keyboardType="numeric"
              returnKeyType="done"
              onChangeText={(text) => handleInputChange(text, index, "Weight")}
            />

            {sets.length > 1 && (
              <TouchableOpacity style={[styles.button, { width: "96%" }]} onPress={() => removeSet(index)}>
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
};

export default WorkoutInput;

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