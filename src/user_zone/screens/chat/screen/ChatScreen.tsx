import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Pressable, ImageSourcePropType , RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatStackParamsList } from '../ChatStack'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../../AuthProvider';
import Toast from 'react-native-toast-message';
import { BGColor, FONT, MainColor } from '../../../../../constant/theme';

// Import รูปภาพ Default
const DEFAULT_PROFILE = require('../../../../../assets/no-profile.png');

type props = NativeStackScreenProps<ChatStackParamsList, 'chat'>;

interface ChatRoomType {
  room_id: string;
  target_id_image_uri: string;
  last_text: string;
  target_name: string; 
  time: string; // คาดว่าเป็น ISO String หรือ Timestamptz
  uid_owner_message : string;
  room_chat_type : 'match' | 'service' | 'contract';
}

// --- 1. Helper Function สำหรับจัดการเวลา ---
// วิธีนี้ใช้ Native JS ไม่ต้องลง library เพิ่ม (เช่น moment หรือ date-fns) ให้หนักเครื่อง
const formatTime = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // เช็คว่าเป็นวันเดียวกันหรือไม่
  const isToday = date.getDate() === now.getDate() &&
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear();

  // เช็คว่าเป็นเมื่อวานหรือไม่
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() &&
                      date.getMonth() === yesterday.getMonth() &&
                      date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    // ถ้าเป็นวันนี้ แสดงแค่เวลา เช่น "14:30"
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  } else if (isYesterday) {
    return 'เมื่อวาน';
  } else {
    // ถ้าเก่ากว่านั้น แสดงเป็นวันที่ เช่น "22/01/24"
    return date.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' });
  }
};

export default function ChatScreen({ navigation }: props) {
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, token } = useAuth();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchChatRooms = async (isRefreshing: boolean = false) => {
    if (!user || !token) return; 

    try {
      if (!isRefreshing) { // 1st time fetch
        setLoading(true);
      }
      const url = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/room?userId=${user.id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch rooms');
      }
      setChatRooms(data.data || []);

    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (error as Error).message || 'Could not load chat history'
      });
    } finally {
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [user, token]); 

  const onRefresh = () => {
    setRefreshing(true); // เปิด Refresh icon
    fetchChatRooms(true); // ส่ง true ไปบอกว่า "นี่คือการรีเฟรช"
  };

  const getRoomTypeStyles = (type: string) => {
    switch (type) {
      case 'service':
        return { borderColor: '#2196F3', badgeBg: '#E3F2FD', badgeText: '#1565C0', label: 'บริการ' };
      case 'contract':
        return { borderColor: '#4CAF50', badgeBg: '#E8F5E9', badgeText: '#2E7D32', label: 'สัญญา' };
      case 'match':
      default:
        return { borderColor: '#FF4081', badgeBg: '#FCE4EC', badgeText: '#C2185B', label: 'แมทช์' };
    }
  };

  const renderItem = ({ item }: { item: ChatRoomType }) => {
    const typeStyle = getRoomTypeStyles(item.room_chat_type);
    
    // --- 2. Logic เช็คว่าเป็นข้อความของเราหรือไม่ ---
    // ตรวจสอบว่า user.id ปัจจุบัน ตรงกับ uid_owner_message หรือไม่
    const isMe = user?.id === item.uid_owner_message;

    // --- 3. แปลงเวลา ---
    const displayTime = formatTime(item.time);

    const imageSource: ImageSourcePropType = item.target_id_image_uri 
      ? { uri: item.target_id_image_uri } 
      : DEFAULT_PROFILE;

    return (
      <Pressable 
        style={({ pressed }) => [
          styles.chatItem, 
          { backgroundColor: pressed ? '#F5F5F5' : '#FFFFFF' }
        ]}
        onPress={() => navigation.navigate('chat_select', { room_id: item.room_id , target_name : item.target_name })}
      >
        <View style={[styles.typeIndicator, { backgroundColor: typeStyle.borderColor }]} />

        <Image
          source={imageSource}
          style={styles.avatar}
          onError={(e) => console.log('Image Load Error', e.nativeEvent.error)} 
        />
        
        <View style={styles.chatContent}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={1}>{item.target_name}</Text>
            
            <View style={[styles.badge, { backgroundColor: typeStyle.badgeBg }]}>
              <Text style={[styles.badgeText, { color: typeStyle.badgeText }]}>
                {typeStyle.label}
              </Text>
            </View>
          </View>

          <View style={styles.messageRow}>
             {/* ปรับการแสดงผลข้อความ */}
             <Text style={styles.messageContainer} numberOfLines={1}>
                {/* ถ้าเราเป็นคนส่ง ให้ขึ้นคำว่า "คุณ:" หรือเปลี่ยนสี */}
                {isMe && <Text style={styles.prefixMe}>คุณ: </Text>}
                <Text style={isMe ? styles.textMe : styles.textOther}>
                  {item.last_text}
                </Text>
             </Text>
            
            {/* แสดงเวลาที่ผ่านการ Format แล้ว */}
            <Text style={styles.time}>{displayTime}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={styles.container}>
        <FlatList
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={[MainColor]} // สีของตัวหมุน (Android)
              tintColor={MainColor} // สีของตัวหมุน (iOS)
            />
          }
          data={chatRooms}
          keyExtractor={(item) => item.room_id}
          ListEmptyComponent={
            <View style={styles.center}>
                <Image 
                  source={DEFAULT_PROFILE} 
                  style={{ width:100, height:100, opacity: 0.3, marginBottom: 10  , borderRadius : 40}} 
                />
                <Text style={{color: '#999', fontSize:20 , fontFamily : FONT.BOLD}}>ไม่พบบทสนทนา</Text>
            </View>
          }
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGColor,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 50, 
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingRight: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    height: 80, 
  },
  typeIndicator: {
    width: 4,
    height: '70%', 
    borderRadius: 2,
    marginRight: 12,
    marginLeft: 4,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700', 
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase', 
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // ปรับ Style ส่วนข้อความใหม่
  messageContainer: {
    flex: 1,
    marginRight: 8,
    flexDirection: 'row', // จัดเรียงแนวนอน
  },
  prefixMe: {
    fontSize: 14,
    color: '#333', // สีเข้มกว่านิดหน่อยเพื่อบอกว่าเป็น "คุณ"
    fontWeight: '500',
  },
  textMe: {
    fontSize: 14,
    color: '#888', // ข้อความของเราอาจจะสีจางลงนิดนึง
  },
  textOther: {
    fontSize: 14,
    color: '#444', // ข้อความคนอื่นอาจจะเข้มกว่า หรือใช้สีปกติ
    fontWeight: '400',
  },
  time: {
    fontSize: 11, 
    color: '#AAA',
    minWidth: 50, // กันพื้นที่ให้เวลาไม่ถูกเบียดจนตกบรรทัด
    textAlign: 'right',
  },
});