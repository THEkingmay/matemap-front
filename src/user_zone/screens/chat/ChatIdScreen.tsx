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

import { supabase } from "../../../../configs/supabase";

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
    
    const [isSending, setIsSending] = useState<boolean>(false);

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
        let tempId = `temp-id-${Date.now()}`;
        try{
            let newMessage = text.trim();
           
            setIsSending(true);
            setMessages(prev => [...prev, {
                id: tempId,
                room_chat_id: room_id,
                message: text.trim(),
                uid: user?.id || "" ,
                created_at: new Date().toISOString()
            }]);    
            setText("");

            const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/message?userId=${user?.id}&&roomId=${room_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({  
                    message: newMessage
                })
            });
            if (!res.ok) throw new Error("Failed to send message");

            setText("");
         }catch(err){
            // ลบข้อความชั่วคราวที่ส่งไม่สำเร็จ
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
            console.error(err);
            Toast.show({
                type: "error",
                text1: 'เกิดข้อผิดพลาดในการส่งข้อความ'
            });
        }finally{
            setIsSending(false);
        }   
        
    }

    useEffect(() => { 
        fetchMessagesRoom(); 
 
        //realtime chat
        const channel = supabase.channel(`chat-${room_id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'chat_message',
                    filter: `room_chat_id=eq.${room_id}`
                },
                (payload) => {              
                    const newMessage = payload.new as MessageDetail; 
                     
                    //ถ้า uid ของข้อความใหม่ตรงกับ user ปัจจุบัน แสดงว่าเราเพิ่งส่งไปแล้ว ไม่ต้องเพิ่มซ้ำ
                    if(newMessage.uid === user?.id) return;
                    
                    setMessages(prev => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };

    }, [room_id]);

    const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    // เปรียบเทียบว่าเป็นวันเดียวกันหรือไม่ (ตัดเรื่องเวลาออก ดูแค่วัน เดือน ปี)
    const isSameDay = date.toDateString() === now.toDateString();

    if (isSameDay) {
        // กรณี: วันนี้ -> แสดงเวลา (เช่น 14:30)
        return date.toLocaleTimeString('th-TH', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } else {
        // กรณี: เกิน 1 วัน (คนละวัน) -> แสดงวันที่ (เช่น 23 ม.ค. 67)
        return date.toLocaleDateString('th-TH', { 
            day: 'numeric', 
            month: 'short', 
            year: '2-digit' // หรือตัดออกถ้าไม่อยากให้แสดงปี
        });
    }
};
    const renderItem = ({ item }: { item: MessageDetail }) => {
        const isMyMessage = item.uid === user?.id;

        return (
            <View style={[
                styles.messageRow, 
                isMyMessage ? styles.myMessageRow : styles.otherMessageRow
            ]}>
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
                    <Ionicons name="chevron-back" size={28} color={'#ffffff'} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>ข้อความของ {target_name}</Text>
                </View>
            </View>

            {/* KeyboardAvoidingView: คลุมทั้ง List และ Input */}
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
                        multiline // รองรับการพิมพ์หลายบรรทัด
                        editable={!isSending}
                    />
                    <TouchableOpacity 
                        onPress={handleAdd} 
                        style={[styles.sendButton, { opacity: text.trim() ? 1 : 0.5 }]}
                        disabled={!text.trim() || isSending}
                    >
                        <Ionicons name={"send"} size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: MainColor,
        borderBottomWidth: 1,
        borderBottomColor: '#ffffff',
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
        color: '#ffffff',
    },
    headerSubTitle: {
        fontSize: 12,
        color: '#ffffff',
    },
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 10,
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