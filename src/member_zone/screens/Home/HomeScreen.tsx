import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import type { HomeStackParamsList } from './HomeStack';
import { MainColor } from '../../../../constant/theme';
import { useAuth } from '../../../AuthProvider';

/* ================= TYPE ================= */

type Props = BottomTabScreenProps<HomeStackParamsList, 'home'>;
type HomeNav = NativeStackNavigationProp<HomeStackParamsList>;

export type Post = {
  id: string;
  dormId: string;
  room_number: string;
  room_type: string;
  rent_price: number;
  ready_date: string;
  detail: string;
  facilities: string[];
  created_at: string;
  image_url: string | null;
};

/* ================= SCREEN ================= */

export default function HomeScreen({ navigation }: Props) {
  const { user, token } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== Fetch Posts ===== */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!user || !token) return;

        setLoading(true);

        // 1️⃣ ดึง dorm ของ user
        const dormRes = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms?user_id=${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!dormRes.ok) throw new Error('fetch dorm failed');
        const dorm = await dormRes.json();

        // 2️⃣ ดึง posts
        const postRes = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${dorm.id}/posts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!postRes.ok) throw new Error('fetch posts failed');
        const postData = await postRes.json();

        // 3️⃣ map DB → frontend
        const mapped: Post[] = postData.map((p: any) => ({
          id: p.id,
          dormId: p.dorm_id,
          room_number: p.room_number,
          room_type: p.room_type,
          rent_price: p.rent_price,
          ready_date: p.ready_date,
          detail: p.detail,
          facilities: p.facilities ?? [],
          created_at: p.created_at,
          image_url: p.image_url ?? null,
        }));

        setPosts(mapped);
      } catch (error) {
        console.error('Fetch posts error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, token]);

  /* ===== Delete Post ===== */
  const handleDeletePost = async (postId: string, dormId: string) => {
    try {
      if (!token) return;

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${dormId}/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('delete failed');

      // ลบออกจาก state ทันที
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Delete post error:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถลบโพสต์ได้');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>โพสต์ของฉัน</Text>
        <Text style={styles.subTitle}>
          จัดการโพสต์ห้องว่างทั้งหมดของคุณ
        </Text>
        <Text style={styles.totalPost}>ทั้งหมด {posts.length} โพสต์</Text>
      </View>

      {/* Post List */}
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          navigation={navigation as unknown as HomeNav}
          onDelete={handleDeletePost}
        />
      ))}

      {posts.length === 0 && (
        <Text style={styles.empty}>ยังไม่มีโพสต์ห้องพัก</Text>
      )}
    </ScrollView>
  );
}

/* ================= COMPONENT ================= */

function PostCard({
  post,
  navigation,
  onDelete,
}: {
  post: Post;
  navigation: HomeNav;
  onDelete: (postId: string, dormId: string) => void;
}) {
  return (
    <View style={styles.card}>
      {/* Image */}
      {post.image_url ? (
        <Image source={{ uri: post.image_url }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>ไม่มีรูป</Text>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.postTitle}>
          ห้อง {post.room_number} ({post.room_type})
        </Text>

        <InfoRow
          icon="cash-outline"
          text={`${post.rent_price} บาท / เดือน`}
        />

        <View style={styles.tags}>
          {post.facilities.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
        </View>

        <Text style={styles.desc}>{post.detail}</Text>

        <Text style={styles.date}>
          อัปเดตล่าสุด{' '}
          {new Date(post.created_at).toLocaleDateString('th-TH')}
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate('editPost', {
                post: {
                  id: post.id,
                  dormId: post.dormId,
                  rent_price: post.rent_price,
                  detail: post.detail,
                  facilities: post.facilities,
                },
              })
            }
          >
            <Ionicons name="pencil-outline" size={18} color="#2563EB" />
            <Text style={styles.editText}>แก้ไข</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() =>
              Alert.alert(
                'ยืนยันการลบ',
                'คุณต้องการลบโพสต์นี้ใช่หรือไม่?',
                [
                  { text: 'ยกเลิก', style: 'cancel' },
                  {
                    text: 'ลบ',
                    style: 'destructive',
                    onPress: () => onDelete(post.id, post.dormId),
                  },
                ]
              )
            }
          >
            <Ionicons name="trash-outline" size={18} color="#DC2626" />
            <Text style={styles.deleteText}>ลบ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function InfoRow({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#6B7280" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { padding: 16 },
  title: { fontSize: 22, fontFamily: 'Kanit_700Bold' },
  subTitle: { color: '#6B7280', marginTop: 4 },
  totalPost: { marginTop: 8, fontSize: 13, color: MainColor },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { height: 160, width: '100%' },
  imagePlaceholder: {
    height: 160,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: { color: '#6B7280' },

  content: { padding: 16 },
  postTitle: {
    fontSize: 18,
    fontFamily: 'Kanit_600SemiBold',
    marginBottom: 6,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoText: { marginLeft: 6, color: '#374151', fontSize: 13 },

  tags: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 },
  tag: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: { fontSize: 12, color: '#2563EB' },

  desc: { fontSize: 13, color: '#374151', lineHeight: 18 },
  date: { marginTop: 8, fontSize: 12, color: '#9CA3AF' },

  actions: { flexDirection: 'row', marginTop: 16 },
  editBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 8,
  },
  editText: { marginLeft: 6, color: '#2563EB' },
  deleteBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  deleteText: { marginLeft: 6, color: '#DC2626' },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6B7280',
  },
});
