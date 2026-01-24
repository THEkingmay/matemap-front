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

    // #### MOCK DATA ####
    const datamock: ContractPost[] = [
        {
            "id": "eb418dc7-fa65-4937-a6d8-4bdfea0197ab",
            "title": "ขายสัญญาหอ ใกล้ ม.ธรรมศาสตร์",
            "price": 7500,
            "image_url": "https://res.cloudinary.com/dcr8iggld/image/upload/v1769190427/matemap/contract-posts/eb418dc7-fa65-4937-a6d8-4bdfea0197ab/y7ecmwvhjzqtdzq7nsgq.webp",
            "province": "ปทุมธานี",
            "city": "คลองหลวง",
        },
        {
            "id": "d3f3f3e1-1e2b-4f4c-9f4e-2b2c2d2e2f2a",
            "title": "ขายสัญญาหอพัก ใกล้ ม.รังสิต",
            "price": 6800,
            "image_url": "https://bcdn.renthub.in.th/listing_picture/202009/20200910/cuuGKkZCoZZTUYGDBFqL.jpg?class=lthumbnail",
            "province": "ปทุมธานี",
            "city": "ธัญบุรี",
        },
        {
            "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
            "title": "ขายสัญญาหอพัก ใกล้ ม.กรุงเทพ",
            "price": 7200,
            "image_url": "https://assets.baanfinder.com/ll3uaqfgiynuu55p88ka2d7ku0uvde51at9ziqz7dffe39274xv6azo8gmzxs7g8tte8fnjk7m4keut1yfr5fqu5vki2ljf1269w8n5ytxct4zktvwht82cygdvjaqq9.jpg",
            "province": "นนทบุรี",
            "city": "เมืองนนทบุรี",
        }
    ];

    const mockPost = datamock.find((p) => p.id === id) || null;
    setPost(mockPost);
    setLoading(false); 
    // ###################

    // // FETCH API (เบื้องหลัง) # รอใช้ข้อมูลจริง
    /*
    getContractPostById(id)
        .then((data) => {
        // ถ้า backend พร้อม → เอาของจริงมาแทน
            if (data) {
                setPost(data);
                setLoading(false);
            }
        })
        .catch((err) => {
            console.error("API not ready, using mock:", err);
        });
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
