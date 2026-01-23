import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { MainColor } from "../../../../../constant/theme";
import { ContractStackParamList } from "./ContractStack";

type Props = {
  route: RouteProp<ContractStackParamList, "contractDetail">;
};

export default function ContractDetail({ route }: Props) {
  const { id } = route.params;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/contract-posts/${id}`
    )
      .then((res) => res.json())
      .then(setPost)
      .finally(() => setLoading(false));
  }, [id]);

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
      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.price}>
          ฿ {post.price.toLocaleString()}
        </Text>
        <Text style={styles.location}>
          {post.city} • {post.province}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 260 },
  content: { padding: 16 },
  title: { fontSize: 20, fontFamily: "Kanit_700Bold" },
  price: { fontSize: 22, color: MainColor },
  location: { fontSize: 14, color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
