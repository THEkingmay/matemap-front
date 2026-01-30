import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../../styles/profile.view.styles";
import { useNavigation } from "@react-navigation/native";

export default function ProfileView({ profile, onEdit }: any) {
  const navigation = useNavigation<any>();
  const detail = profile?.service_worker_detail;
  const services = profile?.service_and_worker || [];

  return (
    <View style={{ paddingBottom: 20 }}>
      {/* ===== Main Card ===== */}
      <View style={styles.mainCard}>
        <View style={styles.actionButtonGroup}>
          <TouchableOpacity 
            style={[styles.iconBtn, styles.settingBtn]} 
            onPress={() => navigation.navigate('setting')}
          >
            <Ionicons name="settings-outline" size={20} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.editFloatingBtn]} onPress={onEdit}>
            <Ionicons name="pencil" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: detail?.image_url ?? "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} 
            style={styles.avatar} 
          />
          <View style={styles.statusBadge} />
        </View>

        <Text style={styles.name}>{detail?.name}</Text>
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: 6, 
          marginTop: 8 
        }}>
          {services.length > 0 ? (
            services.map((item: any, index: number) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{item.services?.name}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>ทั่วไป</Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox label="งานที่รับ" value="5" />
          <View style={styles.vDivider} />
          <StatBox label="เรตติ้ง" value="5.0" icon="star" />
          <View style={styles.vDivider} />
          <StatBox label="สำเร็จ" value="100%" />
        </View>
      </View>

      {/* ===== Review Section ===== */}
      <Text style={styles.sectionTitle}>รีวิวจากผู้ใช้ล่าสุด</Text>
      <View style={[styles.infoCard, { borderLeftWidth: 4, borderLeftColor: '#4F46E5', marginTop: 0 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>Rose K.</Text>
          <View style={{ flexDirection: 'row' }}>
            {[...Array(5)].map((_, i) => <Ionicons key={i} name="star" size={12} color="#FBBF24" />)}
          </View>
        </View>
        <Text style={{ color: '#64748B', fontSize: 13, lineHeight: 18 }}>"บริการดีมาก ตรงต่อเวลาและสุภาพมากค่ะ แนะนำเลย"</Text>
      </View>
    </View>
  );
}

const StatBox = ({ label, value, icon }: any) => (
  <View style={styles.statItem}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {icon && <Ionicons name={icon} size={14} color="#F59E0B" style={{ marginRight: 4 }} />}
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);