import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { GLView } from 'expo-gl';

const App = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const onContextCreate = async (gl) => {
    const formData = new FormData();
    formData.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    try {
      let response = await fetch('https:///predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error('Error sending image to model:', error);
    }
  };


  const pickImage = async () => {
    // Implement image picking logic using Expo ImagePicker
  };

  return (
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <GLView style={{ width: 200, height: 200 }} onContextCreate={onContextCreate} />
      {prediction && <Text>{JSON.stringify(prediction)}</Text>}
    </View>
  );
};

export default App;
