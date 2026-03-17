import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes, User } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation';
import auth from '@react-native-firebase/auth';

const GoogleLogin: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const signIn = async () => {
    try {
      GoogleSignin.configure({
        webClientId: '357746160351-798rdn5qm748pbf3k53669fc3n4629dr.apps.googleusercontent.com', // Replace with your Web Client ID present in Firebase console goolge sign-in method
        offlineAccess: true,
      });
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      setUserInfo(response.data);
      if(response.data?.idToken) {
        const idToken = response.data.idToken;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);
        navigation.reset({
          index: 0,
          routes: [{ name: 'DoctorSelection' }],
        });
      }else {
        Alert.alert('Error', 'Google Sign-In failed. Please try again.');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services not available');
      } else {
        console.error('Sign-In Error:', error);
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  };

return (
    <View >
      <GoogleSigninButton
        style={styles.signInButton}
        size={GoogleSigninButton.Size.Wide} // Shows Google logo
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  );
};


const styles = StyleSheet.create({
    signInButton: {
      width: 340,
      height: 60,
    },
  });
  

export default GoogleLogin;
