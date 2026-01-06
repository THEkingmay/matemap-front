// หน้านี้จะจัดการเป็นตัวหุ่มดานการยืนยัน
import React, { createContext , ReactNode, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { View , Text} from "react-native";
import { globalStyles } from "../globalStyle";

interface AuthType { 
    id: string | null,
    login : ()=>void ,
    logout : ()=>void
}

const AuthContext = createContext<AuthType | null>(null)

export function useAuth(){
    return useContext(AuthContext)
}

export default function AuthProvider({children} : {children : ReactNode}){
    const [loading ,setLoading] = useState<boolean>(false)

    const [id , setId] = useState<string|null>(null)

    const fetchUserId = async () => {
        try {
            setLoading(true);

            // 1. จำลอง Delay (ลบออกได้ตอน Production)
            await new Promise((r) => setTimeout(r, 2000));

            // 2. ดึง Token
            const token = await SecureStore.getItemAsync('token');

            // 3. เช็คดักไว้ก่อน: ถ้าไม่มี Token ให้จบการทำงานเลย
            if (!token) {
                setId(null);
                return; 
            }

            // 4. ถ้ามี Token ให้ยิงไปตรวจกับหลังบ้าน (ต้องแนบ Header)
            const res = await fetch('YOUR_API_ENDPOINT/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Token expired or invalid');
            }

            const data = await res.json();
            
            if (data?.id) {
                setId(data.id);
            } else {
                throw new Error('User ID not found');
            }

        } catch (err) {
            console.log('Auth Error:', err);
            setId(null);
            await SecureStore.deleteItemAsync('token'); 
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchUserId()
    },[])

    const login = async ()=>{
        console.log('all API to Login here')
    }
    const logout= async ()=>{
        console.log("logout")
    }

    if(loading){
        return(
            <View style={globalStyles.container}>
                <Text>ยินดีต้อนรับ</Text>
            </View>
        )
    }

    return(
        <AuthContext.Provider value={{login , logout ,id }}>
            {children}
        </AuthContext.Provider>
    )

}