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
        setIsLoading(false);
      });
  
    return () => {
      unsubscribeUsers();
    };
  }, []);

    const setCurrentBanner = (banner) => {
      setBanner(banner);

      firebase.firestore().collection('users').doc(currentUser.email).update({
        currentBanner: banner
      });
    };

    const setCurrentBorder = (border) => {
      setBorder(border);

      firebase.firestore().collection('users').doc(currentUser.email).update({
        currentBorder: border
      });
    };

    const currentUser = users.find(user => user.email === currentUserEmail);

    const purchasedItems = currentUser ? currentUser.purchasedItems : [];
    console.log(purchasedItems);

    const banners = purchasedItems.filter(item => item.id.startsWith('banner'));
    const borders = purchasedItems.filter(item => item.id.startsWith('border'));

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
            renderItem={({ item: banner }) => {
              return (
                <View style={styles.box}>
                  <Image source={{ uri: banner.imageUri || 'https://firebasestorage.googleapis.com/v0/b/cameragame-7051b.appspot.com/o/banners%2Fbanner-placeholder.jpg?alt=media&token=b25d671a-3958-4cc5-8d26-81235fc5abe2' }} style={styles.boxImage} />
                  <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: border.id === currentUser.currentBorder.id ? 'grey' : '#ffa633' }
                  ]}  onPress={() => setCurrentBanner(banner)}>
                    <Text style={styles.buttonText}>
                      {banner.id === currentUser.currentBanner.id ? 'Current Banner' : 'Set Banner'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />

          <Text style={styles.sectionTitle}>Border</Text>
          <FlatList
            data={borders}
            keyExtractor={item => item}
            renderItem={({ item: border }) => {
              return (
                <View style={styles.box}>
                  <Image source={{ uri: border.imageUri || 'https://firebasestorage.googleapis.com/v0/b/cameragame-7051b.appspot.com/o/banners%2Fbanner-placeholder.jpg?alt=media&token=b25d671a-3958-4cc5-8d26-81235fc5abe2' }} style={styles.boxImage} />
                    <TouchableOpacity
                      style={[
                        styles.button,
                        { backgroundColor: border.id === currentUser.currentBorder.id ? 'grey' : '#ffa633' }
                      ]}
                      onPress={() => setCurrentBorder(border)}
                    >
                      <Text style={styles.buttonText}>
                        {border.id === currentUser.currentBorder.id ? 'Current Border' : 'Set Border'}
                      </Text>
                    </TouchableOpacity>
                </View>
              );
            }}
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