import React from 'react';
import { StyleSheet, View, TouchableOpacity, GestureResponderEvent, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can use any icon library
import { useTheme } from '../theme/ThemeContext';
import { lightTheme, darkTheme } from '../theme/Themes';


interface FloatingActionButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  iconName?: string,
  buttonColor?: string,
  label?: string
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onPress, iconName, buttonColor, label }) => {

    const { theme } = useTheme();
    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <TouchableOpacity style={[styles.fab,{backgroundColor: buttonColor? buttonColor :currentTheme.primaryButton}]} onPress={onPress}>
      {iconName && <Icon name={iconName} size={24} color="#fff" />}
      {label && <Text style={{ color: '#000', fontSize: 14, fontWeight: "bold" }}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Android shadow
        shadowColor: '#000', // iOS shadow color
        shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
        shadowOpacity: 0.3, // iOS shadow opacity
        shadowRadius: 4, // iOS shadow radius
      },
});

export default FloatingActionButton;
