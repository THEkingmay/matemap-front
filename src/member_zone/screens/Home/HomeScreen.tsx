import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  /* ===== Fetch Posts ===== */
  const fetchPosts = useCallback(async () => {
    try {
      if (!user || !token) return;

      const dormRes = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms?user_id=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!dormRes.ok) throw new Error('fetch dorm failed');
      const dorm = await dormRes.json();

      const postRes = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${dorm.id}/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!postRes.ok) throw new Error('fetch posts failed');
      const postData = await postRes.json();

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
    }
  }, [user, token]);

  useEffect(() => {
    setLoading(true);
    fetchPosts().finally(() => setLoading(false));
  }, [fetchPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  /* ===== Delete Post ===== */
  const handleDeletePost = async (postId: string, dormId: string) => {
    try {
      if (!token) return;
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/dorms/${dormId}/posts/${postId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('delete failed');
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch {
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
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>โพสต์ของฉัน</Text>
          <Text style={styles.headerSub}>จัดการห้องว่างทั้งหมด</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{posts.length}</Text>
          <Text style={styles.countLabel}>โพสต์</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[MainColor]}
            tintColor={MainColor}
          />
        }
      >
        {posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="newspaper-outline" size={48} color="#CCC" />
            </View>
            <Text style={styles.emptyTitle}>ยังไม่มีโพสต์</Text>
            <Text style={styles.emptyDesc}>เพิ่มโพสต์ห้องว่างเพื่อให้ผู้เช่าเห็น</Text>
          </View>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              navigation={navigation as unknown as HomeNav}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </ScrollView>
    </View>
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
          <Ionicons name="image-outline" size={36} color="#CCC" />
          <Text style={styles.imagePlaceholderText}>ไม่มีรูปภาพ</Text>
        </View>
      )}

      {/* Price badge overlay */}
      <View style={styles.priceBadge}>
        <Text style={styles.priceText}>฿{post.rent_price.toLocaleString()}</Text>
        <Text style={styles.priceUnit}>/เดือน</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <View style={styles.roomTypeTag}>
            <Text style={styles.roomTypeText}>{post.room_type}</Text>
          </View>
          <Text style={styles.dateText}>
            วันที่โพส {new Date(post.created_at).toLocaleDateString('th-TH', {
              day: 'numeric', month: 'short', year: '2-digit'
            })}
          </Text>
        </View>

        <Text style={styles.postTitle}>ห้อง {post.room_number}</Text>

        {/* Ready date */}
        <View style={styles.readyDateRow}>
          <Ionicons name="calendar-outline" size={13} color={MainColor} />
          <Text style={styles.readyDateText}>
            พร้อมเข้าอยู่ {new Date(post.ready_date).toLocaleDateString('th-TH', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </Text>
        </View>

        {/* Facilities */}
        {post.facilities.length > 0 && (
          <View style={styles.tags}>
            {post.facilities.map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Detail */}
        {post.detail ? (
          <Text style={styles.desc} numberOfLines={2}>{post.detail}</Text>
        ) : null}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            activeOpacity={0.75}
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
            <Ionicons name="pencil-outline" size={15} color={MainColor} />
            <Text style={styles.editText}>แก้ไข</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.75}
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
            <Ionicons name="trash-outline" size={15} color="#E53935" />
            <Text style={styles.deleteText}>ลบ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* Header */
  header: {
    backgroundColor: MainColor,
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  countText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
  },
  countLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },

  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },

  /* Empty state */
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  image: { height: 170, width: '100%' },
  imagePlaceholder: {
    height: 170,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: { color: '#BBB', fontSize: 13 },

  /* Price badge */
  priceBadge: {
    position: 'absolute',
    top: 134,
    right: 14,
    backgroundColor: MainColor,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  priceText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  priceUnit: { color: 'rgba(255,255,255,0.85)', fontSize: 11 },

  content: { padding: 14, paddingTop: 18 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roomTypeTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roomTypeText: { fontSize: 12, color: MainColor, fontWeight: '600' },
  dateText: { fontSize: 11, color: '#AAA' },

  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },

  readyDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0F9F4',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  readyDateText: {
    fontSize: 12,
    color: MainColor,
    fontWeight: '600',
  },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  tagText: { fontSize: 11, color: '#2563EB' },

  desc: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
    marginBottom: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F3F3',
    marginVertical: 12,
  },

  actions: { flexDirection: 'row', gap: 10 },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: MainColor,
    backgroundColor: '#F0FFF4',
  },
  editText: { color: MainColor, fontSize: 13, fontWeight: '600' },

  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E53935',
    backgroundColor: '#FFF5F5',
  },
  deleteText: { color: '#E53935', fontSize: 13, fontWeight: '600' },
});