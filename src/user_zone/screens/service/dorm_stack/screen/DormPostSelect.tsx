import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Platform,
    ActivityIndicator,
    Linking,
    SafeAreaView // Import SafeAreaView
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Theme (สมมติ path เดิม)
import { BGColor, FONT, MainColor } from '../../../../../../constant/theme';
import type { DormStackParamsList } from "../DormStack";
import Toast from 'react-native-toast-message';
import apiClient from '../../../../../../constant/axios';
import { useAuth } from '../../../../../AuthProvider';
import { useNavigation } from '@react-navigation/native';

interface DormDetail {
    id: string;
    user_id : string ,
    created_at: string;
    owner_name: string;
    owner_tel: string;
    name: string;
    dorm_number: string;
    district: string;
    sub_district: string;
    city: string;
    province: string;
    postal_code: string;
    detail: string;
    id_line?: string;
    social_media_link?: string;
    image_url?: string;
    owner_email?: string
}

type props = NativeStackScreenProps<DormStackParamsList, 'dormPostSelect'>;

const { width } = Dimensions.get('window');

export default function DormPostSelect({ route }: props) {
    const { dorm_post } = route.params || {};
    const { token , user } = useAuth();
    const [dormDetail, setDormDetail] = useState<DormDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [isCreatingRoom , setCreatingRoom] = useState<boolean>(false)

    const navigation = useNavigation<any>()

    useEffect(() => {
        const fetchDormDetail = async () => {
            try {
                setLoading(true);
                const res = await apiClient.get(`/api/dorms/${dorm_post.dorm_id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setDormDetail({ ...res.data.data, owner_email: res.data.owner_email });
            } catch (err) {
                console.log((err as Error).message);
                Toast.show({
                    type: 'error',
                    text1: (err as Error).message
                });
            } finally {
                setLoading(false);
            }
        };

        if (dorm_post?.dorm_id) {
            fetchDormDetail();
        }
    }, [dorm_post]);

    // --- Action Handlers ---
    const handleCallOwner = () => {
        if (dormDetail?.owner_tel) {
            Linking.openURL(`tel:${dormDetail.owner_tel}`);
        } else {
            Toast.show({ type: 'info', text1: 'ไม่พบเบอร์โทรศัพท์' });
        }
    };

    const handleOpenSocial = () => {
        if (dormDetail?.social_media_link) {
            Linking.openURL(dormDetail.social_media_link);
        }
    };

    const handleChat = async () => {
        try{
            setCreatingRoom(true)

            const res = await apiClient.post('/api/room' , 
                {
                    userId : user?.id, 
                    roomType : 'contract', 
                    ownerPostId : dormDetail?.user_id
                },
                {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })
            // console.log(res.data)
            navigation.navigate('chat_stack' , {
                screen : 'chat_select' , 
                params : {
                    room_id : res.data.data.id,
                    target_name : dormDetail?.name
                }
            })

        }catch(err){
            Toast.show({
                type: "error" ,
                text1 : (err as Error).message
            })
        }finally{
            setCreatingRoom(false)
        }
    };

    if (!dorm_post) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ fontFamily: FONT.REGULAR }}>ไม่พบข้อมูลห้องพัก</Text>
            </View>
        );
    }

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
        return date.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const isReady = new Date(dorm_post.ready_date) <= new Date();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* 1. Header Image & Back Button */}
            <View style={styles.headerContainer}>
                <Image
                    source={{
                        uri: dorm_post.image_url || 'https://via.placeholder.com/600x400.png?text=No+Image'
                    }}
                    style={styles.headerImage}
                    resizeMode="cover"
                />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* 2. Content Scrollable Area */}
            <View style={styles.sheetContainer}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header Info */}
                    <View style={styles.titleSection}>
                        <View>
                            <Text style={styles.roomType}>
                                {dorm_post.room_type || 'ห้องพักทั่วไป'}
                            </Text>
                            {dorm_post.room_number && (
                                <Text style={styles.roomNumber}>
                                    ห้องเลขที่: {dorm_post.room_number}
                                </Text>
                            )}
                        </View>
                        <View style={styles.priceBadge}>
                            <Text style={styles.priceText}>{formatPrice(dorm_post.rent_price)}</Text>
                            <Text style={styles.perMonthText}>/ เดือน</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Status Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>สถานะห้องพัก</Text>
                        <View style={[
                            styles.statusContainer,
                            isReady ? styles.statusReady : styles.statusWait
                        ]}>
                            <MaterialCommunityIcons
                                name={isReady ? "check-circle-outline" : "clock-outline"}
                                size={20}
                                color={isReady ? "#2E7D32" : "#EF6C00"}
                            />
                            <Text style={[
                                styles.statusText,
                                { color: isReady ? "#2E7D32" : "#EF6C00" }
                            ]}>
                                {isReady
                                    ? "พร้อมเข้าอยู่ได้ทันที"
                                    : `ว่างตั้งแต่วันที่ ${formatDate(dorm_post.ready_date)}`
                                }
                            </Text>
                        </View>
                    </View>

                    {/* Facilities Section */}
                    {dorm_post.facilities && dorm_post.facilities.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>สิ่งอำนวยความสะดวกในห้อง</Text>
                            <View style={styles.facilityGrid}>
                                {dorm_post.facilities.map((fac, index) => (
                                    <View key={index} style={styles.facilityChip}>
                                        <Ionicons name="checkmark-circle" size={16} color={MainColor} />
                                        <Text style={styles.facilityText}>{fac}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Detail Section */}
                    {dorm_post.detail && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>รายละเอียดเพิ่มเติม</Text>
                            <Text style={styles.detailText}>{dorm_post.detail}</Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    {/* --- DORMITORY DETAILS --- */}
                    <Text style={styles.sectionTitle}>ข้อมูลหอพัก</Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={MainColor} />
                            <Text style={styles.loadingText}>กำลังโหลดข้อมูลหอพัก...</Text>
                        </View>
                    ) : dormDetail ? (
                        <View style={styles.dormInfoContainer}>

                            {/* Dorm Name & Address */}
                            <View style={styles.dormHeaderRow}>
                                <View style={styles.iconBox}>
                                    {/* FIX: ปรับ Image Style */}
                                    <Image
                                        source={{ uri: dormDetail.image_url || 'https://via.placeholder.com/100' }}
                                        style={{ width: '100%', height: '100%', borderRadius: 10 }}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.dormName}>{dormDetail.name}</Text>
                                    <Text style={styles.dormAddress}>
                                        {dormDetail.dorm_number} {dormDetail.sub_district} {dormDetail.district} {dormDetail.city} {dormDetail.province} {dormDetail.postal_code}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.innerDivider} />

                            {/* Contact Owner */}
                            <View style={styles.contactRow}>
                                <Text style={styles.contactLabel}>ผู้ดูแล:</Text>
                                <Text style={styles.contactValue}>{dormDetail.owner_name}</Text>
                            </View>

                            {dormDetail.id_line && (
                                <View style={styles.contactRow}>
                                    <Text style={styles.contactLabel}>Line ID:</Text>
                                    <Text style={styles.contactValue}>{dormDetail.id_line}</Text>
                                </View>
                            )}

                            {dormDetail.social_media_link && (
                                <TouchableOpacity onPress={handleOpenSocial} style={styles.socialLinkButton}>
                                    <MaterialCommunityIcons name="web" size={18} color={MainColor} />
                                    <Text style={styles.socialLinkText}>เยี่ยมชมเว็บไซต์ / เพจ</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <Text style={styles.errorText}>ไม่สามารถโหลดข้อมูลหอพักได้</Text>
                    )}
                    <View style={styles.footerPriceContainer}>
                        <Text style={styles.footerLabel}>ค่าเช่าสุทธิ</Text>
                        <Text style={styles.footerPrice}>{formatPrice(dorm_post.rent_price)}</Text>
                    </View>

                    <View style={styles.footerButtonContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.chatButton]}
                            activeOpacity={0.8}
                            onPress={handleChat}
                            disabled={isCreatingRoom}
                        >
                            <Ionicons name={isCreatingRoom ? 'arrow-up-right-box' : "chatbox-ellipses-outline"} size={20} color={MainColor} />
                            <Text style={[styles.actionButtonText, { color: MainColor }]}>{isCreatingRoom ? 'กำลังพาไปยังช่องแชท...' : 'พูดคุย'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.callButton]}
                            activeOpacity={0.8}
                            onPress={handleCallOwner}
                            disabled={isCreatingRoom}
                        >
                            <Ionicons name="call" size={20} color="#FFF" />
                            <Text style={styles.actionButtonText}>จอง / โทร</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>

            {/* Safe Area สำหรับ iPhone รุ่นใหม่ที่มีขอบล่าง */}
            {Platform.OS === 'ios' && <View style={{ height: 20, backgroundColor: '#FFF' }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGColor,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Header
    headerContainer: {
        height: 300,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 20,
        width: 40,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    // Sheet
    sheetContainer: {
        flex: 1,
        marginTop: 240,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden', // สำคัญเพื่อให้ Footer ไม่บังมุมโค้ง ถ้า Footer อยู่ในนี้
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100
    },
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: 20,
    },
    innerDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    // Title Section
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    roomType: {
        fontSize: 22,
        fontFamily: FONT.BOLD,
        color: '#333',
        marginBottom: 4,
        maxWidth: width * 0.55,
    },
    roomNumber: {
        fontSize: 14,
        fontFamily: FONT.REGULAR,
        color: '#888',
    },
    priceBadge: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontSize: 20,
        fontFamily: FONT.BOLD,
        color: MainColor,
    },
    perMonthText: {
        fontSize: 12,
        color: '#888',
        fontFamily: FONT.REGULAR,
    },
    // Section General
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#333',
        marginBottom: 12,
    },
    // Status
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    statusReady: {
        backgroundColor: '#E8F5E9',
    },
    statusWait: {
        backgroundColor: '#FFF3E0',
    },
    statusText: {
        fontSize: 14,
        fontFamily: FONT.REGULAR,
    },
    // Facilities
    facilityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    facilityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    facilityText: {
        fontSize: 13,
        color: '#555',
        fontFamily: FONT.REGULAR,
    },
    // Details
    detailText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 24,
        fontFamily: FONT.REGULAR,
    },
    // Dorm Info
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 12,
        color: '#888',
        fontFamily: FONT.REGULAR
    },
    dormInfoContainer: {
        backgroundColor: '#FAFAFA',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: 24
    },
    dormHeaderRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center' // เปลี่ยนเป็น center เพื่อความสวยงาม
    },
    iconBox: {
        width: 50, // เพิ่มขนาดเล็กน้อย
        height: 50,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    dormName: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#333',
        marginBottom: 4
    },
    dormAddress: {
        fontSize: 12,
        fontFamily: FONT.REGULAR,
        color: '#666',
        lineHeight: 18
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    contactLabel: {
        fontSize: 14,
        fontFamily: FONT.REGULAR,
        color: '#888'
    },
    contactValue: {
        fontSize: 14,
        fontFamily: FONT.BOLD,
        color: '#333'
    },
    socialLinkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEE'
    },
    socialLinkText: {
        fontSize: 14,
        fontFamily: FONT.BOLD,
        color: MainColor,
    },
    errorText: {
        color: '#E53935',
        fontFamily: FONT.REGULAR,
        textAlign: 'center'
    },
    footerPriceContainer: {
        flexDirection: 'column',
    },
    footerLabel: {
        fontSize: 12,
        color: '#888',
        fontFamily: FONT.REGULAR,
    },
    footerPrice: {
        fontSize: 20,
        color: MainColor,
        fontFamily: FONT.BOLD,
    },
    footerButtonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
    },
    callButton: {
        backgroundColor: MainColor,
        shadowColor: MainColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    chatButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: MainColor,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: FONT.BOLD,
    },
});