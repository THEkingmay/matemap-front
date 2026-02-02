import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) return 'com.punhameemai.matemap.dev';
  if (IS_PREVIEW) return 'com.punhameemai.matemap.preview';
  return 'com.punhameemai.matemap'; // Production
};

const getAppName = () => {
  if (IS_DEV) return 'Mate-map (Dev)';
  if (IS_PREVIEW) return 'Mate-map (Preview)';
  return 'Mate-map KUKPS'; // ชื่อจริงตอนขึ้น Store
};

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: getAppName(),
    slug: "matemap-front",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: getUniqueIdentifier(), 
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      predictiveBackGestureEnabled: false,
      package: getUniqueIdentifier(),
      softwareKeyboardLayoutMode: "resize"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-secure-store",
      "expo-font"
    ],
    extra: {
      eas: {
        projectId: "7e7d0fd6-6248-46bb-891b-25eeb029344b"
      }
    }
  };
};