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

  // ✅ sync car -> form แบบ realtime
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

  // -------------------- Image Picker --------------------
  const handlePickImage = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "ขออภัย เราต้องการสิทธิ์เข้าถึงคลังรูปภาพ"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const localUri = asset.uri;
    const filename = localUri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    setPendingImage({ uri: localUri, name: filename, type });
    setIsDeletedPending(false);
    setForm({ ...form, image_url: localUri });
  };

  // -------------------- Delete Image UI --------------------
  const handleDeleteImageUI = () => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณต้องการลบรูปโปรไฟล์ใช่หรือไม่? (การลบจะมีผลเมื่อคุณกดบันทึก)",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ลบ",
          style: "destructive",
          onPress: () => {
            setForm({ ...form, image_url: null });
            setPendingImage(null);
            setIsDeletedPending(true);
          },
        },
      ]
    );
  };

  // -------------------- Validate --------------------
  const validateForm = () => {
    if (!form?.name || form.name.trim() === "") {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกชื่อผู้ใช้งาน");
      return false;
    }

    const phone = form?.tel?.trim();
    const thaiPhoneRegex = /^0\d{9}$/;

    if (!phone) {
      Alert.alert("ข้อมูลไม่ครบ", "กรุณากรอกเบอร์โทรศัพท์");
      return false;
    }

    if (!thaiPhoneRegex.test(phone)) {
      Alert.alert(
        "เบอร์โทรไม่ถูกต้อง",
        "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก (เช่น 08xxxxxxxx)"
      );
      return false;
    }

    return true;
  };

  // -------------------- Save --------------------
  const handleConfirmSave = async () => {
    if (!validateForm()) return;

    try {
      setIsProcessing(true);

      onSave(form.image_url ?? null);
    } catch (error: any) {
      Alert.alert(
        "Save Error",
        error.message || "ไม่สามารถบันทึกข้อมูลได้"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------- Sync car_registration --------------------
  useEffect(() => {
    if (form?.car_registration) {
      const parts = form.car_registration
        .split("|")
        .map((p: string) => p.trim());

      setCarPlate(parts[0] || "");
      setCarModel(parts[1] || "");
      setCarDetail(parts[2] || "");
    }
  }, [form?.car_registration]);

  // -------------------- Render --------------------
  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <View style={styles.editHeaderRow}>
          <TouchableOpacity onPress={onCancel} disabled={isProcessing}>
            <Text style={styles.cancelBtnText}>ยกเลิก</Text>
          </TouchableOpacity>

          <Text style={styles.titleText}>แก้ไขโปรไฟล์</Text>

          <TouchableOpacity
            onPress={handleConfirmSave}
            disabled={isProcessing}
          >
            <Text
              style={[
                styles.saveBtnText,
                isProcessing && { color: "#94A3B8" },
              ]}
            >
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
              uri:
                form?.image_url ??
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />

          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isProcessing}
            style={[
              styles.iconBtn,
              styles.editFloatingBtn,
              {
                position: "absolute",
                bottom: 0,
                right: 0,
                borderWidth: 3,
                borderColor: "#FFF",
              },
            ]}
          >
            <Ionicons name="camera" size={18} color="#FFF" />
          </TouchableOpacity>

          {form?.image_url && (
            <TouchableOpacity
              onPress={handleDeleteImageUI}
              disabled={isProcessing}
              style={[
                styles.iconBtn,
                {
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  backgroundColor: "#EF4444",
                  borderWidth: 3,
                  borderColor: "#FFF",
                },
              ]}
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

      {/* ---------- Personal Info ---------- */}
      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ข้อมูลส่วนตัว</Text>

        <EditInput
          label="ชื่อผู้ใช้งาน"
          value={form?.name}
          placeholder="เช่น สมชาย ใจดี"
          onChangeText={(val: string) =>
            setForm({ ...form, name: val })
          }
        />

        <EditInput
          label="เบอร์โทรศัพท์"
          value={form?.tel}
          keyboardType="phone-pad"
          placeholder="เช่น 08xxxxxxxx"
          maxLength={10}
          onChangeText={(val: string) =>{
            if(val.length <= 10) {
              setForm({ ...form, tel: val });
            }
          }}
          />
      </View>

      {/* ---------- Car Info ---------- */}
      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ข้อมูลรถ</Text>

        <EditInput
          label="เลขทะเบียนรถ"
          value={carPlate}
          onChangeText={(val: string) => {
            setCarPlate(val);
            updateCarRegistration(val, carModel, carDetail);
          }}
        />

        <EditInput
          label="รุ่นรถ"
          value={carModel}
          onChangeText={(val: string) => {
            setCarModel(val);
            updateCarRegistration(carPlate, val, carDetail);
          }}
        />

        <EditInput
          label="รายละเอียดรถ"
          value={carDetail}
          onChangeText={(val: string) => {
            setCarDetail(val);
            updateCarRegistration(carPlate, carModel, val);
          }}
        />
      </View>

      {/* ---------- Services Radio ---------- */}
      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ประเภทงานที่ให้บริการ</Text>

        {Array.isArray(form?.all_services) ? (
          form.all_services.map((service: any, index: number) => {
            const serviceName = service.name;
            const isActive =
              form?.selected_services?.includes(serviceName);

            const toggleService = () => {
              let nextServices = [...(form.selected_services || [])];
              if (isActive) {
                nextServices = nextServices.filter(
                  (name: string) => name !== serviceName
                );
              } else {
                nextServices.push(serviceName);
              }
              setForm({
                ...form,
                selected_services: nextServices,
              });
            };

            return (
              <TouchableOpacity
                key={service.id || index}
                onPress={toggleService}
                style={[
                  styles.jobOptionCard,
                  isActive && styles.radioOptionActive,
                ]}
              >
                <Ionicons
                  name={isActive ? "checkbox" : "square-outline"}
                  size={24}
                  color={isActive ? "#4F46E5" : "#CBD5E1"}
                />
                <Text
                  style={[
                    styles.radioText,
                    isActive && styles.radioTextActive,
                  ]}
                >
                  {serviceName}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <ActivityIndicator
            color="#4F46E5"
            style={{ marginVertical: 20 }}
          />
        )}
      </View>
    </View>
  );
}

const EditInput = ({ label, ...props }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      {...props}
      style={styles.textInputField}
      placeholderTextColor="#CBD5E1"
    />
  </View>
);
