import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { UserTabsParamsList } from '../UserMainTabs';
import { KU_GREEN } from '../../../constant/theme';

type props = BottomTabScreenProps<UserTabsParamsList , 'chat'>

export default function ChatScreen({navigation} : props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Screen</Text>
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