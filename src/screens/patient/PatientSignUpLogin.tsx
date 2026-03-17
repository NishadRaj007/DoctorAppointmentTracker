import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  StatusBarStyle,
  TextInput,
} from 'react-native';
import images from '../../assets/images/imageMap';
import CustomButton from '../../common-components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { darkTheme, lightTheme } from '../../theme/Themes';
import { PatientSignUpLoginProps } from '../../navigation/navigation';
import HeaderWithBackButton from '../../common-components/HeaderWithBackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const PatientSignUpLogin: React.FC<PatientSignUpLoginProps> = ({ navigation }) => {

  const [hospitalName, setHospitalName] = useState('');
  const [PatientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Implement your registration logic here
    console.log('Hospital Name:', hospitalName);
    console.log('Patient Name:', PatientName);
    console.log('Phone Number:', phoneNumber);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <HeaderWithBackButton screenName={'Patient'} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Hospital/Clinic Name"
            value={hospitalName}
            onChangeText={setHospitalName}
          />
          <TextInput
            style={styles.input}
            placeholder="Patient Name"
            value={PatientName}
            onChangeText={setPatientName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <CustomButton onPress={handleRegister} label={'Register'}></CustomButton>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    // padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    color:'#17a2b8',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#17a2b8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loginText: {
    marginTop: 15,
    fontSize: 16,
  },
  loginLink: {
    color: '#17a2b8',
    fontWeight: 'bold',
  },
});
export default PatientSignUpLogin;