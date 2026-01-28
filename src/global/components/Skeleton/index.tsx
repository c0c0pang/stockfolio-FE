import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme, spacing, radius } from '../../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: customBorderRadius = radius.sm,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  const baseColor = isDark ? colors.background.secondary : '#E5E7EB';

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as number | `${number}%`,
          height,
          borderRadius: customBorderRadius,
          backgroundColor: baseColor,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

// ===== Dashboard Skeletons =====

// TotalAssetCard 스켈레톤
export const TotalAssetCardSkeleton: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <View style={[styles.totalAssetCard, { backgroundColor: isDark ? '#7C3AED' : '#8B5CF6' }]}>
      <View style={styles.totalAssetContent}>
        {/* labelRow: iconContainer + label */}
        <View style={styles.totalAssetLabelRow}>
          <Skeleton width={28} height={28} borderRadius={14} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <Skeleton width={45} height={14} style={{ marginLeft: spacing.sm, backgroundColor: 'rgba(255,255,255,0.3)' }} />
        </View>
        {/* value: xxxl font size */}
        <Skeleton width={200} height={36} style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
        {/* usdValue */}
        <Skeleton width={120} height={18} style={{ marginTop: spacing.xs, backgroundColor: 'rgba(255,255,255,0.2)' }} />
      </View>
    </View>
  );
};

// ExchangeRateCard 스켈레톤
export const ExchangeRateCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.exchangeRateCard, { backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }]}>
      <View style={styles.exchangeRateContainer}>
        {/* leftSection: iconContainer + textContainer */}
        <View style={styles.exchangeRateLeft}>
          <Skeleton width={36} height={36} borderRadius={18} />
          <View style={styles.exchangeRateTextContainer}>
            <Skeleton width={80} height={12} style={{ marginBottom: 2 }} />
            <Skeleton width={110} height={18} />
          </View>
        </View>
        {/* updated time */}
        <Skeleton width={70} height={12} />
      </View>
    </View>
  );
};

// ProfitRateCard 스켈레톤
export const ProfitRateCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.profitRateCard, { backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }]}>
      <View style={styles.profitRateRow}>
        {/* Left section: 총 수익률 */}
        <View style={styles.profitRateSection}>
          <View style={styles.profitRateLabelRow}>
            <Skeleton width={28} height={28} borderRadius={14} />
            <Skeleton width={55} height={12} style={{ marginLeft: spacing.sm }} />
          </View>
          <Skeleton width={90} height={28} />
        </View>
        {/* Right section: 평가 손익 */}
        <View style={styles.profitRateSection}>
          <Skeleton width={55} height={12} style={{ marginBottom: spacing.sm }} />
          <Skeleton width={120} height={22} style={{ marginBottom: spacing.xs }} />
          <Skeleton width={80} height={14} />
        </View>
      </View>
    </View>
  );
};

// AllocationChart 스켈레톤
export const AllocationChartSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.allocationCard, { backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }]}>
      {/* titleRow: titleIcon + title */}
      <View style={styles.allocationTitleRow}>
        <Skeleton width={28} height={28} borderRadius={14} />
        <Skeleton width={60} height={18} style={{ marginLeft: spacing.sm }} />
      </View>
      {/* chartContainer: chartWrapper + legend */}
      <View style={styles.allocationChartContainer}>
        {/* Donut chart */}
        <Skeleton width={160} height={160} borderRadius={80} />
        {/* Legend */}
        <View style={styles.allocationLegend}>
          {[1, 2, 3].map((_, index) => (
            <View key={index} style={styles.allocationLegendItem}>
              <Skeleton width={10} height={10} borderRadius={5} />
              <Skeleton width={40} height={12} style={{ marginLeft: spacing.sm, flex: 1 }} />
              <Skeleton width={35} height={12} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// ===== Portfolio Skeletons =====

// StockCard 스켈레톤
export const StockCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.stockCard, { backgroundColor: colors.background.card, borderColor: colors.border.secondary }]}>
      {/* header: info(name, symbol) + categoryBadge */}
      <View style={styles.stockCardHeader}>
        <View style={styles.stockCardInfo}>
          <Skeleton width={100} height={18} style={{ marginBottom: spacing.xs }} />
          <Skeleton width={60} height={12} />
        </View>
        <Skeleton width={36} height={24} borderRadius={radius.sm} />
      </View>
      {/* priceSection: currentPrice + profitPercent */}
      <View style={styles.stockCardPriceSection}>
        <Skeleton width={130} height={26} style={{ marginRight: spacing.sm }} />
        <Skeleton width={55} height={18} />
      </View>
      {/* details: 보유 + 평가금액 */}
      <View style={[styles.stockCardDetails, { borderTopColor: colors.border.secondary }]}>
        <View style={styles.stockCardDetailItem}>
          <Skeleton width={24} height={12} style={{ marginBottom: spacing.xs }} />
          <Skeleton width={45} height={14} />
        </View>
        <View style={styles.stockCardDetailItem}>
          <Skeleton width={50} height={12} style={{ marginBottom: spacing.xs }} />
          <Skeleton width={90} height={14} />
        </View>
      </View>
    </View>
  );
};

