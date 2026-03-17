import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import HeaderWithBackButton from '../../common-components/HeaderWithBackButton';
import CustomButton from '../../common-components/Button';
import { DoctorSelectionProps } from '../../navigation/navigation';
import images from '../../assets/images/imageMap';
import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const DoctorSelection: React.FC<DoctorSelectionProps> = ({ navigation }) => {

  const [hospital, setHospital] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const placeholderColor = "#888";
  const [suggestionsHospitals, setSuggestionsHospitals] = useState<string[]>([]);
  const [suggestionsDoctors, setSuggestionsDoctors] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  (globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
  const db = getFirestore();


  useEffect(() => {
    if (hospital.trim() === '') {
      setSuggestionsHospitals([]);
    }
  }, [hospital]);

  useEffect(() => {
    if (doctorName.trim() === '') {
      setSuggestionsDoctors([]);
    }
  }, [doctorName]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const stored = await AsyncStorage.getItem('searchHistory');
        if (stored) {
          setHistory(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load search history", e);
      }
    };
    loadSearchHistory();

  }, []);

  const saveToHistory = async (doctorName: string, hospitalName: string) => {
    try {
      const newEntry: HistoryItem = { doctorName, hospitalName };

      setHistory((prev) => {
        const filtered = prev.filter(
          (item) =>
            item.doctorName !== doctorName || item.hospitalName !== hospitalName
        );
        const updated = [newEntry, ...filtered].slice(0, 3);
        AsyncStorage.setItem('searchHistory', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };


  const fetchSuggestionsHospitals = async (text: string) => {
    if (!text.trim()) {
      setSuggestionsHospitals([]); // Ensure suggestions clear when input is empty
      return;
    }
    try {
      if (text.length < 3) {
        setSuggestionsHospitals([]);
        return;
      }
      text = text.toLowerCase();
      if (text) {
        const q = query(collection(db, "doctors"), where("hospitalName", ">=", text), where("hospitalName", "<=", text + "\uf8ff"));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => doc.data().hospitalName);
        setSuggestionsHospitals(results);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const fetchSuggestionsDoctors = async (text: string) => {

    if (!text.trim()) {
      setSuggestionsDoctors([]); // Ensure suggestions clear when input is empty
      return;
    }
    try {
      if (text.length < 3) {
        setSuggestionsDoctors([]);
        return;
      }

      text = text.toLowerCase();

      const q = query(
        collection(db, "doctors"),
        where("doctorName", ">=", text),
        where("doctorName", "<=", text + "\uf8ff"),
        where("hospitalName", "==", hospital)
      );

      const querySnapshot = await getDocs(q);

      // Debugging output
      console.log("Query executed, docs found:", querySnapshot.size);
      querySnapshot.forEach((doc) => console.log("Doc:", doc.data()));

      const results = querySnapshot.docs.map((doc) => doc.data().doctorName);
      setSuggestionsDoctors(results);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };


  const handleCheckStatus = async () => {
    console.log('Checking status...');

    if (!hospital || !doctorName) {
      Alert.alert('Warning!', 'Please enter both hospital and doctor name');
      return;
    }
    const doctorsRef = collection(db, 'doctors');
    const q = query(doctorsRef, where("hospitalName", "==", hospital), where("doctorName", "==", doctorName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const currentStatus = userData.currentStatus;
      const isLive = userData.isLive;
      saveToHistory(doctorName, hospital);
      console.log("userData", userData.currentStatus);
      navigation.navigate('PatientDashboard', {
        userType: 'patient',
        hospital,
        doctorName,
        currentStatus,
        isLive,
        userId: querySnapshot.docs[0].id,
      });
    }
  };


  const handleCheckStatusForHistory = async (hospital: string, doctorName: string) => {
    if (!hospital || !doctorName) {
      Alert.alert('Warning!', 'Please enter both hospital and doctor name');
      return;
    }
    const doctorsRef = collection(db, 'doctors');
    const q = query(doctorsRef, where("hospitalName", "==", hospital), where("doctorName", "==", doctorName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const currentStatus = userData.currentStatus;
      const isLive = userData.isLive;
      console.log("userData", userData.currentStatus);
      navigation.navigate('PatientDashboard', {
        userType: 'patient',
        hospital,
        doctorName,
        currentStatus,
        isLive,
        userId: querySnapshot.docs[0].id,
      });
    }
  };


  const { height, width } = Dimensions.get('window');
  const circleImageHeight = width * 1.5;
  const circleImageWidth = width * 1.5;

  const getImageSource = (imageKey: string) => {
    const imageSource = images[imageKey];
    if (!imageSource) {
      console.error('Image not found:', imageKey);
      return null;
    }
    return imageSource;
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <HeaderWithBackButton screenName={'zeroqtech'} />
        <View style={styles.topHeaderContainerSecond}>
          <TouchableOpacity style={styles.circleProfileButton} onPress={() => navigation.navigate('SettingScreen')}>
            <Ionicons name="menu-outline" size={24} color="#17a2b8" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Hospital & Doctor</Text>
          <Image
            source={getImageSource('patientBg')}
            style={[styles.backgroundImage, { height: circleImageHeight, width: circleImageWidth }]}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={hospital}
              placeholderTextColor={placeholderColor}
              onChangeText={(text) => {
                setHospital(text);
                fetchSuggestionsHospitals(text);
              }}
              placeholder="Search Hospital/Clinic..."
            />
            {suggestionsHospitals.length > 0 && (
              <View style={styles.suggestionContainer}>
                <FlatList
                  data={suggestionsHospitals}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setHospital(item);
                        setSuggestionsHospitals([]); // Hide suggestions after selection
                      }}
                      style={styles.suggestionItem}
                    >
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>


          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Doctor Name"
              placeholderTextColor={placeholderColor}
              value={doctorName}
              onChangeText={(text) => {
                setDoctorName(text);
                fetchSuggestionsDoctors(text);
              }}
            />
            {suggestionsDoctors.length > 0 && (
              <View style={styles.suggestionContainer}>
                <FlatList
                  data={suggestionsDoctors}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setDoctorName(item);
                        setSuggestionsDoctors([]);
                      }}
                      style={styles.suggestionItem}
                    >
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <CustomButton onPress={handleCheckStatus} label={'Check Status'}></CustomButton>
          {history.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Recent Searches :</Text>

              {history.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyCard}
                  onPress={() => handleCheckStatusForHistory(item.hospitalName, item.doctorName)}
                >
                  <Text style={styles.historyHospital}>{item.hospitalName}</Text>
                  <Text style={styles.historyDoctor}> Dr. {item.doctorName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}


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
    color: '#17a2b8',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  backgroundImage: {
    width: 500, // Adjust the width
    height: 500, // Adjust the height
    opacity: 0.1, // Lower opacity
    position: 'absolute',
  },
  inputContainer: {
    width: '90%',
    position: 'relative', // Ensures absolute positioning of suggestions
    marginBottom: 15,
  },

  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },

  suggestionContainer: {
    position: 'absolute',
    top: '100%', // Appears just below the input field
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 150, // Limit height for scrolling
    zIndex: 10, // Ensure it's above other elements
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },

  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
    historyContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
    width: '100%',
  },
  historyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  historyCard: {
    backgroundColor: '#e6fafd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#17a2b8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyHospital: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    textAlign: 'left',
  },
  historyDoctor: {
    fontWeight: '600',
    fontSize: 14,
    color: '#007c91',
    flex: 1,
    textAlign: 'right',
  },

  topHeaderContainerSecond: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },

   circleProfileButton: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: 'transparent', // Gray color
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },


});
export default DoctorSelection;

type HistoryItem = {
  doctorName: string;
  hospitalName: string;
};

