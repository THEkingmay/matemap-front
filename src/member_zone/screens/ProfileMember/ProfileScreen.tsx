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
  RefreshControl,
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
  dormNumber: string;
  businessName: string;
  ownerName: string;
  role: string;
  subDistrict: string;
  district: string;
  province: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  lineId: string;
  socialMediaLink: string;
  detail: string;
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
  const [refreshing, setRefreshing] = useState(false);

  /* ===== FETCH PROFILE ===== */
  useEffect(() => {
    const fetchDormProfile = async () => {
      try {
        if (!token || !user) return;

        const mailRes = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/${user.id}/get-mail`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const mailData = await mailRes.json();

        const dormRes = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms?user_id=${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!dormRes.ok) throw new Error();

        const dorm = await dormRes.json();
        const mapped: Profile = {
          dormId: dorm.id,
          dormNumber: dorm.dorm_number,
          businessName: dorm.name,
          ownerName: dorm.owner_name,
          role: 'เจ้าของหอพัก',
          subDistrict: dorm.sub_district,
          district: dorm.district,
          city: dorm.city,
          province: dorm.province,
          postalCode: dorm.postal_code,
          phone: dorm.owner_tel,
          email: mailData.email,
          lineId: dorm.id_line,
          socialMediaLink: dorm.social_media_link,
          detail: dorm.detail || '',
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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (!token || !user) return;

      const mailRes = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/${user.id}/get-mail`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const mailData = await mailRes.json();

      const dormRes = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms?user_id=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!dormRes.ok) throw new Error();

      const dorm = await dormRes.json();
      const mapped: Profile = {
        dormId: dorm.id,
        dormNumber: dorm.dorm_number,
        businessName: dorm.name,
        ownerName: dorm.owner_name,
        role: 'เจ้าของหอพัก',
        subDistrict: dorm.sub_district,
        district: dorm.district,
        city: dorm.city,
        province: dorm.province,
        postalCode: dorm.postal_code,
        phone: dorm.owner_tel,
        email: mailData.email,
        lineId: dorm.id_line,
        socialMediaLink: dorm.social_media_link,
        detail: dorm.detail || '',
        dormImage: dorm.image_url ?? null,
      };
      setProfile(mapped);
      setFormProfile(mapped);
      setIsEditing(false);
    } catch {
      Alert.alert('Error', 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setRefreshing(false);
    }
  };

  const updateField = (field: keyof Profile, value: string) => {
    if (!formProfile) return;
    setFormProfile({ ...formProfile, [field]: value });
  };

  /* ===== SAVE ===== */
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
            owner_tel: formProfile?.phone,
            dorm_number: formProfile?.dormNumber,
            sub_district: formProfile?.subDistrict,
            district: formProfile?.district,
            city: formProfile?.city,
            province: formProfile?.province,
            postal_code: formProfile?.postalCode,
            id_line: formProfile?.lineId,
            social_media_link: formProfile?.socialMediaLink,
            detail: formProfile?.detail,
          }),
        }
      );

      if (!res.ok) throw new Error();

      setProfile(formProfile);
      setIsEditing(false);
      Alert.alert('สำเร็จ', 'บันทึกข้อมูลเรียบร้อย');
    } catch {
      Alert.alert('Error', 'บันทึกไม่สำเร็จ');
    }
  };

  /* ===== IMAGE ===== */
  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) return;

    try {
      setUploading(true);
      const uri = result.assets[0].uri;
      const name = uri.split('/').pop()!;
      const type = 'image/jpeg';

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

      setProfile(p => p && { ...p, dormImage: data.image_url });
      setFormProfile(p => p && { ...p, dormImage: data.image_url });
    } catch {
      Alert.alert('Error', 'อัปโหลดรูปไม่สำเร็จ');
    } finally {
      setUploading(false);
    }
  };

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

      {/* ===== Fixed PROFILE header ===== */}
      <View style={styles.profileHeader}>
        <Text style={styles.profileHeaderText}>PROFILE</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[MainColor]}
            tintColor={MainColor}
          />
        }
      >
        {/* ===== HERO SECTION ===== */}
        <View style={[styles.heroSection, styles.card]}>

          {/* Dorm Image */}
          <TouchableOpacity onPress={pickAndUploadImage} activeOpacity={0.85}>
            <View style={styles.imageWrapper}>
              {uploading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : formProfile.dormImage ? (
                <Image source={{ uri: formProfile.dormImage }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="business-outline" size={44} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.placeholderText}>แตะเพื่อเพิ่มรูปหอพัก</Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={13} color="#fff" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Name Row + Edit/Cancel button */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dormName}>{profile.businessName}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{profile.ownerName} · {profile.role}</Text>
              </View>
            </View>

            {isEditing ? (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setFormProfile(profile); setIsEditing(false); }}
              >
                <Text style={styles.cancelBtnText}>ยกเลิก</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                <Ionicons name="create-outline" size={14} color="#fff" />
                <Text style={styles.editBtnText}>แก้ไขโปรไฟล์</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ===== ADDRESS CARD ===== */}
        <View style={styles.card}>
          <CardHeader icon="location-outline" title="ที่อยู่หอพัก" />

          <InfoRow
            label="บ้านเลขที่ / ซอย / ถนน"
            value={formProfile.dormNumber}
            isEditing={isEditing}
            onChange={(t: string) => updateField('dormNumber', t)}
          />
          <Divider />
          <View style={styles.twoColumn}>
            <View style={{ flex: 1 }}>
              <InfoRow label="ตำบล" value={formProfile.subDistrict} isEditing={isEditing}
                onChange={(t: string) => updateField('subDistrict', t)} />
            </View>
            <View style={styles.colDivider} />
            <View style={{ flex: 1 }}>
              <InfoRow label="อำเภอ" value={formProfile.district} isEditing={isEditing}
                onChange={(t: string) => updateField('district', t)} />
            </View>
          </View>
          <Divider />
          <View style={styles.twoColumn}>
            <View style={{ flex: 1 }}>
              <InfoRow label="จังหวัด" value={formProfile.province} isEditing={isEditing}
                onChange={(t: string) => updateField('province', t)} />
            </View>
            <View style={styles.colDivider} />
            <View style={{ flex: 1 }}>
              <InfoRow label="รหัสไปรษณีย์" value={formProfile.postalCode} isEditing={isEditing}
                onChange={(t: string) => updateField('postalCode', t)} />
            </View>
          </View>
        </View>

        {/* ===== CONTACT CARD ===== */}
        <View style={styles.card}>
          <CardHeader icon="call-outline" title="ช่องทางการติดต่อ" />

          <InfoRow label="เบอร์โทรศัพท์" value={formProfile.phone}
            isEditing={isEditing} onChange={(t: string) => updateField('phone', t)} />
          <Divider />
          <InfoRow label="อีเมล" value={formProfile.email} isEditing={false} />
          <Divider />
          <InfoRow label="Line ID" value={formProfile.lineId}
            isEditing={isEditing} onChange={(t: string) => updateField('lineId', t)} />
          <Divider />
          <InfoRow label="Social Media (Facebook / IG / Website)"
            value={formProfile.socialMediaLink}
            isEditing={isEditing} onChange={(t: string) => updateField('socialMediaLink', t)} />
        </View>

        {/* ===== DETAIL CARD ===== */}
        <View style={styles.card}>
          <CardHeader icon="information-circle-outline" title="รายละเอียดของหอพัก" />
          <TextInput
            style={[styles.textArea, !isEditing && styles.textAreaReadOnly]}
            multiline
            editable={isEditing}
            value={formProfile.detail}
            onChangeText={(t) => updateField('detail', t)}
            placeholder="เพิ่มรายละเอียดหอพัก..."
            placeholderTextColor="#CCC"
          />
        </View>

        {/* ===== ACTION BUTTONS ===== */}
        <View style={styles.actionContainer}>
          {isEditing && (
            <>
              <CustomButton title="บันทึก" iconName="checkmark-outline" onPress={handleSave} theme="danger" />
              <View style={{ height: 12 }} />
            </>
          )}
          <CustomButton title="ออกจากระบบ" iconName="log-out-outline" onPress={logout} theme="danger" />
        </View>

      </ScrollView>
    </View>
  );
}

