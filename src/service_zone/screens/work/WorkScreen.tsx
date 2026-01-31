import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
  LayoutAnimation, // ✅ 1. เรียกใช้ LayoutAnimation
  Platform,
  UIManager,
} from "react-native";

/* ================== CONFIG ================== */
// ✅ 2. เปิดใช้งาน LayoutAnimation สำหรับ Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

/* ================== HELPER FUNCTIONS ================== */
const getCurrentTimestamp = () => {
  const now = new Date();
  const date = now.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const time = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time: `${time} น.` };
};

/* ================== ANIMATED DOTS ================== */
function AnimatedDots() {
  const anim = useRef(new Animated.Value(0)).current;
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = anim.addListener(({ value }) => {
      setCount(Math.floor(value));
    });

    Animated.loop(
      Animated.timing(anim, {
        toValue: 4,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();

    return () => anim.removeListener(id);
  }, []);

  return (
    <View style={s.dotsWrapper}>
      <Text style={[s.dots, s.dotsGhost]}>...</Text>
      <Text style={[s.dots, s.dotsActive]}>{".".repeat(count)}</Text>
    </View>
  );
}

/* ================== CHECKMARK (BUTTON) ================== */
function CheckmarkBounce({ active }: { active: boolean }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.2,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0);
      opacity.setValue(0);
    }
  }, [active]);

  return (
    <Animated.Text style={[s.checkmark, { opacity, transform: [{ scale }] }]}>
      ✓
    </Animated.Text>
  );
}

/* ================== CHECKMARK (TAB) ================== */
function TabCheckmark({ visible }: { visible: boolean }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.Text style={[s.tabCheck, { transform: [{ scale }] }]}>
      ✓
    </Animated.Text>
  );
}

/* ================== TAB BUTTON (OPTIMIZED) ================== */
// ✅ 3. ลบ Animated ออกจาก TabButton เพื่อลดภาระเครื่อง
// เราจะใช้ LayoutAnimation จาก Parent แทน
function TabButton({
  title,
  active,
  loading,
  showCheck,
  onPress,
}: {
  title: string;
  active: boolean;
  loading?: boolean;
  showCheck?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      // เปลี่ยนค่า flex ตรงๆ (การ Animation จะถูกจัดการโดย Parent)
      style={[s.tabBtn, { flex: active ? 1.4 : 1 }, active && s.tabActive]}
      activeOpacity={0.8}
    >
      <View style={s.tabInner}>
        <Text style={[s.tabText, active && s.tabTextActive]}>{title}</Text>
        {loading && <AnimatedDots />}
        {showCheck && <TabCheckmark visible />}
      </View>
    </TouchableOpacity>
  );
}

