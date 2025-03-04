/** @format */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@/src/styles/themes/colors";

interface CalendarDay {
  currentMonth: boolean;
  date: Date;
  month: number;
  number: number;
  selected: boolean;
  year: number;
}

interface CalendarDaysProps {
  day: Date;
  changeCurrentDay: (day: CalendarDay) => void;
  changeMonth: (year: number, month: number, day: number) => void;
}

const CalendarDays: React.FC<CalendarDaysProps> = ({
  day,
  changeCurrentDay,
  changeMonth,
}) => {
  let firstDayOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
  let weekdayOfFirstDay = firstDayOfMonth.getDay();
  let currentDays: CalendarDay[] = [];

  const handlePrevMonth = () => {
    let currentMonth = day.getMonth();
    let currentYear = day.getFullYear();
    if (currentMonth === 0) {
      currentYear -= 1;
      currentMonth = 11;
    } else {
      currentMonth -= 1;
    }
    changeMonth(currentYear, currentMonth, 1);
  };

  const handleNextMonth = () => {
    let currentMonth = day.getMonth();
    let currentYear = day.getFullYear();
    if (currentMonth === 11) {
      currentYear += 1;
      currentMonth = 0;
    } else {
      currentMonth += 1;
    }
    changeMonth(currentYear, currentMonth, 1);
  };

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

    let calendarDay: CalendarDay = {
      currentMonth: firstDayOfMonth.getMonth() === day.getMonth(),
      date: new Date(firstDayOfMonth),
      month: firstDayOfMonth.getMonth(),
      number: firstDayOfMonth.getDate(),
      selected: firstDayOfMonth.toDateString() === day.toDateString(),
      year: firstDayOfMonth.getFullYear(),
    };

    currentDays.push(calendarDay);
  }

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
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 3,
    marginBottom: -80,
  },
  dayContainer: {
    width: "13%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 2.2,
    marginVertical: 6,
  },
  currentMonth: {
    borderWidth: 1,
    borderColor: colors.WHITE,
    backgroundColor: "#B19Cd7",
  },
  otherMonth: {
    borderWidth: 1,
    borderColor: colors.WHITE,
    backgroundColor: colors.BLACK,
  },
  selectedDay: {
    backgroundColor: colors.PURPLE,
  },
  dayText: {
    fontSize: 16,
    color: colors.WHITE,
  },
  buttonPrev: {
    backgroundColor: colors.PURPLE,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 85,
  },
  buttonNext: {
    backgroundColor: colors.PURPLE,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 85,
  },
  buttonText: {
    fontSize: 16,
    color: colors.WHITE,
  },
  calendarFooter: {
    flexDirection: "row",
  },
});

export default CalendarDays;
