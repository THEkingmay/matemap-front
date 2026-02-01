import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkTopTab from "./WorkTopTab";

const Stack = createNativeStackNavigator();

export default function WorkStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkMain" component={WorkTopTab} />
    </Stack.Navigator>
  );
}