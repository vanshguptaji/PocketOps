import { View, Text, TextInput } from 'react-native'
import React from 'react'

type InputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    editable?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean;
}
const Input = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType, editable, autoCapitalize, multiline }: InputProps) => {
  return (
    <View>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          editable={editable}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
        />
    </View>
  )
}

export default Input