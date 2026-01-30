import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import apiClient from '../../../../../../constant/axios';
import { useAuth } from '../../../../../AuthProvider';

interface Props {
    history_id: number;
    type: 'done' | 'cancel';
    visible: boolean; // เพิ่ม visible เพื่อควบคุมการแสดงผลของ Modal
    onClose: () => void;
    onSuccess: () => void;
}

const ActionConfirmationModal: React.FC<Props> = ({
    history_id,
    type,
    visible,
    onClose,
    onSuccess,
}) => {
    
    const {user , token} = useAuth()

    const [loading, setLoading] = React.useState(false);

    // กำหนดสีและข้อความตาม type เพื่อความชัดเจนของ UI
    const isDoneType = type === 'done';
    const actionColor = isDoneType ? '#10B981' : '#EF4444'; // เขียว หรือ แดง
    const actionText = isDoneType ? 'ยืนยันสถานะเสร็จสิ้น' : 'ยืนยันการยกเลิก';
    const descriptionText = isDoneType
        ? `คุณต้องการบันทึกสถานะเป็นเสร็จสิ้นใช่หรือไม่?`
        : `คุณต้องการยกเลิกรายการใช่หรือไม่?`;

    const handleSubmit = async () => {
        // ป้องกันการกดซ้ำขณะ loading
        if (loading) return;

        setLoading(true);
        try {

            if(type=='done'){ // เปลี่ยนเป๋นเสร้จสิ้น

                await apiClient.put(`/api/service-history/user/${user?.id}`, 
                    {
                        history_id ,
                        type
                    }, {
                        headers : {
                            'Authorization' : `Bearer ${token}`
                        }
                    }
                )

            }else{ //ถ้านิสิตยกเลิก แปลว่า ลบไปเลย
               await apiClient.delete(`/api/service-history/user/${user?.id}`, {
                // 1. ใส่ headers
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                // 2. ใส่ Body 
                data: {
                    history_id: history_id
                }
            });
            }

            onSuccess(); // แจ้ง Parent ว่าทำรายการสำเร็จ
            onClose();   // ปิด Modal
        } catch (error) {
            console.error('Error submitting action:', error);
            Alert.alert((error as Error).message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <Text style={[styles.title, { color: actionColor }]}>
                        {actionText}
                    </Text>

                    {/* Content */}
                    <Text style={styles.message}>
                        {descriptionText}
                    </Text>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        {/* Cancel Button (Secondary) */}
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>กลับ</Text>
                        </TouchableOpacity>

                        {/* Confirm Button (Primary) */}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: actionColor }]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Text style={styles.confirmButtonText}>ยืนยัน</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // พื้นหลังสีดำจางๆ
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#374151',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
    },
    cancelButton: {
        backgroundColor: '#E5E7EB',
    },
    cancelButtonText: {
        color: '#374151',
        fontWeight: '600',
        fontSize: 16,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ActionConfirmationModal;