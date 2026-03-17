import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerSettingsScreenProps } from '../../navigation/navigation';
import HeaderWithBackButton from '../../common-components/HeaderWithBackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const TimerSettingsScreen: React.FC<TimerSettingsScreenProps> = ({ navigation }) => {
  const [selectedTime, setSelectedTime] = useState(600); // Default to 1 minute

  useEffect(() => {
    const loadTimerValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('timerValue');
        if (storedValue !== null) {
          setSelectedTime(parseInt(storedValue, 10)); // Convert to number if stored
        }
      } catch (error) {
        console.error('Failed to load timer value', error);
      }
    };

    loadTimerValue();
  }, []); // Run once on component mount

  const handleTimeSelect = async (time: number) => {
    // time = time * 60; // Convert minutes to seconds
    try {
      // Save the selected time to AsyncStorage
      await AsyncStorage.setItem('timerValue', time.toString());
      setSelectedTime(time);
      Alert.alert('Success', `Timer set to ${time / 60} minutes`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save timer value');
    }
  };

  return (
    <SafeAreaView style={styles.parentContainer}>
     <View style={styles.parentContainer}>
      <HeaderWithBackButton screenName={'Average Time'} />
      <View style={styles.container}>
        <Text style={styles.title}>Set Timer</Text>

        <View style={styles.buttonContainer}>
          {[30, 60, 90, 120, 150, 180, 210, 240, 600].map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.button, selectedTime === time && styles.selectedButton]}
              onPress={() => handleTimeSelect(time)}
            >
              <Text style={styles.buttonText}>{time} sec</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.currentTimeText}>Current Timer: {selectedTime / 60} minutes</Text>
      </View>
    </View>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#17a2b8',
    padding: 10,
    margin: 5,
    width: 100,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  currentTimeText: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default TimerSettingsScreen;
