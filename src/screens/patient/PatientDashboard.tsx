import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";
import { PatientDashboardProps } from "../../navigation/navigation";
import HeaderWithBackButton from "../../common-components/HeaderWithBackButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import images from "../../assets/images/imageMap";
import FloatingActionButton from "../../common-components/FloatingActionButton";
import { getAuth } from "@react-native-firebase/auth";
import { doc, FirebaseFirestoreTypes, getFirestore, onSnapshot } from "@react-native-firebase/firestore";
import { set } from "lodash";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import RenderHTML from "react-native-render-html";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

const PatientDashboard: React.FC<PatientDashboardProps> = ({ route, navigation }) => {

  const { userType, hospital, doctorName, currentStatus, isLive, userId } = route.params || {};
  const [status, setStatus] = useState(currentStatus | 0);
  const [isDocLive, setIsDocLIve] = useState(isLive);
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  const { height, width } = Dimensions.get('window');
  const circleImageHeight = width * 1.3;
  const circleImageWidth = width * 1.3;


  const htmlData = [
    {
      id: 1,
      html: `
        <div style="text-align:center; border-radius:10px;">
          <p style="font-size:16px; color:#333;">Get your favorite meals delivered in just 30 minutes!</p>
          <p style="font-weight:bold; margin:10px 0;">Flat <span style="color:#E91E63;">20% OFF</span> on first order</p>
        </div>
      `
    },
    {
      id: 2,
      html: `
        <div style="text-align:center;">
          <p style="font-size:16px; color:#333;">Experience the future with our latest smartphone series.</p>
          <p style="font-weight:bold; margin:10px 0;">Starting at <span style="color:#E91E63;">₹14,999</span></p>
        </div>
      `
    },
    {
      id: 3,
      html: `
        <div style="text-align:center;">
          <h2 style="color:#673AB7;">🎉 Summer Sale!</h2>
          <p style="font-size:16px; color:#333;">Up to 70% off on fashion, electronics, and more.</p>
        </div>
      `
    },
    {
      id: 4,
      html: `
        <div style="text-align:center;">
          <h2 style="color:#8BC34A;">🚴‍♂️ Stay Fit!</h2>
          <p style="font-size:16px; color:#333;">Join our fitness community and get exclusive discounts on gym memberships!</p>
        </div>
      `
    },
  ];

  useEffect(() => {
    if (!userId) return;

    console.log("Checking status...");

    const doctorRef = doc(firestore, "doctors", userId);

    const unsubscribe = onSnapshot(doctorRef, (docSnap) => {
      if (!docSnap?.exists) {
        console.log("Doctor not found or deleted:", userId);
        setStatus(0);  // Default value when doctor is not found
        setIsDocLIve(false);
        return;
      }

      const doctorData = docSnap.data();
      setStatus(doctorData?.currentStatus || 0);
      setIsDocLIve(doctorData?.isLive || false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [userId]);



  const handleLogout = () => {
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
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      // setUserInfo(null);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign-Out Error:', error);
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

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <HeaderWithBackButton screenName={'Patient'} />
        <View style={styles.historyContainer}>
          <View style={styles.historyRow}>
            <Text style={styles.historyHospital}>{toTitleCase(hospital || '')}</Text>
            <Text style={styles.historyDoctor}>Dr. {toTitleCase(doctorName || '')}</Text>
          </View>
        </View>

        <View style={styles.topHeaderContainer}>
          <View style={[styles.liveTitleContainer, { backgroundColor: isDocLive ? '#FF0000' : '#000000' }]}>
            {isDocLive && (
              <>
                <Text style={styles.titleLive}>LIVE</Text>
              </>
            )}
            {!isDocLive && (
              <>
                <Text style={[styles.titleLive, { color: 'white' }]}>Not Live</Text>
              </>
            )}
          </View>
        </View>
        {/* <View style={styles.topHeaderContainerSecond}>
          <TouchableOpacity style={styles.circleProfileButton} onPress={() => navigation.navigate('SettingScreen')}>
            <Ionicons name="menu-outline" size={24} color="#17a2b8" />
          </TouchableOpacity>
        </View> */}

        <View style={styles.contentContainer}>
          <Image
            source={getImageSource('patientBg')}
            style={[styles.backgroundImage, { height: circleImageHeight, width: circleImageWidth }]}
          />
          <Text style={styles.title}>Current Status</Text>
          <View style={styles.centerContainer}>
            <View style={styles.circle}>
              <Text style={styles.status}>{status}</Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.buttomButtonContainer}>
          <View>
            <FloatingActionButton onPress={() => navigation.navigate('FeedbackScreen')} iconName="feedback" />
            <Text style={styles.titleInButton}>Feedback</Text>
          </View>
          <View>
            <FloatingActionButton onPress={() => (handleLogout(), signOut())} iconName="logout" buttonColor="#EF5350" />
            <Text style={styles.titleInButton}>logout</Text>
          </View>
        </View> */}

        <View>
          <Carousel
            loop
            width={width}
            height={200}
            autoPlay={true} // Enable autoPlay
            autoPlayInterval={3000} // 3 seconds = 3000 milliseconds
            data={htmlData}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View style={styles.htmlContainer}>
                <RenderHTML contentWidth={width} source={{ html: item.html }} />
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  titleLive: {
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 6,
    marginVertical: 2,
    color: '#fff'
  },
  titleTime: {
    textAlign: 'center',
    fontSize: 20,
    margin: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#17a2b8'
  },
  titleInButton: {
    textAlign: 'center',
    fontSize: 12,
    color: 'black',
  },
  circle: {
    width: 150,
    height: 100,
    margin: 10,
    borderRadius: 15,
    backgroundColor: '#1B181B', // Gray color
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // White color
  },
  button: {
    backgroundColor: '#007bff', // Blue color
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White color
  },
  circleButton: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 30,
    backgroundColor: '#778899', // Gray color
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportCircleButton: {
    width: 60,
    height: 60,
    marginHorizontal: 0,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
  centerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttomButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  reportButtomButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  topHeaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center'
  },
  backgroundImage: {
    width: 500, // Adjust the width
    height: 500, // Adjust the height
    opacity: 0.2, // Lower opacity
    position: 'absolute',
  },
  liveTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  topHeaderContainerSecond: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
    marginTop: -24
  },
  htmlContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
    height: 150,
  },
  historyContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    width: '100%',
  },
  historyRow: {
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
});

export default PatientDashboard;