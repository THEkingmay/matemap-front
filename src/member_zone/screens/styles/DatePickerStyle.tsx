import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalContainer: {
    marginHorizontal: 20,
    marginTop: "30%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  weekText: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginVertical: 4,
  },
  dayCellActive: {
    backgroundColor: "#2563EB",
  },
  dayText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  dayTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  helperText: {
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
    paddingVertical: 10,
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  selectorBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  selectorText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  pickerPanel: {
    maxHeight: 220,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  pickerItemActive: {
    backgroundColor: "#EFF6FF",
  },

  pickerText: {
    fontSize: 15,
    color: "#111827",
  },

  pickerTextActive: {
    fontWeight: "700",
    color: "#2563EB",
  },
});
