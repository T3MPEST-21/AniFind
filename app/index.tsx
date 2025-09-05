import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

const index = () => {

  const router = useRouter();
  //@ts-ignore
router.replace('/(tabs)/index');

  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})