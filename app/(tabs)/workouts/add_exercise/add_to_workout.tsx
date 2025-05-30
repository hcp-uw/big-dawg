import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from '@/src/styles/globalStyles';
import colors from '@/src/styles/themes/colors';
import { useState, useRef } from 'react';
import BackButton from '@/components/back_button';

const WorkoutInput = () => {
  type SetField = 'reps' | 'weight';
  const [sets, setSets] = useState([{ id: 1, reps: "", weight: "", key:""}]); // Initial set
  const scrollViewRef = useRef<ScrollView>(null);
  const { item } = useLocalSearchParams();
  const router = useRouter();

  // Function to handle input changes
  const handleInputChange = (text: string, index: number, field: string, key: string) => {
    const newSets = [...sets];
    newSets[index][field as SetField] = text.replace(/[^0-9]/g, ""); // Only allow numbers
    setSets(newSets);

    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Function to add a new set
  const addSet = () => {
    setSets([...sets, { id: sets.length + 1, reps: "", weight: "", key: `${sets.length + 1}-${Date.now()}`}]);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // Function to remove a set
  const removeSet = (index: number) => {
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets);
  };

  const saveSet = () => {
    console.log('Save Set pressed!');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={[localStyles.container]}
    >
      <View style={styles.backContainer}>
          <BackButton/>
          <Text style={styles.headerText}>{item}</Text>
          <TouchableOpacity style={[styles.button, {backgroundColor: colors.PURPLE, padding: 7,}]} onPress={() => saveSet()}>
            <Text style={[localStyles.addExerciseButton,]}>Add Exercise</Text>
          </TouchableOpacity>
      </View>
      <ScrollView 
        ref={scrollViewRef} 
        style={localStyles.scrollContainer} 
        contentContainerStyle={{ paddingBottom: '20%' }}
        keyboardShouldPersistTaps='handled'  
      >

        {sets.map((set, index) => (
          <View key={set.key} style={styles.container}>
            <Text style={styles.headerText}>Set {index + 1}</Text>

            {/* Reps Input */}
            <TextInput
              style={styles.input}
              placeholder="Reps..."
              placeholderTextColor={colors.WHITE}
              value={set.reps}
              keyboardType="numeric"
              returnKeyType = 'done'
              onChangeText={(text) => handleInputChange(text, index, "reps", set.key)}
            />

            {/* Weight Input */}
            <TextInput
              style={styles.input}
              placeholder="Weight..."
              placeholderTextColor={colors.WHITE}
              value={set.weight}
              keyboardType="numeric"
              returnKeyType = 'done'
              onChangeText={(text) => handleInputChange(text, index, "weight", set.key)}
            />

            {/* Remove Button (Only show if there's more than one set) */}
            {sets.length > 1 && (
              <TouchableOpacity style={[styles.button, {width: '96%'}]} onPress={() => removeSet(index)}>
                <Text style={styles.buttonText}>Remove Set</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Add Set Button */}
        <TouchableOpacity style={[styles.button, {marginTop: 10, backgroundColor: colors.PURPLE,}]} onPress={addSet}>
          <Text style={[styles.buttonText,]}>+ Add Another Set</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={[styles.backContainer]}>
        <TouchableOpacity style={[styles.button, {backgroundColor: colors.PURPLE, marginRight: 20}]} onPress={() => router.back()}>
            <Text style={[styles.buttonText, ]}>← Back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default WorkoutInput;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BLACK,
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  setContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subSetContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
    flexGrow: 1,
  },
  addExerciseButton: {
    fontSize: 18,
    color: colors.WHITE,
    textAlign: "center",
  }
});