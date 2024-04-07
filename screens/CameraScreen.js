import React, { useState, useEffect } from 'react';
import { Animated, Modal, StyleSheet, Text, Button, Image, View, Platform, Dimensions, TouchableOpacity } from 'react-native';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isCorrect !== null) {
      const user = firebase.auth().currentUser;
      if (user) {
        const userRef = firebase.firestore().collection('users').doc(user.email);
        userRef.get().then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            if (userData.levelProgress[0] < 1) {
              userRef.update({
                levelProgress: [1, ...userData.levelProgress.slice(1)]
              });
            }
          } else {
            console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });
      }
    }
  }, [isCorrect]);

  const fadeInOut = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => fadeInOut());
  };

  useEffect(() => {
    fadeInOut();
  }, []);
  
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

    if (!result.cancelled) {
      if (!result.assets[0]) {
        console.log("No image was captured");
        setIsAnalyzing(false);
        return;
      }
    
      setIsAnalyzing(true);
      const { uri } = result.assets[0];
      const response = await fetch(uri);
      const blob = await response.blob();

      const imageName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ".jpg";

      const ref = firebase.storage().ref().child(imageName);
      await ref.put(blob);

      const imageUrl = await ref.getDownloadURL();

      let formData = new FormData();
      formData.append('image_url', imageUrl);
      formData.append('candidate_labels', 'paper,plastic,glass,metal,cardboard,compost,landfill,wood,textile,rubber,ceramic,leather,concrete,food,electronics');

      console.log("Sending POST request to server");

      const image = `data:image/jpg;base64,${result.assets[0].base64}`;
      setImage(image); 

      const predictions = [];

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
      
        ref.delete().then(function() {
          console.log("Image deleted from Firebase Storage");
        }).catch(function(error) {
          console.error("Error deleting image from Firebase Storage:", error.message);
        });
      
        if (response.data.labels) {
          const labels = response.data.labels.replace(/[()]/g, '').split(', ').map(label => label.replace(/['"]/g, ''));
          console.log('Labels:', labels); 

          if (labels.length > 0) {
            predictions.push(labels[0].toLowerCase());
          }

          console.log('Predictions:', predictions); 

          if (predictions.includes(name.toLowerCase())) {
            setIsCorrect(true);
          } else {
            setIsCorrect(false);
          }
          setIsAnalyzing(false);
        } else {
          console.log('Error: labels is undefined');
          setIsAnalyzing(false);
        }

        return response.data;
      })
      .catch(function(error) {
        console.error("Error occurred during the API call:", error.message);
        setIsAnalyzing(false);
        throw error;
      });
      
    } else {
      console.log("Image selection was cancelled or there was an error");
      setIsAnalyzing(false);
    }
  };


  const pickImageLocal = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
      base64: true,
    });

    console.log("ImagePicker result:", result);

    if (!result.cancelled) {
      if (!result.assets[0]) {
        console.log("No image was selected");
        setIsAnalyzing(false);
        return;
      }

      setIsAnalyzing(true);
      const { uri } = result.assets[0];
      const response = await fetch(uri);
      const blob = await response.blob();

      const imageName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ".jpg";

      const ref = firebase.storage().ref().child(imageName);
      await ref.put(blob);

      const imageUrl = await ref.getDownloadURL();

      let formData = new FormData();
      formData.append('image_url', imageUrl);
      formData.append('candidate_labels', 'paper,plastic,glass,metal,cardboard,compost,landfill,wood,textile,rubber,ceramic,leather,concrete,food,electronics');

      console.log("Sending POST request to server");

      const image = `data:image/jpg;base64,${result.assets[0].base64}`;
      setImage(image); 

      const predictions = [];

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
      
        ref.delete().then(function() {
          console.log("Image deleted from Firebase Storage");
        }).catch(function(error) {
          console.error("Error deleting image from Firebase Storage:", error.message);
        });
      
        if (response.data.labels) {
          const labels = response.data.labels.replace(/[()]/g, '').split(', ').map(label => label.replace(/['"]/g, ''));
          console.log('Labels:', labels); 

          if (labels.length > 0) {
            predictions.push(labels[0].toLowerCase());
          }

          console.log('Predictions:', predictions); 

          if (predictions.includes(name.toLowerCase())) {
            setIsCorrect(true);
          } else {
            setIsCorrect(false);
          }
          setIsAnalyzing(false);
        } else {
          console.log('Error: labels is undefined');
          setIsAnalyzing(false);
        }

        return response.data;
      })
      .catch(function(error) {
        console.error("Error occurred during the API call:", error.message);
        setIsAnalyzing(false);
        throw error;
      });
      
    } else {
      console.log("Image selection was cancelled or there was an error");
      setIsAnalyzing(false);
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

      const predictions = [];

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

      const predictions = [];

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAnalyzing}
        onRequestClose={() => {
          setIsAnalyzing(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Animated.Text style={{...styles.modalText, opacity: fadeAnim}}>
              Analyzing image using OpenAI...
            </Animated.Text>
          </View>
        </View>
      </Modal>
  
      <View style={styles.header}>
        <Image
          source={require('../assets/header.png')}
          style={styles.image}
        />
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Land Pollution')}>
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

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: width * 0.01, }}>
          {isCorrect === null ? (
            <>
              <TouchableOpacity style={styles.button1} onPress={takePhotoLocal}>
                <Text style={styles.buttonText}>Take a Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button2} onPress={pickImageLocal}>
                <Text style={styles.buttonText}>Upload a Photo</Text>
              </TouchableOpacity>
            </>
          ) : isCorrect ? (
            <>
              <TouchableOpacity style={[styles.button1, { height: '70%', } ]} onPress= { null }>
                <Text style={styles.buttonText}></Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ styles.button2, { height: '15%', } ]} onPress={ null }>
                <Text style={styles.buttonText}>NEXT CHALLENGE</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[ styles.button1, { marginTop: height * 0.21, height: '25%'} ]} onPress={() => {
              setIsCorrect(null); 
            }}>
              <Text style={styles.buttonText}>Retake another picture</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#4fb2aa",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
    modalText: {
      textAlign: "center",
      color: "white", 
      fontSize: 18, 
      fontWeight: "bold", 
    },
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