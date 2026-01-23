import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import type { MemberTabsParamsList } from '../MemberMainTabs';
import CustomButton from '../../components/ActionButton';
import { useAuth } from '../../AuthProvider';

type Props = BottomTabScreenProps<MemberTabsParamsList, 'profile'>;

/* ================= MOCK DATA ================= */
const MOCK_PROFILE = {
  firstName: 'สมชาย',
  lastName: 'ใจดี',
  role: 'เจ้าของหอพัก',
  businessName: 'หอพักสบายใจ',
  location: 'ใกล้มหาวิทยาลัยเกษตรศาสตร์',
  phone: '081-234-5678',
  email: 'somchai@example.com',
  lineId: '@somchai',
  facebook: 'facebook.com/somchai',
  // dormImage: 'https://example.com/dorm.jpg'
};

export default function ProfileScreen({ navigation }: Props) {
  const { logout } = useAuth();

  const profile = MOCK_PROFILE;
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>โปรไฟล์ของฉัน</Text>
        <Text style={styles.headerSub}>
          จัดการข้อมูลส่วนตัวและช่องทางการติดต่อ
        </Text>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.role}>{profile.role}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color="#fff" />
            <Text style={styles.editText}>แก้ไขโปรไฟล์</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <ProfileItem
          icon="person-outline"
          label="ชื่อ-นามสกุล"
          value={fullName}
        />

        <ProfileItem
          icon="business-outline"
          label="ชื่อธุรกิจ/หอพัก"
          value={profile.businessName}
        />

        {/* ====== ที่ใส่รูปหอพัก ====== */}
        <View style={styles.dormImageSection}>
          <Text style={styles.dormImageLabel}>รูปหอพัก</Text>

          <View style={styles.dormImagePlaceholder}>
            {/* ถ้ามีรูป ให้ใช้ Image */}
            {/* <Image source={{ uri: profile.dormImage }} style={styles.dormImage} /> */}
            <Ionicons name="image-outline" size={32} color="#999" />
            <Text style={styles.dormImageText}>ยังไม่มีรูปหอพัก</Text>
          </View>
        </View>

        <ProfileItem
          icon="location-outline"
          label="ที่ตั้ง"
          value={profile.location}
        />
        <ProfileItem
          icon="call-outline"
          label="เบอร์โทรศัพท์"
          value={profile.phone}
        />
        <ProfileItem
          icon="mail-outline"
          label="อีเมล"
          value={profile.email}
        />
        <ProfileItem
          icon="chatbubble-outline"
          label="LINE ID"
          value={profile.lineId}
        />
        <ProfileItem
          icon="logo-facebook"
          label="Facebook"
          value={profile.facebook}
        />
      </View>

      {/* Logout */}
      <View style={styles.logoutSection}>
        <CustomButton
          title="ออกจากระบบ"
          theme="danger"
          iconName="log-out-outline"
          onPress={logout}
        />
      </View>
    </ScrollView>
  );
}

/* ---------- reusable item ---------- */
function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.itemRow}>
      <Ionicons name={icon} size={18} color="#666" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Kanit_700Bold',
    color: '#000',
  },
  headerSub: {
    marginTop: 4,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Kanit_600SemiBold',
  },
  role: {
    color: '#666',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  itemLabel: {
    fontSize: 12,
    color: '#888',
  },
  itemValue: {
    fontSize: 14,
    color: '#000',
  },

  /* ===== รูปหอพัก ===== */
  dormImageSection: {
    marginBottom: 16,
    marginLeft: 30,
  },
  dormImageLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  dormImagePlaceholder: {
    height: 120,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dormImageText: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
  },

  logoutSection: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 32,
  },
});
