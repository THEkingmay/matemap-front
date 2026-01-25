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
import { getContractPostById } from "./contractPost.service";

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
    if (!id) return;
    
    getContractPostById(id)
        .then((data) => {
            if (data) {
                setPost(data);
                setLoading(false);
            }
        })
        .catch((err) => {
            console.error("API not ready, using mock:", err);
        });
    
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
