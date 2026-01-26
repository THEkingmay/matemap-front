import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/* ================= CONSTANT ================= */
const DAYS_HEADER = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

type DayInfo = {
  status: "available" | "unavailable";
  note?: string;
  bookingBy?: string;
};

/* ================= SCREEN ================= */
export default function ScheduleScreen() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(2026);

  const [tab, setTab] = useState<"view" | "manage">("view");

  const [data, setData] = useState<Record<number, DayInfo>>({
    17: { status: "unavailable", note: "มีลูกค้าจองแล้ว" },
    21: { status: "unavailable", note: "งานย้ายหอ", bookingBy: "Pun Pun" },
    22: { status: "available", note: "ว่างทั้งวัน" },
  });

  const [selectedDay, setSelectedDay] = useState<number | null>(22);
  const [tempStatus, setTempStatus] =
    useState<DayInfo["status"]>("available");
  const [tempNote, setTempNote] = useState("");
  const [tempBy, setTempBy] = useState("");
  const [showModal, setShowModal] = useState(false);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getWeekday = (day: number) =>
    DAYS_FULL[new Date(year, month, day).getDay()];

  const openDay = (day: number) => {
    const existing = data[day];
    setSelectedDay(day);
    setTempStatus(existing?.status ?? "available");
    setTempNote(existing?.note ?? "");
    setTempBy(existing?.bookingBy ?? "");
    setShowModal(true);
  };

  const saveDay = () => {
    if (!selectedDay) return;

    setData((prev) => ({
      ...prev,
      [selectedDay]: {
        status: tempStatus,
        note: tempNote,
        bookingBy: tempBy,
      },
    }));

    setShowModal(false);
  };

  const changeMonth = (dir: "prev" | "next") => {
    if (dir === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else setMonth(month - 1);
    } else {
      if (month === 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else setMonth(month + 1);
    }
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* ===== TABS ===== */}
      <View style={s.tabs}>
        <TabButton
          title="ตารางงาน"
          icon="calendar-outline"
          active={tab === "view"}
          onPress={() => setTab("view")}
        />
        <TabButton
          title="จัดการตารางงาน"
          icon="create-outline"
          active={tab === "manage"}
          onPress={() => setTab("manage")}
        />
      </View>

      {/* ===== CALENDAR ===== */}
      <View style={s.card}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.select}>Select date</Text>
            {selectedDay && (
              <Text style={s.bigDate}>
                {getWeekday(selectedDay)}, {MONTHS[month].slice(0, 3)}{" "}
                {selectedDay}
              </Text>
            )}
          </View>
          <Ionicons name="calendar" size={20} />
        </View>

        <View style={s.divider} />

        {/* Month / Year */}
        <View style={s.monthRow}>
          <TouchableOpacity onPress={() => changeMonth("prev")}>
            <Ionicons name="chevron-back" size={18} />
          </TouchableOpacity>

          <Text style={s.monthText}>
            {MONTHS[month]} {year}
          </Text>

          <TouchableOpacity onPress={() => changeMonth("next")}>
            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>
        </View>

        {/* Day header */}
        <View style={s.daysHeader}>
          {DAYS_HEADER.map((d, i) => (
            <Text key={i} style={s.dayHeader}>{d}</Text>
          ))}
        </View>

        {/* Dates */}
        <View style={s.grid}>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const info = data[day];

            const canPress =
              tab === "manage" ||
              info?.status === "available" ||
              info?.status === "unavailable";

            return (
              <TouchableOpacity
                key={day}
                activeOpacity={canPress ? 0.7 : 1}
                style={[
                  s.dayCell,
                  info?.status === "available" && s.available,
                  info?.status === "unavailable" && s.unavailable,
                ]}
                onPress={() => {
                  if (canPress) openDay(day);
                }}
              >
                <Text
                  style={[
                    s.dayText,
                    info && { color: "#FFFFFF", fontWeight: "700" },
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ===== MODAL ===== */}
      <Modal transparent visible={showModal} animationType="slide">
        <View style={s.overlay}>
          <View style={s.modal}>
            {selectedDay && (
              <>
                <Text style={s.modalSelect}>Select date</Text>
                <Text style={s.modalBig}>
                  {getWeekday(selectedDay)}, {MONTHS[month]} {selectedDay} {year}
                </Text>
              </>
            )}

            {tab === "view" && (
              <>
                <InfoRow
                  label="สถานะ"
                  value={tempStatus === "available" ? "ว่าง" : "ไม่ว่าง"}
                />
                {tempBy !== "" && <InfoRow label="ผู้จอง" value={tempBy} />}
                {tempNote !== "" && <InfoRow label="รายละเอียด" value={tempNote} />}
              </>
            )}

            {tab === "manage" && (
              <>
                <View style={s.statusRow}>
                  <StatusBtn
                    label="ว่าง"
                    active={tempStatus === "available"}
                    color="#2E7D32"
                    onPress={() => setTempStatus("available")}
                  />
                  <StatusBtn
                    label="ไม่ว่าง"
                    active={tempStatus === "unavailable"}
                    color="#C62828"
                    onPress={() => setTempStatus("unavailable")}
                  />
                </View>

                <TextInput
                  placeholder="ชื่อผู้จอง"
                  value={tempBy}
                  onChangeText={setTempBy}
                  style={s.input}
                />

                <TextInput
                  placeholder="รายละเอียด"
                  value={tempNote}
                  onChangeText={setTempNote}
                  style={s.input}
                  multiline
                />
              </>
            )}

            <View style={s.actionRow}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={s.cancel}>ปิด</Text>
              </TouchableOpacity>
              {tab === "manage" && (
                <TouchableOpacity onPress={saveDay}>
                  <Text style={s.save}>บันทึก</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

/* ================= COMPONENTS ================= */
function TabButton({ title, icon, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.tabBtn, active && s.tabActive]}
    >
      <Ionicons name={icon} size={16} color={active ? "#2563EB" : "#6B7280"} />
      <Text style={[s.tabText, active && s.tabTextActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

function StatusBtn({ label, active, color, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.statusBtn, active && { backgroundColor: color }]}
    >
      <Text style={[s.statusText, active && { color: "#fff" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 12, color: "#6B7280" }}>{label}</Text>
      <Text style={{ fontSize: 15, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}

/* ================= STYLES ================= */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 16 },

  tabs: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  tabBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 12,
  },

  tabActive: { backgroundColor: "#EEF2FF" },

  tabText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#2563EB" },

  card: {
    backgroundColor: "#e0d8e8e7",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  header: { flexDirection: "row", justifyContent: "space-between" },
  select: { fontSize: 12, color: "#6B7280" },
  bigDate: { fontSize: 30, fontWeight: "700" },

  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 8 },

  monthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  monthText: { fontSize: 14, fontWeight: "500" },

  daysHeader: { flexDirection: "row", justifyContent: "space-between" },
  dayHeader: { width: "14%", textAlign: "center", fontSize: 12 },

  grid: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },

  dayCell: {
    width: "14%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    marginVertical: 4,
    
  },

  available: { backgroundColor: "#2E7D32" },
  unavailable: { backgroundColor: "#C62828" },

  dayText: { fontSize: 14 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  modalSelect: { fontSize: 12, color: "#6B7280" },
  modalBig: { fontSize: 24, fontWeight: "700", marginBottom: 12 },

  statusRow: { flexDirection: "row", gap: 12, marginBottom: 12 },

  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },

  statusText: { fontSize: 14, fontWeight: "600" },

  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  actionRow: { flexDirection: "row", justifyContent: "space-between" },

  cancel: { fontSize: 14, color: "#6B7280" },
  save: { fontSize: 14, fontWeight: "700", color: "#2563EB" },
});
