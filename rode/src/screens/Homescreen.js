import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { name, hasPaid } = route.params || {}; // Get name and payment status from route params

  const handleLogout = () => {
    // Add logout logic (e.g., clear token, navigate to login screen)
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Top Section */}
      <View style={tw`flex-row justify-between items-center px-6 py-4`}>
        <Text style={tw`text-2xl font-bold`}>Hello, {name}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={tw`text-blue-500`}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Middle Section */}
      <View style={tw`flex-1 justify-center px-6`}>
        {/* Social Button */}
        <TouchableOpacity
          style={tw`bg-blue-500 py-3 rounded-md mb-4`}
          onPress={() => navigation.navigate('SubjectListScreen', { stream: 'Social' })}
        >
          <Text style={tw`text-white text-center text-lg`}>Social</Text>
        </TouchableOpacity>

        {/* Natural Button */}
        <TouchableOpacity
          style={tw`bg-green-500 py-3 rounded-md mb-4`}
          onPress={() => navigation.navigate('SubjectListScreen', { stream: 'Natural' })}
        >
          <Text style={tw`text-white text-center text-lg`}>Natural</Text>
        </TouchableOpacity>

        {/* Payment Button (Conditionally Rendered) */}
        {!hasPaid && (
  <TouchableOpacity
    style={tw`bg-red-500 py-3 rounded-md`}
    onPress={() => navigation.navigate('PaymentScreen')}
  >
    <Text style={tw`text-white text-center text-lg`}>150 Birr Pay</Text>
  </TouchableOpacity>
)}

      </View>

      {/* Bottom Navigation Bar */}
      <View style={tw`border-t border-gray-300 py-2 px-6`}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Homescreen')}
          style={tw`flex-row justify-center`}
        >
          <Text style={tw`text-blue-500 text-center text-lg`}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
