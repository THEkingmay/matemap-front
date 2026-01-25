import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

/* ================== TYPES ================== */
type TabType = "pending" | "doing" | "done";

type Job = {
  id: string;
  name: string;
  avatar: string;
  type: string;
  date: string;
  time: string;
  location: string;
  doneDate?: string;
  doneTime?: string;
};

/* ================== SCREEN ================== */
export default function WorkScreen() {
  const [tab, setTab] = useState<TabType>("pending");

  const [pendingJobs, setPendingJobs] = useState<Job[]>([
    {
      id: "1",
      name: "Game",
      avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRHgTK1cF8h1xRPcTqlaFiC01wyoTe6yzWSQ&s",
      type: "ขนย้ายของ",
      date: "23/01/69",
      time: "13.00 น.",
      location: "หอพัก ABC",
    },
    {
      id: "2",
      name: "เฟรชชี่",
      avatar: "https://f.ptcdn.info/925/064/000/puf5ih6zqr441VIKmES-o.jpg",
      type: "ทำความสะอาด",
      date: "25/01/69",
      time: "10.00 น.",
      location: "เดอะมิ้ว",
    },
    {
      id: "3",
      name: "Rose",
      avatar: "https://i.pinimg.com/originals/10/ff/2f/10ff2fc7c2c8a34491c1b7a3a401f3f4.jpg",
      type: "ทำความสะอาด",
      date: "24/01/69",
      time: "09.00 น.",
      location: "ดีคอนโด",
    },
  ]);

  const [doingJobs, setDoingJobs] = useState<Job[]>([]);
  const [doneJobs, setDoneJobs] = useState<Job[]>([]);

  const currentJobs =
    tab === "pending"
      ? pendingJobs
      : tab === "doing"
      ? doingJobs
      : doneJobs;

  /* ================== RENDER JOB ================== */
  const renderJob = ({ item }: { item: Job }) => (
    <View style={s.card}>
      {/* Header */}
      <View style={s.headerRow}>
        <Image source={{ uri: item.avatar }} style={s.avatar} />
        <View>
          <Text style={s.name}>{item.name}</Text>
          <Text style={s.type}>ประเภทงาน: {item.type}</Text>
        </View>
      </View>

      {/* Info */}
      <Text style={s.info}>วันที่: {item.date}</Text>
      <Text style={s.info}>เวลา: {item.time}</Text>
      <Text style={s.info}>สถานที่: {item.location}</Text>

      {/* DONE INFO */}
      {tab === "done" && (
        <>
          <Text style={s.info}>วันที่เสร็จ: {item.doneDate}</Text>
          <Text style={s.info}>เวลาที่เสร็จ: {item.doneTime}</Text>
        </>
      )}

      {/* ACTIONS */}
      {tab === "pending" && (
        <View style={s.actionRow}>
          <TouchableOpacity
            style={s.grayBtn}
            onPress={() =>
              setPendingJobs(prev => prev.filter(j => j.id !== item.id))
            }
          >
            <Text style={s.grayText}>ไม่รับงาน</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.blueBtn}
            onPress={() => {
              setPendingJobs(prev => prev.filter(j => j.id !== item.id));
              setDoingJobs(prev => [...prev, item]);
              setTab("doing"); // 👈 เด้งไปหน้ากำลังดำเนินการ
            }}
          >
            <Text style={s.blueText}>รับงาน</Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === "doing" && (
        <TouchableOpacity
          style={s.greenBtn}
          onPress={() => {
            setDoingJobs(prev => prev.filter(j => j.id !== item.id));
            setDoneJobs(prev => [
              ...prev,
              {
                ...item,
                doneDate: "24/01/69",
                doneTime: "17.00 น.",
              },
            ]);
            setTab("done");
          }}
        >
          <Text style={s.greenText}>เสร็จงาน</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={s.container}>
      {/* TABS */}
      <View style={s.tabs}>
        <TabButton
          title="การรับงาน"
          active={tab === "pending"}
          onPress={() => setTab("pending")}
        />
        <TabButton
          title="กำลังดำเนินการ"
          active={tab === "doing"}
          onPress={() => setTab("doing")}
        />
        <TabButton
          title="งานสำเร็จ"
          active={tab === "done"}
          onPress={() => setTab("done")}
        />
      </View>

      <FlatList
        data={currentJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={s.empty}>ไม่มีรายการงาน</Text>
        }
      />
    </View>
  );
}

/* ================== TAB BUTTON ================== */
function TabButton({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.tabBtn, active && s.tabActive]}
    >
      <Text style={[s.tabText, active && s.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

/* ================== STYLES ================== */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 16,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },

  tabActive: {
    borderColor: "#2563EB",
  },

  tabText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  tabTextActive: {
    color: "#2563EB",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  type: {
    fontSize: 13,
    color: "#6B7280",
  },

  info: {
    fontSize: 13,
    marginTop: 4,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },

  grayBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },

  grayText: {
    fontWeight: "600",
    color: "#6B7280",
  },

  blueBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2563EB",
    alignItems: "center",
  },

  blueText: {
    fontWeight: "700",
    color: "#2563EB",
  },

  greenBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#22C55E",
    alignItems: "center",
  },

  greenText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#9CA3AF",
  },
});
