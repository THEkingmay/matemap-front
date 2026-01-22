import ContractScreen from "./ContractScreen"
import DormScreen from "./DormScreens"
import ServiceStack from "./service_stack/ServiceStack";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

export type ServiceTabParamList = {
  contract: undefined;
  dorm: undefined;
  service_stack: undefined;
};

const TopTabs= createMaterialTopTabNavigator<ServiceTabParamList>()


export default function ServiceTopTabs(){
    return(
        <TopTabs.Navigator>
            <TopTabs.Screen name="contract" component={ContractScreen} />
            <TopTabs.Screen name='dorm' component={DormScreen} />
            <TopTabs.Screen name='service_stack' component={ServiceStack} />
        </TopTabs.Navigator>
    )
}