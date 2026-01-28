import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl
} from 'react-native';
import { BGColor, FONT, MainColor } from '../../../../../../constant/theme';
import Toast from 'react-native-toast-message';
import apiClient from '../../../../../../constant/axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DormStackParamsList } from '../DormStack';

// --- Interfaces ---
export type DormPostScreenType = {
  id: string,
  created_at: string,
  dorm_id: string,
  room_number?: string,
  room_type?: string,
  rent_price: number,
  ready_date: string,
  detail?: string,
  facilities?: string[],
  image_url?: string
}

const { width } = Dimensions.get('window');

type props = NativeStackScreenProps<DormStackParamsList, 'dormPostScreen'>

export default function DormScreen({ navigation }: props) {
  const [dormsPosts, setDormPosts] = useState<DormPostScreenType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- Helpers ---
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  // --- API Logic ---
  const fetchDormPosts = async (isLoadMore = false) => {
    if (isLoadMore && (isFetchingMore || !hasMore)) return;

    try {
      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
      }

      const lastCreateAt = isLoadMore && dormsPosts.length > 0
        ? dormsPosts[dormsPosts.length - 1].created_at
        : undefined;

      const res = await apiClient.get('/api/dorms/posts/mobile', {
        params: { lastCreateAt: lastCreateAt }
      });

      const newDormsPosts = res.data;

      if (isLoadMore) {
        setDormPosts((prev) => [...prev, ...newDormsPosts]);
      } else {
        setDormPosts(newDormsPosts);
      }

      if (newDormsPosts.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (err) {
      Toast.show({ type: "error", text1: "เกิดข้อผิดพลาดในการโหลดข้อมูล" });
      console.error(err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchDormPosts(false);
  }, []);

  // --- Renders ---

  const renderItem = ({ item }: { item: DormPostScreenType }) => {
    const isReady = new Date(item.ready_date) <= new Date();

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('dormPostSelect', {
          dorm_post: item
        })}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {
            item.image_url ? (
              <Image
                source={{
                  uri: item.image_url || 'https://via.placeholder.com/400x300.png?text=No+Image'
                }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            ) : (
              <View style={{justifyContent : 'center' , alignItems :'center' , flexDirection : 'column' , flex : 1}}>
                <Text style={{fontFamily  : FONT.REGULAR , color : '#a7a7a7' , fontSize : 20}}>ไม่มีรูปตัวอย่าง</Text>
              </View>
            )
          }
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{formatPrice(item.rent_price)}/ด.</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.roomType}>
              {item.room_type || 'ห้องพักมาตรฐาน'}
              {item.room_number ? ` • ${item.room_number}` : ''}
            </Text>
            {isReady ? (
              <View style={[styles.statusBadge, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.statusText, { color: '#2E7D32' }]}>พร้อมเข้าอยู่</Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.statusText, { color: '#EF6C00' }]}>ว่าง {formatDate(item.ready_date)}</Text>
              </View>
            )}
          </View>

          {item.detail && (
            <Text style={styles.detailText} numberOfLines={2}>
              {item.detail}
            </Text>
          )}

          {/* Facilities Chips */}
          {item.facilities && item.facilities.length > 0 && (
            <View style={styles.facilitiesContainer}>
              {item.facilities.slice(0, 3).map((fac, index) => (
                <View key={index} style={styles.facilityChip}>
                  <Text style={styles.facilityText}>{fac}</Text>
                </View>
              ))}
              {item.facilities.length > 3 && (
                <Text style={styles.moreFacilities}>+{item.facilities.length - 3}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!hasMore && dormsPosts.length > 0) {
      return (
        <View style={styles.footerEnd}>
          <Text style={styles.footerEndText}>- แสดงข้อมูลครบถ้วนแล้ว -</Text>
        </View>
      );
    }

    if (isFetchingMore) {
      return (
        <View style={styles.footerLoading}>
          <ActivityIndicator size="small" color={MainColor} />
        </View>
      );
    }

    if (hasMore && dormsPosts.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={() => fetchDormPosts(true)} // แก้ไขชื่อฟังก์ชันให้ถูกต้อง
            activeOpacity={0.7}
          >
            <Text style={styles.loadMoreText}>โหลดเพิ่มเติม</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  // --- Main Render ---

  if (loading && dormsPosts.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => fetchDormPosts(false)} />
        }

        data={dormsPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ไม่พบข้อมูลห้องพัก</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGColor, // สีพื้นหลังเทาอ่อน สบายตา
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 70,
  },
  // Card Styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // Android Shadow
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: MainColor,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  priceText: {
    color: '#FFFFFF',
    fontFamily: 'Kanit_700Bold',
    fontSize: 16,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomType: {
    fontFamily: 'Kanit_700Bold',
    fontSize: 18,
    color: '#333333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Kanit_700Bold', // หรือ Font ปกติถ้าไม่มี Bold
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: 'Kanit_400Regular', // ควรมี Font Regular
  },
  // Facilities
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  facilityChip: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  facilityText: {
    fontSize: 12,
    color: '#555555',
    fontFamily: 'Kanit_400Regular',
  },
  moreFacilities: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  // Footer
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerLoading: {
    paddingVertical: 20,
  },
  footerEnd: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerEndText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
  },
  loadMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: MainColor,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  loadMoreText: {
    color: MainColor,
    fontFamily: 'Kanit_700Bold',
    fontSize: 14,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Kanit_400Regular',
  },
});