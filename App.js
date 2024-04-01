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
      </Stack.Navigator>
    </NavigationContainer>
  );
}