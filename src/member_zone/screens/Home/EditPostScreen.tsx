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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamsList } from './HomeStack';
import { useAuth } from '../../../AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import { MainColor } from '../../../../constant/theme';

type Props = NativeStackScreenProps<HomeStackParamsList, 'editPost'>;

export default function EditPostScreen({ route, navigation }: Props) {
  const { post } = route.params;
  const { token } = useAuth();

  const [rentPrice, setRentPrice] = useState(String(post.rent_price));
  const [detail, setDetail] = useState(post.detail ?? '');
  const [loading, setLoading] = useState(false);

const handleSave = async () => {
  if (!rentPrice || isNaN(Number(rentPrice))) {
    Alert.alert('กรุณากรอกราคาที่ถูกต้อง');
    return;
  }

  try {
    setLoading(true);
    
    const payload = {
      rent_price: Number(rentPrice),
      detail
    };
    
    console.log('📤 Sending payload:', payload);
    console.log('📤 URL:', `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${post.dormId}/posts/${post.id}`);
    
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

    const responseData = await res.json();
    console.log('📥 Response status:', res.status);
    console.log('📥 Response data:', responseData);

    if (!res.ok) {
      console.error('❌ Update failed:', responseData);
      throw new Error('update failed');
    }

    Alert.alert('สำเร็จ', 'แก้ไขโพสต์เรียบร้อย');
    navigation.goBack();
  } catch (error) {
    console.error('❌ Error:', error);
    Alert.alert('ผิดพลาด', 'ไม่สามารถแก้ไขโพสต์ได้');
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>แก้ไขโพสต์</Text>
        <Text style={styles.subtitle}>
          แก้ไขข้อมูลห้องพักของคุณ
        </Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
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
          placeholder="รายละเอียดห้องพัก สิ่งอำนวยความสะดวก ฯลฯ"
        />

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },

  submitBtn: {
    backgroundColor: MainColor,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
