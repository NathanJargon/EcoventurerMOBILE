import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, Image, View, Dimensions, TouchableOpacity } from 'react-native';
import { firebase } from '../FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function QuizScreen({ navigation }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    const fetchQuizFromFirebase = async () => {
      const quizRef = firebase.firestore().collection('quizzes').doc('Quiz1');
  
      try {
        const doc = await quizRef.get();
        if (doc.exists) {
          const data = doc.data();
          console.log('Fetched data:', data);
  
          if (data.questions) {
            const fetchedQuestions = Object.keys(data.questions).map(key => data.questions[key]);
            console.log('Fetched questions:', fetchedQuestions);
            setQuestions(fetchedQuestions);
            setQuizQuestions(fetchedQuestions);
            setCurrentQuestion(fetchedQuestions[currentQuestionIndex]);
          } else {
            console.log('data.questions is undefined');
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };
  
    fetchQuizFromFirebase();
  }, []);
  
  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    } else if (questions.length > 0) {
      const incorrectRatio = incorrectAnswers / questions.length;
      console.log(incorrectRatio);
      if (incorrectRatio >= 0.5) { // Adjusted the threshold to 0.67
        Alert.alert(
          "Try Again!",
          "You have answered incorrectly 50% of the time. Would you like to try again?",
          [
            {
              text: "No",
              onPress: () => navigation.navigate('Land Pollution'),
              style: "cancel"
            },
            {
              text: "Yes",
              onPress: () => {
                setCurrentQuestionIndex(0);
                setIncorrectAnswers(0);
                setPoints(0);
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          "Quiz Completed!",
          `You did good! You earned ${points} points.`,
          [
            {
              text: "OK",
              onPress: () => navigation.navigate('Game')
            }
          ],
          { cancelable: false }
        );
      }
    }
  }, [currentQuestionIndex, questions, points, incorrectAnswers, navigation]);

  useEffect(() => {
    if (timeLeft === 0) {
      Alert.alert(
        "Time's Up!",
        "The quiz time is over. Would you like to try again?",
        [
          {
            text: "No",
            onPress: () => navigation.navigate('Land Pollution'),
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: () => {
              setCurrentQuestionIndex(0);
              setIncorrectAnswers(0);
              setPoints(0);
            }
          }
        ],
        { cancelable: false }
      );
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigation]);

  const handleAnswer = (choice) => {
    if (choice === currentQuestion.correctAnswer) {
      setPoints(prevPoints => prevPoints + 1);
    } else {
      setIncorrectAnswers(prevCount => prevCount + 1);
    }
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image
          source={require('../../assets/header.png')}
          style={styles.image}
        />
        <View style={[styles.backButtonContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
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
              source={require('../../assets/round-back.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Quiz Time</Text>
          <Text style={styles.levelText}>{`${currentQuestionIndex}/${questions.length}`}</Text>
        </View>
      </View>

      <Text style={styles.labelText}>Quiz: Pollution</Text>

      <Text style={styles.timerText}>Time Left: {formatTime(timeLeft)}</Text>

      <TouchableOpacity style={styles.playButton} onPress={() => null}>
        <Text style={styles.playButtonText2}>{currentQuestion?.questionText || "Loading question..."}</Text>
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: width * 0.01 }}>
        {currentQuestion && Array.isArray(currentQuestion.choices) && currentQuestion.choices.map((choice, index) => (
          <TouchableOpacity key={index} style={styles.button1} onPress={() => handleAnswer(choice)}>
            <Text style={styles.buttonText}>{choice}</Text>
          </TouchableOpacity>
        ))}
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
  timerText: {
    color: 'red',
    alignSelf: 'center',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: 20,
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
  buttonText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: 'bold',
  },
});