import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export interface TextButtonProps {
  title: string,
  filled: boolean,
}

const TextButton: React.FC<TextButtonProps> = ({title, filled}) => {
  return (
    <View style={filled ? styles.filled : styles.notFilled}>
      <Text style={filled ? styles.filledText : styles.notFilledText}> {title} </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  filled: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#99879D',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    height: '30%',
    width: '100%',
  },
  filledText: {
    color: '#FFFFFF', 
    fontSize: 20,
  },
  notFilled: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#99879D',
    height: '30%',
    width: '100%',
  },
  notFilledText: {
    color: '#99879D', 
    fontSize: 20,
  }
})

export default TextButton;