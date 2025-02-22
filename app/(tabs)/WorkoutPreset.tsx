import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  BACKGROUND_COLOR,
  BUTTON_COLOR,
  BUTTON_TEXT,
} from "@/src/styles/themes/colors";

const WorkoutPreset = () => {
  // State to hold the current search query input by the user.
  const [searchQuery, setSearchQuery] = useState("");

  // State to hold an array of workout presets.
  // Initially populated with one preset.
  const [presets, setPresets] = useState([{ id: "1", name: "Arm Day 1" }]);

  // State to hold the current filter tags.
  // Initially set with "muscle" and "equipment".
  const [filters, setFilters] = useState(["muscle", "equipment"]);

  // State to hold the new filter being added.
  const [newFilter, setNewFilter] = useState("");

  // State to control the visibility of the "add filter" input field.
  const [isAddingFilter, setIsAddingFilter] = useState(false);

  /**
   * Function to add a new filter.
   * - Trims the new filter input.
   * - Checks if it is not empty and does not already exist in the filters array.
   * - If valid, adds the filter to the list, resets the newFilter input,
   *   and hides the add filter input field.
   */
  const addFilter = () => {
    if (newFilter.trim() !== "" && !filters.includes(newFilter)) {
      setFilters([...filters, newFilter.trim()]);
      setNewFilter("");
      setIsAddingFilter(false); // Hide input field after adding filter
    }
  };

  /**
   * Function to remove a filter from the list.
   * @param {string} filter - The filter to be removed.
   * - Filters out the selected filter from the current filters array.
   * - Updates the filters state with the new array.
   * - If no filters remain, ensures the add filter button is shown.
   */
  const removeFilter = (filter: string) => {
    const updatedFilters = filters.filter((f) => f !== filter);
    setFilters(updatedFilters);
    if (updatedFilters.length === 0) {
      setIsAddingFilter(false); // Show Add Filter button when all filters are removed
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Text style={styles.backButtonText}> &lt; Back </Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Select a workout plan:</Text>

      {/* Search Bar & Filters */}
      <View style={styles.searchContainer}>
        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery} // Update search query state on change
        />
        <View style={styles.filters}>
          {/* If there are existing filters, display them */}
          {filters.length > 0 ? (
            <>
              {filters.map((filter) => (
                // Each filter is rendered as a button that can be tapped to remove it
                <TouchableOpacity
                  key={filter}
                  style={styles.filter}
                  onPress={() => removeFilter(filter)} // Remove filter on press
                >
                  <Text>{filter} ✕</Text>
                </TouchableOpacity>
              ))}
              {/* Button to show the input for adding a new filter */}
              <TouchableOpacity
                onPress={() => setIsAddingFilter(true)}
                style={styles.addFilterButton}
              >
                <Text style={styles.addFilterText}>+</Text>
              </TouchableOpacity>
            </>
          ) : (
            // If no filters exist, prompt user to add a filter
            <TouchableOpacity
              onPress={() => setIsAddingFilter(true)}
              style={styles.addFilterButton}
            >
              <Text style={styles.addFilterText}>Add Filter</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* If the user is adding a filter, display the input field with confirm and cancel buttons */}
        {isAddingFilter && (
          <View style={styles.addFilterContainer}>
            <TextInput
              style={styles.filterInput}
              placeholder="Add filter"
              placeholderTextColor="#aaa"
              value={newFilter}
              onChangeText={setNewFilter} // Update newFilter state on change
            />
            {/* Confirm button: Calls addFilter to add the new filter */}
            <TouchableOpacity
              onPress={addFilter}
              style={styles.addFilterButton}
            >
              <Text style={styles.addFilterText}>✔</Text>
            </TouchableOpacity>
            {/* Cancel button: Hides the add filter input without adding */}
            <TouchableOpacity
              onPress={() => setIsAddingFilter(false)}
              style={styles.cancelFilterButton}
            >
              <Text style={styles.cancelFilterText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Workout Preset List */}
      <FlatList
        data={presets} // Data source for the list
        keyExtractor={(item) => item.id} // Unique key for each preset item
        renderItem={({ item }) => (
          // Render each preset as a touchable item
          <TouchableOpacity style={styles.presetItem}>
            <Text style={styles.presetText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Create New Workout Button */}
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create New Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    padding: 20,
  },
  backButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: BUTTON_COLOR,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: BUTTON_TEXT,
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  searchContainer: {
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: "white",
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
    backgroundColor: BUTTON_COLOR,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginRight: 6,
    color: BUTTON_TEXT,
    fontSize: 12,
    fontWeight: "bold",
  },
  addFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  filterInput: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 12,
    flex: 1,
  },
  addFilterButton: {
    marginLeft: 8,
    backgroundColor: BUTTON_COLOR,
    padding: 8,
    borderRadius: 6,
  },
  addFilterText: {
    color: BUTTON_TEXT,
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  presetItem: {
    marginTop: 10,
    backgroundColor: BUTTON_COLOR,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  presetText: {
    color: BUTTON_TEXT,
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "500",
  },
  createButton: {
    marginTop: 20,
    backgroundColor: BUTTON_COLOR,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 60,
  },
  createButtonText: {
    color: BUTTON_TEXT,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutPreset;
