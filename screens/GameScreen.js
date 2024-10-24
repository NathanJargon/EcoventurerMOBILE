import React, { useState, useEffect } from 'react';
import { Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import stage1 from '../assets/stage1.png';
import stage2 from '../assets/stage2.png';
import stage3 from '../assets/stage3.png';
import * as Progress from 'react-native-progress';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ navigation }) {
  const [levelUnlocked, setLevelUnlocked] = useState(0);
  const [levelProgress, setLevelProgress] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [loading, setLoading] = useState(true); 
  const levelToScreenMapping = {
    'Air, Water, and Land Pollution': { screen: 'Land Pollution', image: stage1 },
    'Animals and Plants': { screen: 'Pollution', image: stage2 },
    'Recycling Wastes': { screen: 'Recycling Wastes', image: stage3 },
  };
  const levelNames = Object.keys(levelToScreenMapping);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const doc = await firebase.firestore().collection('users').doc(user.email).get();
        if (doc.exists) {
          const userData = doc.data();
          let unlockedLevel = userData.levelUnlocked;
          const progress = (userData.levelProgress || []).map(challengesCompleted => 
            Math.min(challengesCompleted, 10)
          );
  
          // Check if the next set should be unlocked
          progress.forEach((challengesCompleted, index) => {
            if (challengesCompleted === 10 && index === unlockedLevel) {
              unlockedLevel = index + 1; // Unlock the next set
            }
          });
  
          setLevelUnlocked(unlockedLevel);
          setLevelProgress(progress);
          setCurrentChallenge(userData.currentChallenge);
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
          source={require('../assets/header.png')}
          style={styles.image}
        />
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../assets/round-back.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Return</Text>
        </View>
      </View>

      {[...Array(3)].map((_, index) => {
        const playButtonStyle = {
          margin: 10,
          paddingLeft: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: index <= levelUnlocked ? '#4fb2aa' : 'rgba(79, 178, 170, 0.5)',
          width: '90%',
          height: '20%',
          alignSelf: 'center',
          borderRadius: 20,
          overflow: 'hidden',
          padding: 10,
          elevation: 5,
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

        const progress = (levelProgress[index] || 0) / 10;
        const progressPercentage = Math.round(progress * 100);

        return (
          <TouchableOpacity
            key={index}
            style={playButtonStyle}
            onPress={() => {
              if (index <= levelUnlocked) {
                navigation.navigate(levelToScreenMapping[levelNames[index]].screen);
              } else {
                Alert.alert('Locked', `Finish Set ${index} to unlock this set.\nPlay more level on the current set.`);
              }
            }}
          >
            <Image source={levelToScreenMapping[levelNames[index]].image} style={styles.boxImage} />
            <View style={styles.textContainer}>
              <Text style={styles.playButtonText}>{levelNames[index]}</Text>
              <View style={styles.progressContainer}>
                <Progress.Bar 
                  progress={progress} 
                  width={100} 
                  color={'orange'} 
                  unfilledColor={'rgba(255, 255, 255, 0.5)'} 
                  borderWidth={0} 
                />
                <Text style={styles.progressText}>{`${progressPercentage}%`}</Text>
              </View>
            </View>
            {index > levelUnlocked && (
              <View style={styles.lockedOverlay}>
                <Text style={styles.lockedText}>
                  {`Finish Set ${index} to unlock`}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  lockedText: {
    marginBottom: 20,
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  backButtonImage: {
    width: 50,
    height: 50,
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
  textContainer: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  progressText: {
    marginLeft: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  playButton: {
    margin: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4fb2aa',
    width: '90%',
    height: '20%',
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
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.075,
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