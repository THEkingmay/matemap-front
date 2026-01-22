import { createContext , ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Toast } from "toastify-react-native";
import LoadingCheckIsExpired from "./components/loadingIsExpired";
import ExpiredScreen from "./components/ExpiredScreen";

type SubscriptionType= {
    is_expired : boolean
}

const SubscriptionContext = createContext<SubscriptionType>({is_expired : false})

export const useSubscription = () => useContext(SubscriptionContext)

export default function SubscriptionProvider({children} :{children : ReactNode}){

    const [is_expired , setIsExpried] = useState<boolean>(false)
    const {logout , user} = useAuth()
    const [loading , setIsLoading] = useState<boolean>(true)

    useEffect(()=>{
        const checkIsExpired = async ()=>{
            try{
                setIsLoading(true)

                // ตรวจสอบสถานะบัญชีจากตาราง subscription
                const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/subscription?userId=${user?.id}`, {
                    method :"GET"
                })

                const data = await res.json()
                if(!res.ok) throw new Error(data.message)

                setIsExpried(data.is_expired)

            }catch(err){
                Toast.error((err as Error).message)
            }finally{
                setIsLoading(false)
            }
        }
        checkIsExpired()
    }, [])

    if(loading){
        return(
            <LoadingCheckIsExpired/>
        )
    }

    if(!loading && is_expired){
        return <ExpiredScreen onLogout={logout}/>
    }

    return(
        <SubscriptionContext.Provider value={{is_expired}}>
            {children}
        </SubscriptionContext.Provider>
    )
}