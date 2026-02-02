import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MainColor,FONT } from "../../../../constant/theme";
import ActiveWorkScreen from "./screens/ActiveWorkScreen";
import HistoryScreen from "./screens/HistoryScreen";

const Tab = createMaterialTopTabNavigator();

export default function WorkTopTab() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      {/* คุมสี status bar ให้เข้ากับ tab */}
      <StatusBar style="light" />

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#FFF",
          },
          tabBarIndicatorStyle: {
            backgroundColor: MainColor,
            height: 3,
          },
          tabBarLabelStyle: {
            color: MainColor,
            fontFamily: FONT.BOLD
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#E0E7FF",
        }}
      >
        <Tab.Screen
          name="Active"
          component={ActiveWorkScreen}
          options={{ title: "รับงาน" }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: "ประวัติ" }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
