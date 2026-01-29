import { StyleSheet } from "react-native";
import { MainColor, FONT } from "../../../../../../constant/theme";

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONT.BOLD, // เปลี่ยนจาก fontWeight: "bold"
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  // Service Card Style
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  serviceLabel: {
    fontSize: 12,
    color: "#888",
    fontFamily: FONT.REGULAR, // เพิ่ม Regular ให้ข้อความรอง
  },
  serviceName: {
    fontSize: 16,
    fontFamily: FONT.BOLD, // เปลี่ยนจาก fontWeight: "600"
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  // Input Styles
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontFamily: FONT.BOLD, // เปลี่ยนจาก fontWeight: "500" (หรือใช้ FONT.MEDIUM ถ้ามี)
    color: "#444",
    marginBottom: 8,
  },
  required: {
    color: "red",
    fontFamily: FONT.BOLD, // ควรหนาเหมือน label
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7F9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    color: "#333",
    fontFamily: FONT.REGULAR, // เพิ่ม Regular ให้ช่องกรอกข้อมูล
  },
  textArea: {
    backgroundColor: "#F5F7F9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minHeight: 100,
    textAlignVertical: "top",
    fontFamily: FONT.REGULAR, // เพิ่ม Regular
  },
  // Date Picker Mock Style
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F7F9',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 14,
    color: "#555",
    fontFamily: FONT.REGULAR, // เพิ่ม Regular
  },
  // Footer / Buttons
  modalFooter: {
    flexDirection: "row",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: MainColor,
    shadowColor: MainColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontFamily: FONT.BOLD, // เปลี่ยนจาก fontWeight: "600"
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FONT.BOLD, // เปลี่ยนจาก fontWeight: "600"
  },// ... styles เดิม
  
  // เพิ่มส่วนนี้เข้าไปค่ะ
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginBottom: 16,
  },
  timeSectionContainer: {
    flexDirection: 'row', // จัดเรียงแนวนอน
    justifyContent: 'space-between',
    gap: 12, // ระยะห่างระหว่างกล่องซ้ายขวา
  },
  timeBlock: {
    flex: 1, // ให้ขยายเต็มพื้นที่เท่าๆ กัน
    backgroundColor: '#F8F9FA', // สีเทาอ่อนมากๆ ดูสะอาด
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
    fontWeight: '600',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInputWrapper: {
    alignItems: 'center',
  },
  unitLabel: {
    fontSize: 10,
    color: '#ADB5BD',
    marginBottom: 4,
  },
  timeInput: {
    width: 45,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    padding: 0, // แก้ปัญหา Text ลอยใน Android
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ADB5BD',
    marginHorizontal: 6,
    marginTop: 14, // ดันลงมานิดนึงให้ตรงกับ Input
  },

// ...
});

export default styles;