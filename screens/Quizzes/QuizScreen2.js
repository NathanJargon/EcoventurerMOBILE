import React, { useState, useEffect } from 'react';
import { Alert, Animated, Modal, StyleSheet, Text, Button, Image, View, Platform, Dimensions, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { firebase } from '../FirebaseConfig';

const { width, height } = Dimensions.get('window');

const questions = [
  {
    questionText: 'Why is it important to put a plastic bottle inside the trashcan?',
    choices: [
      'To continue polluting our environment due to landfills.',
      'To keep our surroundings clean and recycled properly.',
      'To let it degrade over time.',
      'To create more plastic bottles and be reused by production companies.'
    ],
    correctAnswer: 'To keep our surroundings clean and be recycled properly.'
  },
  {
    questionText: 'What items go into a biodegradable trashcan?',
    choices: [
      'Items that can naturally break down over time, like food scraps and some paper products.',
      'Items that can be recycled such as plastic bottles and containers.',
      'Technology devices such as computers, mouse, keyboard, etc.',
      'No items should be put into a biodegradable trashcan.'
    ],
    correctAnswer: 'Items that can naturally break down over time, like food scraps and some paper products.'
  },
  {
    questionText: 'What can you do with unused boxes?',
    choices: [
      'To be used as fire starters when burning fallen leaves or dead plants.',
      'To be used as traps for mice.',
      'You can reuse unused boxes for storage, crafts, or even play.',
      'To be hidden away and not be used again.'
    ],
    correctAnswer: 'You can reuse unused boxes for storage, crafts, or even play.'
  },
  {
    questionText: 'Why is it good to use a reusable bag instead of a plastic bag?',
    choices: [
      'There is no good in using reusable bags instead of plastic bags.',
      'Help reduce the need for single-use plastic bags and recycle/reuse bags for future shopping.',
      'To collect more reusable bags whenever buying outside.',
      'It is good as reusable bags also create more profit.'
    ],
    correctAnswer: 'Help reduce the need for single-use plastic bags and recycle/reuse bags for future shopping.'
  },
  {
    questionText: 'What is the simplest way to reduce waste at home?',
    choices: [
      'To throw every waste away without segregating.',
      'Recycle materials even if they are not recyclable.',
      'Dump waste outside the house.',
      'Recycle materials such as paper, cardboard, and plastics.'
    ],
    correctAnswer: 'Recycle materials such as paper, cardboard, and plastics.'
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

  /*
  useEffect(() => {
    const sendQuizToFirebase = async () => {
      const lessonsRef = firebase.firestore().collection('quizzes').doc('Quiz3');
      
      // Assuming `trashes` should be replaced with `questions` as `trashes` is not defined in the provided context
      const questionsMap = questions.reduce((acc, item, index) => {
        const { questionText, choices, correctAnswer } = item;
        acc[`Question${index + 1}`] = { questionText, choices, correctAnswer };
        return acc;
      }, {});

      try {
        await lessonsRef.set({ questions: questionsMap }, { merge: true });
        console.log('Quiz data sent successfully');
      } catch (error) {
        console.error('Error sending quiz data:', error);
      }
    };

    sendQuizToFirebase();
  }, []);
  */

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
                  { text: "Yes", onPress: () => navigation.navigate('Pollution') }
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

      <Text style={styles.labelText}>Quiz: Recycling</Text>

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