/* ================== SCREEN ================== */
export default function WorkScreen() {
  const [tab, setTab] = useState<TabType>("pending");
  const [finishingJobId, setFinishingJobId] = useState<string | null>(null);
  const [showDoneCheck, setShowDoneCheck] = useState(false);

  useEffect(() => {
    if (!showDoneCheck) return;
    const timer = setTimeout(() => {
      setShowDoneCheck(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [showDoneCheck]);

  // ✅ 4. ฟังก์ชันเปลี่ยนแท็บแบบ Smooth (Native Animation)
  const handleTabChange = (newTab: TabType) => {
    // สั่งให้ UI ทั้งหน้าขยับแบบ Spring โดยใช้ Native Driver (ลื่นมาก)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setTab(newTab);
  };

  const [pendingJobs, setPendingJobs] = useState<Job[]>([
    {
      id: "1",
      name: "Game",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRHgTK1cF8h1xRPcTqlaFiC01wyoTe6yzWSQ&s",
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
      avatar:
        "https://i.pinimg.com/originals/10/ff/2f/10ff2fc7c2c8a34491c1b7a3a401f3f4.jpg",
      type: "ทำความสะอาด",
      date: "24/01/69",
      time: "09.00 น.",
      location: "ดีคอนโด",
    },
  ]);

  const [doingJobs, setDoingJobs] = useState<Job[]>([]);
  const [doneJobs, setDoneJobs] = useState<Job[]>([]);

  const currentJobs =
    tab === "pending" ? pendingJobs : tab === "doing" ? doingJobs : doneJobs;

  const renderJob = useCallback(
    ({ item }: { item: Job }) => {
      const isFinishingThisJob = finishingJobId === item.id;

      return (
        <View style={s.card}>
          <View style={s.headerRow}>
            <Image source={{ uri: item.avatar }} style={s.avatar} />
            <View>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.type}>ประเภทงาน: {item.type}</Text>
            </View>
          </View>

          <Text style={s.info}>วันที่: {item.date}</Text>
          <Text style={s.info}>เวลา: {item.time}</Text>
          <Text style={s.info}>สถานที่: {item.location}</Text>

          {tab === "done" && (
            <View style={s.doneBadge}>
              <Text style={s.doneTextInfo}>
                เสร็จเมื่อ: {item.doneDate} {item.doneTime}
              </Text>
            </View>
          )}

          {tab === "pending" && (
            <View style={s.actionRow}>
              <TouchableOpacity
                style={s.grayBtn}
                onPress={() =>
                  setPendingJobs((p) => p.filter((j) => j.id !== item.id))
                }
              >
                <Text style={s.grayText}>ไม่รับงาน</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.blueBtn}
                onPress={() => {
                  setPendingJobs((p) => p.filter((j) => j.id !== item.id));
                  setDoingJobs((p) => [...p, item]);
                  handleTabChange("doing"); // ✅ ใช้ฟังก์ชันใหม่
                }}
              >
                <Text style={s.blueText}>รับงาน</Text>
              </TouchableOpacity>
            </View>
          )}

          {tab === "doing" && (
            <TouchableOpacity
              style={s.greenBtn}
              activeOpacity={0.9}
              disabled={finishingJobId !== null}
              onPress={() => {
                setFinishingJobId(item.id);

                setTimeout(() => {
                  setFinishingJobId(null);
                  const { date, time } = getCurrentTimestamp();

                  setDoingJobs((p) => p.filter((j) => j.id !== item.id));
                  setDoneJobs((p) => [
                    ...p,
                    { ...item, doneDate: date, doneTime: time },
                  ]);
                  setShowDoneCheck(true);
                  handleTabChange("done"); // ✅ ใช้ฟังก์ชันใหม่
                }, 700);
              }}
            >
              <View style={s.doneBtnInner}>
                {!isFinishingThisJob ? (
                  <Text style={s.greenText}>เสร็จงาน</Text>
                ) : (
                  <CheckmarkBounce active />
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [tab, finishingJobId],
  );

  return (
    <View style={s.container}>
      <View style={s.tabs}>
        <TabButton
          title="การรับงาน"
          active={tab === "pending"}
          onPress={() => handleTabChange("pending")} // ✅ ใช้ฟังก์ชันใหม่
        />
        <TabButton
          title="กำลังดำเนินการ"
          active={tab === "doing"}
          loading={tab === "doing"}
          onPress={() => handleTabChange("doing")} // ✅ ใช้ฟังก์ชันใหม่
        />
        <TabButton
          title="งานสำเร็จ"
          active={tab === "done"}
          showCheck={showDoneCheck}
          onPress={() => handleTabChange("done")} // ✅ ใช้ฟังก์ชันใหม่
        />
      </View>

      <FlatList
        data={currentJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        removeClippedSubviews={true}
        initialNumToRender={5}
        windowSize={10}
        ListEmptyComponent={<Text style={s.empty}>ไม่มีรายการงาน</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 50, // ✅ ขยับ Tab ลงมาจากขอบบนมากขึ้น (จากเดิม 20)
    gap: 8,
    backgroundColor: "#F1F5F9",
    padding: 4,
    borderRadius: 30,
  },
  tabBtn: {
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#2563EB", // ✅ ปรับสี Text ให้เข้ากับธีมเขียว
    fontWeight: "700",
  },
  tabCheck: {
    marginLeft: 4,
    fontSize: 14,
    color: "#10B981",
  },
  dotsWrapper: {
    marginLeft: 4,
  },
  dots: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2563EB",
  },
  dotsGhost: { opacity: 0 },
  dotsActive: { position: "absolute", left: 0, top: 0 },

  /* CARD DESIGN */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#475569",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "center", // ✅ จัดเนื้อหาใน Card ให้อยู่ตรงกลางทั้งหมด
  },
  headerRow: {
    alignItems: "center", // ✅ จัด Profile และชื่อให้อยู่ตรงกลาง
    marginBottom: 16,
    width: '100%',
  },
  avatar: {
    width: 70, // ✅ ปรับขนาดให้ใหญ่ขึ้นเล็กน้อยเพื่อให้ดูเป็นจุดเด่น
    height: 70,
    borderRadius: 35, // ✅ ปรับเป็นวงกลมเป๊ะๆ
    marginBottom: 12,
    backgroundColor: "#E2E8F0",
    borderWidth: 3,
    borderColor: "#F8FAFC",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center", // ✅ ชื่ออยู่ตรงกลาง
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: "#2563EB", // ✅ ใช้สีเขียวให้เข้ากับปุ่ม
    fontWeight: "600",
    textAlign: "center",
  },
  info: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
    fontWeight: "500",
    textAlign: "center", // ✅ ข้อมูลวันเวลาอยู่ตรงกลาง
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12,
    width: '100%',
  },
  grayBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  grayText: {
    fontWeight: "600",
    color: "#94A3B8",
  },
  blueBtn: { // 🟢 ปุ่ม "รับงาน" (ตอนนี้เปลี่ยนเป็นสีเขียวตามสั่ง)
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#10B981", 
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  blueText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  greenBtn: { // 🟢 ปุ่ม "เสร็จงาน"
    marginTop: 20,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#10B981",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  doneBtnInner: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  greenText: {
    fontWeight: "700",
    color: "#FFFFFF",
    fontSize: 16,
  },
  checkmark: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  empty: {
    textAlign: "center",
    marginTop: 80,
    color: "#94A3B8",
    fontSize: 16,
  },
  doneBadge: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  doneTextInfo: {
    color: "#10B981",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
});