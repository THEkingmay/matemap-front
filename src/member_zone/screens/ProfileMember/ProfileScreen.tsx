import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import type { MemberTabsParamsList } from '../../MemberMainTabs';
import CustomButton from '../../../components/ActionButton';
import { useAuth } from '../../../AuthProvider';

/* ===== CONFIG ===== */
const MainColor = '#2E7D32';

type Props = BottomTabScreenProps<MemberTabsParamsList, 'profile'>;

type Profile = {
  dormId: string;
  businessName: string;
  ownerName: string;
  role: string;
  subDistrict: string;
  district: string;
  //location: string;
  province: string;
  phone: string;
  city: string;
  postalCode: string;
  email: string;
  lineId: string;
  facebook: string;
  dormImage?: string | null;
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, token, logout } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [formProfile, setFormProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* ===== FETCH PROFILE ===== */
  useEffect(() => {
    const fetchDormProfile = async () => {
      try {
        if (!token || !user) return;
        
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms?user_id=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error();
        const dorm = await res.json();

        const mapped: Profile = {
          dormId: dorm.id,
          businessName: dorm.name,
          ownerName: dorm.owner_name,
          role: 'เจ้าของหอพัก',
          subDistrict: dorm.sub_district,
          district: dorm.district,
          province: dorm.province,
          phone: dorm.owner_tel,
          city: dorm.city,
          postalCode: dorm.postal_code,
          email: dorm.owner_email,
          lineId: dorm.id_line,
          facebook: dorm.social_media_link,
          dormImage: dorm.image_url ?? null,
        };

        setProfile(mapped);
        setFormProfile(mapped);
      } catch {
        Alert.alert('Error', 'ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchDormProfile();
  }, []);

  /* ===== UPDATE FIELD ===== */
  const updateField = (field: keyof Profile, value: string) => {
    if (!formProfile) return;
    setFormProfile({ ...formProfile, [field]: value });
  };

 /* ===== SAVE PROFILE ===== */
const handleSave = async () => {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${profile?.dormId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formProfile?.businessName || null,
          owner_name: formProfile?.ownerName || null,
          owner_tel: formProfile?.phone || null,
          sub_district: formProfile?.subDistrict || null,
          district: formProfile?.district || null,
          city: formProfile?.city || null,              // ← เพิ่ม
          province: formProfile?.province || null,
          postal_code: formProfile?.postalCode || null,  // ← เพิ่ม
          id_line: formProfile?.lineId || null,
          social_media_link: formProfile?.facebook || null,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error('Update failed');
    }

    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await res.json();
    }

    setProfile(formProfile);
    setIsEditing(false);
    Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
  } catch (error) {
    console.error('Save error:', error);
    Alert.alert('Error', 'บันทึกไม่สำเร็จ');
  }
};
  /* ===== IMAGE UPLOAD ===== */
  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission denied');

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      setUploading(true);

      const uri = result.assets[0].uri;
      const name = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(name);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      const formData = new FormData();
      formData.append('file', { uri, name, type } as any);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/upload/dorm-profile?dormId=${profile?.dormId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error();

      setProfile((prev) =>
        prev ? { ...prev, dormImage: `${data.image_url}?t=${Date.now()}` } : prev
      );
      setFormProfile((prev) =>
        prev ? { ...prev, dormImage: `${data.image_url}?t=${Date.now()}` } : prev
      );
    } catch {
      Alert.alert('Error', 'อัปโหลดรูปไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

  /* ===== DELETE IMAGE ===== */
  const deleteImage = async () => {
    Alert.alert('ยืนยัน', 'ลบรูปหอพัก?', [
      { text: 'ยกเลิก', style: 'cancel' },
      {
        text: 'ลบ',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await fetch(
              `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/delete/dorm-profile?dormId=${profile?.dormId}`,
              {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setProfile((p) => (p ? { ...p, dormImage: null } : p));
            setFormProfile((p) => (p ? { ...p, dormImage: null } : p));
          } catch {
            Alert.alert('Error', 'ลบรูปไม่สำเร็จ');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  /* ===== RENDER ===== */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  if (!profile || !formProfile) {
    return (
      <View style={styles.center}>
        <Text>ไม่พบข้อมูล</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.hero}>
        <Text style={styles.heroText}>PROFILE</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.card}>
          {/* IMAGE */}
          <TouchableOpacity onPress={pickAndUploadImage}>
            <View style={styles.imageWrapper}>
              {formProfile.dormImage ? (
                <Image source={{ uri: formProfile.dormImage }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={40} color="#999" />
                  <Text style={styles.placeholderText}>เพิ่มรูปหอพัก</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {formProfile.dormImage && (
            <CustomButton
              title="ลบรูป"
              theme="danger"
              iconName="trash-outline"
              onPress={deleteImage}
            />
          )}

          <Text style={styles.title}>{profile.businessName}</Text>
          <Text style={styles.subText}>
            {profile.ownerName} · {profile.role}
          </Text>
          <View style={styles.divider} />

          <InfoRow icon="call-outline" label="เบอร์โทร" value={formProfile.phone} isEditing={isEditing}
            onChangeText={(t) => updateField('phone', t)} />

          <InfoRow icon="mail-outline" label="อีเมล" value={formProfile.email} isEditing={isEditing}
            onChangeText={(t) => updateField('email', t)} />

          <InfoRow 
           icon="location-outline" 
           label="ตำบล" 
           value={formProfile.subDistrict} 
           isEditing={isEditing}
           onChangeText={(t) => updateField('subDistrict', t)} />

          <InfoRow 
          icon="location-outline" 
          label="อำเภอ" 
          value={formProfile.district} 
          isEditing={isEditing}
          onChangeText={(t) => updateField('district', t)} />

          <InfoRow 
          icon="location-outline" 
          label="เมือง" 
          value={formProfile.city}       // ← เพิ่ม
          isEditing={isEditing}
          onChangeText={(t) => updateField('city', t)} />

          <InfoRow 
          icon="location-outline" 
          label="จังหวัด" 
          value={formProfile.province} 
          isEditing={isEditing}
          onChangeText={(t) => updateField('province', t)} />

          <InfoRow 
          icon="mail-outline" 
          label="รหัสไปรษณีย์" 
          value={formProfile.postalCode}  // ← เพิ่ม
          isEditing={isEditing}
          onChangeText={(t) => updateField('postalCode', t)} 
          // keyboardType="number-pad"       // ← ให้พิมพ์ได้แค่ตัวเลข
          />
          <InfoRow icon="chatbubble-ellipses-outline" label="LINE" value={formProfile.lineId} isEditing={isEditing}
            onChangeText={(t) => updateField('lineId', t)} />

          <InfoRow icon="logo-facebook" label="Facebook" value={formProfile.facebook} isEditing={isEditing}
            onChangeText={(t) => updateField('facebook', t)} />

          <View style={{ marginTop: 20 }}>
            {isEditing ? (
              <>
                <CustomButton 
                title="บันทึก" 
                theme="danger"
                iconName="checkmark-outline" 
                onPress={handleSave} />
                <View style={{ height: 10 }} />
                <CustomButton
                  title="ยกเลิก"
                  theme="danger"
                  iconName="close-outline"
                  onPress={() => {
                    setFormProfile(profile);
                    setIsEditing(false);
                  }}
                />
              </>
            ) : (
              <>
                <CustomButton
                  title="แก้ไขโปรไฟล์"
                  theme="danger"
                  iconName="create-outline"
                  onPress={() => setIsEditing(true)}
                />
                <View style={{ height: 12 }} />
                <CustomButton
                  title="ออกจากระบบ"
                  theme="danger"
                  iconName="log-out-outline"
                  onPress={logout}
                />
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ===== INFO ROW ===== */
const InfoRow = ({
  icon,
  label,
  value,
  isEditing,
  onChangeText,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  isEditing?: boolean;
  onChangeText?: (text: string) => void;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={18} color="#5C6BC0" />
    </View>

    <View style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.editInput}
          value={value}
          onChangeText={onChangeText}
        />
      ) : (
        <Text style={styles.infoValue}>{value || '-'}</Text>
      )}
    </View>
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
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },

  imageWrapper: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { marginTop: 6, fontSize: 12, color: '#999' },

  title: { fontSize: 20, fontWeight: 'bold' },
  subText: { fontSize: 13, color: '#777', marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 16 },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 6,
  },
  infoLabel: { fontSize: 12, color: '#9E9E9E' },
  infoValue: { fontSize: 14, color: '#333', fontWeight: '600' },
  editInput: {
    fontSize: 14,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingVertical: 4,
  },
});