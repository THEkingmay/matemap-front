import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import { MainColor, FONT, BGColor } from "../../../../../../constant/theme";
import apiClient from "../../../../../../constant/axios";
import { useAuth } from "../../../../../AuthProvider";

// สมมติว่า path นี้ถูกต้องตามที่คุณแนบมา
import { formattimeToTH } from "../helper/formatdate";
import { HistoryServiecStackParamsList } from "../ServiceStack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import styles from "../style";
import ReviewModal from "../component/ReviewModal";
import ActionConfirmationModal from "../component/ConfirmModal";
type props = NativeStackScreenProps<HistoryServiecStackParamsList, 'service_history'>

interface HistoryResType {
    id: number;
    provider_name: string;
    services: { name: string } | null;
    start_location?: string;
    destination_location: string;
    detail?: string;
    status: 'accepted' | 'rejected' | 'pending' | 'done';
    start_date: string;
    end_date: string;
    created_at: string
}
interface ReviewType {
    review : string ,
    rate : number , 
    service_history_id : number
}

const FILTER_OPTIONS = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'pending', label: 'รอรับงาน' },
    { id: 'accepted', label: 'กำลังดำเนินการ' },
    { id: 'done', label: 'เสร็จสิ้น' },
    { id: 'rejected', label: 'ยกเลิก' },
];

