import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { BGColor, MainColor } from "../../../../../../constant/theme";
import { ContractStackParamList } from "../ContractStack";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getContractPostById } from "./contractPost.service";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import apiClient from "../../../../../../constant/axios";
import { useAuth } from "../../../../../AuthProvider";

type Props = NativeStackScreenProps<ContractStackParamList , 'contractDetail'>

export type  Post = { 
    id : string ,
    created_at : string ,
    user_id : string
    title : string
    price : number ,
    dorm_number?: string , 
    postal_code ?: string ,
    province? : string ,
    city? : string ,
    district? : string ,
    sub_district? : string ,
    street? : string ,
    status : "approved"|"rejected"|"pending"
    image_url? : string,
    image_public_id? : string,

}

type Owner = {
  id: string;
  name: string;
  bio: string;
  faculty?: string;
  major?: string;
  tag?: string[];
  image_url?: string;
  birth_year?: number;
};

export default function ContractDetail({ route }: Props) {
  const { id } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);

  const {token, user} = useAuth()

  const [isMakingRoom , setIsMakingRoom] = useState(false)

  const navigation = useNavigation<any>()

  const fullAddress = [
    post?.dorm_number,
    post?.street ? `ซอย/ถนน ${post?.street}` : null,
    post?.sub_district,
    post?.district,
    post?.province,
    post?.postal_code
  ].filter(Boolean).join(' ');

  useEffect(() => {
    if (!id) return;

    getContractPostById(id)
      .then((data) => {
        if (data) {
          setPost(data.post);
          setOwner(data.owner);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("API not ready, using mock:", err);
        // Fallback or error handling
        setLoading(false);
      });
  }, [id]);

  // ฟังก์ชันสำหรับจัดการเมื่อกดปุ่ม Chat
  const handleChat = async () => {
    if (!owner) return;
    try{
      setIsMakingRoom(true)
      // ยิง API สร้างช่องแชทและส่ง room_id กลับมา
      const res = await apiClient.post('/api/room' , { userId : user?.id , ownerPostId : owner.id , roomType : 'contract' } , {
        headers : {
          'Authorization' : `Bearer ${token}`
        },
      })

      navigation.navigate('chat_stack' , {
        screen : 'chat_select' ,
        params : {
          room_id : res.data.data.id
        }
      })
    }catch(err){  
      Toast.show({
        type : "error" ,
        text1 : (err as Error).message
      })
    }finally{
      setIsMakingRoom(false)
    }
  };

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
    <View style={{ flex: 1, backgroundColor: BGColor  }}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="chevron-back" size={24} color="#111" />
      </TouchableOpacity>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Post Image */}
        {post.image_url ? (
          <Image source={{ uri: post.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="image-outline" size={50} color="#ccc" />
          </View>
        )}

        <View style={styles.content}>
          {/* Post Details */}
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.price}>฿ {post.price.toLocaleString()}</Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.addressText}>{fullAddress}</Text>
          </View>
         

          {/* Divider */}
          <View style={styles.divider} />

          {/* Owner Details Section */}
          {owner && (
            <View style={styles.ownerSection}>
              <Text style={styles.sectionHeader}>ข้อมูลผู้ปล่อยสัญญา</Text>
              
              <View style={styles.ownerProfileRow}>
                <Image
                  source={{ 
                    uri: owner.image_url || "https://ui-avatars.com/api/?name=" + owner.name 
                  }}
                  style={styles.ownerAvatar}
                />
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>{owner.name}</Text>
                  {(owner.faculty || owner.major) && (
                    <Text style={styles.ownerFaculty}>
                      {owner.faculty} {owner.major ? `• ${owner.major}` : ""}
                    </Text>
                  )}
                  {owner.birth_year && (
                     <Text style={styles.ownerMeta}>เกิดปี: {owner.birth_year}</Text>
                  )}
                </View>
              </View>

              {owner.bio ? (
                 <Text style={styles.ownerBio}>"{owner.bio}"</Text>
              ) : null}

              {/* Tags */}
              {owner.tag && owner.tag.length > 0 && (
                <View style={styles.tagContainer}>
                  {owner.tag.map((tag, index) => (
                    <View key={index} style={styles.tagChip}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
        {/* Footer / Chat Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.chatButton} 
            onPress={handleChat}
            activeOpacity={0.8}
            disabled={isMakingRoom}
        >
            <Ionicons name={isMakingRoom ? 'arrow-up-right-box':'chatbubble-ellipses'} size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.chatButtonText}>{isMakingRoom ? "กำลังนำไปช่องแชท..." : "สนใจพูดคุย"}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingBottom : 200
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Header / Back Button
  backButton: {
    position: "absolute",
    top: 15, // อาจต้องปรับตาม Safe Area ของแต่ละเครื่อง หรือใช้ SafeAreaView
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
  // Post Image & Info
  image: {
    width: "100%",
    height: 280,
    backgroundColor: "#eee",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "Kanit_700Bold",
    marginBottom: 8,
    color: "#333",
  },
  price: {
    fontSize: 24,
    fontFamily: "Kanit_700Bold",
    color: MainColor,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  location: {
    fontSize: 15,
    color: "#666",
    marginLeft: 4,
    fontFamily: "Kanit_400Regular", // สมมติว่ามี font นี้
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  // Owner Section
  ownerSection: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: "Kanit_700Bold",
    marginBottom: 12,
    color: "#333",
  },
  ownerProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ownerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },
  ownerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontFamily: "Kanit_700Bold",
    color: "#333",
  },
  ownerFaculty: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  ownerMeta: {
      fontSize: 12,
      color: "#888",
      marginTop: 2,
  },
  ownerBio: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  // Tags
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  tagText: {
    fontSize: 12,
    color: "#555",
  },addressContainer: {
  flexDirection: "row",
  alignItems: "flex-start", // เผื่อที่อยู่ยาวจนตัดบรรทัด
  marginTop: 8,
  paddingRight: 10,
},
addressText: {
  fontSize: 14,
  color: "#555",
  marginLeft: 6,
  fontFamily: "Kanit_400Regular",
  lineHeight: 20,
  flex: 1, // สำคัญ: เพื่อให้ Text ตัดบรรทัดได้ไม่ล้นจอ
},
  // Footer Button
  footer: {
    // position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chatButton: {
    backgroundColor: MainColor,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  chatButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Kanit_700Bold",
  },
});