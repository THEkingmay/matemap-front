import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT } from '../../../constant/theme';

const { width } = Dimensions.get('window');

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  onChat: () => void;
  matchedUserImage?: string; 
  matchedName: string;
}

export default function MatchModal({ 
  visible, 
  onClose, 
  onChat,
  matchedName 
}: MatchModalProps) {

    if (!visible) return null;

  return (
    <Modal 
      transparent 
      visible={visible} 
      animationType="fade" // ใช้แบบ Fade ธรรมดา นุ่มนวลและไม่เยอะ
      onRequestClose={onClose} // รองรับปุ่ม Back ของ Android
    >
      <View style={styles.overlay}>
        {/* เปลี่ยนจาก Animated.View เป็น View ธรรมดา */}
        <View style={styles.container}>
          
          {/* Title Section */}
          <View style={{marginBottom: 20}}>
             <Text style={styles.matchTitle}>It's a Match!</Text>
             <Text style={styles.subTitle}>คุณกับ {matchedName} ใจตรงกัน</Text>
          </View>


          {/* Buttons */}
          <TouchableOpacity style={styles.chatButton} onPress={onChat}>
            <Text style={styles.chatButtonText}>ทักทายเลย</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.keepSwipingButton}    onPress={onClose}>
            <Text style={styles.keepSwipingText}>ปัดต่อก่อน</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    alignItems: 'center',
    padding: 20,
  },
  matchTitle: {
    fontFamily: FONT.BOLD,
    fontSize: 42,
    color: '#4CD964', 
    textAlign: 'center',
    fontStyle: 'italic',
    // ลดเงาลงนิดหน่อยเพื่อให้ดู Clean ขึ้น
    textShadowColor: 'rgba(0, 0, 0, 0.5)', 
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5
  },
  subTitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
    fontWeight: '500'
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  imageWrapper: {
    position: 'relative', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 }, // ลดความสูงเงาลง
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: 160, 
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: '#fff',
  },
  heartBadge: {
    position: 'absolute',
    bottom: 5,  
    right: 5,   
    backgroundColor: '#FF6B6B',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 5 
  },
  chatButton: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    // เอาเงาออก หรือลดลงเพื่อให้ดูแบนราบ (Flat) ขึ้น ตามสไตล์ Minimal
    elevation: 2, 
  },
  chatButtonText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  keepSwipingButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  keepSwipingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8
  }
});