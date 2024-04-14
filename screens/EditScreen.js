import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function EditScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [banner, setBanner] = useState(null);
  const [border, setBorder] = useState(null);
  
  const currentUserEmail = firebase.auth().currentUser.email;

  useEffect(() => {
    const unsubscribeUsers = firebase.firestore().collection('users')
      .onSnapshot((snapshot) => {
        const newUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
  
        setUsers(newUsers);
        setIsLoading(false); // set loading to false after data is fetched
      });
  
    return () => {
      unsubscribeUsers();
    };
  }, []);

  const currentUser = users.find(user => user.email === currentUserEmail);
  const purchasedItems = currentUser ? currentUser.purchasedItems : [];
  
  const banners = purchasedItems.filter(item => item.startsWith('banner'));
  const borders = purchasedItems.filter(item => item.startsWith('border'));
  
  
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
          <Text style={styles.storeText}>Edit your Diary</Text>
        </View>
      </View>

        {isLoading ? (
        <View style={styles.loadingContainer}>
          <Image source={require('../assets/icons/loading.png')} style={styles.loadingImage} />
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Banner</Text>
          <FlatList
            data={banners}
            keyExtractor={item => item}
            renderItem={({ item: banner }) => (
              <View style={styles.box}>
                <Image source={imageMap[banner] || require('../assets/bg1.jpg')} style={styles.boxImage} />
                <TouchableOpacity style={styles.button} onPress={() => setBanner(banner)}>
                  <Text style={styles.buttonText}>
                    {banner === currentUser.currentBanner ? 'Current Banner' : 'Set Banner'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={styles.sectionTitle}>Border</Text>
          <FlatList
            data={borders}
            keyExtractor={item => item}
            renderItem={({ item: border }) => (
              <View style={styles.box}>
                <Image source={imageMap[border] || require('../assets/bg1.jpg')} style={styles.boxImage} />
                <TouchableOpacity style={styles.button} onPress={() => setBorder(border)}>
                  <Text style={styles.buttonText}>
                    {border === currentUser.currentBorder ? 'Current Border' : 'Set Border'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Diary')}
      >
        <Image source={require('../assets/icons/view.png')} style={styles.fabIcon} />
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