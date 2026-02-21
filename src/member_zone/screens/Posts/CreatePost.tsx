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
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../AuthProvider";
import DatePickerModal from "./DatePickerModal";
import { CreateDormFormState } from "../../../../types/type";
import * as ImagePicker from "expo-image-picker";

const MainColor = "#2E7D32";

const FACILITIES = [
  { label: "Wi-Fi", icon: "wifi-outline" },
  { label: "เครื่องปรับอากาศ", icon: "snow-outline" },
  { label: "ตู้เย็น", icon: "cube-outline" },
  { label: "เครื่องทำน้ำอุ่น", icon: "water-outline" },
  { label: "ที่จอดรถ", icon: "car-outline" },
  { label: "ลิฟต์", icon: "arrow-up-outline" },
  { label: "ระบบรักษาความปลอดภัย", icon: "shield-checkmark-outline" },
  { label: "ซักรีดหยอดเหรียญ", icon: "shirt-outline" },
];

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

  const toggleFacility = (item: string) => {
    setFacilities(prev =>
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
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
          setImageUri(null);
        },
      },
    ]);
  };

  useEffect(() => {
    if (!token || !user?.id) return;
    const fetchDorm = async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/my/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const dorm = await res.json();
      setDormId(dorm.id);
    };
    fetchDorm();
  }, [token, user?.id]);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("ต้องอนุญาตให้เข้าถึงรูปภาพ");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async (postId: string): Promise<string | null> => {
    if (!imageUri || !dormId) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", { uri: imageUri, name: "room.jpg", type: "image/jpeg" } as any);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/upload/dorm-posts?dormId=${dormId}&postId=${postId}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed");
      return data.imageUrl || data.url || data.image_url;
    } catch {
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
    const payload = {
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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) { Alert.alert("สร้างโพสต์ไม่สำเร็จ"); return; }
      const { post: { id: postId } } = await res.json();
      if (imageUri) {
        const imageUrl = await uploadImage(postId);
        if (!imageUrl) Alert.alert("โพสต์ถูกสร้างแล้ว แต่รูปอัปโหลดไม่สำเร็จ");
      }
      setForm(initialForm);
      setFacilities([]);
      setImageUri(null);
      Alert.alert("สำเร็จ", "สร้างโพสต์สำเร็จ");
    } catch {
      Alert.alert("เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = submitting || uploading;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>สร้างโพสต์</Text>
          <Text style={styles.headerSub}>กรอกข้อมูลห้องว่างเพื่อหาผู้เช่า</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="add-circle-outline" size={28} color="rgba(255,255,255,0.9)" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── รูปภาพ ── */}
        <View style={styles.card}>
          <SectionLabel icon="image-outline" title="รูปภาพห้องพัก" />
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage} activeOpacity={0.8}>
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
                <View style={styles.changeImageBadge}>
                  <Ionicons name="camera" size={13} color="#fff" />
                  <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
                </View>
              </>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconCircle}>
                  <Ionicons name="cloud-upload-outline" size={30} color={MainColor} />
                </View>
                <Text style={styles.uploadTitle}>แตะเพื่ออัปโหลดรูป</Text>
                <Text style={styles.uploadHint}>JPG, PNG — แนะนำ 4:3</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── ข้อมูลห้อง ── */}
        <View style={styles.card}>
          <SectionLabel icon="home-outline" title="ข้อมูลห้องพัก" />

          <FieldLabel text="เลขที่ห้อง *" />
          <TextInput
            style={styles.input}
            value={form.roomNumber}
            onChangeText={text => setForm(p => ({ ...p, roomNumber: text }))}
            placeholder="เช่น 101, A-205"
            placeholderTextColor="#CCC"
          />

          <FieldLabel text="ประเภทห้อง *" />
          <TextInput
            style={styles.input}
            value={form.roomType}
            onChangeText={text => setForm(p => ({ ...p, roomType: text }))}
            placeholder="เช่น ห้องเดี่ยว, ห้องคู่"
            placeholderTextColor="#CCC"
          />

          <FieldLabel text="ค่าเช่า (บาท/เดือน) *" />
          <View style={styles.priceInputWrap}>
            <Text style={styles.pricePrefix}>฿</Text>
            <TextInput
              style={styles.priceInput}
              keyboardType="numeric"
              value={form.price}
              onChangeText={text => setForm(p => ({ ...p, price: text }))}
              placeholder="0"
              placeholderTextColor="#CCC"
            />
            <Text style={styles.priceSuffix}>/เดือน</Text>
          </View>

          <FieldLabel text="รายละเอียดเพิ่มเติม" />
          <TextInput
            style={styles.textArea}
            multiline
            value={form.description}
            onChangeText={text => setForm(p => ({ ...p, description: text }))}
            placeholder="บรรยายข้อมูลเพิ่มเติมเกี่ยวกับห้องพัก..."
            placeholderTextColor="#CCC"
            textAlignVertical="top"
          />
        </View>

        {/* ── สิ่งอำนวยความสะดวก ── */}
        <View style={styles.card}>
          <SectionLabel icon="checkmark-circle-outline" title="สิ่งอำนวยความสะดวก" />
          {facilities.length > 0 && (
            <Text style={styles.selectedCount}>เลือกแล้ว {facilities.length} รายการ</Text>
          )}
          <View style={styles.facilityGrid}>
            {FACILITIES.map(({ label, icon }) => {
              const active = facilities.includes(label);
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => toggleFacility(label)}
                  activeOpacity={0.75}
                  style={[styles.facilityItem, active && styles.facilityActive]}
                >
                  <Ionicons
                    name={icon as any}
                    size={18}
                    color={active ? MainColor : "#BBB"}
                  />
                  <Text style={[styles.facilityText, active && styles.facilityTextActive]}>
                    {label}
                  </Text>
                  {active && (
                    <View style={styles.facilityCheck}>
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── วันที่พร้อมเข้าอยู่ ── */}
        <View style={styles.card}>
          <SectionLabel icon="calendar-outline" title="วันที่พร้อมเข้าอยู่" />
          <Pressable
            style={[styles.dateTrigger, form.readyDate && styles.dateTriggerActive]}
            onPress={() => setIsDatePickerOpen(true)}
          >
            <View style={styles.dateTriggerLeft}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={form.readyDate ? MainColor : "#BBB"}
              />
              <Text style={[styles.dateTriggerText, form.readyDate && styles.dateTriggerTextActive]}>
                {form.readyDate
                  ? form.readyDate.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })
                  : "เลือกวันที่"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={form.readyDate ? MainColor : "#CCC"} />
          </Pressable>
        </View>

        {/* ── ปุ่ม ── */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            disabled={isLoading}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                <Text style={styles.submitText}>เผยแพร่โพสต์</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearBtn} onPress={clearForm} activeOpacity={0.75}>
            <Ionicons name="refresh-outline" size={16} color="#999" />
            <Text style={styles.clearText}>ล้างข้อมูล</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

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
    </View>
  );
}

