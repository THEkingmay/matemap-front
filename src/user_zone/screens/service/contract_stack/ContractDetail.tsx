import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MainColor } from "../../../../../constant/theme";
import { RouteProp } from "@react-navigation/native";


type RootStackParamList = {
  contractDetail: { id: string };
};

type Props = {
  route: RouteProp<RootStackParamList, "contractDetail">;
};

type ContractPost = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  province: string;
  city: string;
  created_at: string;
};

export default function ContractDetail({ route }: Props) {
  const { id } = route.params;

  const [post, setPost] = useState<ContractPost | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/contract-posts/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch post");
      }

      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error("FETCH POST ERROR:", err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>ไม่พบข้อมูล</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image */}
      {post.image_url ? (
        <Image source={{ uri: post.image_url }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>

        <Text style={styles.price}>
          ฿ {post.price.toLocaleString()}
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>ที่อยู่</Text>
          <Text style={styles.value}>
            {post.city} • {post.province}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: 260,
    backgroundColor: "#eee",
  },

  imagePlaceholder: {
    width: "100%",
    height: 260,
    backgroundColor: "#E5E7EB",
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontFamily: "Kanit_700Bold",
    marginBottom: 6,
  },

  price: {
    fontSize: 22,
    fontFamily: "Kanit_700Bold",
    color: MainColor,
    marginBottom: 16,
  },

  section: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontFamily: "Kanit_500Medium",
    color: "#555",
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontFamily: "Kanit_400Regular",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
