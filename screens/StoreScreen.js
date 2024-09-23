import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { firebase } from './FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function StoreScreen({ navigation }) {
  const [banners, setBanners] = useState([]);
  const [borders, setBorders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);


    useEffect(() => {
      const user = firebase.auth().currentUser;

      const unsubscribeUser = firebase.firestore().collection('users').doc(user.email)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log("No such document!");
          }
        });

      return () => {
        unsubscribeUser();
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

    const onPurchase = async (itemId, neededPoints, imageUri) => {
      const user = firebase.auth().currentUser;

      const doc = await firebase.firestore().collection('users').doc(user.email).get();
      const userData = doc.data();

      if (userData.points < neededPoints) {
        alert('Insufficient points.');
        return;
      }

      firebase.firestore().collection('users').doc(user.email).update({
        purchasedItems: firebase.firestore.FieldValue.arrayUnion({id: itemId, imageUri: imageUri}),
        points: userData.points - neededPoints,
      })
      .then(() => {
        // alert('Item purchased successfully!');
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
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
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../assets/round-back.png')}
              style={styles.backButtonImage}
            />
          </TouchableOpacity>
          <Text style={styles.storeText}>Store</Text>
        </View>
      </View>

        {isLoading || !userData ? (
          <View style={styles.loadingContainer}>
            <Image source={require('../assets/icons/loading.png')} style={styles.loadingImage} />
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Banner</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {banners.map((item) => (
                  <View key={item.id} style={[styles.box, userData.purchasedItems.some(purchasedItem => purchasedItem.id === item.id)]}>
                    <Image source={item.imageUri ? { uri: item.imageUri } : require('../assets/bg1.jpg')} style={styles.boxImage} />
                    {userData.purchasedItems.some(purchasedItem => purchasedItem.id === item.id) ? (
                      <View style={[styles.button, {backgroundColor: 'grey'}]}>
                        <Text style={styles.buttonText}>Purchased</Text>
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.button} onPress={() => onPurchase(item.id, item.neededPoints, item.imageUri)}>
                        <Text style={styles.buttonText}>{item.neededPoints} Points</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Border</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {borders.map((item) => (
                  <View key={item.id} style={[styles.box, userData.purchasedItems.some(purchasedItem => purchasedItem.id === item.id)]}>
                    <Image source={item.imageUri ? { uri: item.imageUri } : require('../assets/bg1.jpg')} style={styles.boxImage} />
                    {userData.purchasedItems.some(purchasedItem => purchasedItem.id === item.id) ? (
                      <View style={[styles.button, {backgroundColor: 'grey'}]}>
                        <Text style={styles.buttonText}>Purchased</Text>
                      </View>
                    ) : (
                      <TouchableOpacity style={styles.button} onPress={() => onPurchase(item.id, item.neededPoints, item.imageUri)}>
                        <Text style={styles.buttonText}>{item.neededPoints} Points</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
            </ScrollView>
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
   purchasedText: {
     color: 'black',
     fontWeight: 'bold',
     textAlign: 'center',
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
    width: width * 0.5,
    height: height * 0.3,
    marginLeft: 20,
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