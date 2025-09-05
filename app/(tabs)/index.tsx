import { StyleSheet, Text, View, ActivityIndicator, TextInput, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import Header from '@/components/Header'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import AppLoading from 'expo-app-loading';
import { useFonts, ZenTokyoZoo_400Regular } from '@expo-google-fonts/zen-tokyo-zoo'
import { Orbitron_400Regular, Orbitron_500Medium, Orbitron_600SemiBold, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import { Monoton_400Regular } from '@expo-google-fonts/monoton'
import { Bungee_400Regular } from '@expo-google-fonts/bungee'
import { Ionicons } from '@expo/vector-icons'

const Index = () => {
  const [input, setInput] = React.useState('')
  const [image, setImage] = React.useState('')
  const [fontsLoaded, error] = useFonts({
    ZenTokyoZoo_400Regular,
    Orbitron_400Regular,
    Orbitron_500Medium,
    Orbitron_600SemiBold,
    Orbitron_700Bold,
    Monoton_400Regular,
    Bungee_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  
  if (error) {
    return (
      <View style={styles.container1}>
        <Header title='AniFind' ShowBackButton={false} marginBottom={10} />
        <View style={styles.container2}>
          <Text style={styles.errorText}>Error loading fonts</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container1}>
  <Header title='AniFind' ShowBackButton={false} marginBottom={hp(2)} />
  <View style={styles.container2}>
    <Text style={styles.heading}>Search for an anime</Text>
    <View style={styles.searchBar}>
    <TextInput
              style={styles.input}
              placeholder="Describe the anime you want to find"
              placeholderTextColor="#8e8e8e9c"
              autoCapitalize="none"
              keyboardType="default"
              value={input}
              onChangeText={setInput}
            />
    </View>
    <View style={styles.uploadButton}>
      <TouchableOpacity><Text style={styles.buttonText}>search</Text></TouchableOpacity>
    </View>
    <Text style={styles.or}>Or, you can search with a video clip</Text>

    <View>
      <Pressable style={styles.searchVideo}>
        <Ionicons name='cloud-upload-outline' color={theme.textLight} size={60} />
        <Text style={[styles.buttonText, {fontSize: hp(2.5), marginTop: hp(1)}]}>Upload a short clip</Text>
      </Pressable>
      <TouchableOpacity style={[styles.uploadButton, {marginTop: hp(2), alignSelf: 'flex-end', width: wp(30)}]}><Text style={styles.buttonText}>Done</Text></TouchableOpacity>
    </View>
  </View>
</View>
  );
}

export default Index;

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: hp(4),
    color: theme.lightGray,
    fontFamily: 'Bungee_400Regular',
    marginBottom: hp(2),
  },
  searchBar: {
    width: '100%',
    height: hp(7),
    //backgroundColor: '#12283A',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginBottom: hp(2),
  },
  uploadButton: {
    backgroundColor: theme.accent,
    paddingVertical: hp(1.5),
    paddingHorizontal: hp(4),
    borderRadius: 10,
    marginBottom: hp(3),
  },
  buttonText: {
    color: theme.textLight,
    fontSize: hp(2),
    fontFamily: 'Orbitron_600SemiBold',
  },
  recentTitle: {
    fontSize: hp(2.5),
    color: theme.textLight,
    fontFamily: 'Orbitron_500Medium',
    marginBottom: hp(1),
  },
  recentItem: {
    fontSize: hp(2),
    color: theme.textMuted,
    fontFamily: 'Orbitron_400Regular',
    marginBottom: hp(0.5),
  },
  errorText: { 
    fontSize: hp(3), 
    color: theme.error, 
    fontFamily: 'Orbitron_400Regular', 
  },
  input: {
    flex: 1,
    fontSize: hp(2.2),
    color: theme.text,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 10,
    height: hp(10),
    width: wp(90),
    borderRadius: 10,
    borderColor: theme.textMuted,
    borderWidth: 1,
  },
  or: {
    marginTop: 10,
    fontSize: hp(2.4),
    color: theme.textMuted,
    fontFamily: 'Orbitron_600SemiBold',
  },
  searchVideo: {
    width: wp(80),
    height: wp(60),
    borderRadius: 10,
    backgroundColor: theme.btn,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
    marginTop: hp(7)
  }
});