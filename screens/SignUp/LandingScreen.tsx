import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import TextButton from '../../components/TextButton';

export interface LandingScreenProps {
  route: any;
  navigation: any;
}
 
const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  return ( 
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={styles.logo}>boGo</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('SignupScreen')}
      >
        <TextButton title={'CREATE ACCOUNT'} filled={true}/>
      </TouchableOpacity>
      <View style={styles.login}>
        <Text>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SigninScreen')}>
          <Text style={styles.loginButton}>
            Sign in now
          </Text>
        </TouchableOpacity>

      </View>
    </View>
   );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 90,
    marginVertical: '50%',
  },
  button: {
    width: '70%',
    height: 55,
  },
  login: {
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    fontWeight: 'bold',
  }
})
 
export default LandingScreen;