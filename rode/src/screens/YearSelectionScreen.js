import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../../axiosInstance'; // Adjust path as necessary

const YearSelectionScreen = ({ route, navigation }) => {
  const { subject, id, stream } = route.params; // Get subject, id, and stream from route params
  const [years, setYears] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error message
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [feedbackType, setFeedbackType] = useState('immediate'); // Immediate or end feedback

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
          console.error('No years found:', response.data);
          setErrorMessage('Tests not uploaded yet for this subject.'); // Set error message
        }
      } catch (error) {
        console.error('Error fetching years:', error.response ? error.response.data : error.message);
        setErrorMessage('Tests not uploaded yet for this subject.'); // Set error message
      }
    };

    fetchYears();
  }, [subject]);

  const startTest = async (subject, year) => {
    try {
      const response = await axiosInstance.post('/start-test', {
        userId: id,
        subject,
        year,
        stream, // Make sure to pass the stream
      });

      // Ensure the test session is created successfully
      if (response.data && response.data.progress) {
        console.log('Test session created successfully.');
        navigation.navigate('TestScreen', { subject, year, id, stream, feedbackType }); // Navigate to TestScreen with subject, year, and stream
      } else {
        console.error('Failed to create test session:', response.data);
        Alert.alert('Error', 'Failed to start the test. Please try again.');
      }
    } catch (error) {
      console.error('Error starting test:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to start the test. Please try again.');
    }
  };

  const handleYearPress = (year) => {
    setSelectedYear(year);
    setModalVisible(true);
  };

  const handleStartTest = () => {
    setModalVisible(false);
    startTest(subject, selectedYear);
  };

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
              onPress={() => handleYearPress(item)} // Show confirmation popup before starting test
            >
              <Text style={tw`text-center text-lg`}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal for starting the test */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Start Test for {subject} - Year {selectedYear}</Text>
            
            <Text style={styles.modalText}>Choose Feedback Type:</Text>
            <View style={styles.feedbackOptions}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  feedbackType === 'immediate' && styles.selectedOptionButton,
                ]}
                onPress={() => setFeedbackType('immediate')}
              >
                <Text
                  style={[
                    styles.optionText,
                    feedbackType === 'immediate' && styles.selectedOptionText,
                  ]}
                >
                  Immediate Feedback
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  feedbackType === 'end' && styles.selectedOptionButton,
                ]}
                onPress={() => setFeedbackType('end')}
              >
                <Text
                  style={[
                    styles.optionText,
                    feedbackType === 'end' && styles.selectedOptionText,
                  ]}
                >
                  End of Test Feedback
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleStartTest}>
                <Text style={styles.buttonText}>Start Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
  feedbackOptions: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  optionButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 5,
  },
  selectedOptionButton: {
    backgroundColor: '#1F2937',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedOptionText: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default YearSelectionScreen;
