import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KU_GREEN } from '../../constant/theme';

// 1. ปรับปรุง Interface ให้รองรับ Type ที่ถูกต้อง
interface CustomButtonProps {
    title?: string;
    onPress?: () => void;
    iconName: React.ComponentProps<typeof Ionicons>['name'];  
    theme: 'default' | 'danger' | 'warn';
    style?: ViewStyle; // เพิ่มเพื่อความยืดหยุ่นในการจัดวางภายนอก
    isLoading? : boolean , 
    loadingText? : string ,
}

// 2. กำหนดชุดสี (Color Palette) เพื่อให้ดูเป็นระบบ
const COLORS = {
    default: { bg: KU_GREEN, text: '#FFFFFF' }, // สีน้ำเงิน Modern Blue
    danger: { bg: '#DC2626', text: '#FFFFFF' },  // สีแดงเข้ม
    warn: { bg: '#D97706', text: '#FFFFFF' },    // สีส้มอำพัน
};

export default function CustomButton({ 
    title, 
    onPress, 
    iconName, 
    theme,
    style ,
    isLoading , 
    loadingText
}: CustomButtonProps) {
    
    // เลือกสีตาม Theme ที่ส่งเข้ามา
    const activeTheme = COLORS[theme] || COLORS.default;

    return (
        <TouchableOpacity 
            style={[
                styles.button, 
                { backgroundColor: activeTheme.bg },
                style // override styles ถ้าจำเป็น
            ]} 
            disabled={isLoading}
            onPress={onPress}
            activeOpacity={0.7} // ให้ feedback เวลา user กด
        >
            {/* Icon Section */}
            <Ionicons 
                name={iconName} 
                size={20} 
                color={activeTheme.text} 
                style={title ? styles.iconWithText : styles.iconOnly} 
            />

            {/* Title Section - Render เฉพาะเมื่อมี title ส่งมา */}
            {!isLoading && title && (
                <Text style={[styles.text, { color: activeTheme.text }]}>
                    {title}
                </Text>
            )}

            {
                isLoading &&  (
                <Text style={[styles.text, { color: activeTheme.text }]}>
                    {loadingText}
                </Text>
            )
            }
        </TouchableOpacity>
    );
}

// 3. Styling เพื่อความสวยงาม
const styles = StyleSheet.create({
    button: {
        flexDirection: 'row', // จัด Icon กับ Text ให้อยู่บรรทัดเดียวกัน
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12, // มุมโค้งมน (Modern Look)
        
        // เงา (Shadow) สำหรับ iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        
        // เงา (Elevation) สำหรับ Android
        elevation: 5,
        
        minWidth: 100, // กำหนดความกว้างขั้นต่ำ
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8, // ระยะห่างระหว่าง Icon กับ Text
        letterSpacing: 0.5,
    },
    iconWithText: {
        marginRight: 4,
    },
    iconOnly: {
        marginRight: 0,
    },

});