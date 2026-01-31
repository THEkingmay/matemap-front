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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';

import { HomeStackParamsList } from './HomeStack';
import { useAuth } from '../../../AuthProvider';
import { MainColor } from '../../../../constant/theme';

type Props = NativeStackScreenProps<HomeStackParamsList, 'editPost'>;

const FACILITIES = [
  'Wi-Fi',
  'เครื่องปรับอากาศ',
  'ตู้เย็น',
  'เครื่องทำน้ำอุ่น',
  'ที่จอดรถ',
  'ลิฟต์',
  'ระบบรักษาความปลอดภัย',
  'ซักรีดหยอดเหรียญ',
];

export default function EditPostScreen({ route, navigation }: Props) {
  const { post } = route.params;
  const { token } = useAuth();

  const [rentPrice, setRentPrice] = useState(String(post.rent_price));
  const [detail, setDetail] = useState(post.detail ?? '');
  const [facilities, setFacilities] = useState<string[]>(
    post.facilities ?? []
  );
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE ================= */
  const pickImage = async () => {
     const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    quality: 0.8,
  });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', {
      uri: image,
      name: 'post.jpg',
      type: 'image/jpeg',
    } as any);

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/upload/dorm-posts?dormId=${post.dormId}&postId=${post.id}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (!res.ok) {
      throw new Error('upload image failed');
    }
  };

  /* ================= FACILITY ================= */

  const toggleFacility = (item: string) => {
    setFacilities(prev =>
      prev.includes(item)
        ? prev.filter(f => f !== item)
        : [...prev, item]
    );
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!rentPrice || isNaN(Number(rentPrice))) {
      Alert.alert('กรุณากรอกราคาที่ถูกต้อง');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ update post data
      const payload = {
        rent_price: Number(rentPrice),
        detail,
        facilities,
      };

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${post.dormId}/posts/${post.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error('update failed');

      // 2️⃣ upload image (if selected)
      if (image) {
        await uploadImage();
      }

      Alert.alert('สำเร็จ', 'แก้ไขโพสต์เรียบร้อย');
      navigation.goBack();
    } catch (error) {
      Alert.alert('ผิดพลาด', 'ไม่สามารถแก้ไขโพสต์ได้');
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>แก้ไขโพสต์</Text>
        <Text style={styles.subtitle}>แก้ไขข้อมูลห้องพักของคุณ</Text>
      </View>

      <View style={styles.card}>
        {/* Image */}
        <Text style={styles.label}>รูปห้องพัก</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
          ) : (
            <Text style={{ color: '#6B7280' }}>เลือกรูปใหม่</Text>
          )}
        </TouchableOpacity>

        {/* Price */}
        <Text style={styles.label}>ค่าเช่า (บาท/เดือน) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={rentPrice}
          onChangeText={setRentPrice}
          placeholder="เช่น 4500"
        />

        {/* Detail */}
        <Text style={styles.label}>รายละเอียดเพิ่มเติม</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={detail}
          onChangeText={setDetail}
          placeholder="รายละเอียดห้องพัก"
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
                style={[
                  styles.facilityItem,
                  active && styles.facilityActive,
                ]}
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

        {/* Actions */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>บันทึกการแก้ไข</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelText}>ยกเลิก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  textArea: { height: 120, textAlignVertical: 'top' },

  imagePicker: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },

  facilityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  facilityItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
    marginBottom: 8,
  },
  facilityActive: {
    backgroundColor: MainColor,
    borderColor: MainColor,
  },
  facilityText: { fontSize: 13, color: '#374151' },
  facilityTextActive: { color: '#fff', fontWeight: '500' },

  submitBtn: {
    backgroundColor: MainColor,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  cancelBtn: { paddingVertical: 12, alignItems: 'center' },
  cancelText: { color: '#6B7280', fontSize: 14 },
});
