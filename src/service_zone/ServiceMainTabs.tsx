import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { activeColor, FONT, MainColor } from '../../constant/theme';
import SubscriptionProvider from '../SubscriptionProvider';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import ChatStack from './screens/chat/ChatStack';
import ScheduleScreen from './screens/schedule/ScheduleScreen';
import WorkScreen from './screens/work/WorkScreen';
import ProfileStack from './screens/profile/ProfileStack';


export type ServiceTabsParamsList = {
  chat_stack: undefined;
  work: undefined;
  schedule: undefined;
  profile: undefined;
};

const TAB_ICONS: Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  chat_stack: {
    active: 'chatbubble',
    inactive: 'chatbubble-outline',
  },
  work: {
    active: 'time',
    inactive: 'time-outline',
  },
  schedule: {
    active: 'calendar',
    inactive: 'calendar-outline',
  },
  profile: {
    active: 'person',
    inactive: 'person-outline',
  },
};

const TAB_LABELS: Record<string, string> = {
  chat_stack: 'แชท',
  work: 'งาน',
  schedule: 'ตาราง',
  profile: 'โปรไฟล์',
};

const Tabs = createBottomTabNavigator<ServiceTabsParamsList>();

export default function ServiceMainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <SubscriptionProvider>
      <Tabs.Navigator
          screenOptions={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? '';

            const isHideTab =
              route.name === 'chat_stack' && routeName === 'chat_select';

            return {
              headerShown: false,
              tabBarShowLabel: false,
              tabBarActiveTintColor: activeColor,
              tabBarInactiveTintColor: '#fff',
              tabBarStyle: {
                position: 'absolute',
                bottom: insets.bottom,
                paddingTop: 10,
                paddingInline: 6,
                backgroundColor: MainColor,
                height: 65,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.15,
                shadowRadius: 3.5,
                borderTopWidth: 0,

                // ⭐ จุดสำคัญ
                display: isHideTab ? 'none' : 'flex',
              },

              tabBarIcon: ({ focused, color }) => {
                const icon =
                  TAB_ICONS[route.name]?.[focused ? 'active' : 'inactive'] ??
                  'alert-circle';

              return (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <Ionicons name={icon} size={28} color={color} />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 9,
                      marginTop: 2,
                      color,
                      fontFamily: FONT.REGULAR,
                    }}
                  >
                    {TAB_LABELS[route.name]}
                  </Text>
                </View>
              );
            },
          };
        }}
      >

        <Tabs.Screen name="work" component={WorkScreen} />
        <Tabs.Screen name="chat_stack" component={ChatStack} />
        <Tabs.Screen name="schedule" component={ScheduleScreen} />
        <Tabs.Screen name="profile" component={ProfileStack} />
      </Tabs.Navigator>
    </SubscriptionProvider>
  );
}
