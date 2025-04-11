import { Text, View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import CircularProgress from 'react-native-circular-progress-indicator';
import colors from '@/src/styles/themes/colors';
import { useWorkoutState } from './useWorkoutState';
import { styles } from '@/src/styles/globalStyles';



const CIRCLE_LENGTH = 400;
const R = CIRCLE_LENGTH / (1.6 * Math.PI);

export default function Index() {

  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [LEFT_MARGIN, setLeftMargin] = useState(-45);

  const doProgressChange = () => {
    setProgress(prev => Math.min(prev + Math.floor(Math.random() * 25) + 1, 100));

    if(progress > 9 && progress < 100) {
      setLeftMargin(-35);
    } else {
      setLeftMargin(-30);
    }
  };

  const isWorkoutActive = useWorkoutState((state) => state.isWorkoutActive);
  const isPaused = useWorkoutState((state) => state.isPaused);
  const workoutStartTime = useWorkoutState((state) => state.workoutStartTime);
  const elapsedTime = useWorkoutState((state) => state.elapsedTime);
  const pauseWorkout = useWorkoutState((state) => state.pauseWorkout);
  const resumeWorkout = useWorkoutState((state) => state.resumeWorkout);
  const endWorkout = useWorkoutState((state) => state.endWorkout);
  const updateElapsedTime = useWorkoutState((state) => state.updateElapsedTime);

  // Local state for displaying time
  const [displayTime, setDisplayTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Effect to handle timer updates
useEffect(() => {
  // Clear any existing interval first
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
  
  // If workout is active and not paused, start the timer
  if (isWorkoutActive && !isPaused && workoutStartTime) {
    // Initial time calculation
    setDisplayTime(Math.floor((Date.now() - workoutStartTime) / 1000));
    
    // Set up interval for ongoing updates
    intervalRef.current = setInterval(() => {
      const newTime = Math.floor((Date.now() - workoutStartTime) / 1000);
      setDisplayTime(newTime);
      updateElapsedTime(newTime);
    }, 1000);
  } else if (isWorkoutActive && isPaused) {
    // If paused, just display the stored elapsed time
    setDisplayTime(elapsedTime);
  }
  
  // Cleanup on unmount or when dependencies change
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [isWorkoutActive, isPaused, workoutStartTime, updateElapsedTime]);

// Time formatting
const hours = Math.floor(displayTime / 3600);
const minutes = Math.floor((displayTime % 3600) / 60);
const seconds = displayTime % 60;

  return (
    <View style={localStyles.container}>
      <View style={localStyles.content}>
      {isWorkoutActive ? (
        <>
          <Text style={localStyles.title}>Workout Time:</Text>
          <Text style={localStyles.timerText}>
            {hours}:{minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </Text>
          <View style={localStyles.activeWorkoutContainer}>
            <View style={localStyles.buttonContainer}>
              {!isPaused ? (
                  <>
                  <TouchableOpacity
                    style={[styles.button, localStyles.pauseButton]}
                    onPress={pauseWorkout}
                  >
                    <Text style={styles.buttonText}>Pause</Text>
                  </TouchableOpacity>
                  {/* TODO: change functionality of button to navigate to list of exercises */}
                  <TouchableOpacity style={localStyles.addButton} onPress={() => console.log('add a new exercise to current workout')}>
                    <Text style={styles.buttonText}>Add Exercise</Text>
                  </TouchableOpacity>
                  </>
                  
              ) : (
                  <>
                      <TouchableOpacity
                          style={[localStyles.button, localStyles.resumeButton]}
                          onPress={resumeWorkout}
                      >
                          <Text style={styles.buttonText}>Resume</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          style={[localStyles.button, localStyles.endButton]}
                          onPress={endWorkout}
                      >
                          <Text style={styles.buttonText}>
                              End Workout
                          </Text>
                      </TouchableOpacity>
                  </>
              )}
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={localStyles.title}>Your Activity Today:</Text>
          <View style={localStyles.rowContainer}>
            <Text style={localStyles.progressLabel}>Workout completion:</Text>
            <CircularProgress
              radius={R}
              value={progress}
              progressValueFontSize={30}
              progressValueColor={colors.WHITE}
              maxValue={100}
              inActiveStrokeColor={colors.PINK_BROUND}
              activeStrokeColor={colors.DARK_PINK}
              activeStrokeSecondaryColor={colors.PINK}
              inActiveStrokeWidth={11}
              activeStrokeWidth={12}
              titleFontSize={20}
              valueSuffix={'%'}
              duration={300}
              progressFormatter={(value: number) => {
                'worklet';
                return Math.round(value).toString();
              }}
              progressValueStyle={{
                width: 70, // Allows space for 3 digits + % symbol
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              valueSuffixStyle={{
                fontSize: 22,
                marginLeft: LEFT_MARGIN,
                color: colors.WHITE,
                textAlign: 'center',
              }}
            />
          </View>
          <View style={localStyles.noActiveWorkoutContainer}>
            <Text style={localStyles.noWorkouts}>No active workouts!</Text>
            <Text style={localStyles.noWorkouts}>Click the plus to get started.</Text>
          </View>
        </>
        )}
        {/* commented out for now
        <Pressable style={styles.button} onPress={() => router.push('./workouts/add_workout')}>
          <Text style={styles.buttonText}>+ Choose workout preset</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={() => router.push('./search/new_exercise')}>
          <Text style={styles.buttonText}>+ New exercise</Text>
        </Pressable>
        
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>+ New timer</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={doProgressChange}>
          <Text style={styles.buttonText}>TEMP DEMO BUTTON</Text>
        </Pressable>
        */}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertically align items in the center
    justifyContent: 'space-between', // Add spacing between text and progress
    marginBottom: 20, // Add spacing below the row
  },
  noActiveWorkoutContainer: {
    justifyContent: 'center',
    flex: 0.5,
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'left',
    marginRight: 10, // Add spacing between the text and CircularProgress
  },
  noWorkouts: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 17,
    fontStyle: 'italic',
    marginVertical: 20,
    opacity: 0.8,
    alignContent: 'center',
  },
  activeWorkoutContainer: {
    alignItems: 'center',
  },
  workoutText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 100,
  },
  timerText: {
    fontSize: 60,
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.PURPLE,
    borderWidth: 1,
    borderColor: colors.WHITE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  endButton: {
    backgroundColor: colors.DARK_GRAY,
    borderWidth: 1,
    borderColor: colors.WHITE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  pauseButton: {
    backgroundColor: colors.DARK_GRAY,
    borderWidth: 1,
    borderColor: colors.WHITE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  resumeButton: {
    backgroundColor: colors.PURPLE,
    borderWidth: 1,
    borderColor: colors.WHITE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    justifyContent: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
