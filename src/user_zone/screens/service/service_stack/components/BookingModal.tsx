import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONT, MainColor } from "../../../../../../constant/theme";
import styles from "./Style"; // ตรวจสอบว่า styles เดิมของคุณรองรับ class ใหม่ๆ หรือไม่ (โรสเพิ่ม styles local ไว้ท้ายไฟล์ให้นะคะ)

import { Calendar, LocaleConfig } from "react-native-calendars";
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import Toast from "react-native-toast-message";
import apiClient from "../../../../../../constant/axios";
import { useAuth } from "../../../../../AuthProvider";
import { isAxiosError } from "axios";

// --- Config Calendar ---
LocaleConfig.locales['th'] = {
    monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
    monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
    dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
    today: 'วันนี้'
};
LocaleConfig.defaultLocale = 'th';

export type BookingForm = {
    customer_id: string;
    provider_id: string;
    service_type_id: string | undefined;
    start_location?: string;
    destination_location: string;
    detail?: string;
}

type Props = {
    modalVisible: boolean;
    handleCloseModal: () => void;
    selectedService: { id: string; name: string } | null;
    customer_id: string;
    provider_id: string;
    onSuccess: () => void
};

interface Time {
    hour: number,
    minute: number
}

// --- Component เลือกเวลาแบบ Scroll (Pure JS) ---
const TimeSelector = ({ label, value, onChange }: { label: string, value: Time, onChange: (t: Time) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    // เลือกนาทีทีละ 5 เพื่อความรวดเร็ว (หรือจะเอาทีละ 1 ก็แก้ตรงนี้เป็น length: 60)
    const minutes = Array.from({ length: 60 }, (_, i) => i); 

    const formatNum = (num: number) => num.toString().padStart(2, '0');

    return (
        <View style={{ flex: 1, marginHorizontal: 4 }}>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 6, fontFamily: FONT.REGULAR }}>{label}</Text>
            
            <TouchableOpacity 
                onPress={() => setIsExpanded(!isExpanded)}
                style={{
                    backgroundColor: '#f9f9f9',
                    borderWidth: 1,
                    borderColor: isExpanded ? MainColor : '#eee',
                    borderRadius: 8,
                    padding: 12,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
            >
                <Text style={{ fontSize: 16, fontFamily: FONT.BOLD, color: '#333' }}>
                    {formatNum(value.hour)} : {formatNum(value.minute)}
                </Text>
                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={16} color="#666" />
            </TouchableOpacity>

            {isExpanded && (
                <View style={{
                    flexDirection: 'row',
                    height: 150,
                    marginTop: 8,
                    borderWidth: 1,
                    borderColor: '#eee',
                    borderRadius: 8,
                    overflow: 'hidden',
                    backgroundColor: '#fff'
                }}>
                    {/* Hour Column */}
                    <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#eee' }}>
                         <Text style={{ textAlign: 'center', padding: 4, backgroundColor: '#f0f0f0', fontSize: 12 }}>ชม.</Text>
                        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                            {hours.map((h) => (
                                <TouchableOpacity
                                    key={h}
                                    style={{
                                        paddingVertical: 10,
                                        alignItems: 'center',
                                        backgroundColor: value.hour === h ? MainColor : 'transparent'
                                    }}
                                    onPress={() => onChange({ ...value, hour: h })}
                                >
                                    <Text style={{ 
                                        color: value.hour === h ? 'white' : '#333',
                                        fontFamily: value.hour === h ? FONT.BOLD : FONT.REGULAR 
                                    }}>
                                        {formatNum(h)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Minute Column */}
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center', padding: 4, backgroundColor: '#f0f0f0', fontSize: 12 }}>นาที</Text>
                        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                            {minutes.map((m) => (
                                <TouchableOpacity
                                    key={m}
                                    style={{
                                        paddingVertical: 10,
                                        alignItems: 'center',
                                        backgroundColor: value.minute === m ? MainColor : 'transparent'
                                    }}
                                    onPress={() => onChange({ ...value, minute: m })}
                                >
                                    <Text style={{ 
                                        color: value.minute === m ? 'white' : '#333',
                                        fontFamily: value.minute === m ? FONT.BOLD : FONT.REGULAR 
                                    }}>
                                        {formatNum(m)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}
        </View>
    );
};

// --- Main Component ---
export function BookingModal({
    modalVisible,
    handleCloseModal,
    selectedService,
    customer_id,
    provider_id,
    onSuccess,
}: Props) {
    const { token, user } = useAuth()

    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const date = new Date()
        date.setHours(0, 0, 0, 0);
        return date;
    });

    const [startTime, setStartTime] = useState<Time>({ hour: 9, minute: 0 })
    const [endTime, setEndTime] = useState<Time>({ hour: 10, minute: 0 })
    
    const [isDateFormat, setDateFormat] = useState<boolean>(false)
    const [isFormatData, setIsFormatData] = useState<boolean>(true)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const [formData, setFormData] = useState<BookingForm>({
        customer_id: customer_id,
        provider_id: provider_id,
        service_type_id: selectedService?.id,
        start_location: "",
        destination_location: "",
        detail: "",
    });

    // Reset form when modal opens
    useEffect(() => {
        if (modalVisible) {
            setFormData(prev => ({ ...prev, service_type_id: selectedService?.id }));
            
            // Reset Time to default or current time logic
            const now = new Date();
            setStartTime({ hour: now.getHours(), minute: 0 }); // ปัดเศษนาที
            setEndTime({ hour: now.getHours() + 1, minute: 0 });
        }
    }, [modalVisible, selectedService]);

    const handleChange = (name: keyof BookingForm, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validation Logic
    useEffect(() => {
        if (formData.destination_location) setIsFormatData(true)

        const dateObj = dayjs(selectedDate)
        const startDate = dateObj.hour(startTime.hour).minute(startTime.minute)
        const endDate = dateObj.hour(endTime.hour).minute(endTime.minute)

        if (endDate.isBefore(startDate) || endDate.isSame(startDate)) {
            setDateFormat(false)
            return
        }
        setDateFormat(true)
    }, [selectedDate, endTime, startTime, formData.destination_location])

    const handleSubmit = async () => {
        if (!formData.destination_location.trim()) {
            setIsFormatData(false)
            return;
        }
        setIsFormatData(true)

        if (!isDateFormat) return

        try {
            setIsSubmitting(true)
            const dateObj = dayjs(selectedDate)

            const reqBody = {
                ...formData,
                start_date: dateObj.hour(startTime.hour).minute(startTime.minute).toISOString(),
                end_date: dateObj.hour(endTime.hour).minute(endTime.minute).toISOString()
            }

            await apiClient.post(`/api/service-history/user/${user?.id}`, reqBody, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            Toast.show({ type: "success", text1: 'จองสำเร็จ รอการตอบกลับจากผู้ให้บริการ' })
            onSuccess() // ควรปิด modal ในนี้ หรือเรียก handleCloseModal()
            handleCloseModal() // ปิด modal หลังจากสำเร็จ
        } catch (err) {
            let message = "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
            if (isAxiosError(err)) {
                message = err.response?.data?.message || err.message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            Toast.show({ type: "error", text1: 'เกิดข้อผิดพลาด', text2: message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
        >
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>รายละเอียดการจอง</Text>
                        <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        
                        {/* Service Card */}
                        <View style={styles.serviceCard}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="briefcase" size={20} color={MainColor} />
                            </View>
                            <View>
                                <Text style={styles.serviceLabel}>บริการที่เลือก</Text>
                                <Text style={styles.serviceName}>{selectedService?.name || "ไม่ได้เลือกบริการ"}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.divider} />

                        {/* Location Inputs */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>สถานที่เริ่มต้น <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="navigate-circle-outline" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="ระบุจุดรับ..."
                                    value={formData.start_location}
                                    onChangeText={(text) => handleChange("start_location", text)}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>สถานที่ปลายทาง <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="location-outline" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="ระบุจุดหมาย..."
                                    value={formData.destination_location}
                                    onChangeText={(text) => handleChange("destination_location", text)}
                                />
                            </View>
                        </View>

                        {/* Date & Time Section */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>วันและเวลา <Text style={styles.required}>*</Text></Text>
                            
                            {/* Calendar */}
                            <Calendar
                                current={dayjs(selectedDate).format('YYYY-MM-DD')}
                                onDayPress={(day) => {
                                    const newDate = new Date(day.dateString);
                                    newDate.setHours(0, 0, 0, 0);
                                    setSelectedDate(newDate);
                                }}
                                markingType={'custom'}
                                markedDates={{
                                    [dayjs(selectedDate).format('YYYY-MM-DD')]: {
                                        customStyles: {
                                            container: { backgroundColor: MainColor, elevation: 2 },
                                            text: { color: 'white', fontWeight: 'bold' }
                                        }
                                    }
                                }}
                                theme={{
                                    todayTextColor: MainColor,
                                    arrowColor: MainColor,
                                    textDayFontFamily: FONT.REGULAR,
                                    textMonthFontFamily: FONT.BOLD,
                                }}
                                style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 15 }}
                            />

                            {/* New Time Selector Row */}
                            {selectedDate && (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <TimeSelector label="เวลาเริ่ม" value={startTime} onChange={setStartTime} />
                                    <TimeSelector label="เวลาสิ้นสุด" value={endTime} onChange={setEndTime} />
                                </View>
                            )}

                            {!isDateFormat && (
                                <View style={{ padding: 8, backgroundColor: '#fc9393', borderRadius: 8, alignItems: 'center' }}>
                                    <Text style={{ fontFamily: FONT.REGULAR, fontSize: 13, color: '#c62828' }}>
                                        <Ionicons name="alert-circle" size={14} /> เวลาสิ้นสุดต้องหลังเวลาเริ่ม
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Detail Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>รายละเอียดเพิ่มเติม</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="เช่น เบอร์ติดต่อสำรอง..."
                                multiline={true}
                                numberOfLines={3}
                                value={formData.detail}
                                onChangeText={(text) => handleChange("detail", text)}
                            />
                        </View>
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCloseModal}>
                            <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={handleSubmit}
                            disabled={!isDateFormat || isSubmitting}
                        >
                            <Text style={styles.confirmButtonText}>
                                {!isDateFormat ? 'เวลาไม่ถูกต้อง' : (isSubmitting ? 'กำลังจอง...' : 'ยืนยันการจอง')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}