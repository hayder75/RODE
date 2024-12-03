import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

const SubjectListScreen = ({ route }) => {
  const navigation = useNavigation();
  const { stream } = route.params; // Get selected stream

  // Subjects for each stream
  const subjects = stream === 'Social'
    ? ['History', 'Geography', 'Economics']
    : ['Biology', 'Physics', 'Chemistry'];

  const handleSubjectClick = (subject) => {
    navigation.navigate('YearSelectionScreen', { subject });
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <Text style={tw`text-2xl font-bold text-center my-4`}>
        {stream} Subjects
      </Text>
      <FlatList
        data={subjects}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`border border-gray-300 py-3 rounded-md mx-4 mb-4`}
            onPress={() => handleSubjectClick(item)}
          >
            <Text style={tw`text-center text-lg`}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SubjectListScreen;
