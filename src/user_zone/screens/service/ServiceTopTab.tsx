import React from 'react';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Imports: จัดกลุ่มให้ชัดเจน
import DormStack from './dorm_stack/DormStack';
import ServiceStack from "./service_stack/ServiceStack";
import { FONT, MainColor } from '../../../../constant/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import ContractStack from './contract_stack/ContractStack';

// Types: ใช้ PascalCase ตาม Convention สากล
export type ServiceTabParamList = {
  ContractStack: undefined;
  DormStack: undefined;
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
        lazy: true, // ให้โหลดเมื่อกด หรือเลื่อนมาถึงเท่านั้น
        lazyPreloadDistance: 0, // ไม่ต้องโหลดหน้าข้างๆ ล่วงหน้า (0 = โหลดเฉพาะหน้าปัจจุบัน)
      }}
    >
      <Tab.Screen 
        name="ContractStack" 
        component={ContractStack} 
        options={{ tabBarLabel: 'สัญญา' }} 
      />
      <Tab.Screen 
        name="DormStack" 
        component={DormStack} 
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