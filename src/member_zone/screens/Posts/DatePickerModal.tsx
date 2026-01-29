import React, { useMemo, useState, useEffect } from "react";
import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/DatePickerStyle";

type Props = {
  visible: boolean;
  tempDate: Date;
  onClose: () => void;
  onChangeDate: (date: Date) => void;
  onConfirm: () => void;
};

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const MONTHS_TH = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export default function DatePickerModal({
  visible,
  tempDate,
  onClose,
  onChangeDate,
  onConfirm,
}: Props) {
  const START_YEAR_AD = new Date().getFullYear();
  const YEAR_CHUNK = 20; // load 20 years at a time
  const [year, setYear] = useState(tempDate.getFullYear());
  const [month, setMonth] = useState(tempDate.getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearCount, setYearCount] = useState(YEAR_CHUNK);

  useEffect(() => {
    setYear(tempDate.getFullYear());
    setMonth(tempDate.getMonth());
  }, [tempDate]);

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month],
  );

  const firstDayOfMonth = useMemo(
    () => new Date(year, month, 1).getDay(),
    [year, month],
  );

  const selectDay = (day: number) => {
    // Create date in Bangkok timezone (UTC+7)
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T12:00:00+07:00`;
    const newDate = new Date(dateString);
    onChangeDate(newDate);
  };

  const YEARS = useMemo(() => {
    return Array.from({ length: yearCount }, (_, i) => START_YEAR_AD + i);
  }, [yearCount]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>เลือกวันที่พร้อมอยู่</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={22} />
          </Pressable>
        </View>

        {/* Month & Year Selector */}
        <View style={styles.monthRow}>
          {/* Month */}
          <Pressable
            style={styles.selectorBtn}
            onPress={() => {
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
          >
            <Text style={styles.selectorText}>{MONTHS_TH[month]}</Text>
            <Ionicons name="chevron-down" size={16} />
          </Pressable>

          {/* Year */}
          <Pressable
            style={styles.selectorBtn}
            onPress={() => {
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
          >
            <Text style={styles.selectorText}>{year + 543}</Text>
            <Ionicons name="chevron-down" size={16} />
          </Pressable>
        </View>

        {/* Month Picker */}
        {showMonthPicker && (
          <View style={styles.pickerPanel}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MONTHS_TH.map((m, i) => (
                <Pressable
                  key={m}
                  style={styles.pickerItem}
                  onPress={() => {
                    setMonth(i);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text style={styles.pickerText}>{m}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Year Picker */}
        {showYearPicker && (
          <View style={styles.pickerPanel}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } =
                  nativeEvent;

                const nearBottom =
                  layoutMeasurement.height + contentOffset.y >=
                  contentSize.height - 40;

                if (nearBottom) {
                  setYearCount(prev => prev + YEAR_CHUNK);
                }
              }}
              scrollEventThrottle={16}
            >
              {YEARS.map(y => {
                const active = y === year;
                return (
                  <Pressable
                    key={y}
                    style={[
                      styles.pickerItem,
                      active && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setYear(y);
                      setShowYearPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        active && styles.pickerTextActive,
                      ]}
                    >
                      {y + 543}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Weekdays */}
        <View style={styles.weekRow}>
          {WEEKDAYS.map(d => (
            <Text key={d} style={styles.weekText}>
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isSelected =
              tempDate.getDate() === day &&
              tempDate.getMonth() === month &&
              tempDate.getFullYear() === year;

            return (
              <Pressable
                key={day}
                style={[styles.dayCell, isSelected && styles.dayCellActive]}
                onPress={() => selectDay(day)}
              >
                <Text
                  style={[styles.dayText, isSelected && styles.dayTextActive]}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>ยกเลิก</Text>
          </Pressable>

          <Pressable style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmText}>ตกลง</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
