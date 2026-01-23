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
import { MainColor } from "../../../../../constant/theme";
import { getContractPosts } from "../contractPost.service";
import { ContractStackParamList } from "./ContractStack";

const datamock: ContractPost[] = [
  {
    "id": "eb418dc7-fa65-4937-a6d8-4bdfea0197ab",
    "title": "ขายสัญญาหอ ใกล้ ม.ธรรมศาสตร์",
    "price": 7500,
    "image_url": "https://res.cloudinary.com/dcr8iggld/image/upload/v1769190427/matemap/contract-posts/eb418dc7-fa65-4937-a6d8-4bdfea0197ab/y7ecmwvhjzqtdzq7nsgq.webp",
    "province": "ปทุมธานี",
    "city": "คลองหลวง",
    "created_at": "2026-01-23T17:39:42.53116+00:00"
    },
    {
      "id": "d3f3f3e1-1e2b-4f4c-9f4e-2b2c2d2e2f2a",
      "title": "ขายสัญญาหอพัก ใกล้ ม.รังสิต",
      "price": 6800,
      "image_url": "https://bcdn.renthub.in.th/listing_picture/202009/20200910/cuuGKkZCoZZTUYGDBFqL.jpg?class=lthumbnail",
      "province": "ปทุมธานี",
      "city": "ธัญบุรี",
      "created_at": "2026-01-22T10:15:30.12345+00:00"
    },
    {
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "title": "ขายสัญญาหอพัก ใกล้ ม.กรุงเทพ",
      "price": 7200,
      "image_url": "https://assets.baanfinder.com/ll3uaqfgiynuu55p88ka2d7ku0uvde51at9ziqz7dffe39274xv6azo8gmzxs7g8tte8fnjk7m4keut1yfr5fqu5vki2ljf1269w8n5ytxct4zktvwht82cygdvjaqq9.jpg",
      "province": "นนทบุรี",
      "city": "เมืองนนทบุรี",
      "created_at": "2026-01-20T14:25:50.67890+00:00" 
    }
];

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
    getContractPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
        data={datamock} // mock data
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





