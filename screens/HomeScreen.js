import React, { useState, useEffect } from 'react';
import { Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler, Modal } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const InfoModal = ({ visible, onClose }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>This is some information about the game.</Text>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

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
    <ImageBackground source={require('../assets/backgroundhome.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/headerA.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.playButtonContainer}>
          <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('Game')}>
            <Text style={styles.playButtonText}>Play Game</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Leaderboard')}>
          <Text style={styles.smallButtonText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Diary')}>
          <Text style={styles.smallButtonText}>View Diaries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Store')}>
          <Text style={styles.smallButtonText}>Store</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Audio')}>
          <Text style={styles.smallButtonText}>Audio Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.smallButtonText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.infoIcon}>
          <Image source={require('../assets/i.png')} style={styles.infoIcon} />
        </TouchableOpacity>
      </View>
      <InfoModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Make sure the container background is transparent
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
  playButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02, // Adjusted margin for better spacing
  },
  playButton: {
    backgroundColor: '#3b5a9d',
    width: '65%',
    height: height * 0.12, // Adjusted height for better visibility
    borderRadius: 20,
    overflow: 'hidden',
    padding: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  infoIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  smallButton: {
    backgroundColor: '#4fb2aa',
    width: '55%',
    height: height * 0.08, // Adjusted height for better visibility
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
    fontWeight: 'bold',
    right: 10,
    bottom: 10,
    color: '#000',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4fb2aa',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});