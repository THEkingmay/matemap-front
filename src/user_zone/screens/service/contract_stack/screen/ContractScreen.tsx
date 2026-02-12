import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BGColor, FONT, MainColor } from "../../../../../../constant/theme";
import { getContractPosts } from "./contractPost.service";
import { ContractStackParamList } from "../ContractStack";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../../../AuthProvider";

type Props = NativeStackScreenProps<ContractStackParamList ,'contractScreen'>

type ContractPost = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  province: string;
  city: string;
  created_at: string;
};

export default function ContractScreen({navigation} : Props) {
  
  const {token , user} = useAuth()

  const [posts, setPosts] = useState<ContractPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ฟังก์ชันโหลดข้อมูล (เหมือนเดิม)
  const fetchContractPost = async (isLoadMore = false) => {
    if (isLoadMore && (isFetchingMore || !hasMore)) return;
    
    try {
      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
      }

      const lastCreateAt = isLoadMore && posts.length > 0 
        ? posts[posts.length - 1].created_at 
        : undefined;

      const newPosts = await getContractPosts(lastCreateAt , token);

      if (isLoadMore) {
        setPosts((prev) => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      // เช็คว่าหมดหรือยัง (เกณฑ์ < 20 ตัว)
      if (newPosts.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (err) {
      Toast.show({ type: "error", text1: "Error loading posts" });
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchContractPost(false);
  }, []);

  // --- ส่วนที่แก้ไข: Footer เปลี่ยนเป็นปุ่ม ---
  const renderFooter = () => {
    // 1. ถ้าไม่มีข้อมูลเหลือแล้ว ให้เว้นที่ว่างเฉยๆ หรือแสดงข้อความว่าหมดแล้ว
    if (!hasMore) {
      return <View style={{ height: 40 }} />; 
    }

    // 2. ถ้ากำลังโหลดเพิ่ม ให้แสดงตัวหมุนๆ
    if (isFetchingMore) {
      return (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator size="small" color={MainColor} />
        </View>
      );
    }

    // 3. ถ้ายังมีข้อมูลและไม่ได้โหลดอยู่ ให้แสดงปุ่ม "โหลดเพิ่มเติม"
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.loadMoreButton} 
          onPress={() => fetchContractPost(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.loadMoreText}>โหลดเพิ่มเติม</Text>
        </TouchableOpacity>
      </View>
    );
  };



  if (loading && posts.length === 0) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
       
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 , paddingBottom :100}}
        
        ListFooterComponent={renderFooter}

        refreshControl={
            <RefreshControl refreshing={loading} onRefresh={() => fetchContractPost(false)} />
        }

        renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() =>
            navigation.push("contractDetail", { id: item.id })
          }
        >
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
          ) : (
            <Image source={require('../../../../../../assets/noprofile.png')} style={styles.image} resizeMode="cover" />
          )}

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            <View style={styles.detailsRow}>
              <Text style={styles.price}>
                ฿ {item.price.toLocaleString()}
              </Text>
              <Text style={styles.location} numberOfLines={1}>
                {item.city} • {item.province}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontFamily: FONT.REGULAR, color: '#888' }}>ยังไม่มีการขายสัญญาในขณะนี้</Text>
          </View>
        )}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BGColor },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 4,
  },
  image: { width: "100%", height: 170 },
  content: { padding: 14 },
  title: { fontSize: 16, fontFamily: FONT.BOLD},
  price: { fontSize: 18, fontFamily:FONT.BOLD, color: MainColor },
  location: { fontSize: 13, color: "#6B7280" , fontFamily : FONT.REGULAR },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // --- เพิ่ม Styles สำหรับปุ่ม Load More ---
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff", // หรือใช้ MainColor ตามธีม
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MainColor,
  },
  loadMoreText: {
    color: MainColor,
    fontSize: 14,
    fontFamily: FONT.BOLD
  },// เพิ่มใน styles
  headerContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4, // ขยับให้ตรงกับแนวการ์ด
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONT.BOLD ,
    color: "#333",
  },

  historyButton: {
    backgroundColor: MainColor + '20', // ใส่ Opacity ให้สีจางลงเป็นพื้นหลัง (ถ้า MainColor รองรับ Hex) หรือใช้สีอ่อนๆ
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  historyButtonText: {
    color: '#59678f',
    fontSize: 15,
    fontFamily: FONT.BOLD ,
  },
});