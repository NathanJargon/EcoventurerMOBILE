import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { firebase } from './FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const imageExists = async (url) => {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default function DiaryScreen({ navigation }) {
  const [banners, setBanners] = useState([]);
  const [borders, setBorders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribeUsers = firebase.firestore().collection('users')
        .onSnapshot(async (snapshot) => {
          const newUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          const usersWithDiary = await Promise.all(newUsers.map(async (user) => {
            if (user.diary) {
              const validDiaryEntries = await Promise.all(user.diary.map(async (entry) => {
                const exists = await imageExists(entry.imageUrl);
                return exists ? entry : null;
              }));
              user.diary = validDiaryEntries.filter(entry => entry !== null);
            }
            return user;
          }));

          setUsers(usersWithDiary);
          setIsLoading(false);
        });

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
        });

      return () => {
        unsubscribeUsers();
        unsubscribeBanners();
        unsubscribeBorders();
      };
    }, [])
  );

  const currentUserEmail = firebase.auth().currentUser.email;
  const otherUsers = users.filter(user => user.email !== currentUserEmail);
  const usersWithDiary = users.filter(user => user.diary && user.diary.some(imageUri => imageUri !== ''));
  const diaries = usersWithDiary.flatMap(user => 
    user.diary
      .filter(entry => entry.imageUrl.startsWith('https'))
      .map((entry, index) => ({
        imageUri: entry.imageUrl,
        correctAnswer: entry.correctAnswer,
        index,
        name: user.name,
        id: user.id,
        neededPoints: user.neededPoints,
        email: user.email, 
        purchasedItems: user.purchasedItems, 
      }))
  );
  const currentUser = users.find(user => user.email === currentUserEmail);
  const currentBanner = currentUser ? currentUser.currentBanner : null;
  const currentBorder = currentUser ? currentUser.currentBorder : null;

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
          <Text style={styles.sectionTitle}>Latest diaries</Text>
          <FlatList
            data={diaries}
            numColumns={2}
            keyExtractor={item => `${item.id}-${item.index}`}
            renderItem={({ item }) => (
              item.imageUri !== '' && (
                <View style={styles.box}>
                  <View style={styles.imageContainer}>
                    <ImageBackground 
                      source={{ uri: item.imageUri }} 
                      style={styles.boxImage}
                    />
                    {item.purchasedItems && item.purchasedItems
                      .filter(purchasedItem => !purchasedItem.id.startsWith('banner'))
                      .map(purchasedItem => 
                        purchasedItem.imageUri !== '' && (
                          <Image 
                            source={{ uri: purchasedItem.imageUri }} 
                            style={styles.borderImage} 
                          />
                        )
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.navigate('User', { email: item.email })}
                  >
                    <Text style={styles.buttonText}>
                      {`${item.name} (${item.correctAnswer.charAt(0).toUpperCase() + item.correctAnswer.slice(1)})`}
                    </Text>
                  </TouchableOpacity>
                </View>
              )
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
  imageContainer: {
  width: '90%',
  height: '70%',
  borderRadius: 20,
  overflow: 'hidden',
  },
  boxImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 20,
  },
  borderImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
  button: {
    marginTop: 10,
    width: '90%',
    backgroundColor: '#ffa633',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: width * 0.025,
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