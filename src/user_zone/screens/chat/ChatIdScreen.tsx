import { 
    Text, 
    View, 
    FlatList, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    KeyboardAvoidingView, 
    Platform,
    ActivityIndicator
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ChatStackParamsList } from "./ChatStack";
import Toast from "react-native-toast-message";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../AuthProvider";
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaView } from "react-native-safe-area-context";
import { MainColor } from "../../../../constant/theme";

type Props = NativeStackScreenProps<ChatStackParamsList, 'chat_select'>

interface MessageDetail { 
    id: string; 
    room_chat_id: string;
    created_at?: string;
    message: string; 
    uid: string; 
}

export default function ChatSelectId({ navigation, route }: Props) {
    const { room_id , target_name} = route.params;
    const { user, token } = useAuth();
    const [messages, setMessages] = useState<MessageDetail[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    
    const flatListRef = useRef<FlatList>(null);

    const fetchMessagesRoom = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/message?userId=${user?.id}&roomId=${room_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();
            setMessages(data); 

        } catch (err) {
            Toast.show({
                type: "error",
                text1: 'เกิดข้อผิดพลาดในการดึงข้อความ'
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleAdd = async () => {
        if (!text.trim()) return;
        
        try{
            setText("");
        }catch(err){

        }finally{
            
        }
        
    }

    useEffect(() => { 
        fetchMessagesRoom(); 
    }, [room_id]);

    const formatTime = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    };

    const renderItem = ({ item }: { item: MessageDetail }) => {
        const isMyMessage = item.uid === user?.id;

        return (
            <View style={[
                styles.messageRow, 
                isMyMessage ? styles.myMessageRow : styles.otherMessageRow
            ]}>
                {!isMyMessage && (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={16} color="#fff" />
                    </View>
                )}
                
                <View style={[
                    styles.bubble, 
                    isMyMessage ? styles.myBubble : styles.otherBubble
                ]}>
                    <Text style={[
                        styles.messageText, 
                        isMyMessage ? styles.myMessageText : styles.otherMessageText
                    ]}>
                        {item.message}
                    </Text>
                    <Text style={[
                        styles.timeText,
                        isMyMessage ? styles.myTimeText : styles.otherTimeText
                    ]}>
                        {formatTime(item.created_at || '')}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        // ใช้ edges เพื่อกันไม่ให้ SafeAreaView ดันด้านล่างซ้ำซ้อนกับ KeyboardAvoidingView
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            
            {/* Header: อยู่นอก KeyboardAvoidingView เพื่อให้ตรึงอยู่กับที่ */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={MainColor} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>ห้องสนทนา {target_name}</Text>
                </View>
            </View>

            {/* KeyboardAvoidingView: คลุมทั้ง List และ Input */}
            <KeyboardAvoidingView 
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : undefined} 
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                {loading && messages.length === 0 ? (
                    <View style={styles.centerLoader}>
                        <ActivityIndicator size="large" color={MainColor} />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        // เมื่อคีย์บอร์ดขึ้น ขนาด list เปลี่ยน มันจะเลื่อนลงล่างให้อัตโนมัติ
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        value={text}
                        onChangeText={setText}
                        placeholder="พิมพ์ข้อความ..."
                        placeholderTextColor="#999"
                        multiline // รองรับการพิมพ์หลายบรรทัด
                    />
                    <TouchableOpacity 
                        onPress={handleAdd} 
                        style={[styles.sendButton, { opacity: text.trim() ? 1 : 0.5 }]}
                        disabled={!text.trim()}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 10,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubTitle: {
        fontSize: 12,
        color: '#666',
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 16,
        paddingHorizontal: 12,
        flexGrow: 1,
        justifyContent: 'flex-end', // ให้แชทเริ่มจากด้านล่างถ้าข้อความน้อย
    },
    messageRow: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    otherMessageRow: {
        justifyContent: 'flex-start',
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#BDBDBD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    bubble: {
        maxWidth: '75%',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
    },
    myBubble: {
        backgroundColor: MainColor,
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#333',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myTimeText: {
        color: 'rgba(255,255,255,0.8)',
    },
    otherTimeText: {
        color: '#999',
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 0 : 10, // ปรับ padding ล่างเผื่อไว้
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginRight: 10,
        maxHeight: 100, // จำกัดความสูงถ้าพิมพ์ยาว
        minHeight: 40,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: MainColor,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
});