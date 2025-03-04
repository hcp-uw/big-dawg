import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabLayout from './(tabs)';
import Index from './(tabs)/index'; // Your main screen
import WorkoutPreset from './(tabs)/workout_preset'; // New screen to navigate to
import AddExercise from './(tabs)/(exercises)/add_exercise';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Index" 
        screenOptions={{ 
          headerShown: true,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 300 } },
            close: { animation: 'timing', config: { duration: 300 } },
          }
        }}>
      <Stack.Screen name="Index" component={TabLayout} />

      {/* Other Screens */}
      <Stack.Screen name="WorkoutPreset" component={WorkoutPreset} options={{ title: 'Workout Preset' }} />
      <Stack.Screen name="AddExercise" component={AddExercise} options={{ title: 'Add Exercise' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
