import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../../global/components';
import { formatCurrency, getProfitColor } from '../../../../global/utils';
import type { YahooQuoteDto } from '../../../../global/types';
import { useTheme, spacing, fontSize } from '../../../../global/theme';

interface PriceInfoProps {
  quote: YahooQuoteDto;
}

export const PriceInfo: React.FC<PriceInfoProps> = ({ quote }) => {
  const { colors } = useTheme();
  const changeColor = getProfitColor(quote.regularMarketChangePercent);

  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: colors.text.primary }]}>시세 정보</Text>

      <View style={[styles.currentPrice, { borderBottomColor: colors.border.secondary }]}>
        <Text style={[styles.price, { color: colors.text.primary }]}>
          {formatCurrency(quote.regularMarketPrice, quote.currency)}
        </Text>
        <View style={styles.change}>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {quote.regularMarketChange >= 0 ? '+' : ''}
            {quote.regularMarketChange.toLocaleString()}
          </Text>
          <Text style={[styles.changePercent, { color: changeColor }]}>
            ({quote.regularMarketChangePercent >= 0 ? '+' : ''}
            {quote.regularMarketChangePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>전일 종가</Text>
          <Text style={[styles.value, { color: colors.text.secondary }]}>
            {formatCurrency(quote.regularMarketPreviousClose, quote.currency)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>52주 최고</Text>
          <Text style={[styles.value, { color: colors.text.secondary }]}>
            {formatCurrency(quote.fiftyTwoWeekHigh, quote.currency)}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text.tertiary }]}>52주 최저</Text>
          <Text style={[styles.value, { color: colors.text.secondary }]}>
            {formatCurrency(quote.fiftyTwoWeekLow, quote.currency)}
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
  currentPrice: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },
  price: {
    fontSize: fontSize.display,
    fontWeight: '700',
  },
  change: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  changeText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    marginRight: spacing.sm,
  },
  changePercent: {
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  details: {},
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
});
