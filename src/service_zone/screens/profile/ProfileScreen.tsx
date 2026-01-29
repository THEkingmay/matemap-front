import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../../AuthProvider";
import { styles } from "../../styles/profile.styles";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import { Profile } from "../../types/profile";

export default function ProfileScreen({ navigation }: any) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!user?.id) return;

    fetch(
      `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm(data.service_worker_detail);
      })
      .finally(() => setLoading(false));
      
  }, [user?.id]);

  // แก้ไขฟังก์ชัน handleSave ให้รับ parameter finalImageUrl
  const handleSave = async (finalImageUrl?: string | null) => {
    try {
      // 1. เตรียมข้อมูลที่จะส่งไปบันทึก
      const updatedForm = {
        ...form,
        image_url: finalImageUrl !== undefined ? finalImageUrl : form.image_url,
      };

      // 2. ยิง API บันทึกข้อมูลส่วนตัว (ชื่อ, เบอร์, ประเภทงาน)
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedForm),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      // 3. อัปเดต State ในเครื่องให้เป็นค่าล่าสุด
      setProfile((prev) =>
        prev ? { ...prev, service_worker_detail: updatedForm } : prev
      );
      setForm(updatedForm); // อัปเดต form ให้ตรงกับข้อมูลล่าสุดด้วย
      setIsEdit(false);
      
      // แสดงผลสำเร็จ
      Toast.show({ type: 'success', text1: 'บันทึกโปรไฟล์สำเร็จ' });

    } catch (error) {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลส่วนตัวได้");
    }
  };
  const handleCancel = () => {
    if (!profile) return;
    setForm(profile.service_worker_detail);
    setIsEdit(false);
  };

  
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View style={styles.container}>
      {/* Header background */}
      <View style={styles.headerBackground} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isEdit ? (
          <ProfileView
            profile={profile}
            onEdit={() => setIsEdit(true)}
            onSetting={() => navigation.navigate("setting")}
          />
        ) : (
          <ProfileEdit
            form={form}
            setForm={setForm}
            onCancel={handleCancel}
            onSave={handleSave}
          />
        )}
      </ScrollView>
    </View>
  );
}
