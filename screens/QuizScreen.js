import React, { useState, useEffect } from 'react';
import { Alert, Animated, Modal, StyleSheet, Text, Button, Image, View, Platform, Dimensions, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

const questions = [
  {
    questionText: 'Which of the following materials takes the longest to decompose in a landfill?',
    choices: ['Plastic', 'Paper', 'Glass', 'Metal'],
    correctAnswer: 'Plastic'
  },
  {
    questionText: 'What color bin is typically used for recycling?',
    choices: ['Blue', 'Green', 'Black', 'Red'],
    correctAnswer: 'Blue'
  },
  {
    questionText: 'Which of the following items is not recyclable?',
    choices: ['Glass bottles', 'Aluminum cans', 'Plastic bags', 'Newspaper'],
    correctAnswer: 'Plastic bags'
  },
  {
    questionText: 'What happens to recyclable items that are contaminated with food waste?',
    choices: ['They are still recycled', 'They are cleaned', 'They are composted', 'They are sent to a landfill'],
    correctAnswer: 'They are sent to a landfill'
  },
  {
    questionText: 'What is composting?',
    choices: ['Burning trash', 'Recycling', 'Decomposing organic material', 'Landfilling'],
    correctAnswer: 'Decomposing organic material'
  },
  {
    questionText: 'Which of the following items is compostable?',
    choices: ['Plastic bottle', 'Glass jar', 'Metal can', 'Banana peel'],
    correctAnswer: 'Banana peel'
  },
  {
    questionText: 'What is the process of converting waste materials into reusable materials?',
    choices: ['Composting', 'Landfilling', 'Recycling', 'Incineration'],
    correctAnswer: 'Recycling'
  },
  {
    questionText: 'Which of the following can be harmful if not disposed of properly?',
    choices: ['Cardboard', 'Food scraps', 'Plastic bags', 'Paper'],
    correctAnswer: 'Plastic bags'
  },
  {
    questionText: 'What is the term for the reduction of waste by not producing it in the first place?',
    choices: ['Recycling', 'Composting', 'Source reduction', 'Landfilling'],
    correctAnswer: 'Source reduction'
  },
  {
    questionText: 'Which of the following is a benefit of recycling?',
    choices: ['It contributes to global warming', 'It increases pollution', 'It conserves natural resources', 'It is more expensive than landfilling'],
    correctAnswer: 'It conserves natural resources'
  },
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
          source={require('../assets/header.png')}
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
          <Text style={styles.levelText}>{`${currentQuestionIndex + 1}/${questions.length}`}</Text>
        </View>
      </View>

      <Text style={styles.labelText}>Quiz: Land Pollution</Text>

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