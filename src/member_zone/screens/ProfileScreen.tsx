import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import type { MemberTabsParamsList } from '../MemberMainTabs';
import CustomButton from '../../components/ActionButton';
import { useAuth } from '../../AuthProvider';

/* ===== CONFIG ===== */
const MainColor = '#2E7D32';
const FONT = {
  BOLD: 'System',
};

type Props = BottomTabScreenProps<MemberTabsParamsList, 'profile'>;

type Profile = {
  firstName: string;
  lastName: string;
  role: string;
  businessName: string;
  location: string;
  phone: string;
  email: string;
  lineId: string;
  facebook: string;
  dormImage?: string;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, token, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDormProfile = async () => {
      try {
        if (!token) return;

        const apiUrl = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms?user_id=${user?.id}`;

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('fetch failed');

        const result = await response.json();
        const dorm = result;
        setUserProfile({
          firstName: dorm.owner_name?.split(' ')[0] || '',
          lastName: dorm.owner_name?.split(' ')[1] || '',
          role: 'เจ้าของหอพัก',
          businessName: dorm.name,
          location: `${dorm.sub_district} ${dorm.district} ${dorm.province}`,
          phone: dorm.owner_tel,
          email: dorm.owner_email,
          lineId: dorm.id_line,
          facebook: dorm.social_media_link,
          dormImage: dorm.image_url,
        });
        
      } catch (e) {
        Alert.alert('Error', 'ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchDormProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.center}>
        <Text>ไม่พบข้อมูล</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.heroText}>PROFILE</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          {userProfile.dormImage && (
            <Image
              source={{ uri: userProfile.dormImage }}
              style={styles.image}
            />
          )}
            
          <Text style={styles.title}>
            {userProfile.businessName}
          </Text>

          <Text style={styles.subText}>
            {userProfile.firstName} {userProfile.lastName} · {userProfile.role}
          </Text>
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>ข้อมูลติดต่อ</Text>
          <ContactItem icon="call-outline" value={userProfile.phone} />
          <View style={styles.divider} />
          <ContactItem icon="mail-outline" value={userProfile.email} />
          <View style={styles.divider} />
          <ContactItem icon="location-outline" value={userProfile.location} />
          <View style={styles.divider} />
          <ContactItem icon="at-outline" value={userProfile.lineId} />
          <View style={styles.divider} />
          <ContactItem icon="logo-facebook" value={userProfile.facebook} />
          
          <View style={styles.divider} />
          <View style={{ marginTop: 20 }}>
            <CustomButton
              title="ตั้งค่า"
              theme="warn"
              iconName="settings-outline"
              onPress={() => navigation.navigate('setting')}
            />
            {/* ปุ่มออกจากระบบ */}
          <View style={{ marginTop: 12 }}>
            <CustomButton
              title="ออกจากระบบ"
              theme="danger"
              iconName="log-out-outline"
              onPress={logout}
            />
          </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ===== COMPONENT ===== */

const ContactItem = ({ icon, value }: any) => (
  <View style={styles.contactItem}>
    <Ionicons name={icon} size={18} color={MainColor} />
    <Text style={styles.contactText}>{value || '-'}</Text>
  </View>
);

/* ===== STYLES ===== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  hero: {
  height: 90,
  backgroundColor: '#8C9CCE',
  justifyContent: 'flex-end',
  paddingHorizontal: 20,
  paddingBottom: 12,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
},
divider: {
  height: 1,
  backgroundColor: '#E0E0E0',
  marginVertical: 16,
},

sectionTitle: {
  fontSize: 14,
  color: '#555',
  marginBottom: 8,
  fontFamily: FONT.BOLD,
},
  heroText: { color: '#fff', fontSize: 20, fontFamily: FONT.BOLD },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  image: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    marginBottom: 12,
  },

  title: { fontSize: 20, fontFamily: FONT.BOLD },
  subText: { fontSize: 13, color: '#777', marginBottom: 12 },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: { marginLeft: 8 },
});
