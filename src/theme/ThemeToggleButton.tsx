import React, { useEffect, useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext';
import { darkTheme, lightTheme } from './Themes';


const ThemeToggleButton: React.FC = () => {
  type Theme = 'light' | 'dark';
  const { theme, setTheme } = useTheme();
  const isLightTheme = theme === 'light';
  const currentTheme = isLightTheme ? lightTheme : darkTheme;

  const [isEnabled, setIsEnabled] = useState(isLightTheme);

  useEffect(() => {
    setIsEnabled(!isLightTheme);
  }, [theme]);

  const toggleSwitch = () => {
    const newTheme = isLightTheme ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const saveTheme = async (theme: string) => {
    try {
      await AsyncStorage.setItem('@theme', theme);
    } catch (e) {
      console.error('Failed to save the theme.', e);
    }
  };

  return (
    <View style={styles.toggleContainer}>
      <Switch
        trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
        ios_backgroundColor={currentTheme.primaryBackground}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});

export default ThemeToggleButton;

