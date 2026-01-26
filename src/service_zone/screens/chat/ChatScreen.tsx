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
    avatar: "https://f.ptcdn.info/925/064/000/puf5ih6zqr441VIKmES-o.jpg",
    lastMessage: "600 บาทครับ",
    time: "เมื่อสักครู่",
    messages: [
      {
        id: "m1",
        text: "ขนย้ายของจากหอไอเพลสไปดีคอนโดกี่บาทคะ",
        sender: "other",
      },
      {
        id: "m2",
        text: "600 บาทครับ",
        sender: "me",
      },
    ],
  },
  {
    id: "2",
    name: "Rose",
    avatar: "https://i.pinimg.com/originals/10/ff/2f/10ff2fc7c2c8a34491c1b7a3a401f3f4.jpg",
    lastMessage: "ขอบคุณครับ",
    time: "1 วัน",
    messages: [
      {
        id: "m1",
        text: "ขอบคุณมากค่ะ",
        sender: "other",
      },
    ],
  },
];

export default function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [message, setMessage] = useState("");

  /* ================= CHAT LIST ================= */
  if (!selectedChat) {
    return (
      <View style={s.container}>
        {/* Search */}
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
              onPress={() => setSelectedChat(item)}
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

  /* ================= CHAT ROOM ================= */
  return (
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => setSelectedChat(null)}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>

        <Image
          source={{ uri: selectedChat.avatar }}
          style={s.headerAvatar}
        />
        <Text style={s.headerName}>{selectedChat.name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={selectedChat.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              s.bubble,
              item.sender === "me" ? s.myBubble : s.otherBubble,
            ]}
          >
            <Text
              style={[
                s.bubbleText,
                item.sender === "me" && { color: "#fff" },
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Input */}
      <View style={s.inputRow}>
        <TextInput
          placeholder="ส่งข้อความ..."
          style={s.input}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={s.sendBtn}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
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

  /* Search */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
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

  /* Chat list */
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

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },

  headerName: {
    fontSize: 16,
    fontWeight: "600",
  },

  /* Bubble */
  bubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 6,
  },

  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#6C7DD9",
  },

  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F1F1",
  },

  bubbleText: {
    fontSize: 14,
  },

  /* Input */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  input: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
  },

  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#6C7DD9",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
