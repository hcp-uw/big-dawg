import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText, TSpan } from 'react-native-svg';
import Animated, { AnimatedProps, useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import colors from '@/src/styles/themes/colors';

const { width, height } = Dimensions.get("window");

const CIRCLE_LENGTH = 400;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const SVG_WIDTH = width / 2;
const SVG_HEIGHT = height / 3;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Index() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 2000 });
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value)
  }));

  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}%`;
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.activityTitle}>Your Activity Today:</Text>
        
        <Text style={styles.progressLabel}>Workout completion:</Text>
        <View style={styles.progressContainer}>
            <Svg width={SVG_WIDTH}
              height={SVG_HEIGHT}
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
              <G>
                <Circle
                  cx={SVG_WIDTH / 2}
                  cy={SVG_HEIGHT / 4}
                  r={R}
                  fill="rgba(255, 255, 255, 0)"
                  stroke={'#3a0055'}
                  strokeWidth={8}
                />
                <SvgText
                  x={SVG_WIDTH / 2}
                  y={SVG_HEIGHT / 4}
                  textAnchor="middle"
                  alignmentBaseline="central"
                  fill="#ffffff"
                  fontSize="30"
                  fontWeight="bold"
                >
                  <ReText style={styles.progressText} text={progressText} />
                </SvgText>
                <AnimatedCircle
                  cx={SVG_WIDTH / 2}
                  cy={SVG_HEIGHT / 4}
                  r={R}
                  stroke={'#ff00ff'}
                  fill="rgba(255, 255, 255, 0)"
                  strokeWidth={8}
                  strokeDasharray={CIRCLE_LENGTH}
                  strokeDashoffset={CIRCLE_LENGTH}
                  animatedProps={animatedProps}
                  strokeLinecap={'round'}
                />
              </G>
            </Svg>
        </View>
        
        <Text style={styles.noWorkouts}>No active workouts!</Text>
        
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>+ Choose workout preset</Text>
        </Pressable>
        
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>+ New exercise</Text>
        </Pressable>
        
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>+ New timer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND_COLOR,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  activityTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressLabel: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height / 3,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  noWorkouts: {
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 20,
    opacity: 0.8,
  },
  button: {
    backgroundColor: colors.BUTTON_COLOR,
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: colors.BUTTON_TEXT,
    textAlign: 'center',
  },
});
