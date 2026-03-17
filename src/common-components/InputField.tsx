import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, Dimensions, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { lightTheme, darkTheme } from '../theme/Themes';

interface InputFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, ...rest }) => {

  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View>
      {Platform.OS === 'android' && (
        <Text style={[styles.labelAndroid, { color: currentTheme.secondaryText }]}>{label}</Text>
      )}
      <View style={[styles.container]}>
        {Platform.OS === 'ios' && (
          <Text style={[styles.labelIOS, { color: currentTheme.secondaryText }]}>{label}</Text>
        )}

        {Platform.OS === 'ios' && (
          <TextInput
            style={[styles.input, { color: currentTheme.primaryText }]}
            value={value}
            onChangeText={onChangeText}
            {...rest}
          />)}

        {Platform.OS === 'android' && (
          <TextInput
            style={[styles.inputAndroid, { color: currentTheme.primaryText }]}
            value={value}
            onChangeText={onChangeText}
            {...rest}
          />)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '96%',
    marginBottom: 16,
    marginHorizontal: 'auto',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  labelIOS: {
    marginTop: 8,
    paddingLeft: 10,
    fontSize: 12,
    marginBottom: 8,
  },
  labelAndroid: {
    paddingLeft: 10,
    fontSize: 12,
    marginBottom: 4,
    marginStart: 5,
  },
  input: {
    marginHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '400'
  },
  inputAndroid: {
    fontSize: 16,
    fontWeight: '400',
  },
});

export default InputField;
