import { Modal , View , Text , TouchableOpacity, ScrollView, TextInput  } from "react-native"

import styles from "../style"
import { Ionicons } from "@expo/vector-icons"
import { MainColor } from "../../../../../../constant/theme"
import Toast from "react-native-toast-message"
import { useState } from "react"

type props = {
    modalVisible : boolean,
    handleCloseModal : ()=>void ,
    selectedService : {id : string ,name : string} | null ,
}

export function BookingModal({modalVisible , handleCloseModal ,selectedService} :props) {

    const [bookingNote , setBookingNote] = useState<string>('')

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>รายละเอียดการจอง</Text>
                        <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                            <Ionicons name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.label}>บริการที่เลือก</Text>
                        <View style={styles.readOnlyField}>
                            <Ionicons name="checkmark-circle" size={20} color={MainColor} style={{ marginRight: 8 }} />
                            <Text style={styles.readOnlyText}>{selectedService?.name}</Text>
                        </View>

                        <Text style={styles.label}>รายละเอียดเพิ่มเติม/สิ่งที่ต้องการ</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="ระบุอาการ หรือสิ่งที่ช่างต้องเตรียมมา..."
                            placeholderTextColor="#999"
                            multiline={true}
                            numberOfLines={4}
                            value={bookingNote}
                            onChangeText={setBookingNote}
                        />
                        <Text style={styles.hintText}>*กรุณาระบุรายละเอียดให้ครบถ้วนเพื่อความรวดเร็ว</Text>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={handleCloseModal}
                        >
                            <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.confirmButton]}
                    
                        >
                            <Text style={styles.confirmButtonText}>ยืนยันการจอง</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}