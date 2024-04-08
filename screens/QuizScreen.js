import React, { useState, useEffect } from 'react';
import { Alert, Animated, Modal, StyleSheet, Text, Button, Image, View, Platform, Dimensions, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function QuizScreen({ navigation }) {
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


  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image
          source={require('../assets/header.png')}
          style={styles.image}
        />
        <View style={[styles.backButtonContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
          <TouchableOpacity onPress={() => {
              Alert.alert(
                "Stop Quiz",
                "If you stop the quiz, progress cannot be saved. Do you want to continue?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => navigation.navigate('Land Pollution') }
                ],
                { cancelable: false }
              );
            }}>
            <Image
              source={require('../assets/round-back.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Quiz Time</Text>
          <Text style={styles.levelText}>1/10</Text>
        </View>
      </View>

      <Text style={styles.labelText}>Quiz: Land Pollution</Text>

        <TouchableOpacity style={styles.playButton} onPress={() => null }>
          <Text style={styles.playButtonText2}>This is the question of the quiz!</Text>
        </TouchableOpacity>

      {isCorrect !== null && (
        <Text style={[styles.judgeText, { color: isCorrect ? 'orange' : 'red' }]}>
          {isCorrect ? 'Congratulations! This is the correct answer.' : 'Oops. This seems to be the wrong answer.'}
        </Text>
      )}

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: width * 0.01, }}>
          {isCorrect === null ? (
            <>
              <TouchableOpacity style={styles.button1} onPress={ null }>
                <Text style={styles.buttonText}>Choice 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button1} onPress={ null }>
                <Text style={styles.buttonText}>Choice 2</Text>
              </TouchableOpacity>
                <TouchableOpacity style={styles.button1} onPress={ null }>
                  <Text style={styles.buttonText}>Choice 3</Text>
                </TouchableOpacity>
              <TouchableOpacity style={styles.button1} onPress={ null }>
                <Text style={styles.buttonText}>Choice 4</Text>
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
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.055,
    alignSelf: 'center',
  },
  header: {
    height: '23%',
    width: '100%',
  },
  labelText: {
    color: '#3b5a9d',
    alignSelf: 'center',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  judgeText: {
    textAlign: 'center',
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginTop: 20,
  },
    playButton: {
      backgroundColor: '#f4f4f4',
      width: '85%',
      height: '25%',
      alignSelf: 'center',
      borderRadius: 20,
      overflow: 'hidden',
      justifyContent: 'center',
      padding: 20,
      alignItems: 'center',
      marginTop: height * 0.005,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.5, // Increased opacity
      shadowRadius: 5, // Increased radius
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
  levelText: {
    marginLeft: width * 0.225,
    fontSize: width * 0.05,
    color: 'white',
  },
  button1: {
    backgroundColor: '#4fb2aa',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    margin: 10,
    elevation: 5,
    width: '85%',
    height: '18%',
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