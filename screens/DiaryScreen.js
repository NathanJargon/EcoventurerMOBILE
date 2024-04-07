import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function DiaryScreen({ navigation }) {
  const [banners, setBanners] = useState([]);
  const [borders, setBorders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribeUsers = firebase.firestore().collection('users')
      .onSnapshot((snapshot) => {
        const newUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setUsers(newUsers);
      });

    return () => {
      unsubscribeUsers();
    };
  }, []);

  useEffect(() => {
    const unsubscribeBanners = firebase.firestore().collection('banner')
      .onSnapshot((snapshot) => {
        const newItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setBanners(newItems);
      });

    const unsubscribeBorders = firebase.firestore().collection('border')
      .onSnapshot((snapshot) => {
        const newItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setBorders(newItems);
        setIsLoading(false);
      });

    return () => {
      unsubscribeBanners();
      unsubscribeBorders();
    };
  }, []);

  const currentUserEmail = firebase.auth().currentUser.email;
  const otherUsers = users.filter(user => user.email !== currentUserEmail);

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
          <Text style={styles.storeText}>Diaries</Text>
        </View>
      </View>

        {isLoading ? (
        <View style={styles.loadingContainer}>
          <Image source={require('../assets/icons/loading.png')} style={styles.loadingImage} />
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Other people's diary</Text>
          <FlatList
            data={otherUsers}
            numColumns={2}
            keyExtractor={item => item.id}
            renderItem={({ item: user }) => (
              <View style={styles.box}>
                <Image source={user.imageUri ? { uri: user.imageUri } : require('../assets/bg1.jpg')} style={styles.boxImage} />
                <TouchableOpacity style={styles.button} onPress={() => onPurchase(user.id, user.neededPoints)}>
                  <Text style={styles.buttonText}>{user.name}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Edit')}
      >
        <Image source={require('../assets/icons/edit.png')} style={styles.fabIcon} />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: 'orange',
    borderRadius: 28,
    elevation: 8
  },
  fabIcon: {
    width: 24,
    height: 24
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
  storeText: {
    marginLeft: 10,
    fontSize: width * 0.075,
    color: 'white',
    fontWeight: 'bold'
  },
  sectionTitle: {
    fontSize: width * 0.065,
    fontWeight: 'bold',
    color: '#3f5d9f',
    marginLeft: 10,
    marginBottom: 10,
  },
  box: {
    width: width * 0.5 - 20, // assuming 20 is the total horizontal margin
    height: height * 0.3,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#4fb2aa',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 20,
  },
  boxImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 20,
  },
  button: {
    marginTop: 10,
    width: '90%',
    backgroundColor: '#ffa633',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});