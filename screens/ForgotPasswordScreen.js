import React, { useState, useEffect } from 'react';
import { ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function ForgetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

    onResetPassword = () => {

    }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/header.png')}
          style={styles.image}
        />
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Image
              source={require('../assets/round-back.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <Text style={styles.storeText}>Go Back</Text>
        </View>
      </View>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent', primary: 'orange' }}}
        />
        <TouchableOpacity style={styles.button} onPress={onResetPassword}>
          <Text style={styles.buttonText}>RESET PASSWORD</Text>
         </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  signUpText: {
    marginLeft: 5,
    color: '#4fb2aa',
    fontWeight: 'bold',
  },
  button: {
    height: height * 0.07,
    justifyContent: 'center',
    backgroundColor: '#4fb2aa',
    padding: 10,
    borderRadius: 10,
    marginTop: height * 0.03,
    elevation: 5,
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: width * 0.05,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  header: {
    height: '25%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  backButtonContainer: {
    position: 'absolute',
    top: height * 0.1,
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
    width: 24,
    height: 24,
  },
  storeText: {
    marginLeft: 10,
    fontSize: width * 0.05,
    color: 'white',
    fontWeight: 'bold'
  },
});