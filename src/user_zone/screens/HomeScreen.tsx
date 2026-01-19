import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Animated, 
  PanResponder, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import type { UserTabsParamsList } from '../UserMainTabs';
import type { UserCard } from '../../../types/type';
import { FONT } from '../../../constant/theme';
import { useAuth } from '../../AuthProvider';
import RenderCardContent from '../component/RenderCard';

type Props = BottomTabScreenProps<UserTabsParamsList, 'home'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function HomeScreen({ navigation }: Props) {
  const { user , token} = useAuth();
  const [cards, setCards] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  //State ตัวนี้เพื่อกันการกระพริบ
  const [isNextCardTransition, setIsNextCardTransition] = useState(false);
  // Use a ref to track cards for the PanResponder to avoid stale closures
  const cardsRef = useRef<UserCard[]>([]); 

  const position = useRef(new Animated.ValueXY()).current;

  // Sync ref with state whenever cards change
  useEffect(() => {
    cardsRef.current = cards;
    if (isNextCardTransition) {
      position.setValue({ x: 0, y: 0 }); // รีเซ็ตตำแหน่งตอนที่เป็นการ์ดใบใหม่แล้ว
      setIsNextCardTransition(false);    // ปลดล็อคให้ขยับได้
    }
  }, [cards]);

  // --- Logic: Fetch Users ---
  const fetchMoreUsers = useCallback(async (currentCards: UserCard[]) => {
    if (isLoading || !user?.id) return;

    try {
      setIsLoading(true);
      
      // Create exclude string from the IDs currently in the deck
      const excludeIds = currentCards.map(c => c.id).join(',');
      
      // console.log('Fetching more... Exclude:', excludeIds);

      // FIX: Corrected URL structure
      const url = `${process.env.EXPO_PUBLIC_BASE_API_URL}/api/swipe/get-new-user?id=${user.id}&exclude=${excludeIds}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          // Fix: 'Authorization' instead of 'Athorization'
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json', // Good practice to include this
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        setCards(prev => [...prev, ...data.data]);
      } else {
        console.log("No new users found.");
      }

    } catch (err) {
      console.error("Error fetching cards:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, isLoading]);

  // Initial Load
  useEffect(() => {
    fetchMoreUsers([]);
  }, []); // Run once on mount

  // --- PanResponder ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Only allow movement if there are cards
        if (cardsRef.current.length > 0) {
           position.setValue({ x: gestureState.dx, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (cardsRef.current.length === 0) return;

        if (gestureState.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = async (direction: 'right' | 'left') => {
    // 1. เก็บค่าของปัจจุบันไว้ก่อน เพราะเดี๋ยวเราจะลบออกจาก State
    const item = cardsRef.current[0];
    const swipeAction = direction === 'left' ? 'pass' : 'like';

    if (!item) return;

    // ---------------------------------------------------------
    // ✅ STEP 1: UI UPDATE (ทำทันที ไม่ต้องรอ API)
    // ---------------------------------------------------------
    setIsNextCardTransition(true);
    
    setCards((prevCards) => {
      const remainingCards = prevCards.slice(1);
      // เช็คว่าต้อง load เพิ่มไหม
      if (remainingCards.length <= 3 && !isLoading) {
         fetchMoreUsers(remainingCards);
      }
      return remainingCards;
    });

    // ---------------------------------------------------------
    // ✅ STEP 2: API CALL (ทำเบื้องหลัง)
    // ---------------------------------------------------------
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/api/swipe/update-swipe`, {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ // ต้องแปลงเป็น JSON string
          id: user?.id, // ID เรา
          target_id: item.id, // ID คนที่เราปัด
          action: swipeAction
        })
      });

      const data = await res.json();

      // ---------------------------------------------------------
      // ✅ STEP 3: HANDLE MATCH (ถ้าแมทช์ ค่อยเด้ง Modal)
      // ---------------------------------------------------------
      if (res.ok && data.is_match) {
        // ตรงนี้แนะนำให้ set state เพื่อเปิด Modal แสดงความยินดี
        // setMatchData({ user: item, matchId: data.match_id });
        Alert.alert("ดีใจด้วย" , `คุณแมทช์กับผู้ใช้ ${data.targetName}`)
        console.log("It's a Match!"); 
      }

    } catch (error) {
      console.error("Swipe API Error:", error);
    }
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  // --- Animations ---
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });

  const rotateAndTranslate = {
    transform: [{ rotate: rotate }, ...position.getTranslateTransform()]
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });
  
  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  });

  const renderCards = () => {
    if (cards.length === 0) {
      return (
        <View style={[styles.cardContainer, {justifyContent:'center', alignItems:'center', borderWidth: 0}]}>
          {isLoading ? (
             <ActivityIndicator size="large" color="#4834D4" />
          ) : (
             <Text style={{color:'#888888' , fontSize :24 ,fontFamily: FONT.REGULAR }}>ไม่มีเพื่อนแนะนำแล้ว</Text>
          )}
        </View>
      )
    }

    return cards.map((item, i) => {
      if (i === 0) {
        // ✅ 4. ตรวจสอบว่าถ้ากำลังเปลี่ยนการ์ด ให้ใช้ Style นิ่งๆ (ไม่หมุน ไม่ขยับ)
        const animatedStyle = isNextCardTransition 
          ? { transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: '0deg' }] } 
          : rotateAndTranslate;

        // ✅ 5. ซ่อนป้าย LIKE/NOPE ด้วยถ้ากำลังเปลี่ยนการ์ด
        const labelOpacity = isNextCardTransition ? 0 : 1;

        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={item.id}
            style={[rotateAndTranslate, styles.cardContainer, { zIndex: 1 }]}
          >
             <Animated.View style={{ opacity: likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={styles.likeLabel}>LIKE</Text>
            </Animated.View>
            <Animated.View style={{ opacity: nopeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={styles.nopeLabel}>NOPE</Text>
            </Animated.View>

            {RenderCardContent(item)}
          </Animated.View>
        );
      } 
      else if (i === 1) {
        return (
          <Animated.View
            key={item.id}
            style={[styles.cardContainer, { zIndex: 0, transform: [{ scale: 0.95 }], top: 10 }]}
          >
            {RenderCardContent(item)}
          </Animated.View>
        );
      }
      return null;
    }).reverse();
  };


  return (
    <SafeAreaView style={styles.container} edges={['top']}> 
      <View style={styles.header}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            {/* Ensure path is correct for your assets */}
           <Image source={require('../../../assets/favicon.png')} style={{width : 40 , height : 40, marginRight: 10}}/>
             <Text style={styles.headerTitle}>matemap</Text>
        </View>
      </View>

      <View style={{flex: 1}}>
        <View style={{flex: 1, padding: 10}}>
           {renderCards()}
        </View>
      </View>

      {/* Disable buttons if no cards */}
      {cards.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.circleButton, styles.shadow]} onPress={() => forceSwipe('left')}>
            <Ionicons name="close" size={30} color="#FF5252" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.circleButton, styles.shadow, { backgroundColor: '#FF6B6B' }]} onPress={() => forceSwipe('right')}>
            <Ionicons name="heart" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { fontSize: 24, color: '#4834D4', fontWeight: 'bold', fontFamily: FONT.BOLD }, // Ensure Font is loaded
  cardContainer: {
    position: 'absolute',
    height: SCREEN_HEIGHT * 0.72,
    width: SCREEN_WIDTH - 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth : 0.5 ,
    borderColor : '#bebebe'
  },
  gradientOverlay: { 
      position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%', 
      backgroundColor: 'rgba(0,0,0,0.3)' // Simple overlay to make text pop
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  nameText: { fontSize: 26, color: '#FFFFFF', fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoText: { color: '#E0E0E0', fontSize: 14, fontWeight: '500' },
  actionRowOverlay: { flexDirection: 'row', flexWrap:'wrap', marginTop: 10 },
  overlayButton: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 5 },
  overlayButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 20, position: 'absolute', bottom: 20, left: 0, right: 0 },
  circleButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  shadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  likeLabel: { borderWidth: 3, borderColor: '#4CD964', color: '#4CD964', fontSize: 32, fontWeight: '800', padding: 10, borderRadius: 10 },
  nopeLabel: { borderWidth: 3, borderColor: '#FF3B30', color: '#FF3B30', fontSize: 32, fontWeight: '800', padding: 10, borderRadius: 10 }
});