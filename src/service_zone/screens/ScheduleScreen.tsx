import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ServiceTabsParamsList } from '../ServiceMainTabs';

type Props = BottomTabScreenProps<ServiceTabsParamsList, 'schedule'>;

const DAYS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
  'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
  'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export default function ScheduleScreen({ navigation }: Props) {
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(currentYear);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<boolean | null>(null);

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const keyOf = (day: number) => `${year}-${month}-${day}`;

  const onSelectDay = (day: number) => {
    setSelectedDay(day);
    setStatus(availability[keyOf(day)] ?? null);
  };

  const onConfirm = () => {
    if (!selectedDay || status === null) return;
    setAvailability(prev => ({
      ...prev,
      [keyOf(selectedDay)]: status,
    }));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <Text style={styles.title}>เพิ่ม / แก้ตารางงาน</Text>

      {/* Month / Year Selector */}
      <View style={styles.selectorRow}>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowMonthPicker(true)}
        >
          <Text style={styles.selectorText}>{MONTHS[month]}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowYearPicker(true)}
        >
          <Text style={styles.selectorText}>{year}</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendarCard}>
        <View style={styles.headerRow}>
          {DAYS.map(d => (
            <Text key={d} style={styles.dayHeader}>{d}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const value = availability[keyOf(day)];

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayBox,
                  value === true && styles.available,
                  value === false && styles.unavailable,
                  selectedDay === day && styles.selected,
                ]}
                onPress={() => onSelectDay(day)}
              >
                <Text style={styles.dayText}>{day}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Status */}
      {selectedDay && (
        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>
            วันที่ {selectedDay} {MONTHS[month]} {year}
          </Text>

          <View style={styles.checkboxRow}>
            <TouchableOpacity
              style={[styles.checkbox, status === true && styles.checked]}
              onPress={() => setStatus(true)}
            >
              <Text style={styles.checkboxText}>ว่าง</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.checkbox, status === false && styles.checkedRed]}
              onPress={() => setStatus(false)}
            >
              <Text style={styles.checkboxText}>ไม่ว่าง</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmText}>ยืนยัน</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Month Picker (Horizontal) */}
      <Modal transparent visible={showMonthPicker} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>เลือกเดือน</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {MONTHS.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  style={[
                    styles.pill,
                    month === i && styles.pillActive,
                  ]}
                  onPress={() => {
                    setMonth(i);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pillText,
                      month === i && styles.pillTextActive,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Year Picker (Horizontal) */}
      <Modal transparent visible={showYearPicker} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>เลือกปี</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            >
              {Array.from({ length: 11 }, (_, i) => currentYear - 5 + i).map(y => (
                <TouchableOpacity
                  key={y}
                  style={[
                    styles.pill,
                    year === y && styles.pillActive,
                  ]}
                  onPress={() => {
                    setYear(y);
                    setShowYearPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pillText,
                      year === y && styles.pillTextActive,
                    ]}
                  >
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },

  selectorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  selector: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },

  selectorText: {
    fontSize: 16,
    fontWeight: '600',
  },

  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    elevation: 3,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayHeader: {
    width: '14%',
    textAlign: 'center',
    fontWeight: '600',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },

  dayBox: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 4,
  },

  dayText: {
    fontWeight: '600',
  },

  available: {
    backgroundColor: '#DCFCE7',
  },

  unavailable: {
    backgroundColor: '#FEE2E2',
  },

  selected: {
    borderWidth: 2,
    borderColor: '#2563EB',
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },

  checkboxRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  checkbox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },

  checked: {
    backgroundColor: '#22C55E',
  },

  checkedRed: {
    backgroundColor: '#EF4444',
  },

  checkboxText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  confirmButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  confirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },

  horizontalList: {
    paddingHorizontal: 8,
  },

  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 6,
  },

  pillActive: {
    backgroundColor: '#2563EB',
  },

  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },

  pillTextActive: {
    color: '#FFFFFF',
  },
});
