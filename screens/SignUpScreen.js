import React, { useState, useEffect } from 'react';
import { ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bottomBoxHeight, setBottomBoxHeight] = useState(height * 0.85);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const _keyboardDidShow = () => {
    setBottomBoxHeight(height * 0.65);
  };

  const _keyboardDidHide = () => {
    setBottomBoxHeight(height * 0.85);
  };

    const onSignUp = () => {
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          const uid = response.user.uid;
          const data = {
            id: uid,
            email,
            name,
            phone,
            dob,
            isRemembered: false,
            points,
            purchasedItems,
            password,
          };
          const usersRef = firebase.firestore().collection('users');
          usersRef
            .doc(uid)
            .set(data)
            .then(() => {
              navigation.navigate('Home');
            })
            .catch((error) => {
              alert(error);
            });
        })
        .catch((error) => {
          alert(error);
        });
    };

  return (
    <ImageBackground source={require('../assets/bg2.jpg')} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Image
              source={require('../assets/arrow_back.png')}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create an Account</Text>
        </View>
        <View style={[styles.bottomBox, {height: bottomBoxHeight}]}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
        />
        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
        />
        <TextInput
          label="Date of Birth"
          value={dob}
          onChangeText={setDob}
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
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent' }}}
        />
        <TouchableOpacity style={styles.button} onPress={onSignUp}>
          <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
          <View style={styles.bottomRow}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomBox: {
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 16,
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
    marginTop: height * 0.08,
  },
  signUpText: {
    marginLeft: 5,
    color: '#0A1172',
    fontWeight: 'bold',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: width * 0.05,
    paddingTop: height * 0.05, // Increase padding to lower the header
  },
  backButton: {
    width: 24,
    height: 24,
    marginRight: width * 0.05,
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
  },
});