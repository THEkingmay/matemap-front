import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert 
} from 'react-native';
// ตรวจสอบ path ของ theme ให้ถูกต้องด้วยนะคะ
import { FONT, MainColor} from '../../../../../constant/theme';
import type { ProfileStackParamsList } from '../ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../../../AuthProvider';
import { Ionicons } from '@expo/vector-icons';

type props = NativeStackScreenProps<ProfileStackParamsList , 'setting'>

export default function SettingScreen({navigation} : props) {

  const {logout} = useAuth();
  
  const [isNotifEnabled, setIsNotifEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "ออกจากระบบ",
      "คุณต้องการออกจากระบบใช่หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ใช่, ออกจากระบบ", style: "destructive", onPress: logout }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ตั้งค่า</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- Section 1: Account --- */}
        <Text style={styles.sectionHeader}>บัญชีผู้ใช้</Text>
        <View style={styles.sectionContainer}>
          <SettingItem 
            icon="person-outline" 
            title="แก้ไขข้อมูลส่วนตัว" 
            onPress={() => navigation.navigate('profile')} 
          />
          <Divider />
          <SettingItem 
            icon="lock-closed-outline" 
            title="เปลี่ยนรหัสผ่าน" 
            onPress={() => {}} 
          />
          <Divider />
          <SettingItem 
            icon="shield-checkmark-outline" 
            title="ความปลอดภัยและความเป็นส่วนตัว" 
            onPress={() => {}} 
          />
        </View>

        {/* --- Section 2: App Settings --- */}
        <Text style={styles.sectionHeader}>การตั้งค่าแอป</Text>
        <View style={styles.sectionContainer}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="notifications-outline" size={20} color="#2196F3" />
              </View>
              <Text style={styles.itemText}>การแจ้งเตือน</Text>
            </View>
            <Switch 
              value={isNotifEnabled} 
              onValueChange={setIsNotifEnabled}
              trackColor={{ false: "#767577", true: MainColor }}
            />
          </View>
          <Divider />
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="moon-outline" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.itemText}>โหมดมืด</Text>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#767577", true: MainColor }}
            />
          </View>
        </View>

        {/* --- Section 3: Support --- */}
        <Text style={styles.sectionHeader}>ช่วยเหลือ</Text>
        <View style={styles.sectionContainer}>
          <SettingItem 
            icon="help-circle-outline" 
            title="ศูนย์ช่วยเหลือ" 
            onPress={() => {}} 
          />
          <Divider />
          <SettingItem 
            icon="information-circle-outline" 
            title="เกี่ยวกับแอป" 
            value="v1.0.0" 
            onPress={() => {}} 
          />
        </View>

        {/* --- Logout Button --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Mate Map Beta MVP 1.0.0</Text>

      </ScrollView>
    </View>
  );
}

// --- Reusable Components ---

const SettingItem = ({ icon, title, value, onPress }: any) => (
  <TouchableOpacity style={styles.itemRow} onPress={onPress}>
    <View style={styles.itemLeft}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color="#555" />
      </View>
      <Text style={styles.itemText}>{title}</Text>
    </View>
    <View style={styles.itemRight}>
      {value && <Text style={styles.itemValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </View>
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#F2F2F7', 
    paddingBottom : 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 30, // ปรับให้พอดีกับ Status bar ของเครื่อง
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    // ลบ fontFamily ออกจาก View เพราะจะทำให้ error หรือไม่แสดงผล
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    color: '#000',
    fontFamily: FONT.BOLD // ใส่ FONT.BOLD ที่ Text ตรงนี้แทน
  },
  scrollContent: {
    paddingVertical: 20,
  },
  sectionHeader: {
    fontFamily: FONT.REGULAR, // ใส่ FONT.REGULAR
    fontSize: 14,
    color: '#666',
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
    paddingLeft: 20, 
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingRight: 16,
    minHeight: 50,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0F0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemText: {
    fontFamily: FONT.REGULAR, // ใส่ FONT.REGULAR
    fontSize: 16,
    color: '#000',
  },
  itemValue: {
    fontFamily: FONT.REGULAR, // ใส่ FONT.REGULAR
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  logoutText: {
    fontFamily: FONT.BOLD, // ปุ่มสำคัญควรใช้ Bold
    color: '#FF3B30',
    fontSize: 16,
    marginLeft: 8,
  },
  versionText: {
    fontFamily: FONT.REGULAR, // ใส่ FONT.REGULAR
    textAlign: 'center',
    color: '#AAA',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  }
});