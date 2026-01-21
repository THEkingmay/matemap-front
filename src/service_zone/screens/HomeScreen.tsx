import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { KU_GREEN } from '../../../constant/theme';
import { ServiceTabsParamsList } from '../ServiceMainTabs';

type props = BottomTabScreenProps<ServiceTabsParamsList , 'home'>

export default function HomeScreen({navigation} : props ) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Service's Page</Text>
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