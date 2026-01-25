import { Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../styles/profile.styles";

export default function Radio({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.radioRow} onPress={onPress}>
      <Ionicons
        name={active ? "radio-button-on" : "radio-button-off"}
        size={18}
        color="#2563EB"
      />
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );
}
