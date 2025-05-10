import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { Image } from "expo-image";
import { useState } from 'react';
import colors from '@/src/styles/themes/colors';
import { styles } from "@/src/styles/globalStyles";
import { StatusBar } from "expo-status-bar";
import { useRouter, usePathname, useSegments } from 'expo-router';
import { Platform } from 'react-native';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useWorkoutState } from "./useWorkoutState";

const logo = require("@/assets/images/logo.png");

const routeAliases: { [key: string]: string } = {
  "": "Home",
  search: "Search",
  calendar: "Calendar",
  workouts: "Workouts",
  new_exercise: "New Exercise",
  add_exercise: "Add Exercise",
  add_workout: "Add Workout",
  DayWorkout: "Day Workout",
};

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalVisible, setModalVisible] = useState(false);
  const segments = useSegments();

  const doPlusClick = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getHeaderTitle = () => {
    const routeName = pathname.split("/").pop();
    return routeAliases[String(routeName)] || "Big Dawg";
  };

  const startWorkout = useWorkoutState((state) => state.startWorkout);

  return (
      console.log(JSON.stringify(segments)), 
      <>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.PURPLE,
            tabBarInactiveTintColor: colors.WHITE,
            headerStyle: {
              backgroundColor: colors.BLACK,
            },
            headerShadowVisible: false,
            header: () => (
              <View style={styles.headerContainer}>
                <View style={styles.header}>
                  <View style={styles.headerContent}>
                    <Image source={logo} style={styles.logo} />
                    <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
                  </View>
                </View>
              </View>
          ),
          tabBarStyle: {
            backgroundColor: colors.BLACK,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            overflow: "hidden",
            position: "absolute",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "search-sharp" : "search-outline"}
                color={color}
                size={24}
                style={{ marginRight: 10 }}
              />
            ),
            title: "Search",
            tabBarItemStyle: {
              marginRight: 35,
            },
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "calendar-sharp" : "calendar-outline"}
                size={24}
                color={color}
              />
            ),
            title: "Calendar",
            tabBarItemStyle: {
              marginLeft: 35,
            },
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "fitness-sharp" : "fitness-outline"}
                size={24}
                color={color}
                style={{}}
              />
            ),
            title: "Presets",
          }}
        />
      </Tabs>
        
      <View style={localStyles.plusButtonContainer}>
        <Pressable style={localStyles.plusButton} onPress={doPlusClick}>
          <Ionicons name="add-outline" size={55} color={colors.WHITE}/>
        </Pressable>
      </View>

  
        {/* Dropdown Menu Modal */}
        <Modal visible={isModalVisible} transparent animationType="fade">
          <View style={localStyles.modalOverlay}>
            <View style={localStyles.modalContent}>
              {/* Dropdown Buttons */}
              <Pressable style={localStyles.modalButton} onPress={() => { closeModal(); router.push('./(tabs)/workouts'); }}>
                <Text style={localStyles.modalButtonText}>Choose Workout Preset</Text>
              </Pressable>
              <Pressable style={localStyles.modalButton} onPress={() => {closeModal(); router.push('./search/new_exercise')}}>
                <Text style={localStyles.modalButtonText}>New Exercise</Text>
              </Pressable>
              <Pressable style={localStyles.modalButton} onPress={() => { closeModal(); startWorkout(); router.push('/'); }}>
                <Text style={localStyles.modalButtonText}>Start New Workout</Text>
              </Pressable>
  
              {/* Close Button */}
              <Pressable style={localStyles.closeButtonContainer} onPress={closeModal}>
                <Ionicons name='close' style={localStyles.closeIcon} />
              </Pressable>
            </View>
          </View>
      </Modal>
    </>
  );
}

const localStyles = StyleSheet.create({
  plusButtonContainer: {
    position: "absolute",
    bottom: Platform.OS === 'ios' ? 40 : 10,
    alignSelf: "center",
    zIndex: 10,
  },
  plusButton: {
    backgroundColor: colors.PURPLE,
    outlineColor: colors.WHITE,
    borderRadius: 35,
    elevation: 5,
    borderWidth: 3,
    borderColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.BLACK,
    borderRadius: 15,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 5,
    alignItems: "center",
    position: 'relative',
  },
  modalButton: {
    backgroundColor: colors.BLACK,
    borderColor: colors.WHITE,
    borderRadius: 15,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 8,
    width: "90%",
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.WHITE,
    fontSize: 18,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  closeIcon: {
    fontSize: 24,
    color: colors.WHITE,
  },
  closeButtonText: {
    opacity: 1,
    color: "#333",
  },
});
