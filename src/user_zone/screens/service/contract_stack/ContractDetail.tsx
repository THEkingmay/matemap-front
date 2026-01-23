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
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";


type Props = {
  route: RouteProp<ContractStackParamList, "contractDetail">;
};

type ContractPost = {
  id: string;
  title: string;
  price: number;
  image_url?: string | null;
  province: string;
  city: string;
};

export default function ContractDetail({ route }: Props) {
  const { id } = route.params;
  const [post, setPost] = useState<ContractPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // 👉 ใช้ mock ก่อน (ลบอันนี้ทิ้งได้เมื่อ backend สมบูรณ์)
    const mockPost: ContractPost = {
      id,
      title: "ขายสัญญาหอ ใกล้ ม.ธรรมศาสตร์",
      price: 7500,
      province: "ปทุมธานี",
      city: "คลองหลวง",
      image_url:
        "https://res.cloudinary.com/dcr8iggld/image/upload/v1769190427/matemap/contract-posts/eb418dc7-fa65-4937-a6d8-4bdfea0197ab/y7ecmwvhjzqtdzq7nsgq.webp",
    };

    setPost(mockPost);
    setLoading(false);

    // 👉 ถ้าจะใช้ API จริง ให้ใช้แทน mock
    /*
    fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/contract-posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch(console.error)
      .finally(() => setLoading(false));
    */
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
  <View style={{ flex: 1 }}>
    {/* Back Button */}
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      activeOpacity={0.8}
    >
      <Ionicons name="chevron-back" size={24} color="#111" />
    </TouchableOpacity>

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
  </View>
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
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: "#555",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 16,
    zIndex: 10,

    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 5,
},
});
