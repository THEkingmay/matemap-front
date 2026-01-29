import { StyleSheet } from "react-native";
import { MainColor, FONT } from "../../../constant/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ===== Header (พื้นหลัง) ===== */
  headerBackground: {
    position: "absolute",   // ⭐ สำคัญที่สุด
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: MainColor,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  /* ===== Scroll content (ลอยบน header) ===== */
  content: {
    marginTop: 120,
    paddingBottom: 120,
  },

  /* ===== Shared Card ===== */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: -50,        // 👈 avatar ลอยขึ้นจากการ์ด (เหมือนในรูป)
    marginBottom: 8,
    borderWidth: 3,
    borderColor: "#fff",
  },

  textTitle: {
    fontSize: 18,
    fontFamily: FONT.BOLD,
    color: "#0F172A",
    textAlign: "center",
  },

  textSub: {
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
});
