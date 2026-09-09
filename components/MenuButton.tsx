import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface MenuButtonProps {
  label: string;
  icon: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  description?: string;
}

export function MenuButton({
  label,
  icon,
  onPress,
  color = '#ffffff',
  textColor = '#1f2937',
  description,
}: MenuButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.content}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        {description && <Text style={[styles.description, { color: textColor, opacity: 0.7 }]}>{description}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
});
