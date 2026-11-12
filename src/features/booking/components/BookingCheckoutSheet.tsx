import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  ShieldCheck,
  Video,
  X,
} from 'lucide-react-native';
import { BookingSession, BookingSlot, Trainer } from '@/types';
import { useTheme } from '@/theme';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { HapticButton } from '@/components/buttons/HapticButton';
import { StatusBadge } from '@/components/feedback/StatusBadge';
import { formatSlotTimeRange } from '../utils/timezone';
import { useBookingSession } from '../hooks/useBookingSession';

export interface BookingCheckoutSheetProps {
  modalRef: React.RefObject<BottomSheetModal>;
  trainer: Trainer | null;
  slot: BookingSlot | null;
  onBookingConfirmed: (booking: BookingSession) => void;
  onDismiss: () => void;
}

export function BookingCheckoutSheet({
  modalRef,
  trainer,
  slot,
  onBookingConfirmed,
  onDismiss,
}: BookingCheckoutSheetProps) {
  const { colors } = useTheme();
  const snapPoints = useMemo(() => ['72%', '92%'], []);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.7}
    />
  );

  if (!trainer || !slot) {
    return null;
  }

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.background.elevated }}
      handleIndicatorStyle={{ backgroundColor: colors.border.default, width: 44 }}
      onDismiss={onDismiss}
      enablePanDownToClose
    >
      <CheckoutSheetContent
        trainer={trainer}
        slot={slot}
        onBookingConfirmed={onBookingConfirmed}
        onDismiss={onDismiss}
      />
    </BottomSheetModal>
  );
}

interface ContentProps {
  trainer: Trainer;
  slot: BookingSlot;
  onBookingConfirmed: (booking: BookingSession) => void;
  onDismiss: () => void;
}

