/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import { ThemeProvider } from './src/theme/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DoctorDashboard from './src/screens/doctor/DoctorDashboard';

import DoctorSignUp from './src/screens/doctor/DoctorSignUp';
import DoctorLogin from './src/screens/doctor/DoctorLogin';
import PatientLogin from './src/screens/patient/PatientLogin';
import { RootStackParamList } from './src/navigation/navigation';
import DoctorSelection from './src/screens/doctor/DoctorSelection';
import PatientDashboard from './src/screens/patient/PatientDashboard';
import SettingsScreen from './src/screens/settings/SettingsScreen';
import EditProfileScreen from './src/screens/settings/EditProfileScreen';
import TimerSettingsScreen from './src/screens/settings/TimerSettingsScreen';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeedbackScreen from './src/screens/common/FeedbackScreen';
import ForgotPassword from './src/screens/auth/ForgotPassword';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | undefined>(undefined);
  const Stack = createStackNavigator<RootStackParamList>();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const auth = getAuth();
  // const user = auth.currentUser;

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  const onAuthStateChanged = async (user: any) => {
    setUser(user);

    if (user) {
      try {
        const userType = await AsyncStorage.getItem('userType'); // Fetch user type
        if (userType === 'doctor') {
          setInitialRoute('DoctorDashboard');
        } else if (userType === 'patient') {
          setInitialRoute('DoctorSelection');
        } else {
          setInitialRoute('HomeScreen');
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
        setInitialRoute('HomeScreen');
      }
    } else {
      setInitialRoute('HomeScreen');
    }

    setInitializing(false);
  };


  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
  

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DoctorSignUp" component={DoctorSignUp} />
          <Stack.Screen name="DoctorLogin" component={DoctorLogin} />
          <Stack.Screen name="PatientLogin" component={PatientLogin} />
          <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} />
          <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
          <Stack.Screen name="DoctorSelection" component={DoctorSelection} />
          <Stack.Screen name="SettingScreen" component={SettingsScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="TimerSettingsScreen" component={TimerSettingsScreen} />
          <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
