import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { KU_GREEN } from '../../../constant/theme';
import { ServiceTabsParamsList } from '../ServiceMainTabs';

type props = BottomTabScreenProps<ServiceTabsParamsList , 'service'>

export default function ServiceScreen({navigation} : props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Managing Services</Text>
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