import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  StatusBarStyle,
} from 'react-native';
import { HomeScreenProps } from '../../navigation/navigation';
import images from '../../assets/images/imageMap';
import CustomButton from '../../common-components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { darkTheme, lightTheme } from '../../theme/Themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  

  const { theme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const STYLES = ['default', 'dark-content', 'light-content'] as const;
  const TRANSITIONS = ['fade', 'slide', 'none'] as const;

  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    STYLES[1],
  )

  useEffect(() => {
    if (theme === 'dark') {
      setStatusBarStyle(STYLES[2]); // Set to 'light-content' for dark theme
    } else {
      setStatusBarStyle(STYLES[1]); // Set to 'dark-content' for light theme
    }
  }, [theme]);


  const getImageSource = (imageKey: string) => {
    const imageSource = images[imageKey];
    if (!imageSource) {
      console.error('Image not found:', imageKey);
      return null;
    }
    return imageSource;
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Hello!</Text>
        <Text style={styles.question}>Are you a doctor or a patient?</Text>
      </View>
      <Image
      source={getImageSource('doctor')}
        style={styles.image}
      />
     <CustomButton onPress={async () => { await AsyncStorage.setItem('userType', 'doctor'); navigation.navigate('DoctorSignUp')}} label={'I am a doctor'}/>
     <CustomButton onPress={async () => { await AsyncStorage.setItem('userType', 'patient'); navigation.navigate('PatientLogin')}} label={'I am a patient'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  textContainer:{
    marginTop: 20,
    display: 'flex'
  },
  title: {
    color:'#17a2b8',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5,
  },
  question: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  image: {
    width: '90%',
    height: 400,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  option: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#0056b3',
  },
  optionText: {
    color : '#fff',
    fontSize: 18,
  },
});
export default HomeScreen;