import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Alert,
  Animated,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { DoctorSignUpProps } from '../../navigation/navigation';
import HeaderWithBackButton from '../../common-components/HeaderWithBackButton';
import CustomButton from '../../common-components/Button';
import images from '../../assets/images/imageMap';
import auth, { createUserWithEmailAndPassword, FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import SplitOTPInput from '../../common-components/SplitOTPInput';
import { addDoc, collection, doc, getDocs, getFirestore, query, serverTimestamp, updateDoc, where } from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GenderSelection from '../../common-components/GenderSelection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';


const DoctorSignUp: React.FC<DoctorSignUpProps> = ({ navigation }) => {

  const [hospitalName, setHospitalName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [confirm, setConfirm] = React.useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isToggled, setIsToggled] = React.useState(false);
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const [viewPassword, setViewPassword] = useState(false);
  const [gender, setGender] = useState('');


  const placeholderColor = "#888";
  const { height, width } = Dimensions.get('window');
  const circleImageHeight = width * 1.5;
  const circleImageWidth = width * 1.5;
  const firestore = getFirestore();
  const auth = getAuth();

  const animatedValue = useRef(new Animated.Value(0)).current;

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
        setIsOtpVerified(true);
        const userData = {
          phoneNumber
        };
        await AsyncStorage.setItem('doctorDetails', JSON.stringify(userData));
        setIsToggled(previousState => !previousState);
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
  const handleRegister = async () => {
    if ( !phoneNumber) {
      Alert.alert('Error', 'Please Enter 10 digit mobile number.');
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

  const registerUser = async () => {
    if (!email || !doctorName || !hospitalName || !phoneNumber || !gender) {
      Alert.alert('Error', 'Please fill in all details.');
      return;
    }
     setLoading(true); // Start loading
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      const trimmedHospital = hospitalName.trim().toLowerCase();
      const trimmedDoctor = doctorName.trim().toLowerCase();

      // 🔍 Check for existing doctor with same name in the same hospital
      const doctorsRef = collection(firestore, 'doctors');
      const uniquenessQuery = query(
        doctorsRef,
        where('hospitalName', '==', trimmedHospital),
        where('doctorName', '==', trimmedDoctor)
      );
      const uniquenessSnapshot = await getDocs(uniquenessQuery);

      // If a different user has the same hospital-doctor combination, show error
      if (
        !uniquenessSnapshot.empty &&
        uniquenessSnapshot.docs[0].data().userId !== user.uid
      ) {
         setLoading(false); // Start loading
        Alert.alert(
          'Already Registered',
          `A doctor named "${doctorName}" is already registered at "${hospitalName}".`
        );
        return;
      }

      // Store user info in Firestore
      // 🔹 Query the user's Firestore document
      const q = query(doctorsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDocRef = doc(firestore, 'doctors', querySnapshot.docs[0].id);
        await updateDoc(userDocRef, {
          hospitalName: hospitalName.trim().toLowerCase(),
          doctorName: doctorName.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          gender: gender.trim().toLowerCase(),
          createdAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(firestore, 'doctors'), {
          userId: user.uid, // Store the UID
          hospitalName: hospitalName.trim().toLowerCase(),
          doctorName: doctorName.trim().toLowerCase(),
          phoneNumber,
          email: email.trim().toLowerCase(),
          gender: gender.trim().toLowerCase(),
          createdAt: serverTimestamp(),
        });
      }

      // User data object
      const userData = {
        userId: user.uid,
        hospitalName: hospitalName.trim().toLowerCase(),
        doctorName: doctorName.trim().toLowerCase(),
        phoneNumber,
        email: email.trim().toLowerCase(),
        gender: gender.trim().toLowerCase(),
        createdAt: new Date().toISOString(), // Store as string for AsyncStorage
      };

      // 🔹 Save user data in AsyncStorage
      await AsyncStorage.setItem('doctorDetails', JSON.stringify(userData));

      Alert.alert('registered successfully', 'Thank you for registering!');
      await AsyncStorage.setItem('gender', gender);
      navigation.reset({
        index: 0,
        routes: [{ name: 'DoctorDashboard', params: { userType: 'doctor' } }],
      });

    } catch (error) {
      setLoading(false); // Stop loading
      if (error instanceof Error) {
        console.log('Error', error.message);
        Alert.alert('Already registered', 'Please login');
      }
    }
  };

  const animatedStyle = isToggled ? {
    opacity: animatedValue,
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  } : {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };



  return (
        <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >

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
                <Text style={styles.title}>Sign Up</Text>
                <Image
                  source={getImageSource('doctorBg')}
                  style={[styles.backgroundImage, { height: circleImageHeight, width: circleImageWidth }]}
                />
                <View style={styles.fieldInputContainer}>
                  <Image
                    source={getImageSource('indianFlag')}
                    style={styles.flagImage}
                  />
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Phone Number"
                    placeholderTextColor={placeholderColor}
                    value={phoneNumber}
                    readOnly={isOtpVerified}
                    maxLength={10}
                    keyboardType="phone-pad"
                    onChangeText={setPhoneNumber}
                  />
                </View>

                {isOtpVerified && (
                  <View>
                    <View style={styles.fieldInputContainer}>
                      <TouchableOpacity >
                        <Ionicons name="business-outline" size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <Text style={styles.countryCode}> </Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="Hospital/Clinic Name"
                        placeholderTextColor={placeholderColor}
                        value={hospitalName}
                        onChangeText={setHospitalName}
                      />
                    </View>
                    <View style={styles.fieldInputContainer}>
                      <TouchableOpacity >
                        <Ionicons name="person-outline" size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <Text style={styles.countryCode}> </Text>
                      {doctorName && <Text>Dr.</Text>}
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="Doctor Name"
                        placeholderTextColor={placeholderColor}
                        value={doctorName}
                        onChangeText={setDoctorName}
                      />
                    </View>
                    <View style={styles.fieldInputContainer}>
                      <TouchableOpacity >
                        <Ionicons name="mail-outline" size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <Text style={styles.countryCode}> </Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="Email"
                        placeholderTextColor={placeholderColor}
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                    <GenderSelection gender={gender} setGender={setGender} />
                  </View>
                )}
                {isOtpVerified ?
                  <CustomButton onPress={registerUser} label={'Register'}></CustomButton>
                  :
                  <View>
                    <CustomButton onPress={handleRegister} label={'Send OTP'}></CustomButton>

                    <View style={styles.loginContainer}>
                      <Text style={styles.loginText}>
                        Already have an account?{' '}
                      </Text>
                      <TouchableOpacity onPress={() => { navigation.navigate('DoctorLogin') }}>
                        <Text style={styles.loginLink}>Log In</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                }

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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  contentContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  fieldInputContainer: {
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
  fieldInput: {
    flex: 1,
    color: '#000',
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
    color: 'black',
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
  loginContainer: {
    padding: 15,
    flexDirection: 'row', // Align horizontally
    justifyContent: 'center', // Center the content horizontally
    alignItems: 'center', // Vertically center the content
  },
  backgroundImage: {
    width: 500, // Adjust the width
    height: 500, // Adjust the height
    opacity: 0.04, // Lower opacity
    position: 'absolute',
  },
  inner: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  } as ViewStyle,
  titleContainer: {
    alignItems: 'center',
    marginTop: 0,
  } as ViewStyle,
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  image: {
    overflow: "hidden",
    aspectRatio: 1,
    margin: 5

  } as ImageStyle,
  // contentContainer: {
  //   justifyContent: 'center',
  // } as ViewStyle,
  heading: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Inter, sans-serif",
  } as TextStyle,
  subheading: {
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    alignSelf: "center",
  } as TextStyle,
  subheadingOtp: {
    textAlign: "center",
    fontFamily: "Inter, sans-serif",
    alignSelf: "center",
    marginBottom: 20
  } as TextStyle,
  inputBox: {
    alignItems: "stretch",
    borderRadius: 8,
    borderColor: "rgba(224, 224, 224, 1)",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#FFF",
    marginTop: 24,
    justifyContent: "center",
    paddingHorizontal: 16,
  } as ViewStyle,
  inputText: {
    color: "#828282",
    paddingVertical: 8,
  } as TextStyle,
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
  scrollView: {
    flex: 1
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
export default DoctorSignUp;