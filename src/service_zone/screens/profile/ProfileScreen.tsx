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

  const [workHistory, setWorkHistory] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          profileRes,
          servicesRes,
          workRes,
          reviewRes,
        ] = await Promise.all([
          fetch(
            `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service`),
          fetch(
            `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user.id}/work-history/`
          ),
          fetch(
            `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user.id}/work-history/review`
          ),
        ]);

        const profileData = await profileRes.json();
        const allServicesData = await servicesRes.json();
        const workData = await workRes.json();
        const reviewData = await reviewRes.json();

        setProfile(profileData);
        setWorkHistory(workData || []);
        setReviews(reviewData || []);

        const currentServiceNames =
          profileData.service_and_worker.map(
            (item: any) => item.services?.name
          );

        setForm({
          ...profileData.service_worker_detail,
          all_services: allServicesData.data || [],
          selected_services: currentServiceNames,
        });
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // =========================
  // 📊 Stats
  // =========================
  const totalJobs = workHistory.length;

  const completedJobs = workHistory.filter(
    (item) => item.status === "done"
  ).length;

  const successRate =
    totalJobs === 0
      ? "0%"
      : `${Math.round((completedJobs / totalJobs) * 100)}%`;

  const avgRating =
    reviews.length === 0
      ? "0.0"
      : (
          reviews.reduce((sum, r) => sum + r.rate, 0) / reviews.length
        ).toFixed(1);

  const latestReview = reviews.length > 0 ? reviews[0] : null;

  // =========================
  // 💾 Save
  // =========================
  const handleSave = async (finalImageUrl?: string | null) => {
    try {
      const body = {
        name: form.name,
        tel: form.tel,
        image_url:
          finalImageUrl !== undefined ? finalImageUrl : form.image_url,
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

      setProfile((prev: any) => ({
        ...prev,
        service_worker_detail: { ...prev.service_worker_detail, ...body },
        service_and_worker: form.selected_services.map((name: string) => ({
          services: { name },
        })),
      }));

      setIsEdit(false);
      Toast.show({ type: "success", text1: "บันทึกโปรไฟล์สำเร็จ" });
    } catch {
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  const handleCancel = () => {
    if (!profile || !form.all_services) return;

    const currentServiceNames =
      profile.service_and_worker?.map(
        (item: any) => item.services?.name
      ) || [];

    setForm({
      ...profile.service_worker_detail,
      all_services: form.all_services,
      selected_services: currentServiceNames,
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
      <View style={styles.headerBackground} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isEdit ? (
          <ProfileView
            profile={profile}
            stats={{
              totalJobs,
              successRate,
              avgRating,
              latestReview,
              reviews, // ⭐ สำคัญ
            }}
            onEdit={() => setIsEdit(true)}
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
