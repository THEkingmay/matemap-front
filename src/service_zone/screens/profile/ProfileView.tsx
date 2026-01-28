import React from "react";
import { View, Text, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import StatBox from "../../components/StatBox";
import { styles } from "../../styles/profile.styles";
import { Profile } from "../../types/profile";
import CustomButton from "../../../components/ActionButton";

type Props = {
  profile: Profile;
  onEdit: () => void;
  onSetting: () => void;
};

export default function ProfileView({ profile, onEdit, onSetting }: Props) {
  const detail = profile.service_worker_detail;
  const serviceName =
    profile.service_and_worker?.[0]?.services?.name ?? "-";

  return (
    <>
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

      <Text style={styles.name}>{detail.name}</Text>

      <View style={styles.vehicleRow}>
        <Ionicons name="call-outline" size={16} color="#6B7280" />
        <Text style={styles.vehicleText}>{detail.tel ?? "-"}</Text>
      </View>

      <View style={styles.statRow}>
        <StatBox title="ประเภทงาน" value={serviceName} />
        <StatBox title="งานสำเร็จ" value="5" />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <CustomButton
          title="ตั้งค่าระบบ"
          theme="warn"
          iconName="settings-outline"
          onPress={onSetting}
        />
        <View style={{ height: 12 }} />
        <CustomButton
          title="แก้ไขโปรไฟล์"
          theme="default"
          iconName="create-outline"
          onPress={onEdit}
        />
      </View>
    </>
  );
}
