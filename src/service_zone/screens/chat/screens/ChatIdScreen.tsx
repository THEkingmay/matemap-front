import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatStackParamsList } from "../ChatStack";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { BGColor, MainColor, FONT } from "../../../../../constant/theme";
import { supabase } from "../../../../../configs/supabase";

type Props = NativeStackScreenProps<ChatStackParamsList, "chat_select">;

interface MessageDetail {
  id: string;
  room_chat_id: string;
  created_at?: string;
  message: string;
  uid: string;
}

export default function ChatSelectId({ navigation, route }: Props) {
  const room_id = route.params?.room_id;
  const target_name = route.params?.target_name;

  const { user, token } = useAuth();

  const [messages, setMessages] = useState<MessageDetail[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  /* ---------------- Fetch Messages ---------------- */
  const fetchMessagesRoom = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/message?userId=${user?.id}&roomId=${room_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      setMessages(data);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "เกิดข้อผิดพลาดในการดึงข้อความ",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Send Message ---------------- */
  const handleAdd = async () => {
    if (!text.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const messageText = text.trim();

    setIsSending(true);
    setText("");

    // optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        room_chat_id: room_id,
        message: messageText,
        uid: user?.id || "",
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/message?userId=${user?.id}&roomId=${room_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: messageText }),
        }
      );

      if (!res.ok) throw new Error("Failed to send message");
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Toast.show({
        type: "error",
        text1: "เกิดข้อผิดพลาดในการส่งข้อความ",
      });
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  /* ---------------- Realtime ---------------- */
  useEffect(() => {
    fetchMessagesRoom();

    const channel = supabase
      .channel(`chat-${room_id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_message",
          filter: `room_chat_id=eq.${room_id}`,
        },
        (payload) => {
          const newMessage = payload.new as MessageDetail;
          if (newMessage.uid === user?.id) return;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [room_id]);

  /* ---------------- Time Formatter ---------------- */
  const formatTime = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const isSameDay = date.toDateString() === now.toDateString();

    if (isSameDay) {
      // วันนี้ → เวลา
      return date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // เกิน 1 วัน → วันที่ + เวลา
    return (
      date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      }) +
      " " +
      date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  /* ---------------- Render Item ---------------- */
  const renderItem = ({ item }: { item: MessageDetail }) => {
    const isMyMessage = item.uid === user?.id;

    return (
      <View
        style={[
          styles.messageRow,
          isMyMessage ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMyMessage ? styles.myBubble : styles.otherBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.message}
          </Text>

          <Text
            style={[
              styles.timeText,
              isMyMessage ? styles.myTimeText : styles.otherTimeText,
            ]}
          >
            {formatTime(item.created_at || "")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("chat")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {target_name ? `ข้อความของ ${target_name}` : "พูดคุยเลย"}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
        {loading && messages.length === 0 ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color={MainColor} />
          </View>
        ) : (
          <FlatList
            inverted
            data={[...messages].reverse()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="พิมพ์ข้อความ..."
            placeholderTextColor="#999"
            multiline
            editable={!isSending}
          />

          <TouchableOpacity
            onPress={handleAdd}
            disabled={!text.trim() || isSending}
            style={[
              styles.sendButton,
              { opacity: text.trim() ? 1 : 0.5 },
            ]}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BGColor,
  },
  keyboardView: {
    paddingBottom: 10,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: MainColor,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: FONT.BOLD,
    color: "#fff",
  },
  centerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageRow: {
    marginBottom: 10,
    flexDirection: "row",
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: MainColor,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  messageText: {
    fontSize: 15,
    fontFamily: FONT.REGULAR,
    lineHeight: 22,
  },
  myMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#333",
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  myTimeText: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: FONT.REGULAR,
  },
  otherTimeText: {
    color: "#999",
    fontFamily: FONT.REGULAR,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: FONT.REGULAR,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: MainColor,
    justifyContent: "center",
    alignItems: "center",
  },
});
