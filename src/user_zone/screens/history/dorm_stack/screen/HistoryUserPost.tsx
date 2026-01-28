import { 
    Text, 
    View, 
    FlatList, 
    ActivityIndicator, 
    RefreshControl, 
    StyleSheet, 
    Image, 
    TouchableOpacity,
    Platform 
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import type { Post } from "../../../service/contract_stack/screen/ContractDetail";
import Toast from "react-native-toast-message";
import apiClient from "../../../../../../constant/axios";
import { useAuth } from "../../../../../AuthProvider";
import { FONT } from "../../../../../../constant/theme";
import type { HistoryDormStackParamsList } from "../HistoryDormStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type props = NativeStackScreenProps<HistoryDormStackParamsList , 'history_post'>

export default function HistoryUserPost({ route }: props) {
    const { token , user} = useAuth();
    
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const fetchUserPosts = async () => {
        try {
            if (!refreshing) setLoading(true);
            const res = await apiClient.get('/api/contract-posts/user', {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { userId: user?.id }
            });
            setPosts(res.data.data || []); 
        } catch (err: any) {
            console.error(err);
            Toast.show({
                type: "error",
                text1: "Error fetching posts",
                text2: err.response?.data?.error || "Something went wrong"
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user?.id && token) { fetchUserPosts(); }
    }, [user?.id, token]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchUserPosts();
    }, [user?.id]);

    const formatPrice = (price?: number) => price ? `฿${price.toLocaleString()}` : "Free";

    // สีสถานะแบบ Minimal (จุดสีเล็กๆ)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return '#10B981'; // เขียว
            case 'pending': return '#F59E0B'; // ส้มเหลือง
            case 'rejected': return '#EF4444'; // แดง
            default: return '#9CA3AF'; // เทา
        }
    };

    const renderItem = ({ item }: { item: Post }) => {
        const statusColor = getStatusColor(item.status);
        
        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.7}>
                {/* 1. รูปภาพขนาดเล็ก (Thumbnail) ทางซ้าย */}
                <Image 
                    source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} 
                    style={styles.thumbnail}
                />

                {/* 2. เนื้อหาทางขวา */}
                <View style={styles.contentContainer}>
                    <View style={styles.topRow}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title || "Untitled"}
                        </Text>
                        {/* Status Dot */}
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    </View>

                    <Text style={styles.location} numberOfLines={1}>
                        {item.sub_district || item.district || item.province || "ไม่ระบุตำแหน่ง"}
                    </Text>

                    <View style={styles.bottomRow}>
                        <Text style={styles.price}>{formatPrice(item.price)}</Text>
                        <Text style={styles.date}>
                            {new Date(item.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="small" color="#333" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                
                // --- ส่วนหัวข้อที่ขอมา ---
                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>โพสต์ขายสัญญาทั้งหมดของคุณ</Text>
                        <Text style={styles.headerSubtitle}>{posts.length} รายการ</Text>
                    </View>
                }
                
                ListEmptyComponent={
                    <View style={styles.centerEmpty}>
                        <Text style={styles.emptyText}>ยังไม่มีรายการขายสัญญา</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // พื้นขาวคลีนๆ
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerEmpty: {
        padding: 40,
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom:120,
    },
    
    // --- Header Styles ---
    headerContainer: {
        marginTop: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    headerTitle: {
        fontSize: 20,
        color: '#1F2937', // เทาเข้มเกือบดำ
        letterSpacing: -0.5,
        fontFamily : FONT.BOLD
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        fontFamily : FONT.REGULAR
    },

    // --- Compact Card Styles ---
    card: {
        flexDirection: 'row', // จัดเรียงแนวนอน
        backgroundColor: '#FFFFFF',
        marginBottom: 12,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6', // เส้นขอบบางๆ สีเทาอ่อน
        
        // เงาที่เบามากๆ (Micro Shadow)
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    thumbnail: {
        width: 80, 
        height: 80,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
        paddingVertical: 2, // จัดกึ่งกลางแนวตั้งเล็กน้อย
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontFamily : FONT.REGULAR ,
        color: '#111827',
        flex: 1,
        marginRight: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    location: {
        fontFamily : FONT.REGULAR ,
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    price: {
        fontSize: 15,
        fontFamily : FONT.REGULAR ,
        color: '#4F46E5', // สี Primary เดิม
    },
    date: {
        fontFamily : FONT.REGULAR ,
        fontSize: 12,
        color: '#9CA3AF',
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 16,
    }
});