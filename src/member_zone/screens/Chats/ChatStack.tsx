import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./ChatMember";
import ChatMemberID from "./ChatMemberIDScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export type ChatStackParamsList = {
  chat_list: undefined;
  chat_member_id: {
    roomId: string;
    partnerName: string;
  };
};
const Stack = createNativeStackNavigator<ChatStackParamsList>();

export default function ChatStack() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="chat_list" component={ChatScreen} />
        <Stack.Screen name="chat_member_id" component={ChatMemberID} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