/* ── Helpers ── */
const SectionLabel = ({ icon, title }: { icon: any; title: string }) => (
  <View style={styles.sectionLabel}>
    <View style={styles.sectionIconCircle}>
      <Ionicons name={icon} size={16} color={MainColor} />
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const FieldLabel = ({ text }: { text: string }) => (
  <Text style={styles.fieldLabel}>{text}</Text>
);

/* ── Styles ── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },

  /* Header */
  header: {
    backgroundColor: "#8C9CCE",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  headerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  scrollContent: { paddingTop: 16, paddingBottom: 40 },

  /* Card */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  /* Section label */
  sectionLabel: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  sectionIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#F0F9F4",
    justifyContent: "center", alignItems: "center",
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1A1A1A" },

  /* Field label */
  fieldLabel: { fontSize: 12, color: "#888", marginBottom: 6, marginTop: 4 },

  /* Upload */
  uploadBox: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    backgroundColor: "#F8F8F8",
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadedImage: { width: "100%", height: "100%" },
  changeImageBadge: {
    position: "absolute", bottom: 10, right: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20,
  },
  changeImageText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  uploadPlaceholder: { alignItems: "center", gap: 6 },
  uploadIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#F0F9F4",
    justifyContent: "center", alignItems: "center",
    marginBottom: 4,
  },
  uploadTitle: { fontSize: 14, fontWeight: "600", color: "#444" },
  uploadHint: { fontSize: 12, color: "#BBB" },

  /* Input */
  input: {
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
    marginBottom: 4,
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
    minHeight: 90,
    marginBottom: 4,
  },

  /* Price input */
  priceInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  pricePrefix: { fontSize: 16, color: MainColor, fontWeight: "700", marginRight: 6 },
  priceInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: "#333" },
  priceSuffix: { fontSize: 12, color: "#AAA" },

  /* Facilities */
  selectedCount: { fontSize: 12, color: MainColor, marginBottom: 10, fontWeight: "600" },
  facilityGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#EBEBEB",
    backgroundColor: "#FAFAFA",
    position: "relative",
  },
  facilityActive: {
    borderColor: MainColor,
    backgroundColor: "#F0F9F4",
  },
  facilityText: { fontSize: 12, color: "#888" },
  facilityTextActive: { color: MainColor, fontWeight: "600" },
  facilityCheck: {
    position: "absolute",
    top: -5, right: -5,
    width: 16, height: 16,
    borderRadius: 8,
    backgroundColor: MainColor,
    justifyContent: "center", alignItems: "center",
  },

  /* Date trigger */
  dateTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#EFEFEF",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#FAFAFA",
  },
  dateTriggerActive: {
    borderColor: MainColor,
    backgroundColor: "#F0F9F4",
  },
  dateTriggerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  dateTriggerText: { fontSize: 14, color: "#BBB" },
  dateTriggerTextActive: { color: MainColor, fontWeight: "600" },

  /* Actions */
  actionContainer: { paddingHorizontal: 16, gap: 10 },
  submitBtn: {
    backgroundColor: MainColor,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: MainColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnDisabled: { opacity: 0.65 },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8E8E8",
    backgroundColor: "#fff",
  },
  clearText: { color: "#999", fontSize: 14 },
});