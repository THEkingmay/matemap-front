import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cancel: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },

  avatarWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  camera: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "#2563EB",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginVertical: 6,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: "600",
  },

  vehicleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  vehicleText: {
    fontSize: 14,
    color: "#6B7280",
  },

  statRow: {
    flexDirection: "row",
    marginVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },

  statTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },

  reviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  reviewItem: {
    flexDirection: "row",
    gap: 12,
  },

  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  reviewName: {
    fontWeight: "600",
  },

  reviewText: {
    fontSize: 13,
    color: "#374151",
    marginVertical: 2,
  },

  reviewStar: {
    color: "#F59E0B",
    fontSize: 14,
  },

  form: {
    marginTop: 16,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    fontSize: 15,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 6,
  },

  radioText: {
    fontSize: 14,
    color: "#111827",
  },

  saveBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
