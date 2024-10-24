import React, { useState, useEffect } from 'react';
import { Image, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Keyboard } from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [logoOpacity, setLogoOpacity] = useState(1); // State for logo opacity

  useEffect(() => {
    const checkLogin = async () => {
      const savedEmail = await AsyncStorage.getItem('email');
      const savedPassword = await AsyncStorage.getItem('password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRemember(true);
        firebase
          .auth()
          .signInWithEmailAndPassword(savedEmail, savedPassword)
          .then((response) => {
            console.log('Auto login successful:', response);
            navigation.navigate('Home');
          })
          .catch((error) => {
            console.error('Auto login error:', error);
            // Handle login error here
          });
      }
    };
    checkLogin();

    const authListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Home');
      }
    });

    // Listen for keyboard events
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setLogoOpacity(0); // Hide logo when keyboard is shown
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setLogoOpacity(1); // Show logo when keyboard is hidden
    });

    return () => {
      authListener();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onLogin = () => {
    console.log('Attempting login with email:', email, 'and password:', password);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (response) => {
        console.log('Login successful:', response);
        const user = firebase.auth().currentUser;
        const docRef = firebase.firestore().collection('users').doc(user.email);
  
        // Get the current date and time
        const loggedDate = new Date().toISOString();
  
        // Update the document with the loggedDate field
        const doc = await docRef.get();
        if (doc.exists) {
          await docRef.update({
            loggedDate: loggedDate,
          });
        } else {
          await docRef.set({
            loggedDate: loggedDate,
          });
        }
  
        if (remember) {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
        } else {
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('password');
        }
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.error('Login error:', error);
        switch (error.code) {
          case 'auth/invalid-email':
            alert('The email address is badly formatted.');
            break;
          case 'auth/user-disabled':
            alert('The user corresponding to the given email has been disabled.');
            break;
          case 'auth/user-not-found':
            alert('There is no user corresponding to the given email.');
            break;
          case 'auth/wrong-password':
            alert('The password is invalid for the given email.');
            break;
          default:
            alert('Email and password is incorrect. Sign up if you do not have an account.');
        }
      });
  };

  return (
    <View style={styles.container}>
        <Image
          source={require('../assets/adaptive-icon.png')}
          style={[styles.logo, { opacity: logoOpacity }]} // Adjust opacity based on state
        />
      <View style={styles.bottomBox}>
        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
        />
        <View style={styles.row}>
          <View style={styles.row}>
            <Checkbox
              status={remember ? 'checked' : 'unchecked'}
              onPress={() => setRemember(!remember)}
            />
            <Text onPress={() => setRemember(!remember)}>Remember me</Text>
          </View>
          <Text onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <View style={styles.bottomRow}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup2')}>
            <Text style={styles.signUpText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomBox: {
    height: height * 0.55,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 16,
    overflow: 'hidden',
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
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
    marginTop: height * 0.05,
  },
  signUpText: {
    marginLeft: 5,
    color: '#4fb2aa',
    fontWeight: 'bold',
  },
  button: {
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
  logo: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    position: 'absolute',
    top: height * 0.1,
    left: (width - width * 0.7) / 2,
  },
});