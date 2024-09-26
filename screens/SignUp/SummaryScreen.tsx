import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { newUserVar } from '../../client';
import IconButton from '../../components/IconButton';


export interface SummaryScreenProps {
  navigation: any;
  route: any;
}
 
const SummaryScreen: React.FC<SummaryScreenProps> = ({ navigation }) => {
  const [text, setText] = useState<string>('');
  const [guideStatus, setGuideStatus] = useState<boolean>(false);

  return ( 
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.text}>Write a summary about yourself</Text>
      <TextInput
        style={styles.textArea}
        multiline={true}
        numberOfLines={6}
        defaultValue={text}
        onChangeText={text => setText(text)}
      />
      <TouchableOpacity onPress={() => setGuideStatus(!guideStatus)}>
        {!guideStatus && <IconButton name={'compass'} size={30} color={'#99879D'} bgColor={'white'}/>}
        {guideStatus && <IconButton name={'compass'} size={30} color={'white'} bgColor={'#99879D'}/>}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          newUserVar({...newUserVar(), guide: guideStatus, summary: text, favorites: []});
          navigation.navigate('LanguagesScreen');
      }}>
        <IconButton 
          name={'chevron-right'}
          color={'white'}
          size={30}
          bgColor={'#99879D'}
          />
      </TouchableOpacity>
    </View>
   );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    width: '15%',
    height: '7%',
  },
  textArea: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: '#99879D',
    width: '85%',
    height: '30%',
    marginVertical: 25,
  }
})
 
export default SummaryScreen;