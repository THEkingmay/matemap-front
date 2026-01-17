import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

export type AuthStackParamsList = {
    login : undefined , 
    register : undefined
}

const Stack = createNativeStackNavigator<AuthStackParamsList>()

export default function AuthStack(){
    return(
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="login" component={LoginScreen}/>
            <Stack.Screen name="register" component={RegisterScreen}/>
        </Stack.Navigator>
    )
}