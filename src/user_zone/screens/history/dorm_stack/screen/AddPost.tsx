import React, { useState } from "react"
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator, 
    Image, 
    KeyboardAvoidingView, 
    Platform,
    Alert
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from 'expo-image-picker'; 
import { Ionicons } from '@expo/vector-icons'; 

import { HistoryDormStackParamsList } from "../HistoryDormStack"; 
import Toast from "react-native-toast-message";
import { MainColor, BGColor, FONT } from "../../../../../../constant/theme";
import apiClient from "../../../../../../constant/axios"; 
import { useAuth } from "../../../../../AuthProvider"; 

type Props = NativeStackScreenProps<HistoryDormStackParamsList, 'add_post'>;

export default function CreatePostScreen({ route, navigation }: Props) {
    const { onSuccess } = route.params || {}; 
    const { token , user } = useAuth(); 

    // 1. State เริ่มต้นเป็นค่าว่างทั้งหมด
    const [imageUrl, setImgUrl] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    
    // Location Fields
    const [dormNumber, setDormNumber] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [subDistrict, setSubDistrict] = useState("");
    const [street, setStreet] = useState("");
    const [city , setCity] = useState("")
    const [postal_code , setPostal_code] = useState("")

    const [loading, setLoading] = useState(false);

    // ฟังก์ชันเลือกรูปภาพ (เหมือนเดิม)
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true, 
            aspect: [4, 3], 
            quality: 0.8, 
        });

        if (!result.canceled) {
            setImgUrl(result.assets[0].uri); 
        }
    };

    const handleClear = () => {
        Alert.alert(
            "ล้างข้อมูล",
            "คุณต้องการล้างข้อมูลทั้งหมดที่กรอกไว้ใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                { 
                    text: "ยืนยัน", 
                    onPress: () => {
                        setTitle("");
                        setPrice("");
                        setDormNumber("");
                        setProvince("");
                        setDistrict("");
                        setSubDistrict("");
                        setStreet("");
                        setImgUrl(null);
                        setCity("");
                        setPostal_code("");
                    }
                }
            ]
        );
    };

    const handleCreate = async () => {
        // Validate
        if (!title.trim() || !price.trim() || !imageUrl?.trim() ) {
            Toast.show({
                type: 'error',
                text1: 'ข้อมูลไม่ครบถ้วน',
                text2: 'กรุณาระบุหัวข้อและราคาและรูปภาพ'
            });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            
            // Text Data (ไม่ต้องส่ง ID)
            formData.append('title', title);
            formData.append('price', price);
            formData.append('dorm_number', dormNumber);
            formData.append('province', province);
            formData.append('district', district);
            formData.append('sub_district', subDistrict);
            formData.append('street', street);
            formData.append('city' , city);
            formData.append('postal_code' , postal_code);

            // 2. Logic อัปโหลดรูป (สำหรับสร้างใหม่ ถ้ามีรูปก็ส่งเลย)
            if (imageUrl) {
                const fileName = `post_new_${Date.now()}.jpg`; // ตั้งชื่อไฟล์ใหม่
                formData.append('image', {
                    uri: imageUrl,             
                    type: 'image/jpeg',        
                    name: fileName,        
                } as any); 
            }


            await apiClient.post(`/api/contract-posts/user`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                params :{ 
                    userId : user?.id
                }
            });

            Toast.show({ type: 'success', text1: 'สร้างประกาศสำเร็จ' });
            
            if(onSuccess) onSuccess(); // เรียก callback เพื่อ refresh หน้าก่อนหน้า
            navigation.goBack();

        } catch (error: any) {
            console.error(error);
            Toast.show({ 
                type: 'error', 
                text1: 'เกิดข้อผิดพลาด',
                text2: error.response?.data?.message || 'โปรดลองใหม่อีกครั้ง'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>ยกเลิก</Text>
                </TouchableOpacity>
                {/* เปลี่ยนชื่อ Header */}
                <Text style={styles.headerTitle}>ลงประกาศใหม่</Text> 
                <TouchableOpacity onPress={handleClear}>
                    <Text style={styles.resetText}>ล้างค่า</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* Image Section */}
                    <TouchableOpacity 
                        style={styles.imageSection} 
                        onPress={pickImage}
                        activeOpacity={0.8}
                    >
                        {imageUrl ? (
                            <Image 
                                source={{ uri: imageUrl }} 
                                style={styles.previewImage}
                            />
                        ) : (
                            <View style={[styles.previewImage, styles.noImagePlaceholder]}>
                                <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                                <Text style={styles.noImageText}>แตะเพื่อเพิ่มรูปภาพ</Text>
                            </View>
                        )}
                        
                        {/* ปรับ Overlay ให้สื่อความหมาย */}
                        <View style={styles.editImageOverlay}>
                            <Ionicons name="camera" size={20} color="#FFF" />
                            <Text style={styles.editImageText}>{imageUrl ? "เปลี่ยนรูป" : "เพิ่มรูป"}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Section 1: ข้อมูลทั่วไป */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>ข้อมูลทั่วไป</Text>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>หัวข้อประกาศ <Text style={styles.required}>*</Text></Text>
                            <TextInput 
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="เช่น ขายสัญญาหอพัก..."
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>ราคาขาย (บาท) <Text style={styles.required}>*</Text></Text>
                            <TextInput 
                                style={styles.input}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="0.00"
                            />
                        </View>
                    </View>

                    {/* Section 2: ที่อยู่ */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionHeader}>ที่ตั้งหอพัก</Text>
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>เลขห้อง</Text>
                                <TextInput style={styles.input} value={dormNumber} onChangeText={setDormNumber} />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>ถนน/ซอย</Text>
                                <TextInput style={styles.input} value={street} onChangeText={setStreet} />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>แขวง/ตำบล</Text>
                            <TextInput style={styles.input} value={subDistrict} onChangeText={setSubDistrict} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>เขต/อำเภอ</Text>
                            <TextInput style={styles.input} value={district} onChangeText={setDistrict} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>จังหวัด</Text>
                            <TextInput style={styles.input} value={province} onChangeText={setProvince} />
                        </View>
                         {/* เพิ่ม field ที่อาจจะขาดไปถ้าต้องการให้ครบ */}
                        <View style={styles.row}>
                             <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>เมือง</Text>
                                <TextInput style={styles.input} value={city} onChangeText={setCity} />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>รหัสไปรษณีย์</Text>
                                <TextInput style={styles.input} value={postal_code} onChangeText={setPostal_code} keyboardType="numeric" />
                            </View>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                        style={[styles.saveButton, loading && styles.disabledButton]} 
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>สร้างประกาศ</Text>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={MainColor} />
                    <Text style={styles.loadingText}>กำลังสร้างประกาศ...</Text>
                </View>
            )}
        </View>
    );
}

