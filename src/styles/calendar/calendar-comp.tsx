/** @format */

import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CalendarDays from "./calendar-days"; // Ensure compatibility with React Native
import colors from "@/src/styles/themes/colors";

interface CalendarProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

interface CalendarState {
  currentDay: Date;
}

export default class Calendar extends Component<CalendarProps, CalendarState> {
  private weekdays: string[];
  private months: string[];

  constructor(props: CalendarProps) {
    super(props);

    this.weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    this.state = {
      currentDay: new Date(),
    };
  }

  changeCurrentDay = (day: { year: number; month: number; number: number }) => {
    const newDate = new Date(day.year, day.month, day.number);
    this.setState({ currentDay: newDate });
    this.props.navigation.navigate("DayWorkout", {
      newDate: { year: day.year, month: day.month, day: day.number },
    });
  };

  changeMonth = (year: number, month: number, day: number) => {
    this.setState({ currentDay: new Date(year, month, day) });
  };

  render() {
    return (
      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          <Text style={styles.headerText}>
            {this.months[this.state.currentDay.getMonth()]}{" "}
            {this.state.currentDay.getFullYear()}
          </Text>
        </View>
        <View style={styles.calendarBody}>
          <View style={styles.tableHeader}>
            {this.weekdays.map((weekday, index) => (
              <View key={index} style={styles.weekday}>
                <Text style={styles.weekdayText}>{weekday}</Text>
              </View>
            ))}
          </View>
          <CalendarDays
            day={this.state.currentDay}
            changeCurrentDay={this.changeCurrentDay}
            changeMonth={this.changeMonth}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    padding: 10,
    backgroundColor: colors.BLACK,
    borderRadius: 10,
    elevation: 5,
  },
  calendarHeader: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  headerText: {
    color: colors.WHITE,
    fontSize: 24,
    fontWeight: "bold",
  },
  calendarBody: {
    alignItems: "center",
  },
  tableHeader: {
    flexDirection: "row",
    width: "98%",
    marginBottom: 0,
  },
  weekday: {
    flex: 1,
    alignItems: "center",
  },
  weekdayText: {
    color: colors.WHITE,
    fontWeight: "bold",
  },
});
