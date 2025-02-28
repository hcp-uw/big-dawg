/** @format */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import colors from "@/src/styles/themes/colors";

// Define the type for the parameters passed to DayWorkout
type DayWorkoutParams = {
  newDate: { year: number; month: number; day: number };
};

// Define the root stack's parameter list
type RootStackParamList = { DayWorkout: DayWorkoutParams };

// Define the route prop type for DayWorkout screen
type DayWorkoutRouteProp = RouteProp<RootStackParamList, "DayWorkout">;

// navigation constants
const DayWorkout = () => {
  const route = useRoute<DayWorkoutRouteProp>();
  const { newDate } = route.params || {};
  const navigation = useNavigation();

  // TODO: button to go back to calendar page
  const goBack = () => {};

  // Fallback in case day isn't provided
  const currDate = new Date(newDate.year, newDate.month, newDate.day);
  const selectedDate = isNaN(currDate.getTime())
    ? "No date selected"
    : currDate.toDateString();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}> &lt; Back </Text>
      </TouchableOpacity>
      <Text style={styles.detailText}>{selectedDate}</Text>
      {/* You can add more details and functionality here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.WHITE,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    color: colors.WHITE,
    marginBottom: 600,
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
});

export default DayWorkout;
