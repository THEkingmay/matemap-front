import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";

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

const JOBS: Record<TabType, Job[]> = {
  pending: [
    {
      id: "1",
      name: "chang ",
      avatar: "https://i.pravatar.cc/150?img=47",
      type: "ขนย้ายของ",
      date: "23/01/69",
      time: "13.00 น.",
      location: "หอพัก 123",
    },
  ],
  doing: [
    {
      id: "2",
      name: "Chang ",
      avatar: "https://i.pravatar.cc/150?img=47",
      type: "ขนย้ายของ",
      date: "23/01/69",
      time: "13.00 น.",
      location: "หอพัก ABC",
    },
  ],
  done: [
    {
      id: "3",
      name: "Rose",
      avatar: "https://i.pravatar.cc/150?img=32",
      type: "ขนย้ายของ",
      date: "22/01/69",
      time: "14.00 น.",
      location: "หอพัก กฤษ2",
      doneDate: "22/01/69",
      doneTime: "17.00 น.",
    },
  ],
};

export default function WorkHistoryScreen() {
  const [tab, setTab] = useState<TabType>("pending");

  const renderJob = ({ item }: { item: Job }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>ประเภทงาน: {item.type}</Text>
        </View>
      </View>

      {/* Info */}
      <Text style={styles.info}>วันที่จ้าง: {item.date}</Text>
      <Text style={styles.info}>เวลาที่จ้าง: {item.time}</Text>
      <Text style={styles.info}>สถานที่: {item.location}</Text>

      {/* Done info */}
      {tab === "done" && (
        <>
          <Text style={styles.info}>วันที่เสร็จสิ้น: {item.doneDate}</Text>
          <Text style={styles.info}>เวลาที่เสร็จสิ้น: {item.doneTime}</Text>
        </>
      )}

      {/* Actions */}
      {tab === "pending" && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.grayBtn}>
            <Text style={styles.grayText}>ไม่รับงาน</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.blueBtn}>
            <Text style={styles.blueText}>รับงาน</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
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
        data={JOBS[tab]}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

/* ---------- Tab Button ---------- */
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
      style={[styles.tabBtn, active && styles.tabActive]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
  },

  /* Tabs */
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    borderColor: "#1D4ED8",
  },

  tabText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  tabTextActive: {
    color: "#1D4ED8",
  },

  /* Card */
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
    borderColor: "#1D4ED8",
    alignItems: "center",
  },

  blueText: {
    fontWeight: "700",
    color: "#1D4ED8",
  },
});
