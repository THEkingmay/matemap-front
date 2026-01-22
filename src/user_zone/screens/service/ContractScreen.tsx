import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KU_GREEN } from '../../../../constant/theme';


export default function ContractScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contract User</Text>
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