import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Imports: จัดกลุ่มให้ชัดเจน
import ContractScreen from "./ContractScreen";
import DormScreen from "./DormScreens";
import ServiceStack from "./service_stack/ServiceStack";
import { FONT, MainColor } from '../../../../constant/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types: ใช้ PascalCase ตาม Convention สากล
export type ServiceTabParamList = {
  Contract: undefined;
  Dorm: undefined;
  ServiceStack: undefined;
};

const Tab = createMaterialTopTabNavigator<ServiceTabParamList>();

export default function ServiceTopTabs() {
  return (
    <SafeAreaView style={{flex :1}}>
    <Tab.Navigator
      screenOptions={{
        // 1. Visual Styling: ตกแต่งให้ดู Modern
        tabBarActiveTintColor: MainColor, 
        tabBarInactiveTintColor: '#8E8E93', // สีเทาเมื่อไม่ได้เลือก
        tabBarStyle: { 
          backgroundColor: '#FFFFFF',
          elevation: 4, // เพิ่มเงาเล็กน้อย (Android)
          shadowOpacity: 0.1, // เพิ่มเงา (iOS)
        },
        tabBarIndicatorStyle: {
          backgroundColor:MainColor,
          height: 3, // เส้นขีดด้านล่างหนาขึ้นเล็กน้อย
          borderRadius: 3,
        },
        tabBarLabelStyle: {
        
          fontSize: 14,
          fontWeight: '600',
        fontFamily :FONT.BOLD
        },
        
      }}
    >
      <Tab.Screen 
        name="Contract" 
        component={ContractScreen} 
        options={{ tabBarLabel: 'สัญญา' }} 
      />
      <Tab.Screen 
        name="Dorm" 
        component={DormScreen} 
        options={{ tabBarLabel: 'หอพัก' }} 
      />
      <Tab.Screen 
        name="ServiceStack" 
        component={ServiceStack} 
        options={{ tabBarLabel: 'บริการ' }} 
      />
    </Tab.Navigator>
         
    </SafeAreaView>
  );
}