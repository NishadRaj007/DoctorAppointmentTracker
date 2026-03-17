import * as React from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, ScrollView, Image } from 'react-native';
import { RootStackParamList, SettingProps } from '../../navigation/navigation';
import images from '../../assets/images/imageMap';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../common-components/Button';
import { useTheme } from '../../theme/ThemeContext';
import { darkTheme, lightTheme } from '../../theme/Themes';
import { getAuth } from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import HeaderWithBackButton from '../../common-components/HeaderWithBackButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { set } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';


const SettingsScreen: React.FC<SettingProps> = ({ navigation }) => {

  const { theme, setTheme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userType, setUserType] = useState('');
  const [gender, setGender] = useState('');
  (globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
  const auth = getAuth();
  const firestore = getFirestore();
  const user = auth.currentUser;

  const handleLogout = async () => {
    auth.signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      })
      .catch(error => {
        console.error('Sign out error:', error);
      });
    await AsyncStorage.clear();
  };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (user) {
  //       try {
  //         const doctorsRef = collection(firestore, 'doctors');
  //         const q = query(doctorsRef, where('userId', '==', user.uid));
  //         const querySnapshot = await getDocs(q);

  //         if (!querySnapshot.empty) {
  //           const userData = querySnapshot.docs[0].data();
  //           setGender(userData.gender || 'gender not mentioned');
  //           setUserName(userData.doctorName || 'No display name set');
  //           setPhoneNumber(userData.phoneNumber || 'No phone number associated'); // ✅ Fix: use Firestore phone number
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user data:', error);
  //       }
  //     }
  //   };

  //   fetchUserData(); // Call the async function
  // }, [user]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userType = await AsyncStorage.getItem("userType"); // Get all keys stored in AsyncStorage
        setUserType(userType || ''); // Set the user type
      } catch (error) {
        console.error('Error fetching all AsyncStorage data:', error);
      }
    };

    fetchAllData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('doctorDetails');
          console.log('Stored User Data:', storedUserData); // Debugging line
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setGender(userData.gender || 'Gender not mentioned');
            setUserName(userData.doctorName || 'No display name set');
            setPhoneNumber(userData.phoneNumber || 'No phone number associated');
          }
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };

      fetchUserData();
    }, [])
  );


  const handleUserDetails = () => {
    // const user = auth().currentUser;

    // if (user) {
    //   // Extracting user details
    //   const userDetails = `
    //     UID: ${user.uid}
    //     Phone Number: ${user.phoneNumber}
    //     Email: ${user.email || 'No email associated'}
    //     Display Name: ${user.displayName || 'No display name set'}
    //   `;

    //   // Print user details in an alert
    //   Alert.alert('User Details', userDetails);
    // } else {
    //   Alert.alert('Error', 'No user is currently logged in.');
    // }
  };

  const getImageSource = (imageKey: string) => {
    const imageSource = images[imageKey];
    if (!imageSource) {
      console.error('Image not found:', imageKey);
      return null;
    }
    return imageSource;
  };

  // return (
  //   <View style={{ padding: 20 }}>
  //     <Button title="Logout" onPress={handleLogout} />
  //     <Button title="Show User Details" onPress={handleUserDetails} />
  //   </View>
  // );

  const moveToScreen = (screenName: any) => {
    navigation.navigate(screenName);
  }

  const capitalizeName = (name: string) => {
    return name
      .split(' ') // Split the name into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(' '); // Join them back into a single string
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.primaryBackground }]}>
      <ScrollView style={[styles.container, { backgroundColor: currentTheme.primaryBackground }]} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <HeaderWithBackButton screenName={'Settings'} />
        {userType == 'doctor' && (
          <>
            <View style={[styles.profileContainer, { backgroundColor: currentTheme.secondaryBackground }]}>
              <View style={[styles.imageWrapper, { borderWidth: 1 }]}>
                {gender == 'male' && <Image
                  source={getImageSource('boy')} // Replace with actual image URL or local path
                  style={styles.profileImage}
                />}
                {gender == 'female' && <Image
                  source={getImageSource('femaleDoctor')} // Replace with actual image URL or local path
                  style={styles.profileImage}
                />}
              </View>
              <Text style={[styles.profileName, { color: currentTheme.primaryText }]}>{capitalizeName(userName)}</Text>
              <Text style={styles.profileInfo}>{phoneNumber}</Text>
              <CustomButton
                onPress={() => moveToScreen('EditProfileScreen')}
                label="Edit Profile"
                size='small'
                icon="create-outline"
                justifyContent='space-between'
              />
            </View>

            <TouchableOpacity style={[styles.option, styles.optionSectionStart, { backgroundColor: currentTheme.secondaryBackground, borderColor: currentTheme.borderColor }]} onPress={() => moveToScreen('TimerSettingsScreen')}>
              <View style={styles.optionContent}>
                <Ionicons name="stopwatch-outline" size={24} color="#00BFFF" />
                <Text style={[styles.optionText, { color: currentTheme.primaryText }]}>Average Time</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={18} color={currentTheme.primaryText} />
            </TouchableOpacity>


            <TouchableOpacity style={[styles.option, styles.optionSectionEnd, { backgroundColor: currentTheme.secondaryBackground, borderColor: currentTheme.borderColor }]} onPress={() => moveToScreen('FeedbackScreen')}>
              <View style={styles.optionContent}>
                <Ionicons name="chatbox-outline" size={24} color="#34C759" />
                <Text style={[styles.optionText, { color: currentTheme.primaryText }]}>Feedback</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={18} color={currentTheme.primaryText} />
            </TouchableOpacity>
          </>
        )}


        {userType == 'patient' && (
          <>
            <TouchableOpacity style={[styles.singleOption, styles.optionSectionEnd, { backgroundColor: currentTheme.secondaryBackground, borderColor: currentTheme.borderColor }]} onPress={() => moveToScreen('FeedbackScreen')}>
              <View style={styles.optionContent}>
                <Ionicons name="chatbox-outline" size={24} color="#34C759" />
                <Text style={[styles.optionText, { color: currentTheme.primaryText }]}>Feedback</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={18} color={currentTheme.primaryText} />
            </TouchableOpacity>
          </>
        )}

        {/* <TouchableOpacity style={[styles.option, { backgroundColor: currentTheme.secondaryBackground, borderColor: currentTheme.borderColor }]} onPress={() => moveToScreen('TimerSettingsScreen')}>
          <View style={styles.optionContent}>
            <Ionicons name="notifications-outline" size={24} color="#FF4B5C" />
            <Text style={[styles.optionText, { color: currentTheme.primaryText }]}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={currentTheme.primaryText} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.option, styles.optionSectionEnd, { backgroundColor: currentTheme.secondaryBackground, borderColor: currentTheme.borderColor }]} onPress={() => moveToScreen('TimerSettingsScreen')}>
          <View style={styles.optionContent}>
            <Ionicons name="settings-outline" size={24} color="#A569BD" />
            <Text style={[styles.optionText, { color: currentTheme.primaryText }]}>General Settings</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={currentTheme.primaryText} />
        </TouchableOpacity> */}

        {/* <TouchableOpacity style={[styles.option, styles.optionSingle, { backgroundColor: currentTheme.secondaryBackground, borderColor: currentTheme.borderColor }]} onPress={() => moveToScreen('TimerSettingsScreen')}>
          <View style={styles.optionContent}>
            <Ionicons name="help-outline" size={24} color="#778da9" />
            <Text style={[styles.optionText, { color: currentTheme.primaryText }]}>About</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={18} color={currentTheme.primaryText} />
        </TouchableOpacity> */}

        <View style={styles.logoutButton}>
          <CustomButton
            onPress={handleLogout}
            label="Log out"
            size='large'
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    marginVertical: 20,
    marginHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderRadius: 20
  },
  profileImage: {
    borderWidth: 1,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginBottom: 10,
    fontSize: 16,
    color: '#666',
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 20,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginRight: 10,
    marginLeft: 10
  },
  optionSectionStart: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  optionSectionEnd: {
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  optionSingle: {
    borderRadius: 20,
  },
  optionText: {
    fontSize: 18,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20
  },
  logoutButton: {
    alignItems: "center",
    marginVertical: 20,
  },
  editProfileButtonContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
    alignContent: "center",
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: '#ff5f5f',
    padding: 12,
    borderRadius: 12,
    width: 130,
    alignItems: 'center',
  },
  editProfileButton: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 16
  },
  singleOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 20,
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 20,
    borderRadius: 20,
  }

});

export default SettingsScreen;

