import React, { useRef, useState, useEffect } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Award,
  ChevronLeft,
  Clock,
  Heart,
  Star,
  Video,
} from 'lucide-react-native';
import { BookingSession, BookingSlot, Trainer } from '@/types';
import { useTheme } from '@/theme';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { HapticButton } from '@/components/buttons/HapticButton';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { HorizontalCalendarStrip } from '@/components/calendar/HorizontalCalendarStrip';
import { SlotGrid } from '@/components/calendar/SlotGrid';
import { BookingCheckoutSheet } from '@/features/booking/components/BookingCheckoutSheet';
import { useSlotAvailability } from '@/features/booking/hooks/useSlotAvailability';
import { storageService } from '@/services/storage';

export interface TrainerDetailModalProps {
  trainer: Trainer | null;
  visible: boolean;
  onClose: () => void;
  onBookingConfirmed: (booking: BookingSession) => void;
}

export function TrainerDetailModal({
  trainer,
  visible,
  onClose,
  onBookingConfirmed,
}: TrainerDetailModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, typography, isDark } = useTheme();

  useEffect(() => {
    if (visible) {
      RNStatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    }
  }, [visible, isDark]);

  // Selected date state (defaults to today YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  });

  const [checkoutSlot, setCheckoutSlot] = useState<BookingSlot | null>(null);
  const checkoutSheetRef = useRef<BottomSheetModal>(null);

  const [isFav, setIsFav] = useState<boolean>(false);

  // Slot availability hook
  const {
    slots,
    selectedSlot,
    selectSlot,
    refreshSlots,
  } = useSlotAvailability(trainer?.id ?? '', selectedDate);

  // Sync favorites
  React.useEffect(() => {
    if (trainer) {
      const favs = storageService.getFavoriteTrainerIds();
      setIsFav(favs.includes(trainer.id));
    }
  }, [trainer]);

  if (!trainer) return null;

  const handleFavoriteToggle = () => {
    const updated = storageService.toggleFavoriteTrainerId(trainer.id);
    setIsFav(updated.includes(trainer.id));
  };

  const handleOpenCheckout = () => {
    if (selectedSlot) {
      setCheckoutSlot(selectedSlot);
      checkoutSheetRef.current?.present();
    }
  };

  const handleConfirmed = (booking: BookingSession) => {
    refreshSlots();
    onBookingConfirmed(booking);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background.base} />
      <View style={[styles.modalCanvas, { backgroundColor: colors.background.base }]}>
        {/* Navigation Bar */}
        <View
          style={[
            styles.navBar,
            {
              paddingTop: insets.top > 0 ? insets.top : spacing.base,
              paddingHorizontal: spacing.base,
              borderBottomColor: colors.border.subtle,
            },
          ]}
        >
          <HapticButton onPress={onClose} style={styles.navButton}>
            <ChevronLeft size={24} color={colors.text.primary} />
          </HapticButton>

          <Text
            style={[typography.subtitle1, { color: colors.text.primary, flex: 1, textAlign: 'center' }]}
            numberOfLines={1}
          >
            Trainer Profile & Booking
          </Text>

          <HapticButton onPress={handleFavoriteToggle} style={styles.navButton}>
            <Heart
              size={22}
              color={isFav ? colors.primary : colors.text.muted}
              fill={isFav ? colors.primary : 'transparent'}
            />
          </HapticButton>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
        >
          {/* Profile Header */}
          <View style={[styles.profileHeader, { padding: spacing.base }]}>
            <Image
              source={{ uri: trainer.avatar }}
              style={[
                styles.profileAvatar,
                {
                  borderRadius: radius['2xl'],
                  borderColor: colors.border.default,
                },
              ]}
            />

            <View style={{ flex: 1, marginLeft: spacing.base }}>
              <View style={styles.badgeRow}>
                <StatusBadge label="VERIFIED PRO" variant="mint" />
                {trainer.isOnlineAvailable ? (
                  <StatusBadge
                    label="Online"
                    variant="slate"
                    icon={<Video size={10} color={colors.secondary} />}
                  />
                ) : null}
              </View>

              <Text style={[typography.h2, { color: colors.text.primary, marginTop: 4 }]}>
                {trainer.name}
              </Text>
              <Text style={[typography.caption, { color: colors.text.muted }]}>
                {trainer.title}
              </Text>

              {/* Rating & Rate */}
              <View style={[styles.metaRow, { marginTop: spacing.xs }]}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text
                  style={[
                    typography.caption,
                    { color: colors.text.primary, fontWeight: '700', marginLeft: 4 },
                  ]}
                >
                  {trainer.rating.toFixed(2)}
                </Text>
                <Text style={[typography.caption, { color: colors.text.subtle, marginLeft: 2 }]}>
                  ({trainer.reviewCount} reviews)
                </Text>

                <Text
                  style={[
                    typography.subtitle1,
                    { color: colors.primary, marginLeft: 'auto', fontWeight: '800' },
                  ]}
                >
                  ${trainer.hourlyRate}
                  <Text style={[typography.caption, { color: colors.text.muted }]}>/session</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Bio & Specialties */}
          <View style={{ paddingHorizontal: spacing.base }}>
            <Text style={[typography.bodyMedium, { color: colors.text.secondary, lineHeight: 22 }]}>
              {trainer.bio}
            </Text>

            <View style={[styles.specialtiesWrap, { marginTop: spacing.md }]}>
              {trainer.specialties.map((spec) => (
                <StatusBadge key={spec} label={spec} variant="amber" />
              ))}
            </View>

            {/* Certifications Card */}
            <View
              style={[
                styles.certCard,
                {
                  backgroundColor: colors.background.elevated,
                  borderColor: colors.border.default,
                  borderRadius: radius.xl,
                  marginTop: spacing.base,
                  padding: spacing.base,
                },
              ]}
            >
              <View style={styles.certHeader}>
                <Award size={16} color={colors.primary} />
                <Text
                  style={[
                    typography.subtitle2,
                    { color: colors.text.primary, marginLeft: 6, fontWeight: '700' },
                  ]}
                >
                  Verified Certifications
                </Text>
              </View>
              <View style={[styles.certList, { marginTop: spacing.sm }]}>
                {trainer.certifications.map((cert) => (
                  <Text
                    key={cert}
                    style={[typography.caption, { color: colors.text.secondary, marginTop: 2 }]}
                  >
                    ✓ {cert}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* Interactive Calendar Strip Section */}
          <View style={{ marginTop: spacing.xl }}>
            <View style={[styles.sectionTitleRow, { paddingHorizontal: spacing.base }]}>
              <Text style={[typography.h3, { color: colors.text.primary }]}>
                Select Session Date
              </Text>
              <View style={styles.timezoneTag}>
                <Clock size={12} color={colors.secondary} />
                <Text
                  style={[
                    typography.caption,
                    { color: colors.secondary, marginLeft: 4, fontWeight: '600' },
                  ]}
                >
                  Live UTC Normalization
                </Text>
              </View>
            </View>

            <HorizontalCalendarStrip
              selectedDate={selectedDate}
              onSelectDate={(date) => setSelectedDate(date)}
              daysCount={14}
            />
          </View>

          {/* Slot Selection Grid */}
          <View style={{ paddingHorizontal: spacing.base, marginTop: spacing.md }}>
            <Text style={[typography.subtitle1, { color: colors.text.primary, marginBottom: 8 }]}>
              Available Slots ({slots.filter((s) => s.status === 'available').length} Open)
            </Text>

            <SlotGrid
              slots={slots}
              selectedSlotId={selectedSlot?.id}
              onSelectSlot={(slot) => selectSlot(slot)}
            />
          </View>
        </ScrollView>

        {/* Floating Bottom Booking Bar */}
        <View
          style={[
            styles.floatingBottomBar,
            {
              backgroundColor: colors.background.elevated,
              borderTopColor: colors.border.default,
              paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.base,
              paddingHorizontal: spacing.base,
              paddingTop: spacing.base,
            },
          ]}
        >
          <View style={styles.summaryCol}>
            <Text style={[typography.caption, { color: colors.text.muted }]}>
              {selectedSlot ? 'Selected Slot' : 'Tap a slot to reserve'}
            </Text>
            <Text style={[typography.subtitle1, { color: colors.text.primary, fontWeight: '700' }]}>
              {selectedSlot ? `${selectedSlot.durationMinutes}m • $${selectedSlot.price}.00` : 'No slot chosen'}
            </Text>
          </View>

          <PrimaryButton
            label={selectedSlot ? 'Review & Pay ' : 'Choose a Slot'}
            size="md"
            variant="primary"
            disabled={!selectedSlot}
            onPress={handleOpenCheckout}
            style={{ minWidth: 160 }}
          />
        </View>

        {/* Bottom Sheet Checkout Modal */}
        <BookingCheckoutSheet
          modalRef={checkoutSheetRef}
          trainer={trainer}
          slot={checkoutSlot}
          onBookingConfirmed={handleConfirmed}
          onDismiss={() => {
            checkoutSheetRef.current?.dismiss();
            setCheckoutSlot(null);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalCanvas: {
    flex: 1,
  },
  navBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 84,
    height: 84,
    borderWidth: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialtiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  certCard: {
    borderWidth: 1,
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certList: {
    paddingLeft: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timezoneTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryCol: {
    flex: 1,
  },
});
