import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONT } from "../../../constant/theme";

type LogoutButtonProps = {
  onLogout: () => void;
};

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const handleLogout = () => {
      Alert.alert(
        "ออกจากระบบ",
        "คุณต้องการออกจากระบบใช่หรือไม่?",
        [
          { text: "ยกเลิก", style: "cancel" },
          { text: "ใช่, ออกจากระบบ", style: "destructive", onPress: onLogout },
        ]
      );
    };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Ionicons name="log-out-outline" size={20} color="#ffffff" />
      <Text style={styles.logoutText}>ออกจากระบบ</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    color: "#FEE2E2",
    fontWeight: "500",
  },
  /* ================== LOGOUT ================== */
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#FF3B30",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },

  logoutText: {
    fontFamily: FONT.BOLD,
    color: "#ffffff",
    fontSize: 16,
  },
});