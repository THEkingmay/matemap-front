import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { AntDesign } from '@expo/vector-icons'; // หรือ icon library ที่คุณใช้
import Toast from "react-native-toast-message";
import { MainColor, FONT } from "../../../../../../constant/theme";
import apiClient from "../../../../../../constant/axios"; // สมมติว่า import มาใช้
import { useAuth } from "../../../../../AuthProvider"; // เรียก token มาใช้

type props = {
    isVisible: boolean;
    history_id: number;
    onCloseModal: () => void;
    onSuccess?: () => void;
}

export default function ReviewModal({ isVisible, history_id, onCloseModal, onSuccess }: props) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    // ฟังก์ชัน reset ค่าเมื่อปิด Modal
    const handleClose = () => {
        setRating(0);
        setComment("");
        onCloseModal();
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            Toast.show({
                type: 'error',
                text1: 'กรุณาให้คะแนน',
                text2: 'ต้องเลือกอย่างน้อย 1 ดาวครับ'
            });
            return;
        }

        setLoading(true);
        try {

            await apiClient.post('/api/reviews', {
                history_id: history_id,
                rating: rating,
                comment: comment
            }, { headers: { Authorization: `Bearer ${token}` } });

            Toast.show({
                type: 'success',
                text1: 'ขอบคุณสำหรับรีวิว',
                text2: 'ความคิดเห็นของคุณถูกส่งเรียบร้อยแล้ว'
            });

            if (onSuccess) onSuccess();
            handleClose();

        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'เกิดข้อผิดพลาด',
                text2: 'ไม่สามารถส่งรีวิวได้ในขณะนี้'
            });
        } finally {
            setLoading(false);
        }
    };

    // Render ดาว 5 ดวง
    const renderStars = () => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        activeOpacity={0.7}
                    >
                        <AntDesign
                            name={star <= rating ? "star" : "star"}
                            size={32}
                            color={star <= rating ? "#F1C40F" : "#BDC3C7"}
                            style={{ marginHorizontal: 4 }}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleClose}
        >
                <KeyboardAvoidingView style={styles.overlay}>
                    {/* <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.keyboardView}
                    > */}
                        <View style={styles.modalContainer}>

                            {/* Header */}
                            <Text style={styles.title}>ประเมินความพึงพอใจ</Text>
                            <Text style={styles.subtitle}>บริการของคุณเป็นอย่างไรบ้าง?</Text>

                            {/* Stars Section */}
                            {renderStars()}
                            <Text style={styles.ratingLabel}>
                                {rating === 0 ? "แตะเพื่อเริ่มให้คะแนน" : `${rating} ดาว`}
                            </Text>

                            {/* Comment Input */}
                            <TextInput
                                style={styles.input}
                                placeholder="เขียนข้อเสนอแนะเพิ่มเติม (ถ้ามี)..."
                                placeholderTextColor="#95A5A6"
                                multiline
                                numberOfLines={4}
                                value={comment}
                                onChangeText={setComment}
                                textAlignVertical="top" // ให้ text เริ่มบนซ้าย (Android)
                            />

                            {/* Actions Buttons */}
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnCancel]}
                                    onPress={handleClose}
                                    disabled={loading}
                                >
                                    <Text style={styles.btnTextCancel}>ยกเลิก</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.btn, styles.btnSubmit]}
                                    onPress={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFF" size="small" />
                                    ) : (
                                        <Text style={styles.btnTextSubmit}>ส่งรีวิว</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                        </View>
                    {/* </KeyboardAvoidingView> */}
                </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // สีพื้นหลังจางๆ
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontFamily: FONT.BOLD,
        fontSize: 20,
        color: '#2C3E50',
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: FONT.REGULAR,
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    ratingLabel: {
        fontFamily: FONT.BOLD,
        fontSize: 14,
        color: MainColor,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 100,
        backgroundColor: '#F4F6F7',
        borderRadius: 12,
        padding: 12,
        fontFamily: FONT.REGULAR,
        fontSize: 14,
        color: '#2C3E50',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#ECF0F1',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    btn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnCancel: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#BDC3C7',
        marginRight: 12,
    },
    btnSubmit: {
        backgroundColor: MainColor,
        // Shadow for button
        shadowColor: MainColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    btnTextCancel: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        color: '#7F8C8D',
    },
    btnTextSubmit: {
        fontFamily: FONT.BOLD,
        fontSize: 16,
        color: '#FFF',
    },
});