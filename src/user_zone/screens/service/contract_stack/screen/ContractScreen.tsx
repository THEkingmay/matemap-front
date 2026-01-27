import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainColor } from "../../../../../../constant/theme";
import { getContractPosts } from "./contractPost.service";
import { ContractStackParamList } from "../ContractStack";
import { supabase } from "../../../../../../configs/supabase"; 

type NavigationProp = NativeStackNavigationProp<
  ContractStackParamList,
  "contractScreen"
>;

type ContractPost = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  province: string;
  city: string;
  created_at: string;
};

export default function ContractScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [posts, setPosts] = useState<ContractPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // กัน setState หลัง unmount

    getContractPosts()
      .then((data) => {
        if (isMounted) {
          setPosts(data);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const channel = supabase
      .channel("contract_posts-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT | UPDATE | DELETE
          schema: "public",
          table: "contract_posts",
        },
        (payload: any) => {
          setPosts((prev) => {
            // Add New Post
            if (payload.eventType === "INSERT") {
              return [payload.new as ContractPost, ...prev];
            }

            // Edit Post
            if (payload.eventType === "UPDATE") {
              return prev.map((post) =>
                post.id === payload.new.id
                  ? (payload.new as ContractPost)
                  : post
              );
            }

            // Delete Post
            if (payload.eventType === "DELETE") {
              return prev.filter(
                (post) => post.id !== payload.old.id
              );
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [posts]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              navigation.push("contractDetail", { id: item.id })
            }
          >
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}

            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.price}>
                ฿ {item.price.toLocaleString()}
              </Text>
              <Text style={styles.location}>
                {item.city} • {item.province}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F7FB" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 4,
  },
  image: { width: "100%", height: 170 },
  imagePlaceholder: { width: "100%", height: 170, backgroundColor: "#E5E7EB" },
  content: { padding: 14 },
  title: { fontSize: 16, fontFamily: "Kanit_600SemiBold" },
  price: { fontSize: 18, fontFamily: "Kanit_700Bold", color: MainColor },
  location: { fontSize: 13, color: "#6B7280" },
});
