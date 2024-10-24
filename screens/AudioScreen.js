import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

export default function AudioScreen({
  navigation,
  volume,
  setVolume,
  isPlaying,
  togglePlayPause,
  isLooping,
  toggleLooping,
  ttsVolume,
  toggleTtsVolume
}) {

  useEffect(() => {
    console.log('TTS Volume:', ttsVolume);
  }, [ttsVolume]);

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
          <Text style={styles.settingsText}>Audio Settings</Text>
        </View>
      </View>

      {/* Volume Control */}
      <Text style={styles.label}>Volume: {(volume * 100).toFixed(0)}%</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={setVolume}
        minimumTrackTintColor="#4fb2aa"
        maximumTrackTintColor="#000000"
        thumbTintColor="#4fb2aa"
      />

      {/* Play/Pause Button */}
      <TouchableOpacity style={styles.button} onPress={togglePlayPause}>
        <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>

      {/* Looping Button */}
      <TouchableOpacity style={styles.button} onPress={toggleLooping}>
        <Text style={styles.buttonText}>{isLooping ? 'Disable Loop' : 'Enable Loop'}</Text>
      </TouchableOpacity>

      {/* TTS Volume Button */}
      <TouchableOpacity style={styles.button} onPress={toggleTtsVolume}>
        <Text style={styles.buttonText}>Text to Speech: {ttsVolume === 1.0 ? 'Mute' : 'Unmute'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: '30%',
    width: '100%',
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  slider: {
    width: '90%',
    height: 40,
    alignSelf: 'center',
  },
  button: {
    alignSelf: 'center',
    width: '90%',
    height: height * 0.075,
    justifyContent: 'center',
    backgroundColor: '#4fb2aa',
    padding: 10,
    borderRadius: 10,
    marginTop: height * 0.025,
    elevation: 5,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backButtonContainer: {
    position: 'absolute',
    top: height * 0.09,
    left: width * 0.075,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonImage: {
    width: 50,
    height: 50,
  },
  settingsText: {
    marginLeft: 10,
    fontSize: width * 0.075,
    color: 'white',
    fontWeight: 'bold'
  },
  label: {
    alignSelf: 'center',
    fontSize: width * 0.05,
    marginVertical: 10,
  },
});