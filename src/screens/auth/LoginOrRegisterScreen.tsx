import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ImageStyle,
  TextStyle,
  ViewStyle,
  Animated,
  Dimensions,
} from "react-native";
// import { LoginOrRegisterProps } from "../../navigation/navigation";
import images from "../../assets/images/imageMap";
import SplitOTPInput from "../../common-components/SplitOTPInput";
import 'react-native-gesture-handler';
// import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useTheme } from "../../theme/ThemeContext";
import { lightTheme, darkTheme } from "../../theme/Themes";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginOrRegisterScreen: React.FC<any> = ({  }) => {

  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const { height, width } = Dimensions.get('window');

  const circleImageHeight = width * 0.88;
  const circleImageWidth = width * 0.88;
  const imageRadius = width/2;

  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [otp, setOtp] = React.useState<string>('');
  const [isToggled, setIsToggled] = React.useState(false);
  // const [confirm, setConfirm] = React.useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [message, setMessage] = React.useState<string>('');

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const imagesNames = [
    'couple_1',
    'couple_2',
  ];

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset the animated value to 0
    animatedValue.setValue(0);

    // Animate to 1
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [isToggled]);

  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex++;
      if (currentIndex >= imagesNames.length) {
        currentIndex = 0;
      }

      Animated.timing(scrollX, {
        toValue: currentIndex * width,
        duration: 1000, // Slowing down the transition speed, adjust as needed
        useNativeDriver: true,
      }).start();

    }, 3000); // Keep this interval for the delay between transitions

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, [imagesNames.length, width, scrollX]);

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      scrollViewRef.current?.scrollTo({ x: value, animated: false });
    });

    return () => {
      scrollX.removeAllListeners();
    };
  }, [scrollX]);

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


  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
  };

  const handleSendOTP = async () => {
    // try {
    //   if (phoneNumber.length == 10) {
    //     const confirmation = await auth().signInWithPhoneNumber('+91'+phoneNumber);
    //     setConfirm(confirmation);
    //     setIsToggled(previousState => !previousState);
    //     Alert.alert('Alert','OTP sent to: '+ phoneNumber,[{ text: 'OK', onPress: () => console.log('OK Pressed') }],{ cancelable: false });
    //   } else {
    //     Alert.alert(
    //       'Warning',
    //       'Mobile number should be 10 digits!',
    //       [
    //         { text: 'OK', onPress: () => console.log('OK Pressed') }
    //       ],
    //       { cancelable: false }
    //     );
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     setMessage(`Error: ${error.message}`);
    //     console.log(error.message);

    //   }
    // }
    // navigation.replace('BottomTabNavigator');
        // setIsToggled(previousState => !previousState);
  };

  const handleConfirmOTP = async () => {
    // console.log('confirm clicked with otp: ' +  otp);
    // try {
    //   if (confirm) {
    //     await confirm.confirm(otp);
    //     setMessage('Phone authentication successful!');
    //     Alert.alert('Alert',message,[{ text: 'OK', onPress: () => console.log('OK Pressed') }],{ cancelable: false });
    //     navigation.replace('BottomTabNavigator');
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     setMessage(`Error: ${error.message}`);
    //     Alert.alert(
    //       'Warning','invalid code',
    //       [
    //         { text: 'OK', onPress: () => console.log('OK Pressed') }
    //       ],
    //       { cancelable: false }
    //     );
    //   }
    // }
    // navigation.replace('BottomTabNavigator');
  };

  const getImageSource = (imageKey: string) => {
    const imageSource = images[imageKey];
    if (!imageSource) {
      console.error('Image not found:', imageKey);
      return null;
    }
    return imageSource;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.primaryBackground }]}>
      <KeyboardAvoidingView keyboardVerticalOffset={10}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: currentTheme.primaryText }]}>enid</Text>
            </View>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.scrollView}>
              {imagesNames.map((imagesNames, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image
                    source={getImageSource(imagesNames)}
                    style={[styles.image, { height: circleImageHeight, width: circleImageWidth, borderRadius: imageRadius }]}
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.contentContainer}>
              <Animated.View style={[animatedStyle]}>
                {!isToggled ? (
                  <><Text style={[styles.heading, { color: currentTheme.primaryText }]}>Create an account</Text>
                    <Text style={[styles.subheading, { color: currentTheme.primaryText }]} >
                      Enter your mobile number to create account
                    </Text><View style={styles.inputBox}>
                      <TextInput
                        style={styles.inputText}
                        placeholder="Enter mobile number"
                        placeholderTextColor="#999999"
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={phoneNumber}
                        onChangeText={handlePhoneNumberChange} />
                    </View><TouchableOpacity style={styles.button} onPress={handleSendOTP}>
                      <Text style={styles.buttonText}>Send OTP</Text>
                    </TouchableOpacity><Text style={[styles.footerText, { color: currentTheme.primaryText }]} >
                      By clicking continue, you agree to our{" "}
                      <Text style={styles.linkText}>Terms of Service</Text> and{" "}
                      <Text style={styles.linkText}>Privacy Policy</Text>
                    </Text></>
                ) : (
                  <><Text style={[styles.heading,{color:currentTheme.primaryText}]}> OTP Verification</Text>
                  <Text style={[styles.subheadingOtp, {color:currentTheme.primaryText}]}>
                    Enter OTP received on {phoneNumber}
                  </Text>
                    <View>
                      <SplitOTPInput length={6} onChangeOTP={setOtp} />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleConfirmOTP}>
                      <Text style={styles.buttonText}>Submit OTP</Text>
                    </TouchableOpacity><Text style={[styles.footerText, {color:currentTheme.primaryText}]}>
                      By clicking continue, you agree to our{" "}
                      <Text style={[styles.linkText, { color: currentTheme.primaryText }]}>Terms of Service</Text> and{" "}
                      <Text style={[styles.linkText, { color: currentTheme.primaryText }]}>Privacy Policy</Text>
                    </Text></>

                )
                }
              </Animated.View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle,
  inner: {
    flexGrow: 1,
    flexDirection:'column',
    justifyContent: 'space-between',
    padding: 20,
  } as ViewStyle,
  titleContainer: {
    alignItems: 'center',
    marginTop: 0,
  } as ViewStyle,
  title: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 36,
    fontFamily: "Inter, sans-serif",
  } as TextStyle,
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  image: {
    overflow: "hidden",
    aspectRatio: 1,
    margin: 5

  } as ImageStyle,
  contentContainer: {
    justifyContent: 'center',
  } as ViewStyle,
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
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#000",
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
  } as ViewStyle,
  buttonText: {
    color: "#FFF",
    fontWeight: "500",
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
});

export default LoginOrRegisterScreen;
