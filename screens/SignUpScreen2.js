import React, { useState, useEffect } from 'react';
import { ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen2({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [points, setPoints] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState([]);
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
      if (email === '') {
        alert('Email is required.');
        return;
      }

      if (name === '') {
        alert('Name is required.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

        const defaultBanner = {
          id: "",
          imageUri: ""
        };

        const defaultBorder = {
          id: "",
          imageUri: ""
        };

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
            levelUnlocked: 0,
            levelProgress: [0, 0, 0],
            diary: [],
            currentChallenge: 0,
              currentBanner: defaultBanner,
              currentBorder: defaultBorder,
            role: 'User',
          };
          const usersRef = firebase.firestore().collection('users');
          usersRef
            .doc(email)
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
          <Text style={styles.storeText}>Create an Account</Text>
        </View>
      </View>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={[styles.input, { backgroundColor: 'transparent' }]}
        mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent', primary: 'orange' }}}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent', primary: 'orange' }}}
        />
        <TextInput
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent', primary: 'orange' }}}
        />
        <TextInput
          label="Date of Birth"
          value={dob}
          onChangeText={setDob}
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent', primary: 'orange' }}}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent', primary: 'orange' }}}
        />
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={[styles.input, { backgroundColor: 'transparent' }]}
          mode="flat"
          theme={{ colors: { underlineColor:'transparent', background :'transparent', primary: 'orange' }}}
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
    marginTop: height * 0.025,
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
    marginTop: height * 0.01,
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
    width: 50,
    height: 50,
  },
  storeText: {
    marginLeft: 10,
    fontSize: width * 0.05,
    color: 'white',
    fontWeight: 'bold'
  },
});