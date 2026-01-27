"use client";

import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Image, Pressable } from "react-native";
import { ChatRoom } from "../../../../types/type";
import * as SecureStore from "expo-secure-store";
import { styles } from "../styles/ChatMemberStyle";
import { timeAgoTH } from "../../../../utils/util";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatStackParamsList } from "./ChatStack";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

type Props = NativeStackScreenProps<ChatStackParamsList, "chat_list">;

export default function ChatScreen({ navigation }: Props) {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    setLoading(true);

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/chats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch chats");

      const data = await res.json();
      setChats(data);
    } catch (err) {
      console.error("Fetch chats failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, []),
  );

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>ค้นหาการสนทนา...</Text>
      </View>

      {loading && chats.length === 0 ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.roomId}
          refreshing={loading}
          ListEmptyComponent={!loading ? <Text>ยังไม่มีการสนทนา</Text> : null}
          renderItem={({ item }) => (
            <View style={styles.chatItem}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.chatContent,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() =>
                  navigation.navigate("chat_member_id", {
                    roomId: item.roomId,
                    partnerName: item.name,
                  })
                }
              >
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.message} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </Pressable>

              <Text style={styles.time}>{timeAgoTH(item.lastMessageTime)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
