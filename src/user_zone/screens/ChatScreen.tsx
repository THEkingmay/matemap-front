import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { UserTabsParamsList } from '../UserMainTabs';

type props = BottomTabScreenProps<UserTabsParamsList, 'chat'>;

const MOCK_CHATS = [
  {
    id: '1',
    name: 'nicha',
    message: 'หอพักอยู่ใกล้มหาวิทยาลัยไหมคะ?',
    time: 'เมื่อสักครู่',
  },
  {
    id: '2',
    name: 'Mook',
    message: 'สนใจมาเป็นรูมเมทกันไหม เราเข้าแล้ว',
    time: '30 นาที',
  },
  {
    id: '3',
    name: 'Bell',
    message: 'เราสนใจหอห้องแบบนี้เหมือนกัน',
    time: '1 ชม.',
  },
];

export default function ChatScreen({ navigation }: props) {
  return (
    <View style={styles.container}>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchText}>ค้นหาการสนทนา...</Text>
      </View>

      {/* Chat list */}
      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chatItem}>

            {/* Avatar placeholder */}
            <View style={styles.avatar} />

            {/* Chat info */}
            <View style={styles.chatContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message} numberOfLines={1}>
                {item.message}
              </Text>
            </View>

            {/* Time */}
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  searchBar: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  searchText: {
    color: '#999999',
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D9D9D9',
    marginRight: 12,
  },

  chatContent: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontFamily: 'Kanit_600SemiBold',
    color: '#000',
    marginBottom: 2,
  },

  message: {
    fontSize: 14,
    fontFamily: 'Kanit_400Regular',
    color: '#777777',
  },

  time: {
    fontSize: 12,
    fontFamily: 'Kanit_400Regular',
    color: '#AAAAAA',
    marginLeft: 8,
  },
});