// ===== News Skeletons =====

// NewsCard 스켈레톤
export const NewsCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.newsCard, { backgroundColor: colors.background.card }]}>
      <View style={styles.newsContent}>
        {/* header: sourceTag + time */}
        <View style={styles.newsHeader}>
          <Skeleton width={36} height={18} borderRadius={radius.sm} />
          <Skeleton width={45} height={12} />
        </View>
        {/* title (2 lines) - fontSize.md(16), lineHeight 22 */}
        <Skeleton width="100%" height={16} style={{ marginBottom: 6 }} />
        <Skeleton width="75%" height={16} style={{ marginBottom: spacing.xs }} />
        {/* summary (2 lines) - fontSize.sm(14), lineHeight 20 */}
        <Skeleton width="100%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="85%" height={14} style={{ marginBottom: spacing.sm }} />
        {/* source */}
        <Skeleton width={55} height={12} />
      </View>
      {/* image - marginLeft on image, not marginRight on content */}
      <Skeleton width={80} height={80} borderRadius={radius.sm} style={{ marginLeft: spacing.md }} />
    </View>
  );
};

// ===== Glossary Skeletons =====

// TermCard 스켈레톤
export const TermCardSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.termCard, { backgroundColor: colors.background.secondary, borderColor: colors.border.primary }]}>
      {/* header: termContainer + categoryBadge */}
      <View style={styles.termCardHeader}>
        <View style={styles.termCardTermContainer}>
          <Skeleton width={75} height={18} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={14} />
        </View>
        <Skeleton width={45} height={22} borderRadius={radius.sm} />
      </View>
      {/* definition (2 lines) */}
      <Skeleton width="100%" height={14} style={{ marginBottom: 4 }} />
      <Skeleton width="65%" height={14} />
      {/* footer chevron */}
      <View style={styles.termCardFooter}>
        <Skeleton width={18} height={18} borderRadius={9} />
      </View>
    </View>
  );
};

// ===== StockDetail Skeletons =====

export const StockDetailSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View>
      {/* Header: categoryBadge + name + symbol */}
      <View style={styles.stockDetailHeader}>
        <Skeleton width={40} height={24} borderRadius={radius.xs} style={{ marginBottom: spacing.sm }} />
        <Skeleton width={140} height={30} style={{ marginBottom: spacing.xs }} />
        <Skeleton width={70} height={14} />
      </View>

      {/* PriceInfo Card */}
      <View style={[styles.stockDetailCard, { backgroundColor: colors.background.card, borderColor: colors.border.secondary }]}>
        <Skeleton width={60} height={12} style={{ marginBottom: spacing.sm }} />
        <Skeleton width={150} height={28} style={{ marginBottom: spacing.xs }} />
        <Skeleton width={90} height={16} />
      </View>

      {/* ProfitInfo Card */}
      <View style={[styles.stockDetailCard, { backgroundColor: colors.background.card, borderColor: colors.border.secondary }]}>
        <View style={styles.stockDetailRow}>
          <View style={styles.stockDetailColumn}>
            <Skeleton width={50} height={12} style={{ marginBottom: spacing.sm }} />
            <Skeleton width={85} height={22} style={{ marginBottom: spacing.xs }} />
            <Skeleton width={60} height={14} />
          </View>
          <View style={styles.stockDetailColumn}>
            <Skeleton width={50} height={12} style={{ marginBottom: spacing.sm }} />
            <Skeleton width={85} height={22} style={{ marginBottom: spacing.xs }} />
            <Skeleton width={60} height={14} />
          </View>
        </View>
      </View>

      {/* Button */}
      <Skeleton width="100%" height={48} borderRadius={radius.md} style={{ marginTop: spacing.sm }} />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },

  // TotalAssetCard
  totalAssetCard: {
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  totalAssetContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  totalAssetLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  // ExchangeRateCard
  exchangeRateCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  exchangeRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exchangeRateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exchangeRateTextContainer: {
    marginLeft: spacing.sm,
  },

  // ProfitRateCard
  profitRateCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  profitRateRow: {
    flexDirection: 'row',
  },
  profitRateSection: {
    flex: 1,
  },
  profitRateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  // AllocationChart
  allocationCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  allocationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  allocationChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allocationLegend: {
    flex: 1,
    marginLeft: spacing.md,
  },
  allocationLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  // StockCard
  stockCard: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  stockCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  stockCardInfo: {
    flex: 1,
  },
  stockCardPriceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  stockCardDetails: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  stockCardDetailItem: {
    flex: 1,
  },

  // NewsCard
  newsCard: {
    flexDirection: 'row',
    borderRadius: radius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  newsContent: {
    flex: 1,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  // TermCard
  termCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  termCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  termCardTermContainer: {
    flex: 1,
  },
  termCardFooter: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },

  // StockDetail
  stockDetailHeader: {
    marginBottom: spacing.xl,
  },
  stockDetailCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  stockDetailRow: {
    flexDirection: 'row',
  },
  stockDetailColumn: {
    flex: 1,
  },
});
