import React, { useState, useEffect } from 'react';
import { Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ navigation }) {
  const [levelUnlocked, setLevelUnlocked] = useState(0);
  const [levelProgress, setLevelProgress] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = firebase.auth().currentUser;
      const doc = await firebase.firestore().collection('users').doc(user.uid).get();
      const userData = doc.data();
      setLevelUnlocked(userData.levelUnlocked);
      setLevelProgress(userData.levelProgress || []);
    };
    fetchUserData();
  }, []);

  const saveProgress = async (level, progress) => {
    const user = firebase.auth().currentUser;
    const newLevelProgress = [...levelProgress];
    newLevelProgress[level] = progress;
    setLevelProgress(newLevelProgress);
    await firebase.firestore().collection('users').doc(user.uid).update({
      levelProgress: newLevelProgress,
    });
  };

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

      {[...Array(3)].map((_, index) => (
      <TouchableOpacity
        key={index}
          style={[
            styles.playButton,
            { opacity: index <= levelUnlocked ? 1 : 0.5 },
          ]}
          onPress={() => {
            if (index <= levelUnlocked) {
              // navigate to the game
              // when the game is finished, call saveProgress(index, newProgress)
            } else {
              Alert.alert('Locked', `Finish set ${index} to unlock this set.`);
            }
          }}
        >
          <Image source={require('./assets/bg1.jpg')} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.playButtonText}>Land Pollution</Text>
            <Text style={styles.challengesText}>
              {index <= levelUnlocked ? `${levelProgress[index] || 0}/10 Challenges` : `Finish set ${index} to unlock`}
            </Text>
          </View>
      </TouchableOpacity>
    ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  textContainer: {
    justifyContent: 'center', // to center the text vertically
  },
  playButton: {
    flexDirection: 'row',
    backgroundColor: '#3b5a9d',
    width: '75%',
    height: '12%',
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