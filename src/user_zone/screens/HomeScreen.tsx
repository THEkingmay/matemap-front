import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Animated, 
  PanResponder, 
  TouchableOpacity 
} from 'react-native';
// เปลี่ยนการเรียกใช้ SafeAreaView เป็นตัวใหม่ (มาตรฐานใหม่)
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import type { UserTabsParamsList } from '../UserMainTabs';
import type { UserCard } from '../../../types/type';

// --- Types ---
type Props = BottomTabScreenProps<UserTabsParamsList, 'home'>;


// --- Dummy Data ---
const MOCK_DATA: UserCard[] = Array.from({ length: 20 }).map((_, index) => ({
  id: String(index),
  name: index % 2 === 0 ? `Mook ${index + 1}` : `Fern ${index + 1}`,
  age: 2,
  faculty: 'คณะศิลปศาสตร์และวิทยาศาสตร์',
  major: 'สาขา วิทยาการคอมพิวเตอร์',
  tags: ['รักสะอาด', 'เข้านอนเร็ว', 'ตื่นเช้า'],
  image_url: `https://images.unsplash.com/photo-${index % 2 === 0 ? '1544005313-94ddf0286df2' : '1438761681033-6461ffad8d80'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
}));

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

export default function HomeScreen({ navigation }: Props) {
  const [cards, setCards] = useState<UserCard[]>([]);
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    setCards(MOCK_DATA);
  }, []);

  // --- PanResponder ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
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

  const onSwipeComplete = (direction: 'right' | 'left') => {
    const item = cards[0];
    // Reset position
    position.setValue({ x: 0, y: 0 });
    setCards((prevCards) => prevCards.slice(1));
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
        <View style={[styles.cardContainer, {justifyContent:'center', alignItems:'center'}]}>
          <Text style={{color:'#888'}}>ไม่มีเพื่อนแนะนำแล้ว</Text>
        </View>
      )
    }

    return cards.map((item, i) => {
      if (i === 0) {
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

            {renderCardContent(item)}
          </Animated.View>
        );
      } 
      else if (i === 1) {
        return (
          <Animated.View
            key={item.id}
            style={[styles.cardContainer, { zIndex: 0, transform: [{ scale: 0.95 }], top: 10 }]}
          >
            {renderCardContent(item)}
          </Animated.View>
        );
      }
      return null;
    }).reverse();
  };

  const renderCardContent = (card: UserCard) => (
    <>
      <Image source={{ uri: card.image_url }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.nameRow}>
          <Text style={styles.nameText}>{card.name} , ปี {card.age}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome5 name="university" size={14} color="#DDD" style={{ marginRight: 8 }} />
          <View>
            <Text style={styles.infoText}>{card.faculty}</Text>
            <Text style={styles.infoText}>{card.major}</Text>
          </View>
        </View>
        <View style={styles.actionRowOverlay}>
          {card.tags?.map((tag, i) => (
             <View key={i} style={styles.overlayButton}><Text style={styles.overlayButtonText}>{tag}</Text></View>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}> 
      {/* edges=['top'] ช่วยจัดการเฉพาะส่วนบน ไม่ให้กินพื้นที่ status bar */}
      
      <View style={styles.header}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image source={require('../../../assets/favicon.png')} style={{width : 50 , height : 50}}/>
             <Text style={styles.headerTitle}>matemap</Text>
        </View>
      </View>

      <View style={{flex: 1}}>
        <View style={{flex: 1, padding: 10}}>
           {renderCards()}
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.circleButton, styles.shadow]} onPress={() => forceSwipe('left')}>
          <Ionicons name="close" size={30} color="#FF5252" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.circleButton, styles.shadow, { backgroundColor: '#FF6B6B' }]} onPress={() => forceSwipe('right')}>
          <Ionicons name="heart" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 20, paddingVertical: 10 },
  headerTitle: { fontSize: 20, color: '#4834D4', fontWeight: 'bold' },
  cardContainer: {
    position: 'absolute',
    height: SCREEN_HEIGHT * 0.72,
    width: SCREEN_WIDTH - 20,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: { flex: 1, width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '50%' },
  cardContent: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  nameText: { fontSize: 26, color: '#FFFFFF', fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoText: { color: '#E0E0E0', fontSize: 14 },
  actionRowOverlay: { flexDirection: 'row', flexWrap:'wrap', marginTop: 10 },
  overlayButton: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 5 },
  overlayButtonText: { color: '#FFF', fontSize: 12 },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 20, position: 'absolute', bottom: 20, left: 0, right: 0 },
  circleButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  shadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  likeLabel: { borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 },
  nopeLabel: { borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }
});