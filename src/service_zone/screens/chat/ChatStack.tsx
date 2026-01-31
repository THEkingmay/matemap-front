import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./ChatScreen";
import ChatIdScreen from "./ChatIdScreen";

export type ChatStackParamList = {
  ChatScreen: undefined;
  ChatIdScreen: { chatId: string };
};

const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ChatIdScreen" component={ChatIdScreen} />
    </Stack.Navigator>
  );
}

