import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const logo = require('@/assets/images/logo.png');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5f067d',
        headerStyle: {
          backgroundColor: '#1a002e',
        },
        headerShadowVisible: false,
        header: ({ navigation, route, options }) => (
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.headerTitle}>BIG DAWG</Text>
              </View>
            </View>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: '#e6d5ff',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          overflow: 'hidden',
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="search" options={{
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'search-sharp' : 'search-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="calendar" options={{
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'calendar-sharp' : 'calendar-outline'} size={24} color={color} />
        ),
      }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#1a002e',
  },
  header: {
    backgroundColor: '#e6d5ff',
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 50,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a0072',
    marginLeft: 12,
  },
});

