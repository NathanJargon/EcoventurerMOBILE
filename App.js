import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Audio } from 'expo-av';

import CameraScreen from './screens/CameraScreen';
import CameraScreen1 from './screens/CameraScreen1';
import CameraScreen2 from './screens/CameraScreen2';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import StoreScreen from './screens/StoreScreen';
import SignUpScreen2 from './screens/SignUpScreen2';
import SettingsScreen from './screens/SettingsScreen';
import GameScreen from './screens/GameScreen';
import Minigame from './screens/Minigame/Minigame';
import LandPollution from './screens/Levels/LandPollution';
import Pollution from './screens/Levels/Pollution';
import RecyclingWastes from './screens/Levels/RecyclingWastes';
import LeaderboardScreen from './screens/LeaderboardsScreen';
import DiaryScreen from './screens/DiaryScreen';
import EditScreen from './screens/EditScreen';
import QuizScreen from './screens/Quizzes/QuizScreen';
import UserScreen from './screens/UserScreen';
import QuizScreen1 from './screens/Quizzes/QuizScreen1';
import QuizScreen2 from './screens/Quizzes/QuizScreen2';
import AudioScreen from './screens/AudioScreen';

const Stack = createStackNavigator();

export default function App() {
  const soundRef = useRef(null);
  const [volume, setVolume] = useState(0.5); // Default volume set to 50%
  const [isPlaying, setIsPlaying] = useState(true); // Start playing as soon as the app opens
  const [isLooping, setIsLooping] = useState(true);
  const [ttsVolume, setTtsVolume] = useState(1.0); // Default TTS volume set to full

  useEffect(() => {
    const loadAudio = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('./assets/music.mp3'), // Adjust the path as necessary
        { shouldPlay: isPlaying, isLooping: isLooping }
      );
      soundRef.current = sound;
      await sound.setVolumeAsync(volume); // Set initial volume
      if (isPlaying) {
        await sound.playAsync(); // Start playback if isPlaying is true
      }
    };

    loadAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(volume); // Update volume if it changes
    }
  }, [volume]);

  // Play/Pause functionality
  const togglePlayPause = async () => {
    setIsPlaying(prev => !prev);
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    }
  };

  // Toggle looping
  const toggleLooping = async () => {
    setIsLooping(prev => !prev);
    if (soundRef.current) {
      await soundRef.current.setIsLoopingAsync(!isLooping);
    }
  };

  // Toggle TTS volume
  const toggleTtsVolume = () => {
    setTtsVolume(prev => (prev === 1.0 ? 0.0 : 1.0));
  };


  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Signup" 
            component={SignUpScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Camera" 
            options={{ headerShown: false }}
            >
              {props => (
                <CameraScreen
                  {...props}
                  ttsVolume={ttsVolume}
                />
              )}
          </Stack.Screen>
          <Stack.Screen 
            name="Camera1" 
            options={{ headerShown: false }}
            >
              {props => (
                <CameraScreen1
                  {...props}
                  ttsVolume={ttsVolume}
                />
              )}
          </Stack.Screen>
          <Stack.Screen 
            name="Camera2" 
            options={{ headerShown: false }}
            >
              {props => (
                <CameraScreen2
                  {...props}
                  ttsVolume={ttsVolume}
                />
              )}
          </Stack.Screen>
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Store"
            component={StoreScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup2"
            component={SignUpScreen2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Land Pollution" 
            component={LandPollution} 
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Diary"
            component={DiaryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Edit"
            component={EditScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="User"
            component={UserScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Recycling Wastes"
            component={RecyclingWastes}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Minigame"
            component={Minigame}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Quiz1"
            component={QuizScreen1}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Quiz2"
            component={QuizScreen2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Pollution"
            component={Pollution}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Audio"
            options={{ headerShown: false }}
          >
            {props => (
              <AudioScreen
                {...props}
                volume={volume}
                setVolume={setVolume}
                isPlaying={isPlaying}
                togglePlayPause={togglePlayPause}
                isLooping={isLooping}
                toggleLooping={toggleLooping}
                ttsVolume={ttsVolume}
                toggleTtsVolume={toggleTtsVolume}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
  );
}