import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ServiceScreen from "./ServiceScreen";
import ServiceDetail from "./ServiceDetail";

export type ServiceStackParamsList = {
    service : undefined , 
    service_detail : {service_id : string}
}

const Stacks = createNativeStackNavigator<ServiceStackParamsList>()

export default function ServiceStack(){
    return(
        <Stacks.Navigator>
            <Stacks.Screen name="service" component={ServiceScreen} />
            <Stacks.Screen name="service_detail" component={ServiceDetail} />
        </Stacks.Navigator>
    )
}

