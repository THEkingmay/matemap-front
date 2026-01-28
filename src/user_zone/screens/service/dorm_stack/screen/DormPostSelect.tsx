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
    Linking // Import Linking
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Theme
import { FONT, MainColor } from '../../../../../../constant/theme';
import type { DormStackParamsList } from "../DormStack";
import Toast from 'react-native-toast-message';
import apiClient from '../../../../../../constant/axios';
import { useAuth } from '../../../../../AuthProvider';

interface DormDetail {
    id: string;
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

export default function DormPostSelect({ route, navigation }: props) {
    const { dorm_post } = route.params || {};

    const { token } = useAuth()
    const [dormDetail, setDormDetail] = useState<DormDetail | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchDormDetail = async () => {
            try {
                setLoading(true)
                const res = await apiClient.get(`/api/dorms/${dorm_post.dorm_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                setDormDetail({ ...res.data.data, owner_email: res.data.owner_email })

            } catch (err) {
                console.log((err as Error).message)
                Toast.show({
                    type: 'error',
                    text1: (err as Error).message
                })
            } finally {
                setLoading(false)
            }
        }

        if (dorm_post?.dorm_id) {
            fetchDormDetail()
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

                    {/* --- DORMITORY DETAILS (NEW SECTION) --- */}
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
                                    <Ionicons name="business" size={24} color={MainColor} />
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={styles.dormName}>{dormDetail.name}</Text>
                                    <Text style={styles.dormAddress}>
                                        {dormDetail.dorm_number} {dormDetail.sub_district} {dormDetail.district} {dormDetail.city} {dormDetail.province} {dormDetail.postal_code}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.innerDivider}/>

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

                    {/* 3. Footer Section (Inline) */}
                    <View style={styles.inlineFooter}>
                        <View style={styles.footerInfo}>
                            <Text style={styles.footerLabel}>ค่าเช่าสุทธิ</Text>
                            <Text style={styles.footerPrice}>{formatPrice(dorm_post.rent_price)}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.actionButton} 
                            activeOpacity={0.8}
                            onPress={handleCallOwner}
                        >
                            <Ionicons name="call" size={18} color="#FFF" style={{marginRight: 6}}/>
                            <Text style={styles.actionButtonText}>ติดต่อจองห้องพัก</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
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
        overflow: 'hidden',
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

    // --- New Styles for Dorm Info ---
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
        alignItems: 'flex-start'
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // soft shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    dormName: {
        fontSize: 16,
        fontFamily: FONT.BOLD,
        color: '#333',
        marginBottom: 4
    },
    dormAddress: {
        fontSize: 13,
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
        marginTop: 4
    },
    socialLinkText: {
        fontSize: 14,
        fontFamily: FONT.BOLD,
        color: MainColor,
        textDecorationLine: 'underline'
    },
    errorText: {
        color: '#E53935',
        fontFamily: FONT.REGULAR,
        textAlign: 'center'
    },

    // Footer (Inline Style)
    inlineFooter: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 16,
    },
    footerInfo: {
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
    actionButton: {
        flexDirection: 'row',
        backgroundColor: MainColor,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
        alignItems: 'center',
        // Shadow
        shadowColor: MainColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: FONT.BOLD,
    },
});