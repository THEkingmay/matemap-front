import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../AuthProvider";
import { workStyles as styles } from "../styles/work.styles";
import { FONT } from "../../../../../constant/theme";


/* ================= TYPES ================= */
type HistoryStatus = "done" | "rejected";
type FilterType = "all" | "done" | "rejected";

type HistoryItem = {
  id: string;
  destination_location: string;
  start_location?: string;
  detail?: string;
  start_date: string;
  end_date: string;
  status: HistoryStatus;

  customer?: {
    user_detail?: {
      name?: string;
      image_url?: string;
      tel?: string;
    };
  };

  service?: {
    name?: string;
  };
};

/* ================= MAIN ================= */
export default function HistoryScreen() {
  const { user, token } = useAuth();

  const [data, setData] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  /* ================= FETCH ================= */
  const fetchHistory = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-history/provider/${user?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();

      const historyOnly = json.filter(
        (i: HistoryItem) =>
          i.status === "done" || i.status === "rejected"
      );

      setData(historyOnly);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((i) => i.status === filter);
  }, [data, filter]);

  /* ================= RENDER ================= */
  const renderItem = ({ item }: { item: HistoryItem }) => {
    const statusMap = {
      done: { label: "สำเร็จ", color: "#22C55E" },
      rejected: { label: "ปฏิเสธ", color: "#EF4444" },
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
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      {/* FILTER BAR */}
      <FilterBar value={filter} onChange={setFilter} />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredData}
        keyExtractor={(i) => i.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchHistory}
          />
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            ไม่พบประวัติในสถานะนี้
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
        label="สำเร็จ"
        active={value === "done"}
        onPress={() => onChange("done")}
      />
      <FilterButton
        label="ปฏิเสธ"
        active={value === "rejected"}
        onPress={() => onChange("rejected")}
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

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   serviceName: {
//     fontSize: 14,
//     color: "#64748B",
//     fontWeight: "600",
//   },

//   destination: {
//     fontSize: 17,
//     fontWeight: "800",
//     color: "#0F172A",
//     marginTop: 2,
//   },

//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },

//   routeBox: {
//     marginTop: 12,
//     backgroundColor: "#F8FAFC",
//     padding: 12,
//     borderRadius: 14,
//   },

//   routeLabel: {
//     fontSize: 12,
//     color: "#94A3B8",
//   },

//   routeText: {
//     fontWeight: "600",
//     color: "#334155",
//   },

//   customerBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 14,
//     gap: 12,
//   },

//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//   },

//   customerName: {
//     fontWeight: "700",
//     color: "#0F172A",
//   },

//   telText: {
//     marginTop: 4,
//     fontSize: 13,
//     color: "#475569",
//   },

//   timeRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 14,
//   },

//   infoBox: {
//     flex: 1,
//     backgroundColor: "#F1F5F9",
//     padding: 10,
//     borderRadius: 12,
//   },

//   infoLabel: {
//     fontSize: 12,
//     color: "#64748B",
//   },

//   infoValue: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#0F172A",
//     marginTop: 2,
//   },

//   detail: {
//     marginTop: 12,
//     color: "#475569",
//     lineHeight: 20,
//   },

//   filterBar: {
//     flexDirection: "row",
//     backgroundColor: "#F1F5F9",
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
//     backgroundColor: "#fff",
//     shadowOpacity: 0.08,
//     elevation: 2,
//   },

//   empty: {
//     textAlign: "center",
//     marginTop: 40,
//     color: "#64748B",
//   },
// });
