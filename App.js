import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CameraScreen from './screens/CameraScreen';
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

const Stack = createStackNavigator();

export default function App() {
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
          component={CameraScreen} 
          options={{ headerShown: false }}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}