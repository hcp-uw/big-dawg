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
import { DB, Muscle_Group } from "@/app/db/Types";

const db: DB = new json_db();

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

  // load in data with page
  useEffect(() => {
    // check date valid
    if (!newDate?.month || !newDate?.year) {
      setMuscleGroups([]);
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
      .catch(() => {
        setMuscleGroups([]);
      });
  }, [newDate]);

  const renderContent = () => {
    if (muscleGroups === null) {
      return <Text style={styles.headerText}>Loading...</Text>;
    }

    if (muscleGroups.length === 0) {
      return <Text style={styles.headerText}>No workout logged.</Text>;
    }

    return muscleGroups.map((group, idx) => (
      <Text key={idx} style={styles.detailText}>
        {group}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}> &lt; Back </Text>
      </TouchableOpacity>
      <Text style={styles.detailText}>{selectedDate}</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
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
    marginBottom: 700,
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
});

export default DayWorkout;
