import React, { useState, useEffect } from 'react';
import { Modal, ScrollView, Alert, ImageBackground, View, TouchableOpacity, Text, StyleSheet, Dimensions, Image, BackHandler } from 'react-native';
import { TextInput } from 'react-native-paper';
import { firebase } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function RecyclingWastes({ navigation }) {
  const [levelUnlocked, setLevelUnlocked] = useState(0);
  const [levelProgress, setLevelProgress] = useState([]);
  const [loading, setLoading] = useState(true); 
  const levelNames = ['Land Pollution', 'Recycling Wastes', 'Pollution'];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [trashes, setTrashes] = useState([]); 

  useEffect(() => {
    const fetchTrashes = async () => {
      const docRef = firebase.firestore().collection('lessons').doc('Recycling Wastes');
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        if (data.trashes) {
          // Assuming you want to flatten the structure to an array of trashes
          const trashesArray = Object.entries(data.trashes).reduce((acc, [level, trashes]) => {
            // Add the level to each trash object
            const trashesWithLevel = trashes.map(trash => ({ ...trash, level }));
            return acc.concat(trashesWithLevel);
          }, []);
          setTrashes(trashesArray);
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchTrashes();
  }, []);

  /*
  const trashes = [
    { 
        name: 'Plastic Bottles inside the Trashcan', 
        level: 1, 
        description: 'Plastic bottles inside the trashcan is one of the best practices to do because it saves the environment overall and reduces the chances of pollution and floods.' 
    },
    { 
        name: 'Trashcan', 
        level: 2, 
        description: 'A trashcan is one of the main components in collecting trash. This helps the environment to collect trash in a specific container.' 
    },
    { 
        name: 'AA Battery', 
        level: 3, 
        description: 'Double A batteries help us power small electronics, but pose a big problem in the environment if not disposed properly. Electronic batteries, such as Double A batteries, must be safely disposed through e-waste bins in your local community or businesses that accept e-waste.' 
    },
    { 
        name: 'Phone Charging Cables', 
        level: 4, 
        description: 'Phone charging cables provide power to our electronic gadgets that we use every day. Almost every electronic manufacturer provides these cables to its users, which doubles the number of cables being used, especially if the user already has the specific type of cable needed. Due to this, some cables end up being unused or of poor quality. Cables must be disposed properly through e-waste trash bins that can be found in your local community or businesses that accept e-waste to be recycled.' 
    },
    { 
        name: 'Unused Cardboard Boxes', 
        level: 5, 
        description: 'Cardboard boxes are the most general biodegradable containers used to pack items such as televisions, online orders, shoes, and many more. Usually, once the items are unboxed, the cardboard boxes are kept in storage without any purpose. To better utilize these biodegradable boxes, they can be used as storage boxes for other items or be recycled to recycling facilities to be turned into boxes once again.' 
    },
    { 
        name: 'Reusable Bag', 
        level: 6, 
        description: 'Reusable bags help eliminate the use of paper and plastic bags usually used in stores (supermarkets and department stores). Reusable bags are more durable than traditional paper and plastic bags and help save more money, resources, and lessen carbon footprint.' 
    },
    { 
        name: 'Aluminum Can', 
        level: 7, 
        description: 'Aluminum cans are generally used for beverages and food to keep freshness and protect against spoilage. They help keep products to have a long storage shelf life. Aluminum cans are the most used for food and beverage products as they are lightweight and can be easily recycled once again, allowing for less carbon production than other kinds of metals.' 
    },
    { 
        name: 'Tumbler', 
        level: 8, 
        description: 'A tumbler is a type of beverage container that can contain liquids such as water or carbonated drinks. Tumblers are generally made out of stainless steel, which is durable and can be reused as many times as long as they are kept and cleaned properly. Tumblers also eliminate the use of plastic bottles and aluminum cans.' 
    },
    { 
        name: 'Newspaper', 
        level: 9, 
        description: 'Newspapers are generally printed every single day, providing daily news to readers who still prefer print media. Newspapers are made out of woods of trees. They can be repurposed to be used as cleaning for windows, cat litter, origami, or be recycled to recycling facilities that will reuse these papers into new ones.' 
    },
    { 
        name: 'Food Container', 
        level: 10, 
        description: 'Food containers are one of the most widely used plastic items in the household. These containers can also contain other items other than food such as packets of coffee, sugar, hardware nails, and others. Food containers generally last for a long time as long as they are cleaned properly. This eliminates the use of disposable food containers that harm the environment as they always end up in landfills.' 
    }
  ];


  useEffect(() => {
    const sendTrashesToFirebase = async () => {
      const lessonsRef = firebase.firestore().collection('lessons').doc('Recycling Wastes');
      
      // Transforming trashes array to a map with level as key and array of {name, description} as value
      const trashesMap = trashes.reduce((acc, {level, name, description}) => {
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push({name, description});
        return acc;
      }, {});

      try {
        await lessonsRef.set({ trashes: trashesMap }, { merge: true });
        console.log('Trashes data sent successfully');
      } catch (error) {
        console.error('Error sending trashes data:', error);
      }
    };

    sendTrashesToFirebase();
  }, []);
  */

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const user = firebase.auth().currentUser;
        if (user) {
          const doc = await firebase.firestore().collection('users').doc(user.email).get();
          if (doc.exists) {
            const userData = doc.data();
            setLevelUnlocked(userData.levelUnlocked);
            setLevelProgress(userData.levelProgress || []);
            setCurrentChallenge(userData.currentChallenge || 0);
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No user is signed in!');
        }
        setLoading(false); 
      };
      fetchUserData();
    }, [])
  );

  /*
  const isFocused = useIsFocused();

  useEffect(() => {
    let timerId = null; 
  
    if (isFocused && levelProgress[0] >= 10 && !isModalVisible) {
      timerId = setInterval(() => setIsModalVisible(true), 300000);
      const updateProgress = async () => {
        await saveProgress(0, levelProgress[0]);
      };
      updateProgress();
    }
  
    return () => {
      clearInterval(timerId); 
    };
  }, [levelProgress, isModalVisible, isFocused]);
  */

  const handleButtonClick = () => {
    if (levelProgress[0] >= 10) {
      setIsModalVisible(true);
    }
  };

  const saveProgress = async (level, progress) => {
    const user = firebase.auth().currentUser;
    const newLevelProgress = [...levelProgress];
    newLevelProgress[level] = progress;
    setLevelProgress(newLevelProgress);
    if (level === 0 && progress >= 10) {
      setLevelUnlocked(1);
      await firebase.firestore().collection('users').doc(user.email).update({
        levelProgress: newLevelProgress,
        levelUnlocked: 1, // Add this line
      });
    } else {
      await firebase.firestore().collection('users').doc(user.email).update({
        levelProgress: newLevelProgress,
      });
    }
  };


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          padding: 20,
          borderRadius: 10, 
        }}>
          <Text style={{ fontWeight: 'bold', fontSize: width * 0.05, color: '#4fb2aa' }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.modalText, { fontSize: width * 0.1, marginBottom: 10, fontWeight: "bold", } ]}>Diary Complete!</Text>
              <Text style={[ styles.modalText, { fontSize: width * 0.075, marginBottom: 30, } ]}> Proceed to Quiz</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={styles.buttonYes}
                  onPress={() => {
                    navigation.navigate('Quiz2');
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonTextYes}>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonNo}
                  onPress={() => {
                    setIsModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonTextNo}>NO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </Modal>

        <View style={styles.header}>
          <Image
            source={require('../../assets/header.png')}
            style={styles.image}
          />
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Game')}>
              <Image
                source={require('../../assets/round-back.png')}
                style={styles.backButtonImage}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Go Back</Text>
          </View>

          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity 
            onPress={levelProgress[1] >= 10 ? handleButtonClick : null} 
            style={{ 
              alignItems: 'center', 
              justifyContent: 'center', 
              flexDirection: 'row', 
              backgroundColor: '#4fb2aa', 
              padding: 10,
              width: width * 0.8, 
              height: height * 0.075, 
              borderRadius: 20, 
              opacity: levelProgress[1] >= 10 ? 1 : 0.5
            }}
            disabled={levelProgress[1] < 10}
          >
            <Image
              source={require('../../assets/icons/completed.png')} 
              style={{ width: 30, height: 30, marginRight: 5 }} 
            />
            <Text style={{ marginLeft: 5, color: '#fff' }}>{levelProgress[1] >= 10 ? 'Press to take quiz!' : 'Finish all challenges to take quiz!'}</Text>
          </TouchableOpacity>
          </View>
        </View>

      <Text style={styles.labelText}>Accomplish the following challenges:</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
      {[...Array(10)].map((_, index) => {
      const playButtonStyle = {
        margin: 15,
        paddingLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#4fb2aa',
        width: '90%',
        height: '10%',
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        padding: 10,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.005,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      };

      return (
        <TouchableOpacity
          key={index}
          style={playButtonStyle}
          onPress={() => {
            if (index < levelProgress[0] ) {
              Alert.alert(
                'Rechallenge?',
                'You have already completed this challenge. Would you try again?',
                [
                  {
                    text: 'No',
                    onPress: () => null,
                    style: 'cancel',
                  },
                    {
                      text: 'Yes',
                      onPress: () => navigation.navigate('Camera', { 
                        object: { 
                          challengeNumber: index + 1, 
                          trash: trashes[index], 
                          description: trashes[index].description 
                        }, 
                        trashes: trashes 
                      }),
                    },
                ]
              );
            } else if (index <= levelProgress[0]) {
              navigation.navigate('Camera', { object: { challengeNumber: index + 1, trash: trashes[index], description: trashes[index].description }, trashes: trashes });
            } else {
              Alert.alert('Locked', `Finish Challenge #${index} to unlock this challenge.`);
            }
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.playButtonText}>{`Challenge #${index + 1}`}</Text>
          </View>
          {index < levelProgress[1] && (
            <Image
              source={require('../../assets/icons/completed.png')} 
              style={styles.completedIcon} 
            />
          )}
        </TouchableOpacity>
      );
    })}
    </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  buttonYes: {
    backgroundColor: '#4fb2aa',
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 20,
    padding: 15, 
    width: '45%', 
    alignItems: 'center',
    justifyContent: 'center', 
    margin: 10,
  },
  buttonNo: {
    backgroundColor: 'white',
    borderColor: '#4fb2aa',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15, 
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  buttonTextYes: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  buttonTextNo: {
    color: '#4fb2aa',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: "#4fb2aa",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
    modalText: {
      textAlign: "center",
      color: "white",
      fontSize: 18,
    },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButtonImage: {
    width: 50,
    height: 50,
  },
  completedIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
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
  boxImage: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    width: '50%',
    height: '100%',
    resizeMode: 'cover',
  },
  challengesText: {
    textAlign: 'center',
    color: 'white',
  },
  labelText: {
    color: '#3b5a9d',
    marginTop: 30,
    margin: 10,
  },
  textContainer: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    width: '85%',
  },
  backButtonContainer: {
    position: 'absolute',
    top: height * 0.09,
    left: width * 0.075,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: '#4fb2aa',
    width: '55%',
    height: '8%',
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.02,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  headerText: {
    marginLeft: 10,
    fontSize: width * 0.075,
    color: 'white',
    fontWeight: 'bold'
  },
});