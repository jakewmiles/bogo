import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { newUserVar } from '../../client';
import FloatingCard from '../../components/FloatingCard';
import IconButton from '../../components/IconButton';
import TextButton from '../../components/TextButton';
import ToggleableButtonFlatlist from '../../components/ToggleableButtonFlatlist';
import { INTERESTS } from '../../services/queriesApi';
import { useQuery } from '@apollo/client';

export interface HobbiesScreenProps {
  navigation: any;
  route: any;
}

interface Hobby {
  name: string;
  id: string;
  selected: boolean;
}
 
const HobbiesScreen: React.FC<HobbiesScreenProps> = ({ navigation }) => {
  const { loading, error, data } = useQuery(INTERESTS);
  while(loading) {
    return null;
  }
  const dataArray = data.interests;  
  const languagesArray = dataArray.map((interest: Hobby) => interest.selected = false);

  return ( 
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.text}>What are your hobbies?</Text>
      <FloatingCard cardWidth={'85%'}>
        <View style={{height: 500, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 }}>
          <ToggleableButtonFlatlist array={dataArray}/>
        </View>
      </FloatingCard>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          const selectedHobbyIDs = dataArray.filter((hobby: Hobby) => hobby.selected === true)
                                          .map((hobby: Hobby) => hobby.id);          
          newUserVar({...newUserVar(), interests: selectedHobbyIDs});
          navigation.navigate('ImageUploadScreen');
        }}
      >
      <IconButton name={'chevron-right'} color={'white'} size={30} bgColor={'#99879D'}/>
      </TouchableOpacity>
    </View>
   );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 50,
  },
  button: {
    marginVertical: 50,
    width: '15%',
    height: '7%',
  },
})
 
export default HobbiesScreen;