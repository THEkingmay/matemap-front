import {
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ServiceStackParamsList } from "../ServiceStack";
import { useEffect, useState, useMemo } from "react"; // เพิ่ม useMemo
import Toast from "react-native-toast-message";
import apiClient from "../../../../../../constant/axios";
import { MainColor } from "../../../../../../constant/theme";
import { Ionicons } from '@expo/vector-icons';
import { BookingModal } from "../components/BookingModal";

type props = NativeStackScreenProps<ServiceStackParamsList, 'serviceUseId'>

import styles from "../style";
import { useAuth } from "../../../../../AuthProvider";
import { useNavigation } from "@react-navigation/native";

interface ServiceAndWorker {
    name: string,
    tel?: string,
    image_url?: string,
    created_at: string
}

interface Service {
    id: string,
    name: string
}

interface ServiceProviderResponse {
    id: string,
    services: Service[],
    service_worker_detail: ServiceAndWorker
}

export default function ServiceUserId({ route }: props) {
    const { user , token } = useAuth()
    const navigation = useNavigation<any>()

    const [data, setData] = useState<ServiceProviderResponse | null>(null);
    const [reviews, setReview] = useState<{ id: string, review: string, rate: number }[]>([])

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

    const [modalVisible, setModalVisible] = useState(false);

    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const { user_id } = route.params;

    // --- Logic คำนวณคะแนนเฉลี่ย ---
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, item) => sum + item.rate, 0);
        return (total / reviews.length).toFixed(1); // ทศนิยม 1 ตำแหน่ง
    }, [reviews]);

    // --- Helper สำหรับ Render ดาว ---
    const renderStars = (rating: number, size: number = 14) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            let name: keyof typeof Ionicons.glyphMap = 'star';
            if (i > rating) {
                name = i - rating < 1 ? 'star-half' : 'star-outline';
            }
            stars.push(
                <Ionicons key={i} name={name} size={size} color="#FFD700" style={{ marginRight: 2 }} />
            );
        }
        return <View style={{ flexDirection: 'row' }}>{stars}</View>;
    };

    const fetchProviderDetail = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(`/api/service-workers/${user_id}`);

            setData({ ...res.data, services: res.data.service_and_worker.map((s: { services: Service }) => s.services) });
        } catch (err) {
            console.log((err as Error).message)
            Toast.show({
                type: 'error',
                text1: (err as Error).message
            });
        } finally {
            setLoading(false);
        }
    }

    const fetchUserWorkHistory = async () => {
        try {
            setLoadingHistory(true);
            const res = await apiClient.get(`/api/service-workers/${user_id}/work-history/review`);

            setReview(res.data)

        } catch (err) {
            console.log("Error at fetch Review : ", (err as Error).message)
            Toast.show({
                type: 'error',
                text1: (err as Error).message
            });
        } finally {
            setLoadingHistory(false);
        }
    }

    useEffect(() => {
        Promise.all([fetchProviderDetail(), fetchUserWorkHistory()])
    }, [user_id]);

    const handleOpenBooking = (service: Service) => {
        setSelectedService(service);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedService(null);
    };

    const [isLoadingChat , setIsLoadChat] = useState<boolean>(false)
    const handleChat = async () => {
        try{
            setIsLoadChat(true)

            const res = await apiClient.post('/api/room' , 
                {
                userId : user?.id, roomType : 'service', ownerPostId : user_id
                },{
                    headers :{
                        'Authorization' : `Bearer ${token}`
                    }
                }
            )
            // console.log(res.data.data.id)
            navigation.navigate('chat_stack' ,{
                screen : 'chat_select' , 
                params : {
                    room_id :res.data.data.id,
                    target_name : data?.service_worker_detail.name
                }
            })

        }catch(er){
            Toast.show({
                type :"error" ,
                text1 : (er as Error).message
            })
        }finally{
            setIsLoadChat(false)
        }
    }

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={MainColor} />
            </View>
        );
    }

    if (!data) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>ไม่พบข้อมูลผู้ให้บริการ</Text>
            </View>
        );
    }

    const { service_worker_detail, services } = data;

    return (
        <View style={styles.container}>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.8}
            >
                <Ionicons name="arrow-back" size={24} color={MainColor} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

                {/* 1. ส่วน Header ข้อมูลผู้ให้บริการ */}
                <View style={styles.headerContainer}>
                    <View style={styles.profileWrapper}>
                        <Image
                            source={{ uri: service_worker_detail.image_url || 'https://via.placeholder.com/150' }}
                            style={styles.profileImage}
                        />
                        <View style={styles.onlineStatus} />
                    </View>

                    <Text style={styles.providerName}>{service_worker_detail.name}</Text>

                    {/* แสดง Rating ที่ Header ด้วยเพื่อให้ดูน่าเชื่อถือ */}
                    <View style={styles.headerRatingBadge}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.headerRatingText}>{averageRating} ({reviews.length} รีวิว)</Text>
                    </View>

                    <View style={styles.tagContainer}>
                        <View style={styles.tagBadge}>
                            <Ionicons name="shield-checkmark" size={14} color={MainColor} />
                            <Text style={styles.tagText}>ผู้เชี่ยวชาญ</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="call" size={18} color={MainColor} />
                            <Text style={styles.infoText}>
                                {service_worker_detail.tel || "-"}
                            </Text>
                        </View>
                        <View style={styles.dividerVertical} />
                        <View style={styles.infoItem}>
                            <Ionicons name="calendar" size={18} color={MainColor} />
                            <Text style={styles.infoText}>
                                สมาชิก {new Date(service_worker_detail.created_at).getFullYear()}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        disabled={isLoadingChat}
                        style={styles.chatButton}
                        onPress={handleChat}
                        activeOpacity={0.8}
                    >
                        {/* เลือกใช้ไอคอนรูปแชท (ปรับชื่อ icon ได้ตามต้องการครับ) */}
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" style={styles.icon} />

                        <Text style={styles.buttonText}>{isLoadingChat ? 'กำลังนำพาไปยังแชท...' : 'พูดคุยกับผู้ให้บริการ'}</Text>
                    </TouchableOpacity>
                </View>

                {/* 2. รายการบริการ */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>บริการที่มีให้เลือก</Text>
                        <Text style={styles.serviceCount}>{services.length} รายการ</Text>
                    </View>

                    {services.length > 0 ? (
                        services.map((service, index) => (
                            <View key={index} style={styles.serviceCard}>
                                <View style={styles.serviceIconBox}>
                                    <Ionicons name="construct-outline" size={24} color={MainColor} />
                                </View>
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceName}>{service.name}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.bookButton}
                                    onPress={() => handleOpenBooking(service)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.bookButtonText}>จอง</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="folder-open-outline" size={48} color="#CCC" />
                            <Text style={styles.emptyText}>ผู้ให้บริการนี้ยังไม่มีรายการบริการ</Text>
                        </View>
                    )}
                </View>

                {/* 3. Review Section (New Modern UI) */}
                <View style={[styles.sectionContainer, { marginTop: 24 }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>รีวิวจากผู้ใช้บริการ</Text>
                    </View>

                    {/* Summary Card */}
                    <View style={styles.reviewSummaryCard}>
                        <View style={styles.ratingBigContainer}>
                            <Text style={styles.ratingBigNumber}>{averageRating}</Text>
                            <View style={{ alignItems: 'center' }}>
                                {renderStars(Number(averageRating), 16)}
                                <Text style={styles.ratingTotalText}>จาก {reviews.length} รีวิว</Text>
                            </View>
                        </View>
                        <View style={styles.ratingBarContainer}>
                            <Text style={styles.ratingBarText}>คะแนนความพึงพอใจโดยรวม</Text>
                            <View style={styles.ratingProgressBg}>
                                {/* สมมติว่า Progress เต็มตามคะแนนเฉลี่ย */}
                                <View style={[styles.ratingProgressFill, { width: `${(Number(averageRating) / 5) * 100}%` }]} />
                            </View>
                        </View>
                    </View>

                    {/* Review List */}
                    {loadingHistory ? (
                        <ActivityIndicator color={MainColor} style={{ marginTop: 20 }} />
                    ) : reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <View key={review.id || index} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewerInfo}>
                                        {/* Avatar Placeholder */}
                                        <View style={styles.reviewerAvatar}>
                                            <Ionicons name="person" size={16} color="#FFF" />
                                        </View>
                                        <View>
                                            <Text style={styles.reviewerName}>ผู้ใช้งานทั่วไป</Text>
                                            <View style={styles.reviewStarsRow}>
                                                {renderStars(review.rate, 12)}
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={styles.reviewDate}>ล่าสุด</Text>
                                </View>

                                <View style={styles.reviewContent}>
                                    <Text style={styles.reviewText}>
                                        "{review.review || "ไม่มีข้อความรีวิว"}"
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyReviewContainer}>
                            <Ionicons name="chatbubble-ellipses-outline" size={40} color="#DDD" />
                            <Text style={styles.emptyText}>ยังไม่มีรีวิวสำหรับช่างคนนี้</Text>
                        </View>
                    )}
                </View>

            </ScrollView>

            <BookingModal
                onSuccess={() => navigation.navigate('history_toptab', {
                    screen: 'serviceStack',
                    params: {
                        screen: 'service_history'
                    }
                })}
                customer_id={user?.id || ''} provider_id={user_id} modalVisible={modalVisible} handleCloseModal={handleCloseModal} selectedService={selectedService} />
        </View>
    );
}

