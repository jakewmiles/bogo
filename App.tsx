import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { ApolloProvider } from '@apollo/react-hooks';
import BrowseStack from './screens/BrowseStack';
import ProfileScreen from './screens/ProfileScreen';
import ContactsStack from './screens/ContactsStack';
import SignupStack from './screens/SignUp/SignupStack';
import client from './client';
import { isLoggedInVar } from './client'
import { useReactiveVar } from '@apollo/client';
import {
  useFonts,
  PTSans_400Regular,
  PTSans_700Bold,
  RedHatDisplay_700Bold,
  PublicSans_500Medium,
} from "@expo-google-fonts/dev";

export default function App() {
  const Tab = createBottomTabNavigator();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  // console.log(isLoggedIn)

  let [fontsLoaded] = useFonts({
    PTSans_400Regular,
    PTSans_700Bold,
    RedHatDisplay_700Bold,
    PublicSans_500Medium
  });



  let homeScreen;

  if (isLoggedIn) {
    homeScreen = (
      <NavigationContainer>
        <Tab.Navigator
          tabBarOptions={{
            activeBackgroundColor: '#dddddd',
            tabStyle: styles.tab,
            labelStyle: styles.tabText,
          }}>
          <Tab.Screen
            name="Browse"
            component={BrowseStack}
          />
          <Tab.Screen
            name="Contacts"
            component={ContactsStack}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    homeScreen = (
      <NavigationContainer>
        <SignupStack />
      </NavigationContainer>
    )
  }

  if (fontsLoaded) {
    return (
      <ApolloProvider client={client}>
        <View style={styles.view}>
          {homeScreen}
        </View>
      </ApolloProvider>
    );
  } else {
    return <View></View>
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  tab: {
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    alignSelf: 'center',
    color: 'black',
  }
})