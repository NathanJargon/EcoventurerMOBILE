import React, { useEffect, useState } from 'react';
import { Alert, View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function SettingsScreen({ navigation }) {
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

const updateUserDetails = (newName, newPassword) => {
  console.log('Updating user details with:', newName, newPassword);

  const user = firebase.auth().currentUser;
      if (user) {
          const userId = user.uid;
          console.log('User ID:', userId);
        const userEmail = user.email;
        console.log('User email:', userEmail);

        firebase.firestore().collection('users').doc(userEmail).update({
          name: newName,
          password: newPassword,
        })
        .then(() => {
          console.log('User details updated successfully');
        })
        .catch((error) => {
          console.error('Error updating user details: ', error);
        });
      } else {
        console.log('No user is signed in');
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
          <Text style={styles.settingsText}>Account Settings</Text>
        </View>
      </View>

      <TextInput
        label="New Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: 'transparent' }]}
        mode="flat"
        theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
      />
      <TextInput
        label="Old Password"
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        style={[styles.input, { backgroundColor: 'transparent' }]}
        mode="flat"
        theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
      />
      <TextInput
        label="New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { backgroundColor: 'transparent' }]}
        mode="flat"
        theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[styles.input, { backgroundColor: 'transparent' }]}
        mode="flat"
        theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
      />
        <TouchableOpacity style={styles.button} onPress={() => updateUserDetails(name, password)}>
          <Text style={styles.buttonText}>UPDATE</Text>
        </TouchableOpacity>
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
  input: {
    marginBottom: 10,
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    alignSelf: 'center',
    width: '90%',
    height: height * 0.075,
    justifyContent: 'center',
    backgroundColor: '#4fb2aa',
    padding: 10,
    borderRadius: 10,
    marginTop: height * 0.065,
    elevation: 5,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
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
  settingsText: {
    marginLeft: 10,
    fontSize: width * 0.075,
    color: 'white',
    fontWeight: 'bold'
  },
});