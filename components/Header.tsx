import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import BackButton from './BackButton';
import { second, theme } from '@/constants/theme';
import { hp } from '@/helpers/common';
import {useFonts, ZenTokyoZoo_400Regular} from '@expo-google-fonts/zen-tokyo-zoo';
import {Bungee_400Regular} from '@expo-google-fonts/bungee';
import AppLoading from 'expo-app-loading/build/AppLoading';


interface HeaderProps {
  title: string;
  ShowBackButton: boolean;
  marginBottom: number;
}
export default function Header({ title, ShowBackButton, marginBottom }: HeaderProps) {
  const router = useRouter();

  const [fontsLoaded] = useFonts({ ZenTokyoZoo_400Regular, Bungee_400Regular });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  

  return (
    <View style={[styles.container, { marginBottom }]}>
      {ShowBackButton && <BackButton onPress={() => router.back()} style={styles.backButton}/>}
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7, // Add padding to the container
    marginTop: 5,
  },
  title: {
    fontSize: hp(3.7),
    fontFamily: 'Bungee_400Regular',
    color: theme.placeholder,
  },
  backButton: {
    position: 'absolute',
    left: 5,
    top: 3,
  },
})