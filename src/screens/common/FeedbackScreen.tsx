
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { FeedbackScreenProps } from "../../navigation/navigation";
import HeaderWithBackButton from "../../common-components/HeaderWithBackButton";
import CustomButton from "../../common-components/Button";
import { addDoc, collection, getFirestore, serverTimestamp } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ navigation })=> {
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState("");
  const placeholderColor = "#888";
  const firestore = getFirestore();
   const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setPhone(user.phoneNumber ?? "");
    }
  }, []);

  const handleSubmit = async () => {
    if (!feedback) {
      Alert.alert("Error", "Please enter your feedback.");
      return;
    }

    try {
      // Store user feedback in Firestore
      await addDoc(collection(firestore, 'feedback'), {
        userId: auth.currentUser?.uid,
        mobile: phone,
        feedback: feedback,
        createdAt: serverTimestamp(),
      });
      Alert.alert("Thank You!", "Your feedback has been submitted.");
      setFeedback("");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithBackButton screenName={'Feedback'} />
      <View style={styles.contentContainer}>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter your feedback"
        multiline
        placeholderTextColor={placeholderColor}
        numberOfLines={4}
        value={feedback}
        onChangeText={setFeedback}
      />
      <CustomButton onPress={handleSubmit} label={'Submit'}></CustomButton>
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
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FeedbackScreen;
