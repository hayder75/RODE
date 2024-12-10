import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import axiosInstance from '../../axiosInstance'; // Adjust path as necessary
import tw from 'tailwind-react-native-classnames';

const YearSelectionScreen = ({ route, navigation }) => {
  const { subject } = route.params; // Get subject from route params
  const [years, setYears] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axiosInstance.get('/test-years', { params: { subject } });
        console.log('Years API Response:', response.data);

        // Check if years are returned or if there is an error message
        if (response.data.years && response.data.years.length > 0) {
          setYears(response.data.years);
          setErrorMessage(''); // Clear any previous error message
        } else {
          setErrorMessage('Tests not uploaded yet for this subject.'); // Set error message
        }
      } catch (error) {
        setErrorMessage('Tests not uploaded yet for this subject.'); // Set error message
      }
    };

    fetchYears();
  }, [subject]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <Text style={tw`text-2xl font-bold text-center my-4`}>
        Select Year for {subject}
      </Text>

      {/* Display error message if any */}
      {errorMessage ? (
        <Text style={tw`text-red-500 text-center my-4`}>{errorMessage}</Text>
      ) : (
        <FlatList
          data={years}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tw`border border-gray-300 py-3 rounded-md mx-4 mb-4`}
              onPress={() => navigation.navigate('TestScreen', { subject, year: item })} // Navigate to TestScreen with subject and year
            >
              <Text style={tw`text-center text-lg`}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default YearSelectionScreen;
