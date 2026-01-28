import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../../styles/profile.view.styles";

interface ProfileEditProps {
  form: any;
  setForm: (data: any) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ProfileEdit({ form, setForm, onCancel, onSave }: ProfileEditProps) {
  return (
    <View style={styles.container}>
      {/* --- ส่วนที่ 1: Header Action & Avatar --- */}
      <View style={styles.mainCard}>
        <View style={styles.editHeaderRow}>
          <TouchableOpacity onPress={onCancel} activeOpacity={0.6}>
            <Text style={styles.cancelBtnText}>ยกเลิก</Text>
          </TouchableOpacity>
          <Text style={styles.titleText}>แก้ไขโปรไฟล์</Text>
          <TouchableOpacity onPress={onSave} activeOpacity={0.6}>
            <Text style={styles.saveBtnText}>บันทึก</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: form?.image_url ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} 
            style={styles.avatar} 
          />
          <TouchableOpacity 
            style={[styles.iconBtn, styles.editFloatingBtn, { position: 'absolute', bottom: 0, right: 0, borderWidth: 3, borderColor: '#FFF' }]}
          >
            <Ionicons name="camera" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 10, color: '#94A3B8', fontSize: 12, fontFamily: 'Regular' }}>แตะไอคอนกล้องเพื่อเปลี่ยนรูป</Text>
      </View>

      {/* --- ส่วนที่ 2: ข้อมูลส่วนตัว (Input Fields) --- */}
      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ข้อมูลส่วนตัว</Text>
        
        <EditInput 
          label="ชื่อผู้ใช้งาน" 
          value={form?.name} 
          placeholder="กรอกชื่อ-นามสกุลของคุณ"
          onChange={(val:string) => setForm({...form, name: val})} 
        />
        
        <EditInput 
          label="เบอร์โทรศัพท์" 
          value={form?.tel} 
          placeholder="0xx-xxx-xxxx"
          keyboardType="phone-pad"
          onChange={(val:string) => setForm({...form, tel: val})} 
        />
      </View>

      {/* --- ส่วนที่ 3: เลือกประเภทงาน (Radio Selection) --- */}
      <View style={styles.infoCard}>
        <Text style={styles.formSectionTitle}>ประเภทงานที่รับบริการ</Text>
        
        <JobOption 
          id="delivery" 
          label="ขนของ / ย้ายของ" 
          selected={form?.job_type === 'delivery'} 
          onSelect={() => setForm({...form, job_type: 'delivery'})} 
        />
        <JobOption 
          id="cleaning" 
          label="ทำความสะอาด" 
          selected={form?.job_type === 'cleaning'} 
          onSelect={() => setForm({...form, job_type: 'cleaning'})} 
        />
        <JobOption 
          id="other" 
          label="บริการอื่นๆ" 
          selected={form?.job_type === 'other'} 
          onSelect={() => setForm({...form, job_type: 'other'})} 
        />
      </View>
    </View>
  );
}

/** * Helper: ช่องกรอกข้อมูล 
 */
const EditInput = ({ label, value, onChange, ...props }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput 
      style={styles.textInputField} 
      value={value} 
      onChangeText={onChange} 
      placeholderTextColor="#CBD5E1"
      {...props} 
    />
  </View>
);

/** * Helper: ตัวเลือกประเภทงาน 
 */
const JobOption = ({ label, selected, onSelect }: any) => (
  <TouchableOpacity 
    onPress={onSelect} 
    activeOpacity={0.8}
    style={[styles.radioOptionCard, selected && styles.radioOptionActive]}
  >
    <Ionicons 
      name={selected ? "checkmark-circle" : "ellipse-outline"} 
      size={24} 
      color={selected ? "#4F46E5" : "#CBD5E1"} 
    />
    <Text style={[styles.radioText, selected && styles.radioTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);