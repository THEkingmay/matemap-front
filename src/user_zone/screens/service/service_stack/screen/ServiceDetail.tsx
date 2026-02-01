import { useEffect, useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
} from "react-native";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ServiceStackParamsList } from "../ServiceStack";
import apiClient from "../../../../../../constant/axios"; 
import { MainColor, FONT , BGColor } from "../../../../../../constant/theme";

type props = NativeStackScreenProps<ServiceStackParamsList, 'serviceDetail'>;

export interface ServiceProvider {
  id: string;
  name: string;
  tel: string | null;
  email: string | null;
  car_registration: string | null;
  image_url: string | null;
  image_public_url: string | null;
  created_at: string;
}

export interface ServiceDetailResponse {
  service_name: string;
  users: ServiceProvider[];
}

export default function ServiceDetail({ route, navigation }: props) {

  const [data, setData] = useState<ServiceDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  const { service_id } = route.params;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/api/service/${service_id}`);
      setData({ ...res.data });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error fetching data",
        text2: (err as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePressProvider = (userId: string) => {
    navigation.navigate('serviceUseId', { user_id: userId });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: ServiceProvider }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => handlePressProvider(item.id)}
    >
      <View style={styles.cardContent}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image 
              source={{ uri: item.image_url }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Text style={styles.placeholderText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.providerName} numberOfLines={1}>
            {item.name}
          </Text>
          
          {item.tel && (
            <Text style={styles.providerDetail}>📞 {item.tel}</Text>
          )}
          
          {item.car_registration && (
            <Text style={styles.providerDetail}>🚗 {item.car_registration}</Text>
          )}
        </View>

        {/* Arrow Icon */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>{">"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        {/* ใช้ MainColor ที่นี่ */}
        <ActivityIndicator size="large" color={MainColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        
        {/* Back Button Section */}
        <TouchableOpacity 
          onPress={handleGoBack} 
          style={styles.backButton}
          activeOpacity={0.6}
        >
          {/* สามารถเปลี่ยน < เป็น Icon จาก library ได้ถ้ามี */}
          <Text style={styles.backButtonIcon}>{"<"}</Text>
          <Text style={styles.backButtonText}>ย้อนกลับ</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {data?.service_name || "Service Detail"}
        </Text>
        <Text style={styles.headerSubtitle}>
          เลือกผู้ให้บริการที่คุณต้องการ
        </Text>
      </View>

      <FlatList
        data={data?.users || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>ไม่พบผู้ให้บริการในขณะนี้</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGColor,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 10,
    // เพิ่ม shadow เล็กน้อยให้ Header ดูลอยขึ้นมา
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // Back Button Styles
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12, // เว้นระยะห่างจาก Title
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  backButtonIcon: {
    fontSize: 20,
    color: MainColor,
    fontFamily: FONT.BOLD, 
    marginRight: 4,
    lineHeight: 22,
  },
  backButtonText: {
    fontSize: 16,
    color: MainColor,
    fontFamily: FONT.REGULAR,
    lineHeight: 22,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONT.BOLD, // ใช้ Font Theme
    color: '#333333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontFamily: FONT.REGULAR, // ใช้ Font Theme
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MainColor, // ใช้ MainColor
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: FONT.BOLD, // ใช้ Font Theme
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 16,
    fontFamily: FONT.BOLD, // ใช้ Font Theme
    color: '#222',
    marginBottom: 4,
  },
  providerDetail: {
    fontSize: 13,
    color: '#777',
    marginBottom: 2,
    fontFamily: FONT.REGULAR, // ใช้ Font Theme
  },
  arrowContainer: {
    paddingLeft: 10,
  },
  arrow: {
    fontSize: 20,
    color: '#CCC',
    fontFamily: FONT.BOLD, 
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
    fontFamily: FONT.REGULAR, // ใช้ Font Theme
  },
});