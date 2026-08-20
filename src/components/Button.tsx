import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
};

const Button = ({ title, onPress, disabled, loading }: ButtonProps) => {
  return (
    <Pressable 
    onPress={onPress}
    style={styles.button}
    disabled={disabled}
    >
      <Text style={styles.text}>{loading ? "Loading..." : title}</Text>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button