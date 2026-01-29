import { StyleSheet } from "react-native";
import { MainColor } from "../../../../constant/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  header: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontFamily: "Kanit_700Bold",
  },

  subtitle: {
    color: "#666",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },

  label: {
    marginTop: 16,
    marginBottom: 6,
    fontFamily: "Kanit_600SemiBold",
  },

  uploadBox: {
    height: 120,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#CBD5E1",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  uploadText: {
    marginTop: 6,
    color: "#9CA3AF",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  facilityWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  facilityItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
    marginBottom: 8,
  },

  facilityActive: {
    backgroundColor: MainColor,
    borderColor: MainColor,
  },

  facilityText: {
    color: "#000",
    fontSize: 13,
  },

  facilityTextActive: {
    color: "#fff",
  },

  submitBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },

  submitText: {
    color: "#fff",
    fontFamily: "Kanit_700Bold",
  },

  clearBtn: {
    alignItems: "center",
    marginTop: 12,
  },

  clearText: {
    color: "#6B7280",
  },
  inputGroup: {
    marginTop: 20,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  dateIcon: {
    marginRight: 8,
  },
  section: {
    paddingTop: 8,
  },
  labelDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  triggerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  triggerText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
});
