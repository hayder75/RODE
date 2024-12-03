import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import tw from 'tailwind-react-native-classnames';

const PaymentScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImage = async () => {
    // Request permission to access the device's media
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  const handleSubmitPayment = () => {
    if (!selectedImage) {
      alert('Please attach a payment screenshot.');
      return;
    }

    // Simulate sending the image for verification
    console.log('Payment submitted with file:', selectedImage);
    alert('Payment submitted! Waiting for admin approval.');

    // Navigate back to HomeScreen
    navigation.navigate('HomeScreen', { hasPaid: true });
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
