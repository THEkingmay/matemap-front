import { createNativeStackNavigator } from "@react-navigation/native-stack"

import ServiceHistory from "./screen/ServiceHistory"

export type HistoryServiecStackParamsList = {
   service_history : undefined
}

const Stack = createNativeStackNavigator<HistoryServiecStackParamsList>()
export default function HistoryServiecStack(){
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="service_history" component={ServiceHistory}/>
        </Stack.Navigator>
    )
}