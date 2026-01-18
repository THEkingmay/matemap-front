import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { UserTabsParamsList } from '../UserMainTabs';
import { KU_GREEN } from '../../../constant/theme';

type props = BottomTabScreenProps<UserTabsParamsList , 'home'>

//  ดึง api เพื่อเอาการ์ดมาปัด สิบ คน
//  เหลือการ์ด สาม ใบจะดึง api ใหม่
//  ถ้าหมดก็ขึ้นหมดแล้ว

interface CardSwipe{
  id : string , 
  owner_id : string ,
  target_id : string ,
  action : 'like' | 'pass'
}

export default function HomeScreen({navigation}: props) {

  const [cards,setCards] = useState<CardSwipe[]>([])
 
  const get20SwipCards = async ()=>{

  }
  useEffect(()=>{
      get20SwipCards()
  },[])


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home User</Text>
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