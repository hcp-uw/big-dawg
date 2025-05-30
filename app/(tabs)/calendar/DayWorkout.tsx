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
import { Ionicons } from "@expo/vector-icons";

const db: DB = new json_db();

// testing;
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
  const weekday = currDate.toLocaleDateString("en-US", { weekday: "long" });
  const dateString = currDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
      <View style={styles.outBox}>
        <Text key={idx} style={styles.groupText}>
          {group}
        </Text>
        {renderWorkoutSets()}
      </View>
    ));
  };

  const renderWorkoutSets = () => {
    if (!workout) return null;

    return workout.Sets.map((set, idx) => (
      <View key={idx} style={styles.inBox}>
        <Text style={styles.setText}>{set.Exercise_Name}</Text>
        <Text style={styles.setSubText}>
          {set.Reps} reps @ {set.Weight} lbs
        </Text>
      </View>
    ));
  };

  const BackButton = () => {
    return (
      <Pressable onPress={goBack}>
        <Ionicons
          name="arrow-back-circle-outline"
          size={32}
          color={colors.WHITE}
        />
      </Pressable>
    );
  };

  const localStyles = StyleSheet.create({
    backButton: {
      backgroundColor: colors.BLACK,
      padding: 10,
      borderRadius: 20,
      marginHorizontal: 5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.backButtonContainer}>
          <BackButton />
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.weekdayText}>{weekday}</Text>
          <Text style={styles.dateText}>{dateString}</Text>
        </View>
      </View>
      {renderContent()}
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 0,
    marginBottom: 30,
    position: "relative",
  },

  backButtonContainer: {
    position: "absolute",
    left: 0,
  },

  dateContainer: {
    alignItems: "center",
    flex: 1,
  },

  weekdayText: {
    fontSize: 24,
    color: colors.WHITE,
    fontWeight: "bold",
  },

  dateText: {
    fontSize: 18,
    color: colors.WHITE,
  },

  outBox: {
    backgroundColor: colors.DARK_GRAY, // fallback dark shade
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // for Android shadow
  },

  inBox: {
    backgroundColor: colors.DARK_GRAY, // fallback dark shade
    borderRadius: 12,
    padding: 12,
    marginTop: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "#C3B1E1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // for Android shadow
  },

  groupText: {
    fontSize: 18,
    marginRight: 200,
    fontWeight: "bold",
    color: colors.WHITE,
  },

  setText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.WHITE,
  },

  setSubText: {
    fontSize: 14,
    color: colors.WHITE,
    marginTop: 4,
  },

  detailText: {
    fontSize: 18,
    color: colors.WHITE,
    marginTop: 50,
  },
});

export default DayWorkout;
