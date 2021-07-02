import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import TextButton from '../../components/TextButton';
import ToggleableButtonFlatlist from '../../components/ToggleableButtonFlatlist';
import FloatingCard from '../../components/FloatingCard';
import { newUserVar } from '../../App';
import { LANGUAGES } from '../../services/queriesApi';
import { useLazyQuery } from '@apollo/client';
import { useQuery } from '@apollo/client';
import { isLoggedInVar, SEND_USER } from '../../client';

export interface LanguagesScreenProps {
  navigation: any;
  route: any;
}

interface Language {
  name: string;
  id: string;
  selected: boolean;
}

const LanguagesScreen: React.FC<LanguagesScreenProps> = ({ navigation }) => {
  const [ sendUser, sendUserCatch ] = useLazyQuery(SEND_USER);
  const { loading, error, data } = useQuery(LANGUAGES);
  while(loading || sendUserCatch.loading) {
    return null;
  }

  if (data) {
    console.log(data);
    newUserVar(data);
    console.log('newUserVar', newUserVar());
    isLoggedInVar(true);
  }


  const dataArray = data.languages;  
  const languagesArray = dataArray.map((language: Language) => language.selected = false);
  console.log(dataArray);
  
  return ( 
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.text}>What languages do you speak?</Text>
      <FloatingCard cardWidth={'85%'}>
        <View style={{height: 500, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 }}>
          <ToggleableButtonFlatlist array={dataArray}/>
        </View>
      </FloatingCard>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          const selectedLanguageIDs = dataArray.filter((language: Language) => language.selected === true)
                                               .map((language: Language) => language.id);          
          newUserVar({...newUserVar(), languages: selectedLanguageIDs});
          console.log(newUserVar());
          sendUser({variables:newUserVar()})
          navigation.navigate('LandingScreen');
        }}>
        <TextButton title={'LAUNCH ACCOUNT'} filled={true}/>
      </TouchableOpacity>
    </View>
   );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    width: '70%',
    height: '7%',
  },
})
 
export default LanguagesScreen;