/* ===== UI HELPERS ===== */
const Divider = () => <View style={styles.divider} />;

const CardHeader = ({ icon, title }: { icon: any; title: string }) => (
  <View style={styles.cardHeader}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={18} color={MainColor} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

const InfoRow = ({ label, value, isEditing, onChange }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    {isEditing ? (
      <TextInput
        style={styles.inlineInput}
        value={value}
        onChangeText={onChange}
        placeholder="-"
        placeholderTextColor="#CCC"
      />
    ) : (
      <Text style={styles.infoValue}>{value || '-'}</Text>
    )}
  </View>
);

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* ── Fixed PROFILE header ── */
  profileHeader: {
    backgroundColor: '#8C9CCE',
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileHeaderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  scrollContent: {
    paddingTop: 16,
    paddingBottom: 48,
  },

  heroSection: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center', gap: 8 },
  placeholderText: { color: '#AAAAAA', fontSize: 13 },
  cameraBadge: {
    position: 'absolute',
    bottom: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dormName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleText: { color: '#555', fontSize: 12 },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: MainColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 13,
    flexShrink: 0,
    marginTop: 2,
  },
  editBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  cancelBtn: {
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 13,
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  cancelBtnText: { color: '#666', fontSize: 12, fontWeight: '600' },

  /* ── Cards ── */
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  iconCircle: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  twoColumn: {
    flexDirection: 'row',
  },
  colDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F3F3',
    marginVertical: 2,
  },

  infoRow: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  inlineInput: {
    fontSize: 14,
    color: '#333',
    borderBottomWidth: 1.5,
    borderBottomColor: MainColor,
    paddingVertical: 3,
    paddingHorizontal: 0,
  },

  textArea: {
    borderWidth: 1.5,
    borderColor: MainColor,
    borderRadius: 12,
    padding: 12,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  textAreaReadOnly: {
    borderColor: '#EFEFEF',
    backgroundColor: '#FAFAFA',
  },

  /* ── Actions ── */
  actionContainer: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
});