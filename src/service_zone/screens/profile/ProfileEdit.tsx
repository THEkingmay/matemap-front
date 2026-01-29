import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
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
  const handleConfirmSave = async () => {
    try {
      setIsProcessing(true);
      let finalUrl = form.image_url; // ค่าเริ่มต้น (อาจเป็น URL เดิม หรือ Local URI)

      // STEP 1: ลบรูปเดิมออกหากผู้ใช้กดลบ (และไม่ได้เลือกรูปใหม่มาแทน)
      if (isDeletedPending && !pendingImage) {
        await deleteImageFromServer();
        finalUrl = null;
      }

      // STEP 2: อัปโหลดรูปใหม่หากมีการเลือกไว้
      if (pendingImage) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          finalUrl = uploadedUrl; // อัปเดต finalUrl เป็น https:// จาก Cloudinary
        }
      }

      // STEP 3: ส่ง URL จริงกลับไปที่ Parent เพื่ออัปเดต Database
      // finalUrl ตอนนี้จะเป็น: URL ใหม่ (https), null (กรณีลบ), หรือ URL เดิม
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

      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ประเภทงานที่ให้บริการ</Text>
        {[
          ['delivery', 'ขนของ / ย้ายของ'],
          ['cleaning', 'ทำความสะอาด'],
          ['other', 'บริการอื่นๆ']
        ].map(([key, label]) => {
          const isActive = form?.job_type === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setForm({ ...form, job_type: key })}
              style={[styles.jobOptionCard, isActive && styles.radioOptionActive]}
            >
              <Ionicons
                name={isActive ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={isActive ? "#4F46E5" : "#CBD5E1"}
              />
              <Text style={[styles.radioText, isActive && styles.radioTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
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