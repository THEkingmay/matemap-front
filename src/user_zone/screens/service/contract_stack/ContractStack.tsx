import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContractScreen from "./ContractScreen";
import ContractDetail from "./ContractDetail";

const Stack = createNativeStackNavigator();

export default function ContractStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="contractScreen">
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
