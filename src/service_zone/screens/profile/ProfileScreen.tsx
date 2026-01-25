import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import LogoutButton from "../../components/LogoutButton";
import { useAuth } from "../../../AuthProvider";


export default function ProfileScreen() {
  const [isEdit, setIsEdit] = useState(false);
  const { logout } = useAuth();
  const [user, setUser] = useState({
    name: "มาร์โอ้",
    phone: "099 999 9999",
    vehicle: "2กข 5555 Toyota Revo",
    rating: 5.0,
    avatar:
      "https://s.isanook.com/wo/0/ui/22/110165/eaa62bb1887103defc051486d0e8f20b_1527227051.jpg",
    jobType: "ขนของ/ย้ายของ",
  });

  const handleLogout = () => {
    Alert.alert(
      "ออกจากระบบ",
      "คุณต้องการออกจากระบบใช่หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "ใช่, ออกจากระบบ", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Header ===== */}
        <View style={s.headerRow}>
          {isEdit ? (
            <TouchableOpacity onPress={() => setIsEdit(false)}>
              <Text style={s.cancel}>ยกเลิก</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {!isEdit && (
            <TouchableOpacity
              style={s.editBtn}
              onPress={() => setIsEdit(true)}
            >
              <Ionicons name="create-outline" size={18} color="#2563EB" />
              <Text style={s.editText}>แก้ไข</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ===== Avatar ===== */}
        <View style={s.avatarWrapper}>
          <Image source={{ uri: user.avatar }} style={s.avatar} />
          {isEdit && (
            <TouchableOpacity style={s.camera}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* ===== VIEW MODE ===== */}
        {!isEdit && (
          <>
            <Text style={s.name}>{user.name}</Text>

            <View style={s.ratingRow}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={s.ratingText}>{user.rating.toFixed(1)}</Text>
            </View>

            {/* ===== Vehicle Plate ===== */}
            <View style={s.vehicleRow}>
              <Ionicons name="car-outline" size={16} color="#6B7280" />
              <Text style={s.vehicleText}>{user.vehicle}</Text>
            </View>

            <View style={s.statRow}>
              <StatBox title="งานที่รับ" value="5" />
              <StatBox title="งานสำเร็จ" value="5" />
            </View>

            <View style={s.reviewCard}>
              <Text style={s.reviewTitle}>รีวิวจากผู้จ้าง (1)</Text>

              <View style={s.reviewItem}>
                <Image
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSKdMDtiohdnWlMxTRrz5Ghpcqk5IXJVS8RQ&s",
                  }}
                  style={s.reviewAvatar}
                />
                <View>
                  <Text style={s.reviewName}>Rose</Text>
                  <Text style={s.reviewText}>
                    ขนย้ายของอย่างระมัดระวัง ตรงต่อเวลา
                  </Text>
                  <Text style={s.reviewStar}>★★★★★</Text>
                </View>
              </View>
            </View>
            <LogoutButton onLogout={handleLogout} />
          </>
        )}

        {/* ===== EDIT MODE ===== */}
        {isEdit && (
          <View style={s.form}>
            <Label title="ชื่อผู้ใช้งาน" />
            <TextInput
              value={user.name}
              style={s.input}
              onChangeText={(t) => setUser({ ...user, name: t })}
            />

            <Label title="เบอร์โทร" />
            <TextInput
              value={user.phone}
              style={s.input}
              keyboardType="phone-pad"
              onChangeText={(t) => setUser({ ...user, phone: t })}
            />

            <Label title="ทะเบียนรถ" />
            <TextInput
              value={user.vehicle}
              style={s.input}
              onChangeText={(t) => setUser({ ...user, vehicle: t })}
            />

            <Label title="ประเภทงานที่รับ" />
            <Radio
              label="ขนของ/ย้ายของ"
              active={user.jobType === "ขนของ/ย้ายของ"}
              onPress={() =>
                setUser({ ...user, jobType: "ขนของ/ย้ายของ" })
              }
            />
            <Radio
              label="ทำความสะอาด"
              active={user.jobType === "ทำความสะอาด"}
              onPress={() =>
                setUser({ ...user, jobType: "ทำความสะอาด" })
              }
            />

            <TouchableOpacity
              style={s.saveBtn}
              onPress={() => setIsEdit(false)}
            >
              <Text style={s.saveText}>บันทึก</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================== COMPONENTS ================== */
function StatBox({ title, value }: { title: string; value: string }) {
  return (
    <View style={s.statBox}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statTitle}>{title}</Text>
    </View>
  );
}

function Label({ title }: { title: string }) {
  return <Text style={s.label}>{title}</Text>;
}

function Radio({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={s.radioRow} onPress={onPress}>
      <Ionicons
        name={active ? "radio-button-on" : "radio-button-off"}
        size={18}
        color="#2563EB"
      />
      <Text style={s.radioText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ================== STYLES ================== */
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  cancel: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  editText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },

  avatarWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },

  camera: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "#2563EB",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },

  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginVertical: 6,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: "600",
  },

  vehicleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  vehicleText: {
    fontSize: 14,
    color: "#6B7280",
  },

  statRow: {
    flexDirection: "row",
    marginVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
  },

  statTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },

  reviewTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  reviewItem: {
    flexDirection: "row",
    gap: 12,
  },

  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  reviewName: {
    fontWeight: "600",
  },

  reviewText: {
    fontSize: 13,
    color: "#374151",
    marginVertical: 2,
  },

  reviewStar: {
    color: "#F59E0B",
    fontSize: 14,
  },

  form: {
    marginTop: 16,
  },

  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    fontSize: 15,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 6,
  },

  radioText: {
    fontSize: 14,
    color: "#111827",
  },

  saveBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