function CheckoutSheetContent({
  trainer,
  slot,
  onBookingConfirmed,
  onDismiss,
}: ContentProps) {
  const { colors, spacing, radius, typography } = useTheme();

  const {
    formattedCountdown,
    isLowTime,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    confirmedBooking,
    error,
    confirmPayment,
  } = useBookingSession({
    trainer,
    slot,
    onSuccess: (booking) => {
      onBookingConfirmed(booking);
    },
  });

  const formattedTimeRange = formatSlotTimeRange(slot.startTimeUtc, slot.endTimeUtc);
  const formattedDate = new Date(slot.startTimeUtc).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // Confirmed Booking Screen
  if (confirmedBooking) {
    return (
      <View style={[styles.container, { padding: spacing.xl }]}>
        <View style={styles.successIconWrapper}>
          <View
            style={[
              styles.successCircle,
              { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: colors.secondary },
            ]}
          >
            <CheckCircle2 size={54} color={colors.secondary} strokeWidth={2.4} />
          </View>
        </View>

        <Text
          style={[
            typography.h2,
            { color: colors.text.primary, textAlign: 'center', marginTop: spacing.base },
          ]}
        >
          Session Booked!
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            { color: colors.text.muted, textAlign: 'center', marginTop: spacing.xs },
          ]}
        >
          Your workout session with {trainer.name} is confirmed.
        </Text>

        {/* Confirmation Details Card */}
        <View
          style={[
            styles.detailsCard,
            {
              backgroundColor: colors.background.sunken,
              borderRadius: radius.xl,
              marginTop: spacing.xl,
              padding: spacing.base,
              borderColor: colors.border.default,
            },
          ]}
        >
          <View style={styles.detailRow}>
            <Calendar size={16} color={colors.primary} />
            <Text style={[typography.caption, { color: colors.text.muted, marginLeft: 8 }]}>
              Date & Time:
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.text.primary, marginLeft: 'auto', fontWeight: '700' },
              ]}
            >
              {formattedDate} • {formattedTimeRange}
            </Text>
          </View>

          <View style={[styles.detailRow, { marginTop: spacing.sm }]}>
            <Video size={16} color={colors.secondary} />
            <Text style={[typography.caption, { color: colors.text.muted, marginLeft: 8 }]}>
              Session Format:
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.secondary, marginLeft: 'auto', fontWeight: '700' },
              ]}
            >
              1-on-1 HD Video Link
            </Text>
          </View>

          <View style={[styles.detailRow, { marginTop: spacing.sm }]}>
            <ShieldCheck size={16} color="#06B6D4" />
            <Text style={[typography.caption, { color: colors.text.muted, marginLeft: 8 }]}>
              Payment Status:
            </Text>
            <Text
              style={[
                typography.caption,
                { color: colors.text.primary, marginLeft: 'auto', fontWeight: '700' },
              ]}
            >
              ${slot.price}.00 ( Pay)
            </Text>
          </View>
        </View>

        <View style={{ marginTop: spacing['2xl'] }}>
          <PrimaryButton
            label="Done"
            variant="secondary"
            size="lg"
            onPress={onDismiss}
            fullWidth
          />
        </View>
      </View>
    );
  }

  // Active Checkout Order Summary
  return (
    <BottomSheetScrollView
      contentContainerStyle={[styles.container, { padding: spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.sheetHeader}>
        <View>
          <Text style={[typography.h3, { color: colors.text.primary }]}>
            Checkout & Confirmation
          </Text>
          <Text style={[typography.caption, { color: colors.text.muted, marginTop: 2 }]}>
            1-Tap instant slot confirmation
          </Text>
        </View>

        <HapticButton onPress={onDismiss} style={styles.closeBtn}>
          <X size={20} color={colors.text.muted} />
        </HapticButton>
      </View>

      {/* Optimistic Lock Timer Badge */}
      <View
        style={[
          styles.lockBanner,
          {
            backgroundColor: isLowTime
              ? 'rgba(239, 68, 68, 0.15)'
              : 'rgba(255, 107, 0, 0.12)',
            borderColor: isLowTime ? colors.status.error : colors.primary,
            borderRadius: radius.md,
            marginTop: spacing.md,
            padding: spacing.sm + 2,
          },
        ]}
      >
        <Lock size={14} color={isLowTime ? colors.status.error : colors.primary} />
        <Text
          style={[
            typography.caption,
            {
              color: isLowTime ? colors.status.error : colors.primary,
              marginLeft: 6,
              fontWeight: '600',
              flex: 1,
            },
          ]}
        >
          Slot reserved for you: <Text style={{ fontWeight: '800' }}>{formattedCountdown}</Text>
        </Text>
        <StatusBadge
          label="Lock Active"
          variant={isLowTime ? 'danger' : 'amber'}
        />
      </View>

      {/* Trainer & Session Summary */}
      <View
        style={[
          styles.trainerSummaryBox,
          {
            backgroundColor: colors.background.sunken,
            borderRadius: radius.xl,
            borderColor: colors.border.default,
            marginTop: spacing.md,
            padding: spacing.base,
          },
        ]}
      >
        <View style={styles.trainerRow}>
          <Image
            source={{ uri: trainer.avatar }}
            style={[styles.trainerAvatar, { borderRadius: radius.lg }]}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={[typography.subtitle1, { color: colors.text.primary }]}>
              {trainer.name}
            </Text>
            <Text style={[typography.caption, { color: colors.text.muted }]}>
              {trainer.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Clock size={12} color={colors.secondary} />
              <Text
                style={[
                  typography.caption,
                  { color: colors.secondary, fontWeight: '700', marginLeft: 4 },
                ]}
              >
                {formattedDate} • {formattedTimeRange}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.border.subtle, marginVertical: spacing.md },
          ]}
        />

        {/* Pricing Breakdown */}
        <View style={styles.priceRow}>
          <Text style={[typography.caption, { color: colors.text.muted }]}>
            Session Rate ({slot.durationMinutes} min)
          </Text>
          <Text style={[typography.caption, { color: colors.text.primary, fontWeight: '600' }]}>
            ${slot.price}.00
          </Text>
        </View>

        <View style={[styles.priceRow, { marginTop: 6 }]}>
          <Text style={[typography.caption, { color: colors.text.muted }]}>
            KineticFit Marketplace Fee
          </Text>
          <Text style={[typography.caption, { color: colors.secondary, fontWeight: '700' }]}>
            $0.00 (Waived)
          </Text>
        </View>

        <View style={[styles.priceRow, { marginTop: spacing.sm, paddingTop: spacing.xs }]}>
          <Text style={[typography.subtitle2, { color: colors.text.primary, fontWeight: '700' }]}>
            Total Due:
          </Text>
          <Text style={[typography.h3, { color: colors.primary, fontWeight: '800' }]}>
            ${slot.price}.00
          </Text>
        </View>
      </View>

      {/* Payment Method Selector */}
      <View style={{ marginTop: spacing.base }}>
        <Text style={[typography.subtitle2, { color: colors.text.primary, marginBottom: 8 }]}>
          Payment Method
        </Text>

        <View style={styles.paymentMethodsRow}>
          {/* Apple Pay Option */}
          <Pressable
            onPress={() => setPaymentMethod('apple_pay')}
            style={[
              styles.paymentOption,
              {
                backgroundColor:
                  paymentMethod === 'apple_pay'
                    ? colors.background.highest
                    : colors.background.sunken,
                borderColor:
                  paymentMethod === 'apple_pay' ? colors.primary : colors.border.default,
                borderRadius: radius.lg,
              },
            ]}
          >
            <View style={styles.applePayBadge}>
              <Text style={[styles.appleIconText, { color: '#FFFFFF' }]}></Text>
              <Text style={[typography.subtitle2, { color: '#FFFFFF', marginLeft: 4, fontWeight: '700' }]}>
                Pay
              </Text>
            </View>
            <Text
              style={[
                typography.caption,
                {
                  color: paymentMethod === 'apple_pay' ? colors.primary : colors.text.muted,
                  marginTop: 4,
                  fontWeight: '600',
                },
              ]}
            >
              1-Tap Fast Pay
            </Text>
          </Pressable>

          {/* Credit Card Option */}
          <Pressable
            onPress={() => setPaymentMethod('credit_card')}
            style={[
              styles.paymentOption,
              {
                backgroundColor:
                  paymentMethod === 'credit_card'
                    ? colors.background.highest
                    : colors.background.sunken,
                borderColor:
                  paymentMethod === 'credit_card' ? colors.primary : colors.border.default,
                borderRadius: radius.lg,
              },
            ]}
          >
            <CreditCard
              size={22}
              color={paymentMethod === 'credit_card' ? colors.primary : colors.text.muted}
            />
            <Text
              style={[
                typography.caption,
                {
                  color: paymentMethod === 'credit_card' ? colors.primary : colors.text.muted,
                  marginTop: 4,
                  fontWeight: '600',
                },
              ]}
            >
              •••• 4242
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Error Message */}
      {error ? (
        <Text
          style={[
            typography.caption,
            { color: colors.status.error, textAlign: 'center', marginTop: spacing.sm },
          ]}
        >
          {error}
        </Text>
      ) : null}

      {/* CTA Button */}
      <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
        {paymentMethod === 'apple_pay' ? (
          <HapticButton
            onPress={confirmPayment}
            disabled={isProcessing}
            style={[
              styles.applePayButton,
              { borderRadius: radius.xl, backgroundColor: '#000000' },
            ]}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <View style={styles.applePayContent}>
                <Text style={styles.applePayLogoText}>Pay</Text>
                <Text style={styles.applePaySubtext}>— Pay ${slot.price}.00</Text>
              </View>
            )}
          </HapticButton>
        ) : (
          <PrimaryButton
            label={`Pay $${slot.price}.00 with Card`}
            size="lg"
            variant="primary"
            isLoading={isProcessing}
            onPress={confirmPayment}
            fullWidth
          />
        )}

        <Text
          style={[
            typography.caption,
            { color: colors.text.subtle, textAlign: 'center', marginTop: 8 },
          ]}
        >
          🔒 Encrypted 256-bit payment • Free cancellation up to 2 hours before
        </Text>
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  trainerSummaryBox: {
    borderWidth: 1,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerAvatar: {
    width: 52,
    height: 52,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applePayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appleIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  applePayButton: {
    height: 56,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  applePayContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applePayLogoText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  applePaySubtext: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  successIconWrapper: {
    alignItems: 'center',
    marginTop: 16,
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    borderWidth: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
