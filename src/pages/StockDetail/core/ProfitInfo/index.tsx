import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../../global/components';
import {
  formatCurrency,
  formatPercent,
  getProfitColor,
} from '../../../../global/utils';
import type { StockResponseDto } from '../../../../global/types';
import { useTheme, spacing, fontSize } from '../../../../global/theme';

interface ProfitInfoProps {
  stock: StockResponseDto;
}

export const ProfitInfo: React.FC<ProfitInfoProps> = ({ stock }) => {
  const { colors } = useTheme();
  const currentPrice = stock.currentPrice ?? stock.avgPrice;
  const totalCost = stock.quantity * stock.avgPrice;
  const totalValue = stock.quantity * currentPrice;
  const profitAmount = totalValue - totalCost;
  const profitColor = getProfitColor(stock.profitPercent);

  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: colors.text.primary }]}>보유 현황</Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text.tertiary }]}>보유 수량</Text>
        <Text style={[styles.value, { color: colors.text.secondary }]}>{stock.quantity}주</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text.tertiary }]}>평균 매수가</Text>
        <Text style={[styles.value, { color: colors.text.secondary }]}>
          {formatCurrency(stock.avgPrice, stock.currency)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text.tertiary }]}>매수 금액</Text>
        <Text style={[styles.value, { color: colors.text.secondary }]}>
          {formatCurrency(totalCost, stock.currency)}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text.tertiary }]}>평가 금액</Text>
        <Text style={[styles.value, { color: colors.text.secondary }]}>
          {formatCurrency(totalValue, stock.currency)}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border.secondary }]} />

      <View style={styles.profitSection}>
        <View style={styles.profitItem}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>평가 손익</Text>
          <Text style={[styles.profitValue, { color: profitColor }]}>
            {profitAmount >= 0 ? '+' : ''}
            {formatCurrency(profitAmount, stock.currency)}
          </Text>
        </View>

        <View style={styles.profitItem}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>수익률</Text>
          <Text style={[styles.profitPercent, { color: profitColor }]}>
            {formatPercent(stock.profitPercent)}
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
  title: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  profitSection: {
    flexDirection: 'row',
  },
  profitItem: {
    flex: 1,
  },
  profitValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  profitPercent: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});
