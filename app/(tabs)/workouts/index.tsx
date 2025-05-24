import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/src/styles/themes/colors";
import { styles } from "@/src/styles/globalStyles";
import { useWorkoutPresetState } from "../useWorkoutPresetState";
import { WorkoutPreset } from "@/app/db/Types";

export default function WorkoutPresetList() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { presets, isLoading, error, fetchPresets } = useWorkoutPresetState();

  // Fetch presets on mount
  useEffect(() => {
    fetchPresets();
  }, []);

  // Show error if any
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  // Filter presets based on search query
  const filteredPresets = presets.filter((preset) =>
    preset.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={localStyles.container}>
      <FlatList
        data={filteredPresets}
        keyExtractor={(item) => item.Name}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* Title */}
            <Text style={localStyles.title}>Select a workout plan:</Text>
            {/* Search Bar */}
            <View style={localStyles.searchContainer}>
              <TextInput
                style={localStyles.searchInput}
                placeholder="Search by name"
                placeholderTextColor={colors.WHITE}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={localStyles.presetItem}
            onPress={() => {
              router.push({
                pathname: "./workouts/edit_workout",
                params: {
                  presetName: item.Name,
                },
              });
            }}
          >
            <Text style={localStyles.presetText}>{item.Name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator size="large" color={colors.PURPLE} />
          ) : searchQuery ? (
            <Text style={localStyles.noResultsText}>No workouts found.</Text>
          ) : (
            <Text style={localStyles.noResultsText}>No workout presets yet.</Text>
          )
        }
      />

      {/* Create New Workout Button */}
      <TouchableOpacity
        style={[localStyles.createButton, { bottom: insets.bottom + 60 }]}
        onPress={() => router.push({ pathname: "./workouts/add_workout" })}
      >
        <Text style={localStyles.createButtonText}>Create New Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.WHITE,
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: colors.BLACK,
    borderWidth: 1,
    borderColor: colors.WHITE,
    borderRadius: 10,
    padding: 10,
    color: colors.WHITE,
  },
  presetItem: {
    marginTop: 10,
    backgroundColor: colors.BLACK,
    borderWidth: 2,
    borderColor: colors.WHITE,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  presetText: {
    color: colors.WHITE,
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "500",
  },
  noResultsText: {
    color: colors.WHITE,
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  createButton: {
    backgroundColor: colors.PURPLE,
    borderWidth: 2,
    borderColor: colors.WHITE,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});
