import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform, BackHandler } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { darkTheme, lightTheme } from '../theme/Themes';

interface HeaderWithBackButtonProps {
  screenName: string;
}

const HeaderWithBackButton: React.FC<HeaderWithBackButtonProps> = ({ screenName }) => {
  const navigation = useNavigation();
  const { theme, setTheme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const handleGoBack = () => {
    // Check if the navigator can go back
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;  // Prevent default behavior (back press)
    } else {
      // If there's no screen to go back to, exit the app
      BackHandler.exitApp();
      return true;  // Prevent default behavior (back press)
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.primaryBackground, flexDirection: 'row', alignItems: 'flex-start', borderBottomColor: theme == 'light' ? '#ccc' : '#666' }]}>
      <TouchableOpacity onPress={handleGoBack} style={{ padding: 10, minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
        <Ionicons name="arrow-back-outline" size={24} color={currentTheme.primaryText} />
      </TouchableOpacity>
      <Text style={[styles.screenName, { color: currentTheme.primaryText }]}>{screenName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    minHeight: 54,
    marginTop: 0,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 3 }, // Increase height to apply shadow at the bottom
    zIndex: 10,
    elevation: 2,
  },
  screenName: {
    paddingTop: 10,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

export default HeaderWithBackButton;
