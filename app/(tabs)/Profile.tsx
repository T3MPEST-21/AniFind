import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'

const Profile = () => {
  return (
     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background}}>
          <Text style={styles.text}>Profile</Text>
        </View>
      )
    }
    
    export default Profile;
    
    const styles = StyleSheet.create({
      text: {
        fontSize: hp(2),
        color: theme.textLight,
        fontFamily: 'Orbitron_600SemiBold',
      }
    })