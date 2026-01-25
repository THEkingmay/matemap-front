import { StyleSheet } from "react-native";
import { FONT, MainColor } from "../../../constant/theme";

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
    fontFamily: FONT.REGULAR,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingTop: 32,
  },

  cancel: {
    fontSize: 14,
    color: MainColor,
    fontFamily: FONT.REGULAR,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editText: {
    fontFamily: FONT.REGULAR,
    fontSize: 14,
    color: MainColor,
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
    backgroundColor: MainColor,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontFamily: FONT.BOLD,
    fontSize: 20,
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
    fontFamily: FONT.BOLD,
    fontSize: 16,
  },

  vehicleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  vehicleText: {
    fontFamily: FONT.REGULAR,
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
    fontFamily: FONT.BOLD,
    fontSize: 18,
    color: MainColor,
  },

  statTitle: {
    fontFamily: FONT.REGULAR,
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
    fontFamily: FONT.BOLD,
    fontSize: 16,
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
    fontFamily: FONT.BOLD,
  },

  reviewText: {
    fontFamily: FONT.REGULAR,
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
    fontFamily: FONT.REGULAR,
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
    fontFamily: FONT.REGULAR,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 6,
  },

  radioText: {
    fontFamily: FONT.REGULAR,
    fontSize: 14,
    color: "#111827",
  },

  saveBtn: {
    backgroundColor: MainColor,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  saveText: {
    fontFamily: FONT.BOLD,
    color: "#FFFFFF",
    fontSize: 16,
  },
});
