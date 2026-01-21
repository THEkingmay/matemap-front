import React, { act } from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from "./screens/HomeScreen";
import ChatStack from './screens/chat/ChatStack';
import ContractScreen from './screens/ContractScreen';
import ProfileScreen from './screens/ProfileScreen';
import ServiceScreen from './screens/ServiceScreen';
import DormScreen from './screens/DormScreens';
import SettingScreen from "./screens/Setting";

import { activeColor, FONT, MainColor } from '../../constant/theme';

export type UserTabsParamsList = {
    home: undefined; // explore screen
    contract: undefined;
    dorm: undefined;
    chat_stack: undefined;
    service: undefined;
    profile: undefined;
    setting: undefined;
}

const TAB_ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  home: {
    active: 'search',
    inactive: 'search-outline',
  },
  contract: {
    active: 'megaphone',
    inactive: 'megaphone-outline',
  },
  chat_stack: {
    active: 'chatbubble',
    inactive: 'chatbubble-outline',
  },
  service: {
    active: 'list',
    inactive: 'list-outline',
  },
  dorm: {
    active: 'business',
    inactive: 'business-outline',
  },
  profile: {
    active: 'person',
    inactive: 'person-outline',
  },
};

const TAB_LABELS: Record<string, string> = {
  home: 'รูมเมท',
  chat_stack: 'แชท',
  contract: 'สัญญา',
  dorm: 'หอพัก',
  service: 'บริการ',
  profile: 'โปรไฟล์',
};

const Tabs = createBottomTabNavigator<UserTabsParamsList>();

export default function UserMainTabs() {
    // 2. เรียกใช้ hook เพื่อดึงค่าระยะขอบของเครื่องนั้นๆ
    const insets = useSafeAreaInsets();

    return (
        <Tabs.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: '#fff',
                
                tabBarStyle: {
                    position: 'absolute',
                    //  คำนวณระยะจากด้านล่าง: เอาพื้นที่ Safe Area บวกเพิ่มอีก 15 (หรือค่าที่คุณชอบ)
                    bottom: insets.bottom, 
                    
                    paddingTop : 10,
                    paddingInline: 5,
                    backgroundColor: MainColor,
                    // borderRadius: 15,
                    height: 65, 
                    
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 5,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 3.5,
                
                    paddingBottom: 0, 
                    borderTopWidth: 0, 
                },

                tabBarIcon: ({ focused, color, size }) => {
                    const icon =
                    TAB_ICONS[route.name]?.[focused ? 'active' : 'inactive'] ??
                    'alert-circle';

                    return (
                        <View style={{
                            // 5. ใช้ Flexbox จัดกึ่งกลางแทนการดัน Top
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%', // ให้ View เต็มความสูงของ Tab Bar
                            width: '100%',
                        }}>
                        <Ionicons name={icon} size={28} color={color} />
                        <Text
                            style={{
                                fontSize: 10,
                                marginTop: 2,
                                color,
                                fontFamily :FONT.REGULAR
                            }}
                            >
                            {TAB_LABELS[route.name]}
                        </Text>
                    </View>
                    );
                },
            })}
        >
            <Tabs.Screen name="home" component={HomeScreen} />
            <Tabs.Screen name="contract" component={ContractScreen} />
            <Tabs.Screen name="chat_stack" component={ChatStack} />
            <Tabs.Screen name="service" component={ServiceScreen} />
            <Tabs.Screen name="dorm" component={DormScreen} />
            <Tabs.Screen name="profile" component={ProfileScreen} />
            {/* <Tabs.Screen name="setting" component={SettingScreen} /> */}
        </Tabs.Navigator>
    );
}