import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Pressable
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { UserTabsParamsList } from '../UserMainTabs';
import { MainColor } from '../../../constant/theme'; 
import { useAuth } from '../../AuthProvider';
import CustomButton from '../../components/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import styles from '../styles/profile_screen_style'

import * as ImagePicker from 'expo-image-picker'; 


type props = BottomTabScreenProps<UserTabsParamsList, 'profile'>

interface RNFile {
  uri: string;
  name: string;
  type: string;
}
interface UserProfileType { 
  id: string;
  name: string; 
  bio: string;
  tag: string[]; 
  image_url: string | null; 
  faculty: string;
  major: string; 
  birth_year: number;
  tel: string;
}

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: props) {
  const { user, token, logout } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserProfileType | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [deletingImage, setDeletingImage] = useState<boolean>(false);  
const confirmDeleteProfile = () => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ว่าต้องการลบรูปโปรไฟล์นี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
      [
        {
          text: "ยกเลิก",
          style: "cancel"
        },
        {
          text: "ลบรูปภาพ",
          style: "destructive", 
          onPress: deleteProfile
        }
      ]
    );
  };

  const [newTagInput, setNewTagInput] = useState('');
  // คำนวณอายุ
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchUserData();
  }, [token]);

  const fetchUserData = async () => {
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/${user?.id}`; 
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      setUserProfile(data);
      setFormData(data); 

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (field: keyof UserProfileType, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return; // ถ้าว่างเปล่าไม่ต้องทำอะไร

    // ตรวจสอบว่ามี Tag นี้อยู่แล้วหรือยัง (ป้องกันซ้ำ)
    if (formData?.tag?.includes(newTagInput.trim())) {
       Alert.alert('ข้อมูลซ้ำ', 'คุณมี Tag นี้อยู่แล้วค่ะ');
       return;
    }

    if (formData && formData.tag) {
        if (formData.tag.length >= 5) {
            Alert.alert('จำกัดจำนวน', 'เพิ่มได้สูงสุด 5 แท็กเท่านั้นค่ะ');
            return;
        }

        // อัปเดต State โดยเพิ่ม Tag ใหม่เข้าไป
        setFormData({
            ...formData,
            tag: [...formData.tag, newTagInput.trim()]
        });
        setNewTagInput(''); // เคลียร์ช่องพิมพ์
    } else if (formData) {
        // กรณีเริ่มต้นยังไม่มี array tag เลย
        setFormData({
            ...formData,
            tag: [newTagInput.trim()]
        });
        setNewTagInput('');
    }
  };

  // 2. ฟังก์ชันลบ Tag
  const handleRemoveTag = (tagToRemove: string) => {
    if (formData) {
        setFormData({
            ...formData,
            tag: formData.tag.filter(t => t !== tagToRemove)
        });
    }
  };
  const handleYearUpdate = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    handleUpdate('birth_year', numericValue ? parseInt(numericValue) : 0);
  };

  const updateProfile = async () => {
    // 1. Request Permission & Pick Image
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'ขออภัย เราต้องการสิทธิ์เข้าถึงรูปภาพเพื่อเปลี่ยนโปรไฟล์');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Allow cropping
      aspect: [1, 1],      // Square aspect ratio is best for avatars
      quality: 0.8,        // Compress slightly to save bandwidth
    });

    if (result.canceled) return;

    // 2. Prepare Data for Upload
    const localUri = result.assets[0].uri;
    const filename = localUri.split('/').pop();
    
    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const fileToUpload: RNFile = {
        uri: localUri,
        name: filename || '',
        type: type,
      };
    const formDataUpload = new FormData();
    
    // React Native expects this specific object structure for files
    formDataUpload.append('file', fileToUpload as unknown as Blob );

    // 3. Upload to Backend
    try {
      setUploadingImage(true);
      
      const apiUrl = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/upload/user-profile?userId=${user?.id}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Upload failed');

      // 4. Update State on Success
      // Assuming your API returns { url: "..." } or similar
      const newImageUrl = data.url || data.image_url; 
      
      if (newImageUrl) {
        setIsEditing(false)
        setUserProfile((prev) => prev ? { ...prev, image_url: newImageUrl } : null);
        setFormData((prev) => prev ? { ...prev, image_url: newImageUrl } : null);
        Toast.success("อัปเดตรูปโปรไฟล์สำเร็จ");
      }

    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert('Upload Failed', 'ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่');
    } finally {
      setUploadingImage(false);
    }
  };
  const deleteProfile = async () => {
    if (deletingImage) return; // ป้องกันการกดซ้ำ

    try {
      setDeletingImage(true); // เริ่ม Loading

      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/delete?userId=${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "ลบรูปไม่สำเร็จ");
      }

      // อัปเดต State หน้าจอให้รูปหายไปทันที
      setUserProfile((prev) => prev ? { ...prev, image_url: null } : null);
      setFormData((prev) => prev ? { ...prev, image_url: null } : null);
      setIsEditing(false)
      Toast.success("ลบรูปโปรไฟล์เรียบร้อยแล้ว");

    } catch (err) {
      console.error(err);
      Toast.error((err as Error).message || "เกิดข้อผิดพลาดในการลบรูป");
    } finally {
      setDeletingImage(false); 
    }
  }


  const onSave = async () => {
    if(!formData?.name){
        return Toast.warn('ชื่อห้ามเป็นช่องว่าง')
    }
    if(formData?.birth_year < 1950){
        return Toast.warn('นิสิตจริงหรือปล่าว?')
    }
    try {
      setLoading(true);
      
      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/${user?.id}` ,{
        method : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } , 
        body : JSON.stringify(formData)
      })

      const data = await res.json()
    
      if(!res.ok) throw new Error(data.message)
        

      setUserProfile(formData); 
      setIsEditing(false); 
      Toast.success("บันทึกสำเร็จ");
    } catch (error) {
        Toast.error("บันทึกไม่สำเร็จ");
    } finally {
        setLoading(false);
    }
  };

  const onCancel = () => {
    setFormData(userProfile); 
    setIsEditing(false);
  };

  if (loading && !userProfile) { 
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  return (
    
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#F5F7FA' }} 
     // 1. ปรับ behavior สำหรับ Android ให้ลองใช้ 'height' ดูค่ะ ถ้ายังเด้งแปลกๆ ให้เปลี่ยนเป็น undefined
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // 2. เติม keyboardVerticalOffset (สำคัญมาก)
      // ลองใส่สัก 100 (หรือประมาณความสูง Header + Status Bar ของเครื่อง)
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        style={styles.scrollContainer} 
        // Rose: เพิ่ม paddingBottom เยอะๆ ตรงนี้เพื่อให้พ้น Tab Bar ค่ะ
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* --- Header Section (Profile Image & Bio) --- */}
        <View style={styles.headerBackground}>
            <View style={styles.headerContent}>
                <TouchableOpacity 
                    onPress={isEditing ? updateProfile : undefined} 
                    activeOpacity={0.8}
                    style={styles.imageWrapper}
                    disabled={uploadingImage} // Prevent double clicking
                >
                    {uploadingImage ? (
                        <View style={[styles.profileImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd' }]}>
                            <ActivityIndicator color={MainColor} />
                        </View>
                    ) : formData?.image_url ? (
                        <Image source={{ uri: formData.image_url }} style={styles.profileImage} />
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Ionicons name="person" size={50} color="#FFF" />
                        </View>
                    )}
                    
                    {isEditing && !uploadingImage && (
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={16} color="#FFF" />
                        </View>
                    )}
                   {isEditing && formData?.image_url && !uploadingImage && (
                    <TouchableOpacity 
                        onPress={confirmDeleteProfile} 
                        disabled={deletingImage}   
                        style={styles.deleteBadge}
                        activeOpacity={0.7}
                    >
                        {deletingImage ? (
                            // แสดง Loading ตัวเล็กๆ
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            // แสดงไอคอนถังขยะปกติ
                            <Ionicons name="trash" size={16} color="#FFF" />
                        )}
                    </TouchableOpacity>
                )}
                </TouchableOpacity>

                <View style={{ alignItems: 'center', marginTop: 10, width: '100%' }}>
                    {isEditing ? (
                        <TextInput 
                            style={styles.nameInput} 
                            value={formData?.name}
                            onChangeText={(text) => handleUpdate('name', text)}
                            placeholder="ชื่อ-นามสกุล"
                            textAlign="center"
                        />
                    ) : (
                        <Text style={styles.nameText}>ชื่อ {userProfile?.name || 'Unknown User'}</Text>
                    )}

                    {isEditing ? (
                        <TextInput 
                            style={styles.bioInput} 
                            value={formData?.bio}
                            onChangeText={(text) => handleUpdate('bio', text)}
                            placeholder="เพิ่มคำอธิบายตัวตน..."
                            multiline
                            textAlign="center"
                        />
                    ) : (
                        <Text style={styles.bioText}>{userProfile?.bio || '-'}</Text>
                    )}
                </View>
            </View>
        </View>

        {/* --- Info Card Section --- */}
        <View style={styles.cardContainer}>
            <Text style={styles.sectionHeader}>ข้อมูลส่วนตัว</Text>
            
            <View style={styles.infoCard}>
                <InfoRow 
                    icon="school-outline" 
                    label="คณะ" 
                    value={isEditing ? formData?.faculty : userProfile?.faculty} 
                    isEditing={isEditing}
                    onChangeText={(text) => handleUpdate('faculty', text)}
                />
                <View style={styles.divider} />
                <InfoRow 
                    icon="book-outline" 
                    label="สาขา" 
                    value={isEditing ? formData?.major : userProfile?.major} 
                    isEditing={isEditing}
                    onChangeText={(text) => handleUpdate('major', text)}
                />
                <View style={styles.divider} />
                <InfoRow 
                    icon="calendar-outline" 
                    label={isEditing ? "ปีเกิด (ค.ศ.)" : "อายุ"} 
                    value={
                        isEditing 
                        ? formData?.birth_year?.toString() 
                        : `${userProfile ? (currentYear - userProfile.birth_year) : 0} ปี`
                    } 
                    isEditing={isEditing}
                    onChangeText={handleYearUpdate} 
                    keyboardType="phone-pad"
                />
                <View style={styles.divider} />
                <InfoRow 
                    icon="call-outline" 
                    label="เบอร์โทร" 
                    value={isEditing ? formData?.tel : userProfile?.tel} 
                    isEditing={isEditing}
                    onChangeText={(text) => handleUpdate('tel', text)}
                    keyboardType="phone-pad"
                />
            </View>
        </View>

        {/* --- Tags Section (Updated) --- */}
        <View style={styles.cardContainer}>
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={styles.sectionHeader}>ความสนใจ (Tags)</Text>
                {/* แสดงตัวนับจำนวน Tag ในโหมดแก้ไข */}
                {isEditing && formData?.tag && (
                    <Text style={{ fontFamily: 'Kanit_400Regular', color: formData.tag.length >= 5 ? 'red' : '#888', fontSize: 12 }}>
                        {formData.tag.length}/5
                    </Text>
                )}
             </View>
             
             <View style={[styles.infoCard, { paddingVertical: 15, paddingHorizontal: 15 }]}>
                
                {/* ส่วน Input สำหรับเพิ่ม Tag (แสดงเฉพาะตอนแก้ไข และ Tag ยังไม่ครบ 5) */}
                {isEditing && (!formData?.tag || formData.tag.length < 5) && (
                    <View style={styles.addTagContainer}>
                        <TextInput
                            style={styles.addTagInput}
                            placeholder="เพิ่มความสนใจ (เช่น Coding)"
                            value={newTagInput}
                            onChangeText={setNewTagInput}
                            onSubmitEditing={handleAddTag} // กด Enter บนคีย์บอร์ดเพื่อเพิ่มได้เลย
                            blurOnSubmit={false}
                        />
                        <TouchableOpacity onPress={handleAddTag} style={styles.addTagButton}>
                            <Ionicons name="add" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* รายการ Tags */}
                <View style={styles.tagContainer}>
                    {formData?.tag && formData.tag.length > 0 ? (
                        formData.tag.map((tag, index) => (
                            <View key={index} style={[
                                styles.tagBadge, 
                                isEditing && styles.tagBadgeEditing // เปลี่ยนสีตอนแก้ไขให้ดูรู้ว่าลบได้
                            ]}>
                                <Text style={[
                                    styles.tagText,
                                    isEditing && { color: '#555' }
                                ]}>#{tag}</Text>
                                
                                {/* ปุ่มลบ (X) แสดงเฉพาะตอนแก้ไข */}
                                {isEditing && (
                                    <TouchableOpacity 
                                        onPress={() => handleRemoveTag(tag)}
                                        style={styles.removeTagButton}
                                    >
                                        <Ionicons name="close-circle" size={16} color="#FF6B6B" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))
                    ) : (
                        !isEditing && <Text style={styles.emptyText}>ยังไม่ได้ระบุความสนใจ</Text>
                    )}
                    
                    {/* ข้อความแนะนำตอน Tag ว่างในโหมดแก้ไข */}
                    {isEditing && (!formData?.tag || formData.tag.length === 0) && (
                         <Text style={styles.hintText}>พิมพ์ด้านบนแล้วกด + เพื่อเพิ่ม</Text>
                    )}
                </View>
             </View>
        </View>

        {/* --- Action Buttons --- */}
        <View style={styles.actionSection}>
          {isEditing ? (
            <View style={styles.buttonRow}>
                <View style={{ flex: 1 }}>
                    <CustomButton 
                        title='บันทึก' 
                        theme='default' 
                        iconName='checkmark-circle-outline'
                        onPress={onSave} 
                        isLoading={loading}
                        loadingText='กำลังบันทึก...'
                    />
                </View>
                <View style={{ width: 10 }} />
                <View style={{ flex: 1 }}>
                    <CustomButton 
                        title='ยกเลิก' 
                        theme='danger' // เปลี่ยนเป็นสี danger ตอนยกเลิกเพื่อให้ชัดเจน
                        iconName='close-circle-outline'
                        onPress={onCancel}
                    />
                </View>
            </View>
          ) : (
            <View style={styles.buttonStack}>
               <CustomButton 
                    title='แก้ไขโปรไฟล์' 
                    theme='default'
                    iconName='create-outline' 
                    onPress={() => setIsEditing(true)}
                />
               <CustomButton 
                    title='ออกจากระบบ' 
                    theme='danger' 
                    iconName='log-out-outline' 
                    onPress={logout}
                />
            </View>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Sub-component ที่ปรับแต่ง UI ให้สะอาดขึ้น
const InfoRow = ({ 
    icon, 
    label, 
    value, 
    isEditing, 
    onChangeText,
    keyboardType 
}: { 
    icon: any, 
    label: string, 
    value?: string, 
    isEditing?: boolean,
    onChangeText?: (text: string) => void,
    keyboardType?: 'default' | 'phone-pad'
}) => (
    <View style={styles.infoRowContainer}>
        <View style={styles.iconBox}>
            <Ionicons name={icon} size={22} color={MainColor} />
        </View>
        <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{label}</Text>
            {isEditing && onChangeText ? (
                <TextInput 
                    style={styles.editingInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={`ระบุ${label}`}
                    keyboardType={keyboardType || 'default'}
                />
            ) : (
                <Text style={styles.infoValue}>{value || '-'}</Text>
            )}
        </View>
    </View>
);

