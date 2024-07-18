import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Image, View, Dimensions, TouchableOpacity } from 'react-native';
import { firebase } from '../FirebaseConfig';

const { width, height } = Dimensions.get('window');

export default function Minigame({ navigation }) {
    const [cards, setCards] = useState([
        { id: 1, value: 'apple', flipped: false, image: require('../../assets/apple.png') },
        { id: 2, value: 'pineapple', flipped: false, image: require('../../assets/pineapple.png') },
        { id: 3, value: 'apple', flipped: false, image: require('../../assets/apple.png') },
        { id: 4, value: 'pineapple', flipped: false, image: require('../../assets/pineapple.png') },
        { id: 5, value: 'watermelon', flipped: false, image: require('../../assets/watermelon.png') },
        { id: 6, value: 'strawberry', flipped: false, image: require('../../assets/strawberry.png') },
        { id: 7, value: 'watermelon', flipped: false, image: require('../../assets/watermelon.png') },
        { id: 8, value: 'strawberry', flipped: false, image: require('../../assets/strawberry.png') },
        { id: 9, value: 'orange', flipped: false, image: require('../../assets/orange.png') },
        { id: 10, value: 'orange', flipped: false, image: require('../../assets/orange.png') },
    ]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [points, setPoints] = useState(0);
    const [lives, setLives] = useState(10);
    const [isDisabled, setIsDisabled] = useState(false);
    const [resetCards, setResetCards] = useState(false);

    const handlePress = (card) => {
        console.log(`Card value: ${card.value}`);
        if (isDisabled || card.flipped) return;
        if (flippedCards.length === 2) {
            setCards(cards.map(c => flippedCards.includes(c) && !matchedCards.includes(c.id) ? { ...c, flipped: false } : c));
            setFlippedCards([]);
        } else {
            setCards(cards.map(c => c.id === card.id ? { ...c, flipped: true } : c));
            let newFlippedCards = [...flippedCards, card];
            if (newFlippedCards.length === 2) {
                setIsDisabled(true);
                if (card.value === newFlippedCards[0].value) {
                    console.log('Correct match');
                    setMatchedCards([...matchedCards, card.id, newFlippedCards[0].id]);
                    setPoints(points + 10);
                    setIsDisabled(false);
                } else {
                    console.log('Wrong match');
                    setTimeout(() => {
                        setResetCards(true);
                        setFlippedCards([]);
                    }, 1500);
                }
                setLives(prevLives => prevLives - 1);
            } else {
                setFlippedCards(newFlippedCards);
            }
        }
    };

    useEffect(() => {
        if (resetCards) {
            setCards(cards.map(c => matchedCards.includes(c.id) ? c : { ...c, flipped: false }));
            setResetCards(false);
            if (lives <= 0) {
                setIsDisabled(true);
            } else {
                setIsDisabled(false);
            }
        }
    }, [resetCards, lives]);

    useEffect(() => {
        const shuffledCards = [...cards];
        for (let i = shuffledCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        }
        setCards(shuffledCards);
    }, []);

    useEffect(() => {
        if (matchedCards.length === cards.length || lives === 0) {
            const user = firebase.auth().currentUser;
            if (user) {
                const userRef = firebase.firestore().collection('users').doc(user.email);
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        userRef.update({
                            points: userData.points + points
                        });
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                });
            }

            Alert.alert(
                "Game Over!",
                `You guessed ${matchedCards.length / 2} pairs and earned ${points} points.`,
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate('Game')
                    }
                ],
                { cancelable: false }
            );
        }
    }, [matchedCards, lives]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/header.png')}
                    style={styles.image}
                />
                <View style={[styles.backButtonContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <TouchableOpacity onPress={() => {
                        Alert.alert(
                            "Are you going to leave?",
                            "If you stop the minigame, progress cannot be saved. Do you want to continue?",
                            [
                                {
                                    text: "No",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                },
                                { text: "Yes", onPress: () => navigation.navigate('Land Pollution') }
                            ],
                            { cancelable: false }
                        );
                    }}>
                        <Image
                            source={require('../../assets/round-back.png')}
                            style={styles.backButtonImage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Minigame</Text>
                    <Text style={styles.levelText}>{`${lives}`} Guesses Left</Text>
                </View>
            </View>

            <Text style={styles.labelText}>Minigame: Guess the pair</Text>

            <View style={styles.cardsContainer}>
                {cards.map(card => (
                    <TouchableOpacity
                        key={card.id}
                        style={[
                            styles.smallButton,
                            matchedCards.includes(card.id) ? { opacity: 0.5 } : {}
                        ]}
                        onPress={() => handlePress(card)}
                        disabled={isDisabled}
                    >
                        {card.flipped || matchedCards.includes(card.id) ? (
                            <Image source={card.image} style={styles.cardImage} />
                        ) : (
                            <Text style={styles.cardText}>?</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: '2.5%',
    },
    cardText: {
        color: 'white',
        fontSize: width * 0.075,
        fontWeight: 'bold',
    },
    backButtonImage: {
        width: 50,
        height: 50,
    },
    playButtonText1: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.035,
        paddingLeft: 10,
    },
    playButtonText2: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: width * 0.055,
        alignSelf: 'center',
    },
    header: {
        height: '23%',
        width: '100%',
    },
    labelText: {
        color: '#3b5a9d',
        alignSelf: 'center',
        fontSize: width * 0.07,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    judgeText: {
        textAlign: 'center',
        fontSize: width * 0.035,
        fontWeight: 'bold',
        marginTop: 20,
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
    smallButton: {
        backgroundColor: '#4fb2aa',
        width: '45%',
        height: '13%',
        alignSelf: 'center',
        borderRadius: 20,
        overflow: 'hidden',
        padding: 10,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height * 0.04,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    smallButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.04,
    },
    headerText: {
        marginLeft: 10,
        fontSize: width * 0.075,
        color: 'white',
        fontWeight: 'bold'
    },
    levelText: {
        marginLeft: width * 0.11,
        fontSize: width * 0.035,
        color: 'white',
    },
    button1: {
        backgroundColor: '#4fb2aa',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        marginTop: 5,
        elevation: 5,
        width: '85%',
        height: '18%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    button2: {
        backgroundColor: '#ffa633',
        justifyContent: 'center',
        borderRadius: 20,
        padding: 10,
        margin: 10,
        elevation: 5,
        height: '20%',
        width: '80%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.035,
        fontWeight: 'bold',
    },
});
