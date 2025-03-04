import React, { useState } from "react";
import { useRouter } from "expo-router";
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

const WorkoutPreset = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [presets] = useState([
    { id: "1", name: "Arm Day 1" },
    { id: "2", name: "Leg Day 1" },
    { id: "3", name: "Cardio Burn" },
    { id: "4", name: "Full Body Strength" },
    { id: "5", name: "Core Crusher" },
    { id: "6", name: "Back & Biceps" },
  ]); // Added more workouts for testing search
  const [filters, setFilters] = useState(["muscle", "equipment"]);
  const [newFilter, setNewFilter] = useState("");
  const [isAddingFilter, setIsAddingFilter] = useState(false);

  // Filter workouts based on the search query
  const filteredPresets = presets.filter((workout) =>
    workout.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFilter = () => {
    if (newFilter.trim() !== "" && !filters.includes(newFilter)) {
      setFilters([...filters, newFilter.trim()]);
      setNewFilter("");
      setIsAddingFilter(false);
    }
  };

  const removeFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
    if (filters.length === 0) {
      setIsAddingFilter(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPresets} // Use filtered list
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}> &lt; Back </Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Select a workout plan:</Text>

            {/* Search Bar & Filters */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                placeholderTextColor={colors.WHITE}
                value={searchQuery}
                onChangeText={setSearchQuery} // Updates search query state
              />
              <View style={styles.filters}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={styles.filter}
                    onPress={() => removeFilter(filter)}
                  >
                    <Text style={styles.backButtonText}>{filter} ✕</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setIsAddingFilter(true)}
                  style={styles.addFilterButton}
                >
                  <Text style={styles.addFilterText}>+</Text>
                </TouchableOpacity>
              </View>

              {isAddingFilter && (
                <View style={styles.addFilterContainer}>
                  <TextInput
                    style={styles.filterInput}
                    placeholder="Add filter"
                    placeholderTextColor="#aaa"
                    value={newFilter}
                    onChangeText={setNewFilter}
                  />
                  <TouchableOpacity
                    onPress={addFilter}
                    style={styles.addFilterButton}
                  >
                    <Text style={styles.addFilterText}>✔</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsAddingFilter(false)}
                    style={styles.cancelFilterButton}
                  >
                    <Text style={styles.cancelFilterText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.presetItem}>
            <Text style={styles.presetText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searchQuery ? (
            <Text style={styles.noResultsText}>No workouts found.</Text>
          ) : null
        }
      />

      {/* Create New Workout Button (positioned above bottom tab) */}
      <TouchableOpacity
        style={[styles.createButton, { bottom: insets.bottom + 60 }]}
        onPress={() => router.push({ pathname: "/(tabs)/(workouts)/add_workout" })}
      >
        <Text style={styles.createButtonText}>Create New Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderWidth: 2,
    borderColor: colors.WHITE,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: "bold",
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

export default WorkoutPreset;
