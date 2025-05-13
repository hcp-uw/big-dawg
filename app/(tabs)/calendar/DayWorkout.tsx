/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import colors from "@/src/styles/themes/colors";
import { json_db } from "@/app/db/json_db";
import { DB, Muscle_Group, Workout } from "@/app/db/Types";

const db: DB = new json_db();

// testing
// const db: DB = {
//   getCalendarView: async (date: Date) => {
//     return [["Chest"], ["Back"], [], [], ["Legs"]];
//   },
//   getWorkout: async (date: Date) => {
//     const day = date.getDate();
//     if (day === 1) {
//       return {
//         Sets: [
//           { Exercise_Name: "Bench Press", Reps: 10, Weight: 135 },
//           { Exercise_Name: "Incline Dumbbell Press", Reps: 8, Weight: 40 },
//         ],
//       };
//     } else if (day === 2) {
//       return {
//         Sets: [{ Exercise_Name: "Deadlift", Reps: 5, Weight: 225 }],
//       };
//     } else if (day === 5) {
//       return {
//         Sets: [
//           { Exercise_Name: "Squat", Reps: 8, Weight: 185 },
//           { Exercise_Name: "Leg Press", Reps: 12, Weight: 270 },
//         ],
//       };
//     }
//     return null;
//   },
// } as DB;

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
  const myDB = db;
  const route = useRoute<DayWorkoutRouteProp>();
  const { newDate } = route.params || {};
  console.log("newDate:", newDate);
  const navigation = useNavigation();

  // TODO: button to go back to calendar page
  const goBack = () => {
    navigation.goBack();
  };

  // Fallback in case day isn't provided
  const currDate = new Date(newDate.year, newDate.month, newDate.day);
  const selectedDate = isNaN(currDate.getTime())
    ? "No date selected"
    : currDate.toDateString();

  // place to store data
  const [muscleGroups, setMuscleGroups] = useState<Muscle_Group[] | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);

  // load in data with page
  useEffect(() => {
    // check date valid
    if (
      newDate == null ||
      newDate.year == null ||
      newDate.month == null ||
      newDate.day == null
    ) {
      setMuscleGroups([]);
      setWorkout(null);
      return;
    }

    const { year, month, day } = newDate;
    const index = day - 1;
    const date_db = new Date(year, month, day);

    db.getCalendarView(date_db)
      .then((fullMonth) => {
        setMuscleGroups(
          index >= 0 && index < fullMonth.length ? fullMonth[index] : []
        );
      })
      .catch(() => setMuscleGroups([]));

    db.getWorkout(date_db)
      .then((res) => setWorkout(res))
      .catch(() => setWorkout(null));
  }, [newDate]);

  const renderContent = () => {
    if (muscleGroups === null) {
      return <Text style={styles.detailText}>Loading...</Text>;
    }

    if (muscleGroups.length === 0) {
      return <Text style={styles.detailText}>No workout logged.</Text>;
    }

    return muscleGroups.map((group, idx) => (
      <Text key={idx} style={styles.setText}>
        {group}
      </Text>
    ));
  };

  const renderWorkoutSets = () => {
    if (!workout) return null;

    return workout.Sets.map((set, idx) => (
      <Text key={idx} style={styles.setText}>
        {set.Exercise_Name} — {set.Reps} reps @ {set.Weight} lbs
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}> Back </Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate}</Text>
      </View>
      {renderContent()}
      {renderWorkoutSets()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    alignItems: "center",
    padding: 20,
  },
  detailText: {
    fontSize: 18,
    color: colors.WHITE,
    marginTop: 50,
  },
  backButton: {
    borderWidth: 0.5,
    borderColor: colors.WHITE,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.BLACK,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: "bold",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    width: "100%",
  },

  dateText: {
    fontSize: 20,
    color: colors.WHITE,
    fontWeight: "bold",
    marginLeft: 45, // spacing between button and date
  },

  setText: {
    fontSize: 16,
    color: colors.WHITE,
    marginTop: 50,
  },
});

export default DayWorkout;
