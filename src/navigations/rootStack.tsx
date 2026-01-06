import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../AuthProvider";

import AuthStack from "./authStack";
import MainTabs from "./mainTabs";

const Root = createNativeStackNavigator();

export default function RootStack() {
    const auth = useAuth();
    const id = auth?.id; 

    return (
        <NavigationContainer>
            <Root.Navigator screenOptions={{ headerShown: false }}>
                
                {id ? (
                    <Root.Screen name="Main" component={MainTabs} />
                ) : (
                    <Root.Screen name="Auth" component={AuthStack} />
                )}

            </Root.Navigator>
        </NavigationContainer>
    );
}