
import React from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue, ImageBackground, TouchableOpacity } from 'react-native';
import images from '../assets/images/imageMap';

interface CircleProps {
  width: number | string;
  height: number | string;
  imageKey: string
}

const Circle: React.FC<CircleProps> = ({ width, height, imageKey  }) => {
  
  const getImageSource = (imageKey: string) => {
    const imageSource = images[imageKey];
    if (!imageSource) {
      console.error('Image not found:', imageKey);
      return null;
    }
    return imageSource;
  };

  const handlePress = () => {  };

  const circleStyle: ViewStyle = {
    width: width as DimensionValue, 
    height: height as DimensionValue,
    borderRadius: typeof width === 'number' ? width / 2 : 50, // Adjust borderRadius based on width
    backgroundColor: 'lightblue',
    margin: 20,
    overflow: 'hidden'
  };

  return (
  <TouchableOpacity onPress={handlePress}>
    <ImageBackground
      source={getImageSource(imageKey)}
      style={circleStyle} >
    </ImageBackground>
    </TouchableOpacity>);
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Circle;
