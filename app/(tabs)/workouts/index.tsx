import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@/src/styles/themes/colors";
import { styles } from "@/src/styles/globalStyles";

export default function WorkoutPreset() {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Hard-coded workout presets
  const [presets] = useState([
    { id: "1", name: "Arm Day 1" },
    { id: "2", name: "Leg Day 1" },
    { id: "3", name: "Cardio Burn" },
    { id: "4", name: "Full Body Strength" },
    { id: "5", name: "Core Crusher" },
    { id: "6", name: "Back & Biceps" },
  ]);

  // ------------------------------
  // FILTER LOGIC REMOVED FOR NOW:
  // ------------------------------
  // const [filters, setFilters] = useState(["muscle", "equipment"]);
  // const [newFilter, setNewFilter] = useState("");
  // const [isAddingFilter, setIsAddingFilter] = useState(false);

  // const addFilter = () => {
  //   if (newFilter.trim() !== "" && !filters.includes(newFilter)) {
  //     setFilters([...filters, newFilter.trim()]);
  //     setNewFilter("");
  //     setIsAddingFilter(false);
  //   }
  // };

  // const removeFilter = (filter: string) => {
  //   setFilters(filters.filter((f) => f !== filter));
  //   if (filters.length === 0) {
  //     setIsAddingFilter(false);
  //   }
  // };
  // ------------------------------

  // Filter workouts based on the search query
  const filteredPresets = presets.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={localStyles.container}>
      <FlatList
        data={filteredPresets} // Use filtered list
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* Title */}
            <Text style={localStyles.title}>Select a workout plan:</Text>
            {/* Search Bar & Filters */}
            <View style={localStyles.searchContainer}>
              <TextInput
                style={localStyles.searchInput}
                placeholder="Search by name"
                placeholderTextColor={colors.WHITE}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
        {/*
                // ----------------------------------------
                // FILTER UI COMMENTED OUT:
                // ----------------------------------------
              <View style={localStyles.filters}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={localStyles.filter}
                    onPress={() => removeFilter(filter)}
                  >
                    <Text style={localStyles.backButtonText}>{filter} ✕</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setIsAddingFilter(true)}
                  style={localStyles.addFilterButton}
                >
                  <Text style={localStyles.addFilterText}>+</Text>
                </TouchableOpacity>
              </View>

              {isAddingFilter && (
                <View style={localStyles.addFilterContainer}>
                  <TextInput
                    style={localStyles.filterInput}
                    placeholder="Add filter"
                    placeholderTextColor="#aaa"
                    value={newFilter}
                    onChangeText={setNewFilter}
                  />
                  <TouchableOpacity
                    onPress={addFilter}
                    style={localStyles.addFilterButton}
                  >
                    <Text style={localStyles.addFilterText}>✔</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsAddingFilter(false)}
                    style={localStyles.cancelFilterButton}
                  >
                    <Text style={localStyles.cancelFilterText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )} 
        */}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={localStyles.presetItem}
            // Pass the preset's data as route params
            onPress={() => {
              router.push({
                pathname: "/workouts/edit_workout",
                params: {
                  workoutId: item.id,
                  name: item.name,
                  // For days, exercises, etc., you could pass JSON
                  days: JSON.stringify(["M", "W"]),
                  exercises: JSON.stringify([
                    {
                      Exercise_Name: "Push Up",
                      Weight: 0,
                      Reps: 10,
                      Comment: "",
                    },
                  ]),
                  comment: "My existing notes here",
                },
              });
            }}
          >
            <Text style={localStyles.presetText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searchQuery ? (
            <Text style={localStyles.noResultsText}>No workouts found.</Text>
          ) : null
        }
      />

      {/* Create New Workout Button (positioned above bottom tab) */}
      <TouchableOpacity
        style={[localStyles.createButton, { bottom: insets.bottom + 60 }]}
        onPress={() => router.push({ pathname: "/workouts/add_workout" })}
      >
        <Text style={localStyles.createButtonText}>Create New Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    padding: 20,
  },
  backButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.BLACK,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: colors.WHITE,
    fontSize: 24,
  },
  title: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  searchContainer: {
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: colors.BLACK,
    borderWidth: 2,
    borderColor: colors.WHITE,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 13,
  },
  /* Filters (currently unused, left here for future re-enable) */
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    alignItems: "center",
  },
  filter: {
    backgroundColor: colors.BLACK,
    borderWidth: 2,
    borderColor: colors.WHITE,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6,
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: "bold",
  },
  addFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  filterInput: {
    backgroundColor: colors.WHITE,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 12,
    flex: 1,
  },
  addFilterButton: {
    marginLeft: 8,
    backgroundColor: colors.PURPLE,
    padding: 8,
    borderRadius: 6,
  },
  addFilterText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelFilterButton: {
    marginLeft: 8,
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
  },
  cancelFilterText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
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
