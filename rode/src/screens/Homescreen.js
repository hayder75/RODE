import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
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

  const renderSubject = ({ item }) => (
    <View style={tw`flex-1 px-2 mb-4`}>
      <TouchableOpacity
        style={tw`bg-blue-500 p-4 rounded-lg flex justify-center items-center`}
        onPress={() => navigation.navigate('YearSelectionScreen', { subject: item, stream })}
      >
        <Text style={tw`text-white text-center text-lg`}>{item}</Text>
      </TouchableOpacity>
      {!hasPaid && (
        <MaterialIcons name="lock" size={24} color="white" style={tw`absolute top-2 right-2`} />
      )}
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Top Section */}
      <View style={tw`px-6 py-4`}>
        <Text style={tw`text-xl font-bold text-center mb-4`}>Hello, {name}!</Text>
        <TouchableOpacity
          style={tw`bg-gray-300 py-2 px-4 rounded-md`}
          onPress={handleLogout}
        >
          <Text style={tw`text-blue-500 text-center text-sm`}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Middle Section */}
      <View style={tw`flex-1 px-6`}>
        {/* Subjects Display (3 in a row) */}
        <FlatList
          data={subjects}
          renderItem={renderSubject}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          columnWrapperStyle={tw`justify-between`}
        />

        {/* Payment Button */}
        {!hasPaid && (
          <TouchableOpacity
            style={tw`bg-red-500 py-3 rounded-md mt-6 mb-4`}
            onPress={() => navigation.navigate('PaymentScreen')}
          >
            <Text style={tw`text-white text-center text-lg`}>Pay 150 Birr</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Footer/Navigation area */}
      <View style={tw`px-6 py-2`}>
        <TouchableOpacity
          style={tw`bg-gray-300 py-2 px-4 rounded-md`}
          onPress={() => navigation.navigate('AnotherScreen')} // Example of another navigation if needed
        >
          <Text style={tw`text-center text-blue-500 text-sm`}>Go to Another Screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
