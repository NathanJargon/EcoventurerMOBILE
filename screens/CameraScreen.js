import React, { useState, useEffect } from 'react';
import { Text, Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function CameraScreen() {
  const [image, setImage] = useState(null);
  const [apiResult, setApiResult] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });
  
    if (!result.cancelled && result.assets[0].uri) {
      const image = `data:image/jpg;base64,${result.assets[0].base64}`;
  
      axios({
        method: "POST",
        url: "https://detect.roboflow.com/waste-classification-uwqfy/1",
        params: {
          api_key: "3QdxSGtdKAUtfOwAjkC4"
        },
        data: image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      .then(function(response) {
        console.log(response.data);
        setApiResult(response.data);
      })
      .catch(function(error) {
        console.error(error.message);
      });
    } else {
      console.error('Image selection was cancelled or there was an error');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {apiResult && <Text>{JSON.stringify(apiResult)}</Text>}
    </View>
  );
}