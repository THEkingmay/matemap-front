import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContractScreen from "./screen/ContractScreen";
import ContractDetail from "./screen/ContractDetail";

export type ContractStackParamList = {
  contractScreen: undefined;
  contractDetail: { id: string };
};

const Stack = createNativeStackNavigator<ContractStackParamList>();

export default function ContractStack() {
  return (
    <Stack.Navigator
      initialRouteName="contractScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="contractScreen"
        component={ContractScreen}
      />
      <Stack.Screen
        name="contractDetail"
        component={ContractDetail}
      />
 
    </Stack.Navigator>
  );
}
