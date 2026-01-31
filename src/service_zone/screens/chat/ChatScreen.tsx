import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/* ================= MOCK DATA ================= */
const MOCK_CHATS = [
  {
    id: "1",
    name: "เฟรชชี่",
    avatar:
      "https://f.ptcdn.info/925/064/000/puf5ih6zqr441VIKmES-o.jpg",
    lastMessage: "โอเคครับ",
    time: "เมื่อสักครู่",
  },
  {
    id: "2",
    name: "Rose",
    avatar:
      "https://i.pinimg.com/originals/10/ff/2f/10ff2fc7c2c8a34491c1b7a3a401f3f4.jpg",
    lastMessage: "ได้เลย เดี๋ยวส่งให้ค่ะ",
    time: "1 วัน",
  },
  {
    id: "3",
    name: "Rara",
    avatar:
      "https://i.pinimg.com/originals/10/ff/2f/10ff2fc7c2c8a34491c1b7a3a401f3f4.jpg",
    lastMessage: "มีค่ะสนใจ เข้ามาดูห้องได้นะค่ะ",
    time: "2 วัน",
  },
];

// เพิ่ม navigation ใน props
export default function ChatScreen({ navigation }: any) {
  return (
    <View style={s.container}>
      <View style={s.searchBar}>
        <Ionicons name="search" size={18} color="#999" />
        <Text style={s.searchText}>ค้นหาการสนทนา...</Text>
      </View>

      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.chatItem}
            // ✅ ปรับเฉพาะตรงนี้: ใช้การ navigate แทนการ set state
            onPress={() => navigation.navigate('ChatIdScreen', { chatId: item.id })}
          >
            <Image source={{ uri: item.avatar }} style={s.avatar} />

            <View style={s.chatContent}>
              <Text style={s.name}>{item.name}</Text>
              <Text style={s.message} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            <Text style={s.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    marginTop: 40,
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  searchText: {
    color: "#999",
    fontSize: 14,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#777",
  },
  time: {
    fontSize: 12,
    color: "#AAA",
    marginLeft: 8,
  },
});