// Styles เดิม (นำมาใช้ได้เลย ไม่ต้องแก้)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor || '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 40 : 16,
        paddingBottom: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: FONT.BOLD,
        color: '#111827',
    },
    cancelText: {
        fontSize: 16,
        fontFamily: FONT.REGULAR,
        color: '#6B7280',
    },
    resetText: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#EF4444',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    imageSection: {
        height: 220, 
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#E5E7EB',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed', 
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    noImagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
    },
    noImageText: {
        marginTop: 8,
        color: '#9CA3AF',
        fontFamily: FONT.REGULAR,
        fontSize: 14,
    },
    editImageOverlay: {
        position: 'absolute',
        bottom: 12,
        right: 12, 
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    editImageText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: FONT.BOLD,
        marginLeft: 6,
    },
    sectionContainer: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    sectionHeader: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#111827',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontFamily: FONT.REGULAR,
        color: '#374151',
        marginBottom: 6,
    },
    required: {
        color: '#EF4444',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        fontFamily: FONT.REGULAR,
        color: '#111827',
    },
    saveButton: {
        backgroundColor: MainColor || '#4F46E5',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: MainColor || '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONT.BOLD,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        marginTop: 12,
        color: '#374151',
        fontFamily: FONT.BOLD,
        fontSize: 14,
    }
});