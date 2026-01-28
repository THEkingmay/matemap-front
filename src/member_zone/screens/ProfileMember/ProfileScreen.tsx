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
  dormNumber : string;
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
          dormNumber : dorm.dorm_number,
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
            dorm_number : formProfile?.dormNumber,
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

          <Text style={styles.title}>{profile.businessName}</Text>
          <Text style={styles.subText}>
            {profile.ownerName} · {profile.role}
          </Text>

          {/* ADDRESS */}
          <Section title="ที่อยู่หอพัก" icon="location-outline">
             <InfoInput label="บ้านเลขที่ / ซอย / ถนน"
                value={formProfile.dormNumber}
                isEditing={isEditing}
                onChange={(t: string) => updateField('dormNumber', t)}/>
            <TwoColumn>
              <InfoInput label="ตำบล" value={formProfile.subDistrict} isEditing={isEditing}
                onChange={(t:string) => updateField('subDistrict', t)} />
              <InfoInput label="อำเภอ" value={formProfile.district} isEditing={isEditing}
                onChange={(t:string) => updateField('district', t)} />
            </TwoColumn>

            <TwoColumn>
              <InfoInput label="จังหวัด" value={formProfile.province} isEditing={isEditing}
                onChange={(t:string) => updateField('province', t)} />
              <InfoInput label="รหัสไปรษณีย์" value={formProfile.postalCode} isEditing={isEditing}
                onChange={(t:string) => updateField('postalCode', t)} />
            </TwoColumn>
          </Section>

          {/* CONTACT */}
          <Section title="ช่องทางการติดต่อ" icon="call-outline">
            <InfoInput label="เบอร์โทรศัพท์" value={formProfile.phone}
              isEditing={isEditing} onChange={(t:string) => updateField('phone', t)} />
            <InfoInput label="อีเมล" value={formProfile.email} isEditing={false} />
            <InfoInput label="Line ID" value={formProfile.lineId}
              isEditing={isEditing} onChange={(t:string) => updateField('lineId', t)} />
              <InfoInput label="Social Media (Facebook / IG / Website)"
              value={formProfile.socialMediaLink}
              isEditing={isEditing}onChange={(t:string) => updateField('socialMediaLink', t)}/>
          </Section>

          {/* DETAIL */}
          <Section title="รายละเอียดของหอพัก" icon="information-circle-outline">
            <TextInput
              style={styles.textArea}
              multiline
              editable={isEditing}
              value={formProfile.detail}
              onChangeText={(t) => updateField('detail', t)}
            />
          </Section>

          {/* ACTION */}
          <View style={{ marginTop: 20 }}>
            {isEditing ? (
              <>
                <CustomButton title="บันทึก" iconName="checkmark-outline" onPress={handleSave} theme="danger" />
                <View style={{ height: 10 }} />
                <CustomButton title="ยกเลิก" iconName="close-outline" theme="danger"
                  onPress={() => { setFormProfile(profile); setIsEditing(false); }} />
              </>
            ) : (
              <>
                <CustomButton title="แก้ไขโปรไฟล์" iconName="create-outline" theme="danger"
                  onPress={() => setIsEditing(true)} />
                <View style={{ height: 12 }} />
                <CustomButton title="ออกจากระบบ" iconName="log-out-outline" onPress={logout} theme="danger"/>
              </>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

/* ===== UI HELPERS ===== */
const Section = ({ title, icon, children }: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color="#3F51B5" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

const TwoColumn = ({ children }: any) => (
  <View style={styles.twoColumn}>{children}</View>
);

const InfoInput = ({ label, value, isEditing, onChange }: any) => (
  <View style={styles.inputBox}>
    <Text style={styles.inputLabel}>{label}</Text>

    <View style={styles.inputContainer}>
      {isEditing ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder="-"
        />
      ) : (
        <Text style={styles.inputText}>
          {value || '-'}
        </Text>
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

  section: {
    marginTop: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: 'bold',
  },

  twoColumn: {
    flexDirection: 'row',
    gap: 10,
  },

  inputBox: {
    flex: 1,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 10,
  },
  inputValue: {
    fontSize: 14,
    paddingVertical: 10,
    color: '#333',
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
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
  inputContainer: {
  borderWidth: 1,
  borderColor: '#DDD',
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 10,
  backgroundColor: '#FFF',
},

inputText: {
  fontSize: 14,
  color: '#333',
},

});
