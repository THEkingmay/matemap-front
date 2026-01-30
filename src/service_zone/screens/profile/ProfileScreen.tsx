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

    const fetchData = async () => {
      try {
        setLoading(true);
        // ดึงข้อมูล 2 อย่างพร้อมกัน
        const [profileRes, servicesRes] = await Promise.all([
          fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service`) // ดึงบริการทั้งหมดในระบบ
        ]);

        const profileData = await profileRes.json();
        const allServicesData = await servicesRes.json();

        setProfile(profileData);

        // สร้าง Array ของชื่อบริการที่ User มีอยู่ในปัจจุบัน
        const currentServiceNames = profileData.service_and_worker.map(
          (item: any) => item.services?.name
        );
        
        // สร้างก้อนข้อมูลที่สมบูรณ์
        const initialFormData = {
          ...profileData.service_worker_detail,
          all_services: allServicesData.data || [], 
          selected_services: currentServiceNames, 
        };
        setForm(initialFormData);

      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // แก้ไขฟังก์ชัน handleSave ให้รับ parameter finalImageUrl
  const handleSave = async (finalImageUrl?: string | null) => {
      try {
        // เตรียมข้อมูลที่จะส่งไป API
        const body = {
          name: form.name,
          tel: form.tel,
          image_url: finalImageUrl !== undefined ? finalImageUrl : form.image_url,
          car_registration: form.car_registration,
          services: form.selected_services, 
        };

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user?.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) throw new Error("Update failed");

        // อัปเดตข้อมูลในหน้า View ให้เป็นปัจจุบัน
        setProfile((prev: any) => ({
          ...prev,
          service_worker_detail: { ...prev.service_worker_detail, ...body },
          // อัปเดตข้อมูลความสัมพันธ์ใน Profile เพื่อให้หน้า View แสดงผลถูกต้อง
          service_and_worker: form.selected_services.map((name: string) => ({ services: { name } }))
        }));
        
        setIsEdit(false);
        Toast.show({ type: 'success', text1: 'บันทึกโปรไฟล์สำเร็จ' });
      } catch (error) {
        Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
      }
    };
  
  const handleCancel = () => {
    if (!profile || !form.all_services) return;
    
    const currentServiceNames = profile?.service_and_worker?.map(
      (item: any) => item.services?.name
    ) || []; 

    setForm({
      ...profile.service_worker_detail,
      all_services: form.all_services, // คงค่าบริการทั้งหมดไว้ ไม่เช่นนั้นหน้า Edit จะหมุนค้าง
      selected_services: currentServiceNames, // กลับไปใช้ค่าเดิมก่อนแก้ไข
    });

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
