import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../../axiosInstance'; // Adjust path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons'; // For lock icon

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { name, hasPaid, stream } = route.params || {}; // Get name, payment status, and stream from route params
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/subjects', { params: { stream } });
        console.log('API Response:', response.data);
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
        {/* Display Subjects */}
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <View key={subject} style={tw`flex-row justify-between items-center mb-4`}>
              <TouchableOpacity
                style={tw`bg-blue-500 py-3 rounded-md flex-1 mr-2`}
                onPress={() => navigation.navigate('YearSelectionScreen', { subject, stream })} // Pass subject and stream
                // disabled={!hasPaid}
              >
                <Text style={tw`text-white text-center text-lg`}>{subject}</Text>
              </TouchableOpacity>
              {!hasPaid && (
                <MaterialIcons name="lock" size={24} color="white" style={tw`ml-2`} />
              )}
            </View>
          ))
        ) : (
          <Text style={tw`text-center text-lg`}>No subjects available</Text>
        )}

        {/* Payment Button */}
        {!hasPaid && (
          <TouchableOpacity
            style={tw`bg-red-500 py-3 rounded-md mt-4`}
            onPress={() => navigation.navigate('PaymentScreen')}
          >
            <Text style={tw`text-white text-center text-lg`}>150 Birr Pay</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
