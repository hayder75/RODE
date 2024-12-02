import React from 'react';
import { View, Text } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../../axiosInstance'; // Adjust the path as needed

const HomeScreen = ({ route }) => {
  const { name } = route.params; // Get the user's name from route params

  return (
    <View style={tw`flex-1 bg-white justify-center items-center`}>
      <Text style={tw`text-3xl font-bold`}>Welcome, {name}!</Text>
    </View>
  );
};

export default HomeScreen;
