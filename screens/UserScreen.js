import React, { useEffect, useState } from 'react';
import { ImageBackground, FlatList, View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function EditScreen({ route, navigation }) {
  const { email } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [banner, setBanner] = useState(null);
  const [border, setBorder] = useState(null);

  useEffect(() => {
  const userRef = firebase.firestore().collection('users').doc(email);
  userRef.get().then((doc) => {
    if (doc.exists) {
      const user = doc.data();
      setUsers([user]);
      setIsLoading(false);
    } else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });
}, []);

  const currentUser = users.find(user => user.email === email); 
  const purchasedItems = currentUser ? currentUser.purchasedItems : [];
  const diaryImages = currentUser ? currentUser.diary : [];

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/header.png')}
          style={styles.image}
        />
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Diary')}>
            <Image
              source={require('../assets/round-back.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <Text style={styles.storeText}>User Diary</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Image source={require('../assets/icons/loading.png')} style={styles.loadingImage} />
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>{currentUser ? `${currentUser.name}'s Diaries` : 'Loading...'}</Text>
          <FlatList
            data={diaryImages}
            keyExtractor={item => item.imageUrl}
            numColumns={2}
            key={2}
            renderItem={({ item }) => (
              item.imageUrl !== '' && (
                <View style={styles.box}>
                  <View style={styles.imageContainer}>
                    <ImageBackground 
                      source={{ uri: item.imageUrl }} 
                      style={styles.boxImage}
                    />
                    <Image source={{ uri: currentUser && currentUser.currentBorder ? currentUser.currentBorder.imageUri : '' }} style={styles.borderImage} />
                  </View>
                </View>
              )
            )}
          />
        </>
      )}
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
    height: '80%',
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