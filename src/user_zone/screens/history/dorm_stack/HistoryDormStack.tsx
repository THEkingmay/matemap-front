import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HistoryUserPost from "./screen/HistoryUserPost"

export type HistoryDormStackParamsList = {
   history_post : undefined
}

const Stack = createNativeStackNavigator<HistoryDormStackParamsList>()
export default function HistoryDormStack(){
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="history_post" component={HistoryUserPost}/>
        </Stack.Navigator>
    )
}