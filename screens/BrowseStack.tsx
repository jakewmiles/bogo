import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import BrowseScreen from './BrowseScreen';
import BrowseFilter from './BrowseFilter';

const Stack = createStackNavigator();

const BrowseStack = (props: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BrowseScreen"
        component={BrowseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BrowseFilter"
        component={BrowseFilter}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default BrowseStack;