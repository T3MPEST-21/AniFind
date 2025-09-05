import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'

const Saved = () => {
  return (
     <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background}}>
          <Text style={styles.text}>Your saved searches will be here</Text>
        </View>
      )
    }
    
    export default Saved;
    
    const styles = StyleSheet.create({
      text: {
        fontSize: hp(2),
        color: theme.textLight,
        fontFamily: 'Orbitron_600SemiBold',
      }
    })