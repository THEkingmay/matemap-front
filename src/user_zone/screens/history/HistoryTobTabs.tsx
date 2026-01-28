import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FONT, MainColor } from "../../../../constant/theme";
import { SafeAreaView } from "react-native-safe-area-context";

import HistoryDormStack from "./dorm_stack/HistoryDormStack";
import HistoryServiecStack from "./service_stack/ServiceStack";

export type HistoryTopTabParamsLists = {
    dormStack : undefined
    serviceStack : undefined
}

const Tab = createMaterialTopTabNavigator<HistoryTopTabParamsLists>()

export default function HistoryTopTabs(){
    return(
        <SafeAreaView style={{flex :1}}>
        <Tab.Navigator
            screenOptions={{
                // 1. Visual Styling: ตกแต่งให้ดู Modern
                tabBarActiveTintColor: MainColor, 
                tabBarInactiveTintColor: '#8E8E93', // สีเทาเมื่อไม่ได้เลือก
                tabBarStyle: { 
                backgroundColor: '#FFFFFF',
                elevation: 4, // เพิ่มเงาเล็กน้อย (Android)
                shadowOpacity: 0.1, // เพิ่มเงา (iOS)
                },
                tabBarIndicatorStyle: {
                backgroundColor:MainColor,
                height: 3, // เส้นขีดด้านล่างหนาขึ้นเล็กน้อย
                borderRadius: 3,
                },
                tabBarLabelStyle: {
                
                fontSize: 14,
                fontFamily :FONT.BOLD
                },
                
            }}
            >
            <Tab.Screen name="dormStack" component={HistoryDormStack} options={{ tabBarLabel: 'ประวัติการโพสต์' }}  />
            <Tab.Screen name="serviceStack" component={HistoryServiecStack} options={{ tabBarLabel: 'ประวัติการใช้บริการ' }}  />
        </Tab.Navigator>
        </SafeAreaView>
    )
}

