import React, { useState, useEffect } from 'react';
import { Alert, Animated, StyleSheet, Text, Image, View, Dimensions, TouchableOpacity } from 'react-native';
import { firebase } from '../FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function QuizScreen({ navigation }) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuizFromFirebase = async () => {
      const quizRef = firebase.firestore().collection('quizzes').doc('Quiz2');

      try {
        const doc = await quizRef.get();
        if (doc.exists) {
          const data = doc.data();
          console.log('Fetched data:', data);

          if (data.questions) {
            const fetchedQuestions = Object.keys(data.questions).map(key => data.questions[key]);
            console.log('Fetched questions:', fetchedQuestions);
            setQuestions(fetchedQuestions);
            setCurrentQuestion(fetchedQuestions[0]); // Initialize with the first question
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
    if (isCorrect !== null) {
      const user = firebase.auth().currentUser;
      if (user) {
        const userRef = firebase.firestore().collection('users').doc(user.email);
        userRef.get().then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            if (userData.levelUnlocked < 2) {
              userRef.update({
                levelUnlocked: 2
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
          setIsCorrect(null);
        }
      }
    }
  }, [isCorrect, questions, currentQuestionIndex, navigation]);
  

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

      {currentQuestion && (
        <TouchableOpacity style={styles.playButton} onPress={() => null}>
          <Text style={styles.playButtonText2}>{currentQuestion.questionText}</Text>
        </TouchableOpacity>
      )}

      {isCorrect !== null && (
        <Text style={[styles.judgeText, { color: isCorrect ? 'orange' : 'red' }]}>
          {isCorrect ? 'Congratulations! This is the correct answer.' : 'Oops. This seems to be the wrong answer.'}
        </Text>
      )}

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: width * 0.01 }}>
        {isCorrect === null && currentQuestion && Array.isArray(currentQuestion.choices) ? (
          <>
            {currentQuestion.choices.map((choice, index) => (
              <TouchableOpacity key={index} style={styles.button1} onPress={() => setIsCorrect(choice === currentQuestion.correctAnswer)}>
                <Text style={styles.buttonText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <TouchableOpacity style={[styles.button1, { marginTop: height * 0.21, height: '25%' }]} onPress={() => {
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