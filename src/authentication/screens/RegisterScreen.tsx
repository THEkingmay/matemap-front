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
    Alert
} from "react-native";
import { FONT, KU_GREEN } from '../../../constant/theme'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/ActionButton';
import { Ionicons } from '@expo/vector-icons';

const logoImage = require('../../../assets/favicon.png')

type props = NativeStackScreenProps<AuthStackParamsList, 'register'>

export default function RegisterScreen({ navigation }: props) {

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

    const handleRequestOTP = () => {
        if (!email) {
            Alert.alert("แจ้งเตือน", "กรุณากรอกอีเมลก่อนขอรหัส OTP");
            return;
        }

        setTimeLeft(300); 
        Alert.alert("สำเร็จ", "ส่งรหัส OTP ไปยังอีเมลเรียบร้อยแล้ว");

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
    }

    const handleRegister = () => {
        if (!email || !password || !confirmPassword || !otp) {
            Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("แจ้งเตือน", "รหัสผ่านไม่ตรงกัน");
            return;
        }

        if (otp.length !== 6) {
            Alert.alert("แจ้งเตือน", "รหัส OTP ต้องมี 6 หลัก");
            return;
        }

        Alert.alert("สำเร็จ", "ลงทะเบียนเรียบร้อยแล้ว");
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
                        
                        <View style={styles.headerContainer}>
                            <Image 
                                source={logoImage} 
                                style={styles.logo} 
                                resizeMode="contain" 
                            />
                            <Text style={styles.appName}>MATE MAP</Text>
                            <Text style={styles.subtitle}>สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน</Text>
                        </View>

                        <View style={styles.formContainer}>
                            <Text style={styles.sectionTitle}>ลงทะเบียน</Text>
                            
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

                            <View style={styles.inputWrapper}>
                                <Ionicons name="shield-checkmark-outline" size={22} color={KU_GREEN} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="ยืนยันรหัสผ่าน"
                                    placeholderTextColor="#A0A0A0"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            <View style={styles.otpContainer}>
                                <View style={[styles.inputWrapper, styles.otpInputWrapper]}>
                                    <Ionicons name="key-outline" size={22} color={KU_GREEN} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="รหัส OTP 6 หลัก"
                                        placeholderTextColor="#A0A0A0"
                                        value={otp}
                                        onChangeText={setOtp}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </View>
                                
                                <TouchableOpacity 
                                    style={[
                                        styles.otpButton, 
                                        timeLeft > 0 && styles.otpButtonDisabled
                                    ]}
                                    onPress={handleRequestOTP}
                                    disabled={timeLeft > 0}
                                >
                                    <Text style={[
                                        styles.otpButtonText,
                                        timeLeft > 0 && styles.otpButtonTextDisabled
                                    ]}>
                                        {timeLeft > 0 ? formatTime(timeLeft) : "ขอรหัส"}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.buttonContainer}>
                                <CustomButton 
                                    title="ยืนยันการสมัคร"
                                    onPress={handleRegister}
                                    iconName="person-add-outline" 
                                    theme="default"
                                    style={styles.registerButton} 
                                />
                            </View>
                        </View>

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
        paddingHorizontal: 30,
        paddingBottom: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    appName: {
        fontSize: 36,
        fontFamily: FONT.BOLD,
        color: KU_GREEN,
        letterSpacing: 1.5,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: FONT.REGULAR,
        color: '#7F8C8D',
    },
    formContainer: {
        marginBottom: 5,
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
        backgroundColor: '#F0F3F4',
        borderRadius: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 58,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONT.REGULAR,
        color: '#2C3E50',
        height: '100%',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    otpInputWrapper: {
        flex: 1,
        marginBottom: 0,
        marginRight: 10,
    },
    otpButton: {
        width: 100,
        height: 58,
        backgroundColor: KU_GREEN,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    otpButtonText: {
        color: '#FFFFFF',
        fontFamily: FONT.BOLD,
        fontSize: 16,
    },
    otpButtonTextDisabled: {
        color: '#7F8C8D',
    },
    buttonContainer: {
        marginTop: 10,
    },
    registerButton: {
        borderRadius: 16, 
        height: 56,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#7F8C8D',
        fontSize: 15,
        fontFamily: FONT.REGULAR,
    },
    linkText: {
        color: KU_GREEN,
        fontFamily: FONT.BOLD,
        fontSize: 15,
    },
});