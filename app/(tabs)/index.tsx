import { Text, View, StyleSheet, Pressable, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
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
  

  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editReps, setEditReps] = useState('');
  const [editComment, setEditComment] = useState('');

  const inputStyle = {
    height: 40,
    borderColor: colors.WHITE,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: colors.WHITE,
  };

  const isWorkoutActive = useWorkoutState((state) => state.isWorkoutActive);
  const isPaused = useWorkoutState((state) => state.isPaused);
  const workoutStartTime = useWorkoutState((state) => state.workoutStartTime);
  const elapsedTime = useWorkoutState((state) => state.elapsedTime);
  const currWorkout = useWorkoutState((state) => state.exerciseList);
  const goalCompletion = useWorkoutState((state) => state.goalCompletion);
  const percentMargin = useWorkoutState((state) => state.percentMargin);
  const pauseWorkout = useWorkoutState((state) => state.pauseWorkout);
  const resumeWorkout = useWorkoutState((state) => state.resumeWorkout);
  const endWorkout = useWorkoutState((state) => state.endWorkout);
  const updateElapsedTime = useWorkoutState((state) => state.updateElapsedTime);
  const removeExercise = useWorkoutState((state) => state.removeExercise);
  const updateExercise = useWorkoutState((state) => state.updateExercise);
  const completedWorkouts = useWorkoutState((state) => state.completedWorkouts);
  const refreshDailyState = useWorkoutState((state) => state.refreshDailyState);
  const makeDB = useWorkoutState((state) => state.makeDB);

  makeDB();

  // Local state for displaying time
  const [displayTime, setDisplayTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    refreshDailyState();
  }, []);

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
            {/* Button Container */}
            <View style={localStyles.buttonContainer}>
              {!isPaused ? (
                <>
                  <TouchableOpacity
                    style={[styles.button, localStyles.pauseButton]}
                    onPress={pauseWorkout}
                  >
                    <Text style={styles.buttonText}>Pause</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={localStyles.addButton}
                    onPress={() => router.push('/(tabs)/search')}
                  >
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
                    <Text style={styles.buttonText}>End Workout</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Current Exercises List */}
            {currWorkout.length > 0 && (
              <ScrollView style={localStyles.exerciseListContainer}>
                <Text style={localStyles.title}>Current Exercises:</Text>
                {currWorkout.map((exercise, index) => (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>
                      {exercise.Exercise_Name}: {exercise.Reps} reps {`@ ${exercise.Weight} lbs`}
                    </Text>
                    {exercise.Comment && (
                      <Text style={{ color: 'white', fontSize: 16, fontStyle: 'italic', marginLeft: 20, opacity: 0.8 }}>
                        {exercise.Comment}
                      </Text>
                    )}
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                      <Pressable onPress={() => removeExercise(index)}>
                        <Text style={localStyles.removeAndEditButton}>Remove</Text>
                      </Pressable>

                      <Pressable onPress={() => { 
                        setEditIndex(index);
                        setEditWeight(exercise.Weight.toString());
                        setEditComment(exercise.Comment ?? '');
                        setModalVisible(true);
                       }}>
                        <Text style={localStyles.removeAndEditButton}>Edit</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </>
      ) : (
        <>
          <Text style={localStyles.title}>Your Activity Today:</Text>
          <View style={localStyles.rowContainer}>
            <Text style={localStyles.progressLabel}>Workout completion:</Text>
            <CircularProgress
              radius={R}
              value={goalCompletion * 100}
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
                width: percentMargin, // changes dynamically ? i hope ?
                fontWeight: 'bold',
                textAlign: 'center',
              }}
              valueSuffixStyle={{
                fontSize: 22,
                marginLeft: -45,
                color: colors.WHITE,
                textAlign: 'center',
              }}
            />
          </View>
          {completedWorkouts.length > 0 ? (
            <ScrollView style={{ marginTop: 20 }}>
              <Text style={localStyles.title}>Completed Exercises Today:</Text>
              {completedWorkouts.map((workout, index) => (
                <View key={index} style={{ marginVertical: 10 }}>
                  {workout.Sets.map((set, i) => (
                    <View
                      key={i}
                      style={localStyles.exerciseBox}>
                      <Text style={localStyles.exerciseList}>
                        <Text style={{ fontWeight: 'bold' }}>{set.Exercise_Name}</Text>: {set.Reps} reps @ {set.Weight} lbs
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          
          ) : (
            <View style={localStyles.noActiveWorkoutContainer}>
              <Text style={localStyles.noWorkouts}>No completed workouts today!</Text>
              <Text style={localStyles.noWorkouts}>Click the plus to get started.</Text>
            </View>
          )}
        </>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: colors.WHITE }}>Edit Exercise</Text>
            <TextInput
              placeholder="Reps"
              keyboardType="numeric"
              onChangeText={setEditReps}
              style={inputStyle}
            />
            <TextInput
              placeholder="Weight"
              keyboardType="numeric"
              onChangeText={setEditWeight}
              style={inputStyle}
            />
            <TextInput
              placeholder="Comment (optional)"
              onChangeText={setEditComment}
              style={inputStyle}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditIndex(null);
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (editIndex !== null) {
                    updateExercise(editIndex, {
                      Exercise_Name: currWorkout[editIndex].Exercise_Name,
                      Weight: parseFloat(editWeight),
                      Reps: parseInt(editReps),
                      Comment: editComment || null
                    });
                  }
                  setModalVisible(false);
                  setEditIndex(null);
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20, // Add spacing below the rowr
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
    marginBottom: 20,
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
  exerciseListContainer: {
    marginTop: 5, // Add spacing between the buttons and the list
    width: '100%',
  },
  removeAndEditButton: {
    color: colors.WHITE,
    textDecorationLine: 'underline',
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 0,
  }, 
  exerciseList : {
    color: colors.WHITE,
    fontSize: 18,
  },
  exerciseBox: {
    backgroundColor: colors.DARK_GRAY,
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
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
    padding: 20,
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
});
