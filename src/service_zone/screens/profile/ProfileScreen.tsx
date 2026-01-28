import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
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

    fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setForm(data.service_worker_detail);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleSave = async () => {
    await fetch(
      `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/service-workers/${user?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );
    setIsEdit(false);
    setProfile((p) =>
      p ? { ...p, service_worker_detail: form } : p
    );
  };

  const handleCancel = () => {
    if (!profile) return;

    // reset form กลับเป็นข้อมูลเดิม
    setForm(profile.service_worker_detail);
    setIsEdit(false);
  };

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBackground} />

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

      {isEdit && (
        <View style={styles.saveFloating}>
          <View />
        </View>
      )}
    </View>
  );
}
