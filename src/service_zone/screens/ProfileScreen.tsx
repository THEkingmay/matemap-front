import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { ServiceTabsParamsList } from '../ServiceMainTabs';
import { KU_GREEN } from '../../../constant/theme';
import CustomButton from '../../components/ActionButton';
import { useAuth } from '../../AuthProvider';

type props = BottomTabScreenProps<ServiceTabsParamsList , 'profile'>;

export default function ProfileScreen({navigation} : props) {
  const { logout } = useAuth();
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting Service</Text>
      <CustomButton 
              title='ออกจากระบบ' 
              theme='danger' 
              iconName='log-out-outline' 
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