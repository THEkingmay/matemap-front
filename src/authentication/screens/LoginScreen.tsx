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
    Image, 
    ScrollView, 
    TouchableOpacity, // เพิ่ม TouchableOpacity กลับมาสำหรับปุ่มกดข้อความ
} from "react-native";
import { FONT } from '../../../constant/theme'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/ActionButton';
import { Toast } from 'toastify-react-native';
import { useAuth } from '../../AuthProvider';

const logoImage = require('../../../assets/splash-icon.png')

const THEME_COLOR = '#8FA0C8'; 

type props = NativeStackScreenProps<AuthStackParamsList, 'login'>

export default function LoginScreen({ navigation }: props) {

    const {login} = useAuth()

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading , setLoading] = useState<boolean>(false)

    const handleLogin = async () => {
       try{
        if(!email || !password){
            throw new Error("กรุณากรอกอีเมลและรหัสผ่าน")
        }
        
        // Rose: ตรวจสอบ Logic อีเมลตามเดิม
        if(!email.endsWith('@ku.th')){
             // Logic validation
        }

        setLoading(true)
        await login(email , password)
        Toast.success('เข้าสู่ระบบสำเร็จ' , 'top')

       }catch(err){
        Toast.error((err as Error).message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' , 'top')
       }finally{
        setLoading(false)
       }
    }

    const navigateToRegister = () => {
        navigation.navigate('register'); 
    }

    const handleResetPassword = () => {
        // Rose: ใส่ Logic การรีเซ็ตรหัสผ่านตรงนี้ หรือแจ้งเตือนไปก่อน
        Toast.warn("ระบบรีเซ็ตรหัสผ่านกำลังพัฒนา" , 'top')
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.contentContainer}>
                        
                        {/* --- Logo --- */}
                        <View style={styles.headerContainer}>
                            <Image 
                                source={logoImage} 
                                style={styles.logo} 
                                resizeMode="contain" 
                            />
                        </View>

                        {/* --- Form --- */}
                        <View style={styles.formContainer}>
                            
                            {/* Username */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ชื่อบัญชีผู้ใช้</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="กรอกชื่อบัญชีผู้ใช้ หรือ อีเมล"
                                    placeholderTextColor="#C4C4C4"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>รหัสผ่าน</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="กรอกรหัสผ่าน"
                                    placeholderTextColor="#C4C4C4"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            {/* Forgot Password */}
                            <TouchableOpacity onPress={handleResetPassword} style={styles.forgotPassContainer}>
                                <Text style={styles.forgotPassText}>ลืมรหัสผ่าน?</Text>
                            </TouchableOpacity>

                            {/* Login Button */}
                            <View style={styles.buttonContainer}>
                                <CustomButton 
                                    title="เข้าสู่ระบบ"
                                    onPress={handleLogin}
                                    theme="default"
                                    isLoading={loading}
                                    loadingText={'กำลังเข้าสู่ระบบ...'}
                                    style={styles.loginButton} 
                                    iconName='arrow-forward-circle'
                                />
                            </View>
                        </View>

                        {/* --- Footer (Register) --- */}
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
        backgroundColor: '#FFFFFF',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center', 
    },
    contentContainer: {
        paddingHorizontal: 24, 
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30, // ลดลงนิดหน่อยเพื่อให้สมดุลกับ Footer ที่เพิ่มมา
    },
    logo: {
        // Rose: ปรับขนาดให้พอดีกับหน้าจอมือถือทั่วไป (Width 500 อาจจะล้นจอเล็กได้ค่ะ)
        width: 300, 
        height: 150,
    },
    formContainer: {
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: FONT.BOLD, 
        color: '#000000',
        marginBottom: 8, 
        fontWeight: '600',
    },
    input: {
        height: 50,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#8E8E8E', 
        borderRadius: 8, 
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: FONT.REGULAR,
        color: '#000',
    },
    // --- Forgot Password Styles ---
    forgotPassContainer: {
        alignItems: 'flex-end', // ชิดขวา
        marginTop: -10, // ขยับขึ้นไปหา input password นิดนึง
        marginBottom: 20,
    },
    forgotPassText: {
        color: '#7F8C8D', // สีเทา
        fontFamily: FONT.REGULAR,
        fontSize: 14,
    },
    buttonContainer: {
        marginTop: 0,
    },
    loginButton: {
        backgroundColor: THEME_COLOR, 
        borderRadius: 8, 
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'transparent', 
        elevation: 0,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: FONT.BOLD,
    },
    // --- Footer Styles ---
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    footerText: {
        color: '#7F8C8D',
        fontSize: 14,
        fontFamily: FONT.REGULAR,
    },
    linkText: {
        color: THEME_COLOR,
        fontFamily: FONT.BOLD,
        fontSize: 14,
    },
});