import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../../axiosInstance';

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login', {
        phoneNumber,
        password,
      });

      // Navigate to HomeScreen with user's name
      navigation.navigate('Homescreen', { name: response.data.name });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <View style={tw`flex-1 bg-white justify-center px-6`}>
      <Text style={tw`text-3xl font-bold mb-8 text-center`}>Login</Text>

      <TextInput
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={tw`bg-blue-500 py-3 rounded-md mb-4`}
        onPress={handleLogin}
      >
        <Text style={tw`text-white text-center text-lg`}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={tw`text-blue-500 text-center`}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
