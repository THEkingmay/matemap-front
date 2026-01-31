import { StyleSheet } from "react-native";
import { MainColor, FONT } from "../../../constant/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingBottom: 110
  },
  /* ===== 1. Shared Styles (ใช้ร่วมกัน) ===== */
  mainCard: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 24,
    marginHorizontal: 16,
    alignItems: "center",
    marginTop: -80,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    width: 115,
    height: 115,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFF",
    backgroundColor: "#F1F5F9",
  },

  avatarLoading: {
    position: 'absolute',
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avatarWarnText :  {
    fontSize: 12,
    fontFamily: FONT.REGULAR,
    color: "#64748B",
    textAlign: "center",
  },
  /* ===== 2. Edit Page Specific Styles (สำหรับหน้า Edit เท่านั้น) ===== */
  editHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  titleText: {
    fontFamily: FONT.BOLD, 
    fontSize: 16, 
    color: '#1E293B' 
  },
  saveBtnText: {
    backgroundColor: '#d6d4ff',
    color: '#4F46E5',
    fontFamily: FONT.BOLD,
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  cancelBtnText: {
    color: '#EF4444',
    fontFamily: FONT.REGULAR,
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  formSectionTitle: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
    color: "#1E293B",
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
    paddingLeft: 10,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
    fontFamily: FONT.BOLD,
  },
  textInputField: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontSize: 15,
    color: "#1E293B",
    fontFamily: FONT.REGULAR,
  },
  /* สไตล์ของ Radio Card ในหน้า Edit */
  jobOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  radioOptionActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  radioText: {
    marginLeft: 12,
    fontSize: 15,
    fontFamily: FONT.REGULAR,
    color: '#475569',
  },
  radioTextActive: {
    color: '#4F46E5',
    fontFamily: FONT.BOLD,
  },

  /* ===== 3. View Page Specific (หน้าแสดงผลคงเดิม) ===== */
  // ... (ส่วนอื่นๆ ของ ProfileView เช่น statsRow, tagBadge ยังคงเหมือนเดิม)
  actionButtonGroup: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  editFloatingBtn: { backgroundColor: "#4F46E5" },
  settingBtn: { backgroundColor: "#F1F5F9", marginRight: 10 },
  avatarWrapper: { 
    position: "relative", 
    marginBottom: 16, 
    alignItems: "center",     // เพิ่มส่วนนี้
    justifyContent: "center",  // เพิ่มส่วนนี้
  },
  statusBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#FFF",
  },
  name: { fontSize: 22, fontFamily: FONT.BOLD, color: "#1E293B" },
  tagBadge: { backgroundColor: "#EEF2FF", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  tagText: { color: "#4F46E5", fontSize: 12, fontFamily: FONT.BOLD },
  statsRow: { flexDirection: "row", marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderTopColor: "#F1F5F9", width: "100%" },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontFamily: FONT.BOLD, color: "#1E293B" },
  statLabel: { fontSize: 12, fontFamily: FONT.REGULAR,color: "#94A3B8", marginTop: 2 },
  vDivider: { width: 1, height: '80%', backgroundColor: '#F1F5F9', alignSelf: 'center' },
  sectionTitle: { fontSize: 16, fontFamily: FONT.BOLD, color: "#334155", marginTop: 24, marginHorizontal: 20, marginBottom: 8 },
  reviewer_name:{ fontFamily: FONT.BOLD, color: '#1E293B', fontSize: 16 },
  reviewer_comments: { color: '#64748B', fontSize: 13, lineHeight: 18, fontFamily: FONT.REGULAR },
    /* ===== Review Section ===== */
  serviceTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
  },

  reviewCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4F46E5",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  reviewerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
  },

  reviewerInfo: {
    flex: 1,
  },

  reviewerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },

  reviewServiceTag: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },

  reviewServiceText: {
    fontSize: 11,
    color: "#4338CA",
    fontFamily: FONT.BOLD,
  },

  reviewDate: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
    fontFamily: FONT.REGULAR,
  },

  ratingRow: {
    flexDirection: "row",
    marginLeft: 6,
  },

  loadMoreBtn: {
    alignSelf: "center",
    marginTop: 12,
  },

  loadMoreText: {
    color: "#4F46E5",
    fontFamily: FONT.BOLD,
  },

  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});