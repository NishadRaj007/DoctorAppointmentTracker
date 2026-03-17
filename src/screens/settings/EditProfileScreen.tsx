import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ScrollView,
  Platform,
  Button,
} from 'react-native';
// import DatePicker from 'react-native-date-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { EditProfileScreenProps } from '../../navigation/navigation';
import images from '../../assets/images/imageMap';
import CustomButton from '../../common-components/Button';
import InputField from '../../common-components/InputField';
import { useTheme } from '../../theme/ThemeContext';
import { lightTheme, darkTheme } from '../../theme/Themes';
import HeaderWithBackButton from '../../common-components/HeaderWithBackButton';
import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GenderSelection from '../../common-components/GenderSelection';
import { SafeAreaView } from 'react-native-safe-area-context';


const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [dob, setDob] = useState<Date>(new Date());
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [HospitalClinic, setHospitalClinicName] = useState<string>('');
  const [profilePicUrl, setProfilePicUrl] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [gender, setGender] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;
  const firestore = getFirestore();


  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const placeholderColor = "#888";


  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     if (user) {
  //       try {
  //         const doctorsRef = collection(firestore, 'doctors');
  //         const q = query(doctorsRef, where('userId', '==', user.uid));
  //         const querySnapshot = await getDocs(q);

  //         if (!querySnapshot.empty) {
  //           const userData = querySnapshot.docs[0].data();
  //           setHospitalClinicName(userData.hospitalName || 'No display name set');
  //           setMobileNumber(userData.phoneNumber || 'No phone number associated');
  //           setName(userData.doctorName || 'No display name set');
  //           setEmail(userData.email || 'No email associated');
  //           setGender(userData.gender || 'gender not mentioned');
  //         }
  //       } catch (error) {
  //         console.error('Error fetching user data:', error);
  //       }
  //     }
  //   };

  //   fetchUserData(); // Call the async function
  // }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('doctorDetails');
        console.log('Stored User Data:', storedUserData); // Debugging line
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setHospitalClinicName(userData.hospitalName || 'No display name set');
          setMobileNumber(userData.phoneNumber || 'No phone number associated');
          setName(userData.doctorName || 'No display name set');
          setEmail(userData.email || 'No email associated');
          setGender(userData.gender || '');
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };
  
    fetchUserData();
  }, []);
  



  //------------- to save the data ------------------//

  const handleSave = async () => {
    try {
      // 🔹 Validate required fields before proceeding
      if (!name || !HospitalClinic || !mobileNumber || !email) {
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }

      if (user) {

        // 🔹 Query the user's Firestore document
        const doctorsRef = collection(firestore, 'doctors');
        const q = query(doctorsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDocRef = doc(firestore, 'doctors', querySnapshot.docs[0].id);

          // 🔹 Update the user document
          await updateDoc(userDocRef, {
            hospitalName: HospitalClinic.trim().toLowerCase(),
            doctorName: name.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
          });

          // User data object
          const userData = {
            userId: user.uid,
            hospitalName: HospitalClinic.trim().toLowerCase(),
            doctorName: name.trim().toLowerCase(),
            phoneNumber: mobileNumber,
            email: email.trim().toLowerCase(),
            gender: gender.trim().toLowerCase(),
          };
          await AsyncStorage.setItem('doctorDetails', JSON.stringify(userData));
          Alert.alert('Success', 'Profile updated successfully!');
        } else {
          Alert.alert('Error', 'User not found.');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleGoBack = () => {
    console.log('back clicked');

    navigation.goBack();
  }

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', includeBase64: false });

    if (result.assets && result.assets.length > 0) {
      // setProfilePicture(result.assets[0].uri ?? null);
      setProfilePicture('https://example.com/profile.jpg');
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

  const handleConfirm = (selectedDate: Date) => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate()); // Allow up to 1 year ago

    // Check if the selected date is in the future or too recent
    if (selectedDate > today) {
      Alert.alert('Invalid Date', 'Date of birth cannot be in the future.');
      setOpen(false);
      return;
    }

    if (selectedDate > maxDate) {
      Alert.alert('Invalid Date', 'Date of birth cannot be less than 16 year ago.');
      setOpen(false);
      return;
    }

    setOpen(false);
    setDob(selectedDate);
  };

  const capitalizeName = (name: string) => {
    return name
      .split(' ') // Split the name into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(' '); // Join them back into a single string
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.primaryBackground }]}>

      <HeaderWithBackButton
        screenName="Edit Profile"
      />
      <ScrollView style={[styles.container, { backgroundColor: currentTheme.primaryBackground }]} showsVerticalScrollIndicator={false}>

        <View style={[styles.profileContainer, { backgroundColor: currentTheme.secondaryBackground }]}>
          <TouchableOpacity style={styles.profilePictureContainer}>
          <View style={[styles.imageWrapper, { borderWidth: 1 }]}>
            {gender == 'male' && <Image
              source={getImageSource('boy')} // Replace with actual image URL or local path
              style={styles.profilePicture}
            />}
            {gender == 'female' && <Image
              source={getImageSource('femaleDoctor')} // Replace with actual image URL or local path
              style={styles.profilePicture}
            />}
            </View>
            {/* <Ionicons name="camera" size={24} color="#fff" style={[styles.editIcon, { color: currentTheme.primaryText }]} /> */}
          </TouchableOpacity>
          <Text style={[styles.profileName, { color: currentTheme.primaryText }]}> {capitalizeName(name)} </Text>
          <Text style={[styles.profileInfo, { color: currentTheme.secondaryText }]}>{mobileNumber}</Text>
        </View>
        
        <InputField
          label="Mobile"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          placeholder="Enter your mobile number"
          placeholderTextColor={placeholderColor}
          readOnly={true}
          style={styles.readOnlyInput}
        />

        <InputField
          label="Hospital/Clinic"
          value={HospitalClinic}
          onChangeText={setHospitalClinicName}
          placeholder="Enter your Hospital/Clinic name"
          placeholderTextColor={placeholderColor}
        />

        <InputField
          label="Username"
          value={name}
          onChangeText={setName}
          placeholder="Enter your username"
          placeholderTextColor={placeholderColor}
        />

        {/* {Platform.OS === 'ios' && (
          <View style={styles.multiFieldContainer}>

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={[styles.labelIOS, { color: currentTheme.secondaryText }]}>Birthday</Text>
              <TextInput
                style={[styles.inputSmall, { color: currentTheme.primaryText }]}
                placeholder="Date of Birth"
                value={dob.toDateString()}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            {showDatePicker && (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
              >
                <View style={styles.datePickerContainer}>
                  <DatePicker
                    date={dob}
                    mode="date"
                    onDateChange={setDob}
                  />
                  <CustomButton
                    onPress={() => setShowDatePicker(false)}
                    label='Done'
                    size='medium'
                  />
                </View>
              </Modal>
            )}

          </View>
        )} */}

        {/* {Platform.OS === 'android' && (
          <View>
            <Text style={[styles.labelAndroid, { color: currentTheme.secondaryText }]}>Birthday</Text>
            <View style={styles.multiFieldContainer}>

              <TouchableOpacity onPress={() => setOpen(true)}  >
                <TextInput
                  style={[styles.inputDobAndroid, { color: currentTheme.primaryText }]}
                  placeholder="Date of Birth"
                  value={dob.toDateString()}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              <DatePicker
                modal
                open={open}
                date={dob}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setOpen(false)}
              />
            </View>
          </View>
        )} */}

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your Email"
          placeholderTextColor={placeholderColor}
        />
        <View style={styles.genderContainer}>
          <GenderSelection gender={gender} setGender={setGender} />
        </View>

        <CustomButton
          onPress={handleSave}
          label='Save'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  multiFieldContainer: {
    width: '96%',
    marginBottom: 16,
    marginHorizontal: 'auto',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
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
  input: {
    height: 50,
    marginHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  inputSmall: {
    marginHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: '400'
  },
  inputDobAndroid: {
    fontSize: 16,
    fontWeight: '400'
  },
  profilePictureContainer: {
    alignSelf: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  profilePicture: {
    borderWidth: 1,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: 'black',
    borderRadius: 50,
    padding: 5,
  },
  datePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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

  picker: {
    color: 'black', // change the color of the text if needed
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    fontSize: 16,
  },
  labelIOS: {
    marginTop: 8,
    paddingLeft: 10,
    fontSize: 12,
    marginBottom: 8,
  },
  labelAndroid: {
    paddingLeft: 10,
    fontSize: 12,
    marginBottom: 4,
    marginStart: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    height: 56,
  },
  readOnlyInput: {
    backgroundColor: '#f0f0f0', // Light gray background to indicate it's disabled
    color: '#888',
  },
  genderContainer:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditProfileScreen;