import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

/* ================== TYPES ================== */
type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  createdAt: Date;
};

/* ================== DATE FORMAT ================== */
const formatDateTH = (date: Date) => {
  const day = date.getDate();
  const monthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  const month = monthNames[date.getMonth()];
  const year = (date.getFullYear() + 543).toString().slice(2);
  return `${day} ${month} ${year}`;
};

/* ================== MOCK MESSAGES ================== */
const MOCK_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "ยังมีห้องว่างค่ะ สนใจดูห้องไหมคะ?",
      sender: "other",
      createdAt: new Date("2026-01-26"),
    },
    {
      id: "2",
      text: "ว่างทั้ง 2 ตึกเลยค่ะ ทั้ง A และ B",
      sender: "other",
      createdAt: new Date("2026-01-27"),
    },
    {
      id: "3",
      text: "โอเคครับ",
      sender: "me",
      createdAt: new Date("2026-01-27"),
    },
  ],
  "2": [
    {
      id: "1",
      text: "ขอรายละเอียดงานหน่อยครับ",
      sender: "me",
      createdAt: new Date("2026-01-25"),
    },
    {
      id: "2",
      text: "ได้เลย เดี๋ยวส่งให้ค่ะ",
      sender: "other",
      createdAt: new Date("2026-01-25"),
    },
  ],
  "3": [
    {
      id: "1",
      text: "มีห้องว่างไหมครับ",
      sender: "me",
      createdAt: new Date("2026-01-25"),
    },
    {
      id: "2",
      text: "มีค่ะสนใจ เข้ามาดูห้องได้นะค่ะ",
      sender: "other",
      createdAt: new Date("2026-01-25"),
    },
  ],
};

/* ================== SCREEN ================== */
export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const chatId = route.params?.chatId;
  const chatName = route.params?.chatName ?? "แชท";

  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES[chatId] || []
  );
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: input,
        sender: "me",
        createdAt: new Date(),
      },
    ]);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ================== HEADER ================== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {chatName}
        </Text>
      </View>

      {/* ================== CHAT LIST ================== */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === "me" ? styles.me : styles.other,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.sender === "me" && { color: "#FFF" },
              ]}
            >
              {item.text}
            </Text>

            <Text
              style={[
                styles.timeText,
                item.sender === "me" && { color: "#EAEAFF" },
              ]}
            >
              {formatDateTH(item.createdAt)}
            </Text>
          </View>
        )}
      />

      {/* ================== INPUT ================== */}
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="พิมพ์ข้อความ..."
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 20,
    height: 80,
    backgroundColor: "#8A9AD6",
  },

  backText: {
    fontSize: 40,
    color: "#FFF",
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
    flex: 1,
  },

  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 14,
    marginVertical: 6,
  },

  me: {
    backgroundColor: "#8A9AD6",
    alignSelf: "flex-end",
    marginRight: 6,
    borderTopRightRadius: 4,
  },

  other: {
    backgroundColor: "#F2F2F2",
    alignSelf: "flex-start",
    marginLeft: 6,
    borderTopLeftRadius: 4,
  },

  messageText: {
    fontSize: 15,
    color: "#000",
  },

  timeText: {
    fontSize: 11,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 4,
  },

  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#FFF",
  },

  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },

  sendButton: {
    marginLeft: 8,
    backgroundColor: "#8A9AD6",
    borderRadius: 22,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  sendText: {
    color: "#FFF",
    fontSize: 18,
  },
});
