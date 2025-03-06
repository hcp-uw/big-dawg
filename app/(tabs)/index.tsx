import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import CircularProgress from 'react-native-circular-progress-indicator';
import colors from '@/src/styles/themes/colors';
import { useSharedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get("window");

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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.activityTitle}>Your Activity Today:</Text>
        
        <View style={styles.rowContainer}>
          <Text style={styles.progressLabel} >Workout completion:</Text>
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
        
        <Text style={styles.noWorkouts}>No active workouts!</Text>
        
        <Pressable style={styles.button} onPress={() => router.push('./workout_preset')}>
          <Text style={styles.buttonText}>+ Choose workout preset</Text>
        </Pressable>
        
        <Pressable style={styles.button} onPress={() => router.push('./(exercises)/new_exercise')}>
          <Text style={styles.buttonText}>+ New exercise</Text>
        </Pressable>
        
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>+ New timer</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={doProgressChange}>
          <Text style={styles.buttonText}>TEMP DEMO BUTTON</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  activityTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertically align items in the center
    justifyContent: 'space-between', // Add spacing between text and progress
    marginBottom: 20, // Add spacing below the row
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
  },
  button: {
    backgroundColor: colors.BLACK,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.WHITE,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.WHITE,
    textAlign: 'left',
    marginLeft: 8,
  },
});