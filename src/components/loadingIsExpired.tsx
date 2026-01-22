import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from "react-native";

export default function LoadingCheckIsExpired() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.contentWrapper}>
                {/* Indicator: ใช้ขนาดใหญ่เพื่อให้เห็นชัดเจนว่าระบบทำงานอยู่ */}
                <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
                
                {/* Main Message: บอกสิ่งที่ระบบกำลังทำตรงๆ */}
                <Text style={styles.loadingText}>
                    กำลังตรวจสอบสถานะสมาชิก...
                </Text>
                
                {/* Sub Message: ลดความกังวลของผู้ใช้ระหว่างรอ */}
                <Text style={styles.subText}>
                    กรุณารอสักครู่ ระบบกำลังยืนยันข้อมูลล่าสุด
                </Text>
            </View>

            {/* Optional: Footer เวอร์ชั่นแอป ให้ดูเป็นทางการ */}
            <View style={styles.footer}>
                <Text style={styles.versionText}>Secure Check v1.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // พื้นขาวดูสะอาดและเป็นทางการที่สุดสำหรับการเช็กข้อมูล
    },
    contentWrapper: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    spinner: {
        marginBottom: 24,
        transform: [{ scale: 1.2 }] // ขยาย Spinner ให้ดูใหญ่ขึ้นเล็กน้อย
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600', // ใช้ตัวหนาปานกลาง ให้อ่านง่าย
        color: '#1C1C1E',
        marginBottom: 8,
        textAlign: 'center',
    },
    subText: {
        fontSize: 14,
        color: '#8E8E93', // สีเทาจางลง เพื่อไม่ให้แย่งความเด่น
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
    },
    versionText: {
        fontSize: 12,
        color: '#C7C7CC',
    }
});