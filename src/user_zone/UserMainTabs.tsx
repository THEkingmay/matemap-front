import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from "./screens/HomeScreen";
import SettingScreen from "./screens/Setting";
import { KU_GREEN } from '../../constant/theme';

export type UserTabsParamsList = {
    home: undefined;
    setting: undefined;
}

const Tabs = createBottomTabNavigator<UserTabsParamsList>();

export default function UserMainTabs() {
    // 2. เรียกใช้ hook เพื่อดึงค่าระยะขอบของเครื่องนั้นๆ
    const insets = useSafeAreaInsets();

    return (
        <Tabs.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: KU_GREEN,
                tabBarInactiveTintColor: '#9CA3AF',
                
                tabBarStyle: {
                    position: 'absolute',
                    //  คำนวณระยะจากด้านล่าง: เอาพื้นที่ Safe Area บวกเพิ่มอีก 15 (หรือค่าที่คุณชอบ)
                    bottom: insets.bottom, 
                    
                    paddingTop : 10,
                    backgroundColor: '#ffffff',
                    borderRadius: 15,
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
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'setting') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else {
                        iconName = 'alert-circle';
                    }

                    return (
                        <View style={{
                            // 5. ใช้ Flexbox จัดกึ่งกลางแทนการดัน Top
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%', // ให้ View เต็มความสูงของ Tab Bar
                            width: '100%',
                        }}>
                            <Ionicons name={iconName} size={28} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tabs.Screen name="home" component={HomeScreen} />
            <Tabs.Screen name="setting" component={SettingScreen} />
        </Tabs.Navigator>
    );
}