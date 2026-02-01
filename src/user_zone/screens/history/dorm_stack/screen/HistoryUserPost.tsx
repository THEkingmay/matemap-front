import {
    Text,
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    StatusBar
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import type { Post } from "../../../service/contract_stack/screen/ContractDetail";
import Toast from "react-native-toast-message";
import apiClient from "../../../../../../constant/axios";
import { useAuth } from "../../../../../AuthProvider";
import { BGColor, FONT, MainColor } from "../../../../../../constant/theme";
import type { HistoryDormStackParamsList } from "../HistoryDormStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// เพิ่ม Icon เล็กๆ เพื่อความสวยงาม (ถ้าในโปรเจคมี library นี้ ถ้าไม่มีลบออกได้ค่ะ)
// import { Ionicons } from '@expo/vector-icons'; 

type props = NativeStackScreenProps<HistoryDormStackParamsList, 'history_post'>

export default function HistoryUserPost({ route, navigation }: props) {
    const { token, user } = useAuth();

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
                text1: "เกิดข้อผิดพลาด",
                text2: err.response?.data?.error || "ไม่สามารถดึงข้อมูลได้"
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

    const formatPrice = (price?: number) => price ? `฿${price.toLocaleString()}` : "ฟรี";

    // --- Logic จัดการสีและข้อความของสถานะ (Helper Function) ---
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved':
                return {
                    label: 'อนุมัติ',
                    bgColor: '#D1FAE5', // เขียวอ่อน
                    textColor: '#065F46' // เขียวเข้ม
                };
            case 'pending':
                return {
                    label: 'รอตรวจสอบ',
                    bgColor: '#FEF3C7', // เหลืองอ่อน
                    textColor: '#92400E' // ส้มเข้ม
                };
            case 'rejected':
                return {
                    label: 'ไม่อนุมัติ',
                    bgColor: '#FEE2E2', // แดงอ่อน
                    textColor: '#991B1B' // แดงเข้ม
                };
            default:
                return {
                    label: status,
                    bgColor: '#F3F4F6', // เทาอ่อน
                    textColor: '#374151' // เทาเข้ม
                };
        }
    };

    const renderItem = ({ item }: { item: Post }) => {
        const { label, bgColor, textColor } = getStatusConfig(item.status);

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('edit_post', { oldPost: item, onSuccess: fetchUserPosts })}
            >
                {/* 1. รูปภาพ (Thumbnail) */}
                <View style={styles.imageContainer}>
                    {item.image_url ? (
                        <Image
                            source={{ uri: item.image_url }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.thumbnail}>
                            <Text style={{textAlign : "center" , color : "#717171" , fontFamily: FONT.BOLD, marginTop : 20}}>ไม่มีรูปภาพ</Text>
                        </View>
                    )
                }
                    {/* Optional: ป้ายกำกับเล็กๆ บนรูป ถ้าต้องการ */}
                </View>

                {/* 2. เนื้อหา (Content) */}
                <View style={styles.contentContainer}>

                    {/* Row 1: Title & Date */}
                    <View style={styles.headerRow}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title || "ไม่มีชื่อประกาศ"}
                        </Text>
                    </View>

                    {/* Row 2: Location */}
                    <Text style={styles.location} numberOfLines={1}>
                        📍 {item.sub_district || item.district || item.province || "ไม่ระบุพิกัด"}
                    </Text>

                    {/* Row 3: Price & Status Badge */}
                    <View style={styles.footerRow}>
                        <Text style={styles.price}>{formatPrice(item.price)}</Text>

                        {/* Status Badge: ดีกว่าจุดสี เพราะอ่านเข้าใจทันที */}
                        <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
                            <Text style={[styles.statusText, { color: textColor }]}>
                                {label}
                            </Text>
                        </View>
                    </View>

                    {/* Row 4: Date (ย้ายมาไว้ล่างสุดแบบ subtle) */}
                    <Text style={styles.dateText}>
                        ลงประกาศ: {new Date(item.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </Text>

                </View>
            </TouchableOpacity>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={BGColor} />
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#4F46E5']} // สี loading ของ Android
                        tintColor="#4F46E5" // สี loading ของ iOS
                    />
                }
                showsVerticalScrollIndicator={false}

                ListHeaderComponent={
                    <View style={styles.headerContainer}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={styles.headerTitle}>ประวัติการขายสัญญา</Text>
                            <Text style={styles.headerSubtitle}>จัดการโพสต์ของคุณ</Text>
                        </View>

                        {/* ปุ่มสร้างโพสต์ใหม่ */}
                        <TouchableOpacity
                            style={styles.addButton}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('add_post', { onSuccess: fetchUserPosts })}
                        >
                            <Ionicons name="add-circle" size={20} color="#FFF" />
                            <Text style={styles.addButtonText}>สร้างโพสต์</Text>
                        </TouchableOpacity>
                    </View>
                }

                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076432.png' }} // ตัวอย่างรูป Placeholder
                            style={{ width: 120, height: 120, opacity: 0.5, marginBottom: 16 }}
                        />
                        <Text style={styles.emptyTitle}>ยังไม่มีรายการ</Text>
                        <Text style={styles.emptySubtitle}>โพสต์ขายสัญญาของคุณจะปรากฏที่นี่</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor || '#F9FAFB', // Fallback ถ้า BGColor ไม่มา
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
        paddingTop: 10,
    },

    // --- Header ---
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: FONT.BOLD,
        color: '#111827',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        fontFamily: FONT.REGULAR,
        color: '#6B7280',
        marginTop: 4,
    },
    countBadge: {
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    countText: {
        color: '#4338CA',
        fontFamily: FONT.BOLD,
        fontSize: 14,
    },

    // --- Card Design ---
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
        padding: 12,
        borderRadius: 16,

        // Modern Shadow (Soft)
        shadowColor: '#64748B', // สีเงาออกน้ำเงินเทา สวยกว่าสีดำล้วน
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3, // Android
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    imageContainer: {
        position: 'relative',
    },
    thumbnail: {
        width: 90,
        height: 90,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },

    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#1F2937',
        lineHeight: 22,
    },
    location: {
        fontSize: 13,
        fontFamily: FONT.REGULAR,
        color: '#6B7280',
        marginBottom: 8,
    },

    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#4F46E5', // Primary Color
    },

    // --- Badge Styles ---
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 11,
        fontFamily: FONT.BOLD, // ใช้ Bold ให้อ่านง่ายบนพื้นสี
    },

    dateText: {
        marginTop: 6,
        fontSize: 11,
        color: '#9CA3AF',
        fontFamily: FONT.REGULAR,
        textAlign: 'right' // จัดวันที่ชิดขวาเพื่อให้ดูเรียบร้อย
    },

    // --- Empty State ---
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontFamily: FONT.BOLD,
        color: '#374151',
        marginTop: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        fontFamily: FONT.REGULAR,
        color: '#9CA3AF',
        marginTop: 5,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: MainColor, // ใช้สีหลักของแอปเพื่อให้เด่น
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 30, // ทำเป็นทรงแคปซูล
        shadowColor: MainColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, // ใส่เงาให้ปุ่มดูลอยขึ้นมา
        shadowRadius: 8,
        elevation: 5, // เงาสำหรับ Android
    },
    addButtonText: {
        color: '#FFF',
        fontFamily: FONT.BOLD,
        fontSize: 14,
        marginLeft: 6, // เว้นระยะห่างจาก Icon นิดหน่อย
    },
});