import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { styles } from "../../styles/profile.view.styles";
import { useAuth } from "../../../AuthProvider";

interface ProfileEditProps {
  form: any;
  setForm: (data: any) => void;
  onCancel: () => void;
  onSave: (finalImageUrl?: string | null) => void; 
}

export default function ProfileEdit({ form, setForm, onCancel, onSave }: ProfileEditProps) {
  const { user, token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // --- States สำหรับจัดการ Logic สำรองข้อมูลก่อนบันทึกจริง ---
  const [pendingImage, setPendingImage] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [isDeletedPending, setIsDeletedPending] = useState(false);

  // 1. ฟังก์ชันเลือกรูปภาพ (จำค่าไว้ใน State ยังไม่ Upload)
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'ขออภัย เราต้องการสิทธิ์เข้าถึงคลังรูปภาพ');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const localUri = asset.uri;
      const filename = localUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      setPendingImage({ uri: localUri, name: filename, type });
      setIsDeletedPending(false); // ยกเลิกสถานะลบหากมีการเลือกรูปใหม่
      setForm({ ...form, image_url: localUri }); // แสดง Preview รูปภาพในเครื่อง
    }
  };

  // 2. ฟังก์ชันลบรูปโปรไฟล์ (ลบแค่ใน UI ก่อน)
  const handleDeleteImageUI = () => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบรูปโปรไฟล์ใช่หรือไม่? (การลบจะมีผลเมื่อคุณกดบันทึก)", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: () => {
          setForm({ ...form, image_url: null });
          setPendingImage(null);
          setIsDeletedPending(true); // ตั้ง Flag ว่าให้ไปลบจริงตอนกดบันทึก
        }
      }
    ]);
  };

  // 3. ฟังก์ชันอัปโหลดไปยัง Cloudinary (เรียกใช้ตอน Save)
  const uploadImageToCloudinary = async (): Promise<string | null> => {
    if (!pendingImage) return null;

    const formDataUpload = new FormData();
    // @ts-ignore
    formDataUpload.append('file', {
      uri: pendingImage.uri,
      name: pendingImage.name,
      type: pendingImage.type,
    });

    const apiUrl = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/upload/service-profile?userId=${user?.id}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formDataUpload,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');

    return data.url || data.image_url;
  };

  // 4. ฟังก์ชันลบรูปจาก Server (เรียกใช้ตอน Save)
  const deleteImageFromServer = async () => {
    if (!user?.id || !token) return;
    // ตรวจสอบความถูกต้องของ Query Parameter ชื่อ workerId ให้ตรงกับ Backend
    const url = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/delete/service-profile?workerId=${user.id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "ลบรูปจากเซิร์ฟเวอร์ไม่สำเร็จ");
    }
  };

  // 5. ฟังก์ชันกดยืนยันบันทึกทั้งหมด (รวม Logic อัปโหลด/ลบ และส่งค่ากลับ Parent)
  // แก้ไขส่วน STEP 3 ในฟังก์ชัน handleConfirmSave
  const handleConfirmSave = async () => {
    try {
      setIsProcessing(true);
      let finalUrl = form.image_url;

      // STEP 1: ลบรูปเดิมออกหากมีการกดลบ
      if (isDeletedPending && !pendingImage) {
        await deleteImageFromServer();
        finalUrl = null;
      }

      // STEP 2: อัปโหลดรูปใหม่หากมีการเลือกไว้
      if (pendingImage) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          finalUrl = uploadedUrl;
        }
      }

      // STEP 3: ส่งข้อมูลกลับไปที่ Parent
      // ส่ง finalUrl ไปเพื่อให้ Parent อัปเดต state และยิง API ต่อ
      onSave(finalUrl); 
      
      setPendingImage(null);
      setIsDeletedPending(false);
    } catch (error: any) {
      Alert.alert('Save Error', error.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <View style={styles.editHeaderRow}>
          <TouchableOpacity onPress={onCancel} activeOpacity={0.6} disabled={isProcessing}>
            <Text style={styles.cancelBtnText}>ยกเลิก</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Bold', fontSize: 17, color: '#1E293B' }}>แก้ไขโปรไฟล์</Text>
          <TouchableOpacity onPress={handleConfirmSave} activeOpacity={0.6} disabled={isProcessing}>
            <Text style={[styles.saveBtnText, isProcessing && { color: '#94A3B8' }]}>
              {isProcessing ? "กำลังบันทึก..." : "บันทึก"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          {isProcessing && (
            <View style={styles.avatarLoading}>
              <ActivityIndicator color="#FFF" />
            </View>
          )}
          <Image
            source={{ uri: form?.image_url ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
            style={styles.avatar}
          />

          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isProcessing}
            style={[styles.iconBtn, styles.editFloatingBtn, { position: 'absolute', bottom: 0, right: 0, borderWidth: 3, borderColor: '#FFF' }]}
          >
            <Ionicons name="camera" size={18} color="#FFF" />
          </TouchableOpacity>

          {form?.image_url && (
            <TouchableOpacity
              onPress={handleDeleteImageUI}
              disabled={isProcessing}
              style={[styles.iconBtn, { position: 'absolute', bottom: 0, left: 0, backgroundColor: '#EF4444', borderWidth: 3, borderColor: '#FFF' }]}
            >
              <Ionicons name="trash" size={16} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ marginTop: 10, color: '#94A3B8', fontSize: 12, fontFamily: 'Regular' }}>
          {isProcessing ? "ระบบกำลังประมวลผล..." : "แตะไอคอนกล้องเพื่อเลือกรูปใหม่"}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ข้อมูลส่วนตัว</Text>
        <EditInput
          label="ชื่อผู้ใช้งาน"
          value={form?.name}
          onChangeText={(val: string) => setForm({ ...form, name: val })}
        />
        <EditInput
          label="เบอร์โทรศัพท์"
          value={form?.tel}
          keyboardType="phone-pad"
          onChangeText={(val: string) => setForm({ ...form, tel: val })}
        />
      </View>

          {/* Services Radio Type */}
      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ประเภทงานที่ให้บริการ</Text>
        
        {/* ตรวจสอบว่าเป็น Array และดึงข้อมูลมา Map */}
        {Array.isArray(form?.all_services) ? (
          form.all_services.map((service: any, index: number) => {
            // ใช้ชื่อจาก DB ตรงๆ (เช่น "ซักผ้า", "นวด", "ทำความสะอาด")
            const serviceName = service.name; 

            // เช็คสถานะการเลือกจาก Array selected_services
            const isActive = form?.selected_services?.includes(serviceName);

            const toggleService = () => {
              let nextServices = [...(form.selected_services || [])];
              if (isActive) {
                // ถ้ามีอยู่แล้วให้เอาออก
                nextServices = nextServices.filter((name: string) => name !== serviceName);
              } else {
                // ถ้ายังไม่มีให้เพิ่มเข้า
                nextServices.push(serviceName);
              }
              setForm({ ...form, selected_services: nextServices });
            };

            return (
              <TouchableOpacity
                key={service.id || index}
                onPress={toggleService}
                style={[styles.jobOptionCard, isActive && styles.radioOptionActive]}
              >
                <Ionicons
                  name={isActive ? "checkbox" : "square-outline"}
                  size={24}
                  color={isActive ? "#4F46E5" : "#CBD5E1"}
                />
                <Text style={[styles.radioText, isActive && styles.radioTextActive]}>
                  {serviceName} {/* แสดงชื่อจาก Database โดยตรง */}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          // กรณีข้อมูลยังโหลดไม่เสร็จ หรือ all_services ยังเป็น undefined
          <ActivityIndicator color="#4F46E5" style={{ marginVertical: 20 }} />
        )}
      </View>

    </View>
  );
}

const EditInput = ({ label, ...props }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.textInputField}
      placeholderTextColor="#CBD5E1"
      {...props}
    />
  </View>
);