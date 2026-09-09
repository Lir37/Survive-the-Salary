import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface FloatingTextProps {
  text: string;
  visible: boolean;
  color?: string;
  onComplete: () => void;
}

export function FloatingText({ text, visible, color = '#059669', onComplete }: FloatingTextProps) {
  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
      opacity.setValue(1);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -60,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(() => onComplete());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    zIndex: 100,
  },
  text: {
    fontSize: 28,
    fontWeight: '800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
