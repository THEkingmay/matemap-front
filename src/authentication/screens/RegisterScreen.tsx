import React, { useState, useEffect, useRef } from 'react';
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
    Image, 
    ScrollView, 
    ActivityIndicator 
} from "react-native";
import { FONT, MainColor } from '../../../constant/theme'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/ActionButton';
import { useAuth } from '../../AuthProvider';
import Toast from 'react-native-toast-message'; // Import ปกติ

const logoImage = require('../../../assets/splash-icon.png')

const THEME_COLOR = MainColor

type props = NativeStackScreenProps<AuthStackParamsList, 'register'>

export default function RegisterScreen({ navigation }: props) {
    const { register } = useAuth()
    
    const [loadingReOTP, setLoadingReOTP] = useState<boolean>(false);
    const [loadingRegister, setLoadingRegister] = useState<boolean>(false);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    const handleRequestOTP = async () => {
       try {
            if (!email) {
                // Rose: ปรับการเรียกใช้ Toast ให้ถูกต้อง
                Toast.show({
                    type: 'error',
                    text1: 'กรุณากรอกอีเมล',
                    text2: 'ต้องกรอกอีเมลก่อนขอรหัส OTP',
                    position: 'top'
                });
                return;
            }

            if(!email.endsWith('@ku.th')){
                Toast.show({
                    type: 'error',
                    text1: 'อีเมลไม่ถูกต้อง',
                    text2: 'กรุณาใช้อีเมลของมหาวิทยาลัย (@ku.th)',
                    position: 'top'
                });
                return;
            }

            setLoadingReOTP(true);

            const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/get-otp`, {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json' 
                },
                body : JSON.stringify({ email: email })
            })
            
            const data = await res.json()

            if(!res.ok) throw new Error(data.message || "เกิดข้อผิดพลาดในการส่ง OTP")

            setTimeLeft(300); 
            
            Toast.show({
                type: 'success',
                text1: 'ส่งรหัสสำเร็จ',
                text2: 'ส่งรหัส OTP ไปยังอีเมลเรียบร้อยแล้ว',
                position: 'top'
            });

            if (timerRef.current) clearInterval(timerRef.current);
            
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

       } catch(err) {
           Toast.show({
               type: 'error',
               text1: 'เกิดข้อผิดพลาด',
               text2: (err as Error).message,
               position: 'top'
           });
       } finally {
            setLoadingReOTP(false);
       }
    }

    const handleRegister = async () => {
       try {
            if (!email || !password || !confirmPassword || !otp) {
                Toast.show({
                    type: 'error',
                    text1: 'ข้อมูลไม่ครบถ้วน',
                    text2: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
                    position: 'top'
                });
                return;
            }

            if (password !== confirmPassword) {
                Toast.show({
                    type: 'error',
                    text1: 'รหัสผ่านไม่ตรงกัน',
                    text2: 'กรุณาตรวจสอบรหัสผ่านอีกครั้ง',
                    position: 'top'
                });
                return;
            }

            if (otp.length !== 6) {
                Toast.show({
                    type: 'error',
                    text1: 'OTP ไม่ถูกต้อง',
                    text2: 'รหัส OTP ต้องมี 6 หลัก',
                    position: 'top'
                });
                return;
            }

            setLoadingRegister(true);

            const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, 
                    password, 
                    otp_code : otp
                })
            })

            const data = await res.json()
            
            if(!res.ok) throw new Error(data.message || "การลงทะเบียนล้มเหลว")

            Toast.show({
                type: 'success',
                text1: 'ลงทะเบียนสำเร็จ',
                text2: 'ยินดีต้อนรับเข้าสู่ระบบ',
                position: 'top'
            });
            
            await register(data.user , data.token)
            // navigation.replace('login'); 

       } catch(err) {
           Toast.show({
               type: 'error',
               text1: 'ลงทะเบียนไม่สำเร็จ',
               text2: (err as Error).message,
               position: 'top'
           });
       } finally {
            setLoadingRegister(false);
       }
    }

    const navigateToLogin = () => {
        navigation.navigate('login'); 
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.contentContainer}>
                        
                        {/* --- Header --- */}
                        <View style={styles.headerContainer}>
                            <Image 
                                source={logoImage} 
                                style={styles.logo} 
                                resizeMode="contain" 
                            />
                        </View>

                        {/* --- Form --- */}
                        <View style={styles.formContainer}>
                            
                            {/* Email Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>อีเมลสถาบัน (@ku.th)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="example@ku.th"
                                    placeholderTextColor="#C4C4C4"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>รหัสผ่าน</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="รหัสผ่าน"
                                    placeholderTextColor="#C4C4C4"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            {/* Confirm Password Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>ยืนยันรหัสผ่าน</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                                    placeholderTextColor="#C4C4C4"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            {/* OTP Section */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>รหัส OTP</Text>
                                <View style={styles.otpRow}>
                                    <TextInput
                                        style={[styles.input, styles.otpInput]}
                                        placeholder="OTP 6 หลัก"
                                        placeholderTextColor="#C4C4C4"
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                    
                                    <TouchableOpacity 
                                        style={[
                                            styles.otpButton, 
                                            (timeLeft > 0 || loadingReOTP) && styles.otpButtonDisabled
                                        ]}
                                        onPress={handleRequestOTP}
                                        disabled={timeLeft > 0 || loadingReOTP}
                                    >
                                        {loadingReOTP ? (
                                            <ActivityIndicator size="small" color="#FFF" />
                                        ) : (
                                            <Text style={[
                                                styles.otpButtonText,
                                                (timeLeft > 0) && styles.otpButtonTextDisabled
                                            ]}>
                                                {timeLeft > 0 ? formatTime(timeLeft) : "ขอรหัส"}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Register Button */}
                            <View style={styles.buttonContainer}>
                                <CustomButton 
                                    title="ยืนยันการสมัคร"
                                    onPress={handleRegister}
                                    iconName="person-add-outline" 
                                    theme="default"
                                    style={styles.registerButton}
                                    isLoading={loadingRegister}
                                    loadingText="กำลังสมัคร..."
                                />
                            </View>
                        </View>

                        {/* --- Footer --- */}
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>มีบัญชีอยู่แล้วใช่ไหม? </Text>
                            <TouchableOpacity onPress={navigateToLogin}>
                                <Text style={styles.linkText}>เข้าสู่ระบบ</Text>
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
        paddingBottom: 20,
    },
    
    // --- Header ---
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 300,
        height: 150,
    },

    // --- Form ---
    formContainer: {
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 15,
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

    // --- OTP Specific Styles ---
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    otpInput: {
        flex: 1,
        marginRight: 10, 
    },
    otpButton: {
        width: 100,
        height: 50,
        backgroundColor: THEME_COLOR,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpButtonDisabled: {
        backgroundColor: '#E0E0E0',
        borderWidth: 1,
        borderColor: '#CCCCCC',
    },
    otpButtonText: {
        color: '#FFFFFF',
        fontFamily: FONT.BOLD,
        fontSize: 14,
    },
    otpButtonTextDisabled: {
        color: '#7F8C8D',
    },

    // --- Register Button ---
    buttonContainer: {
        marginTop: 10,
    },
    registerButton: {
        backgroundColor: THEME_COLOR, 
        borderRadius: 8, 
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'transparent', 
        elevation: 0,
    },

    // --- Footer ---
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
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