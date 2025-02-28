/** @format */

import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CalendarDays from "./calendar-days"; // Make sure this is compatible with React Native
import colors from "@/src/styles/themes/colors";

export default class Calendar extends Component {
  constructor() {
    super();

    // sets weekdays and months
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

    // set current day that is selected: starts on current date
    this.state = {
      currentDay: new Date(),
    };
  }

  // change date that is selected and changes to workout page for that day
  changeCurrentDay = (day) => {
    const newDate = new Date(day.year, day.month, day.number);
    this.setState({ currentDay: newDate });
    this.props.navigation.navigate("DayWorkout", {
      newDate: { year: day.year, month: day.month, day: day.number },
    });
  };

  // flips month that is being shown
  changeMonth = (year, month, day) => {
    this.setState({ currentDay: new Date(year, month, day) });
  };

  // renders main calendar including heading with current date, buttons to change
  // months, and actual calendar days
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
            {this.weekdays.map((weekday, index) => {
              return (
                <View key={index} style={styles.weekday}>
                  <Text style={styles.weekdayText}>{weekday}</Text>
                </View>
              );
            })}
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
    backgroundColor: colors.BACKGROUND_COLOR,
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
