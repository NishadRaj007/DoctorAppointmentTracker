import React, { useState, useRef, RefObject, useEffect } from 'react';
import { View, TextInput, StyleSheet, TextInputKeyPressEventData, NativeSyntheticEvent } from 'react-native';

// Define the props interface
interface SplitOTPInputProps {
  length: number;
  onChangeOTP: (otp: string) => void;
}

// Define the functional component using React.FC and the props interface
const SplitOTPInput: React.FC<SplitOTPInputProps> = ({ length, onChangeOTP }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputs = useRef<Array<RefObject<TextInput>>>([]);

  // Initialize refs
  useEffect(() => {
    inputs.current = Array(length).fill(null).map((_, i) => inputs.current[i] || React.createRef<TextInput>());
  }, [length]);

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onChangeOTP(newOtp.join(''));

    // Automatically focus the next input
    if (text && index < length - 1) {
      setTimeout(() => {
        inputs.current[index + 1]?.current?.focus();
      }, 100); // Adding a slight delay to ensure state is updated
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) {
      setTimeout(() => {
        inputs.current[index - 1]?.current?.focus();
      }, 100); // Adding a slight delay to ensure state is updated
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
            if (event.nativeEvent.key === 'Backspace') {
              handleBackspace(digit, index);
            }
          }}
          style={styles.otpInput}
          keyboardType="numeric"
          maxLength={1}
          ref={inputs.current[index]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 3,
    marginVertical: 10,
  },
});

export default SplitOTPInput;
