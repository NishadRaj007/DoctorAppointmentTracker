import React from 'react';
import { View, Text, StyleSheet, ViewStyle, DimensionValue, ImageBackground, TextStyle, TouchableOpacity } from 'react-native';
import images from '../assets/images/imageMap';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenProps, RootStackParamList } from '../navigation/navigation';

interface CardProps<T = {}> {
  width: number | string;
  height: number | string;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  imageKey: string;
  title: string;
  title_font: number;
  navigateTo: keyof RootStackParamList; // Navigation name should match keys in RootStackParamList
  navigationParams?: T; // Define navigation parameters
}
const Card: React.FC<CardProps & { navigation: any }> = ({ width, height, marginTop, marginRight, marginBottom, marginLeft, imageKey, title, title_font, navigateTo, navigationParams, navigation}) => {

  const getImageSource = (imageKey: string) => {
    const imageSource = images[imageKey];
    if (!imageSource) {
      console.error('Image not found:', imageKey);
      return null;
    }
    return imageSource;
  };

  const handlePress = () => {
    if(navigateTo)
    navigation.navigate(navigateTo,navigationParams);
  };

  const containerStyle: ViewStyle = {
    width: width as DimensionValue | undefined,
    height: height as DimensionValue | undefined,
    borderRadius: 10,
    overflow: 'hidden', // To ensure the border radius applies to the background image
    marginTop: marginTop,
    marginRight: marginRight,
    marginBottom: marginBottom,
    marginLeft: marginLeft,
  };

  const textStyle: TextStyle={
    color: 'white',
    fontSize: title_font,
    fontWeight: 'semibold',
    textAlign: 'center',
    margin: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  }
  

  return (
    <TouchableOpacity onPress={handlePress}>
    <ImageBackground
      source={getImageSource(imageKey)}
      style={containerStyle}    >
      <View style={styles.overlay}>
        <Text style={textStyle}> {title}</Text>
      </View>
    </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: dark overlay to improve text visibility
  }
});

export default Card;



