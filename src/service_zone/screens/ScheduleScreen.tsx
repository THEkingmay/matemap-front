import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/* ================= CONSTANT ================= */
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* ================= SCREEN ================= */
export default function ScheduleScreen() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(2026);

  // mode: view | edit
  const [mode, setMode] = useState<"view" | "edit">("view");

  // status: available | booked
  const [dayStatus, setDayStatus] = useState<
    Record<number, "available" | "booked">
  >({
    21: "booked",
    22: "booked",
    23: "booked",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const onPressDay = (day: number) => {
    if (mode !== "edit") return;

    setDayStatus((prev) => {
      const current = prev[day];
      if (!current) return { ...prev, [day]: "available" };
      if (current === "available") return { ...prev, [day]: "booked" };

      const clone = { ...prev };
      delete clone[day];
      return clone;
    });
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* ===== BUTTONS ===== */}
      <View style={s.topRow}>
        <TouchableOpacity
          style={[s.topBtn, mode === "view" && s.topBtnActive]}
          onPress={() => setMode("view")}
        >
          <Text style={s.topBtnText}>ตารางงาน</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.topBtn, mode === "edit" && s.topBtnActive]}
          onPress={() => setMode("edit")}
        >
          <Ionicons name="create-outline" size={16} />
          <Text style={s.topBtnText}>แก้ไขตารางงาน</Text>
        </TouchableOpacity>
      </View>

      {/* ===== LEGEND ===== */}
      <View style={s.legendRow}>
        <Legend color="#C62828" label="มีคนจองแล้ว" />
        <Legend color="#2E7D32" label="ว่าง" />
        <Legend color="#E0E0E0" label="ยังไม่ตั้งค่า" />
      </View>

      {/* ===== CALENDAR CARD ===== */}
      <View style={s.card}>
        {/* Header */}
        <View style={s.cardHeader}>
          <View>
            <Text style={s.selectLabel}>Select date</Text>
            <Text style={s.bigDate}>
              {MONTHS[month]} {year}
            </Text>
          </View>
        </View>

        {/* Month Navigation */}
        <View style={s.monthRow}>
          <TouchableOpacity
            onPress={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
          >
            <Ionicons name="chevron-back" size={18} />
          </TouchableOpacity>

          <Text style={s.monthText}>{MONTHS[month]}</Text>

          <TouchableOpacity
            onPress={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
          >
            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>
        </View>

        {/* Day Header */}
        <View style={s.daysHeader}>
          {DAYS.map((d, i) => (
            <Text key={`${d}-${i}`} style={s.dayHeader}>
              {d}
            </Text>
          ))}
        </View>

        {/* Dates */}
        <View style={s.grid}>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const status = dayStatus[day];

            return (
              <TouchableOpacity
                key={day}
                style={[
                  s.dayCell,
                  status === "booked" && s.booked,
                  status === "available" && s.available,
                ]}
                onPress={() => onPressDay(day)}
              >
                <Text
                  style={[
                    s.dayText,
                    status && { color: "#fff", fontWeight: "700" },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= COMPONENTS ================= */
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={s.legendItem}>
      <View style={[s.legendDot, { backgroundColor: color }]} />
      <Text style={s.legendText}>{label}</Text>
    </View>
  );
}

/* ================= STYLES ================= */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },

  topRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  topBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
  },

  topBtnActive: {
    backgroundColor: "#E3F2FD",
  },

  topBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },

  legendRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  legendText: {
    fontSize: 12,
    color: "#444",
  },

  card: {
    backgroundColor: "#EDE7F6",
    borderRadius: 20,
    padding: 16,
  },

  cardHeader: {
    marginBottom: 12,
  },

  selectLabel: {
    fontSize: 12,
    color: "#555",
  },

  bigDate: {
    fontSize: 30,
    fontWeight: "700",
  },

  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },

  monthText: {
    fontSize: 18,
    fontWeight: "600",
  },

  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dayHeader: {
    width: "14%",
    textAlign: "center",
    fontSize: 12,
    color: "#555",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  dayCell: {
    width: "14%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginVertical: 4,
    backgroundColor: "#E0E0E0",
  },

  available: {
    backgroundColor: "#2E7D32",
  },

  booked: {
    backgroundColor: "#C62828",
  },

  dayText: {
    fontSize: 14,
  },
});
