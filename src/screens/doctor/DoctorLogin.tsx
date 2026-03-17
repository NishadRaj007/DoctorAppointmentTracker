import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Alert,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import HeaderWithBackButton from '../../common-components/HeaderWithBackButton';
import CustomButton from '../../common-components/Button';
import { DoctorLoginProps } from '../../navigation/navigation';
import images from '../../assets/images/imageMap';
import { createUserWithEmailAndPassword, FirebaseAuthTypes, getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { addDoc, collection, doc, getDocs, getFirestore, query, serverTimestamp, where } from '@react-native-firebase/firestore';
import { FirebaseError } from 'firebase/app';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SplitOTPInput from '../../common-components/SplitOTPInput';
import GoogleLogin from '../auth/GoogleLogin';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const DoctorLogin: React.FC<DoctorLoginProps> = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [enableRegister, setEnableRegister] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [isToggled, setIsToggled] = React.useState(false);
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = React.useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const placeholderColor = "#888";
  const { height, width } = Dimensions.get('window');
  const circleImageHeight = width * 1.5;
  const circleImageWidth = width * 1.5;
  
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleRegister = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true); // Start loading
    try {
      if (phoneNumber.length == 10) {
        const confirmation = await getAuth().signInWithPhoneNumber('+91' + phoneNumber);
        setConfirm(confirmation);
        setIsToggled(previousState => !previousState);
        Alert.alert('Alert', 'OTP sent to: ' + phoneNumber, [{ text: 'OK', onPress: () => console.log('OK Pressed') }], { cancelable: false });
      } else {
        Alert.alert(
          'Warning',
          'Mobile number should be 10 digits!',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
        console.log(error.message);

      }
    }
    finally {
      setLoading(false); // Stop loading
    }
  };


  const getImageSource = (imageKey: string) => {
    const imageSource = images[imageKey];
    if (!imageSource) {
      console.error('Image not found:', imageKey);
      return null;
    }
    return imageSource;
  };


  const handleConfirmOTP = async () => {
    setLoading(true); // Start loading
    try {
      if (confirm) {
        await confirm.confirm(otp);
        setMessage('Phone authentication successful!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'DoctorDashboard' }],
        });
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay
        const user = auth.currentUser;

        if (!user) {
          throw new Error('User not found after OTP verification');
        }

        if (user) {
          console.log('User ID:', user.uid);
          const doctorsRef = collection(firestore, 'doctors');
          const q = query(doctorsRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0]; // Get the first matching document
            const userData = {
              userId: user.uid,
              hospitalName: userDoc.data().hospitalName.trim().toLowerCase(),
              doctorName: userDoc.data().doctorName.trim().toLowerCase(),
              phoneNumber: userDoc.data().phoneNumber,
              email: userDoc.data().email.trim().toLowerCase(),
              gender: userDoc.data().gender.trim().toLowerCase(),
              createdAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem('doctorDetails', JSON.stringify(userData));
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
        Alert.alert(
          'Warning', 'invalid code',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
        );
      }
    }
    finally {
      setLoading(false); // Stop loading
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#17a2b8" />
          </View>
        )}
        <HeaderWithBackButton screenName={'zeroqtech'} />
        {!isToggled ?
          (
            <>
              <View style={styles.contentContainer}>
                <Text style={styles.title}>Doctor Login</Text>
                <Image
                  source={getImageSource('patientBg')}
                  style={[styles.backgroundImage, { height: circleImageHeight, width: circleImageWidth }]}
                />
                <View style={styles.phoneInputContainer}>
                  <Image
                    source={getImageSource('indianFlag')}
                    style={styles.flagImage}
                  />
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Please enter your phone number"
                    placeholderTextColor={placeholderColor}
                    value={phoneNumber}
                    maxLength={10}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
                <CustomButton onPress={handleRegister} label={'Login'}></CustomButton>
                <Text style={styles.footerText}>
                  By clicking continue, you agree to our{" "}
                  <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>
            </>
          ) : (
            <><View style={styles.contentContainer}>
              <Text style={[styles.heading, { color: 'black' }]}> OTP Verification</Text>
              <Text style={[styles.subheadingOtp, { color: 'black' }]}>
                Enter OTP received on {phoneNumber}
              </Text>
              <View>
                <SplitOTPInput length={6} onChangeOTP={setOtp} />
              </View>
              <TouchableOpacity style={styles.button} onPress={handleConfirmOTP}>
                <Text style={styles.buttonText}>Submit OTP</Text>
              </TouchableOpacity><Text style={[styles.footerText, { color: 'black' }]}>
                By clicking continue, you agree to our{" "}
                <Text style={[styles.linkText, { color: 'black' }]}>Terms of Service</Text> and{" "}
                <Text style={[styles.linkText, { color: 'black' }]}>Privacy Policy</Text>
              </Text>
            </View></>

          )
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  } as TextStyle,
  subheadingOtp: {
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    alignSelf: "center",
    marginBottom: 20
  } as TextStyle,
  contentContainer: {
    flex: 1,
    // padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  flagImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  countryCode: {
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  title: {
    color: '#17a2b8',
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
    color: '#000',
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
    fontSize: 16,
    color: '#000',
  },
  loginLink: {
    color: '#17a2b8',
    fontWeight: 'bold',
  },
  phoneInput: {
    flex: 1,
    color: '#000',
  },
  loginContainer: {
    padding: 15,
    flexDirection: 'row', // Align horizontally
    alignItems: 'center', // Vertically center the content
  },
  backgroundImage: {
    opacity: 0.1, // Lower opacity
    position: 'absolute',
  },
  footerText: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Inter, sans-serif",
  } as TextStyle,
  linkText: {
    textDecorationLine: "underline",
  } as TextStyle,
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 10,
  },
});
export default DoctorLogin;