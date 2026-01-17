import React, { useState } from 'react';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamsList } from "../AuthStack";
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform, 
    TouchableOpacity,
    Image, // เพิ่ม Image
    ScrollView, // ใช้ ScrollView เผื่อหน้าจอเล็ก
    Alert
} from "react-native";
import { FONT, KU_GREEN } from '../../../constant/theme'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/ActionButton';
import { Ionicons } from '@expo/vector-icons';


const logoImage = require('../../../assets/favicon.png')


type props = NativeStackScreenProps<AuthStackParamsList, 'login'>

export default function LoginScreen({ navigation }: props) {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = () => {
       Alert.alert("สำเร็จ" , "เข้าสู่ระบบแล้ว")
    }

    const navigateToRegister = () => {
        navigation.navigate('register'); 
    }
    const handleResetPassword = ()=>{
        Alert.alert("ช้าก่อน" ,"การรีเซตรหัสผ่านยังใช้ไม่ได้")
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.contentContainer}>
                        
                        {/* --- ส่วนหัว (โลโก้ และ ชื่อแอป) --- */}
                        <View style={styles.headerContainer}>
                            {/* แสดงโลโก้ */}
                            <Image 
                                source={logoImage} 
                                style={styles.logo} 
                                resizeMode="contain" 
                            />
                            <Text style={styles.appName}>MATE MAP</Text>
                            <Text style={styles.subtitle}>ค้นหารูมเมทที่ถูกใจใช่เลย</Text>
                        </View>

                        {/* --- ส่วนฟอร์ม --- */}
                        <View style={styles.formContainer}>
                            <Text style={styles.sectionTitle}>เข้าสู่ระบบ</Text>
                            
                            {/* ช่องกรอกอีเมล */}
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={22} color={KU_GREEN} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="อีเมลสถาบัน (@ku.th)"
                                    placeholderTextColor="#A0A0A0"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* ช่องกรอกรหัสผ่าน */}
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={22} color={KU_GREEN} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="รหัสผ่าน"
                                    placeholderTextColor="#A0A0A0"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            {/* ลืมรหัสผ่าน */}
                            <TouchableOpacity onPress={handleResetPassword} style={styles.forgotPassContainer}>
                                <Text style={styles.forgotPassText}>ลืมรหัสผ่าน?</Text>
                            </TouchableOpacity>

                            {/* ปุ่ม Login */}
                            <View style={styles.buttonContainer}>
                                <CustomButton 
                                    title="เข้าสู่ระบบ"
                                    onPress={handleLogin}
                                    iconName="log-in-outline" 
                                    theme="default"
                                    // สมมติว่า CustomButton รองรับ style override เพื่อปรับให้เข้ากับธีม
                                    style={styles.loginButton} 
                                />
                            </View>
                        </View>

                        {/* --- ส่วนท้าย (สมัครสมาชิก) --- */}
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>ยังไม่มีบัญชีใช่ไหม? </Text>
                            <TouchableOpacity onPress={navigateToRegister}>
                                <Text style={styles.linkText}>สมัครสมาชิก</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // พื้นหลังขาวสะอาด
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    contentContainer: {
        paddingHorizontal: 30,
        paddingBottom: 20,
    },
    
    // --- Header Styles ---
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,  // ปรับขนาดโลโก้ตามความเหมาะสม
        height: 100,
        marginBottom: 15,
    },
    appName: {
        fontSize: 36,
        fontFamily: FONT.BOLD , // ใช้ฟอนต์ Kanit หนา
        color: KU_GREEN,
        letterSpacing: 1.5,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONT.REGULAR , // ใช้ฟอนต์ Kanit ปกติ
        color: '#7F8C8D',
    },

    // --- Form Styles ---
    formContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: FONT.BOLD,
        color: '#2C3E50',
        marginBottom: 20,
        textAlign: 'left',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F3F4', // สีพื้นหลังเทาอ่อนๆ ให้ดู Modern
        borderRadius: 16, // ขอบมนมากหน่อยให้ดูเป็นมิตร (สไตล์แอปหาคู่)
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 58,
        borderWidth: 1,
        borderColor: 'transparent', 
        // เพิ่มเงาเล็กน้อย (Optional)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONT.REGULAR,
        color: '#2C3E50',
        height: '100%', // ให้พื้นที่กดเต็มความสูง
    },
    forgotPassContainer: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotPassText: {
        color: KU_GREEN,
        fontFamily: FONT.REGULAR,
        fontSize: 14,
    },
    buttonContainer: {
        marginTop: 5,
    },
    loginButton: {
       // ตรงนี้อาจจะต้องไปปรับในตัว component CustomButton หลัก
       // แต่ถ้า override ได้ อาจจะเพิ่มความสูงหรือเงาให้ปุ่มดูเด่นขึ้น
       borderRadius: 16, 
       height: 56,
    },

    // --- Footer Styles ---
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    footerText: {
        color: '#7F8C8D',
        fontSize: 15,
        fontFamily: FONT.REGULAR,
    },
    linkText: {
        color: KU_GREEN,
        fontFamily: FONT.BOLD ,
        fontSize: 15,
    },
});