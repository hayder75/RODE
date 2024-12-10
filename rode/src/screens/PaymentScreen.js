import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import tw from 'tailwind-react-native-classnames';
import axiosInstance from '../../axiosInstance'; // Adjust path as necessary
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'You need to grant permission to access your media library.');
      }
    })();
  }, []);

  const pickImage = async () => {
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images], // Use MediaType directly
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Use result.assets[0].uri for Expo ImagePicker
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please attach a payment screenshot.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token'); // Get user token for authorization
      
      if (!token) {
        Alert.alert('Error', 'You must be logged in to submit a payment.');
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        name: 'payment_screenshot.jpg',
        type: 'image/jpeg',
      });

      // Send image to server
      const response = await axiosInstance.post('/upload-payment-screenshot', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
      });

      console.log('Payment submitted:', response.data);
      Alert.alert('Success', 'Payment submitted! Waiting for admin approval.');

      // Navigate back to HomeScreen
      navigation.navigate('HomeScreen', { hasPaid: false }); // Set hasPaid as false until verified
    } catch (error) {
      console.error(error);
      
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'There was an error submitting your payment. Please try again.');
      } else {
        Alert.alert('Error', 'Network error. Please check your connection and try again.');
      }
    }
  };

  return (
    <View style={tw`flex-1 bg-white justify-center items-center px-6`}>
      <Text style={tw`text-2xl font-bold mb-8`}>Payment Verification</Text>

      {/* Button to Attach File */}
      <TouchableOpacity
        style={tw`bg-blue-500 py-3 px-6 rounded-md mb-4`}
        onPress={pickImage}
      >
        <Text style={tw`text-white text-lg`}>Attach Payment Screenshot</Text>
      </TouchableOpacity>

      {/* Display Selected Image */}
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={tw`w-64 h-64 rounded-md mb-4`}
        />
      )}

      {/* Submit Payment Button */}
      <TouchableOpacity
        style={tw`bg-green-500 py-3 px-6 rounded-md`}
        onPress={handleSubmitPayment}
      >
        <Text style={tw`text-white text-lg`}>Submit Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;
