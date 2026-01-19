import React, { useCallback } from 'react';
import { View } from 'react-native'; // 1. ต้อง import View มาใช้ครอบ
import ToastManager from 'toastify-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Kanit_400Regular, 
  Kanit_700Bold 
} from '@expo-google-fonts/kanit';

import AuthProvider from './src/AuthProvider';
import RouteProtect from './src/RouteProtect';
import { FONT } from './constant/theme';

// 2. สั่งค้าง Splash Screen ไว้ก่อน
SplashScreen.preventAutoHideAsync();

export default function App() {
  // 3. โหลดฟอนต์
  let [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  // 4. ฟังก์ชันสำหรับปิด Splash Screen เมื่อ View หลักถูกวาดเสร็จ
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // 5. ถ้าฟอนต์ยังไม่มา ห้าม render อะไรเลย (Return null)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <RouteProtect/>
        <ToastManager />
      </AuthProvider>
    </View>
  );
}