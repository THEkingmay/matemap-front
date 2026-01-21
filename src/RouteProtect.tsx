// ใช้แยกหน้าระหว่าง user , member
import MemberMainTabs from "./member_zone/MemberMainTabs";
import UserMainTabs from "./user_zone/UserMainTabs";
import AuthStack from "./authentication/AuthStack";

import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "./AuthProvider";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServiceMainTabs from "./service_zone/ServiceMainTabs";
const RouteStack = createNativeStackNavigator()

export default function RouteProtect(){
    const {user} = useAuth();

    return(
        <NavigationContainer>
            <RouteStack.Navigator screenOptions={{headerShown : false}}>
                {!user && (
                    <RouteStack.Screen name="auth" component={AuthStack} />
                )}

                {user?.role === 'user' && (
                    <RouteStack.Screen name="user" component={UserMainTabs} />
                )}

                {user?.role === 'member' && (
                    <RouteStack.Screen name="member" component={MemberMainTabs} />
                )}

                {user?.role === 'service' && (
                    <RouteStack.Screen name="service" component={ServiceMainTabs} />
                )}
            </RouteStack.Navigator>
        </NavigationContainer>
    )
}