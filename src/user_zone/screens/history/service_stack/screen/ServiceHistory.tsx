import { View , Text } from "react-native";
import type { BookingForm } from "../../../service/service_stack/components/BookingModal";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { MainColor , FONT } from "../../../../../../constant/theme";
import apiClient from "../../../../../../constant/axios";
import { useAuth } from "../../../../../AuthProvider";

interface HistoryResType { 
    id : number , 
    provider_name : string ,
    service_name : string
    start_location?: string;
    destination_location: string;
    detail?: string;
    status : 'accepted' |'rejected' | 'pending'
}

export default function ServiceHistory(){
    const [serviceHistory , setServiceHistory] = useState<BookingForm[]>([])

    const {user , token} = useAuth()

    const fetchHistory = async () =>{
        // console.log(user)
        try{
            const res = await apiClient.get(`/api/service-history/user/${user?.id}` , {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })

            // console.log(res.data)

        }catch(err){
            console.log(err)
        }
    }
    
    useEffect(()=>{
        fetchHistory()
    },[])

    return (
        <View>
            <Text>ประวติการใชเงานทั้งหมด</Text>
        </View>
    )
}