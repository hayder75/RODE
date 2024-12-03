import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

const YearSelectionScreen = ({ route }) => {
  const navigation = useNavigation();
  const { subject } = route.params; // Get selected subject

  const years = ['2023', '2022', '2021'];

  const handleYearClick = (year) => {
    navigation.navigate('TestScreen', { subject, year });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Text style={tw`text-2xl font-bold text-center my-4`}>
        {subject} - Choose Year
      </Text>
      <FlatList
        data={years}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`border border-gray-300 py-3 rounded-md mx-4 mb-4`}
            onPress={() => handleYearClick(item)}
          >
            <Text style={tw`text-center text-lg`}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default YearSelectionScreen;
