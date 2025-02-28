/** @format */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/src/styles/themes/colors";

function CalendarDays({ day, changeCurrentDay, changeMonth }) {
  // constants do set first day of months and track current
  let firstDayOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
  let weekdayOfFirstDay = firstDayOfMonth.getDay();
  let currentDays = [];

  // function for flipping to the previous month
  const handlePrevMonth = () => {
    let currentMonth = day.getMonth();
    let currentYear = day.getFullYear();
    if (currentMonth === 0) {
      currentYear = currentYear - 1;
      currentMonth = 11;
    } else {
      currentMonth = currentMonth - 1;
    }
    changeMonth(currentYear, currentMonth, 1);
  };

  // function for flipping to the next month
  const handleNextMonth = () => {
    let currentMonth = day.getMonth();
    let currentYear = day.getFullYear();
    if (currentMonth === 11) {
      currentYear = currentYear + 1;
      currentMonth = 0;
    } else {
      currentMonth = currentMonth + 1;
    }
    changeMonth(currentYear, currentMonth, 1);
  };

  // sets up days of month in correct order
  for (let i = 0; i < 42; i++) {
    if (i === 0 && weekdayOfFirstDay === 0) {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
    } else if (i === 0) {
      firstDayOfMonth.setDate(
        firstDayOfMonth.getDate() + (i - weekdayOfFirstDay)
      );
    } else {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
    }

    // sets current day
    let calendarDay = {
      currentMonth: firstDayOfMonth.getMonth() === day.getMonth(),
      date: new Date(firstDayOfMonth),
      month: firstDayOfMonth.getMonth(),
      number: firstDayOfMonth.getDate(),
      selected: firstDayOfMonth.toDateString() === day.toDateString(),
      year: firstDayOfMonth.getFullYear(),
    };

    currentDays.push(calendarDay);
  }

  // renders actual calendar
  return (
    <View>
      <View style={styles.calendarContainer}>
        {currentDays.map((calendarDay, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayContainer,
              calendarDay.currentMonth
                ? styles.currentMonth
                : styles.otherMonth,
              calendarDay.selected ? styles.selectedDay : null,
            ]}
            onPress={() => changeCurrentDay(calendarDay)}
          >
            <Text style={styles.dayText}>{calendarDay.number}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.calendarFooter}>
        <View style={styles.buttonPrev}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonNext}>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text style={styles.buttonText}> Next </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 3,
    marginBottom: -80,
  },
  dayContainer: {
    width: "13%", // Ensures 7 days per row
    aspectRatio: 1, // Keeps it square
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 2.2,
    marginVertical: 6,
  },
  currentMonth: {
    backgroundColor: colors.BUTTON_COLOR,
  },
  otherMonth: {
    backgroundColor: "#270045",
  },
  selectedDay: {
    backgroundColor: "#ADD8E6",
  },
  dayText: {
    fontSize: 16,
    color: "#000",
  },
  buttonPrev: {
    backgroundColor: colors.BUTTON_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 85,
  },
  buttonNext: {
    backgroundColor: colors.BUTTON_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 85,
  },
  buttonText: {
    fontSize: 16,
    color: colors.BUTTON_TEXT,
  },
  calendarFooter: {
    flexDirection: "row",
  },
});

export default CalendarDays;
