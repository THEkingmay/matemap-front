import { StyleSheet } from "react-native";
import { MainColor } from "../../../constant/theme";

const styles = StyleSheet.create({
  deleteBadge: {
        position: 'absolute',
        top: 0,            // ปรับตำแหน่งตามความเหมาะสม
        right: 0,          // ปรับตำแหน่งตามความเหมาะสม
        backgroundColor: '#FF3B30', // สีแดงเพื่อสื่อถึงการลบ (Danger color)
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FFF',
        elevation: 4,      // เงาสำหรับ Android
        shadowColor: '#000', // เงาสำหรับ iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
  // เพิ่ม/แก้ไข Style สำหรับ Tags
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tagBadge: {
    backgroundColor: '#F0FFF4', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20, // ให้มนขึ้นหน่อย
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#C6F6D5',
    flexDirection: 'row', // จัดเรียงแนวนอนสำหรับปุ่มลบ
    alignItems: 'center',
  },
  tagBadgeEditing: {
    backgroundColor: '#F3F3F3', // เปลี่ยนสีพื้นหลังตอนแก้ไข
    borderColor: '#DDD',
    paddingRight: 8, // ลด padding ขวาลงหน่อยเพราะมีปุ่มลบ
  },
  tagText: {
    fontFamily: 'Kanit_400Regular',
    color: '#2F855A',
    fontSize: 14,
  },
  removeTagButton: {
    marginLeft: 6,
  },
  
  // Styles สำหรับ Input เพิ่ม Tag
  addTagContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  addTagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: 'Kanit_400Regular',
    fontSize: 14,
    backgroundColor: '#F7FAFC',
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: MainColor,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  hintText: {
    fontFamily: 'Kanit_400Regular',
    color: '#CCC',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 5,
  },
  emptyText: {
    fontFamily: 'Kanit_400Regular',
    color: '#A0AEC0',
    fontSize: 14,
    fontStyle: 'italic',
  },
  container: {
    flex: 1, 
    backgroundColor: '#F5F7FA', 
  },
  center: {
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    // Rose: Key Point คือตรงนี้ค่ะ เพิ่ม padding ด้านล่างเยอะๆ
    paddingBottom: 120, 
  },
  
  // Header Styles
  headerBackground: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 40,
    paddingBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    width: '80%',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FFF', // ขอบขาวตัดกับเงา
  },
  placeholderImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: MainColor,
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  nameText: {
    fontFamily: 'Kanit_700Bold', 
    fontSize: 24,
    color: '#2D3748',
    marginBottom: 4,
  },
  nameInput: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 24,
    color: '#2D3748',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E0',
    width: '100%',
    paddingVertical: 5,
    marginBottom: 5,
  },
  bioText: {
    fontFamily: 'Kanit_400Regular', 
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
  },
  bioInput: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 14,
    color: '#5d5d5d',
    backgroundColor: MainColor + '33', // สีพื้นหลังจางๆ
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginTop: 5,
    minHeight: 60,
  },

  // Card & Section Styles
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 10,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 15,
  },

  // Info Row Styles
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0FFF4', // พื้นหลังไอคอนสีจางๆ (เปลี่ยนตาม Theme ได้)
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 16,
    color: '#2D3748',
  },
  editingInput: {
    fontFamily: 'Kanit_400Regular',
    fontSize: 16,
    color: '#2D3748',
    borderBottomWidth: 1,
    borderBottomColor: MainColor,
    paddingVertical: 0,
    height: 24,
  },
  // Button Section
  actionSection: {
    paddingHorizontal: 20,
    // ไม่ต้อง margin top เยอะ เพราะ contentContainerStyle จัดการพื้นที่ด้านล่างให้แล้ว
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStack: {
    gap: 12,
  },
});

export default styles