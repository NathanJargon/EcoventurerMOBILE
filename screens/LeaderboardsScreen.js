import React, { useState, useEffect } from 'react';
import { ScrollView, FlatList, Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

export default function LeaderboardScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore().collection('users')
      .orderBy('points', 'desc')
      .onSnapshot((snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      });

    return () => unsubscribe();
  }, []);

  const getColor = (index) => {
    switch (index) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return 'bronze';
      default:
        return '#4fb2aa';
    }
  };

  const getWidth = (index) => {
    switch (index) {
      case 0:
        return '85%';
      case 1:
        return '75%';
      case 2:
        return '60%';
      default:
        return '40%';
    }
  };

  const getMedalIcon = (index) => {
    switch (index) {
      case 0:
        return require('../assets/icons/gold-medal.png');
      case 1:
        return require('../assets/icons/silver-medal.png');
      case 2:
        return require('../assets/icons/bronze-medal.png');
      default:
        return require('../assets/icons/medal.png');
    }
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
          <Text style={styles.leaderboardText}>Leaderboard</Text>
        </View>
      </View>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={{ ...styles.smallButton, backgroundColor: getColor(index), width: getWidth(index), flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', height: height * 0.125, paddingLeft: 10 }}>
              {getMedalIcon(index) && <Image source={getMedalIcon(index)} style={{ width: 60, height: 60, marginLeft: 10, }} />}
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.smallButtonText1}>{item.name}</Text>
                <Text style={styles.smallButtonText}>{item.points} points</Text>
              </View>
            </View>
          )}
        />
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
  backButtonContainer: {
    position: 'absolute',
    top: height * 0.09,
    left: width * 0.075,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 37/2,
    backgroundColor: 'orange',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonImage: {
    width: 50,
    height: 50,
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
  leaderboardText: {
    marginLeft: 10,
    fontSize: width * 0.075,
    color: 'white',
    fontWeight: 'bold'
  },
  smallButtonText1: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
   versionText: {
     position: 'absolute',
     right: 10,
     bottom: 10,
     color: '#000',
     fontSize: 14,
   },
});