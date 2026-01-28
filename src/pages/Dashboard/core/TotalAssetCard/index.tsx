import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatCurrency } from '../../../../global/utils';
import { useTheme, spacing, fontSize, radius } from '../../../../global/theme';

interface TotalAssetCardProps {
  totalAsset: number;
  exchangeRate?: number;
}

export const TotalAssetCard: React.FC<TotalAssetCardProps> = ({
  totalAsset,
  exchangeRate,
}) => {
  const { colors, isDark } = useTheme();

  // 달러 환산 금액 계산
  const usdAmount = exchangeRate ? totalAsset / exchangeRate : null;

  // 다크모드일 때 퍼플 그라데이션 사용
  const gradientColors = isDark
    ? ['#7C3AED', '#4F46E5']
    : Array.from(colors.gradient.primary);

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* 데코 요소들 */}
        <View style={styles.decorCircle} />
        <View style={styles.decorCircle2} />
        <View style={styles.decorCircle3} />

        <View style={styles.content}>
          <View style={styles.labelRow}>
            <View style={styles.iconContainer}>
              <Icon name="wallet-outline" size={16} color="rgba(255,255,255,0.9)" />
            </View>
            <Text style={styles.label}>총 자산</Text>
          </View>
          <Text style={styles.value}>
            {formatCurrency(totalAsset, 'KRW')}
          </Text>
          {usdAmount !== null && (
            <Text style={styles.usdValue}>
              ≈ {formatCurrency(usdAmount, 'USD')}
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    // 글로우 효과
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  card: {
    position: 'relative',
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  content: {
    zIndex: 10,
    position: 'relative',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  value: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  usdValue: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
  },
  decorCircle: {
    position: 'absolute',
    right: -50,
    top: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorCircle2: {
    position: 'absolute',
    right: 40,
    bottom: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorCircle3: {
    position: 'absolute',
    left: -30,
    bottom: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
});
