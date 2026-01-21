import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatStackParamsList } from "./ChatStack";

type props = NativeStackScreenProps<ChatStackParamsList , 'chat_select'>


export default function ChatSelectId({navigation , route} : props){
    console.log(route.params)
    const  {room_id}   = route.params
    return(
        <View>
            <Text>Select ID : {room_id} ieie</Text>
        </View>
    )
}