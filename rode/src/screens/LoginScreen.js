import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../../axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../Untitled_design-removebg.png'; // Adjust path as needed

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!phoneNumber.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axiosInstance.post('/login', { phoneNumber, password });
      await AsyncStorage.setItem('token', response.data.token);
      navigation.navigate('Homescreen', {
        name: response.data.name,
        hasPaid: response.data.hasPaid,
        stream: response.data.stream,
        token:response.data.token,
        id:response.data.id,
      });
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Error logging in');
      } else if (error.request) {
        setErrorMessage('Network error: No response received');
      } else {
        setErrorMessage('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-white justify-center px-6`}>
      {/* PNG Logo */}
      <View style={styles.logoContainer}>
        <Image source={Logo} style={{ width: 400, height: 400 }} />
      </View>

      <Text style={tw`text-3xl font-bold mb-8 text-center`}>Login</Text>

      {errorMessage ? (
        <Text style={tw`text-red-500 text-center mb-4`}>{errorMessage}</Text>
      ) : null}

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
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={tw`text-white text-center text-lg`}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={tw`text-blue-500 text-center`}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default LoginScreen;
