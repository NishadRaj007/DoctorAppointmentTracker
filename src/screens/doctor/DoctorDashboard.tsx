import { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, AppState } from "react-native";
import { DoctorDashboardProps } from "../../navigation/navigation";
import HeaderWithBackButton from "../../common-components/HeaderWithBackButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import images from "../../assets/images/imageMap";
import FloatingActionButton from "../../common-components/FloatingActionButton";
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundTimer from 'react-native-background-timer';
import { SafeAreaView } from "react-native-safe-area-context";

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ route, navigation }) => {
  const { userType } = route.params || {};
  const [status, setStatus] = useState(0);
  const { width } = Dimensions.get('window');
  const circleImageSize = width * 1.2;
  const [timerValue, setTimerValue] = useState(600);
  const [goLive, setGoLive] = useState(false);
  const [timer, setTimer] = useState(timerValue);
  const [isRunning, setIsRunning] = useState(false);
  
  // Refs for latest values
  const statusRef = useRef(status);
  const timerValueRef = useRef(timerValue);
  const isRunningRef = useRef(isRunning);
  const goLiveRef = useRef(goLive);
  const isMounted = useRef(true);
  
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  
  // Cache doctor document reference
  const doctorDocRef = useRef<ReturnType<typeof doc> | null>(null);

  // Update refs when state changes
  useEffect(() => {
    statusRef.current = status;
    timerValueRef.current = timerValue;
    isRunningRef.current = isRunning;
    goLiveRef.current = goLive;
  }, [status, timerValue, isRunning, goLive]);

  // Reset timer when status updates
  useEffect(() => {
    if (!isRunning && status > 0) {
      setTimer(timerValueRef.current);
    }
  }, [isRunning, status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      BackgroundTimer.stopBackgroundTimer();
    };
  }, []);

  const getDoctorRef = useCallback(async () => {
    if (doctorDocRef.current) return doctorDocRef.current;
    
    if (user) {
      const doctorsRef = collection(firestore, 'doctors');
      const q = query(doctorsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        doctorDocRef.current = doc(firestore, 'doctors', querySnapshot.docs[0].id);
        return doctorDocRef.current;
      }
    }
    return null;
  }, [firestore, user]);

  const handleAppFocus = useCallback(async () => {
    try {
      const [storedValue, storedStartTime] = await AsyncStorage.multiGet([
        'timerValue',
        'timerStartTime'
      ]);
      
      if (storedValue[1] && storedStartTime[1] && isRunningRef.current) {
        const initialValue = parseInt(storedValue[1], 10);
        const startedAt = parseInt(storedStartTime[1], 10);
        const now = Date.now();
        const elapsed = Math.floor((now - startedAt) / 1000);
        const cyclesCompleted = Math.floor(elapsed / initialValue);
        const remaining = initialValue - (elapsed % initialValue);

        if (cyclesCompleted > 0 && isMounted.current) {
          setStatus(prev => {
            const newStatus = prev + cyclesCompleted;
            updateLiveStatus(newStatus);
            return newStatus;
          });
        }

        if (isMounted.current) {
          setTimerValue(initialValue);
          setTimer(remaining);
        }
      }
    } catch (e) {
      console.error("Error calculating timer on resume:", e);
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        handleAppFocus();
      }
    });

    return () => subscription.remove();
  }, [handleAppFocus]);

  useEffect(() => {
    const loadTimerValue = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('timerValue');
        if (storedValue !== null) {
          const value = parseInt(storedValue, 10);
          setTimerValue(value);
          setTimer(value);
        }
      } catch (error) {
        console.error('Failed to load timer value', error);
      }
    };

    loadTimerValue();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", handleAppFocus);
    return unsubscribe;
  }, [navigation, handleAppFocus]);

  const handleTimerEnd = useCallback(async () => {
    if (!isMounted.current) return;
    
    const newStatus = statusRef.current + 1;
    setStatus(newStatus);
    await updateLiveStatus(newStatus);

    BackgroundTimer.setTimeout(() => {
      if (isMounted.current) {
        setIsRunning(true);
        AsyncStorage.setItem('timerStartTime', Date.now().toString());
      }
    }, 1000);
  }, []);

  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isRunning) {
      intervalId = BackgroundTimer.setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            // Stop the timer but keep showing 1
            setIsRunning(false);
            handleTimerEnd();
            return prev; // Stay at 1 until timeout completes
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) BackgroundTimer.clearInterval(intervalId);
    };
  }, [isRunning, handleTimerEnd]);

  const getImageSource = (imageKey: string) => {
    return images[imageKey] || null;
  };

  const goDocLive = useCallback(async () => {
    try {
      const docRef = await getDoctorRef();
      if (docRef) {
        await updateDoc(docRef, {
          isLive: true,
          currentStatus: status,
        });
        setGoLive(true);
        setIsRunning(true);
        await AsyncStorage.setItem('timerStartTime', Date.now().toString());
      } else {
        Alert.alert('Error', 'Doctor profile not found');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to go live');
    }
  }, [getDoctorRef, status]);

  const exitDocLive = useCallback(async () => {
    try {
      const docRef = await getDoctorRef();
      if (docRef) {
        await updateDoc(docRef, {
          isLive: false,
          currentStatus: 0,
        });
        setGoLive(false);
        setIsRunning(false);
        setTimer(timerValueRef.current);
        setStatus(0);
        await AsyncStorage.removeItem('timerStartTime');
      } else {
        Alert.alert('Error', 'Doctor profile not found');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to exit live');
    }
  }, [getDoctorRef]);

  const updateLiveStatus = useCallback(async (newStatus: number) => {
    try {
      if (!goLiveRef.current) return;
      
      const docRef = await getDoctorRef();
      if (docRef) {
        await updateDoc(docRef, {
          currentStatus: newStatus,
        });
      }
    } catch (error: any) {
      console.error('Update status failed:', error);
    }
  }, [getDoctorRef]);

  const showConfirmationDialog = () => {
    if (!goLive) return;
    
    Alert.alert(
      "Confirmation",
      "Do you want to reset?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: exitDocLive }
      ],
      { cancelable: true }
    );
  };

  const toggleTimer = () => {
    if (goLive) {
      setIsRunning(prev => !prev);
    }
  };

  const decrementStatus = () => {
    if (!goLive) return;
    const newStatus = Math.max(0, status - 1);
    setStatus(newStatus);
    updateLiveStatus(newStatus);
  };

  const incrementStatus = () => {
    if (!goLive) return;
    const newStatus = status + 1;
    setStatus(newStatus);
    updateLiveStatus(newStatus);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <HeaderWithBackButton screenName={'Doctor'} />
        
        <View style={styles.topHeaderContainer}>
          <View style={[styles.liveTitleContainer, { backgroundColor: goLive ? '#FF0000' : '#000000' }]}>
            <Text style={styles.titleLive}>
              {goLive ? 'LIVE' : 'Not Live'}
            </Text>
          </View>
        </View>
        
        <View style={styles.topHeaderContainerSecond}>
          <TouchableOpacity 
            style={styles.circleProfileButton} 
            onPress={() => navigation.navigate('SettingScreen')}
          >
            <Ionicons name="menu-outline" size={30} color="#17a2b8" />
          </TouchableOpacity>
          
          <View style={styles.timeContainer}>
            <Text style={styles.titleTime}>
              {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
            </Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Image
            source={getImageSource('doctorBg')}
            style={[styles.backgroundImage, { 
              height: circleImageSize, 
              width: circleImageSize 
            }]}
          />
          
          <Text style={styles.title}>Current Status</Text>
          
          {goLive ? (
            <View style={styles.centerContainer}>
              <TouchableOpacity 
                style={styles.circleButton} 
                onPress={decrementStatus}
              >
                <Ionicons name="remove-outline" size={40} color="#EF5350" />
              </TouchableOpacity>
              
              <View style={styles.circle}>
                <Text style={styles.status}>{status}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.circleButton} 
                onPress={incrementStatus}
              >
                <Ionicons name="add-outline" size={40} color="#81C784" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={goDocLive}>
              <View style={styles.circle}>
                <Text style={styles.status}>Go Live</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.buttomButtonContainer}>
          <View style={styles.buttonsTextContainer}>
            <FloatingActionButton 
              onPress={showConfirmationDialog} 
              label="Reset" 
              buttonColor="#c1dae1" 
            />
          </View>
          
          <View style={styles.buttonsTextContainer}>
            <FloatingActionButton 
              onPress={toggleTimer} 
              label={isRunning ? "Pause" : "Start"} 
              buttonColor="#c1dae1" 
            />
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#404040',
  },
  liveTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8
  },
  titleLive: {
    textAlign: 'center',
    fontSize: 14,
    marginHorizontal: 6,
    marginVertical: 2,
    color: '#fff',
    fontWeight: 'bold'
  },
  timeContainer: {
    backgroundColor: '#c1dae1',
    borderRadius: 8
  },
  titleTime: {
    textAlign: 'center',
    fontSize: 16,
    padding: 6,
    color: '#000',
    fontWeight: 'bold'
  },
  circle: {
    width: 150,
    height: 100,
    margin: 10,
    borderRadius: 15,
    backgroundColor: '#1B181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  circleButton: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 30,
    backgroundColor: '#CDC7CD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonsTextContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  topHeaderContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0
  },
  topHeaderContainerSecond: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -24
  },
  backgroundImage: {
    opacity: 0.15,
    position: 'absolute',
  },
});

export default DoctorDashboard;