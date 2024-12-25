import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/Homescreen';
import SubjectListScreen from '../screens/SubjectListScreen';
import YearSelectionScreen from '../screens/YearSelectionScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TestScreen from '../screens/TestScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Ensure ProfileScreen is imported 
import ProgressScreen from '../screens/ProgressScreen'; // Ensure ProgressScreen is imported 
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Homescreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SubjectListScreen" component={SubjectListScreen} />
        <Stack.Screen name="YearSelectionScreen" component={YearSelectionScreen} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
        <Stack.Screen name="TestScreen" component={TestScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> 
        <Stack.Screen name="ProgressScreen" component={ProgressScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
