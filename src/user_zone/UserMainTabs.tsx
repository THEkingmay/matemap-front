import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from "./screens/HomeScreen";
import ChatStack from './screens/chat/ChatStack';
import ServiceTopTabs from './screens/service/ServiceTopTab';
import ProfileStack from './screens/profile/ProfileStack';

import { activeColor, FONT, MainColor } from '../../constant/theme';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export type UserTabsParamsList = {
    home: undefined; // explore screen
    chat_stack: undefined;
    service_toptab : undefined; 
    profile_stack : undefined;
}

// แก้ไข Key ให้ตรงกับ name ใน Tabs.Screen
const TAB_ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  home: {
    active: 'search',
    inactive: 'search-outline',
  },
  chat_stack: {
    active: 'chatbubble',
    inactive: 'chatbubble-outline',
  },
  // แก้จาก 'service' เป็น 'service_toptab'
  service_toptab: {
    active: 'list',
    inactive: 'list-outline',
  },
  // แก้จาก 'profile' เป็น 'profile_stack'
  profile_stack: {
    active: 'person',
    inactive: 'person-outline',
  },
};

// แก้ไข Key ให้ตรงกับ name ใน Tabs.Screen เช่นกัน
const TAB_LABELS: Record<string, string> = {
  home: 'รูมเมท',
  chat_stack: 'แชท',
  service_toptab: 'บริการ', // แก้ชื่อ Key
  profile_stack: 'โปรไฟล์', // แก้ชื่อ Key
};

const Tabs = createBottomTabNavigator<UserTabsParamsList>();

export default function UserMainTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs.Navigator
            screenOptions={({ route }) => {

                const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                
                // เช็คว่าถ้าเป็น stack ของแชท และเข้าไปหน้า chat_select แล้ว ให้ซ่อน
                let tabDisplay: 'flex' | 'none' = 'flex';
                if (route.name === 'chat_stack' && routeName === 'chat_select') {
                    tabDisplay = 'none';
                }
                // ----------------------------------------------------

                return {
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: activeColor,
                    tabBarInactiveTintColor: '#fff',
                    
                    tabBarStyle: {
                        display: tabDisplay, // นำค่าที่เช็คมาใช้ตรงนี้
                        position: 'absolute',
                        bottom: insets.bottom, 
                        paddingTop : 15,
                        paddingHorizontal: 5,
                        backgroundColor: MainColor,
                        height: 65, 
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 5 },
                        shadowOpacity: 0.15,
                        shadowRadius: 3.5,
                        paddingBottom: 0, 
                        borderTopWidth: 0, 
                    },

                    tabBarIcon: ({ focused, color }) => {
                        const iconConfig = TAB_ICONS[route.name];
                        const iconName = iconConfig ? (focused ? iconConfig.active : iconConfig.inactive) : 'alert-circle';
                        const label = TAB_LABELS[route.name] || route.name;

                        return (
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                width: '100%',
                            }}>
                                <Ionicons name={iconName} size={28} color={color} />
                                <Text
                                    style={{
                                        fontSize: 10,
                                        marginTop: 2,
                                        color,
                                        fontFamily : FONT.REGULAR
                                    }}
                                >
                                    {label}
                                </Text>
                            </View>
                        );
                    },
                };
            }}
        >
            <Tabs.Screen name="home" component={HomeScreen} />
            <Tabs.Screen name="chat_stack" component={ChatStack} />
            <Tabs.Screen name='service_toptab' component={ServiceTopTabs} />
            <Tabs.Screen name="profile_stack" component={ProfileStack} />
        </Tabs.Navigator>
    );
}