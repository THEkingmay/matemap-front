import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DormPostScreen from "./screen/DormPostScreens";
import DormPostSelect from "./screen/DormPostSelect";

import type { DormPostScreenType } from "./screen/DormPostScreens";

export type DormStackParamsList = {
    dormPostScreen : undefined
    dormPostSelect : {dorm_post : DormPostScreenType}
}

const Stack = createNativeStackNavigator<DormStackParamsList>()

export default function DormStack(){
    return(
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="dormPostScreen" component={DormPostScreen} />
            <Stack.Screen name="dormPostSelect" component={DormPostSelect} />
        </Stack.Navigator>
    )
}