import { StyleSheet } from "react-native";
import { BGColor, FONT, MainColor } from "../../../../../constant/theme";
const styles = StyleSheet.create({
    // --- Action Button Styles ---
    actionContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F3F4',
    },// --- Filter Styles ---
    filterContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16, // เว้นระยะห่างจาก list ด้านล่าง
        // backgroundColor: BGColor, // ถ้าอยากให้กลืนกับพื้นหลัง
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        marginRight: 8, // ระยะห่างระหว่างปุ่ม
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    // ... styles เดิม ...
    reviewedContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    reviewedLabel: {
        fontFamily: FONT.BOLD,
        fontSize: 12,
        color: MainColor,
        marginBottom: 4,
    },
    reviewedText: {
        fontFamily: FONT.REGULAR,
        fontSize:14,
        color: '#6B7280',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    filterChipActive: {
        backgroundColor: MainColor, // สีหลักเมื่อถูกเลือก
        borderColor: MainColor,
    },
    filterText: {
        fontFamily: FONT.REGULAR,
        fontSize: 14,
        color: '#7F8C8D',
    },
    filterTextActive: {
        fontFamily: FONT.BOLD, // ตัวหนาเมื่อถูกเลือก
        color: '#FFFFFF',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Button Variants
    btnSuccess: {
        backgroundColor: '#27AE60',
        shadowColor: "#27AE60",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    btnOutlineDanger: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E74C3C',
    },
    btnGhostDanger: {
        backgroundColor: '#FDECEA', // สีแดงจางๆ แบบพื้นหลัง
    },
    btnOutlinePrimary: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: MainColor,
    },
    // Text Styles
    btnTextWhite: {
        fontFamily: FONT.BOLD,
        fontSize: 14,
        color: '#FFFFFF',
    },
    btnTextDanger: {
        fontFamily: FONT.BOLD,
        fontSize: 14,
        color: '#E74C3C',
    },
    btnTextPrimary: {
        fontFamily: FONT.BOLD,
        fontSize: 14,
        color: MainColor,
    },
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenHeader: {
        paddingHorizontal: 20,
        paddingTop: 24, // เพิ่มพื้นที่ด้านบน
        paddingBottom: 16,
        backgroundColor: BGColor,
    },
    screenTitle: {
        fontFamily: FONT.BOLD,
        fontSize: 28, // ใหญ่ขึ้นเพื่อความชัดเจน
        color: '#2C3E50',
    },
    screenSubtitle: {
        fontFamily: FONT.REGULAR,
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 4,
    },
    listContent: {
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 60,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        // Elevation & Shadow ที่นุ่มนวลขึ้น
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F3F4', // เส้นขอบจางๆ เพิ่มมิติ
    },
    // --- Header Section ---
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateText: {
        fontFamily: FONT.BOLD,
        fontSize: 14,
        color: '#7F8C8D',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1, // เพิ่มขอบให้ Badge ดูคมขึ้น
    },
    statusText: {
        fontFamily: FONT.BOLD,
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F3F4',
        marginBottom: 12,
    },
    // --- Route Section (Timeline) ---
    routeContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    timelineColumn: {
        alignItems: 'center',
        marginRight: 12,
        paddingTop: 4, // ดันลงมานิดหน่อยให้ตรงกับ Text บรรทัดแรก
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#FFF', // ขอบขาวตัดกับพื้นหลัง
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    line: {
        width: 2,
        flex: 1, // ยืดให้เต็มพื้นที่ระหว่างจุด
        backgroundColor: '#E0E0E0',
        marginVertical: 4,
        minHeight: 20, // ความสูงขั้นต่ำของเส้น
    },
    addressColumn: {
        flex: 1,
        justifyContent: 'space-between',
    },
    addressRow: {
        flex: 1,
    },
    locationTitle: {
        fontFamily: FONT.BOLD,
        fontSize: 10,
        color: '#95A5A6',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    locationText: {
        fontFamily: FONT.REGULAR,
        fontSize: 14,
        color: '#2C3E50',
    },
    // --- Footer Section ---
    footerContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F9F9',
        borderRadius: 8,
        padding: 12,
    },
    serviceInfo: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#E0E0E0',
        paddingRight: 8,
    },
    providerInfo: {
        flex: 1,
        paddingLeft: 12,
    },
    serviceLabel: {
        fontFamily: FONT.REGULAR,
        fontSize: 10,
        color: '#95A5A6',
    },
    serviceValue: {
        fontFamily: FONT.BOLD,
        fontSize: 14,
        color: MainColor,
        marginTop: 2,
    },
    providerValue: {
        fontFamily: FONT.BOLD,
        fontSize: 14,
        color: '#34495E',
        marginTop: 2,
    },
    // --- Note Section ---
    noteContainer: {
        marginTop: 12,
        flexDirection: 'row',
    },
    noteLabel: {
        fontFamily: FONT.BOLD,
        fontSize: 12,
        color: '#7F8C8D',
        marginRight: 4,
    },
    noteText: {
        fontFamily: FONT.REGULAR,
        fontSize: 12,
        color: '#7F8C8D',
        flex: 1,
    },
    // --- Empty State ---
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyTitle: {
        fontFamily: FONT.BOLD,
        fontSize: 18,
        color: '#BDC3C7',
        marginTop: 16,
    },
    emptyText: {
        fontFamily: FONT.REGULAR,
        color: '#BDC3C7',
        fontSize: 14,
        marginTop: 8,
    }
});

export default styles