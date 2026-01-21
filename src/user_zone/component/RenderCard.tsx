import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { UserCard } from '../../../types/type';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RenderCardContent(card: UserCard | null){
  if (!card) return null;

  const currYear = new Date().getFullYear();
  const displayAge = card.birth_year ? currYear - card.birth_year : null;
  const displayName = card.name || 'ไม่ระบุชื่อ';
  const avatarSource = card.image_url
    ? { uri: card.image_url } 
    : require('../../../assets/no-profile.png');

  return (
    <View style={styles.cardContainer}>
      {/* Background Image */}
      <Image 
        source={avatarSource} 
        style={styles.cardImage}
        resizeMode="cover"
      />


      <View style={styles.cardContent}>
        {/* Name & Age */}
        <View style={styles.nameRow}>
          <Text style={styles.nameText} numberOfLines={1} adjustsFontSizeToFit>
            {displayName}
          </Text>
          {displayAge !== null && (
            <View style={styles.ageBadge}>
                 <Text style={styles.ageText}>{displayAge}</Text>
            </View>
          )}
        </View>

        {/* Faculty & Major */}
        {(card.faculty || card.major) && (
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <FontAwesome5 name="university" size={14} color="rgba(255,255,255,0.9)" style={styles.icon} />
              <Text style={styles.infoText} numberOfLines={1}>
                {card.faculty}
                  {card.faculty && card.major && ' • '}
                {card.major}
              </Text>
            </View>
          </View>
        )}

        {/* Bio Section */}
        {card.bio ? (
            <View style={styles.bioContainer}>
                <Text style={styles.bioText} numberOfLines={3}>
                    {card.bio}
                </Text>
            </View>
        ) : null}

        {/* Tags */}
        {card.tag && card.tag.length > 0 && (
          <View style={styles.tagsContainer}>
            {card.tag.map((tag, i) => (
              <View key={`${card.id || 'card'}-tag-${i}`} style={styles.tagBadge}>
                <Text style={styles.tagText}># {tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#2c3e50',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  nameText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginRight: 12,
    // เพิ่มเงาให้ตัวหนังสืออีกนิดเพื่อความชัวร์
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    flexShrink: 1,
  },
  ageBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  infoSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
    width: 18,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)', // ปรับให้ขาวขึ้นอีกนิด
    fontWeight: '500',
    flex: 1,
  },
  bioContainer: {
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.3)',
  },
  bioText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});