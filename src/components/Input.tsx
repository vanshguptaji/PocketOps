import { View, Text, TextInput } from 'react-native'
import React from 'react'

type InputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
}
const Input = ({ placeholder, value, onChangeText, secureTextEntry }: InputProps) => {
  return (
    <View>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
    </View>
  )
}

export default Input