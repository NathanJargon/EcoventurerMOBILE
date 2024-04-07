import React, { useState, useEffect } from 'react';
import { Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
    useEffect(() => {
      const backAction = async () => {
        Alert.alert("Hold on!", "Are you sure you want to log out?", [
          {
            text: "No",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "Yes",
            onPress: async () => {
              await firebase.auth().signOut();

              // await AsyncStorage.clear();

              navigation.navigate('Login');
            }
          }
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, []);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/header.png')}
          style={styles.image}
        />
      </View>
      <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('Game')}>
        <Text style={styles.playButtonText}>Play Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Leaderboard')}>
        <Text style={styles.smallButtonText}>Leaderboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Diary')}>
        <Text style={styles.smallButtonText}>View Diaries</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Store')}>
        <Text style={styles.smallButtonText}>Store</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.smallButtonText}>Account Settings</Text>
      </TouchableOpacity>
      <Text style={styles.versionText}>Version 1.3.0</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: '30%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  playButton: {
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
   versionText: {
     position: 'absolute',
     right: 10,
     bottom: 10,
     color: '#000',
     fontSize: 14,
   },
});