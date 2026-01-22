import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KU_GREEN } from '../../../../constant/theme';
import type { ProfileStackParamsList } from './ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type props = NativeStackScreenProps<ProfileStackParamsList , 'setting'>

export default function SettingScreen({navigation} : props) {

 
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting User</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  text: {
    fontFamily: 'Kanit_700Bold', 
    fontSize: 24,
    color: KU_GREEN, 
  }
});