/** @format */

import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Calendar from "@/src/styles/calendar/calendar-comp";
import colors from "@/src/styles/themes/colors";
import DayWorkout from "@/app/(tabs)/(calendar)/DayWorkout";

const Stack = createStackNavigator();

// Renders calendar and navigation buttons
function CalendarScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Calendar navigation={navigation} />
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>+ Visualize Data</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>+ Manage Workout Plans</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// controlls which page branching from calendar tab is rendered
export default function CalendarNavigator() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Calendar">
          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ headerShown: false }} // Optional: hide header if desired
          />
          <Stack.Screen
            name="DayWorkout"
            component={DayWorkout}
            options={{ title: "Day Workout" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.WHITE,
  },
  button: {
    borderWidth: 1,
    borderColor: colors.WHITE,
    backgroundColor: colors.BLACK,
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderRadius: 20,
    marginBottom: 90,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    color: colors.WHITE,
  },
});
