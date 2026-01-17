import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, ActivityIndicator, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const KU_GREEN = '#005C42';

export default function Loading() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle} />
      
      <Animated.View style={[styles.contentContainer, { opacity: opacityAnim }]}>
        <View style={styles.logoWrapper}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: scaleAnim }] }]} />
          <Animated.Image 
            source={require('../../assets/favicon.png')} 
            style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Matemap</Text>
        <Text style={styles.subtitle}>ระบบจัดหารูมเมทเพื่อนิสิต</Text>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={KU_GREEN} />
          <Text style={styles.loadingText}>กำลังเชื่อมต่อข้อมูล...</Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Kasetsart University</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    top: -width * 0.5,
    right: -width * 0.3,
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: 'rgba(0, 92, 66, 0.03)',
  },
  contentContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  pulseCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 92, 66, 0.05)',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 36,
    color: KU_GREEN,
    letterSpacing: 1,
    marginBottom: 8, 
    fontFamily : 'Kanit_700Bold'
  },
  subtitle: {
    fontSize: 18,
    fontFamily : 'Kanit_700Bold' ,
    color: '#555555',
    marginBottom: 40,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666666',
    fontFamily :'Kanit_700Bold'
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#AAAAAA',
    letterSpacing: 1.5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});