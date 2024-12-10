import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../../axiosInstance'; // Adjust path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { name, hasPaid, stream } = route.params || {}; // Get name, payment status, and stream from route params
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/subjects', { params: { stream } });
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error(error);
        Alert.alert('Error fetching subjects');
      }
    };

    if (stream) {
      fetchSubjects();
    }
  }, [stream]);

  const handleLogout = async () => {
    // Clear token and navigate to login screen
    await AsyncStorage.removeItem('token');
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
        {/* Check Payment Status */}
        {!hasPaid ? (
          <Text style={tw`text-red-500 text-lg text-center mb-4`}>
            Your tests are locked until payment is made.
          </Text>
        ) : (
          subjects.map((subject) => (
            <TouchableOpacity
              key={subject}
              style={tw`bg-blue-500 py-3 rounded-md mb-4`}
              onPress={() => navigation.navigate('SubjectListScreen', { stream, subject })}
            >
              <Text style={tw`text-white text-center text-lg`}>{subject}</Text>
            </TouchableOpacity>
          ))
        )}

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
