import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Formik } from 'formik';
import TextButton from '../../components/TextButton';
import FloatingCard from '../../components/FloatingCard';
import { newUserVar } from '../../client';
import { RadioButton } from 'react-native-paper';

export interface SignupScreenProps {
  navigation: any;
  route: any;
}

const Genders = [
  {name: 'Male', id: '0'}, {name: 'Female', id: '1'}, {name: 'Other', id: '2'}
]

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [checked, setChecked] = useState<string>('0');

  return ( 
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Formik
        initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
        onSubmit={values => console.log(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values}) => (
          <View style={{width: '90%', justifyContent: 'center', alignItems: 'center'}}>
            <FloatingCard cardWidth={'90%'}>
              <Text style={{ fontSize: 32, marginVertical: '10%' }}>Sign-up</Text>
              <TextInput
                placeholder="First name"
                style={styles.inputField}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
              />
              <TextInput 
                placeholder="Last name"
                style={styles.inputField}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
              />
              <TextInput 
                placeholder="Email"
                style={styles.inputField}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              <TextInput 
                placeholder="Password"
                secureTextEntry={true}
                style={styles.inputField}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <RadioButton.Group onValueChange={checked => setChecked(checked)} value={checked}>
                <RadioButton.Item 
                  label={Genders[0].name}
                  value={Genders[0].name.toUpperCase()} 
                  status={checked === Genders[0].name ? 'checked' : 'unchecked'} 
                  onPress={() => setChecked(Genders[0].name)}/>
                <RadioButton.Item
                  label={Genders[1].name}
                  value={Genders[1].name.toUpperCase()} 
                  status={checked === Genders[1].name ? 'checked' : 'unchecked'} 
                  onPress={() => setChecked(Genders[1].name)}/>
                <RadioButton.Item
                  label={Genders[2].name}
                  value={Genders[2].name.toUpperCase()} 
                  status={checked === Genders[2].name ? 'checked' : 'unchecked'} 
                  onPress={() => setChecked(Genders[2].name)}/>
              </RadioButton.Group>
            </FloatingCard>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => {
                newUserVar({firstName: values.firstName, lastName: values.lastName, email: values.email, password: values.password, gender: checked});
                navigation.navigate('PersonalInfoScreen', {firstName: values.firstName});
              }}>
              <TextButton title={'CREATE PROFILE'} filled={true}/>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
   );
}

const styles = StyleSheet.create({
  button: {
    width: '70%',
    height: 55,
    marginTop: '25%',
  },
  wholeForm: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#99879D',
    borderRadius: 15,
    width: '90%',
  },
  inputField: {
    backgroundColor: '#99879D21',
    width: '85%',
    padding: '5%',
    marginBottom: '8%'
  }
})
 
export default SignupScreen;