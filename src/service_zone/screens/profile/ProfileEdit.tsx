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
  onSave: (finalImageUrl?: string) => void; // แก้ไขให้รับ URL รูปใหม่ได้
}

export default function ProfileEdit({ form, setForm, onCancel, onSave }: ProfileEditProps) {
  const { user, token } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State สำหรับเก็บข้อมูลรูปภาพที่เลือกจากเครื่อง (Local URI)
  const [pendingImage, setPendingImage] = useState<{ uri: string; name: string; type: string } | null>(null);

  // 1. ฟังก์ชันเลือกรูปภาพ (บันทึกแค่ Local URI)
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'ขออภัย เราต้องการสิทธิ์เข้าถึงคลังรูปภาพเพื่อเปลี่ยนรูปโปรไฟล์');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7, // ลดขนาดไฟล์เล็กน้อยเพื่อความเร็วในการอัปโหลด
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const localUri = asset.uri;
      const filename = localUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // เก็บไว้ใน State เพื่อรออัปโหลดตอนกด Save
      setPendingImage({ uri: localUri, name: filename, type });
      
      // อัปเดตในฟอร์มทันทีเพื่อให้ UI แสดงรูป Preview
      setForm({ ...form, image_url: localUri });
    }
  };

  // 2. ฟังก์ชันอัปโหลดรูปภาพ (จะถูกเรียกโดย handleConfirmSave)
  const uploadImageToCloudinary = async (): Promise<string | null> => {
    if (!pendingImage) return null;

    const formDataUpload = new FormData();
    // @ts-ignore
    formDataUpload.append('file', {
      uri: pendingImage.uri,
      name: pendingImage.name,
      type: pendingImage.type,
    });

    const apiUrl = `http://192.168.0.106:3000/api/cloudinary/upload/service-profile?userId=${user?.id}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formDataUpload,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');

    return data.url || data.image_url;
  };

  // 3. ฟังก์ชันกดยืนยันบันทึกทั้งหมด
  const handleConfirmSave = async () => {
    try {
      setIsUploading(true);
      let finalUrl = form.image_url;

      // ถ้ามีการเลือกรูปใหม่ค้างไว้ ให้ทำการอัปโหลดก่อน
      if (pendingImage) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          finalUrl = uploadedUrl;
        }
      }

      // ส่งค่ากลับไปที่ Parent (ProfileView) เพื่อ Update Database
      onSave(finalUrl);
      setPendingImage(null); // เคลียร์รูปค้าง
    } catch (error: any) {
      Alert.alert('Save Error', error.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setIsUploading(false);
    }
  };

  // 4. ฟังก์ชันลบรูปโปรไฟล์ (ลบจาก Cloudinary ทันทีตาม Logic เดิม)
  const handleDeleteImage = async () => {
    if (!user?.id || !token) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบข้อมูลผู้ใช้งาน");
      return;
    }

    Alert.alert("ยืนยันการลบ", "คุณต้องการลบรูปโปรไฟล์ออกจากระบบใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          try {
            setIsDeleting(true);
            // ตรวจสอบ Parameter: workerId หรือ userId ให้ตรงกับ Backend
            const url = `http://192.168.0.106:3000/api/cloudinary/delete/service-profile?workerId=${user.id}`;
            console.log(user.id)
            const res = await fetch(url, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
              }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "ลบรูปไม่สำเร็จ");

            setForm({ ...form, image_url: null });
            setPendingImage(null);
            Toast.show({ type: 'success', text1: 'ลบรูปโปรไฟล์สำเร็จ' });
          } catch (err: any) {
            Alert.alert("เกิดข้อผิดพลาด", err.message);
          } finally {
            setIsDeleting(false);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.mainCard}>
        <View style={styles.editHeaderRow}>
          <TouchableOpacity onPress={onCancel} activeOpacity={0.6} disabled={isUploading || isDeleting}>
            <Text style={styles.cancelBtnText}>ยกเลิก</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Bold', fontSize: 17, color: '#1E293B' }}>แก้ไขโปรไฟล์</Text>
          <TouchableOpacity onPress={handleConfirmSave} activeOpacity={0.6} disabled={isUploading || isDeleting}>
            <Text style={[styles.saveBtnText, (isUploading || isDeleting) && { color: '#94A3B8' }]}>
              {isUploading ? "บันทึก..." : "บันทึก"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarWrapper}>
          {(isUploading || isDeleting) && (
            <View style={styles.avatarLoading}>
              <ActivityIndicator color="#FFF" />
            </View>
          )}
          <Image
            source={{ uri: form?.image_url ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
            style={styles.avatar}
          />

          {/* ปุ่มกล้อง */}
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isUploading || isDeleting}
            style={[styles.iconBtn, styles.editFloatingBtn, { position: 'absolute', bottom: 0, right: 0, borderWidth: 3, borderColor: '#FFF' }]}
          >
            <Ionicons name="camera" size={18} color="#FFF" />
          </TouchableOpacity>

          {/* ปุ่มลบรูป - แสดงเมื่อมีรูป */}
          {form?.image_url && (
            <TouchableOpacity
              onPress={handleDeleteImage}
              disabled={isUploading || isDeleting}
              style={[styles.iconBtn, { position: 'absolute', bottom: 0, left: 0, backgroundColor: '#EF4444', borderWidth: 3, borderColor: '#FFF' }]}
            >
              <Ionicons name="trash" size={16} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ marginTop: 10, color: '#94A3B8', fontSize: 12, fontFamily: 'Regular' }}>
          {isUploading ? "กำลังประมวลผล..." : isDeleting ? "กำลังลบรูป..." : "แตะไอคอนกล้องเพื่อเลือกรูปใหม่"}
        </Text>
      </View>

      {/* Input Section */}
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

      {/* Job Type Section */}
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