import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import EditPostScreen from "./EditPostScreen";

export type HomeStackParamsList = {
  home: undefined;
  editPost: {
    post: {
      id: string;
      dormId: string;
      rent_price: number;
      detail: string;
    };
  };
};

const Stack = createNativeStackNavigator<HomeStackParamsList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="editPost" component={EditPostScreen} />
    </Stack.Navigator>
  );
}
