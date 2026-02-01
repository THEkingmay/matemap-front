import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
  ImageSourcePropType,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatStackParamsList } from '../ChatStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../../AuthProvider';
import Toast from 'react-native-toast-message';
import { BGColor, FONT, MainColor } from '../../../../../constant/theme';

const DEFAULT_PROFILE = require('../../../../../assets/no-profile.png');

type Props = NativeStackScreenProps<ChatStackParamsList, 'chat'>;

interface ChatRoomType {
  room_id: string;
  target_id_image_uri: string;
  last_text: string;
  target_name: string;
  time: string;
  uid_owner_message: string;
}

/* ---------- Helper : format time ---------- */
const formatTime = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  if (isYesterday) {
    return 'เมื่อวาน';
  }

  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

export default function ChatScreen({ navigation }: Props) {
  const { user, token } = useAuth();

  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChatRooms = async (isRefreshing = false) => {
    if (!user || !token) return;

    try {
      if (!isRefreshing) setLoading(true);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/room?userId=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch rooms');
      }

      setChatRooms(data.data || []);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: (err as Error).message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [user, token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChatRooms(true);
  };

  const renderItem = ({ item }: { item: ChatRoomType }) => {
    const isMe = user?.id === item.uid_owner_message;
    const displayTime = formatTime(item.time);

    const imageSource: ImageSourcePropType = item.target_id_image_uri
      ? { uri: item.target_id_image_uri }
      : DEFAULT_PROFILE;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.chatItem,
          { backgroundColor: pressed ? '#F6F6F6' : '#FFF' },
        ]}
        onPress={() =>
          navigation.navigate('chat_select', {
            room_id: item.room_id,
            target_name: item.target_name,
          })
        }
      >
        <Image source={imageSource} style={styles.avatar} />

        <View style={styles.chatContent}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.target_name}
            </Text>
            <Text style={styles.time}>{displayTime}</Text>
          </View>

          <Text style={styles.message} numberOfLines={1}>
            {isMe && <Text style={styles.prefixMe}>คุณ: </Text>}
            <Text style={isMe ? styles.textMe : styles.textOther}>
              {item.last_text}
            </Text>
          </Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.room_id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[MainColor]}
            tintColor={MainColor}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Image
              source={DEFAULT_PROFILE}
              style={{ width: 100, height: 100, opacity: 0.3, marginBottom: 10 }}
            />
            <Text style={styles.emptyText}>ไม่พบบทสนทนา</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGColor,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    backgroundColor: '#F0F0F0',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: FONT.REGULAR,
  },
  prefixMe: {
    color: '#555',
    fontFamily: FONT.REGULAR,
  },
  textMe: {
    fontFamily: FONT.REGULAR,
    color: '#999',
  },
  textOther: {
    fontFamily: FONT.REGULAR,
    color: '#444',
  },
  time: {
    fontSize: 11,
    fontFamily: FONT.REGULAR,
    color: '#AAA',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontFamily: FONT.BOLD,
  },
});
