import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import colors from '@/src/styles/themes/colors';
import { styles } from '@/src/styles/globalStyles';
import { useRouter } from 'expo-router';

const AddExercise = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [description, setDescription] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');

    const handleAddExercise = () => {
        // Add logic to handle adding the exercise
        console.log('Exercise Added:', { exerciseName, description });
    };

    return (
        <View style={[styles.container, {justifyContent: 'flex-start'}]}>
          <Text style={styles.headerText}>Add Exercise</Text>
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
            <Button title="Add Exercise" onPress={handleAddExercise} />
          </View>
        </View>
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