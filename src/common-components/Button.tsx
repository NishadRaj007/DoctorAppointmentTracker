import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { darkTheme, lightTheme } from '../theme/Themes';
import { useTheme } from '../theme/ThemeContext';

// Define the props for the Button component
interface ButtonProps {
  onPress: () => void;
  label: string;
  color?: string; // Optional color prop to customize the button background color
  textColor?: string; // Optional text color prop to customize the button text color
  style?: ViewStyle; // Optional style prop to allow additional styles for the button container
  textStyle?: TextStyle; // Optional style prop to allow additional styles for the button text
  size?: 'small' | 'medium' | 'large'; // Optional size prop to customize button size
  icon?: string;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'; // Optional justifyContent prop
}

// Get the screen width
const { width: screenWidth } = Dimensions.get('window');

// Define size styles
const sizeStyles = {
  small: {
    fontSize: 16,
    width: 130, 
    borderRadius: 12,

  },
  medium: {
    fontSize: 16,
    width: screenWidth * 0.50,
    borderRadius: 14, 
  },
  large: {
    fontSize: 18,
    width: screenWidth * 0.92,
    borderRadius: 16,
    marginHorizontal: 'auto'
  },
};

// Button component definition
const CustomButton: React.FC<ButtonProps> = ({
  onPress,
  label,
  color = '#ff5f5f', // Default button color
  textColor = '#fff', // Default text color
  style,
  textStyle,
  size = 'large', // Default button size
  icon,
  justifyContent = 'center' // Default justifyContent
}) => {

  const { theme, setTheme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const buttonSizeStyle = sizeStyles[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, { backgroundColor: currentTheme.primaryButton, justifyContent }, buttonSizeStyle, style]}
    >
       {icon && <Ionicons name={icon} size={20} color="#fff" />}
      <Text style={[styles.text, { color: textColor, fontSize: buttonSizeStyle.fontSize }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Styles for the button component
const styles = StyleSheet.create({
  button: {
      display: "flex",
      flexDirection: "row",
      margin: 2,
      alignContent: "center",
      backgroundColor: '#ff5f5f',
      padding: 12,
      alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16
  },
});

export default CustomButton;
