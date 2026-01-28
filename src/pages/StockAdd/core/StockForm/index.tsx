import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card, Input, Button } from '../../../../global/components';
import type { YahooSearchResultDto, CreateStockDto } from '../../../../global/types';
import { useTheme, spacing, fontSize, radius } from '../../../../global/theme';

interface StockFormProps {
  selectedStock: YahooSearchResultDto;
  onSubmit: (dto: CreateStockDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const StockForm: React.FC<StockFormProps> = ({
  selectedStock,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { colors } = useTheme();
  const [quantity, setQuantity] = useState('');
  const [avgPrice, setAvgPrice] = useState('');

  const isKoreanStock =
    selectedStock.symbol.endsWith('.KS') ||
    selectedStock.symbol.endsWith('.KQ');
  const category = isKoreanStock ? 'domestic' : 'overseas';
  const currency = isKoreanStock ? 'KRW' : 'USD';

  const handleSubmit = () => {
    const qty = parseInt(quantity, 10);
    const price = parseFloat(avgPrice);

    if (!qty || qty < 1) {
      Alert.alert('오류', '수량을 1개 이상 입력해주세요.');
      return;
    }

    if (!price || price <= 0) {
      Alert.alert('오류', '평균 매수가를 입력해주세요.');
      return;
    }

    onSubmit({
      symbol: selectedStock.symbol,
      name: selectedStock.shortname || selectedStock.longname,
      category,
      quantity: qty,
      avgPrice: price,
      currency,
    });
  };

  return (
    <Card style={styles.card}>
      <View style={[styles.header, { borderBottomColor: colors.border.secondary }]}>
        <Text style={[styles.symbol, { color: colors.accent.primary }]}>{selectedStock.symbol}</Text>
        <Text style={[styles.name, { color: colors.text.secondary }]}>
          {selectedStock.shortname || selectedStock.longname}
        </Text>
        <View style={styles.badges}>
          <View style={[styles.badge, isKoreanStock ? styles.domesticBadge : styles.overseasBadge]}>
            <Text
              style={[
                styles.badgeText,
                { color: isKoreanStock ? colors.accent.secondary : colors.accent.primary },
              ]}>
              {category === 'domestic' ? '국내' : '해외'}
            </Text>
          </View>
          <View style={[styles.currencyBadge, { backgroundColor: colors.background.tertiary }]}>
            <Text style={[styles.currencyText, { color: colors.text.secondary }]}>{currency}</Text>
          </View>
        </View>
      </View>

      <Input
        label="수량"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="number-pad"
        placeholder="보유 수량 입력"
      />

      <Input
        label={`평균 매수가 (${currency})`}
        value={avgPrice}
        onChangeText={setAvgPrice}
        keyboardType="decimal-pad"
        placeholder="평균 매수가 입력"
      />

      <View style={styles.buttons}>
        <Button
          title="취소"
          variant="secondary"
          onPress={onCancel}
          style={styles.button}
        />
        <Button
          title="추가"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.button}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },
  symbol: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  badges: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  domesticBadge: {
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  overseasBadge: {
    backgroundColor: 'rgba(0, 208, 156, 0.2)',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  currencyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  currencyText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
