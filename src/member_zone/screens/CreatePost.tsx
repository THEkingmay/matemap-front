import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainColor } from '../../../constant/theme';

export default function CreatePost() {
  const [facilities, setFacilities] = useState<string[]>([]);

  const toggleFacility = (item: string) => {
    setFacilities((prev) =>
      prev.includes(item)
        ? prev.filter((f) => f !== item)
        : [...prev, item]
    );
  };

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
        <Text style={styles.label}>รูปภาพห้องพัก *</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
          <Text style={styles.uploadText}>อัปโหลด</Text>
        </TouchableOpacity>

        {/* Name */}
        <Text style={styles.label}>ชื่อหอพัก *</Text>
        <TextInput style={styles.input} placeholder="เช่น หอพักสบายใจ" />

        {/* Type */}
        <Text style={styles.label}>ประเภทห้อง *</Text>
        <TextInput style={styles.input} placeholder="เลือกประเภทห้อง" />

        {/* Price */}
        <Text style={styles.label}>ค่าเช่า (บาท/เดือน) *</Text>
        <TextInput
          style={styles.input}
          placeholder="เช่น 3000"
          keyboardType="numeric"
        />

        {/* Location */}
        <Text style={styles.label}>สถานที่ตั้ง *</Text>
        <TextInput
          style={styles.input}
          placeholder="เช่น ใกล้มหาวิทยาลัยเกษตรศาสตร์"
        />

        {/* Description */}
        <Text style={styles.label}>รายละเอียดเพิ่มเติม</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="บรรยายลักษณะห้อง สิ่งอำนวยความสะดวก กฎของหอพัก ฯลฯ"
          multiline
        />

        {/* Facilities */}
        <Text style={styles.label}>สิ่งอำนวยความสะดวก</Text>
        <View style={styles.facilityWrap}>
          {FACILITIES.map((item) => {
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

        {/* Contact */}
        <Text style={styles.label}>ชื่อผู้ติดต่อ *</Text>
        <TextInput style={styles.input} placeholder="เช่น คุณสมชาย" />

        <Text style={styles.label}>เบอร์โทรศัพท์ *</Text>
        <TextInput
          style={styles.input}
          placeholder="เช่น 081-234-5678"
          keyboardType="phone-pad"
        />

        {/* Actions */}
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>เผยแพร่โพสต์</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn}>
          <Text style={styles.clearText}>ล้างข้อมูล</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontFamily: 'Kanit_700Bold',
  },

  subtitle: {
    color: '#666',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },

  label: {
    marginTop: 16,
    marginBottom: 6,
    fontFamily: 'Kanit_600SemiBold',
  },

  uploadBox: {
    height: 120,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadText: {
    marginTop: 6,
    color: '#9CA3AF',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  facilityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },

  facilityItem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 8,
  },

  facilityActive: {
    backgroundColor: MainColor,
    borderColor: MainColor,
  },

  facilityText: {
    color: '#000',
    fontSize: 13,
  },

  facilityTextActive: {
    color: '#fff',
  },

  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },

  submitText: {
    color: '#fff',
    fontFamily: 'Kanit_700Bold',
  },

  clearBtn: {
    alignItems: 'center',
    marginTop: 12,
  },

  clearText: {
    color: '#6B7280',
  },
});
