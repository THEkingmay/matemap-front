import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

// คุณเมสามารถเปลี่ยนสี Theme ได้ตาม Brand ของแอป
const COLORS = {
    primary: '#FF9500', // สีส้มทอง สื่อถึง Premium/Warning
    secondary: '#FF3B30', // สีแดง สำหรับปุ่ม Logout
    background: '#FFFFFF',
    textMain: '#1C1C1E',
    textSub: '#8E8E93',
    cardBg: '#F2F2F7'
};

const { width } = Dimensions.get('window');

export default function PremiumExpiredScreen({ onLogout } : {onLogout : ()=>void}) {
    return (
        <View style={styles.container}>
            {/* 1. ส่วนแสดงผลกราฟิก (Visual Feedback) */}
            <View style={styles.iconContainer}>
                {/* จำลองไอคอนบัตร/มงกุฎ (แนะนำให้ใช้ Image หรือ SVG ของจริงแทนในอนาคต) */}
                <View style={styles.circleIcon}>
                    <Text style={styles.emojiIcon}>👑</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>!</Text>
                    </View>
                </View>
            </View>

            {/* 2. ส่วนเนื้อหาข้อความ (Content) */}
            <View style={styles.textContainer}>
                <Text style={styles.title}>สมาชิก Premium หมดอายุ</Text>
                <Text style={styles.description}>
                    ขออภัยค่ะ ระบบไม่สามารถต่ออายุสมาชิกอัตโนมัติได้ 
                    กรุณาตรวจสอบการชำระเงินเพื่อใช้งานอ
                </Text>
            </View>

            {/* 3. ส่วนปุ่มกด (Action Buttons) */}
            <View style={styles.buttonContainer}>
                {/* ปุ่ม Logout (ตามที่ขอมา) */}
                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={onLogout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
                </TouchableOpacity>

                {/* (Optional) ปุ่มติดต่อ Support หรือ ต่ออายุ ถ้ามี */}
                <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkText}>ติดต่อฝ่ายบริการลูกค้า</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    circleIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF5E5', // พื้นหลังสีส้มอ่อนจางๆ
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    emojiIcon: {
        fontSize: 48,
    },
    badge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.secondary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.background,
    },
    badgeText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textMain,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: COLORS.textSub,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    logoutButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: COLORS.cardBg, // ใช้สีเทาอ่อนเพื่อให้ดูไม่รุนแรง หรือใช้สีแดงถ้าต้องการเน้น
        borderWidth: 1,
        borderColor: '#E5E5EA',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.secondary, // ตัวหนังสือสีแดง สื่อถึง Logout
    },
    linkButton: {
        padding: 8,
    },
    linkText: {
        fontSize: 14,
        color: COLORS.textSub,
        textDecorationLine: 'underline',
    }
});