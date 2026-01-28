import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useAuth } from "../../../AuthProvider";
import { styles } from "../../styles/profile_screen_styles";
import Label from "../../components/Label";
import StatBox from "../../components/StatBox";
import { MainColor } from "../../../../constant/theme";
import CustomButton from "../../../components/ActionButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProfileStackParamsList } from "./ProfileStack";

/* =======================
  Navigation Type
======================= */
type Props = NativeStackScreenProps<
  ProfileStackParamsList,
  "profiledetail"
>;

/* =======================
  Types
======================= */
type ServiceWorkerDetail = {
  name: string;
  tel?: string;
  image_url?: string;
};

type Profile = {
  service_worker_detail: ServiceWorkerDetail;
  service_and_worker?: {
    services?: {
      name?: string;
    };
  }[];
};

export default function ProfileScreen({ navigation }: Props) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [form, setForm] = useState({
    name: "",
    tel: "",
  });

  /* =======================
    Fetch Profile
  ======================= */
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user.id}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data: Profile = await res.json();

        setProfile(data);
        setForm({
          name: data.service_worker_detail.name ?? "",
          tel: data.service_worker_detail.tel ?? "",
        });
      } catch (err) {
        console.warn("❌ โหลดโปรไฟล์ไม่สำเร็จ:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  /* =======================
    Save Profile
  ======================= */
  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              service_worker_detail: {
                ...prev.service_worker_detail,
                name: form.name,
                tel: form.tel,
              },
            }
          : prev
      );

      setIsEdit(false);
    } catch (err) {
      console.warn("❌ บันทึกไม่สำเร็จ:", err);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
    } finally {
      setSaving(false);
    }
  };

  /* =======================
    Loading / Error
  ======================= */
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>ไม่พบข้อมูลผู้ใช้</Text>
      </View>
    );
  }

  const detail = profile.service_worker_detail;
  const serviceName =
    profile.service_and_worker?.[0]?.services?.name ?? "-";

  /* =======================
    Render
  ======================= */
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBackground} />

        {/* Header */}
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
              <Ionicons name="create-outline" size={18} color={MainColor} />
              <Text style={styles.editText}>แก้ไข</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri:
                detail.image_url ??
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
        </View>

        {!isEdit && (
          <>
            <Text style={styles.name}>{detail.name}</Text>

            <View style={styles.vehicleRow}>
              <Ionicons name="call-outline" size={16} color="#6B7280" />
              <Text style={styles.vehicleText}>{detail.tel ?? "-"}</Text>
            </View>

            <View style={styles.statRow}>
              <StatBox title="ประเภทงาน" value={serviceName} />
              <StatBox title="งานสำเร็จ" value="5" />
            </View>

            <CustomButton
              title="ตั้งค่าระบบ"
              theme="warn"
              iconName="settings-outline"
              onPress={() =>
                navigation.navigate("setting")
              }
            />
          </>
        )}

        {isEdit && (
          <View style={styles.form}>
            <Label title="ชื่อผู้ใช้งาน" />
            <TextInput
              value={form.name}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, name: text }))
              }
              style={styles.input}
            />

            <Label title="เบอร์โทร" />
            <TextInput
              value={form.tel}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, tel: text }))
              }
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              disabled={saving}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
