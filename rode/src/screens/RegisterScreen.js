import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [stream, setStream] = useState('');
  const [streamVisible, setStreamVisible] = useState(false);

  const streams = ['Natural', 'Social'];

  const handleStreamSelect = (selectedStream) => {
    setStream(selectedStream);
    setStreamVisible(false); // Hide the options after selection
  };

  const handleRegister = () => {
    console.log('Registering with:', { firstName, lastName, phoneNumber, password, stream });
    setStreamVisible(false)
    // Clear the input fields
    setFirstName('');
    setLastName('');
    setPhoneNumber('');
    setPassword('');
    setStream('');
  };
  

  return (
    <View style={tw`flex-1 bg-white justify-center px-6`}>
      <Text style={tw`text-3xl font-bold mb-8 text-center`}>Register</Text>

      {/* First Name Input */}
      <TextInput
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Last Name Input */}
      <TextInput
        style={tw`border border-gray-300 rounded-md p-4 mb-4`}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
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

export default RegisterScreen;
