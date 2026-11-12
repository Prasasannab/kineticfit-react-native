import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  Clock,
  Heart,
  MapPin,
  Star,
  Video,
} from 'lucide-react-native';
import { Trainer } from '@/types';
import { useTheme } from '@/theme';
import { SurfaceCard } from './SurfaceCard';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { HapticButton } from '../buttons/HapticButton';
import { StatusBadge } from '../feedback/StatusBadge';
import { storageService } from '@/services/storage';

export interface TrainerCardProps {
  trainer: Trainer;
  onBookPress: (trainer: Trainer) => void;
  onCardPress?: (trainer: Trainer) => void;
  isFavorited?: boolean;
  onFavoriteToggle?: (trainerId: string, isFav: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export function TrainerCard({
  trainer,
  onBookPress,
  onCardPress,
  isFavorited: propIsFavorited,
  onFavoriteToggle,
  style,
}: TrainerCardProps) {
  const { colors, spacing, radius, typography, isDark } = useTheme();

  // Local state initialized with MMKV or prop
  const [isFav, setIsFav] = useState<boolean>(() => {
    if (propIsFavorited !== undefined) return propIsFavorited;
    const favs = storageService.getFavoriteTrainerIds();
    return favs.includes(trainer.id);
  });

  const handleFavoritePress = () => {
    const nextFav = !isFav;
    setIsFav(nextFav);
    storageService.toggleFavoriteTrainerId(trainer.id);
    onFavoriteToggle?.(trainer.id, nextFav);
  };

  return (
    <SurfaceCard
      style={[styles.card, style]}
      onPress={onCardPress ? () => onCardPress(trainer) : undefined}
    >
      {/* Top Profile Row */}
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: trainer.avatar }}
            style={[
              styles.avatar,
              {
                borderRadius: radius['2xl'],
                borderColor: colors.border.default,
              },
            ]}
          />
          {trainer.isOnlineAvailable ? (
            <View
              style={[
                styles.onlineIndicator,
                {
                  backgroundColor: colors.primary,
                  borderColor: isDark ? colors.background.elevated : '#FFFFFF',
                },
              ]}
            >
              <Video size={10} color="#FFFFFF" strokeWidth={3} />
            </View>
          ) : null}
        </View>

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text
              style={[typography.subtitle1, { color: colors.text.primary, flex: 1 }]}
              numberOfLines={1}
            >
              {trainer.name}
            </Text>

            {/* Favorite Button */}
            <HapticButton
              onPress={handleFavoritePress}
              style={styles.favButton}
              accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={20}
                color={isFav ? colors.primary : colors.text.subtle}
                fill={isFav ? colors.primary : 'transparent'}
              />
            </HapticButton>
          </View>

          <Text
            style={[typography.caption, { color: colors.text.muted, marginTop: 2 }]}
            numberOfLines={1}
          >
            {trainer.title}
          </Text>

          {/* Rating & Location Meta */}
          <View style={[styles.metaRow, { marginTop: spacing.xs }]}>
            <View style={styles.ratingBox}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <Text
                style={[
                  typography.caption,
                  { color: colors.text.primary, fontWeight: '700', marginLeft: 3 },
                ]}
              >
                {trainer.rating.toFixed(2)}
              </Text>
              <Text style={[typography.caption, { color: colors.text.subtle, marginLeft: 2 }]}>
                ({trainer.reviewCount})
              </Text>
            </View>

            {trainer.location ? (
              <View style={[styles.locationBox, { marginLeft: spacing.sm }]}>
                <MapPin size={12} color={colors.text.subtle} />
                <Text
                  style={[
                    typography.caption,
                    { color: colors.text.muted, marginLeft: 2 },
                  ]}
                  numberOfLines={1}
                >
                  {trainer.location}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Specialties Badges */}
      <View style={[styles.specialtiesRow, { marginTop: spacing.md }]}>
        {trainer.specialties.slice(0, 3).map((spec) => (
          <StatusBadge key={spec} label={spec} variant="slate" />
        ))}
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          { backgroundColor: colors.border.subtle, marginVertical: spacing.md },
        ]}
      />

      {/* Bottom Footer: Next Availability & Action */}
      <View style={styles.footerRow}>
        <View style={styles.availabilityCol}>
          <View style={styles.nextTimeRow}>
            <Clock size={13} color={colors.secondary} />
            <Text
              style={[
                typography.caption,
                { color: colors.secondary, fontWeight: '600', marginLeft: 4 },
              ]}
              numberOfLines={1}
            >
              {trainer.nextAvailableText}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[typography.h3, { color: colors.text.primary }]}>
              ${trainer.hourlyRate}
            </Text>
            <Text style={[typography.caption, { color: colors.text.muted, marginLeft: 3 }]}>
              /session
            </Text>
          </View>
        </View>

        <View style={styles.actionCol}>
          <PrimaryButton
            label="Book Session"
            size="sm"
            variant="primary"
            onPress={() => onBookPress(trainer)}
          />
        </View>
      </View>
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 1.5,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favButton: {
    minHeight: 32,
    paddingHorizontal: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityCol: {
    flex: 1,
  },
  nextTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  actionCol: {
    marginLeft: 12,
  },
});
