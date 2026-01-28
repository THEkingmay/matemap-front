import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServiceScreen from "./screen/ServiceScreen";
import ServiceDetail from "./screen/ServiceDetail";
import ServiceUserId from "./screen/ServiceUserId";

export type ServiceStackParamsList = {
    serviceScreen : undefined , 
    serviceDetail : {service_id : string}
    serviceUseId: {user_id : string}
}

const Stacks = createNativeStackNavigator<ServiceStackParamsList>()

export default function ServiceStack(){
    return(
        <Stacks.Navigator screenOptions={{headerShown : false}}>
            <Stacks.Screen name="serviceScreen" component={ServiceScreen} />
            <Stacks.Screen name="serviceDetail" component={ServiceDetail} />
            <Stacks.Screen name="serviceUseId" component={ServiceUserId} />
        </Stacks.Navigator>
    )
}

