import { Text } from "react-native";
import { styles } from "../styles/profile_screen_styles";

export default function Label({ title }: { title: string }) {
  return <Text style={styles.label}>{title}</Text>;
}
