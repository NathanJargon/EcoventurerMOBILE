import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Pollution({ navigation }) {
  const [levelUnlocked, setLevelUnlocked] = useState(0);
  const [levelProgress, setLevelProgress] = useState([]);
  const [loading, setLoading] = useState(true); 
  const levelNames = ['Land Pollution', 'Recycling Wastes', 'Pollution'];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [trashes, setTrashes] = useState([]); 

  useEffect(() => {
    const fetchTrashes = async () => {
      const docRef = firebase.firestore().collection('lessons').doc('Animals and Plants');
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
      level: 1,
      name: 'Bird', 
      description: 'Birds play an important role in ecosystems by pollinating plants, controlling pests, and preserving biodiversity. While their existence enhances the beauty of nature, habitat degradation and pollution can have an influence on their populations, emphasizing the significance of conservation efforts.' 
    },
    { 
      level: 2,
      name: 'Butterfly', 
      description: 'Butterflies are important pollinators that help plants reproduce and preserve ecological equilibrium. Their vibrant and delicate presence adds to the aesthetic value of natural landscapes, but habitat loss and pesticide usage endanger their numbers, stressing the importance of conservation and sustainable practices.'
    },
    { 
      level: 3,
      name: 'Mango Tree', 
      description: 'Mango trees produce tasty and healthy fruits, which benefit agriculture and local economies. Despite their economic value and the pleasure they provide via fruit production, removing trees for agriculture can result in deforestation and biodiversity loss, emphasizing the necessity of sustainable agricultural techniques.'
    },
    { 
      level: 4,
      name: 'Indoor Plant', 
      description: 'Indoor plants increase air quality, beauty, and mental well-being by cleaning the air and connecting people to nature. Overwatering and incorrect maintenance can cause problems while improving the interior environment, stressing the significance of appropriate plant care techniques.'
    },
    { 
      level: 5,
      name: 'Outdoor Plant', 
      description: 'Outdoor plants help to conserve biodiversity, improve soil health, and maintain ecological stability. While they add to the beauty of outdoor places, invasive species and habitat degradation may be a problem, emphasizing the necessity of native plant cultivation and conservation efforts.'
    },
    { 
      level: 6,
      name: 'Flower', 
      description: 'Flowers serve an important role in pollination, helping many plant species reproduce. Flowers contribute delight and aesthetic value aside from their ecological role, but excessive harvesting and habitat loss can have an influence on both plant numbers and the cultural significance of flowers.'
    },
    { 
      level: 7,
      name: 'Grass', 
      description: 'Grass is an essential component of many ecosystems, providing habitat and food for a variety of animals. While contributing to landscape stability, overgrazing and monoculture practices can result in ecological imbalances, highlighting the significance of sustainable land management.'
    },
    { 
      level: 8,
      name: 'Leaves', 
      description: 'Photosynthesis, the process by which plants generate energy, requires leaves. Aside from their ecological importance, leaves add to the beauty of trees and plants. Deforestation and pollution, on the other hand, may have a detrimental influence on leafy ecosystems, stressing the importance of conservation efforts.'
    },
    { 
      level: 9,
      name: 'Cat', 
      description: 'Cats are popular pets because they provide companionship as well as pest management. Despite their beneficial functions in families, outdoor cats can represent a danger to local wildlife through hunting, emphasizing the significance of ethical pet ownership and biodiversity conservation initiatives.'
    },
    { 
      level: 10,
      name: 'Dog', 
      description: 'Dogs are well-known for their devotion and friendship, which contribute to human well-being. While they provide important assistance, poor dog waste disposal and unethical breeding methods can have negative environmental implications, emphasizing the significance of careful pet care.'
    }
  ];

  
  useEffect(() => {
    const sendTrashesToFirebase = async () => {
      const lessonsRef = firebase.firestore().collection('lessons').doc('Animals and Plants');
      
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

  useEffect(() => {
    console.log(levelProgress); 
    if (levelProgress[1] >= 10 && levelUnlocked !== 1) {
      console.log('Setting isModalVisible to true'); 
      setTimeout(() => setIsModalVisible(true), 200);
      const updateProgress = async () => {
        await saveProgress(0, levelProgress[1]);
      };
      updateProgress();
    }
  }, [levelProgress, levelUnlocked]);

  const saveProgress = async (level, progress) => {
    const user = firebase.auth().currentUser;
    const newLevelProgress = [...levelProgress];
    newLevelProgress[level] = progress;
    setLevelProgress(newLevelProgress);
    if (level === 0 && progress >= 10) {
      setLevelUnlocked(1);
      await firebase.firestore().collection('users').doc(user.email).update({
        levelProgress: newLevelProgress,
        levelUnlocked: 1, // Add this line
      });
    } else {
      await firebase.firestore().collection('users').doc(user.email).update({
        levelProgress: newLevelProgress,
      });
    }
  };

  const handleButtonClick = () => {
    if (levelProgress[0] >= 10) {
      setIsModalVisible(true);
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
                    navigation.navigate('Quiz1');
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
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity 
          onPress={levelProgress[1] >= 10 ? handleButtonClick : null} 
          style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexDirection: 'row', 
            backgroundColor: '#4fb2aa', 
            padding: 10,
            width: width * 0.8, 
            height: height * 0.075, 
            borderRadius: 20, 
            opacity: levelProgress[1] >= 10 ? 1 : 0.5
          }}
          disabled={levelProgress[1] < 10}
        >
          <Image
            source={require('../../assets/icons/completed.png')} 
            style={{ width: 30, height: 30, marginRight: 5 }} 
          />
          <Text style={{ marginLeft: 5, color: '#fff' }}>{levelProgress[1] >= 10 ? 'Press to take quiz!' : 'Finish all challenges to take quiz!'}</Text>
        </TouchableOpacity>
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
            if (index < levelProgress[1] ) {
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
                      onPress: () => navigation.navigate('Camera1', { 
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
            } else if (index <= levelProgress[1]) {
              navigation.navigate('Camera1', { object: { challengeNumber: index + 1, trash: trashes[index], description: trashes[index].description }, trashes: trashes });
            } else {
              Alert.alert('Locked', `Finish Challenge #${index} to unlock this challenge.`);
            }
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.playButtonText}>{`Challenge #${index + 1}`}</Text>
          </View>
          {index < levelProgress[1] && (
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