import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./ProfileScreen";
import SettingScreen from "./Setting";
import { SafeAreaView } from "react-native-safe-area-context";

export type ProfileStackParamsList = {
    profile : undefined , 
    setting : undefined
}
const Stack = createNativeStackNavigator<ProfileStackParamsList>()

export default function ProfileStack(){
    return(
        <SafeAreaView style={{flex : 1}}>
            <Stack.Navigator screenOptions={{headerShown : false}}>
                <Stack.Screen name="profile" component={ProfileScreen} />
                <Stack.Screen name="setting" component={SettingScreen}/>
            </Stack.Navigator>
        </SafeAreaView>
    )
}