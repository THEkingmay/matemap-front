import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { UserTabsParamsList } from '../UserMainTabs';
import { KU_GREEN } from '../../../constant/theme';

type props = BottomTabScreenProps<UserTabsParamsList , 'dorm'>

export default function DormScreen({navigation} : props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dorm Screen</Text>
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