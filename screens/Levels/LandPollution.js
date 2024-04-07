import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LandPollution({ navigation }) {
  const [levelUnlocked, setLevelUnlocked] = useState(0);
  const [levelProgress, setLevelProgress] = useState([]);
  const [loading, setLoading] = useState(true); 
  const levelNames = ['Land Pollution', 'Recycling Wastes', 'Pollution'];
  const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
    const fetchUserData = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const doc = await firebase.firestore().collection('users').doc(user.email).get();
        if (doc.exists) {
          const userData = doc.data();
          setLevelUnlocked(userData.levelUnlocked);
          setLevelProgress(userData.levelProgress || []);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user is signed in!');
      }
      setLoading(false); 
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log(levelProgress); 
    if (levelProgress[0] >= 10) {
      console.log('Setting isModalVisible to true'); 
      setIsModalVisible(true);
    }
  }, [levelProgress]);

  const saveProgress = async (level, progress) => {
    const user = firebase.auth().currentUser;
    const newLevelProgress = [...levelProgress];
    newLevelProgress[level] = progress;
    setLevelProgress(newLevelProgress);
    await firebase.firestore().collection('users').doc(user.email).update({
      levelProgress: newLevelProgress,
    });
  };

  const trashes = [
    { name: 'Plastic', level: 1 },
    { name: 'Glass', level: 2 },
    { name: 'Metal', level: 3 },
  ];

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

      <Text style={styles.labelText}>Accomplish the following challenges:</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 25 }}>
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
            if (levelProgress[0] >= 1 && index === 0) {
              Alert.alert(
                'Rechallenge?',
                'You have already completed this challenge. Would you try again?',
                [
                  {
                    text: 'No',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {
                    text: 'Yes',
                    onPress: () => navigation.navigate('Camera', { object: { challengeNumber: index + 1, trash: trashes[index] } }),
                  },
                ]
              );
            } else if (index <= levelUnlocked) {
              navigation.navigate('Camera', { object: { challengeNumber: index + 1, trash: trashes[index] } });
            } else {
              Alert.alert('Locked', `Finish Challenge #${index + 1} to unlock this challenge.`);
            }
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.playButtonText}>{`Challenge #${index + 1}`}</Text>
          </View>
          {levelProgress[0] >= 1 && index === 0 && (
            <Image
              source={require('../../assets/icons/completed.png')} 
              style={styles.completedIcon} 
            />
          )}
        </TouchableOpacity>
      );
    })}
    </ScrollView>
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