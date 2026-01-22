import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import type { MemberTabsParamsList } from '../MemberMainTabs';
import { MainColor } from '../../../constant/theme';

type Props = BottomTabScreenProps<MemberTabsParamsList, 'home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>โพสต์ของฉัน</Text>
        <Text style={styles.subTitle}>จัดการโพสต์ห้องว่างทั้งหมดของคุณ</Text>

        <Text style={styles.totalPost}>ทั้งหมด 3 โพสต์</Text>
      </View>

      {/* Post Card */}
      <PostCard />
      <PostCard />
      <PostCard />
    </ScrollView>
  );
}

/* ---------- Post Card ---------- */
function PostCard() {
  return (
    <View style={styles.card}>
      {/* Image Placeholder */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>3 รูป</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.postTitle}>หอพักสบายใจ</Text>

        <InfoRow icon="location-outline" text="ใกล้มหาวิทยาลัยเกษตรศาสตร์" />
        <InfoRow icon="cash-outline" text="ห้องเดี่ยว • 3,500 บาท/เดือน" />
        <InfoRow icon="person-outline" text="คุณสมชาย" />
        <InfoRow icon="call-outline" text="081-234-5678" />

        {/* Tags */}
        <View style={styles.tags}>
          <Tag text="Wi-Fi" />
          <Tag text="เครื่องปรับอากาศ" />
          <Tag text="เครื่องทำน้ำอุ่น" />
          <Tag text="ที่จอดรถ" />
          <Tag text="+1 อื่นๆ" />
        </View>

        <Text style={styles.desc}>
          ห้องสะอาด กว้างขวาง เครื่องปรับอากาศ เครื่องทำน้ำอุ่น Wi-Fi ความเร็วสูง
          พร้อมอยู่ทันที ใกล้ร้านสะดวกซื้อ ร้านอาหาร และโรงพยาบาล
        </Text>

        <Text style={styles.date}>อัปเดตล่าสุด 15 มกราคม 2569</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={18} color="#2563EB" />
            <Text style={styles.editText}>แก้ไข</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
            <Text style={styles.deleteText}>ลบ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ---------- Reusable ---------- */
function InfoRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#6B7280" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */
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
  subTitle: {
    color: '#6B7280',
    marginTop: 4,
  },
  totalPost: {
    marginTop: 8,
    fontSize: 13,
    color: MainColor,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: '#E5E7EB',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  imageText: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontFamily: 'Kanit_600SemiBold',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    marginLeft: 6,
    color: '#374151',
    fontSize: 13,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#2563EB',
  },
  desc: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  date: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  editBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
  },
  editText: {
    marginLeft: 6,
    color: '#2563EB',
    fontFamily: 'Kanit_500Medium',
  },
  deleteBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  deleteText: {
    marginLeft: 6,
    color: '#DC2626',
    fontFamily: 'Kanit_500Medium',
  },
});
