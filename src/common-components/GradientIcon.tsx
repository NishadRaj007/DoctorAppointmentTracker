import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface GradientIconProps {
  iconName: string;
  size: number;
  gradientColors: string[];
}

const GradientIcon: React.FC<GradientIconProps> = ({ iconName, size, gradientColors }) => {
  return (
    <View style={{ width: size, height: size }}>
      <MaskedView
        style={{ flex: 1, flexDirection: 'row', height: '100%', width: 26 }}
        maskElement={
          <View
            style={{
              // Transparent background because mask is based off alpha channel.
              backgroundColor: 'transparent',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 'auto'
            }}
          >
            <Ionicons name={iconName} size={size} />
          </View>
        }
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.gradientBackground}
        />
      </MaskedView>
    </View>


  );
};

const styles = StyleSheet.create({
  maskedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMask: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    flex: 1,
  },
});

export default GradientIcon;
