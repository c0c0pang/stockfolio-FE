import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../../global/components';
import {
  formatCurrency,
  formatPercent,
  getProfitColor,
} from '../../../../global/utils';
import type { StockResponseDto } from '../../../../global/types';
import { useTheme, spacing, fontSize, radius } from '../../../../global/theme';

interface StockCardProps {
  stock: StockResponseDto;
  onPress: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ stock, onPress }) => {
  const { colors } = useTheme();
  const currentPrice = stock.currentPrice ?? stock.avgPrice;
  const totalValue = stock.quantity * currentPrice;
  const profitColor = getProfitColor(stock.profitPercent);

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text.primary }]}>{stock.name}</Text>
          <Text style={[styles.symbol, { color: colors.text.secondary }]}>{stock.symbol}</Text>
        </View>
        <View style={[
          styles.categoryBadge,
          { backgroundColor: colors.accent.primary + '20' },
        ]}>
          <Text style={[styles.categoryText, { color: colors.accent.primary }]}>
            {stock.category === 'domestic' ? '국내' : '해외'}
          </Text>
        </View>
      </View>

      <View style={styles.priceSection}>
        <Text style={[styles.currentPrice, { color: colors.text.primary }]}>
          {formatCurrency(currentPrice, stock.currency)}
        </Text>
        <Text style={[styles.profitPercent, { color: profitColor }]}>
          {formatPercent(stock.profitPercent)}
        </Text>
      </View>

      <View style={[styles.details, { borderTopColor: colors.border.secondary }]}>
        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>보유</Text>
          <Text style={[styles.value, { color: colors.text.secondary }]}>{stock.quantity}주</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>평가금액</Text>
          <Text style={[styles.value, { color: colors.text.secondary }]}>
            {formatCurrency(totalValue, stock.currency)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  symbol: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  categoryText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  currentPrice: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  profitPercent: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  detailItem: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.xs,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
