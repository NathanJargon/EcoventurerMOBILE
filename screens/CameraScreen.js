import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Button, Image, View, Platform, Dimensions, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ route, navigation }) {
  const { object } = route.params;
  const { challengeNumber, trash } = object;
  const { name, level } = trash;
  const [isCorrect, setIsCorrect] = useState(null);
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
  
    const takePhotoLocal = async () => {
      console.log("Starting takePhotoLocal function");
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.5,
        base64: true,
      });

      console.log("ImagePicker result:", result);

        if (!result.cancelled && result.assets[0].base64) {
          const imageData = result.assets[0].base64;

          // Send the image data to the server
          let formData = new FormData();
          formData.append('image', imageData);

          console.log("Sending POST request to server");

          return axios({
            method: "POST",
            url: "http://nashandrew.pythonanywhere.com/predict",
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(function(response) {
            console.log("API call was successful. Response data:", response.data);
            return response.data;
          })
          .catch(function(error) {
            console.error("Error occurred during the API call:", error.message);
            throw error;
          });
        } else {
          console.log("Image selection was cancelled or there was an error");
        }
    };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled && result.assets[0].uri) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      const image = `data:image/jpg;base64,${result.assets[0].base64}`;

      // Array to store the predictions from the three APIs
      const predictions = [];

      // First API call
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
        if (response.data.predictions.length > 0) {
          predictions.push(response.data.predictions[0].class.toLowerCase());
        }
      })
      .catch(function(error) {
        console.error(error.message);
      });

      // Second API call
      axios({
        method: "POST",
        url: "https://classify.roboflow.com/garbage-clasification/2",
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
        if (response.data.predictions.length > 0) {
          predictions.push(response.data.predictions[0].class.toLowerCase());
        }
      })
      .catch(function(error) {
        console.error(error.message);
      });

      // Third API call
      axios({
        method: "POST",
        url: "https://classify.roboflow.com/greenai-v2-v4sv0/2",
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
        if (response.data.predictions.length > 0) {
          predictions.push(response.data.predictions[0].class.toLowerCase());
        }

        // After all API calls have finished, compare the predictions to name
        if (predictions.includes(name.toLowerCase())) {
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      })
      .catch(function(error) {
        console.error(error.message);
      });
    } else {
      console.error('Image selection was cancelled or there was an error');
    }
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled && result.assets[0].uri) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      const image = `data:image/jpg;base64,${result.assets[0].base64}`;

      // Array to store the predictions from the three APIs
      const predictions = [];

      // First API call
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
        if (response.data.predictions.length > 0) {
          predictions.push(response.data.predictions[0].class.toLowerCase());
        }
      })
      .catch(function(error) {
        console.error(error.message);
      });

      // Second API call
      axios({
        method: "POST",
        url: "https://classify.roboflow.com/garbage-clasification/2",
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
        if (response.data.predictions.length > 0) {
          predictions.push(response.data.predictions[0].class.toLowerCase());
        }
      })
      .catch(function(error) {
        console.error(error.message);
      });

      // Third API call
      axios({
        method: "POST",
        url: "https://classify.roboflow.com/greenai-v2-v4sv0/2",
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
        if (response.data.predictions.length > 0) {
          predictions.push(response.data.predictions[0].class.toLowerCase());
        }

        // After all API calls have finished, compare the predictions to name
        if (predictions.includes(name.toLowerCase())) {
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      })
      .catch(function(error) {
        console.error(error.message);
      });
    } else {
      console.error('Image selection was cancelled or there was an error');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/header.png')}
          style={styles.image}
        />
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../assets/round-back.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Return</Text>
        </View>
      </View>

      <Text style={styles.labelText}>Challenge #{level ? level.toString() : 'N/A'}</Text>

      {image ? (
        <Image source={{ uri: image }} style={styles.playButton} />
      ) : (
        <TouchableOpacity style={styles.playButton} onPress={() => null }>
          <Text style={styles.playButtonText1}>Take a photo of:</Text>
          <Text style={styles.playButtonText2}>{name}</Text>
        </TouchableOpacity>
      )}

      {isCorrect !== null && (
        <Text style={[styles.judgeText, { color: isCorrect ? 'orange' : 'red' }]}>
          {isCorrect ? 'Congratulations! This is the right image.' : 'Oops. This seems to be the wrong item.'}
        </Text>
      )}

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: width * 0.1, }}>
        <TouchableOpacity style={styles.button1} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload a Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButtonImage: {
    width: 50,
    height: 50,
  },
  playButtonText1: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.035,
    paddingLeft: 10,
  },
  playButtonText2: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.1,
    alignSelf: 'center',
    marginTop: width * 0.125,
  },
  header: {
    height: '23%',
    width: '100%',
  },
  labelText: {
    color: '#3b5a9d',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginLeft: width * 0.1,
    marginBottom: 20,
  },
  judgeText: {
    textAlign: 'center',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginTop: 20,
  },
  playButton: {
    backgroundColor: '#4fb2aa',
    width: '75%',
    height: '25%',
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 10,
    alignItems: 'flex-start', 
    marginTop: height * 0.005,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  backButtonContainer: {
    position: 'absolute',
    top: height * 0.09,
    left: width * 0.075,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: '#4fb2aa',
    width: '55%',
    height: '8%',
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  headerText: {
    marginLeft: 10,
    fontSize: width * 0.075,
    color: 'white',
    fontWeight: 'bold'
  },
  button1: {
    backgroundColor: '#3b5a9d',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    margin: 10,
    elevation: 5,
    width: '80%',
    height: '20%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button2: {
    backgroundColor: '#ffa633',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    margin: 10,
    elevation: 5,
    height: '20%',
    width: '80%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
});