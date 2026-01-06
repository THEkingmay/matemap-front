import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen , RegisterScreen } from "../screens/AuthScreen";
import { NavigationProp } from "@react-navigation/native";

export interface AuthTabsProp {
    login : undefined , 
    register : undefined
}

const Stack = createNativeStackNavigator()


export default function AuthStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}