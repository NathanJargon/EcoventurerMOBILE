import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function LandPollution({ navigation }) {
  const [levelUnlocked, setLevelUnlocked] = useState(0);
  const [levelProgress, setLevelProgress] = useState([]);
  const [loading, setLoading] = useState(true); 
  const levelNames = ['Land Pollution', 'Recycling Wastes', 'Pollution'];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);

  const [trashes, setTrashes] = useState([]); 

  useEffect(() => {
    const fetchTrashes = async () => {
      const docRef = firebase.firestore().collection('lessons').doc('Air, Water, and Land Pollution');
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        if (data.trashes) {
          // Assuming you want to flatten the structure to an array of trashes
          const trashesArray = Object.entries(data.trashes).reduce((acc, [level, trashes]) => {
            // Add the level to each trash object
            const trashesWithLevel = trashes.map(trash => ({ ...trash, level }));
            return acc.concat(trashesWithLevel);
          }, []);
          setTrashes(trashesArray);
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchTrashes();
  }, []);

  /*
  const trashes = [
    { 
      name: 'Plastic Bottles', 
      level: 1, 
      description: 'While plastic bottles provide convenience and portability for beverages, when incorrectly discarded, they pose environmental difficulties, leading to pollution and resource depletion. Despite its benefits in terms of ease and durability, the impact on ecosystems and marine life highlights the importance of responsible usage and recycling in order to offset environmental harm.' 
    },
    { 
      name: 'Trash', 
      level: 2,
      description: 'The significance of waste management for cleanliness and disease prevention is apparent, but inappropriate disposal causes pollution and harm to animals. While responsible trash management contributes to a cleaner and healthier environment, the impact of irresponsible garbage disposal underlines the need of sustainable waste management strategies.'
    },
    { 
      name: 'Dirty Water', 
      level: 3,
      description: 'Clean water is essential for human health and environmental sustainability, yet unclean water is a hazard to both. Despite the benefit of guaranteeing community well-being, water pollution\'s environmental impact highlights the critical need for water conservation and pollution control methods.'
    },
    { 
      name: 'Car Exhaust', 
      level: 4,
      description: 'While vehicles are undeniably important in modern mobility, emissions from automotive exhaust contribute greatly to air pollution and climate change. While automobiles give benefits in terms of transportation efficiency, addressing the environmental effect necessitates efforts to promote cleaner technology and sustainable transportation alternatives.'
    },
    { 
      name: 'Unused Tires', 
      level: 5,
      description: 'Tires are necessary for safe transportation, but improper recycling poses environmental hazards such as habitat damage and pollution. Despite the benefit of improving road safety, the environmental effect of tire trash highlights the significance of efficient recycling and disposal techniques.'
    },
    { 
      name: 'Motorcycle Emission', 
      level: 6,
      description: 'Motorcycles are a fuel-efficient mode of transportation, but their emissions add to air pollution, which has an influence on both air quality and human health. While motorbikes provide advantages in terms of flexibility and efficiency, addressing the environmental effect necessitates the promotion of emission-reducing technologies and sustainable transportation methods.'
    },
    { 
      name: 'Used Facemask', 
      level: 7,
      description: 'Facemasks are essential for avoiding infectious illnesses, but inappropriate disposal endangers the environment. Despite the benefit of preserving public health, the impact of discarded facemasks highlights the importance of proper disposal procedures in order to reduce pollution and maintain ecosystems.'
    },
    { 
      name: 'Straws and Utensils', 
      level: 8,
      description: 'Straws and utensils are useful, but when discarded carelessly, they add to plastic pollution. While providing benefits in terms of hygiene and convenience, the environmental effect emphasizes the significance of adopting eco-friendly alternatives and supporting appropriate disposal practices.'
    },
    { 
      name: 'Plastic Bags', 
      level: 9,
      description: 'Plastic bags are convenient, but when not disposed of properly, they contribute to environmental degradation and harm to animals. Despite their cost and lightweight design benefits, the environmental effect highlights the need for reduced single-use plastic use and enhanced recycling initiatives.'
    },
    { 
      name: 'Unused Appliances', 
      level: 10,
      description: 'Appliances improve contemporary living, yet inappropriate disposal as electronic trash contributes to pollution. Despite the convenience and efficiency benefits, addressing the environmental effect necessitates responsible e-waste management, recycling activities, and sustainable product design.'
    }
  ];
  
  useEffect(() => {
    const sendTrashesToFirebase = async () => {
      const lessonsRef = firebase.firestore().collection('lessons').doc('Air, Water, and Land Pollution');
      
      // Transforming trashes array to a map with level as key and array of {name, description} as value
      const trashesMap = trashes.reduce((acc, {level, name, description}) => {
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push({name, description});
        return acc;
      }, {});

      try {
        await lessonsRef.set({ trashes: trashesMap }, { merge: true });
        console.log('Trashes data sent successfully');
      } catch (error) {
        console.error('Error sending trashes data:', error);
      }
    };

    sendTrashesToFirebase();
  }, []);

  */

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const user = firebase.auth().currentUser;
        if (user) {
          const doc = await firebase.firestore().collection('users').doc(user.email).get();
          if (doc.exists) {
            const userData = doc.data();
            setLevelUnlocked(userData.levelUnlocked);
            setLevelProgress(userData.levelProgress || []);
            setCurrentChallenge(userData.currentChallenge || 0);
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No user is signed in!');
        }
        setLoading(false); 
      };
      fetchUserData();
    }, [])
  );

  /*
  const isFocused = useIsFocused();

  useEffect(() => {
    let timerId = null; 
  
    if (isFocused && levelProgress[0] >= 10 && !isModalVisible) {
      timerId = setInterval(() => setIsModalVisible(true), 300000);
      const updateProgress = async () => {
        await saveProgress(0, levelProgress[0]);
      };
      updateProgress();
    }
  
    return () => {
      clearInterval(timerId); 
    };
  }, [levelProgress, isModalVisible, isFocused]);
  */

  const handleButtonClick = () => {
    if (levelProgress[0] >= 10) {
      setIsModalVisible(true);
    }
  };

  const saveProgress = async (level, progress) => {
    const user = firebase.auth().currentUser;
    const newLevelProgress = [...levelProgress];
    if (newLevelProgress[level] !== progress) {
      newLevelProgress[level] = progress;
      setLevelProgress(newLevelProgress);
      if (level === 0 && progress >= 10) {
        setLevelUnlocked(1);
        await firebase.firestore().collection('users').doc(user.email).update({
          levelProgress: newLevelProgress,
          levelUnlocked: 1,
        });
      } else {
        await firebase.firestore().collection('users').doc(user.email).update({
          levelProgress: newLevelProgress,
        });
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          padding: 20,
          borderRadius: 10, 
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: width * 0.05, color: '#4fb2aa' }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.modalText, { fontSize: width * 0.1, marginBottom: 10, fontWeight: "bold", } ]}>Diary Complete!</Text>
              <Text style={[ styles.modalText, { fontSize: width * 0.075, marginBottom: 30, } ]}> Proceed to Quiz</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={styles.buttonYes}
                  onPress={() => {
                    navigation.navigate('Quiz');
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonTextYes}>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonNo}
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonTextNo}>NO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </Modal>

        <View style={styles.header}>
          <Image
            source={require('../../assets/header.png')}
            style={styles.image}
          />
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Game')}>
              <Image
                source={require('../../assets/round-back.png')}
                style={styles.backButtonImage}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Go Back</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity 
            onPress={levelProgress[0] >= 10 ? handleButtonClick : null} 
            style={{ 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexDirection: 'row', 
              backgroundColor: '#4fb2aa', 
              padding: 10,
              width: width * 0.8, 
              height: height * 0.075, 
              borderRadius: 20, 
              opacity: levelProgress[0] >= 10 ? 1 : 0.5
            }}
            disabled={levelProgress[0] < 10}
          >
            <Image
              source={require('../../assets/icons/completed.png')} 
              style={{ width: 30, height: 30, marginRight: 5 }} 
            />
            <Text style={{ marginLeft: 5, color: '#fff' }}>{levelProgress[0] >= 10 ? 'Press to take quiz!' : 'Finish all challenges to take quiz!'}</Text>
          </TouchableOpacity>
          </View>
        </View>


      <Text style={styles.labelText}>Accomplish the following challenges:</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
      {[...Array(10)].map((_, index) => {
      const playButtonStyle = {
        margin: 15,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#4fb2aa',
        width: '90%',
        height: '10%',
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        padding: 10,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.005,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      };

      return (
        <TouchableOpacity
          key={index}
          style={playButtonStyle}
          onPress={() => {
            if (index < levelProgress[0] ) {
              Alert.alert(
                'Rechallenge?',
                'You have already completed this challenge. Would you try again?\nWarning: This will increase your progress level.',
                [
                  {
                    text: 'No',
                    onPress: () => null,
                    style: 'cancel',
                  },
                    {
                      text: 'Yes',
                      onPress: () => navigation.navigate('Camera', { 
                        object: { 
                          challengeNumber: index + 1, 
                          trash: trashes[index], 
                          description: trashes[index].description 
                        }, 
                        trashes: trashes 
                      }),
                    },
                ]
              );
            } else if (index <= levelProgress[0]) {
              navigation.navigate('Camera', { object: { challengeNumber: index + 1, trash: trashes[index], description: trashes[index].description }, trashes: trashes });
            } else {
              Alert.alert('Locked', `Finish Challenge #${index} to unlock this challenge.`);
            }
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.playButtonText}>{`Challenge #${index + 1}`}</Text>
          </View>
          {index < levelProgress[0] && (
            <Image
              source={require('../../assets/icons/completed.png')} 
              style={styles.completedIcon} 
            />
          )}
        </TouchableOpacity>
      );
    })}
    </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  buttonYes: {
    backgroundColor: '#4fb2aa',
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 20,
    padding: 15, 
    width: '45%', 
    alignItems: 'center',
    justifyContent: 'center', 
    margin: 10,
  },
  buttonNo: {
    backgroundColor: 'white',
    borderColor: '#4fb2aa',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15, 
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  buttonTextYes: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  buttonTextNo: {
    color: '#4fb2aa',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    textAlign: 'center',
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
    },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButtonImage: {
    width: 50,
    height: 50,
  },
  completedIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  header: {
    height: '23%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  boxImage: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    width: '50%',
    height: '100%',
    resizeMode: 'cover',
  },
  challengesText: {
    textAlign: 'center',
    color: 'white',
  },
  labelText: {
    color: '#3b5a9d',
    marginTop: 30,
    margin: 10,
  },
  textContainer: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    width: '85%',
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
});