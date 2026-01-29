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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FONT, MainColor } from "../../../../../../constant/theme"; // ตรวจสอบ Path นี้ด้วยนะคะ

import styles from "./Style";

import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import Toast from "react-native-toast-message";
import apiClient from "../../../../../../constant/axios";
import { useAuth } from "../../../../../AuthProvider";

interface BookingForm {
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

export function BookingModal({
    modalVisible,
    handleCloseModal,
    selectedService,
    customer_id,
    provider_id,
    onSuccess,
}: Props) {
    const defaultStyles = useDefaultStyles();
    const {token} = useAuth()

    const [selectedDate, setSelectedDate] = useState<DateType>(()=>{
        const date = new Date()
        date.setHours(0, 0, 0, 0); // ตั้งค่าเวลาเป็น 00:00:00.000
        return date;
    });
    const [startTime, setStartTime] = useState<Time>({ hour: 0, minute: 0 })
    const [endTime, setEndTime] = useState<Time>({ hour: 23, minute: 59 })
    const [isDateFormat, setDateFormat] = useState<boolean>(false)

    const [isFormatData , setIsFormatData] = useState<boolean>(true)

    const [formData, setFormData] = useState<BookingForm>({
        customer_id: customer_id,
        provider_id: provider_id,
        service_type_id: selectedService?.id,
        start_location: "",
        destination_location: "",
        detail: "",
    });
    const resetForm = () => {
        setStartTime({ hour: 0, minute: 0 })
        setEndTime({ hour: 0, minute: 0 })
        setSelectedDate(new Date())
        setFormData({
            customer_id: customer_id,
            provider_id: provider_id,
            service_type_id: selectedService?.id,
            start_location: "",
            destination_location: "",
            detail: "",
        })
    }


    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const renderTimeInputGroup = (label: string, type: 'start' | 'end', timeState: Time) => (
        <View style={styles.timeBlock}>
            <Text style={styles.timeLabel}>{label}</Text>
            <View style={styles.timeInputContainer}>
                {/* ช่องชั่วโมง */}
                <View style={styles.timeInputWrapper}>
                    <Text style={styles.unitLabel}>ชม.</Text>
                    <TextInput
                        style={styles.timeInput}
                        keyboardType='numeric'
                        maxLength={2}
                        placeholder="00"
                        selectTextOnFocus
                        value={timeState.hour.toString()}
                        onChangeText={(text) => type == 'end' ? setEndTime(p => ({ ...p, hour: Number(text) })) : setStartTime(p => ({ ...p, hour: Number(text) }))}
                    />
                </View>

                <Text style={styles.timeSeparator}>:</Text>

                {/* ช่องนาที */}
                <View style={styles.timeInputWrapper}>
                    <Text style={styles.unitLabel}>น.</Text>
                    <TextInput
                        style={styles.timeInput}
                        keyboardType="number-pad"
                        maxLength={2}
                        placeholder="00"
                        value={timeState.minute.toString()}
                        onChangeText={(text) => type == 'end' ? setEndTime(p => ({ ...p, minute: Number(text) })) : setStartTime(p => ({ ...p, minute: Number(text) }))}
                        selectTextOnFocus
                    />
                </View>
            </View>
        </View>
    );
    // Reset form when modal opens or service changes
    useEffect(() => {
        if (modalVisible) {
            setFormData(prev => ({
                ...prev,
                service_type_id: selectedService?.id
            }));
        }
    }, [modalVisible, selectedService]);

    const handleChange = (name: keyof BookingForm, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // สำหรับจัดการ format เรื่องเวลา
    useEffect(() => {
        if(formData.destination_location) setIsFormatData(true)
        
        // เชคเวลาชัวโมง นาทีว่าเกินมั้ย
        if (startTime.hour > 23) setStartTime(p => ({ ...p, hour: 23 }))
        if (endTime.hour > 23) setEndTime(p => ({ ...p, hour: 23 }))

        if (startTime.minute > 59) setStartTime(p => ({ ...p, minute: 59 }))
        if (endTime.minute > 59) setEndTime(p => ({ ...p, minute: 59 }))

        const dateObj = dayjs(selectedDate)
        const startDate = dateObj.hour(startTime.hour).minute(startTime.minute)
        const endDate = dateObj.hour(endTime.hour).minute(endTime.minute)

        if (endDate < startDate) {
            setDateFormat(false)
            return
        }
        setDateFormat(true)
    }, [selectedDate, endTime, startTime , formData.destination_location])

    const handleSubmit = async () => {
        if (!formData.destination_location.trim()) {
            setIsFormatData(false)

            return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
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
            
            await apiClient.post('/api/service-history' , reqBody, {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })

            Toast.show({
                type: "success",
                text1: 'จองสำเร็จรอการตอบกลับจากผู้ให้บริการ'
            })
            resetForm()
            handleCloseModal()
            onSuccess()
        } catch (err) {
            Toast.show({
                type: "error",
                text1: (err as Error).message
            })
        } finally {
            setIsSubmitting(false)
        }

        // console.log(reqBody)
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
        >   
            <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.modalContent}>
                    {/* --- Header --- */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>รายละเอียดการจอง</Text>
                        <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                        {/* --- Service Info Card --- */}
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

                        {/* --- Form Inputs --- */}

                        {/* Start Location */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>สถานที่เริ่มต้น <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="navigate-circle-outline" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="ระบุจุดรับ..."
                                    placeholderTextColor="#aaa"
                                    value={formData.start_location}
                                    onChangeText={(text) => handleChange("start_location", text)}
                                />
                            </View>
                        </View>

                        {/* Destination */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>สถานที่ปลายทาง <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="location-outline" size={20} color="#888" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="ระบุจุดหมาย..."
                                    placeholderTextColor="#aaa"
                                    value={formData.destination_location}
                                    onChangeText={(text) => handleChange("destination_location", text)}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>วันและเวลา <Text style={styles.required}>*</Text></Text>
                            <DateTimePicker
                                mode="single"
                                date={selectedDate}
                                onChange={({ date }) => setSelectedDate(date)}
                                styles={defaultStyles}
                            />
                            {!isDateFormat && (
                                <View style={{ padding: 2, backgroundColor: '#fc9393', marginBottom: 5, borderRadius: 10, alignItems: 'center' }}>
                                    <Text style={{ fontFamily: FONT.REGULAR, fontSize: 16 }}>* กรุณาเลือกวันและเวลาให้ถูกต้อง</Text>
                                </View>
                            )}
                            {selectedDate && (
                                <View style={styles.timeSectionContainer}>
                                    {renderTimeInputGroup("เวลาเริ่มต้น", 'start', startTime)}
                                    {renderTimeInputGroup("เวลาสิ้นสุด", 'end', endTime)}
                                </View>
                            )}
                        </View>

                        {/* Details (TextArea) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>รายละเอียดเพิ่มเติม</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="เช่น เบอร์ติดต่อสำรอง, จุดสังเกต..."
                                placeholderTextColor="#aaa"
                                multiline={true}
                                numberOfLines={4}
                                value={formData.detail}
                                onChangeText={(text) => handleChange("detail", text)}
                            />
                        </View>

                    </ScrollView>

                    {!isFormatData && (
                        <View style={{
                            backgroundColor: '#FFEBEE', // พื้นหลังแดงอ่อน นุ่มนวล
                            borderWidth: 1,
                            borderColor: '#FFCDD2',     // เส้นขอบสีแดงจาง
                            borderRadius: 8,            // มุมมน
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            marginBottom: 15,           // เว้นระยะห่างจากปุ่ม
                            flexDirection: 'row',       // จัดไอคอนกับข้อความให้อยู่แถวเดียวกัน
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8                      // ระยะห่างระหว่างไอคอนกับข้อความ
                        }}>
                            <Ionicons name="alert-circle" size={20} color="#C62828" />
                            <Text style={{
                                color: '#C62828',       // ตัวหนังสือสีแดงเข้ม อ่านง่าย
                                fontSize: 14,
                                fontFamily: FONT.REGULAR
                            }}>
                                กรุณากรอกสถานที่ปลายทาง
                            </Text>
                    
                        </View>
                    )}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={handleCloseModal}
                        >
                            <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                            onPress={handleSubmit}
                            disabled={!isDateFormat || isSubmitting}
                        >
                            <Text style={styles.confirmButtonText}>{!isDateFormat ? 'กรุณาแก้ไขก่อน' : (isSubmitting ? 'กำลังจอง...' : 'ยืนยันการจอง')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
        
    );
}

