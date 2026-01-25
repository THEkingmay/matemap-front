import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import LogoutButton from "../../components/LogoutButton";
import { useAuth } from "../../../AuthProvider";
import { styles } from "../../styles/profile.styles";
import Radio from "../../components/Radio";
import Label from "../../components/Label";
import StatBox from "../../components/StatBox";

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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Header ===== */}
        <View style={styles.headerRow}>
          {isEdit ? (
            <TouchableOpacity onPress={() => setIsEdit(false)}>
              <Text style={styles.cancel}>ยกเลิก</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {!isEdit && (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEdit(true)}
            >
              <Ionicons name="create-outline" size={18} color="#2563EB" />
              <Text style={styles.editText}>แก้ไข</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ===== Avatar ===== */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          {isEdit && (
            <TouchableOpacity style={styles.camera}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* ===== VIEW MODE ===== */}
        {!isEdit && (
          <>
            <Text style={styles.name}>{user.name}</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.ratingText}>{user.rating.toFixed(1)}</Text>
            </View>

            {/* ===== Vehicle Plate ===== */}
            <View style={styles.vehicleRow}>
              <Ionicons name="car-outline" size={16} color="#6B7280" />
              <Text style={styles.vehicleText}>{user.vehicle}</Text>
            </View>

            <View style={styles.statRow}>
              <StatBox title="งานที่รับ" value="5" />
              <StatBox title="งานสำเร็จ" value="5" />
            </View>

            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>รีวิวจากผู้จ้าง (1)</Text>

              <View style={styles.reviewItem}>
                <Image
                  source={{
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSKdMDtiohdnWlMxTRrz5Ghpcqk5IXJVS8RQ&s",
                  }}
                  style={styles.reviewAvatar}
                />
                <View>
                  <Text style={styles.reviewName}>Rose</Text>
                  <Text style={styles.reviewText}>
                    ขนย้ายของอย่างระมัดระวัง ตรงต่อเวลา
                  </Text>
                  <Text style={styles.reviewStar}>★★★★★</Text>
                </View>
              </View>
            </View>
            <LogoutButton onLogout={handleLogout} />
          </>
        )}

        {/* ===== EDIT MODE ===== */}
        {isEdit && (
          <View style={styles.form}>
            <Label title="ชื่อผู้ใช้งาน" />
            <TextInput
              value={user.name}
              style={styles.input}
              onChangeText={(t) => setUser({ ...user, name: t })}
            />

            <Label title="เบอร์โทร" />
            <TextInput
              value={user.phone}
              style={styles.input}
              keyboardType="phone-pad"
              onChangeText={(t) => setUser({ ...user, phone: t })}
            />

            <Label title="ทะเบียนรถ" />
            <TextInput
              value={user.vehicle}
              style={styles.input}
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
              style={styles.saveBtn}
              onPress={() => setIsEdit(false)}
            >
              <Text style={styles.saveText}>บันทึก</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
