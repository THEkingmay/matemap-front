import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import type { User } from "../types/type";
import Loading from "./components/loading";


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>; 
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
});

const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const login = async (email: string, password: string) => {

    try {
      // console.log("get email pass ", email , password)
      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("DATA from login " , data)
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
      await SecureStore.setItemAsync("token", data.token);
      setUser(data.user);

    } catch (err) {
      throw err; 
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    } 
  };

  const loginWithToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      console.log("TOKEN " , token)
      if (token) {
        const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/user/login-with-token`, {
          method: "POST", 
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // อัปเดตข้อมูล User ล่าสุดจาก Server
        } else {
          await logout();
        }
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("Auto-login error:", (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loginWithToken();
  }, []);

  if(isLoading){
    return(
        <Loading/>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      { children} 
    </AuthContext.Provider>
  );
}

export { useAuth };