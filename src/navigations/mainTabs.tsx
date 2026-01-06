import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeTabs";

export interface MainTabsProp{
    home : undefined
}

const Tabs = createBottomTabNavigator()

export default function MainTabs(){
    return(
        <Tabs.Navigator>
            <Tabs.Screen name='home' component={HomeScreen} />
        </Tabs.Navigator>
    )
}