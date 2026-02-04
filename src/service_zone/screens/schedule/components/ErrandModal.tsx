import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars"; // Pure JS
import { MainColor, FONT } from "../../../../../constant/theme";
import apiClient from "../../../../../constant/axios";
import { useAuth } from "../../../../AuthProvider";
import Toast from "react-native-toast-message";
import { format } from "date-fns";
import { th } from "date-fns/locale";

interface ErrandModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
  editingItem?: { id: number, start: string, end: string } | null;
}

// --- Component ย่อยสำหรับเลือกเวลา (Custom Pure JS) ---
const TimeSelector = ({ value, onChange, label }: { value: Date, onChange: (d: Date) => void, label: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10 ... 55 (Step 5 เพื่อความง่าย)

  const handleTimeChange = (type: 'h' | 'm', val: number) => {
    const newDate = new Date(value);
    if (type === 'h') newDate.setHours(val);
    else newDate.setMinutes(val);
    onChange(newDate);
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.timeDisplayBtn}>
        <Text style={styles.timeDisplayText}>{format(value, "HH:mm")}</Text>
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.timePickerContainer}>
          {/* Hours */}
          <ScrollView style={styles.timeList} nestedScrollEnabled>
            {hours.map(h => (
              <TouchableOpacity 
                key={h} 
                style={[styles.timeItem, value.getHours() === h && styles.timeItemActive]}
                onPress={() => handleTimeChange('h', h)}
              >
                <Text style={[styles.timeText, value.getHours() === h && styles.timeTextActive]}>
                  {h.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={{alignSelf:'center', fontWeight:'bold'}}>:</Text>
          {/* Minutes */}
          <ScrollView style={styles.timeList} nestedScrollEnabled>
            {minutes.map(m => (
              <TouchableOpacity 
                key={m} 
                style={[styles.timeItem, value.getMinutes() === m && styles.timeItemActive]}
                onPress={() => handleTimeChange('m', m)}
              >
                <Text style={[styles.timeText, value.getMinutes() === m && styles.timeTextActive]}>
                  {m.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default function ErrandModal({ visible, onClose, onSuccess, initialDate, editingItem }: ErrandModalProps) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // State
  const [selectedDate, setSelectedDate] = useState(new Date()); // วันที่
  const [startTime, setStartTime] = useState(new Date());       // เวลาเริ่ม
  const [endTime, setEndTime] = useState(new Date());           // เวลาจบ
  
  const [showCalendar, setShowCalendar] = useState(false);

  // Init Data
  useEffect(() => {
    if (visible) {
      if (editingItem) {
        const start = new Date(editingItem.start);
        const end = new Date(editingItem.end);
        setSelectedDate(start);
        setStartTime(start);
        setEndTime(end);
      } else {
        const baseDate = initialDate || new Date();
        setSelectedDate(baseDate);
        
        // Default เวลา 09:00 - 10:00 หรือเวลาปัจจุบัน
        const s = new Date(baseDate);
        s.setHours(9, 0, 0, 0); 
        const e = new Date(s);
        e.setHours(10, 0, 0, 0);
        
        setStartTime(s);
        setEndTime(e);
      }
      setShowCalendar(false);
    }
  }, [visible, editingItem, initialDate]);

  const handleSubmit = async () => {
    // รวมวันที่ (selectedDate) กับเวลา (startTime/endTime) เข้าด้วยกัน
    const startFinal = new Date(selectedDate);
    startFinal.setHours(startTime.getHours(), startTime.getMinutes());

    const endFinal = new Date(selectedDate);
    endFinal.setHours(endTime.getHours(), endTime.getMinutes());

    if (endFinal <= startFinal) {
      Toast.show({ type: 'error', text1: 'เวลาไม่ถูกต้อง', text2: 'เวลาจบต้องมากกว่าเวลาเริ่ม' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: user?.id,
        start_date: startFinal.toISOString(),
        end_date: endFinal.toISOString(),
        type: 'errand',
      };

      if (editingItem) {
        await apiClient.put(`/api/schedule/${editingItem.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Toast.show({ type: 'success', text1: 'แก้ไขสำเร็จ' });
      } else {
        await apiClient.post('/api/schedule', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Toast.show({ type: 'success', text1: 'บันทึกสำเร็จ' });
      }
      onSuccess();
      onClose();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'เกิดข้อผิดพลาด' , text2 : "ช่วงเวลานั้นมีธุระแล้ว" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingItem) return;
    setLoading(true);
    try {
      await apiClient.delete(`/api/schedule/${editingItem.id}`, { headers: { Authorization: `Bearer ${token}` } });
      Toast.show({ type: 'success', text1: 'ลบรายการสำเร็จ' });
      onSuccess();
      onClose();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'ลบไม่สำเร็จ' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.headerTitle}>{editingItem ? "แก้ไขเวลาไม่ว่าง" : "เพิ่มเวลาไม่ว่าง (ส่วนตัว)"}</Text>

          <ScrollView style={{maxHeight: 500}}>
            {/* 1. Date Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>วันที่</Text>
              <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.dateBtn}>
                <Text style={styles.dateText}>
                  {format(selectedDate, "d MMMM yyyy", { locale: th })}
                </Text>
              </TouchableOpacity>
              
              {showCalendar && (
                <Calendar
                  current={format(selectedDate, 'yyyy-MM-dd')}
                  onDayPress={(day: any) => {
                    setSelectedDate(new Date(day.dateString));
                    setShowCalendar(false);
                  }}
                  theme={{
                    todayTextColor: MainColor,
                    selectedDayBackgroundColor: MainColor,
                    arrowColor: MainColor,
                  }}
                  markedDates={{
                    [format(selectedDate, 'yyyy-MM-dd')]: { selected: true, selectedColor: MainColor }
                  }}
                />
              )}
            </View>

            {/* 2. Time Selectors (Custom JS) */}
            <View style={styles.row}>
              <View style={{flex:1, marginRight: 8}}>
                 <TimeSelector label="เริ่ม" value={startTime} onChange={setStartTime} />
              </View>
              <View style={{flex:1, marginLeft: 8}}>
                 <TimeSelector label="ถึง" value={endTime} onChange={setEndTime} />
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.cancelBtn]}>
              <Text style={styles.btnTextCancel}>ยกเลิก</Text>
            </TouchableOpacity>

            {editingItem && (
               <TouchableOpacity onPress={handleDelete} style={[styles.btn, styles.deleteBtn]}>
                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextWhite}>ลบ</Text>}
               </TouchableOpacity>
            )}

            <TouchableOpacity onPress={handleSubmit} style={[styles.btn, styles.saveBtn]} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTextWhite}>บันทึก</Text>}
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '90%', backgroundColor: 'white', borderRadius: 16, padding: 20, maxHeight: '80%' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  
  inputGroup: { marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 14, color: '#666', marginBottom: 6 },
  
  // Date Button
  dateBtn: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  dateText: { fontSize: 16, color: '#333' },

  // Custom Time Picker Styles
  timeDisplayBtn: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  timeDisplayText: { fontSize: 18, fontWeight: 'bold', color: MainColor },
  timePickerContainer: { flexDirection: 'row', height: 120, marginTop: 8, backgroundColor: '#fafafa', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  timeList: { flex: 1 },
  timeItem: { paddingVertical: 8, alignItems: 'center' },
  timeItemActive: { backgroundColor: MainColor },
  timeText: { fontSize: 16, color: '#aaa' },
  timeTextActive: { color: 'white', fontWeight: 'bold' },

  // Buttons
  actionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, gap: 10 },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, minWidth: 70, alignItems: 'center' },
  cancelBtn: { backgroundColor: 'transparent' },
  deleteBtn: { backgroundColor: '#FF4D4D' },
  saveBtn: { backgroundColor: MainColor },
  btnTextWhite: { color: 'white', fontWeight: 'bold' },
  btnTextCancel: { color: '#666' }
});