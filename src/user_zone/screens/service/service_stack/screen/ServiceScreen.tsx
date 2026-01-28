import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 1. Import Navigation
import { FONT, MainColor } from '../../../../../../constant/theme';
import Toast from 'react-native-toast-message';
import apiClient from '../../../../../../constant/axios';

// คำนวณความกว้างหน้าจอเพื่อจัด Grid ให้สวยงาม
const { width } = Dimensions.get('window');
const CARD_MARGIN = 10;
const CARD_WIDTH = (width / 2) - (CARD_MARGIN * 3); // แบ่งครึ่งและหัก Margin ออก

interface ServiceType {
  id: string;
  name: string;
}

export default function ServiceScreen() {
  // 2. กำหนด Type ให้ navigation (หรือใช้ any หากยังไม่ได้ทำ Type global)
  const navigation = useNavigation<any>(); 
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // เพิ่ม State Loading เพื่อ UX ที่ดี

  const fetchAllServices = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/service");
      setServices(res.data.data);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching services',
        text2: (err as Error).message
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  // ฟังก์ชันเมื่อกดเลือกบริการ
  const handlePressService = (serviceId: string) => {
    navigation.navigate('serviceDetail', { service_id: serviceId });
  };

  // Component ย่อยสำหรับการ์ดแต่ละใบ
  const renderItem = ({ item }: { item: ServiceType }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => handlePressService(item.id)}
    >
      {/* ส่วน Icon จำลอง (ถ้ามีรูปจริงในอนาคตให้ใส่ Image ตรงนี้) */}
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      
      <Text style={styles.serviceName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>บริการทั้งหมดในระบบ</Text>
        <Text style={styles.subtitle}>เลือกบริการที่คุณต้องการ</Text>
      </View>

      {/* Service Grid */}
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // แสดง 2 คอลัมน์
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            !loading ? <Text style={styles.emptyText}>ไม่พบข้อมูลบริการ</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // ปรับ Background ให้อ่อนลงเล็กน้อยเพื่อความสบายตา
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // เพิ่มเงาเล็กน้อยให้ Header ลอยเด่นขึ้นมา
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 10,
    
  },
  title: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 28,
    color: MainColor,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Kanit_400Regular', // ถ้ามี font regular
    fontSize: 14,
    color: '#888',
  },
  listContainer: {
    padding: CARD_MARGIN,
    paddingBottom: 40,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: CARD_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140, // กำหนดความสูงให้เท่ากัน
    // เงา Soft Shadow ให้ดูลอยและนุ่มนวล
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${MainColor}15`, // ใช้สี MainColor แต่จางลง (Opacity 15%)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
    color: MainColor,
    fontFamily: FONT.BOLD,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: FONT.BOLD, // หรือ Bold ตามที่มี
    color: MainColor,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#999',
    fontSize: 16,
  }
});