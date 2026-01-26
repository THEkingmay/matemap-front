"use client";

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { MemberTabsParamsList } from "../MemberMainTabs";
import { ChatRoom } from "../../../types/type";
import * as SecureStore from "expo-secure-store";
import { styles } from "./styles/ChatMemberStyle";
import { timeAgoTH } from "../../../utils/util";

type props = BottomTabScreenProps<MemberTabsParamsList, "chat">;

export default function ChatScreen({ navigation }: props) {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (!token) {
          console.warn("ไม่เจอ token");
          return;
        }

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/chats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();
        setChats(data);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>ค้นหาการสนทนา...</Text>
      </View>

      <FlatList
        data={chats}
        keyExtractor={item => item.roomId}
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

            <View style={styles.chatContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>

            <Text style={styles.time}>{timeAgoTH(item.lastMessageTime)}</Text>
          </View>
        )}
      />
    </View>
  );
}
