import React, { useState } from "react";
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
import * as ImagePicker from 'expo-image-picker'; // 1. Import Image Picker
import { Ionicons } from '@expo/vector-icons'; // ใช้ Icon กล้อง (ถ้ามี)

import { HistoryDormStackParamsList } from "../HistoryDormStack";
import Toast from "react-native-toast-message";
import { MainColor, BGColor, FONT } from "../../../../../../constant/theme";
import apiClient from "../../../../../../constant/axios"; // อย่าลืม import axios client ของคุณ
import { useAuth } from "../../../../../AuthProvider"; // สมมติว่าต้องใช้ token

type Props = NativeStackScreenProps<HistoryDormStackParamsList, 'edit_post'>;

export default function EditPostScreen({ route, navigation }: Props) {
    const { oldPost, onSuccess } = route.params;
    const { token } = useAuth(); // ดึง Token มาใช้ตอนยิง API

    // State สำหรับรูปภาพ
    const [imageUrl, setImgUrl] = useState<string | null>(oldPost.image_url || null);

    // State ข้อมูล Form
    const [title, setTitle] = useState(oldPost.title || "");
    const [price, setPrice] = useState(oldPost.price?.toString() || "");

    // Location Fields
    const [dormNumber, setDormNumber] = useState(oldPost.dorm_number || "");
    const [province, setProvince] = useState(oldPost.province || "");
    const [district, setDistrict] = useState(oldPost.district || "");
    const [subDistrict, setSubDistrict] = useState(oldPost.sub_district || "");
    const [street, setStreet] = useState(oldPost.street || "");
    const [city, setCity] = useState(oldPost.city || '')
    const [postal_code, setPostal_code] = useState(oldPost.postal_code || '')

    const [loading, setLoading] = useState(false);

    // 2. ฟังก์ชันเลือกรูปภาพ
    const pickImage = async () => {
        // ขอ Permission อัตโนมัติในตัว library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // เลือกได้แค่รูป
            allowsEditing: true, // ให้ user crop รูปได้นิดหน่อย
            aspect: [4, 3], // อัตราส่วนภาพ (ปรับได้ตามต้องการ)
            quality: 0.8, // ลดขนาดไฟล์ลงเล็กน้อยเพื่อความเร็ว (0.0 - 1.0)
        });

        if (!result.canceled) {
            setImgUrl(result.assets[0].uri); // อัปเดต State รูปภาพเพื่อโชว์ Preview ทันที
        }
    };

    const handleReset = () => {
        Alert.alert(
            "รีเซตข้อมูล",
            "คุณต้องการคืนค่าข้อมูลเดิมทั้งหมดรวมถึงรูปภาพใช่หรือไม่?",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ยืนยัน",
                    onPress: () => {
                        setTitle(oldPost.title || "");
                        setPrice(oldPost.price?.toString() || "");
                        setDormNumber(oldPost.dorm_number || "");
                        setProvince(oldPost.province || "");
                        setDistrict(oldPost.district || "");
                        setSubDistrict(oldPost.sub_district || "");
                        setStreet(oldPost.street || "");
                        setImgUrl(oldPost.image_url || null); // Reset รูปกลับเป็นรูปเดิม
                        setCity(oldPost.city || '')
                        setPostal_code(oldPost.postal_code || '')
                        Toast.show({ type: 'info', text1: 'คืนค่าข้อมูลเดิมแล้ว' });
                    }
                }
            ]
        );
    };

    const handleSave = async () => {
        if (!title.trim() || !price.trim()) {
            Toast.show({
                type: 'error',
                text1: 'ข้อมูลไม่ครบถ้วน',
                text2: 'กรุณาระบุหัวข้อและราคา'
            });
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            // Text Data
            formData.append('id', oldPost.id);
            formData.append('title', title);
            formData.append('price', price);
            formData.append('dorm_number', dormNumber);
            formData.append('province', province);
            formData.append('district', district);
            formData.append('sub_district', subDistrict);
            formData.append('street', street);
            formData.append('city', city)
            formData.append('postal_code', postal_code)
            // 3. Logic อัปโหลดรูป (ถ้ามีการเปลี่ยนรูป)
            // เช็คว่ามีรูป และ รูปปัจจุบัน (imageUrl) ไม่ตรงกับรูปเก่า (oldPost.image_url)
            if (imageUrl && imageUrl !== oldPost.image_url) {
                // เทคนิคตั้งชื่อไฟล์ให้ไม่ซ้ำกันตามเวลา
                const fileName = `post_${oldPost.id}_${Date.now()}.jpg`;

                formData.append('image', {
                    uri: imageUrl,
                    type: 'image/jpeg',
                    name: fileName,
                } as any);
            }

            // ส่งข้อมูลไปยัง Server
            await apiClient.put(`/api/contract-posts/user`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Toast.show({ type: 'success', text1: 'บันทึกสำเร็จ' });
            navigation.goBack();
            if (onSuccess) onSuccess()

        } catch (error: any) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'เกิดข้อผิดพลาดในการบันทึก',
                text2: error.response?.data?.message || 'โปรดลองใหม่อีกครั้ง'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "ยืนยันการลบ",
            "คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้? การกระทำนี้ไม่สามารถกู้คืนได้",
            [
                { text: "ยกเลิก", style: "cancel" },
                {
                    text: "ลบประกาศ",
                    style: "destructive", // สีแดงบน iOS
                    onPress: async () => {
                        setLoading(true);
                        try {

                            await apiClient.delete(`/api/contract-posts/user?postId=${oldPost.id}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            });

                            Toast.show({ type: 'success', text1: 'ลบประกาศเรียบร้อยแล้ว' });

                            if (onSuccess) onSuccess(); // รีเฟรชหน้าก่อนหน้า
                            navigation.goBack(); // กลับไปหน้าเดิม

                        } catch (error: any) {
                            console.error(error);
                            Toast.show({
                                type: 'error',
                                text1: 'ไม่สามารถลบได้',
                                text2: error.response?.data?.message || 'โปรดลองใหม่อีกครั้ง'
                            });
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>ยกเลิก</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>แก้ไขประกาศ</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={styles.resetText}>รีเซต</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* 4. Image Section (Clickable) */}
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

                        {/* Overlay บอกว่าแก้ไขได้ */}
                        <View style={styles.editImageOverlay}>
                            <Ionicons name="camera" size={20} color="#FFF" />
                            <Text style={styles.editImageText}>เปลี่ยนรูป</Text>
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

                    {/* Section 2: ที่อยู่ (เหมือนเดิม) */}
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
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>จังหวัด</Text>
                            <TextInput style={styles.input} value={province} onChangeText={setProvince} />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>บันทึกการแก้ไข</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        disabled={loading}
                    >
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        <Text style={styles.deleteButtonText}>ลบประกาศนี้</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={MainColor} />
                    <Text style={styles.loadingText}>กำลังบันทึกข้อมูล...</Text>
                </View>
            )}
        </View>
    );
}

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

    // --- Image Section Styles (Updated) ---
    imageSection: {
        height: 220, // เพิ่มความสูงให้ดูเด่น
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#E5E7EB',
        position: 'relative',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderStyle: 'dashed', // เส้นประ ให้ความรู้สึกว่าเป็นพื้นที่วางไฟล์
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
        right: 12, // ย้ายมาขวาล่าง ปุ่มจะดูไม่เกะกะ
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

    // --- Other Styles (Same) ---
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
    } ,
    deleteButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,       // เว้นห่างจากปุ่มบันทึก
        marginBottom: 40,    // เว้นด้านล่างเผื่อพื้นที่ Scroll
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#FEE2E2', // พื้นหลังสีแดงอ่อนมาก
        borderWidth: 1,
        borderColor: '#FECACA',     // ขอบสีแดงอ่อน
    },
    deleteButtonText: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#EF4444',           // ตัวหนังสือสีแดงเข้ม
        marginLeft: 8,
    },
});