import React from 'react';
import { Text, View } from 'react-native';
import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import { theme } from '../../constants/theme';




export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textLight,
        tabBarStyle: {
          backgroundColor: theme.text,
          borderTopWidth: 0,
          position : 'absolute',
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 5,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        },
    }}>
      <Tabs.Screen name="index" options={{
        tabBarIcon: ({color, size}) => <Ionicons name="home" size={size} color={color} /> 
      }} />
      <Tabs.Screen name="History" options={{
        tabBarIcon: ({color, size}) => <Ionicons name="time" size={size} color={color} /> 
      }} />
      <Tabs.Screen name="Saved" options={{
        tabBarIcon: ({color, size}) => <Ionicons name="save" size={size} color={color} /> 
      }} />
      <Tabs.Screen name="Profile" options={{
        tabBarIcon: ({color, size}) => <Ionicons name="person" size={size} color={color} /> 
      }} />
    </Tabs>
  );
}
 