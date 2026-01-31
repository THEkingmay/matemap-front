import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../../styles/profile.view.styles";
import { useAuth } from "../../../AuthProvider";

interface ProfileEditProps {
  form: any;
  setForm: (data: any) => void;
  onCancel: () => void;
  onSave: (finalImageUrl?: string | null) => void;
}

export default function ProfileEdit({
  form,
  setForm,
  onCancel,
  onSave,
}: ProfileEditProps) {
  const { user, token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // เก็บข้อมูลไฟล์ภาพจริงเพื่อรออัปโหลด
  const [pendingImage, setPendingImage] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const [isDeletedPending, setIsDeletedPending] = useState(false);

  // -------------------- Car States --------------------
  const [carPlate, setCarPlate] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carDetail, setCarDetail] = useState("");

  const updateCarRegistration = (
    plate = carPlate,
    model = carModel,
    detail = carDetail
  ) => {
    const carRegistrationString = [plate, model, detail]
      .filter(Boolean)
      .join(" | ");

    setForm((prev: any) => ({
      ...prev,
      car_registration: carRegistrationString,
    }));
  };

  // -------------------- Cloudinary Upload --------------------
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

  // -------------------- Image Picker --------------------
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "ขออภัย เราต้องการสิทธิ์เข้าถึงคลังรูปภาพ");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      const localUri = asset.uri;
      const filename = localUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      setPendingImage({ uri: localUri, name: filename, type });
      setIsDeletedPending(false);
      
      // Preview เฉยๆ ในหน้าแก้
      setForm((prev: any) => ({ ...prev, image_url: localUri }));
    } catch (err) {
      Alert.alert("Error", "ไม่สามารถเลือกรูปภาพได้");
    }
  };

  const handleDeleteImageUI = () => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบรูปโปรไฟล์ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: () => {
          setPendingImage(null);
          setIsDeletedPending(true);
          setForm((prev: any) => ({ ...prev, image_url: null }));
        },
      },
    ]);
  };

  // -------------------- Save --------------------
  const handleConfirmSave = async () => {
    if (!form?.name?.trim()) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกชื่อผู้ใช้งาน");
      return;
    }

    try {
      setIsProcessing(true);

      let finalUrl = form.image_url; // ค่าเริ่มต้นเป็นค่าเดิมที่อยู่ใน form

      // 1. ถ้ามีการสั่งลบรูป
      if (isDeletedPending) {
        finalUrl = null;
      } 
      // 2. ถ้ามีการเลือกรูปใหม่ ต้องอัปโหลดก่อน
      else if (pendingImage) {
        finalUrl = await uploadImageToCloudinary();
      }

      // ส่ง URL ที่เป็น "String" (จาก Cloudinary หรือ URL เดิม) กลับไปที่ไฟล์ Screen
      onSave(finalUrl);
    } catch (error: any) {
      Alert.alert("Upload Error", error.message || "ไม่สามารถอัปโหลดรูปภาพได้");
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------- Sync car_registration --------------------
  useEffect(() => {
    if (form?.car_registration) {
      const parts = form.car_registration.split("|").map((p: string) => p.trim());
      const p = parts[0] || "";
      const m = parts[1] || "";
      const d = parts[2] || "";

      if (p !== carPlate) setCarPlate(p);
      if (m !== carModel) setCarModel(m);
      if (d !== carDetail) setCarDetail(d);
    }
  }, [form?.car_registration]);

  return (
    <View style={styles.spaceBottom}>
      <View style={styles.mainCard}>
        <View style={styles.editHeaderRow}>
          <TouchableOpacity onPress={onCancel} disabled={isProcessing}>
            <Text style={styles.cancelBtnText}>ยกเลิก</Text>
          </TouchableOpacity>
          <Text style={styles.titleText}>แก้ไขโปรไฟล์</Text>
          <TouchableOpacity onPress={handleConfirmSave} disabled={isProcessing}>
            <Text style={[styles.saveBtnText, isProcessing && { color: "#94A3B8" }]}>
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
            source={{
              uri: form?.image_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isProcessing}
            style={[styles.iconBtn, styles.editFloatingBtn, { position: "absolute", bottom: 0, right: 0, borderWidth: 3, borderColor: "#FFF" }]}
          >
            <Ionicons name="camera" size={18} color="#FFF" />
          </TouchableOpacity>

          {!!form?.image_url && (
            <TouchableOpacity
              onPress={handleDeleteImageUI}
              disabled={isProcessing}
              style={[styles.iconBtn, { position: "absolute", bottom: 0, left: 0, backgroundColor: "#EF4444", borderWidth: 3, borderColor: "#FFF" }]}
            >
              <Ionicons name="trash" size={16} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
        {/* {Text that describes the image before upload} */}
          <View style={{ marginTop: 8 }}>
            <Text style={styles.avatarWarnText}>
              รองรับไฟล์ .jpg, .png ขนาดไม่เกิน 5MB
            </Text>
          </View>
      </View>

      {/* Input อื่นๆ */}
      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ข้อมูลส่วนตัว</Text>
        <EditInput label="ชื่อผู้ใช้งาน" value={form?.name || ""} onChangeText={(val: string) => setForm((p: any) => ({ ...p, name: val }))} />
        <EditInput label="เบอร์โทรศัพท์" value={form?.tel || ""} keyboardType="phone-pad" onChangeText={(val: string) => setForm((p: any) => ({ ...p, tel: val }))} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ข้อมูลรถ</Text>
        <EditInput label="เลขทะเบียนรถ" value={carPlate} onChangeText={(v: string) => { setCarPlate(v); updateCarRegistration(v, carModel, carDetail); }} />
        <EditInput label="รุ่นรถ" value={carModel} onChangeText={(v: string) => { setCarModel(v); updateCarRegistration(carPlate, v, carDetail); }} />
        <EditInput label="รายละเอียดรถ" value={carDetail} onChangeText={(v: string) => { setCarDetail(v); updateCarRegistration(carPlate, carModel, v); }} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ประเภทงานที่ให้บริการ</Text>
        {Array.isArray(form?.all_services) ? form.all_services.map((service: any, index: number) => {
          const serviceName = service?.name || "";
          const isActive = form?.selected_services?.includes(serviceName);
          return (
            <TouchableOpacity
              key={service.id || index}
              onPress={() => {
                setForm((prev: any) => {
                  let next = [...(prev.selected_services || [])];
                  next = isActive ? next.filter(n => n !== serviceName) : [...next, serviceName];
                  return { ...prev, selected_services: next };
                });
              }}
              style={[styles.jobOptionCard, isActive && styles.radioOptionActive]}
            >
              <Ionicons name={isActive ? "checkbox" : "square-outline"} size={24} color={isActive ? "#4F46E5" : "#CBD5E1"} />
              <Text style={[styles.radioText, isActive && styles.radioTextActive]}>{serviceName}</Text>
            </TouchableOpacity>
          );
        }) : <ActivityIndicator color="#4F46E5" />}
      </View>
    </View>
  );
}

const EditInput = ({ label, ...props }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput {...props} style={styles.textInputField} placeholderTextColor="#CBD5E1" />
  </View>
);