import { StyleSheet } from "react-native";
import { MainColor } from "../../../constant/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    paddingBottom: 120,
  },

  headerBackground: {
    height: 140,
    backgroundColor: MainColor,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  cancel: {
    color: "#ff0000",
    fontSize: 16,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editText: {
    color: MainColor,
    fontSize: 14,
  },

  avatarWrapper: {
    alignSelf: "center",
    marginTop: -50,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#fff",
  },

  editAvatarBtn: {
    position: "absolute",
    right: 4,
    bottom: 4,
    backgroundColor: MainColor,
    padding: 6,
    borderRadius: 999,
  },

  name: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 12,
    color: "#0F172A",
  },

  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
  },

  vehicleText: {
    color: "#64748B",
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    color: "#64748B",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  radioText: {
    color: "#0F172A",
  },

  saveFloating: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: MainColor,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
