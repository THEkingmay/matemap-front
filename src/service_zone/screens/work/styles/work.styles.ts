import { StyleSheet } from "react-native";
import { FONT, MainColor } from "../../../../../constant/theme";

export const workStyles = StyleSheet.create({
  /* ===== Layout ===== */
  container: {
    flex: 1,
    paddingBottom: 100,
  },

  listContent: {
    padding: 16,
    paddingBottom: 90,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
    fontFamily: FONT.BOLD,
  },

  /* ===== Card ===== */
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  serviceName: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
    color: "#64748B",
  },

  destination: {
    fontSize: 17,
    fontFamily: FONT.BOLD,
    color: "#0F172A",
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  statusText: {
    fontFamily: FONT.BOLD,
    textAlign: "center",
  },

  /* ===== Route ===== */
  routeBox: {
    marginTop: 12,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 14,
  },

  routeLabel: {
    fontSize: 12,
    fontFamily: FONT.REGULAR,
    color: "#94A3B8",
  },

  routeText: {
    fontFamily: FONT.BOLD,
    color: "#334155",
  },

  /* ===== Customer ===== */
  customerBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  customerInfo: {
    flex: 1,
  },

  customerName: {
    fontFamily: FONT.BOLD,
    color: "#0F172A",
  },

  telText: {
    marginTop: 4,
    fontSize: 13,
    color: "#475569",
    fontFamily: FONT.REGULAR,
  },

  /* ===== Time ===== */
  timeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 12,
  },

  infoLabel: {
    fontSize: 12,
    fontFamily: FONT.REGULAR,
    color: "#64748B",
  },

  infoValue: {
    fontSize: 13,
    fontFamily: FONT.BOLD,
    color: "#0F172A",
    marginTop: 2,
  },

  /* ===== Detail ===== */
  detail: {
    marginTop: 12,
    color: "#475569",
    lineHeight: 20,
    fontFamily: FONT.REGULAR,
  },

  /* ===== Actions ===== */
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontFamily: FONT.BOLD,
  },

  /* ===== Filter ===== */
  filterBar: {
    flexDirection: "row",
    backgroundColor: "#e9e9e9",
    margin: 16,
    borderRadius: 14,
    padding: 4,
  },

  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  filterBtnActive: {
    backgroundColor: MainColor,
    elevation: 2,
  },

  filterText: {
    fontFamily: FONT.BOLD,
  },
});
