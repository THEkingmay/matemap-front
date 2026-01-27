import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  searchBar: {
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  searchText: {
    color: "#999999",
    fontSize: 14,
    fontFamily: "Kanit_400Regular",
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D9D9D9",
    marginRight: 12,
  },

  chatContent: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontFamily: "Kanit_600SemiBold",
    color: "#000",
    marginBottom: 2,
  },

  message: {
    fontSize: 14,
    fontFamily: "Kanit_400Regular",
    color: "#777777",
  },

  time: {
    fontSize: 12,
    fontFamily: "Kanit_400Regular",
    color: "#AAAAAA",
    marginLeft: 8,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontFamily: "Kanit_600SemiBold",
    color: "#555",
  },
  centerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
