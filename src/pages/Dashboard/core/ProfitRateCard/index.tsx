import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatPercent, formatCurrency, getProfitColor } from '../../../../global/utils';
import { useTheme, spacing, fontSize, radius } from '../../../../global/theme';

interface ProfitRateCardProps {
  profitPercent: number | null;
  profitAmount?: number;
  exchangeRate?: number;
}

export const ProfitRateCard: React.FC<ProfitRateCardProps> = ({
  profitPercent,
  profitAmount,
  exchangeRate,
}) => {
  const { colors } = useTheme();
  const color = getProfitColor(profitPercent);
  const isPositive = (profitPercent ?? 0) >= 0;

  // 달러 환산 금액
  const usdAmount = profitAmount !== undefined && exchangeRate
    ? profitAmount / exchangeRate
    : null;

  return (
    <View style={[styles.card, { backgroundColor: colors.background.tertiary, borderColor: colors.border.primary }]}>
      <View style={styles.row}>
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
              <Icon
                name={isPositive ? 'trending-up' : 'trending-down'}
                size={16}
                color={color}
              />
            </View>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              총 수익률
            </Text>
          </View>
          <Text style={[styles.value, { color }]}>
            {formatPercent(profitPercent)}
          </Text>
        </View>
        {profitAmount !== undefined && (
          <View style={styles.section}>
            <Text style={[styles.label, styles.labelRight, { color: colors.text.secondary }]}>
              평가 손익
            </Text>
            <Text style={[styles.amount, { color }]}>
              {profitAmount >= 0 ? '+' : ''}
              {formatCurrency(profitAmount, 'KRW')}
            </Text>
            {usdAmount !== null && (
              <Text style={[styles.usdAmount, { color: colors.text.tertiary }]}>
                ≈ {usdAmount >= 0 ? '+' : ''}{formatCurrency(usdAmount, 'USD')}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
  },
  section: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  label: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  labelRight: {
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
  },
  amount: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  usdAmount: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
