import { createNativeStackNavigator } from "@react-navigation/native-stack"

import HistoryUserPost from "./screen/HistoryUserPost"
import EditPostScreen from "./screen/EditPost"
import AddPostScreen from "./screen/AddPost"

import { Post } from "../../service/contract_stack/screen/ContractDetail"

export type HistoryDormStackParamsList = {
   history_post : undefined
   add_post : {onSuccess : ()=>void}
   edit_post : {oldPost : Post , onSuccess : () =>void}
}

const Stack = createNativeStackNavigator<HistoryDormStackParamsList>()
export default function HistoryDormStack(){
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="history_post" component={HistoryUserPost}/>
            <Stack.Screen name="edit_post" component={EditPostScreen}/>
            <Stack.Screen name="add_post" component={AddPostScreen}/>
        </Stack.Navigator>
    )
}