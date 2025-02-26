import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import colors from '@/src/styles/themes/colors';
import { styles } from '@/src/styles/globalStyles';
import { useRouter } from 'expo-router';
import { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

const AddExercise = () => {
    const router = useRouter();
    const [exerciseName, setExerciseName] = useState('');
    const [description, setDescription] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');

    const handleAddExercise = () => {
        if(!exerciseName || !muscleGroup) {
            alert('Please enter an exercise name and muscle group.');
            return;
        }
        // Add logic to handle adding the exercise
        console.log('Exercise Added:', { exerciseName, muscleGroup, description });
        setExerciseName("");
        setMuscleGroup("");
        setDescription("")
        alert('Exercise Added!');
        router.replace('../search');
    };

    return (
      <>
        <View style={[styles.container, {justifyContent: 'flex-start'}]}>
          <Text style={styles.headerText}>New Exercise</Text>
          <View style={localStyles.addContainer}>
              <Text style={styles.text}>Name</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Exercise Name"
                  value={exerciseName}
                  onChangeText={setExerciseName}
              />
              <Text style={styles.text}>Muscle Group</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Muscle Group"
                  value={muscleGroup}
                  onChangeText={setMuscleGroup}
              />
              <Text style={styles.text}>Description</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Additional Info"
                  value={description}
                  onChangeText={setDescription}
              />
              <Pressable 
              style={styles.button} 
              onPress={handleAddExercise}>
                  <Text style={styles.buttonText}>Add New Exercise</Text>
              </Pressable>
          </View>
        </View>
        <View style={styles.backContainer}>
          <Pressable 
                style={[styles.button, {margin: 20, width: '25%'}]} 
                onPress={() => router.replace('../search')}>
                  <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        </View>
      </>
    );
};

const localStyles = StyleSheet.create({
    addContainer: {
        width: '90%',
        justifyContent: 'flex-start',
        borderWidth: 2,
        borderColor: colors.WHITE,
        borderRadius: 10,
        padding: 10,
        marginTop: 20,
    },
});

export default AddExercise;