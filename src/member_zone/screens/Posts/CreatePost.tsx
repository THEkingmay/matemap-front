import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/CreatePostStyle";
import { useAuth } from "../../../AuthProvider";
import DatePickerModal from "./DatePickerModal";
import { CreateDormFormState } from "../../../../types/type";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

export default function CreatePost() {
  const initialForm: CreateDormFormState = {
    roomNumber: "",
    roomType: "",
    price: "",
    description: "",
    readyDate: null,
  };

  const [form, setForm] = useState<CreateDormFormState>(initialForm);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [dormId, setDormId] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const { user, token } = useAuth();

  const FACILITIES = [
    "Wi-Fi",
    "เครื่องปรับอากาศ",
    "ตู้เย็น",
    "เครื่องทำน้ำอุ่น",
    "ที่จอดรถ",
    "ลิฟต์",
    "ระบบรักษาความปลอดภัย",
    "ซักรีดหยอดเหรียญ",
  ];

  const toggleFacility = (item: string) => {
    setFacilities(prev =>
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item],
    );
  };

  const clearForm = () => {
    Alert.alert("ล้างข้อมูล", "คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมด?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ล้าง",
        style: "destructive",
        onPress: () => {
          setForm(initialForm);
          setFacilities([]);
        },
      },
    ]);
  };

  useEffect(() => {
    if (!token || !user?.id) return;

    const fetchDorm = async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/my/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) return;

      const dorm = await res.json();
      setDormId(dorm.id);
    };

    fetchDorm();
  }, [token, user?.id]);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert("ต้องอนุญาตให้เข้าถึงรูปภาพ");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (postId: string): Promise<string | null> => {
    if (!imageUri || !dormId) return null;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "room.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/upload/dorm-posts?dormId=${dormId}&postId=${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");

      return data.imageUrl || data.url || data.image_url;
    } catch (error) {
      Alert.alert("อัปโหลดรูปไม่สำเร็จ");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!dormId || !form.readyDate) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // Create post first (NO IMAGE)
    const payloadWithoutImage = {
      roomNumber: form.roomNumber,
      roomType: form.roomType,
      rentPrice: Number(form.price),
      detail: form.description,
      readyDate: form.readyDate,
      facilities,
    };

    try {
      setSubmitting(true);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${dormId}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payloadWithoutImage),
        },
      );

      if (!res.ok) {
        Alert.alert("สร้างโพสต์ไม่สำเร็จ");
        return;
      }

      const {
        post: { id: postId },
      } = await res.json();

      // console.log(postId);

      // Upload image if exists
      if (imageUri) {
        const imageUrl = await uploadImage(postId);
        if (!imageUrl) {
          Alert.alert("โพสต์ถูกสร้างแล้ว แต่รูปอัปโหลดไม่สำเร็จ");
        }
      }

      setForm(initialForm);
      setFacilities([]);
      setImageUri(null);

      Alert.alert("สำเร็จ", "สร้างโพสต์สำเร็จ");
    } catch (error) {
      console.log(error);
      Alert.alert("เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>สร้างโพสต์ห้องว่าง</Text>
        <Text style={styles.subtitle}>
          กรอกข้อมูลหอพักและอัปโหลดรูปภาพเพื่อหาผู้เช่า
        </Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Upload */}
        <Text style={styles.label}>รูปภาพห้องพัก</Text>

        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: 120, height: 120, borderRadius: 12 }}
            />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
              <Text style={styles.uploadText}>อัปโหลด</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Room Number */}
        <Text style={styles.label}>เลขที่ห้อง *</Text>
        <TextInput
          style={styles.input}
          value={form.roomNumber}
          onChangeText={text => setForm(p => ({ ...p, roomNumber: text }))}
        />

        {/* Room Type */}
        <Text style={styles.label}>ประเภทห้อง *</Text>
        <TextInput
          style={styles.input}
          value={form.roomType}
          onChangeText={text => setForm(p => ({ ...p, roomType: text }))}
        />

        {/* Price */}
        <Text style={styles.label}>ค่าเช่า (บาท/เดือน) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={form.price}
          onChangeText={text => setForm(p => ({ ...p, price: text }))}
        />

        {/* Description */}
        <Text style={styles.label}>รายละเอียดเพิ่มเติม</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={form.description}
          onChangeText={text => setForm(p => ({ ...p, description: text }))}
        />

        {/* Facilities */}
        <Text style={styles.label}>สิ่งอำนวยความสะดวก</Text>
        <View style={styles.facilityWrap}>
          {FACILITIES.map(item => {
            const active = facilities.includes(item);
            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleFacility(item)}
                style={[styles.facilityItem, active && styles.facilityActive]}
              >
                <Text
                  style={[
                    styles.facilityText,
                    active && styles.facilityTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Ready Date */}
        <View style={styles.section}>
          <Text style={styles.label}>วันที่พร้อมเข้าอยู่ *</Text>

          <Pressable
            style={styles.trigger}
            onPress={() => setIsDatePickerOpen(true)}
          >
            <View style={styles.triggerLeft}>
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              <Text style={styles.triggerText}>
                {form.readyDate
                  ? form.readyDate.toLocaleDateString("th-TH")
                  : "เลือกวันที่"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (submitting || uploading) && { opacity: 0.7 },
          ]}
          disabled={submitting || uploading}
          onPress={handleSubmit}
        >
          {submitting || uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>เผยแพร่โพสต์</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={clearForm}>
          <Text style={styles.clearText}>ล้างข้อมูล</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={isDatePickerOpen}
        tempDate={tempDate}
        onClose={() => setIsDatePickerOpen(false)}
        onChangeDate={setTempDate}
        onConfirm={() => {
          setForm(prev => ({ ...prev, readyDate: tempDate }));
          setIsDatePickerOpen(false);
        }}
      />
    </ScrollView>
  );
}
