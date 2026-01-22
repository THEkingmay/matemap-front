import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Alert,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar
} from 'react-native';
import type { ProfileStackParamsList } from './ProfileStack';
// ตรวจสอบ path ของ theme ให้ถูกต้องนะคะ
import { MainColor, FONT } from '../../../../constant/theme'; 
import { useAuth } from '../../../AuthProvider';
import CustomButton from '../../../components/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker'; 
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type props = NativeStackScreenProps<ProfileStackParamsList, 'profile'>

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
  const [newTagInput, setNewTagInput] = useState('');
  
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
    if (!newTagInput.trim()) return;
    if (formData?.tag?.includes(newTagInput.trim())) {
       Alert.alert('ข้อมูลซ้ำ', 'คุณมี Tag นี้อยู่แล้วค่ะ');
       return;
    }
    if (formData && formData.tag) {
        if (formData.tag.length >= 10) {
            Alert.alert('จำกัดจำนวน', 'เพิ่มได้สูงสุด 10 แท็กเท่านั้นค่ะ');
            return;
        }
        setFormData({
            ...formData,
            tag: [...formData.tag, newTagInput.trim()]
        });
        setNewTagInput('');
    } else if (formData) {
        setFormData({
            ...formData,
            tag: [newTagInput.trim()]
        });
        setNewTagInput('');
    }
  };

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

  const confirmDeleteProfile = () => {
    Alert.alert(
      "ยืนยันการลบ",
      "คุณแน่ใจหรือไม่ว่าต้องการลบรูปโปรไฟล์นี้?",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ลบรูปภาพ", style: "destructive", onPress: deleteProfile }
      ]
    );
  };

  const updateProfile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'ขออภัย เราต้องการสิทธิ์เข้าถึงรูปภาพ');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (result.canceled) return;

    const localUri = result.assets[0].uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    const fileToUpload: RNFile = { uri: localUri, name: filename || '', type: type };
    const formDataUpload = new FormData();
    formDataUpload.append('file', fileToUpload as unknown as Blob );

    try {
      setUploadingImage(true);
      const apiUrl = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/upload/user-profile?userId=${user?.id}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');

      const newImageUrl = data.url || data.image_url; 
      if (newImageUrl) {
        setIsEditing(false)
        setUserProfile((prev) => prev ? { ...prev, image_url: newImageUrl } : null);
        setFormData((prev) => prev ? { ...prev, image_url: newImageUrl } : null);
        Toast.show({
          type:'success',
          text1 : 'อับเดตรูปโปรไฟล์สำเร็จ'
        })
      }
    } catch (error) {
      Alert.alert('Upload Failed', 'ไม่สามารถอัปโหลดรูปภาพได้');
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteProfile = async () => {
    if (deletingImage) return;
    try {
      setDeletingImage(true);
      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/cloudinary/delete?userId=${user?.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ลบรูปไม่สำเร็จ");

      setUserProfile((prev) => prev ? { ...prev, image_url: null } : null);
      setFormData((prev) => prev ? { ...prev, image_url: null } : null);
      setIsEditing(false)
      Toast.show({
          type:'success',
          text1 : 'ลบรูปโปรไฟล์สำเร็จ'
        })
    } catch (err) {
      Toast.show({
          type:'error',
          text1 :(err as Error).message
        })
    } finally {
      setDeletingImage(false); 
    }
  }

  const onSave = async () => {
    if(!formData?.name) return Toast.show({type: 'info' , text1 :"ชื่อห้ามเป็นช่องว่าง"})
    if(formData?.birth_year < 1950) return Toast.show({type: 'info' , text1 :"ระบุปีเกิดให้ถูกต้อง"})
    try {
      setLoading(true);
      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/${user?.id}` ,{
        method : 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, 
        body : JSON.stringify(formData)
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.message)
      setUserProfile(formData); 
      setIsEditing(false); 
      Toast.show({
          type:'success',
          text1 : 'บันทึกสำเร็จ'
        })
    } catch (error) {
        Toast.show({
          type:'error',
          text1 : 'บันทึกไม่สำเร็จ'
        })
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Decor */}
      <View style={styles.headerBackground} />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true} // ให้ทำงานบน Android ด้วย
        extraScrollHeight={100} // เลื่อนขึ้นไปเผื่อให้อีก 100px จะได้เห็นปุ่ม Submit ด้านล่างชัดๆ
        keyboardShouldPersistTaps="handled" // เพื่อให้กดปุ่มได้แม้คีย์บอร์ดค้างอยู่
      >
            {/* --- Header & Avatar --- */}
            <View style={styles.headerSection}>
                <TouchableOpacity 
                    onPress={isEditing ? updateProfile : undefined} 
                    activeOpacity={0.8}
                    style={styles.avatarWrapper}
                    disabled={uploadingImage || !isEditing}
                >
                    {uploadingImage ? (
                        <ActivityIndicator color={MainColor} style={styles.avatarImage} />
                    ) : formData?.image_url ? (
                        <Image source={{ uri: formData.image_url }} style={styles.avatarImage} />
                    ) : (
                        <View style={[styles.avatarImage, styles.avatarPlaceholder]}>
                            <Ionicons name="person" size={50} color="#FFF" />
                        </View>
                    )}
                    
                    {isEditing && !uploadingImage && (
                        <View style={styles.editBadge}>
                            <Ionicons name="camera" size={14} color="#FFF" />
                        </View>
                    )}
                    
                    {isEditing && formData?.image_url && !uploadingImage && (
                        <TouchableOpacity onPress={confirmDeleteProfile} style={styles.deleteBadge}>
                            {deletingImage ? <ActivityIndicator size="small" color="#FFF" /> : <Ionicons name="trash" size={14} color="#FFF" />}
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>

                <View style={styles.nameSection}>
                    {isEditing ? (
                        <TextInput 
                            style={styles.nameInput}
                            value={formData?.name}
                            onChangeText={(t) => handleUpdate('name', t)}
                            placeholder="ชื่อของคุณ"
                        />
                    ) : (
                        <Text style={styles.nameText}>{userProfile?.name}</Text>
                    )}

                    <View style={styles.facultyBadge}>
                         <Text style={styles.facultyText}>
                             {isEditing 
                                ? "กำลังแก้ไขข้อมูล..." 
                                : `${userProfile?.faculty || 'ยังไม่ระบุคณะ'} | ${userProfile?.major || ''}`}
                         </Text>
                    </View>
                </View>
            </View>

            {/* --- Bio Section --- */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>เกี่ยวกับฉัน</Text>
                {isEditing ? (
                    <TextInput 
                        style={styles.bioInput} 
                        value={formData?.bio}
                        onChangeText={(t) => handleUpdate('bio', t)}
                        placeholder="แนะนำตัวเองให้เพื่อนๆ รู้จัก..."
                        multiline
                    />
                ) : (
                    <Text style={styles.bioText}>{userProfile?.bio || "ยังไม่มีคำแนะนำตัว"}</Text>
                )}
            </View>

            {/* --- Personal Info --- */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>ข้อมูลส่วนตัว</Text>
                <InfoRow 
                    icon="school-outline" label="คณะ" 
                    value={formData?.faculty} isEditing={isEditing} 
                    onChangeText={(t : string) => handleUpdate('faculty', t)} 
                />
                <Divider />
                <InfoRow 
                    icon="book-outline" label="สาขา" 
                    value={formData?.major} isEditing={isEditing} 
                    onChangeText={(t : string) => handleUpdate('major', t)} 
                />
                <Divider />
                <InfoRow 
                    icon="calendar-outline" 
                    label={isEditing ? "ปีเกิด (ค.ศ.)" : "อายุ"} 
                    value={isEditing ? formData?.birth_year?.toString() : `${userProfile ? (currentYear - userProfile.birth_year) : 0} ปี`}
                    isEditing={isEditing} 
                    onChangeText={handleYearUpdate} 
                    keyboardType="phone-pad"
                />
                <Divider />
                <InfoRow 
                    icon="call-outline" label="เบอร์โทร" 
                    value={formData?.tel} isEditing={isEditing} 
                    onChangeText={(t : string) => handleUpdate('tel', t)}
                    keyboardType="phone-pad"
                />
            </View>

             {/* --- Interests / Tags --- */}
             <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>ความสนใจ (Tags)</Text>
                    {isEditing && <Text style={styles.counterText}>{formData?.tag?.length || 0}/10</Text>}
                </View>

                {isEditing && (
                    <View style={styles.addTagRow}>
                        <TextInput 
                            style={styles.addTagInput}
                            placeholder="+ เพิ่มสิ่งที่สนใจ"
                            value={newTagInput}
                            onChangeText={setNewTagInput}
                            onSubmitEditing={handleAddTag}
                        />
                        <TouchableOpacity onPress={handleAddTag} style={styles.addTagBtn}>
                            <Ionicons name="arrow-up" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.tagsContainer}>
                    {formData?.tag?.map((tag, i) => (
                        <View key={i} style={styles.tagPill}>
                            <Text style={styles.tagText}>#{tag}</Text>
                            {isEditing && (
                                <TouchableOpacity onPress={() => handleRemoveTag(tag)} style={styles.removeTagBtn}>
                                    <Ionicons name="close" size={12} color="#FFF" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                    {(!formData?.tag || formData.tag.length === 0) && !isEditing && (
                        <Text style={styles.emptyText}>ยังไม่ระบุความสนใจ</Text>
                    )}
                </View>
             </View>

             {/* --- Action Buttons --- */}
             <View style={styles.actionContainer}>
                {isEditing ? (
                    <View style={styles.editActions}>
                         <CustomButton 
                            title='ยกเลิก' theme='danger' iconName='close' 
                            onPress={onCancel} 
                            style={{ flex: 1, marginRight: 10 }}
                         />
                         <CustomButton 
                            title='บันทึก' theme='default' iconName='checkmark' 
                            onPress={onSave} isLoading={loading}
                            style={{ flex: 1 }}
                         />
                    </View>
                ) : (
                    <>
                        <CustomButton 
                            title='แก้ไขโปรไฟล์' theme='default' iconName='create-outline' 
                            onPress={() => setIsEditing(true)} 
                        />
                        <View style={{ height: 12 }} />
                        <CustomButton 
                            title='ตั้งค่าระบบ' theme='warn' iconName='settings-outline' 
                            onPress={()=>navigation.navigate('setting')} 
                        />
                    </>
                )}
             </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

/* --- Components --- */
const Divider = () => <View style={styles.divider} />;

const InfoRow = ({ icon, label, value, isEditing, onChangeText, keyboardType }: any) => (
    <View style={styles.infoRow}>
        <View style={styles.iconCircle}>
            <Ionicons name={icon} size={18} color={MainColor} />
        </View>
        <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{label}</Text>
            {isEditing ? (
                <TextInput 
                    style={styles.inlineInput} 
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

/* --- Styles --- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA', // พื้นหลังสีเทาอ่อน สบายตา
    },
    center: {
        justifyContent: 'center', 
        alignItems: 'center'
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        backgroundColor: MainColor,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    scrollContent: {
        paddingBottom: 40,
        paddingTop: 60, // ดันเนื้อหาลงมาให้พ้น Status Bar
    },
    /* Header Profile */
    headerSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    avatarImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: '#FFF',
        backgroundColor: '#DDD',
    },
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BDBDBD'
    },
    editBadge: {
        position: 'absolute', bottom: 0, right: 0,
        backgroundColor: '#333', padding: 8, borderRadius: 20,
        borderWidth: 2, borderColor: '#FFF'
    },
    deleteBadge: {
        position: 'absolute', top: 0, right: 0,
        backgroundColor: '#FF3B30', padding: 8, borderRadius: 20,
        borderWidth: 2, borderColor: '#FFF'
    },
    nameSection: {
        alignItems: 'center',
    },
    nameText: {
        fontSize: 24,
        color: '#FFF',
        fontFamily: FONT.BOLD,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },
    nameInput: {
        fontSize: 24,
        color: '#FFF',
        fontFamily: FONT.BOLD,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        minWidth: 150,
        marginBottom: 5,
    },
    facultyBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    facultyText: {
        color: '#FFF',
        fontSize: 12,
        fontFamily: FONT.REGULAR,
    },
    /* Cards */
    card: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#333',
        marginBottom: 12,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    counterText: {
        fontSize: 12,
        color: '#999',
    },
    /* Bio */
    bioText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        fontFamily: FONT.REGULAR,
    },
    bioInput: {
        fontSize: 14,
        color: '#333',
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: 10,
        minHeight: 80,
        textAlignVertical: 'top',
        fontFamily: FONT.REGULAR,
    },
    /* Info Row */
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    iconCircle: {
        width: 36, height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F9F4', // สีเขียวอ่อนๆ จางๆ
        justifyContent: 'center', alignItems: 'center',
        marginRight: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
        fontFamily: FONT.REGULAR,
    },
    infoValue: {
        fontSize: 15,
        color: '#333',
        fontFamily: FONT.REGULAR,
    },
    inlineInput: {
        fontSize: 15,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingVertical: 2,
        fontFamily: FONT.REGULAR,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginLeft: 48, // เว้นช่อง icon ไว้
    },
    /* Tags */
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tagPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9', // เขียวอ่อนมากๆ
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        color:MainColor,
        fontSize: 13,
        fontFamily: FONT.REGULAR,
        marginRight: 2,
    },
    removeTagBtn: {
        backgroundColor: '#FFCDD2',
        borderRadius: 10,
        width: 16, height: 16,
        justifyContent: 'center', alignItems: 'center',
        marginLeft: 6,
    },
    addTagRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    addTagInput: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontFamily: FONT.REGULAR,
        fontSize: 13,
    },
    addTagBtn: {
        backgroundColor:MainColor,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginLeft: 8,
    },
    emptyText: {
        color: '#CCC',
        fontStyle: 'italic',
        fontSize: 13,
    },
    /* Action Buttons */
    actionContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 30,
    },
    editActions: {
        flexDirection: 'row',
    }
});