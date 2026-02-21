import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { HomeStackParamsList } from './HomeStack';
import { useAuth } from '../../../AuthProvider';
import { MainColor } from '../../../../constant/theme';

type Props = NativeStackScreenProps<HomeStackParamsList, 'editPost'>;

const FACILITIES = [
  { label: 'Wi-Fi', icon: 'wifi-outline' },
  { label: 'เครื่องปรับอากาศ', icon: 'snow-outline' },
  { label: 'ตู้เย็น', icon: 'cube-outline' },
  { label: 'เครื่องทำน้ำอุ่น', icon: 'water-outline' },
  { label: 'ที่จอดรถ', icon: 'car-outline' },
  { label: 'ลิฟต์', icon: 'arrow-up-outline' },
  { label: 'ระบบรักษาความปลอดภัย', icon: 'shield-checkmark-outline' },
  { label: 'ซักรีดหยอดเหรียญ', icon: 'shirt-outline' },
];

export default function EditPostScreen({ route, navigation }: Props) {
  const { post } = route.params;
  const { token } = useAuth();

  const [rentPrice, setRentPrice] = useState(String(post.rent_price));
  const [detail, setDetail] = useState(post.detail ?? '');
  const [facilities, setFacilities] = useState<string[]>(post.facilities ?? []);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ── IMAGE ── */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const uploadImage = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append('file', { uri: image, name: 'post.jpg', type: 'image/jpeg' } as any);
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/upload/dorm-posts?dormId=${post.dormId}&postId=${post.id}`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }
    );
    if (!res.ok) throw new Error('upload image failed');
  };

  /* ── FACILITY ── */
  const toggleFacility = (item: string) => {
    setFacilities(prev =>
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
    );
  };

  /* ── SAVE ── */
  const handleSave = async () => {
    if (!rentPrice || isNaN(Number(rentPrice))) {
      Alert.alert('กรุณากรอกราคาที่ถูกต้อง');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${post.dormId}/posts/${post.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ rent_price: Number(rentPrice), detail, facilities }),
        }
      );
      if (!res.ok) throw new Error('update failed');
      if (image) await uploadImage();
      Alert.alert('สำเร็จ', 'แก้ไขโพสต์เรียบร้อย');
      navigation.goBack();
    } catch {
      Alert.alert('ผิดพลาด', 'ไม่สามารถแก้ไขโพสต์ได้');
    } finally {
      setLoading(false);
    }
  };

  /* ── UI ── */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>แก้ไขโพสต์</Text>
          <Text style={styles.headerSub}>ห้อง {post.id}</Text>
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
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.uploadedImage} />
                <View style={styles.changeImageBadge}>
                  <Ionicons name="camera" size={13} color="#fff" />
                  <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
                </View>
              </>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconCircle}>
                  <Ionicons name="cloud-upload-outline" size={28} color={MainColor} />
                </View>
                <Text style={styles.uploadTitle}>แตะเพื่อเปลี่ยนรูปห้อง</Text>
                <Text style={styles.uploadHint}>หากไม่เลือก รูปเดิมจะยังคงอยู่</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ── ค่าเช่า + รายละเอียด ── */}
        <View style={styles.card}>
          <SectionLabel icon="create-outline" title="ข้อมูลห้องพัก" />

          <FieldLabel text="ค่าเช่า (บาท/เดือน) *" />
          <View style={styles.priceInputWrap}>
            <Text style={styles.pricePrefix}>฿</Text>
            <TextInput
              style={styles.priceInput}
              keyboardType="numeric"
              value={rentPrice}
              onChangeText={setRentPrice}
              placeholder="0"
              placeholderTextColor="#CCC"
            />
            <Text style={styles.priceSuffix}>/เดือน</Text>
          </View>

          <FieldLabel text="รายละเอียดเพิ่มเติม" />
          <TextInput
            style={styles.textArea}
            multiline
            value={detail}
            onChangeText={setDetail}
            placeholder="รายละเอียดห้องพัก..."
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
                  <Ionicons name={icon as any} size={16} color={active ? MainColor : '#BBB'} />
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

        {/* ── ปุ่ม ── */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-outline" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>บันทึกการแก้ไข</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={loading}
            activeOpacity={0.75}
          >
            <Ionicons name="close-outline" size={16} color="#999" />
            <Text style={styles.cancelText}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
  container: { flex: 1, backgroundColor: '#F7F8FA' },

  /* Header */
  header: {
    backgroundColor: MainColor,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 2,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff', letterSpacing: 0.3 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  scrollContent: { paddingTop: 16, paddingBottom: 40 },

  /* Card */
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  /* Section label */
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center', alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },

  fieldLabel: { fontSize: 12, color: '#888', marginBottom: 6, marginTop: 4 },

  /* Upload */
  uploadBox: {
    width: '100%', height: 160, borderRadius: 14,
    backgroundColor: '#F8F8F8',
    borderWidth: 1.5, borderColor: '#E8E8E8', borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center',
  },
  uploadedImage: { width: '100%', height: '100%' },
  changeImageBadge: {
    position: 'absolute', bottom: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  changeImageText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  uploadPlaceholder: { alignItems: 'center', gap: 6 },
  uploadIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  uploadTitle: { fontSize: 13, fontWeight: '600', color: '#555' },
  uploadHint: { fontSize: 11, color: '#BBB' },

  /* Price input */
  priceInputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#EFEFEF',
    borderRadius: 12, backgroundColor: '#FAFAFA',
    paddingHorizontal: 12, marginBottom: 4,
  },
  pricePrefix: { fontSize: 16, color: MainColor, fontWeight: '700', marginRight: 6 },
  priceInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: '#333' },
  priceSuffix: { fontSize: 12, color: '#AAA' },

  /* Textarea */
  textArea: {
    borderWidth: 1.5, borderColor: '#EFEFEF',
    borderRadius: 12, padding: 12,
    fontSize: 14, color: '#333',
    backgroundColor: '#FAFAFA',
    minHeight: 100, marginBottom: 4,
  },

  /* Facilities */
  selectedCount: { fontSize: 12, color: MainColor, marginBottom: 10, fontWeight: '600' },
  facilityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  facilityItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1.5,
    borderColor: '#EBEBEB', backgroundColor: '#FAFAFA',
    position: 'relative',
  },
  facilityActive: { borderColor: MainColor, backgroundColor: '#F0F9F4' },
  facilityText: { fontSize: 12, color: '#888' },
  facilityTextActive: { color: MainColor, fontWeight: '600' },
  facilityCheck: {
    position: 'absolute', top: -5, right: -5,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: MainColor,
    justifyContent: 'center', alignItems: 'center',
  },

  /* Actions */
  actionContainer: { paddingHorizontal: 16, gap: 10 },
  saveBtn: {
    backgroundColor: MainColor,
    borderRadius: 14, paddingVertical: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: MainColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  saveBtnDisabled: { opacity: 0.65 },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 12, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E8E8E8', backgroundColor: '#fff',
  },
  cancelText: { color: '#999', fontSize: 14 },
});