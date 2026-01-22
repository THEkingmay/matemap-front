import Ionicons from '@expo/vector-icons/Ionicons';
import React, { act } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { activeColor, FONT, MainColor } from '../../constant/theme';

import HomeScreen from "./screens/HomeScreen";
import ChatScreen from './screens/ChatScreen';
import ServiceScreen from './screens/ServiceScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingScreen from './screens/ProfileScreen';

import SubscriptionProvider from '../SubscriptionProvider';


export type ServiceTabsParamsList = {
    home: undefined; 
    chat: undefined;
    service: undefined;
    profile: undefined;
    setting: undefined;
}

const TAB_ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  home: {
    active: 'home',
    inactive: 'home-outline',
  },
  chat: {
    active: 'chatbubble',
    inactive: 'chatbubble-outline',
  },
  service: {
    active: 'list',
    inactive: 'list-outline',
  },
  profile: {
    active: 'person',
    inactive: 'person-outline',
  },
};

const TAB_LABELS: Record<string, string> = {
  home: 'หน้าหลัก',
  chat: 'แชท',
  service: 'บริการ',
  profile: 'โปรไฟล์',
};

const Tabs = createBottomTabNavigator<ServiceTabsParamsList>();

export default function ServiceMainTabs() {
    // 2. เรียกใช้ hook เพื่อดึงค่าระยะขอบของเครื่องนั้นๆ
    const insets = useSafeAreaInsets();

    return (
        <SubscriptionProvider>
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
                                fontSize: 9,
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
            <Tabs.Screen name="chat" component={ChatScreen} />
            <Tabs.Screen name="service" component={ServiceScreen} />
            <Tabs.Screen name="profile" component={ProfileScreen} />
        </Tabs.Navigator>
        </SubscriptionProvider>
    );
}