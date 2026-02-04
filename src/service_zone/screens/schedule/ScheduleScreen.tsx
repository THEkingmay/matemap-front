import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity,RefreshControl } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars"; // Pure JS
import { format, isSameDay, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import Toast from "react-native-toast-message";
import { MainColor, BGColor } from "../../../../constant/theme";
import apiClient from "../../../../constant/axios";
import { useAuth } from "../../../AuthProvider";
import ErrandModal from "./components/ErrandModal";
import { SafeAreaView } from "react-native-safe-area-context";

// Config ภาษาไทย
LocaleConfig.locales['th'] = {
  monthNames: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
  monthNamesShort: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
  dayNames: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'],
  dayNamesShort: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
  today: 'วันนี้'
};
LocaleConfig.defaultLocale = 'th';

// Types
interface HistoryType {
  id: number;
  services: { name: string } | null;
  start_location?: string;
  destination_location: string;
  detail?: string;
  status: 'accepted' | 'rejected' | 'pending' | 'done';
}
interface ScheduleType {
  id: number;
  start_date: string;
  end_date: string;
  type: "booked" | 'errand';
  service_history: null | HistoryType;
}

export default function ScheduleScreen() {
  const { user, token } = useAuth();
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: number, start: string, end: string } | null>(null);

  const fetchSchedules = async () => {
    try {
      setRefreshing(true);
      const res = await apiClient.get('/api/schedule', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { userId: user?.id }
      });
      setSchedules(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user]);

  // จุดสีบนปฏิทิน
  const markedDates = useMemo(() => {
    const marks: any = {};
    schedules.forEach(s => {
      const dateKey = format(parseISO(s.start_date), 'yyyy-MM-dd');
      if (!marks[dateKey]) marks[dateKey] = { dots: [] };

      const isBooked = s.type === 'booked';
      const key = isBooked ? 'booked' : 'errand';
      const color = isBooked ? MainColor : '#FFAB00'; // Booked=สีธีม, Errand=สีส้ม

      // ป้องกัน dot ซ้ำในวันเดียวกัน
      if (!marks[dateKey].dots.find((d: any) => d.key === key)) {
         marks[dateKey].dots.push({ key, color });
      }
    });
    // เพิ่ม highlight วันที่เลือก
    marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: MainColor };
    return marks;
  }, [schedules, selectedDate]);

  // กรองงานของวันที่เลือก
  const dailyList = useMemo(() => {
    return schedules.filter(s => 
      isSameDay(parseISO(s.start_date), parseISO(selectedDate))
    ).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  }, [schedules, selectedDate]);

  const handleEdit = (item: ScheduleType) => {
    if (item.type === 'booked') {
      Toast.show({ type: 'info', text1: 'งานลูกค้าจอง', text2: 'ไม่สามารถแก้ไขได้ที่นี่' });
      return;
    }
    setEditingItem({ id: item.id, start: item.start_date, end: item.end_date });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Calendar Section */}
      <View style={styles.calendarCard}>
        <Calendar
          current={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markingType={'multi-dot'}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: MainColor,
            todayTextColor: MainColor,
            arrowColor: MainColor,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
          }}
        />
      </View>

      {/* List Section */}
      <View style={styles.listSection}>
        <View style={styles.headerRow}>
          <Text style={styles.headerDate}>
            {format(parseISO(selectedDate), 'd MMMM yyyy', { locale: th })}
          </Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => {
              setEditingItem(null);
              setModalVisible(true);
            }}
          >
            <Text style={styles.addBtnText}>+ เพิ่มเวลาส่วนตัว</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={dailyList}
          keyExtractor={item => item.id.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchSchedules} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>วันนี้ว่าง ไม่มีตารางงาน</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isBooked = item.type === 'booked';
            return (
              <TouchableOpacity 
                style={[styles.card, { borderLeftColor: isBooked ? MainColor : '#FFAB00' }]}
                onPress={() => handleEdit(item)}
                activeOpacity={0.8}
              >
                {/* Time */}
                <View style={styles.timeBox}>
                  <Text style={styles.timeStart}>{format(parseISO(item.start_date), 'HH:mm')}</Text>
                  <Text style={styles.timeEnd}>{format(parseISO(item.end_date), 'HH:mm')}</Text>
                </View>

                {/* Info */}
                <View style={styles.infoBox}>
                  <View style={[styles.badge, { backgroundColor: isBooked ? MainColor : '#FFAB00' }]}>
                    <Text style={styles.badgeText}>{isBooked ? 'งานจอง (Booked)' : 'ธุระส่วนตัว (Errand)'}</Text>
                  </View>
                  
                  {isBooked ? (
                    <>
                      <Text style={styles.title}>{item.service_history?.services?.name || 'Unknown Service'}</Text>
                      <Text style={styles.subTitle}>📍 {item.service_history?.destination_location}</Text>
                    </>
                  ) : (
                    <Text style={styles.title}>ไม่ว่าง (ส่วนตัว)</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <ErrandModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={fetchSchedules}
        initialDate={parseISO(selectedDate)}
        editingItem={editingItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BGColor },
  calendarCard: { backgroundColor: 'white', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingBottom: 10, elevation: 4 },
  
  listSection: { flex: 1, padding: 20 , paddingBottom : 100},
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerDate: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  addBtn: { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addBtnText: { color: MainColor, fontSize: 12, fontWeight: 'bold' },

  card: { flexDirection: 'row', backgroundColor: 'white', marginBottom: 12, borderRadius: 10, padding: 15, borderLeftWidth: 5, elevation: 2 },
  timeBox: { marginRight: 15, alignItems: 'center', justifyContent: 'center', minWidth: 50 },
  timeStart: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  timeEnd: { fontSize: 12, color: '#888' },

  infoBox: { flex: 1, justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  subTitle: { fontSize: 13, color: '#666', marginTop: 2 },

  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#bbb' }
});