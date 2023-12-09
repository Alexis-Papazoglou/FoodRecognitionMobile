import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access media library was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        console.log('Image selected successfully');
        const imageUri = result.uri || (result.assets && result.assets.length > 0 && result.assets[0].uri);

        setSelectedImage(imageUri);
      } else {
        console.error('Image selection cancelled');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const handleUpload = async () => {
    try {
      if (!selectedImage) {
        console.error('No image selected');
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage,
        name: 'image.jpg',
        type: 'image/jpg',
      });

      const response = await fetch('http://10.0.2.2:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Image uploaded successfully');
        const result = await response.json();
        console.log(result);
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  const handleHello = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/hello');
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error('Failed to fetch /hello');
      }
    } catch (error) {
      console.error('Error fetching /hello:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Image Uploader</Text>
      <Button title="Select Image" onPress={handleImageUpload} />
      <Button title="Hello" onPress={handleHello} />

      {selectedImage && (
        <>
          <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
          <Button title="Upload Image" onPress={handleUpload} />
        </>
      )}
    </View>
  );
}
