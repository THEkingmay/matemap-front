import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../AuthProvider";
import { FONT } from "../../../../../constant/theme";
import { workStyles as styles} from "../styles/work.styles";

/* ================= TYPES ================= */
type WorkStatus = "pending" | "accepted";
type FilterType = "all" | "pending" | "accepted";

type WorkItem = {
  id: string;
  start_location?: string;
  destination_location: string;
  detail?: string;
  start_date: string;
  end_date: string;
  status: WorkStatus;

  customer?: {
    user_detail?: {
      name?: string;
      image_url?: string;
      faculty?: string;
      major?: string;
      tel?: string;
    };
  };

  service?: {
    name?: string;
  };
};

/* ================= MAIN ================= */
export default function ActiveWorkScreen() {
  const { user, token } = useAuth();

  const [data, setData] = useState<WorkItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  /* ================= FETCH ================= */
  const fetchWork = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-history/provider/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();

      const usable = json.filter(
        (i: WorkItem) =>
          i.status === "pending" || i.status === "accepted"
      );

      setData(usable);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    fetchWork();
  }, []);

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((i) => i.status === filter);
  }, [data, filter]);

  /* ================= ACTION ================= */
  const updateStatus = async (
    history_id: string,
    action: "accepted" | "rejected"
  ) => {
    try {
      setLoadingId(history_id);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-history/provider/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ history_id, action }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        Alert.alert("ผิดพลาด", json.message || "ไม่สามารถดำเนินการได้");
        return;
      }

      fetchWork();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= RENDER ITEM ================= */
  const renderItem = ({ item }: { item: WorkItem }) => {
    const isLoading = loadingId === item.id;

    const statusMap = {
      pending: { label: "รอตอบรับ", color: "#F59E0B" ,fontFamily: FONT.BOLD,},
      accepted: { label: "กำลังดำเนินการ", color: "#22C55E" ,fontFamily: FONT.BOLD,},
    };

    const status = statusMap[item.status];

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.serviceName}>
              # {item.service?.name || "บริการ"}
            </Text>
            <Text style={styles.destination}>
              📍 {item.destination_location}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${status.color}20` },
            ]}
          >
            <Text style={{ color: status.color, fontFamily: FONT.BOLD}}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* ROUTE */}
        <View style={styles.routeBox}>
          <Text style={styles.routeLabel}>จาก</Text>
          <Text style={styles.routeText}>{item.start_location || "-"}</Text>

          <Text style={[styles.routeLabel, { marginTop: 6 }]}>ไป</Text>
          <Text style={styles.routeText}>{item.destination_location}</Text>
        </View>

        {/* CUSTOMER */}
        <View style={styles.customerBox}>
          <Image
            source={{
              uri:
                item.customer?.user_detail?.image_url ||
                "https://i.pravatar.cc/100",
            }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.customerName}>
              {item.customer?.user_detail?.name || "-"}
            </Text>
             <Text style={styles.telText}>
              Tel: {item.customer?.user_detail?.tel || "ไม่มีเบอร์ติดต่อ"}
            </Text>
          </View>
        </View>

        {/* TIME */}
        <View style={styles.timeRow}>
          <InfoBox label="เริ่มงาน" value={formatDate(item.start_date)} />
          <InfoBox label="สิ้นสุด" value={formatDate(item.end_date)} />
        </View>

        {/* DETAIL */}
        {item.detail && (
          <Text style={styles.detail}>📝 {item.detail}</Text>
        )}

        {/* ACTION */}
        <View style={styles.actionRow}>
          {item.status === "pending" && (
            <>
              <ActionButton
                label="รับงาน"
                color="#22C55E"
                loading={isLoading}
                onPress={() => updateStatus(item.id, "accepted")}
              />
              <ActionButton
                label="ปฏิเสธ"
                color="#EF4444"
                loading={isLoading}
                onPress={() => updateStatus(item.id, "rejected")}
              />
            </>
          )}

          {item.status === "accepted" && (
            <ActionButton
              label="ยกเลิกรับงาน"
              color="#EF4444"
              loading={isLoading}
              onPress={() => updateStatus(item.id, "rejected")}
              full
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FilterBar value={filter} onChange={setFilter} />

      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        data={filteredData}
        keyExtractor={(i) => i.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchWork} />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            ไม่พบงานในสถานะนี้
          </Text>
        }
      />
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */
function FilterBar({
  value,
  onChange,
}: {
  value: FilterType;
  onChange: (v: FilterType) => void;
}) {
  return (
    <View style={styles.filterBar}>
      <FilterButton
        label="ทั้งหมด"
        active={value === "all"}
        onPress={() => onChange("all")}
      />
      <FilterButton
        label="รอตอบรับ"
        active={value === "pending"}
        onPress={() => onChange("pending")}
      />
      <FilterButton
        label="กำลังดำเนินการ"
        active={value === "accepted"}
        onPress={() => onChange("accepted")}
      />
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterBtn,
        active && styles.filterBtnActive,
      ]}
    >
      <Text
        style={{
          fontFamily: FONT.BOLD,
          color: active ? "#ffffff" : "#64748B",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ActionButton({
  label,
  color,
  onPress,
  loading,
  full,
}: {
  label: string;
  color: string;
  onPress: () => void;
  loading?: boolean;
  full?: boolean;
}) {
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={onPress}
      style={{
        flex: full ? 1 : 1,
        backgroundColor: color,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.actionText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ================= STYLES ================= */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingBottom: 100
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 24,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 14,
//     elevation: 4,
//   },
//   header: { flexDirection: "row", justifyContent: "space-between" },
//   serviceName: { fontSize: 18, fontFamily: FONT.BOLD, color: "#64748B", },
//   destination: {
//     fontSize: 17,
//     fontFamily: FONT.BOLD,
//     color: "#0F172A",
//     marginTop: 2,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   routeBox: {
//     marginTop: 12,
//     backgroundColor: "#F8FAFC",
//     padding: 12,
//     borderRadius: 14,
//   },
//   routeLabel: { fontSize: 12, fontFamily: FONT.REGULAR, color: "#94A3B8" },
//   routeText: { fontFamily: FONT.BOLD, color: "#334155" },
//   customerBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 14,
//     gap: 12,
//   },
//   avatar: { width: 44, height: 44, borderRadius: 22 },
//   customerName: { fontFamily: FONT.BOLD, color: "#0F172A" },
//   customerMeta: { fontSize: 12, fontFamily: FONT.REGULAR, color: "#64748B" },
//   callBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#EFF6FF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   timeRow: { flexDirection: "row", gap: 10, marginTop: 14 },
//   detail: { marginTop: 12, color: "#475569", lineHeight: 20 },
//   actionRow: { flexDirection: "row", gap: 10, marginTop: 16 },
//   filterBar: {
//     flexDirection: "row",
//     backgroundColor: "#e9e9e9",
//     margin: 16,
//     borderRadius: 14,
//     padding: 4,
//   },
//   filterBtn: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   filterBtnActive: {
//     backgroundColor: MainColor,
//     shadowOpacity: 0.08,
//     elevation: 2,
//   },
//   infoBox: {
//     flex: 1,
//     backgroundColor: "#F1F5F9",
//     padding: 10,
//     borderRadius: 12,
//   },
//   infoLabel: { fontSize: 12, fontFamily: FONT.REGULAR, color: "#64748B" },
//   infoValue: {
//     fontSize: 13,
//     fontFamily: FONT.BOLD,
//     color: "#0F172A",
//     marginTop: 2,
//   },
//   telText: {
//     marginTop: 4,
//     fontSize: 13,
//     color: "#475569",
//     fontFamily: FONT.REGULAR,
//   },
// });
