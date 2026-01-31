import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../../styles/profile.view.styles";
import { useNavigation } from "@react-navigation/native";

const REVIEWS_PER_PAGE = 5;

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " • " +
    date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

export default function ProfileView({ profile, stats, onEdit }: any) {
  const navigation = useNavigation<any>();

  const detail = profile?.service_worker_detail;
  const services = profile?.service_and_worker || [];

  const reviews = stats?.reviews || [];
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  return (
    <View style={{ paddingBottom: 20 }}>
      {/* ===== Main Card ===== */}
      <View style={styles.mainCard}>
        <View style={styles.actionButtonGroup}>
          <TouchableOpacity
            style={[styles.iconBtn, styles.settingBtn]}
            onPress={() => navigation.navigate("setting")}
          >
            <Ionicons name="settings-outline" size={20} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconBtn, styles.editFloatingBtn]}
            onPress={onEdit}
          >
            <Ionicons name="pencil" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri:
                detail?.image_url ??
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <View style={styles.statusBadge} />
        </View>

        <Text style={styles.name}>{detail?.name}</Text>

        {/* Services */}
        <View style={styles.serviceTagContainer}>
          {services.length > 0 ? (
            services.map((item: any, index: number) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{item.services?.name}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>ทั่วไป</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox label="งานที่รับ" value={stats?.totalJobs ?? 0} />
          <View style={styles.vDivider} />
          <StatBox label="เรตติ้ง" value={stats?.avgRating ?? 0} icon="star" />
          <View style={styles.vDivider} />
          <StatBox label="สำเร็จ" value={stats?.successRate ?? "0%"} />
        </View>
      </View>

      {/* ===== Reviews ===== */}
      <Text style={styles.sectionTitle}>รีวิวจากผู้ใช้</Text>

      {reviews.slice(0, visibleCount).map((item: any, index: number) => {
        const reviewer = item.service_history?.users?.user_detail;
        const serviceName = item.service_history?.services?.name;

        return (
          <View key={item.id ?? index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerRow}>
                <Image
                  source={{
                    uri:
                      reviewer?.image_url ??
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                  }}
                  style={styles.reviewerAvatar}
                />

                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerNameRow}>
                    <Text style={styles.reviewer_name}>
                      {reviewer?.name ?? "ผู้ใช้"}
                    </Text>

                    {serviceName && (
                      <View style={styles.reviewServiceTag}>
                        <Text style={styles.reviewServiceText}>
                          {serviceName}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.reviewDate}>
                    {formatDateTime(item.created_at)}
                  </Text>
                </View>
              </View>

              <View style={styles.ratingRow}>
                {[...Array(item.rate || 0)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={13}
                    color="#FBBF24"
                  />
                ))}
              </View>
            </View>

            <Text style={styles.reviewer_comments}>
              {item.review || "-"}
            </Text>
          </View>
        );
      })}

      {visibleCount < reviews.length && (
        <TouchableOpacity
          style={styles.loadMoreBtn}
          onPress={() => setVisibleCount((v) => v + REVIEWS_PER_PAGE)}
        >
          <Text style={styles.loadMoreText}>แสดงรีวิวเพิ่มเติม</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const StatBox = ({ label, value, icon }: any) => (
  <View style={styles.statItem}>
    <View style={styles.statValueRow}>
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color="#F59E0B"
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={styles.statValue}>{value}</Text>
    </View>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);
