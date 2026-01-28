import { View, Text } from "react-native";
import { styles } from "../styles/profile_screen_styles";

export default function StatBox({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}