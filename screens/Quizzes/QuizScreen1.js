import React, { useState, useEffect } from 'react';
import { Alert, Animated, Modal, StyleSheet, Text, Button, Image, View, Platform, Dimensions, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { firebase } from '../FirebaseConfig';

const { width, height } = Dimensions.get('window');

const questions = [
  {
    questionText: 'What do birds use their beaks for?',
    choices: [
      'For flying.',
      'To show off for other birds when fighting.',
      'For eating, building nests, and sometimes for defending themselves.',
      'Destroying plants to and create their own nest.'
    ],
    correctAnswer: 'For eating, building nests, and sometimes for defending themselves.'
  },
  {
    questionText: 'What is the importance of Butterflies?',
    choices: [
      'To only lay unfertilized eggs.',
      'Help in plant reproduction and pollination.',
      'For decoration purposes only.',
      'To become food for other insects.'
    ],
    correctAnswer: 'Help in plant reproduction and pollination.'
  },
  {
    questionText: 'What is the purpose of a flower on a plant?',
    choices: [
      'To produce seeds for plant reproduction.',
      'Flowers do not have a purpose in the environment.',
      'Used as decoration for events (weddings, birthdays, or anniversaries)',
      'To lay eggs and turn into birds.'
    ],
    correctAnswer: 'To produce seeds for plant reproduction'
  },
  {
    questionText: 'Why do people keep plants indoors?',
    choices: [
      'To attract pests and gather dust.',
      'To attract good karma and money.',
      'To let it grow without providing the plant with water and sunlight.',
      'To keep plants indoors for decoration and improve air quality.'
    ],
    correctAnswer: 'To keep plants indoors for decoration and improve air quality'
  },
  {
    questionText: 'How can you take care of an indoor plant?',
    choices: [
      'Taking care of an indoor plant involves watering it regularly and placing it where it can get sunlight.',
      'By letting the plant grow and not provide its needs such as water and sunlight.',
      'By pouring chemicals to help with growth as alternatives to natural water.',
      'There is no way to take care of an indoor plant.'
    ],
    correctAnswer: 'Taking care of an indoor plant involves watering it regularly and placing it where it can get sunlight.'
  }
];

export default function QuizScreen({ navigation }) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [image, setImage] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(questions[currentQuestionIndex]);

  
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
      if (isCorrect) {
        if (currentQuestionIndex + 1 === questions.length) {
          Alert.alert(
            "Quiz Completed!",
            `You did good! You earned ${currentQuestionIndex + 1} points.`,
            [
              {
                text: "OK",
                onPress: () => navigation.navigate('Game')
              }
            ],
            { cancelable: false }
          );
        } else {
          setCurrentQuestionIndex(prevIndex => {
            const newIndex = prevIndex + 1;
            setCurrentQuestion(questions[newIndex]);
            return newIndex;
          });
          setCurrentQuestion(questions[currentQuestionIndex]);
          setIsCorrect(null);
        }
      }
    }
  }, [isCorrect]);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image
          source={require('../../assets/header.png')}
          style={styles.image}
        />
        <View style={[styles.backButtonContainer, {flexDirection: 'row', justifyContent: 'space-between'}]}>
          <TouchableOpacity onPress={() => {
              Alert.alert(
                "Are you going to leave?",
                "If you stop the quiz, progress cannot be saved. Do you want to continue?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => navigation.navigate('Recycling Wastes') }
                ],
                { cancelable: false }
              );
            }}>
            <Image
              source={require('../../assets/round-back.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Quiz Time</Text>
          <Text style={styles.levelText}>{`${currentQuestionIndex + 1}/${questions.length}`}</Text>
        </View>
      </View>

      <Text style={styles.labelText}>Quiz: Biodiversity</Text>

        <TouchableOpacity style={styles.playButton} onPress={() => null }>
          <Text style={styles.playButtonText2}>{currentQuestion.questionText}</Text>
        </TouchableOpacity>

      {isCorrect !== null && (
        <Text style={[styles.judgeText, { color: isCorrect ? 'orange' : 'red' }]}>
          {isCorrect ? 'Congratulations! This is the correct answer.' : 'Oops. This seems to be the wrong answer.'}
        </Text>
      )}

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: width * 0.01, }}>
        {isCorrect === null ? (
          <>
            {currentQuestion.choices.map((choice, index) => (
              <TouchableOpacity key={index} style={styles.button1} onPress={() => setIsCorrect(choice === currentQuestion.correctAnswer)}>
                <Text style={styles.buttonText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <TouchableOpacity style={[ styles.button1, { marginTop: height * 0.21, height: '25%'} ]} onPress={() => {
            setIsCorrect(null); 
          }}>
            <Text style={styles.buttonText}>Try again!</Text>
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
    fontSize: width * 0.04,
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
    marginTop: 5,
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
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
});