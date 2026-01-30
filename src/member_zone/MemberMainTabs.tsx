import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "./screens/Home/HomeScreen";
import ProfileScreen from "./screens/ProfileMember/ProfileScreen";
import CreatePost from "./screens/Posts/CreatePost";

import SubscriptionProvider from "../SubscriptionProvider";
import { MainColor } from "../../constant/theme";
import ChatStack from "./screens/Chats/ChatStack";

export type MemberTabsParamsList = {
  home: undefined;
  create: undefined;
  chat: undefined;
  profile: undefined;
};

const Tabs = createBottomTabNavigator<MemberTabsParamsList>();

export default function MemberMainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <SubscriptionProvider>
      <Tabs.Navigator
        initialRouteName="home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: MainColor,
          tabBarInactiveTintColor: "#9CA3AF",

          tabBarStyle: {
            paddingTop: 10,
            backgroundColor: "#ffffff",
            height: 65 + insets.bottom,
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.15,
            shadowRadius: 3.5,
            borderTopWidth: 0,
          },

          tabBarIcon: ({ focused, color }) => {
            /* ---------- CREATE (+) ---------- */
            if (route.name === "create") {
              return (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: MainColor,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="add" size={26} color="#fff" />
                </View>
              );
            }

            /* ---------- ICON MAPPING ---------- */
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === "home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "chat") {
              iconName = focused ? "chatbubble" : "chatbubble-outline";
            } else {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName} size={26} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="home" component={HomeScreen} />
        <Tabs.Screen name="chat" component={ChatStack} />
        <Tabs.Screen name="create" component={CreatePost} />
        <Tabs.Screen name="profile" component={ProfileScreen} />
      </Tabs.Navigator>
    </SubscriptionProvider>
  );
}
