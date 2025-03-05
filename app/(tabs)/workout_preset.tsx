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

            {/* Search Bar (Keeping this) */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {/* 
                // ----------------------------------------
                // FILTER UI COMMENTED OUT:
                // ----------------------------------------
                // <View style={styles.filters}>
                //   {filters.map((filter) => (
                //     <TouchableOpacity
                //       key={filter}
                //       style={styles.filter}
                //       onPress={() => removeFilter(filter)}
                //     >
                //       <Text>{filter} ✕</Text>
                //     </TouchableOpacity>
                //   ))}
                //   <TouchableOpacity
                //     onPress={() => setIsAddingFilter(true)}
                //     style={styles.addFilterButton}
                //   >
                //     <Text style={styles.addFilterText}>+</Text>
                //   </TouchableOpacity>
                // </View>

                // {isAddingFilter && (
                //   <View style={styles.addFilterContainer}>
                //     <TextInput
                //       style={styles.filterInput}
                //       placeholder="Add filter"
                //       placeholderTextColor="#aaa"
                //       value={newFilter}
                //       onChangeText={setNewFilter}
                //     />
                //     <TouchableOpacity
                //       onPress={addFilter}
                //       style={styles.addFilterButton}
                //     >
                //       <Text style={styles.addFilterText}>✔</Text>
                //     </TouchableOpacity>
                //     <TouchableOpacity
                //       onPress={() => setIsAddingFilter(false)}
                //       style={styles.cancelFilterButton}
                //     >
                //       <Text style={styles.cancelFilterText}>✕</Text>
                //     </TouchableOpacity>
                //   </View>
                // )}
              */}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.presetItem}
            // Pass the preset's data as route params
            onPress={() => {
              router.push({
                pathname: "/(tabs)/(workouts)/edit_workout",
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
        onPress={() =>
          router.push({ pathname: "/(tabs)/(workouts)/add_workout" })
        }
      >
        <Text style={styles.createButtonText}>Create New Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutPreset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
    padding: 20,
  },
  backButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.BUTTON_COLOR,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: colors.BUTTON_TEXT,
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
    backgroundColor: colors.WHITE,
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
    backgroundColor: colors.BUTTON_COLOR,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6,
    color: colors.BUTTON_TEXT,
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
    backgroundColor: colors.BUTTON_COLOR,
    padding: 8,
    borderRadius: 6,
  },
  addFilterText: {
    color: colors.BUTTON_TEXT,
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
    backgroundColor: colors.BUTTON_COLOR,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  presetText: {
    color: colors.BUTTON_TEXT,
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
    backgroundColor: colors.BUTTON_COLOR,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    left: 20,
    right: 20,
  },
  createButtonText: {
    color: colors.BUTTON_TEXT,
    fontSize: 16,
    fontWeight: "bold",
  },
});
