import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./ChatScreen";
import ChatSelectId from "./ChatIdScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export type ChatStackParamsList = {
    chat : undefined , 
    chat_select: {room_id : string}
}
const Stack = createNativeStackNavigator<ChatStackParamsList>()

export default function ChatStack(){
    return(
        <SafeAreaView style={{flex : 1}}>
            <Stack.Navigator screenOptions={{headerShown : false}}>
                <Stack.Screen  name="chat" component={ChatScreen} />
                <Stack.Screen name="chat_select" component={ChatSelectId} />
            </Stack.Navigator>
        </SafeAreaView>
    )
}