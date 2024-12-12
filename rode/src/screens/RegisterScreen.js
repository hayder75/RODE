import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../../axiosInstance'; // Adjust the path as needed
import Logo from '../../src/Untitled design.png'; // Adjust path as needed

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [stream, setStream] = useState('');
  const [school, setSchool] = useState('');
  const [streamVisible, setStreamVisible] = useState(false);

  const streams = ['Natural', 'Social'];

  const handleStreamSelect = (selectedStream) => {
    setStream(selectedStream);
    setStreamVisible(false);
  };

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post('/register', {
        name,
        phoneNumber,
        password,
        stream, // Backend maps stream to role
        school,
      });

      alert('Registration successful!');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <View style={tw`flex-1 bg-white justify-center px-6`}>
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
      </View>

      <Text style={tw`text-3xl font-bold mb-8 text-center`}>Register</Text>

      {/* First Name Input */}
      <TextInput
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      {/* Phone Number Input */}
      <TextInput
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Password Input */}
      <TextInput
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Stream Selection */}
      <TouchableOpacity
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        onPress={() => setStreamVisible(!streamVisible)}
      >
        <Text style={tw`text-gray-700`}>{stream ? `Stream: ${stream}` : 'Select Stream'}</Text>
      </TouchableOpacity>

      {/* Dropdown for Stream Options */}
      {streamVisible && (
        <View style={tw`absolute bg-white border border-gray-300 rounded-md mt-2 w-full`}>
          <FlatList
            data={streams}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`p-4`}
                onPress={() => handleStreamSelect(item)}
              >
                <Text style={tw`text-gray-700`}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      {/* School Input */}
      <TextInput
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        placeholder="School"
        value={school}
        onChangeText={setSchool}
      />

      {/* Register Button */}
      <TouchableOpacity
        style={tw`bg-blue-500 py-3 rounded-md mb-4`}
        onPress={handleRegister}
      >
        <Text style={tw`text-white text-center text-lg`}>Register</Text>
      </TouchableOpacity>

      {/* Navigate to Login Screen */}
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={tw`text-blue-500 text-center`}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 300, // Adjust this to make the logo smaller
    height: 300, // Adjust this to make the logo smaller
  },
});

export default RegisterScreen;