export default function ServiceHistory({ route }: props) {
    const [serviceHistory, setServiceHistory] = useState<HistoryResType[]>([]);
    const [reviews , setReviews] = useState<ReviewType[]>([])

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { user, token } = useAuth();

    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const filteredHistory = useMemo(() => {
        return serviceHistory.filter(item => {
            if (selectedStatus === 'all') return true;
            return item.status === selectedStatus;
        });
    }, [serviceHistory, selectedStatus]);

    const [historyToReview, setHistoryToReview] = useState<number | null>(null)

    const [isOpenConfirmModal , setIsOpenConfirmModal] = useState<{history_id : number , type : 'done' | 'cancel'} | null>(null)

    const fetchHistory = async () => {
        try {
            setLoading(true)
            if (!user?.id) return;

            const res = await apiClient.get(`/api/service-history/user/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // console.log(res.data)

            setServiceHistory(res.data.data);
            setReviews(res.data.reviews)
        } catch (err) {
            console.error("Fetch History Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [route.name]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchHistory();
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    color: '#F39C12', // สีส้ม: สื่อถึงการรอคอย การแจ้งเตือนที่ยังไม่ใช่ข้อผิดพลาด
                    label: 'รอการตอบรับ',
                    bg: '#FEF9E7',
                    borderColor: '#F39C12'
                };

            case 'accepted':
                return {
                    color: '#2980B9', // สีฟ้า: สื่อถึงความเป็น Professional, การดำเนินการอยู่, ความสงบ
                    label: 'กำลังดำเนินการ', // เปลี่ยนจาก 'สำเร็จ' เพราะ accepted คือเพิ่งรับงาน
                    bg: '#EAF2F8',
                    borderColor: '#2980B9'
                };

            case 'done':
                return {
                    color: '#27AE60', // สีเขียว: สื่อถึงความสำเร็จ ผ่าน ยืนยัน
                    label: 'เสร็จสิ้น',
                    bg: '#EAFAF1',
                    borderColor: '#27AE60'
                };

            case 'rejected':
            case 'cancelled': // เผื่อไว้กรณีมีสถานะ cancelled แยกมา
                return {
                    color: '#C0392B', // สีแดง: สื่อถึงการหยุด ยกเลิก หรือข้อผิดพลาด
                    label: 'ยกเลิก',
                    bg: '#FDECEA',
                    borderColor: '#C0392B'
                };

            default:
                return {
                    color: '#7F8C8D', // สีเทา: สถานะที่ไม่รู้จัก
                    label: status,
                    bg: '#F2F3F4',
                    borderColor: '#BDC3C7'
                };
        }
    };

    // แยก Component ย่อยออกมาเพื่อให้โค้ดหลักอ่านง่าย (Clean Code)
    const renderItem = ({ item }: { item: HistoryResType }) => {
        const statusStyle = getStatusStyle(item.status);

        const userReview = reviews.find(rev => rev.service_history_id === item.id);
        // ใช้ formatter ที่คุณ import มา หรือ fallback ถ้า function นั้นมีปัญหา
        const createdDisplay = item.created_at ? formattimeToTH(item.created_at) : '-';
        const displayDate = item.start_date ? formattimeToTH(item.start_date) : '-';
        const displayEndDate = item.end_date ? formattimeToTH(item.end_date) : '-';

        return (
            <View style={styles.card}>
                {/* 1. Header: Date & Status */}
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.dateText}>สร้างเมื่อ {createdDisplay}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.borderColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {statusStyle.label}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* 2. Body: Route Timeline */}
                <View style={styles.routeContainer}>
                    {/* Timeline Column (เส้นเชื่อมจุด) */}
                    <View style={styles.timelineColumn}>
                        <View style={[styles.dot, { backgroundColor: MainColor }]} />
                        <View style={styles.line} />
                        <View style={[styles.dot, { backgroundColor: '#FF6B6B' }]} />
                    </View>

                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        {/* Address Column (ข้อความสถานที่) */}
                        <View style={styles.addressColumn}>
                            <View style={styles.addressRow}>
                                <Text style={styles.locationTitle}>จุดรับ</Text>
                                <Text style={styles.locationText} numberOfLines={1}>
                                    {item.start_location || "ไม่ระบุตำแหน่ง"}
                                </Text>
                            </View>
                            {/* Spacer เพื่อดันให้ตรงกับจุดด้านซ้าย */}
                            <View style={{ height: 16 }} />
                            <View style={styles.addressRow}>
                                <Text style={styles.locationTitle}>จุดส่ง</Text>
                                <Text style={styles.locationText} numberOfLines={2}>
                                    {item.destination_location}
                                </Text>
                            </View>
                        </View>
                        {/*Time Column (ข้อความเวลาเริ่มจบ) */}
                        <View style={styles.addressColumn}>
                            <View style={styles.addressRow}>
                                <Text style={styles.locationTitle}>เวลาเริ่ม</Text>
                                <Text style={styles.locationText} numberOfLines={1}>
                                    {displayDate}
                                </Text>
                            </View>
                            {/* Spacer เพื่อดันให้ตรงกับจุดด้านซ้าย */}
                            <View style={{ height: 16 }} />
                            <View style={styles.addressRow}>
                                <Text style={styles.locationTitle}>เวลาจบ</Text>
                                <Text style={styles.locationText} numberOfLines={2}>
                                    {displayEndDate}
                                </Text>
                            </View>
                        </View>
                    </View>



                </View>

                {/* 3. Footer: Service & Provider Info */}
                <View style={styles.footerContainer}>
                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceLabel}>บริการ</Text>
                        <Text style={styles.serviceValue}>{item.services?.name || '(ลบบริการนี้ไปแล้ว)'}</Text>
                    </View>
                    <View style={styles.providerInfo}>
                        <Text style={styles.serviceLabel}>ผู้ให้บริการ</Text>
                        <Text style={styles.providerValue}>{item.provider_name}</Text>
                    </View>
                </View>

                {/* Optional Detail */}
                {item.detail && (
                    <View style={styles.noteContainer}>
                        <Text style={styles.noteLabel}>หมายเหตุ:</Text>
                        <Text style={styles.noteText}>{item.detail}</Text>
                    </View>
                )}

                {/* 4. Action Buttons Section */}
                <View style={styles.actionContainer}>
                    {item.status === 'pending' && (
                        <TouchableOpacity
                            style={[styles.btn, styles.btnOutlineDanger]}
                            onPress={() => handleCancelRequest(item.id)}
                        >
                            <Text style={styles.btnTextDanger}>ยกเลิกคำขอ</Text>
                        </TouchableOpacity>
                    )}

                    {item.status === 'accepted' && (
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.btn, styles.btnGhostDanger, { flex: 1, marginRight: 8 }]}
                                onPress={() => handleCancelRequest(item.id)}
                            >
                                <Text style={styles.btnTextDanger}>ยกเลิกงาน</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btn, styles.btnSuccess, { flex: 1.5 }]}
                                onPress={() => handleCompleteService(item.id)}
                            >
                                <Text style={styles.btnTextWhite}>เสร็จสิ้นงาน</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* แสดงเมื่อสถานะจบงาน และมีการเช็คว่ารีวิวไปหรือยัง */}
                    {(item.status === 'done' || item.status === 'rejected') && (
                        userReview ? (
                            // --- กรณีรีวิวไปแล้ว แสดงดาวและข้อความ ---
                            <View style={styles.reviewedContainer}>
                                <Text style={styles.reviewedLabel}>คุณได้รีวิวแล้ว ({userReview.rate}/5)</Text>
                                {userReview.review ? (
                                    <Text style={styles.reviewedText}>"{userReview.review}"</Text>
                                ) : null}
                            </View>
                        ) : (
                            // --- กรณีจบงานแต่ยังไม่รีวิว ---
                            <TouchableOpacity
                                style={[styles.btn, styles.btnOutlinePrimary]}
                                onPress={() => handleOpenReviewModal(item.id)}
                            >
                                <Text style={styles.btnTextPrimary}>เขียนรีวิวบริการ</Text>
                            </TouchableOpacity>
                        )
                    )}
                </View>
            </View>
        );
    };


    const handleCancelRequest = (id: number) => {
        setIsOpenConfirmModal({history_id : id , type : 'cancel' })
    };

    const handleCompleteService = (id: number) => {
        setIsOpenConfirmModal({history_id : id , type : 'done' })
    };
    const onCloseConfirmModal = () =>{
        setIsOpenConfirmModal(null)
    }

    const handleOpenReviewModal = (id: number) => {
        setHistoryToReview(id)
    };


    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={MainColor} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.screenHeader}>
                <Text style={styles.screenTitle}>ประวัติการใช้งาน</Text>
                <Text style={styles.screenSubtitle}>รายการบริการทั้งหมดของคุณ</Text>
            </View>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {FILTER_OPTIONS.map((option) => {
                        const isActive = selectedStatus === option.id;
                        return (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => setSelectedStatus(option.id)}
                                style={[
                                    styles.filterChip,
                                    isActive && styles.filterChipActive
                                ]}
                            >
                                <Text style={[
                                    styles.filterText,
                                    isActive && styles.filterTextActive
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            <FlatList
                data={filteredHistory}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MainColor]} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        {/* คุณสามารถใส่ Icon รูปกระดาษเปล่าตรงนี้ได้ */}
                        <Text style={styles.emptyTitle}>ไม่มีประวัติการใช้งาน</Text>
                        <Text style={styles.emptyText}>รายการบริการของคุณจะปรากฏที่นี่</Text>
                    </View>
                }
            />
            <ReviewModal
                isVisible={historyToReview !== null}
                history_id={historyToReview || 0}
                onCloseModal={() => setHistoryToReview(null)}
                onSuccess={fetchHistory}
            />
            
            {isOpenConfirmModal && <ActionConfirmationModal visible={isOpenConfirmModal!==null} onClose={onCloseConfirmModal} onSuccess={fetchHistory} history_id={isOpenConfirmModal?.history_id} type={isOpenConfirmModal?.type} />}
        </View>
    );
}
