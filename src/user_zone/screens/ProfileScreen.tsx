import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { UserTabsParamsList } from '../UserMainTabs';
import { KU_GREEN } from '../../../constant/theme';
import { useAuth } from '../../AuthProvider';
import CustomButton from '../../components/ActionButton';

type props = BottomTabScreenProps<UserTabsParamsList , 'profile'>

export default function ProfileScreen({navigation} : props) {
   const {logout} = useAuth()
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile User</Text>
      <CustomButton 
        title='logout' 
        theme='danger' 
        iconName='arrow-back-circle'
        onPress={logout}
      />
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